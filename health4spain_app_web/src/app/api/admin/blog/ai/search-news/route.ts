import { NextRequest, NextResponse } from 'next/server';
import { validateAdminAuth } from '@/lib/auth';
import { searchNews } from '@/lib/ai/serpapi';
import { getAiBlogConfig, isSupportedLang } from '@/lib/ai/openai-blog';

export async function POST(request: NextRequest) {
  const auth = await validateAdminAuth(request);
  if (auth.error) return auth.error;

  let body: {
    query?: string;
    language?: string;
    country?: string;
    timeframe?: string;
    limit?: number;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'JSON inválido' }, { status: 400 });
  }

  const query = (body.query || '').trim();
  if (!query) {
    return NextResponse.json(
      { success: false, error: 'Falta el parámetro "query"' },
      { status: 400 }
    );
  }

  try {
    const config = await getAiBlogConfig();
    const language =
      typeof body.language === 'string' && isSupportedLang(body.language)
        ? body.language
        : config.news_language || 'es';
    const country =
      typeof body.country === 'string' && body.country.length === 2
        ? body.country
        : config.news_country || 'es';
    const timeframe =
      typeof body.timeframe === 'string' && body.timeframe.length > 0
        ? body.timeframe
        : config.news_timeframe || 'qdr:w';
    const limit = typeof body.limit === 'number' && body.limit > 0 && body.limit <= 20 ? body.limit : 10;

    const results = await searchNews({ query, language, country, timeframe, limit });

    return NextResponse.json({ success: true, data: { query, language, country, timeframe, results } });
  } catch (err: unknown) {
    console.error('Error search-news:', err);
    const message = err instanceof Error ? err.message : 'Error interno del servidor';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
