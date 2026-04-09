/**
 * Limpia el campo `content` (y opcionalmente excerpt) de blog_posts en Supabase:
 * - Cercas markdown ```html ... ```
 * - Comillas o caracteres basura al inicio
 * - Un único envoltorio externo <section>...</section>
 * - Párrafos finales tipo disclaimer / meta-IA (ES/EN)
 * - Cierre ``` y párrafo meta del tipo "Este contenido HTML está diseñado…" / "Este artículo, estructurado en HTML…"
 *
 * Uso:
 *   npx tsx scripts/clean-blog-posts-content.ts           # dry-run: solo informe
 *   npx tsx scripts/clean-blog-posts-content.ts --apply   # escribe cambios
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const APPLY = process.argv.includes('--apply');

function paragraphInnerText(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Solo párrafos finales cortos que suelen ser meta-IA / disclaimers */
function isTrailingAiDisclaimerParagraph(innerHtml: string): boolean {
  const t = paragraphInnerText(innerHtml).toLowerCase();
  if (t.length > 900) return false;
  const patterns = [
    /inteligencia artificial|modelo de lenguaje|como asistente de ia|como ia\b|texto ha sido generad|contenido generad|generad[oa] autom/i,
    /as an ai|i'm an ai|i am an ai|chatgpt|\bopenai\b|this (article|content|text) was (generated|created|written)/i,
    /disclaimer|nota legal sobre (el uso de )?ia/i,
    /i hope this (article|information) (has been |was )?helpful/i,
    /este artículo (fue |ha sido )?(escrito|generado|producido) (por |con )?(una )?ia/i,
  ];
  return patterns.some((p) => p.test(t));
}

function stripMarkdownFences(html: string): string {
  let s = html.trim();
  s = s.replace(/^\uFEFF/, '');
  // ```html o ``` al inicio / final
  s = s.replace(/^[\s]*```[a-zA-Z]*[\s]*\n?/, '');
  s = s.replace(/\n?[\s]*```[\s]*$/, '');
  return s.trim();
}

/**
 * Muchos posts quedaron con `</section>\n```\n\n` y un párrafo meta (no HTML) detrás.
 * Quita desde el último ``` cierre cuando lo siguiente no es marcado HTML (empieza por `<`).
 * No toca un ``` solo al índice 0 (apertura ```html), que se quita aparte.
 */
