import OpenAI from 'openai';
import { createServerSupabaseClient } from '@/lib/supabase';

export type AiBlogConfig = {
  id: string;
  enabled: boolean;
  model_proposals: string;
  model_writer: string;
  model_translator: string;
  model_image: string;
  temperature_proposals: number;
  temperature_writer: number;
  temperature_translator: number;
  target_word_count: number;
  image_size: string;
  image_style: string;
  news_country: string;
  news_language: string;
  news_timeframe: string;
  editorial_guidelines: string;
  proposals_system_prompt: string;
  writer_system_prompt: string;
  translator_system_prompt: string;
  created_at: string;
  updated_at: string;
};

export type SupportedLang = 'es' | 'en' | 'de' | 'fr' | 'pt';

export const SUPPORTED_LANGS: SupportedLang[] = ['es', 'en', 'de', 'fr', 'pt'];

export const LANG_NAMES: Record<SupportedLang, string> = {
  es: 'Spanish',
  en: 'English',
  fr: 'French',
  de: 'German',
  pt: 'Portuguese',
};

export const BLOG_CATEGORY_VALUES = [
  'guias',
  'tramites',
  'vida-espana',
  'noticias',
  'testimonios',
] as const;
export type BlogCategoryValue = (typeof BLOG_CATEGORY_VALUES)[number];

let cachedConfig: AiBlogConfig | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 30_000;

export async function getAiBlogConfig(forceFresh = false): Promise<AiBlogConfig> {
  const now = Date.now();
  if (!forceFresh && cachedConfig && now - cacheTimestamp < CACHE_TTL) {
    return cachedConfig;
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from('ai_blog_config').select('*').limit(1).single();

  if (error || !data) {
    throw new Error('ai_blog_config no encontrada. Ejecuta supabase/15-ai-blog-config.sql.');
  }

  cachedConfig = data as AiBlogConfig;
  cacheTimestamp = now;
  return cachedConfig;
}

export function invalidateAiBlogConfigCache() {
  cachedConfig = null;
  cacheTimestamp = 0;
}

export function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY no configurada en variables de entorno');
  }
  return new OpenAI({ apiKey });
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 90);
}

