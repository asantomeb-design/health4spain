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
  safeChatCompletion,
  type SupportedLang,
} from '@/lib/ai/openai-blog';
import { searchNews, type NewsResult } from '@/lib/ai/web-search';

interface RequestBody {
  mode?: 'blog' | 'news';
  language?: SupportedLang;
  category?: string;
  extra_context?: string;
  news_query?: string;
}

interface Proposal {
  title: string;
  angle: string;
  target_keywords: string[];
  why_it_works: string;
  suggested_category: string;
}

export async function POST(request: NextRequest) {
  const auth = await validateAdminAuth(request);
  if (auth.error) return auth.error;

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'JSON inválido' }, { status: 400 });
  }

  const mode = body.mode === 'news' ? 'news' : 'blog';
  const language = isSupportedLang(body.language) ? body.language : 'es';
  const category = body.category && isSupportedCategory(body.category) ? body.category : null;
  const extraContext = (body.extra_context || '').trim().slice(0, 1000);

  try {
    const config = await getAiBlogConfig();
    if (!config.enabled) {
      return NextResponse.json(
        { success: false, error: 'Asistente IA del blog deshabilitado en configuración' },
        { status: 503 }
      );
    }

    const openai = getOpenAIClient();
    const existingTitles = await fetchExistingTitles(language, 30);

    let newsHeadlines: NewsResult[] = [];
    if (mode === 'news') {
      const baseQuery = (body.news_query || extraContext || 'extranjeros vivir España').trim();
      try {
        newsHeadlines = await searchNews({
          query: baseQuery,
          language: config.news_language || language,
          country: config.news_country || 'es',
          timeframe: config.news_timeframe || 'qdr:w',
          limit: 8,
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'desconocido';
        return NextResponse.json(
          { success: false, error: `No se han podido obtener noticias: ${msg}` },
          { status: 502 }
        );
      }
    }

    const editorial = buildEditorialContext(config);
    const userPayload = {
      mode,
      language,
      language_name: LANG_NAMES[language],
      category,
      extra_context: extraContext || null,
      existing_titles: existingTitles.map((t) => ({
        title: t.title,
        category: t.category,
        status: t.status,
      })),
      news_headlines:
        mode === 'news'
          ? newsHeadlines.map((n) => ({
              title: n.title,
              source: n.source,
              date: n.date,
              snippet: n.snippet,
            }))
          : null,
    };

    const completion = await safeChatCompletion(openai, {
      model: config.model_proposals,
      temperature: config.temperature_proposals,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: `${config.proposals_system_prompt}\n\n${editorial}` },
        { role: 'user', content: JSON.stringify(userPayload) },
      ],
    });

    const raw = completion.choices[0]?.message?.content || '';
    const parsed = extractJson<{ proposals?: Proposal[] }>(raw);

    if (!parsed.proposals || !Array.isArray(parsed.proposals) || parsed.proposals.length === 0) {
      return NextResponse.json(
        { success: false, error: 'El modelo no devolvió propuestas válidas', raw },
        { status: 502 }
      );
    }

    const proposals: Proposal[] = parsed.proposals.slice(0, 3).map((p) => ({
      title: String(p.title || '').trim().slice(0, 200),
      angle: String(p.angle || '').trim(),
      target_keywords: Array.isArray(p.target_keywords)
        ? p.target_keywords.map((k) => String(k).trim()).filter(Boolean).slice(0, 8)
        : [],
      why_it_works: String(p.why_it_works || '').trim(),
      suggested_category:
        isSupportedCategory(p.suggested_category) ? p.suggested_category : category || 'guias',
    }));

    return NextResponse.json({
      success: true,
      data: {
        mode,
        language,
        category,
        proposals,
        news_headlines: mode === 'news' ? newsHeadlines : [],
      },
    });
  } catch (err: unknown) {
    console.error('Error suggest-titles:', err);
    const message = err instanceof Error ? err.message : 'Error interno del servidor';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
