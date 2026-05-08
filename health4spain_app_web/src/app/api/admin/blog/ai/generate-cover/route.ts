import { NextRequest, NextResponse } from 'next/server';
import { validateAdminAuth } from '@/lib/auth';
import { createServerSupabaseClient } from '@/lib/supabase';
import { getAiBlogConfig, getOpenAIClient, slugify } from '@/lib/ai/openai-blog';

export const maxDuration = 120;

const COVERS_BUCKET = 'blog-images';
const COVERS_FOLDER = 'ai-covers';

/** Los modelos gpt-image-* solo admiten auto | 1024² | 1536×1024 | 1024×1536 (no 1792×1024). */
function normalizeImageSizeForModel(
  model: string,
  requested: string
): 'auto' | '1024x1024' | '1536x1024' | '1024x1536' | '1792x1024' | '1024x1792' | '256x256' | '512x512' {
  const m = model.toLowerCase();
  const req = (requested || '').trim() || '1792x1024';

  if (m.includes('gpt-image')) {
    if (req === 'auto') return 'auto';
    if (req === '1024x1024' || req === '1536x1024' || req === '1024x1536') return req;
    if (req === '1792x1024') return '1536x1024';
    if (req === '1024x1792') return '1024x1536';
    return 'auto';
  }

  if (m.includes('dall-e-3') || m.includes('dalle-3')) {
    if (req === 'auto' || req === '1024x1024' || req === '1792x1024' || req === '1024x1792') return req;
    if (req === '1536x1024') return '1792x1024';
    if (req === '1024x1536') return '1024x1792';
    return '1792x1024';
  }

  // dall-e-2 u otros
  if (req === '256x256' || req === '512x512' || req === '1024x1024') return req;
  return '1024x1024';
}

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
    const requestedRaw = body.size || config.image_size || '1792x1024';
    let size = normalizeImageSizeForModel(config.model_image, requestedRaw);

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

    const runGenerate = async (sz: typeof size) => {
      const baseParams = {
        model: config.model_image,
        prompt,
        size: sz,
        n: 1 as const,
      };
      const m = config.model_image.toLowerCase();
      const withFormat =
        m.includes('dall-e-3') || m.includes('dalle-3') || m.includes('dall-e-2')
          ? { ...baseParams, response_format: 'b64_json' as const }
          : baseParams;
      return openai.images.generate(withFormat);
    };

    try {
      let result = await runGenerate(size);
      const readB64 = async (res: Awaited<ReturnType<typeof runGenerate>>) => {
        const first = res.data?.[0];
        if (first?.b64_json) return first.b64_json;
        if (first?.url) {
          const imgResp = await fetch(first.url);
          if (!imgResp.ok) throw new Error(`No se pudo descargar imagen del modelo (${imgResp.status})`);
          const buf = Buffer.from(await imgResp.arrayBuffer());
          return buf.toString('base64');
        }
        return null;
      };
      b64 = await readB64(result);

      // Si el tamaño no era válido para el modelo, OpenAI falla: reintentamos con "auto"
      if (!b64 && size !== 'auto') {
        size = 'auto';
        result = await runGenerate(size);
        b64 = await readB64(result);
      }
    } catch (err: unknown) {
      if (size !== 'auto') {
        try {
          size = 'auto';
          const result = await runGenerate(size);
          const first = result.data?.[0];
          if (first?.b64_json) b64 = first.b64_json;
          else if (first?.url) {
            const imgResp = await fetch(first.url);
            if (imgResp.ok) {
              const buf = Buffer.from(await imgResp.arrayBuffer());
              b64 = buf.toString('base64');
            }
          }
        } catch {
          /* fall through */
        }
      }
      if (!b64) {
        const msg = err instanceof Error ? err.message : 'desconocido';
        return NextResponse.json(
          {
            success: false,
            error: `Error generando imagen: ${msg}. Si usas un modelo gpt-image, en Config IA el tamaño debe ser auto, 1024×1024, 1536×1024 o 1024×1536 (no 1792×1024).`,
          },
          { status: 502 }
        );
      }
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
