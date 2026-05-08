import type { Locale } from './routes';
import { switchLocalePath } from './routes';

/** Rutas de artículo: `/<locale>/blog/<slug>`. El segmento del blog es siempre `blog` en los 5 idiomas (`ROUTES.*.blog`). */
export const BLOG_ARTICLE_PATH_RE = /^\/(es|en|de|fr|pt)\/blog\/([^/]+)\/?$/;

/**
 * Href al cambiar de idioma: en artículos de blog usa el slug hermano si existe
 * (`translation_group_id` vía `/api/blog/translations`); si no, índice del blog
 * en ese idioma. En el resto de rutas delega en `switchLocalePath`.
 */
export function hrefForLocaleSwitch(
  pathname: string,
  currentLang: Locale,
  target: Locale,
  blogTranslations: Partial<Record<Locale, string>> | null
): string {
  const blogMatch = pathname.match(BLOG_ARTICLE_PATH_RE);
  if (blogMatch) {
    const targetSlug = blogTranslations?.[target];
    if (targetSlug) return `/${target}/blog/${targetSlug}`;
    return `/${target}/blog`;
  }
  return switchLocalePath(pathname, currentLang, target);
}
