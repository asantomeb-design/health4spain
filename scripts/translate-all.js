#!/usr/bin/env node
/**
 * Traduce TODO el contenido de Supabase de ES → EN, FR, DE, PT
 * usando la API de OpenAI (gpt-4o-mini para coste bajo).
 *
 * Traduce:
 *   1. ciudades_catalogo_traducciones (descripcion, perfil_economico)
 *   2. landing_pages (76 filas × 4 idiomas = 304 filas nuevas)
 *   3. blog_posts (30 filas × 4 idiomas = 120 filas nuevas)
 *
 * Uso:
 *   node scripts/translate-all.js                  # todo
 *   node scripts/translate-all.js --only=ciudades  # solo ciudades
 *   node scripts/translate-all.js --only=landings  # solo landing pages
 *   node scripts/translate-all.js --only=blog      # solo blog posts
 *   node scripts/translate-all.js --dry-run        # sin insertar, solo muestra
 *
 * El script completa TODO en una sola ejecución: reintentos automáticos ante
 * rate limits, pausa de 2s entre posts, y reintento de fallidos al final.
 */

const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const TARGET_LANGS = ['en', 'fr', 'de', 'pt'];
const LANG_NAMES = { en: 'English', fr: 'French', de: 'German', pt: 'Portuguese' };
const MODEL = 'gpt-4o-mini';

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const ONLY = args.find(a => a.startsWith('--only='))?.split('=')[1];

let totalTokens = 0;
let totalInserted = 0;
let totalSkipped = 0;
let totalErrors = 0;

// ─── Helpers ──────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function translateJSON(obj, targetLang, context) {
  const prompt = `You are a professional translator. Translate the following JSON values from Spanish to ${LANG_NAMES[targetLang]}.

RULES:
- Translate ONLY the values, keep all keys exactly the same.
- Keep proper nouns (city names, brand names) unchanged.
- Keep HTML tags, URLs, and emoji unchanged.
- Maintain the same JSON structure exactly.
- For SEO fields (meta_title, meta_description), keep them natural and within character limits.
- Return ONLY valid JSON, no markdown, no explanation.

Context: ${context}

JSON to translate:
${JSON.stringify(obj, null, 2)}`;

  const maxAttempts = 6;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      });

      totalTokens += response.usage?.total_tokens || 0;
      const text = response.choices[0].message.content;
      return JSON.parse(text);
    } catch (err) {
      const isRateLimit = (err.status === 429 || err.statusCode === 429) || /rate limit|Rate limit|overloaded/i.test(err.message || '');
      const waitMs = isRateLimit ? 60000 : 3000 * (attempt + 1);
      if (attempt < maxAttempts - 1) {
        console.log(`    ⏳ Reintento ${attempt + 1}/${maxAttempts}${isRateLimit ? ' (rate limit, esperando 60s)' : ''}: ${err.message}`);
        await sleep(waitMs);
      } else {
        throw err;
      }
    }
  }
}

// ─── 1. Ciudades catálogo traducciones ────────────────────

async function translateCiudadesCatalogo() {
  console.log('\n' + '='.repeat(65));
  console.log('1. CIUDADES CATÁLOGO TRADUCCIONES');
  console.log('='.repeat(65));

  const { data: existingES } = await supabase
    .from('ciudades_catalogo_traducciones')
    .select('*')
    .eq('idioma', 'es');

  if (!existingES?.length) {
    console.log('  ⚠️  No hay filas en español. Nada que traducir.');
    return;
  }

  for (const lang of TARGET_LANGS) {
    const { data: existing } = await supabase
      .from('ciudades_catalogo_traducciones')
      .select('ciudad_slug')
      .eq('idioma', lang);

    const existingSlugs = new Set((existing || []).map(r => r.ciudad_slug));
    const toTranslate = existingES.filter(r => !existingSlugs.has(r.ciudad_slug));

    if (toTranslate.length === 0) {
      console.log(`  ✅ ${lang}: ya completo (${existing.length} filas)`);
      totalSkipped += existingES.length;
      continue;
    }

    console.log(`  🔄 ${lang}: traduciendo ${toTranslate.length} ciudades...`);

    const batch = toTranslate.map(r => ({
      slug: r.ciudad_slug,
      descripcion: r.descripcion,
      perfil_economico: r.perfil_economico
    }));

    try {
      const translated = await translateJSON(
        { ciudades: batch }, lang,
        'Short descriptions of Spanish cities for a real estate/services website'
      );

      const rows = (translated.ciudades || []).map(c => ({
        ciudad_slug: c.slug,
        idioma: lang,
        descripcion: c.descripcion,
        perfil_economico: c.perfil_economico
      }));

      if (!DRY_RUN) {
        const { error } = await supabase
          .from('ciudades_catalogo_traducciones')
          .upsert(rows, { onConflict: 'ciudad_slug,idioma' });
        if (error) throw error;
      }
      console.log(`  ✅ ${lang}: ${rows.length} ciudades insertadas`);
      totalInserted += rows.length;
    } catch (err) {
      console.log(`  ❌ ${lang}: ${err.message}`);
      totalErrors++;
    }
  }
}