export async function ensureUniqueSlug(
  baseSlug: string,
  lang: SupportedLang
): Promise<string> {
  const supabase = createServerSupabaseClient();
  let slug = baseSlug || `articulo-${Date.now()}`;
  let counter = 1;

  // intentamos hasta 50 sufijos antes de dar paso al timestamp
  for (let i = 0; i < 50; i++) {
    const { data } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .eq('lang', lang)
      .maybeSingle();

    if (!data) return slug;
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
  return `${baseSlug}-${Date.now()}`;
}

const ALLOWED_TAGS = new Set([
  'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br',
  'ul', 'ol', 'li',
  'strong', 'em', 'b', 'i', 'u',
  'a',
  'blockquote',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
  'img',
  'span',
  'code', 'pre',
]);

const ALLOWED_ATTR_BY_TAG: Record<string, Set<string>> = {
  a: new Set(['href', 'title', 'target', 'rel']),
  img: new Set(['src', 'alt', 'title', 'width', 'height']),
  th: new Set(['colspan', 'rowspan', 'scope']),
  td: new Set(['colspan', 'rowspan']),
  table: new Set([]),
};

/**
 * Sanitizador HTML mínimo orientado a contenido de IA. NO depende de DOMPurify
 * porque corre en runtime de Node sin DOM. Quita scripts, atributos on*, javascript:,
 * data: URIs, estilos inline y atributos no permitidos.
 */
export function sanitizeAIHtml(html: string): string {
  if (!html) return '';
  let out = html;

  // Quitar comentarios HTML
  out = out.replace(/<!--([\s\S]*?)-->/g, '');

  // Quitar etiquetas peligrosas completas
  out = out.replace(/<\/?(script|style|iframe|object|embed|form|input|button|noscript|link|meta)[^>]*>/gi, '');

  // Procesar atributos por etiqueta
  out = out.replace(/<([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g, (match, tagRaw, attrsRaw) => {
    const tag = String(tagRaw).toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) return '';

    const allowedForTag = ALLOWED_ATTR_BY_TAG[tag] || new Set<string>();
    const attrRegex = /\s([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/g;
    const cleanedAttrs: string[] = [];
    let m: RegExpExecArray | null;

    while ((m = attrRegex.exec(attrsRaw)) !== null) {
      const name = m[1].toLowerCase();
      const value = (m[3] ?? m[4] ?? m[5] ?? '').trim();

      if (name.startsWith('on')) continue;
      if (name === 'style' || name === 'class' || name === 'id') continue;
      if (!allowedForTag.has(name)) continue;

      if (name === 'href' || name === 'src') {
        if (/^javascript:/i.test(value)) continue;
        if (/^data:/i.test(value) && !/^data:image\//i.test(value)) continue;
      }

      if (tag === 'a' && name === 'href') {
        const isExternal = /^https?:\/\//i.test(value);
        cleanedAttrs.push(`href="${escapeAttr(value)}"`);
        if (isExternal) {
          cleanedAttrs.push('target="_blank"');
          cleanedAttrs.push('rel="noopener noreferrer"');
        }
        continue;
      }

      cleanedAttrs.push(`${name}="${escapeAttr(value)}"`);
    }

    return cleanedAttrs.length ? `<${tag} ${cleanedAttrs.join(' ')}>` : `<${tag}>`;
  });

  // Cierre limpio: solo permitir cierres de tags permitidos
  out = out.replace(/<\/([a-zA-Z][a-zA-Z0-9]*)>/g, (match, tagRaw) => {
    const tag = String(tagRaw).toLowerCase();
    return ALLOWED_TAGS.has(tag) ? `</${tag}>` : '';
  });

  return out.trim();
}

function escapeAttr(value: string): string {
  return value.replace(/"/g, '&quot;');
}

/**
 * Extrae JSON de la respuesta del modelo, tolerando que venga en bloque ```json
 * o con texto alrededor.
 */
export function extractJson<T = unknown>(raw: string): T {
  if (!raw) throw new Error('Respuesta vacía del modelo');
  const trimmed = raw.trim();

  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fence ? fence[1] : trimmed;

  // Buscar primer { y último } para tolerar prefijos/sufijos
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) {
    throw new Error('No se encontró objeto JSON en la respuesta del modelo');
  }
  const json = candidate.slice(start, end + 1);
  return JSON.parse(json) as T;
}

/**
 * Trae los últimos N posts publicados (en cualquier estado) en un idioma,
 * para evitar que el agente repita temas.
 */
export async function fetchExistingTitles(
  lang: SupportedLang,
  limit = 30
): Promise<Array<{ title: string; slug: string; category: string; status: string }>> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('title, slug, category, status')
    .eq('lang', lang)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data as Array<{ title: string; slug: string; category: string; status: string }>;
}

export function isSupportedLang(input: unknown): input is SupportedLang {
  return typeof input === 'string' && (SUPPORTED_LANGS as string[]).includes(input);
}

export function isSupportedCategory(input: unknown): input is BlogCategoryValue {
  return (
    typeof input === 'string' && (BLOG_CATEGORY_VALUES as readonly string[]).includes(input)
  );
}

export function buildEditorialContext(config: AiBlogConfig): string {
  return `=== GUÍA DE ESTILO EDITORIAL DE HEALTH4SPAIN ===\n${config.editorial_guidelines}\n=== FIN GUÍA ===`;
}

/**
 * Cache de modelos que no soportan parámetros de sampling personalizados
 * (temperature, top_p, frequency_penalty, presence_penalty). Algunos modelos
 * de razonamiento modernos (familia gpt-5.x, o-series, etc.) solo admiten
 * los valores por defecto y devuelven 400 si se les envía otro valor.
 */
const MODELS_WITHOUT_SAMPLING = new Set<string>();

interface ChatParamsLike {
  model: string;
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
  response_format?: OpenAI.Chat.Completions.ChatCompletionCreateParams['response_format'];
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  max_tokens?: number;
}

function isUnsupportedSamplingError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const status = (err as { status?: number }).status;
  if (status !== 400) return false;
  const message = String((err as { message?: string }).message || '').toLowerCase();
  return (
    /temperature/.test(message) ||
    /top[_ ]p/.test(message) ||
    /frequency_penalty/.test(message) ||
    /presence_penalty/.test(message)
  ) && (message.includes('default') || message.includes('only') || message.includes('does not support'));
}

/**
 * Llama a chat.completions tolerando modelos que rechazan parámetros de sampling.
 * Si recibe error 400 indicando que temperature/top_p/etc. no están soportados,
 * reintenta sin esos parámetros y cachea el modelo para evitar el ida y vuelta.
 */
export async function safeChatCompletion(
  openai: OpenAI,
  params: ChatParamsLike
): Promise<OpenAI.Chat.Completions.ChatCompletion> {
  const stripped = (() => {
    const p: ChatParamsLike = { ...params };
    delete p.temperature;
    delete p.top_p;
    delete p.frequency_penalty;
    delete p.presence_penalty;
    return p;
  })();

  if (MODELS_WITHOUT_SAMPLING.has(params.model)) {
    return openai.chat.completions.create(stripped as OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming);
  }

  try {
    return await openai.chat.completions.create(
      params as OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming
    );
  } catch (err: unknown) {
    if (isUnsupportedSamplingError(err)) {
      MODELS_WITHOUT_SAMPLING.add(params.model);
      console.warn(
        `Modelo "${params.model}" no admite parámetros de sampling; reintentando sin temperature/top_p.`
      );
      return openai.chat.completions.create(stripped as OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming);
    }
    throw err;
  }
}

export function modelSupportsSampling(model: string): boolean {
  return !MODELS_WITHOUT_SAMPLING.has(model);
}