function stripTrailingCodeFenceAndModelMeta(s: string): string {
  let t = s.trim();
  for (let guard = 0; guard < 10; guard++) {
    const idx = t.lastIndexOf('```');
    if (idx <= 0) break;
    const after = t.slice(idx + 3).trim();
    if (after.length === 0) {
      t = t.slice(0, idx).trim();
      continue;
    }
    if (!after.startsWith('<')) {
      t = t.slice(0, idx).trim();
      continue;
    }
    break;
  }
  // Apertura ```html si quedó al inicio tras quitar colas
  t = t.replace(/^```[a-zA-Z]*\s*\n/, '');
  return t.trim();
}

/** Quita una capa de comillas dobles que envuelve todo el HTML (artefacto de copia/JSON) */
function stripSurroundingQuotes(html: string): string {
  let s = html.trim();
  if (s.length >= 2 && s.startsWith('"') && s.endsWith('"')) {
    const inner = s.slice(1, -1).trim();
    if (inner.startsWith('<')) return inner;
  }
  if (s.length >= 2 && s.startsWith("'") && s.endsWith("'")) {
    const inner = s.slice(1, -1).trim();
    if (inner.startsWith('<')) return inner;
  }
  return s;
}

/** Solo si hay exactamente un par section: quitar envoltorio (varias secciones → no tocar) */
function unwrapSingleSection(html: string): string {
  const s = html.trim();
  const opens = (s.match(/<section\b/gi) || []).length;
  const closes = (s.match(/<\/section>/gi) || []).length;
  if (opens !== 1 || closes !== 1) return html;
  const m = /^<section\b[^>]*>([\s\S]*)<\/section>\s*$/i.exec(s);
  if (!m) return html;
  return m[1].trim();
}

/** Repara documentos dañados por unwrap erróneo: primer bloque sin <section> o último sin cierre */
function repairSectionStructure(html: string): string {
  let s = html.trim();
  const hasSection = /<section\b/i.test(s);
  const hasClose = /<\/section>/i.test(s);
  if (hasClose && !/^\s*<section\b/i.test(s) && /^[\s]*<(h[1-6]|p|ul|ol|div)\b/i.test(s)) {
    s = '<section>\n' + s;
  }
  let opens = (s.match(/<section\b/gi) || []).length;
  let closes = (s.match(/<\/section>/gi) || []).length;
  while (opens > closes) {
    s += '\n</section>';
    closes++;
  }
  return s.trim();
}

/** Quita desde el final solo <p>…</p> que parezcan disclaimers de IA (hasta 5 intentos) */
function removeTrailingAiDisclaimers(html: string): string {
  let s = html.trim();
  for (let i = 0; i < 5; i++) {
    const m = s.match(/<p(\s[^>]*)?>([\s\S]*?)<\/p>\s*$/i);
    if (!m) break;
    const inner = m[2] || '';
    if (!isTrailingAiDisclaimerParagraph(inner)) break;
    s = s.slice(0, s.length - m[0].length).trim();
  }
  return s.trim();
}

export function cleanBlogHtmlContent(raw: string): string {
  let s = stripMarkdownFences(raw);
  s = stripSurroundingQuotes(s);
  s = stripMarkdownFences(s);
  s = stripTrailingCodeFenceAndModelMeta(s);
  s = stripMarkdownFences(s);
  s = unwrapSingleSection(s);
  s = removeTrailingAiDisclaimers(s);
  s = stripTrailingCodeFenceAndModelMeta(s);
  s = repairSectionStructure(s);
  return s.trim();
}

/** excerpt suele ser texto plano o una línea; sin quitar <section> ni párrafos largos */
function cleanExcerpt(raw: string): string {
  let s = stripMarkdownFences(raw);
  s = stripSurroundingQuotes(s);
  s = stripMarkdownFences(s).trim();
  return s;
}

function contentLooksEnglish(sample: string): boolean {
  const t = sample.slice(0, 1200).toLowerCase();
  const esHits = (t.match(/\b(el|la|los|las|de la|para|como|esta|está|también|vivir en españa|español)\b/g) || []).length;
  const enHits = (t.match(/\b(the|and|for|this|that|with|living in spain|guide to)\b/g) || []).length;
  return enHits > esHits + 3;
}

function contentLooksSpanish(sample: string): boolean {
  const t = sample.slice(0, 1200).toLowerCase();
  const esHits = (t.match(/\b(el|la|los|las|de la|para|como|qué|cómo|españa|está)\b/g) || []).length;
  const enHits = (t.match(/\b(the|and|for|this|that|with|what|how)\b/g) || []).length;
  return esHits > enHits + 5;
}

async function main() {
  console.log(`\n🧹 Limpieza blog_posts.content  (${APPLY ? 'APLICAR cambios' : 'DRY-RUN (sin escribir)'})\n`);

  const { data: rows, error } = await supabase
    .from('blog_posts')
    .select('id, slug, lang, content, excerpt');

  if (error) {
    console.error('Error leyendo blog_posts:', error.message);
    process.exit(1);
  }

  if (!rows?.length) {
    console.log('No hay filas.');
    return;
  }

  let updated = 0;
  const langWarnings: string[] = [];

  for (const row of rows) {
    const before = row.content || '';
    const after = cleanBlogHtmlContent(before);
    const excerptBefore = row.excerpt || '';
    const excerptAfter = cleanExcerpt(excerptBefore);

    if (row.lang === 'es' && before.length > 200 && contentLooksEnglish(before)) {
      langWarnings.push(
        `  ⚠️  [es] ${row.slug} — el contenido parece inglés; el original debería estar en español (revisar o regenerar desde ES).`
      );
    }
    if (row.lang === 'en' && before.length > 200 && contentLooksSpanish(before)) {
      langWarnings.push(
        `  ⚠️  [en] ${row.slug} — el contenido parece español; debería ser la traducción al inglés de la fila es.`
      );
    }

    const changed = after !== before || excerptAfter !== excerptBefore;
    if (!changed) continue;

    console.log(`\n📄 ${row.slug} (${row.lang})`);
    if (after !== before) {
      console.log(`   content: ${before.length} → ${after.length} caracteres`);
      if (process.env.DEBUG_BLOG_CLEAN === '1') {
        console.log('   --- antes (inicio):', before.slice(0, 120).replace(/\n/g, ' '));
        console.log('   --- después (inicio):', after.slice(0, 120).replace(/\n/g, ' '));
      }
    }
    if (excerptAfter !== excerptBefore) {
      console.log(`   excerpt: ajustado`);
    }

    updated++;
    if (APPLY) {
      const { error: upErr } = await supabase
        .from('blog_posts')
        .update({
          content: after,
          excerpt: excerptAfter !== excerptBefore ? excerptAfter : row.excerpt,
          updated_at: new Date().toISOString(),
        })
        .eq('id', row.id);

      if (upErr) {
        console.error(`   ❌ Error actualizando: ${upErr.message}`);
      } else {
        console.log('   ✅ Guardado');
      }
    }
  }

  console.log('\n' + '─'.repeat(60));
  console.log(`Filas con cambios detectados: ${updated}`);
  if (!APPLY && updated > 0) {
    console.log('Ejecuta con --apply para guardar en Supabase.');
  }

  if (langWarnings.length) {
    console.log('\n📌 Posible incoherencia idioma vs columna lang (revisión manual):');
    console.log([...new Set(langWarnings)].join('\n'));
  }

  console.log('');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