// ─── 2. Landing pages ─────────────────────────────────────

async function translateLandingPages() {
  console.log('\n' + '='.repeat(65));
  console.log('2. LANDING PAGES');
  console.log('='.repeat(65));

  const { data: pagesES } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('idioma', 'es')
    .eq('activo', true);

  if (!pagesES?.length) {
    console.log('  ⚠️  No hay landing pages en español.');
    return;
  }

  console.log(`  Encontradas ${pagesES.length} landing pages en español`);

  const TRANSLATABLE_FIELDS = [
    'servicio_nombre', 'meta_title', 'meta_description', 'meta_keywords',
    'hero_title', 'hero_subtitle', 'problem_title', 'solution_title',
    'solution_text', 'services_title', 'why_city_title', 'why_city_text',
    'cta_title', 'cta_subtitle'
  ];
  const TRANSLATABLE_JSON_FIELDS = [
    'hero_bullets', 'problems', 'services', 'why_city_stats', 'faqs'
  ];

  for (const lang of TARGET_LANGS) {
    const { data: existing } = await supabase
      .from('landing_pages')
      .select('slug')
      .eq('idioma', lang);

    const existingSlugs = new Set((existing || []).map(r => r.slug));
    const toTranslate = pagesES.filter(r => !existingSlugs.has(r.slug));

    if (toTranslate.length === 0) {
      console.log(`  ✅ ${lang}: ya completo (${existing.length} filas)`);
      totalSkipped += pagesES.length;
      continue;
    }

    console.log(`  🔄 ${lang}: traduciendo ${toTranslate.length} landing pages...`);

    // Procesar en lotes de 5
    const BATCH_SIZE = 5;
    for (let i = 0; i < toTranslate.length; i += BATCH_SIZE) {
      const batch = toTranslate.slice(i, i + BATCH_SIZE);
      const progress = `[${i + 1}-${Math.min(i + BATCH_SIZE, toTranslate.length)}/${toTranslate.length}]`;

      const toSend = batch.map(page => {
        const obj = {};
        obj._slug = page.slug;
        for (const f of TRANSLATABLE_FIELDS) {
          if (page[f]) obj[f] = page[f];
        }
        for (const f of TRANSLATABLE_JSON_FIELDS) {
          if (page[f] && JSON.stringify(page[f]) !== '[]') obj[f] = page[f];
        }
        return obj;
      });

      try {
        const translated = await translateJSON(
          { pages: toSend }, lang,
          'SEO landing pages for Health4Spain, a website helping foreigners find services (lawyers, insurance, real estate, tax advisors) in Spanish cities. Keep city names in Spanish.'
        );

        const rows = (translated.pages || []).map((tp, idx) => {
          const original = batch[idx];
          const newRow = { ...original };
          delete newRow.id;
          delete newRow.created_at;
          delete newRow.updated_at;

          newRow.idioma = lang;
          newRow.generado_por_ia = true;
          newRow.revisado = false;
          newRow.fecha_generacion = new Date().toISOString();

          for (const f of TRANSLATABLE_FIELDS) {
            if (tp[f]) newRow[f] = tp[f];
          }
          for (const f of TRANSLATABLE_JSON_FIELDS) {
            if (tp[f]) newRow[f] = tp[f];
          }

          return newRow;
        });

        if (!DRY_RUN) {
          const { error } = await supabase
            .from('landing_pages')
            .upsert(rows, { onConflict: 'slug,idioma' });
          if (error) throw error;
        }
        console.log(`    ${progress} ✅ ${rows.length} páginas (${lang})`);
        totalInserted += rows.length;
      } catch (err) {
        console.log(`    ${progress} ❌ ${err.message}`);
        totalErrors++;
      }

      if (i + BATCH_SIZE < toTranslate.length) await sleep(2000);
    }
  }
}

// ─── 3. Blog posts ────────────────────────────────────────

