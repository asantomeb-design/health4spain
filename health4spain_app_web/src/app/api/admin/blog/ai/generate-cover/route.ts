import { NextRequest, NextResponse } from 'next/server';
import { validateAdminAuth } from '@/lib/auth';
import { createServerSupabaseClient } from '@/lib/supabase';
import { getAiBlogConfig, getOpenAIClient, slugify } from '@/lib/ai/openai-blog';

export const maxDuration = 120;

const COVERS_BUCKET = 'blog-images';
const COVERS_FOLDER = 'ai-covers';

interface GenerateCoverBody {
  title: string;
  excerpt?: string;
  prompt_extra?: string;
  size?: string; // override opcional ej. "1024x1024", "1792x1024"
}

export async function POST(request: NextRequest) {
  const auth = await validateAdminAuth(request);
  if (auth.error) return auth.error;

  let body: GenerateCoverBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'JSON inválido' }, { status: 400 });
  }

  if (!body.title || typeof body.title !== 'string') {
    return NextResponse.json(
      { success: false, error: 'Falta el campo "title"' },
      { status: 400 }
    );
  }

  try {
    const config = await getAiBlogConfig();
    const openai = getOpenAIClient();
    type ImageSize =
      | 'auto'
      | '1024x1024'
      | '1792x1024'
      | '1024x1792'
      | '1536x1024'
      | '1024x1536'
      | '256x256'
      | '512x512';
    const ALLOWED_SIZES: ImageSize[] = [
      'auto',
      '1024x1024',
      '1792x1024',
      '1024x1792',
      '1536x1024',
      '1024x1536',
      '256x256',
      '512x512',
    ];
    const requested = body.size || config.image_size || '1792x1024';
    const size: ImageSize = (ALLOWED_SIZES as readonly string[]).includes(requested)
      ? (requested as ImageSize)
      : '1792x1024';

    const promptParts: string[] = [
      `Editorial cover image for an article titled: "${body.title.trim()}"`,
    ];
    if (body.excerpt) {
      promptParts.push(`Article summary: ${body.excerpt.trim().slice(0, 400)}`);
    }
    promptParts.push(`Style: ${config.image_style}`);
    if (body.prompt_extra) {
      promptParts.push(`Additional direction: ${body.prompt_extra.trim().slice(0, 300)}`);
    }
    promptParts.push(
      'Avoid: text overlays, watermarks, brand logos, distorted hands, AI artifacts, cliché stock photo aesthetics, flags or postcard monuments unless contextually essential.'
    );
    const prompt = promptParts.join('. ');

    let b64: string | null = null;

    try {
      const result = await openai.images.generate({
        model: config.model_image,
        prompt,
        size,
        n: 1,
      });

      const first = result.data?.[0];
      if (first?.b64_json) {
        b64 = first.b64_json;
      } else if (first?.url) {
        // Algunos modelos devuelven URL en lugar de base64; lo descargamos
        const imgResp = await fetch(first.url);
        if (!imgResp.ok) throw new Error(`No se pudo descargar imagen del modelo (${imgResp.status})`);
        const buf = Buffer.from(await imgResp.arrayBuffer());
        b64 = buf.toString('base64');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'desconocido';
      return NextResponse.json(
        { success: false, error: `Error generando imagen: ${msg}` },
        { status: 502 }
      );
    }

    if (!b64) {
      return NextResponse.json(
        { success: false, error: 'El modelo de imagen no devolvió contenido' },
        { status: 502 }
      );
    }

    const buffer = Buffer.from(b64, 'base64');

    const supabase = createServerSupabaseClient();
    const slugBase = slugify(body.title) || 'cover';
    const fileName = `${COVERS_FOLDER}/${Date.now()}-${slugBase.slice(0, 60)}.png`;

    const { error: uploadError } = await supabase.storage
      .from(COVERS_BUCKET)
      .upload(fileName, buffer, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Error subiendo portada IA:', uploadError);
      return NextResponse.json(
        { success: false, error: `Error al subir la imagen: ${uploadError.message}` },
        { status: 500 }
      );
    }

    const { data: publicUrl } = supabase.storage.from(COVERS_BUCKET).getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl.publicUrl,
        path: fileName,
        bucket: COVERS_BUCKET,
        prompt,
        size,
      },
    });
  } catch (err: unknown) {
    console.error('Error generate-cover:', err);
    const message = err instanceof Error ? err.message : 'Error interno del servidor';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
