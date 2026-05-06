import { extractJson, getOpenAIClient } from '@/lib/ai/openai-blog';

export interface NewsResult {
  title: string;
  link: string;
  source: string;
  date: string | null;
  snippet: string | null;
  thumbnail: string | null;
}

export interface SearchNewsParams {
  query: string;
  language?: string; // 'es', 'en', 'fr', 'de', 'pt'
  country?: string; // 'es', 'us', 'fr', 'de', 'pt'
  timeframe?: string; // 'qdr:d' | 'qdr:w' | 'qdr:m'
  limit?: number;
}

interface SearchNewsJson {
  results?: Array<Partial<NewsResult>>;
}

const TIMEFRAME_LABELS: Record<string, string> = {
  'qdr:d': 'últimas 24 horas',
  'qdr:w': 'últimos 7 días',
  'qdr:m': 'últimos 30 días',
};

/**
 * Búsqueda de noticias basada en OpenAI Responses API + web_search.
 * Mantiene la forma de datos que consume el asistente del blog.
 */
export async function searchNews({
  query,
  language = 'es',
  country = 'es',
  timeframe = 'qdr:w',
  limit = 8,
}: SearchNewsParams): Promise<NewsResult[]> {
  const openai = getOpenAIClient();
  const responsesApi = (openai as unknown as { responses?: { create?: (args: unknown) => Promise<unknown> } }).responses;

  if (!responsesApi?.create) {
    throw new Error('La versión instalada del SDK de OpenAI no expone Responses API.');
  }

  const safeLimit = Math.min(20, Math.max(1, Math.floor(limit)));
  const timeframeLabel = TIMEFRAME_LABELS[timeframe] || 'resultados recientes';
  const model = process.env.OPENAI_WEB_SEARCH_MODEL || 'gpt-5.5';

  const response = await responsesApi.create({
    model,
    tools: [
      {
        type: 'web_search',
        search_context_size: 'low',
        user_location: {
          type: 'approximate',
          country: country.toUpperCase(),
        },
      },
    ],
    tool_choice: 'required',
    input: [
      {
        role: 'system',
        content:
          'Eres un investigador editorial. Usa búsqueda web y devuelve exclusivamente JSON válido, sin markdown.',
      },
      {
        role: 'user',
        content: JSON.stringify({
          task: 'news_search',
          query,
          language,
          country,
          timeframe: timeframeLabel,
          limit: safeLimit,
          output_schema: {
            results:
              'Array<{ title: string, link: string, source: string, date: string|null, snippet: string|null, thumbnail: null }>',
          },
          rules: [
            'Prioriza fuentes oficiales, prensa reconocida y medios locales relevantes.',
            'No inventes URLs ni fechas. Si falta una fecha, usa null.',
            'El campo link debe contener la URL canónica de la fuente citada.',
            'Devuelve como máximo limit resultados.',
          ],
        }),
      },
    ],
  });

  const raw = extractResponseOutputText(response);
  if (!raw) {
    throw new Error('OpenAI web_search no devolvió texto.');
  }

  const parsed = extractJson<SearchNewsJson>(raw);
  const items = Array.isArray(parsed.results) ? parsed.results : [];

  return items
    .map((item) => ({
      title: String(item.title || '').trim(),
      link: String(item.link || '').trim(),
      source: String(item.source || '').trim(),
      date: item.date ? String(item.date).trim() : null,
      snippet: item.snippet ? String(item.snippet).trim() : null,
      thumbnail: null,
    }))
    .filter((item) => item.title && item.link)
    .slice(0, safeLimit);
}

export function extractResponseOutputText(response: unknown): string {
  const resp = response as {
    output_text?: unknown;
    output?: Array<{
      type?: string;
      content?: Array<{ type?: string; text?: unknown }>;
    }>;
  };

  if (typeof resp.output_text === 'string' && resp.output_text.trim()) {
    return resp.output_text;
  }

  let raw = '';
  if (Array.isArray(resp.output)) {
    for (const item of resp.output) {
      if (item?.type !== 'message' || !Array.isArray(item.content)) continue;
      for (const part of item.content) {
        if (part?.type === 'output_text' && typeof part.text === 'string') {
          raw += part.text;
        }
      }
    }
  }

  return raw.trim();
}