async function translateBlogPosts() {
  console.log('\n' + '='.repeat(65));
  console.log('3. BLOG POSTS');
  console.log('='.repeat(65));

  const { data: postsES } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('lang', 'es');

  if (!postsES?.length) {
    console.log('  ⚠️  No hay blog posts en español.');
    return;
  }

  console.log(`  Encontrados ${postsES.length} blog posts en español`);

  for (const lang of TARGET_LANGS) {
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('lang', lang);

    const existingSlugs = new Set((existing || []).map(r => r.slug));
    const toTranslate = postsES.filter(r => !existingSlugs.has(r.slug));

    if (toTranslate.length === 0) {
      console.log(`  ✅ ${lang}: ya completo (${existing.length} filas)`);
      totalSkipped += postsES.length;
      continue;
    }

    console.log(`  🔄 ${lang}: traduciendo ${toTranslate.length} posts...`);

    const failed = [];
    for (let i = 0; i < toTranslate.length; i++) {
      const post = toTranslate[i];
      const progress = `[${i + 1}/${toTranslate.length}]`;

      const toSend = {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        meta_title: post.meta_title,
        meta_description: post.meta_description,
        tags: post.tags
      };

      try {
        const translated = await translateJSON(
          toSend, lang,
          'Blog article for Health4Spain. Content may contain HTML. Preserve all HTML tags, links, and formatting. Translate naturally for SEO.'
        );

        const newRow = {
          slug: post.slug,
          title: translated.title || post.title,
          excerpt: translated.excerpt || post.excerpt,
          content: translated.content || post.content,
          featured_image: post.featured_image,
          category: post.category,
          tags: translated.tags || post.tags,
          meta_title: translated.meta_title || post.meta_title,
          meta_description: translated.meta_description || post.meta_description,
          lang: lang,
          translations: {},
          author_id: post.author_id,
          author_name: post.author_name,
          status: post.status,
          published_at: post.published_at,
          views: 0
        };

        if (!DRY_RUN) {
          const { error } = await supabase
            .from('blog_posts')
            .upsert(newRow, { onConflict: 'slug,lang' });
          if (error) throw error;
        }
        console.log(`    ${progress} ✅ "${post.slug}" → ${lang}`);
        totalInserted++;
      } catch (err) {
        console.log(`    ${progress} ❌ "${post.slug}": ${err.message}`);
        totalErrors++;
        failed.push(post);
      }

      if (i < toTranslate.length - 1) await sleep(2000);
    }

    if (failed.length > 0) {
      console.log(`  🔁 Reintentando ${failed.length} posts fallidos...`);
      await sleep(10000);
      for (let i = 0; i < failed.length; i++) {
        const post = failed[i];
        try {
          const translated = await translateJSON(
            { title: post.title, excerpt: post.excerpt, content: post.content, meta_title: post.meta_title, meta_description: post.meta_description, tags: post.tags },
            lang,
            'Blog article for Health4Spain. Content may contain HTML. Preserve all HTML tags, links, and formatting. Translate naturally for SEO.'
          );
          const newRow = {
            slug: post.slug,
            title: translated.title || post.title,
            excerpt: translated.excerpt || post.excerpt,
            content: translated.content || post.content,
            featured_image: post.featured_image,
            category: post.category,
            tags: translated.tags || post.tags,
            meta_title: translated.meta_title || post.meta_title,
            meta_description: translated.meta_description || post.meta_description,
            lang: lang,
            translations: {},
            author_id: post.author_id,
            author_name: post.author_name,
            status: post.status,
            published_at: post.published_at,
            views: 0
          };
          if (!DRY_RUN) {
            const { error } = await supabase.from('blog_posts').upsert(newRow, { onConflict: 'slug,lang' });
            if (error) throw error;
          }
          console.log(`    [retry] ✅ "${post.slug}" → ${lang}`);
          totalInserted++;
          totalErrors--;
        } catch (err) {
          console.log(`    [retry] ❌ "${post.slug}": ${err.message}`);
        }
        if (i < failed.length - 1) await sleep(5000);
      }
    }
  }
}

// ─── Main ─────────────────────────────────────────────────

async function main() {
  console.log('🌍 TRADUCCIÓN MASIVA CON OPENAI');
  console.log(`   Modelo: ${MODEL}`);
  console.log(`   Idiomas destino: ${TARGET_LANGS.join(', ')}`);
  console.log(`   Modo: ${DRY_RUN ? '🧪 DRY RUN (sin insertar)' : '🚀 PRODUCCIÓN'}`);
  if (ONLY) console.log(`   Filtro: solo ${ONLY}`);
  console.log('');

  const start = Date.now();

  if (!ONLY || ONLY === 'ciudades') await translateCiudadesCatalogo();
  if (!ONLY || ONLY === 'landings') await translateLandingPages();
  if (!ONLY || ONLY === 'blog')     await translateBlogPosts();

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  const costEstimate = ((totalTokens / 1000000) * 0.15).toFixed(4);

  console.log('\n' + '='.repeat(65));
  console.log('RESUMEN');
  console.log('='.repeat(65));
  console.log(`  ✅ Insertadas:  ${totalInserted} filas`);
  console.log(`  ⏭️  Omitidas:   ${totalSkipped} (ya existían)`);
  console.log(`  ❌ Errores:     ${totalErrors}`);
  console.log(`  🔤 Tokens:      ${totalTokens.toLocaleString()}`);
  console.log(`  💰 Coste aprox: $${costEstimate} (gpt-4o-mini)`);
  console.log(`  ⏱️  Tiempo:      ${elapsed}s`);
  console.log('');
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
