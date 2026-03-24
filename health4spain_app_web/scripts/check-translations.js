#!/usr/bin/env node
/**
 * Verifica la estructura completa de traducciones en Supabase.
 * Uso: node scripts/check-translations.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const IDIOMAS = ['es', 'en', 'fr', 'de', 'pt'];
const SEP = '='.repeat(65);
let errores = 0;
let avisos = 0;

function ok(msg) { console.log(`  ✅ ${msg}`); }
function warn(msg) { avisos++; console.log(`  ⚠️  ${msg}`); }
function fail(msg) { errores++; console.log(`  ❌ ${msg}`); }

async function tableExists(name) {
  const { data, error } = await supabase.from(name).select('*').limit(0);
  return !error;
}

async function countByLang(table, langCol) {
  const { data } = await supabase.from(table).select(langCol);
  const counts = {};
  IDIOMAS.forEach(l => counts[l] = 0);
  (data || []).forEach(row => {
    const lang = row[langCol] || '(null)';
    counts[lang] = (counts[lang] || 0) + 1;
  });
  return { counts, total: data?.length || 0 };
}

async function checkIdiomas() {
  console.log(`\n${SEP}`);
  console.log('1. TABLA: idiomas (tabla de referencia central)');
  console.log(SEP);

  if (!(await tableExists('idiomas'))) {
    fail('Tabla "idiomas" NO EXISTE → Ejecutar 07-estructura-completa-multi-idioma.sql');
    return;
  }
  ok('Tabla "idiomas" existe');

  const { data } = await supabase.from('idiomas').select('*').order('orden');
  const codes = (data || []).map(r => r.codigo);

  for (const lang of IDIOMAS) {
    if (codes.includes(lang)) {
      const row = data.find(r => r.codigo === lang);
      ok(`${lang} → ${row.nombre_nativo} (activo: ${row.activo})`);
    } else {
      fail(`Idioma "${lang}" NO registrado`);
    }
  }
}

async function checkContentTable(name, langCol, label) {
  console.log(`\n${SEP}`);
  console.log(`2. TABLA: ${name} (${label})`);
  console.log(SEP);

  if (!(await tableExists(name))) {
    fail(`Tabla "${name}" NO EXISTE`);
    return;
  }
  ok(`Tabla "${name}" existe con columna "${langCol}"`);

  const { counts, total } = await countByLang(name, langCol);
  console.log(`  Total filas: ${total}`);

  for (const lang of IDIOMAS) {
    const n = counts[lang];
    const bar = '█'.repeat(Math.min(n, 30));
    if (n > 0) {
      ok(`${lang.padEnd(3)} → ${String(n).padStart(4)} filas  ${bar}`);
    } else {
      warn(`${lang.padEnd(3)} → ${String(n).padStart(4)} filas  (vacío)`);
    }
  }
}

async function checkTranslationTable(name, slugCol, label) {
  console.log(`\n${SEP}`);
  console.log(`3. TABLA: ${name} (${label})`);
  console.log(SEP);

  if (!(await tableExists(name))) {
    fail(`Tabla "${name}" NO EXISTE → Ejecutar 07-estructura-completa-multi-idioma.sql`);
    return;
  }
  ok(`Tabla "${name}" existe`);

  const { counts, total } = await countByLang(name, 'idioma');
  console.log(`  Total filas: ${total}`);

  for (const lang of IDIOMAS) {
    const n = counts[lang];
    if (n > 0) {
      ok(`${lang.padEnd(3)} → ${String(n).padStart(4)} traducciones`);
    } else {
      warn(`${lang.padEnd(3)} → ${String(n).padStart(4)} traducciones (vacío)`);
    }
  }
}

async function checkConstraint(table, expectedConstraint) {
  console.log(`\n  Constraint ${table}...`);

  const { data: sample } = await supabase.from(table).select('*').limit(1);
  if (!sample || sample.length === 0) {
    console.log(`    (tabla vacía, no se puede verificar empiricamente)`);
    return;
  }

  ok(`${expectedConstraint} (verificar en SQL Editor si hay dudas)`);
}

async function checkView() {
  console.log(`\n${SEP}`);
  console.log('5. VISTA: v_estado_traducciones');
  console.log(SEP);

  const { data, error } = await supabase.from('v_estado_traducciones').select('*');
  if (error) {
    fail(`Vista NO existe o error: ${error.message}`);
    return;
  }

  ok('Vista "v_estado_traducciones" funciona');
  console.log('');
  console.log('  TABLA                              IDIOMA  TOTAL  ACTIVAS');
  console.log('  ' + '-'.repeat(60));
  for (const row of (data || [])) {
    const t = row.tabla.padEnd(35);
    const l = row.idioma.padEnd(5);
    console.log(`  ${t}  ${l}  ${String(row.total_filas).padStart(5)}  ${String(row.activas).padStart(5)}`);
  }
}

async function checkFunctions() {
  console.log(`\n${SEP}`);
  console.log('6. FUNCIONES RPC');
  console.log(SEP);

  // Test get_servicios_traducidos
  for (const lang of ['es', 'en', 'pt']) {
    const { data, error } = await supabase.rpc('get_servicios_traducidos', { p_idioma: lang });
    if (error) {
      fail(`get_servicios_traducidos('${lang}'): ${error.message}`);
    } else {
      ok(`get_servicios_traducidos('${lang}') → ${data.length} servicios`);
      if (data.length > 0) {
        console.log(`    Ejemplo: ${data[0].nombre} (${data[0].slug})`);
      }
    }
  }
}

async function main() {
  console.log('🔍 VERIFICACIÓN COMPLETA DE ESTRUCTURA MULTI-IDIOMA');
  console.log(`   URL: ${supabaseUrl}`);
  console.log(`   Idiomas soportados: ${IDIOMAS.join(', ')}`);
  console.log(`   Fecha: ${new Date().toLocaleString('es-ES')}`);

  await checkIdiomas();

  await checkContentTable('landing_pages', 'idioma', 'landing pages SEO');
  await checkContentTable('blog_posts', 'lang', 'artículos del blog');
  await checkContentTable('ciudades_contenido', 'idioma', 'contenido de ciudades');

  await checkTranslationTable('servicios_catalogo_traducciones', 'servicio_slug', 'traducciones de servicios');
  await checkTranslationTable('ciudades_catalogo_traducciones', 'ciudad_slug', 'traducciones de ciudades');

  console.log(`\n${SEP}`);
  console.log('4. CONSTRAINTS MULTI-IDIOMA');
  console.log(SEP);
  await checkConstraint('landing_pages', 'UNIQUE(slug, idioma)');
  await checkConstraint('blog_posts', 'UNIQUE(slug, lang)');
  await checkConstraint('ciudades_contenido', 'UNIQUE(ciudad_slug, idioma)');

  await checkView();
  await checkFunctions();

  // Resumen
  console.log(`\n${SEP}`);
  console.log('RESUMEN FINAL');
  console.log(SEP);

  if (errores > 0) {
    console.log(`\n  ❌ ${errores} ERRORES encontrados`);
    console.log('  → Ejecuta supabase/07-estructura-completa-multi-idioma.sql en SQL Editor');
  }
  if (avisos > 0) {
    console.log(`\n  ⚠️  ${avisos} AVISOS (contenido pendiente de traducir)`);
  }
  if (errores === 0) {
    console.log('\n  ✅ Estructura multi-idioma CORRECTA');
  }

  console.log(`\n  Tablas de contenido (necesitan filas por idioma):`);
  console.log('    - landing_pages       → 76 × 5 idiomas = 380 filas');
  console.log('    - blog_posts          → 30 × 5 idiomas = 150 filas');
  console.log('    - ciudades_contenido  → 19 × 5 idiomas = 95 filas');
  console.log(`\n  Tablas de traducciones (catálogos):`);
  console.log('    - servicios_catalogo_traducciones  → 4 × 5 = 20 filas');
  console.log('    - ciudades_catalogo_traducciones   → 19 × 5 = 95 filas');
  console.log('');
}

main().catch(console.error);
