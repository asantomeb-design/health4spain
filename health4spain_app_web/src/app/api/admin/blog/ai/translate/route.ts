import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, handleSupabaseError } from '@/lib/supabase';
import { validateAdminAuth } from '@/lib/auth';
import {
  ensureUniqueSlug,
  extractJson,
  getAiBlogConfig,
  getOpenAIClient,
  isSupportedCategory,
  isSupportedLang,
  LANG_NAMES,
  safeChatCompletion,
  sanitizeAIHtml,
  slugify,
  SUPPORTED_LANGS,
  type SupportedLang,
} from '@/lib/ai/openai-blog';
import type { BlogPost } from '@/lib/types';

export const maxDuration = 300;

interface TranslateBody {
  source_post_id?: string;
  source_slug?: string;
  source_lang?: SupportedLang;
  target_languages: SupportedLang[];
}

interface TranslatedDoc {
  title: string;
  slug: string;
  excerpt: string;
  meta_title: string;
  meta_description: string;
  content_html: string;
  tags: string[];
  sources: Array<{ title?: string; url?: string }>;
}

export async function POST(request: NextRequest) {
  const auth = await validateAdminAuth(request);
  if (auth.error) return auth.error;

  let body: TranslateBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'JSON inválido' }, { status: 400 });
  }

  if (!Array.isArray(body.target_languages) || body.target_languages.length === 0) {
    return NextResponse.json(
      { success: false, error: 'target_languages debe ser array no vacío' },
      { status: 400 }
    );
  }

  const targets = body.target_languages.filter((l) => isSupportedLang(l));
  if (targets.length === 0) {
    return NextResponse.json(
      { success: false, error: 'No hay idiomas destino válidos' },
      { status: 400 }
    );
  }

  const supabase = createServerSupabaseClient();

  let sourceQuery = supabase.from('blog_posts').select('*').limit(1);
  if (body.source_post_id) {
    sourceQuery = sourceQuery.eq('id', body.source_post_id);
  } else if (body.source_slug) {
    sourceQuery = sourceQuery.eq('slug', body.source_slug);
    if (body.source_lang && isSupportedLang(body.source_lang)) {
      sourceQuery = sourceQuery.eq('lang', body.source_lang);
    }
  } else {
    return NextResponse.json(
      { success: false, error: 'Debes indicar source_post_id o source_slug' },
      { status: 400 }
    );
  }

  const { data: sourcePost, error: findError } = await sourceQuery.single();
  if (findError || !sourcePost) {
    return NextResponse.json(
      { success: false, error: 'Post origen no encontrado' },
      { status: 404 }
    );
  }

  const sourceLang = sourcePost.lang as SupportedLang;
  if (!isSupportedLang(sourceLang)) {
    return NextResponse.json(
      { success: false, error: 'Idioma del post origen no soportado' },
      { status: 400 }
    );
  }
  if (!isSupportedCategory(sourcePost.category)) {
    return NextResponse.json(
      { success: false, error: 'Categoría del post origen no soportada' },
      { status: 400 }
    );
  }

  try {
    const config = await getAiBlogConfig();
    const openai = getOpenAIClient();

    const created: Array<{ id: string; slug: string; lang: SupportedLang; admin_url: string }> = [];
    const errors: Array<{ lang: SupportedLang; error: string }> = [];

    for (const target of targets) {
      if (target === sourceLang) {
        errors.push({ lang: target, error: 'idioma destino igual al origen' });
        continue;
      }
      if (!(SUPPORTED_LANGS as string[]).includes(target)) {
        errors.push({ lang: target, error: 'idioma no soportado' });
        continue;
      }

      const systemPrompt = config.translator_system_prompt
        .replace(/\{source_lang\}/g, LANG_NAMES[sourceLang])
        .replace(/\{target_lang\}/g, LANG_NAMES[target]);

      const userPayload = {
        source_lang: sourceLang,
        target_lang: target,
        target_lang_name: LANG_NAMES[target],
        source_document: {
          title: sourcePost.title,
          slug: sourcePost.slug,
          excerpt: sourcePost.excerpt,
          meta_title: sourcePost.meta_title,
          meta_description: sourcePost.meta_description,
          content_html: sourcePost.content,
          tags: sourcePost.tags || [],
        },
      };

      let raw = '';
      try {
        const completion = await safeChatCompletion(openai, {
          model: config.model_translator,
          temperature: config.temperature_translator,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: JSON.stringify(userPayload) },
          ],
        });
        raw = completion.choices[0]?.message?.content || '';
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'desconocido';
        errors.push({ lang: target, error: `Error OpenAI: ${msg}` });
        continue;
      }

      let translated: TranslatedDoc;
      try {
        translated = extractJson<TranslatedDoc>(raw);
      } catch (parseErr: unknown) {
        const msg = parseErr instanceof Error ? parseErr.message : 'desconocido';
        errors.push({ lang: target, error: `Respuesta no parseable: ${msg}` });
        continue;
      }

      const titleClean = String(translated.title || '').trim();
      if (!titleClean || !translated.content_html) {
        errors.push({ lang: target, error: 'Traducción incompleta' });
        continue;
      }

      const slugBase = translated.slug ? slugify(translated.slug) : slugify(titleClean);
      const finalSlug = await ensureUniqueSlug(slugBase, target);

      const insertData: Partial<BlogPost> = {
        slug: finalSlug,
        title: titleClean.slice(0, 200),
        excerpt: String(translated.excerpt || '').trim().slice(0, 280),
        content: sanitizeAIHtml(String(translated.content_html || '')),
        featured_image: sourcePost.featured_image,
        category: sourcePost.category,
        tags: Array.isArray(translated.tags)
          ? translated.tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean).slice(0, 8)
          : sourcePost.tags || [],
        meta_title: String(translated.meta_title || titleClean).trim().slice(0, 70),
        meta_description: String(translated.meta_description || '').trim().slice(0, 200),
        lang: target,
        status: 'draft',
        author_name: 'IA (Health4Spain)',
        published_at: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: inserted, error: insertError } = await supabase
        .from('blog_posts')
        .insert(insertData)
        .select()
        .single();

      if (insertError) {
        errors.push({ lang: target, error: handleSupabaseError(insertError).error || 'insert error' });
        continue;
      }

      created.push({
        id: inserted.id,
        slug: inserted.slug,
        lang: inserted.lang,
        admin_url: `/administrator/blog/${inserted.slug}`,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        source: {
          id: sourcePost.id,
          slug: sourcePost.slug,
          lang: sourcePost.lang,
        },
        created,
        errors,
      },
      message:
        created.length > 0
          ? `Se han creado ${created.length} traducciones como borrador.`
          : 'No se ha podido crear ninguna traducción. Revisa los errores.',
    });
  } catch (err: unknown) {
    console.error('Error translate:', err);
    const message = err instanceof Error ? err.message : 'Error interno del servidor';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
