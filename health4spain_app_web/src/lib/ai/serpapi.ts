/**
 * Wrapper mínimo para SerpAPI Google News.
 * Documentación: https://serpapi.com/google-news-api
 *
 * Requiere variable de entorno SERPAPI_KEY.
 */

export interface NewsResult {
  title: string;
  link: string;
  source: string;
  date: string | null;
  snippet: string | null;
  thumbnail: string | null;
}

interface SerpApiNewsResponse {
  news_results?: Array<{
    title?: string;
    link?: string;
    source?: { name?: string } | string;
    date?: string;
    snippet?: string;
    thumbnail?: string;
  }>;
  error?: string;
}

export interface SearchNewsParams {
  query: string;
  language?: string; // 'es', 'en', 'fr', 'de', 'pt'
  country?: string; // 'es', 'us', 'fr', 'de', 'pt'
  timeframe?: string; // 'qdr:d' | 'qdr:w' | 'qdr:m'
  limit?: number;
}

/**
 * Devuelve hasta `limit` noticias relevantes para el query.
 * Si SERPAPI_KEY no está configurada, lanza error explícito.
 */
export async function searchNews({
  query,
  language = 'es',
  country = 'es',
  timeframe = 'qdr:w',
  limit = 8,
}: SearchNewsParams): Promise<NewsResult[]> {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    throw new Error(
      'SERPAPI_KEY no configurada. Añádela a las variables de entorno para usar el modo Noticias.'
    );
  }

  const params = new URLSearchParams({
    engine: 'google_news',
    q: query,
    hl: language,
    gl: country,
    api_key: apiKey,
  });

  if (timeframe) {
    params.set('tbs', timeframe);
  }

  const url = `https://serpapi.com/search.json?${params.toString()}`;

  let response: Response;
  try {
    response = await fetch(url, { method: 'GET' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'desconocido';
    throw new Error(`Error de red contactando SerpAPI: ${msg}`);
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`SerpAPI respondió ${response.status}: ${text.slice(0, 200)}`);
  }

  const data = (await response.json()) as SerpApiNewsResponse;

  if (data.error) {
    throw new Error(`SerpAPI: ${data.error}`);
  }

  const items = (data.news_results || []).slice(0, limit);

  return items.map((it) => ({
    title: (it.title || '').trim(),
    link: it.link || '',
    source:
      typeof it.source === 'string'
        ? it.source
        : it.source?.name || '',
    date: it.date || null,
    snippet: it.snippet || null,
    thumbnail: it.thumbnail || null,
  }));
}
