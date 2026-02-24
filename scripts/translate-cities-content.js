#!/usr/bin/env node
/**
 * Traduce el contenido de ciudades_contenido de ES → EN, FR, DE, PT
 * usando OpenAI (gpt-4o para mantener calidad del contenido largo)
 *
 * Uso:
 *   node scripts/translate-cities-content.js               # Todas las ciudades
 *   node scripts/translate-cities-content.js murcia        # Solo Murcia
 *   node scripts/translate-cities-content.js --dry-run     # Sin insertar
 *   node scripts/translate-cities-content.js --only=en     # Solo inglés
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
const MODEL = 'gpt-4o';

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const ONLY_LANG = args.find(a => a.startsWith('--only='))?.split('=')[1];
const FORCE = args.includes('--force');
const TARGET_CITIES = args.filter(arg => !arg.includes('node') && !arg.includes('.js') && !arg.startsWith('--'));

let totalTokens = 0;
let totalTranslated = 0;
let totalSkipped = 0;
let totalErrors = 0;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function translateCityContent(contenidoES, targetLang, ciudadNombre) {
  console.log(`  📝 Traduciendo a ${LANG_NAMES[targetLang]}...`);
  
  // Preparar el contenido a traducir (todo lo textual, incluidas nuevas secciones)
  const toTranslate = {
    meta_title: contenidoES.meta_title,
    meta_description: contenidoES.meta_description,
    meta_keywords: contenidoES.meta_keywords,
    intro_text: contenidoES.intro_text,
    ventajas: contenidoES.ventajas,
    barrios: contenidoES.barrios,
    coste_vida_alquiler: contenidoES.coste_vida_alquiler,
    coste_vida_compra: contenidoES.coste_vida_compra,
    coste_vida_alimentacion: contenidoES.coste_vida_alimentacion,
    coste_vida_transporte: contenidoES.coste_vida_transporte,
    coste_vida_utilidades: contenidoES.coste_vida_utilidades,
    tramites: contenidoES.tramites,
    faqs: contenidoES.faqs,
    clima_detalle: contenidoES.clima_detalle,
    primeros_30_dias: contenidoES.primeros_30_dias,
    consulados_embajadas: contenidoES.consulados_embajadas,
    trabajo_emprendimiento: contenidoES.trabajo_emprendimiento,
    condiciones_entrada: contenidoES.condiciones_entrada,
    riesgos_frontera: contenidoES.riesgos_frontera,
    residencia_nacionalidad: contenidoES.residencia_nacionalidad,
    integracion_practica: contenidoES.integracion_practica,
    checklists: contenidoES.checklists,
  };

  const prompt = `You are a professional translator specializing in real estate and migration content. Translate the following content about living in ${ciudadNombre}, Spain from Spanish to ${LANG_NAMES[targetLang]}.

CRITICAL RULES:
- Translate ONLY the values, keep all JSON keys exactly the same
- Keep the city name "${ciudadNombre}" in Spanish (don't translate it)
- Keep proper nouns (street names, neighborhood names, institutions) in Spanish
- Keep prices in euros (€) and measurements as they are
- Translate naturally and professionally for ${LANG_NAMES[targetLang]} speakers
- Maintain HTML tags if present
- Keep the same JSON structure exactly
- Return ONLY valid JSON, no markdown, no explanation

CONTEXT: This is SEO content for foreigners who want to move to ${ciudadNombre}, Spain. The tone should be welcoming, professional, and practical.

JSON to translate:
${JSON.stringify(toTranslate, null, 2)}`;

  const maxAttempts = 5;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      });

      totalTokens += response.usage?.total_tokens || 0;
      const translated = JSON.parse(response.choices[0].message.content);
      
      console.log(`    ✅ Traducido (${response.usage?.total_tokens} tokens)`);
      return translated;
    } catch (err) {
      const isRateLimit = (err.status === 429 || err.statusCode === 429) || /rate limit|Rate limit|overloaded/i.test(err.message || '');
      const waitMs = isRateLimit ? 60000 : 5000 * (attempt + 1);
      
      if (attempt < maxAttempts - 1) {
        console.log(`    ⏳ Reintento ${attempt + 1}/${maxAttempts}${isRateLimit ? ' (rate limit, 60s)' : ''}: ${err.message}`);
        await sleep(waitMs);
      } else {
        throw err;
      }
    }
  }
}

async function processCiudad(contenidoES, ciudad) {
  console.log(`\n🌍 ${ciudad.nombre} (${ciudad.slug})`);
  
  const langsToProcess = ONLY_LANG ? [ONLY_LANG] : TARGET_LANGS;
  
  for (const lang of langsToProcess) {
    // Verificar si ya existe
    const { data: existing } = await supabase
      .from('ciudades_contenido')
      .select('ciudad_slug')
      .eq('ciudad_slug', ciudad.slug)
      .eq('idioma', lang)
      .single();

    if (existing && !FORCE) {
      console.log(`  ⏭️  ${lang}: ya existe (usa --force para sobrescribir)`);
      totalSkipped++;
      continue;
    }

    try {
      const translated = await translateCityContent(contenidoES, lang, ciudad.nombre);
      
      if (!DRY_RUN) {
        const row = {
          ciudad_slug: ciudad.slug,
          idioma: lang,
          meta_title: translated.meta_title || contenidoES.meta_title,
          meta_description: translated.meta_description || contenidoES.meta_description,
          meta_keywords: translated.meta_keywords || contenidoES.meta_keywords,
          intro_text: translated.intro_text || contenidoES.intro_text,
          ventajas: translated.ventajas || contenidoES.ventajas,
          barrios: translated.barrios || contenidoES.barrios,
          coste_vida_alquiler: translated.coste_vida_alquiler || contenidoES.coste_vida_alquiler,
          coste_vida_compra: translated.coste_vida_compra || contenidoES.coste_vida_compra,
          coste_vida_alimentacion: translated.coste_vida_alimentacion || contenidoES.coste_vida_alimentacion,
          coste_vida_transporte: translated.coste_vida_transporte || contenidoES.coste_vida_transporte,
          coste_vida_utilidades: translated.coste_vida_utilidades || contenidoES.coste_vida_utilidades,
          tramites: translated.tramites || contenidoES.tramites,
          faqs: translated.faqs || contenidoES.faqs,
          clima_detalle: translated.clima_detalle || contenidoES.clima_detalle,
          primeros_30_dias: translated.primeros_30_dias || contenidoES.primeros_30_dias,
          consulados_embajadas: translated.consulados_embajadas || contenidoES.consulados_embajadas,
          trabajo_emprendimiento: translated.trabajo_emprendimiento || contenidoES.trabajo_emprendimiento,
          condiciones_entrada: translated.condiciones_entrada || contenidoES.condiciones_entrada,
          riesgos_frontera: translated.riesgos_frontera || contenidoES.riesgos_frontera,
          residencia_nacionalidad: translated.residencia_nacionalidad || contenidoES.residencia_nacionalidad,
          integracion_practica: translated.integracion_practica || contenidoES.integracion_practica,
          checklists: translated.checklists || contenidoES.checklists,
          temperatura_media: contenidoES.temperatura_media,
          dias_sol: contenidoES.dias_sol,
          activo: true,
          generado_por_ia: true,
          revisado: false,
          fecha_generacion: new Date().toISOString()
        };

        const { error } = await supabase
          .from('ciudades_contenido')
          .upsert(row, { onConflict: 'ciudad_slug,idioma' });

        if (error) throw error;
        console.log(`    💾 Guardado en Supabase`);
      } else {
        console.log(`    🧪 DRY RUN: no insertando`);
      }
      
      totalTranslated++;
      await sleep(3000); // Pausa entre traducciones
      
    } catch (err) {
      console.log(`    ❌ Error: ${err.message}`);
      totalErrors++;
    }
  }
}

async function main() {
  console.log('🌐 TRADUCCIÓN DE CONTENIDO DE CIUDADES');
  console.log(`   Modelo: ${MODEL}`);
  console.log(`   Idiomas: ${ONLY_LANG || TARGET_LANGS.join(', ')}`);
  console.log(`   Modo: ${DRY_RUN ? '🧪 DRY RUN' : '🚀 PRODUCCIÓN'}`);
  console.log('');

  const start = Date.now();

  // Obtener contenido en español
  const { data: contenidosES } = await supabase
    .from('ciudades_contenido')
    .select('*')
    .eq('idioma', 'es')
    .order('ciudad_slug');

  if (!contenidosES?.length) {
    console.error('❌ No hay contenido en español en ciudades_contenido');
    process.exit(1);
  }

  console.log(`📋 ${contenidosES.length} ciudades con contenido en español\n`);

  // Obtener info de ciudades del catálogo
  const { data: ciudades } = await supabase
    .from('ciudades_catalogo')
    .select('slug, nombre')
    .in('slug', contenidosES.map(c => c.ciudad_slug));

  const ciudadesMap = new Map(ciudades.map(c => [c.slug, c]));

  // Filtrar si se especificaron ciudades
  let contenidosToProcess = contenidosES;
  if (TARGET_CITIES.length > 0) {
    contenidosToProcess = contenidosES.filter(c => 
      TARGET_CITIES.some(target => 
        c.ciudad_slug === target || ciudadesMap.get(c.ciudad_slug)?.nombre.toLowerCase().includes(target.toLowerCase())
      )
    );
    if (contenidosToProcess.length === 0) {
      console.error(`❌ No se encontraron ciudades que coincidan con: ${TARGET_CITIES.join(', ')}`);
      process.exit(1);
    }
  }

  console.log(`🔄 Procesando ${contenidosToProcess.length} ciudades...\n`);

  for (const contenidoES of contenidosToProcess) {
    const ciudad = ciudadesMap.get(contenidoES.ciudad_slug);
    if (!ciudad) {
      console.log(`⚠️  Ciudad ${contenidoES.ciudad_slug} no encontrada en catálogo, saltando...`);
      continue;
    }
    
    await processCiudad(contenidoES, ciudad);
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  const costEstimate = ((totalTokens / 1000000) * 2.50).toFixed(4); // gpt-4o: ~$2.50/M tokens

  console.log('\n' + '='.repeat(65));
  console.log('RESUMEN');
  console.log('='.repeat(65));
  console.log(`  ✅ Traducidas:  ${totalTranslated} páginas`);
  console.log(`  ⏭️  Omitidas:    ${totalSkipped} (ya existían)`);
  console.log(`  ❌ Errores:     ${totalErrors}`);
  console.log(`  🔤 Tokens:      ${totalTokens.toLocaleString()}`);
  console.log(`  💰 Coste aprox: $${costEstimate} (gpt-4o)`);
  console.log(`  ⏱️  Tiempo:      ${elapsed}s`);
  console.log('');
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
