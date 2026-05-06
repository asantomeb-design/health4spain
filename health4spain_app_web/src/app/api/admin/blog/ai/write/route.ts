import { NextRequest, NextResponse } from 'next/server';
import { validateAdminAuth } from '@/lib/auth';
import {
  buildEditorialContext,
  extractJson,
  fetchExistingTitles,
  getAiBlogConfig,
  getOpenAIClient,
  isSupportedCategory,
  isSupportedLang,
  LANG_NAMES,
  sanitizeAIHtml,
  slugify,
  type SupportedLang,
} from '@/lib/ai/openai-blog';
import { extractResponseOutputText } from '@/lib/ai/web-search';

export const maxDuration = 300; // hasta 5 minutos en Vercel para artículos largos

interface WriteRequest {
  title: string;
  angle?: string;
  language: SupportedLang;
  category: string;
  target_keywords?: string[];
  extra_context?: string;
  source_hints?: Array<{ title?: string; url?: string; snippet?: string }>;
}

interface WriterResult {
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

  let body: WriteRequest;
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
  if (!isSupportedLang(body.language)) {
    return NextResponse.json(
      { success: false, error: 'language inválido (es/en/de/fr/pt)' },
      { status: 400 }
    );
  }
  if (!isSupportedCategory(body.category)) {
    return NextResponse.json(
      { success: false, error: 'category inválida' },
      { status: 400 }
    );
  }

  try {
    const config = await getAiBlogConfig();
    if (!config.enabled) {
      return NextResponse.json(
        { success: false, error: 'Asistente IA del blog deshabilitado' },
        { status: 503 }
      );
    }

    const openai = getOpenAIClient();
    const editorial = buildEditorialContext(config);
    const existing = await fetchExistingTitles(body.language, 15);

    const userInput = {
      task: 'write_article',
      language: body.language,
      language_name: LANG_NAMES[body.language],
      category: body.category,
      title: body.title.trim(),
      angle: body.angle?.trim() || null,
      target_keywords: Array.isArray(body.target_keywords)
        ? body.target_keywords.slice(0, 8)
        : [],
      target_word_count: config.target_word_count,
      extra_context: body.extra_context?.trim().slice(0, 1500) || null,
      existing_articles_in_language: existing.map((e) => ({
        title: e.title,
        slug: e.slug,
        category: e.category,
      })),
      source_hints: Array.isArray(body.source_hints)
        ? body.source_hints.slice(0, 8)
        : [],
      output_schema: {
        title: 'string',
        slug: 'string-con-guiones-sin-tildes',
        excerpt: 'string 140-200 chars',
        meta_title: 'string max 60 chars',
        meta_description: 'string 140-160 chars',
        content_html: 'HTML article body',
        tags: 'string[]',
        sources: 'Array<{title, url}>',
      },
    };

    let raw = '';

    // Intento principal: Responses API con web_search habilitado.
    // Si el modelo configurado no soporta tools/web_search, hacemos fallback.
    try {
      const responsesApi = (openai as unknown as { responses?: any }).responses;
      if (responsesApi?.create) {
        const resp = await responsesApi.create({
          model: config.model_writer,
          input: [
            {
              role: 'system',
              content: `${config.writer_system_prompt}\n\n${editorial}`,
            },
            {
              role: 'user',
              content: JSON.stringify(userInput),
            },
          ],
          tools: [{ type: 'web_search' }],
          temperature: config.temperature_writer,
        });

        raw = extractResponseOutputText(resp);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'desconocido';
      console.warn('Responses API no disponible, fallback a chat.completions:', msg);
    }

    // Fallback: Chat Completions sin web_search (el modelo redacta con conocimiento propio)
    if (!raw) {
      const completion = await openai.chat.completions.create({
        model: config.model_writer,
        temperature: config.temperature_writer,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: `${config.writer_system_prompt}\n\n${editorial}\n\nIMPORTANTE: en este modo NO tienes acceso a búsqueda web. No inventes datos numéricos concretos sin matizar; expresa rangos o señala "consulta la versión más reciente".`,
          },
          { role: 'user', content: JSON.stringify(userInput) },
        ],
      });
      raw = completion.choices[0]?.message?.content || '';
    }

    if (!raw) {
      return NextResponse.json(
        { success: false, error: 'El modelo no devolvió contenido' },
        { status: 502 }
      );
    }

    let parsed: WriterResult;
    try {
      parsed = extractJson<WriterResult>(raw);
    } catch (parseErr: unknown) {
      const msg = parseErr instanceof Error ? parseErr.message : 'desconocido';
      return NextResponse.json(
        { success: false, error: `Respuesta del modelo no parseable: ${msg}`, raw: raw.slice(0, 4000) },
        { status: 502 }
      );
    }

    const finalTitle = String(parsed.title || body.title).trim().slice(0, 200);
    const finalSlug =
      typeof parsed.slug === 'string' && parsed.slug.trim()
        ? slugify(parsed.slug)
        : slugify(finalTitle);

    const result: WriterResult = {
      title: finalTitle,
      slug: finalSlug,
      excerpt: String(parsed.excerpt || '').trim().slice(0, 280),
      meta_title: String(parsed.meta_title || finalTitle).trim().slice(0, 70),
      meta_description: String(parsed.meta_description || '').trim().slice(0, 200),
      content_html: sanitizeAIHtml(String(parsed.content_html || '')),
      tags: Array.isArray(parsed.tags)
        ? parsed.tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean).slice(0, 8)
        : [],
      sources: Array.isArray(parsed.sources)
        ? parsed.sources
            .map((s) => ({
              title: typeof s?.title === 'string' ? s.title.trim() : undefined,
              url: typeof s?.url === 'string' ? s.url.trim() : undefined,
            }))
            .filter((s) => s.url)
            .slice(0, 12)
        : [],
    };

    if (!result.content_html || result.content_html.length < 200) {
      return NextResponse.json(
        { success: false, error: 'El contenido generado es demasiado corto', raw: raw.slice(0, 2000) },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        category: body.category,
        language: body.language,
      },
    });
  } catch (err: unknown) {
    console.error('Error write:', err);
    const message = err instanceof Error ? err.message : 'Error interno del servidor';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
