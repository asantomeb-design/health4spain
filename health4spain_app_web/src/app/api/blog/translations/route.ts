import { NextRequest, NextResponse } from 'next/server';
import { getBlogTranslations } from '@/lib/data';
import { LOCALES } from '@/lib/routes';
import type { Locale } from '@/lib/routes';

/**
 * GET /api/blog/translations?slug=...&lang=es
 *
 * Devuelve el mapa { es: 'slug-es', en: 'slug-en', ... } con los hermanos
 * publicados del artículo. El cliente lo usa para que el cambiador de idioma
 * lleve a la URL equivalente correcta en el idioma destino.
 *
 * Si el slug no existe o el grupo no tiene hermanos, devuelve solo el
 * propio idioma del recurso.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug')?.trim();
  const langRaw = (searchParams.get('lang') || 'es').trim() as Locale;

  if (!slug) {
    return NextResponse.json(
      { success: false, error: 'Parámetro "slug" obligatorio' },
      { status: 400 }
    );
  }

  if (!LOCALES.includes(langRaw)) {
    return NextResponse.json(
      { success: false, error: 'Parámetro "lang" no soportado' },
      { status: 400 }
    );
  }

  const map = await getBlogTranslations(slug, langRaw);

  return NextResponse.json(
    { success: true, data: map },
    {
      headers: {
        // Respuestas ligeras y poco volátiles → caché agresiva en CDN
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
      },
    }
  );
}
