#!/usr/bin/env node
/**
 * Genera contenido SEO completo para páginas de ciudades usando OpenAI
 * Basado en GUIA_COTENIDO_LANDING_DESTINOS
 *
 * Uso:
 *   node scripts/generate-city-content.js               # Todas las ciudades
 *   node scripts/generate-city-content.js murcia        # Solo Murcia
 *   node scripts/generate-city-content.js murcia alicante  # Murcia y Alicante
 *   node scripts/generate-city-content.js --dry-run     # Sin insertar en DB
 */

const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MODEL = 'gpt-4o';  // Mejor modelo para contenido largo y de calidad
const DRY_RUN = process.argv.includes('--dry-run');
const TARGET_CITIES = process.argv.filter(arg => !arg.includes('node') && !arg.includes('.js') && !arg.startsWith('--'));

let totalTokens = 0;
let totalGenerated = 0;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Leer la guía de contenido
const guiaPath = path.join(__dirname, '..', 'GUIA_COTENIDO_LANDING_DESTINOS');
let GUIA_CONTENT = '';
try {
  GUIA_CONTENT = fs.readFileSync(guiaPath, 'utf-8');
} catch {
  console.error(`❌ No se encontró GUIA_COTENIDO_LANDING_DESTINOS`);
  process.exit(1);
}

async function generateCityContent(ciudad) {
  console.log(`\n📝 Generando contenido para ${ciudad.nombre} (${ciudad.slug})...`);
  
  const prompt = `Eres un experto en contenido SEO y migración a España. Vas a crear contenido completo para una landing page sobre "Vivir en ${ciudad.nombre}" dirigido a extranjeros que quieren mudarse a España.

CONTEXTO DE LA CIUDAD:
- Nombre: ${ciudad.nombre}
- Población: ${ciudad.poblacion} habitantes
- % Extranjeros: ${ciudad.porcentaje_extranjeros}%
- Provincia: ${ciudad.provincia}
${ciudad.datos_extra ? `- Datos adicionales: ${JSON.stringify(ciudad.datos_extra)}` : ''}

GUÍA DE CONTENIDO (úsala como estructura y referencia):
${GUIA_CONTENT}

IMPORTANTE:
- Escribe en español de España, tono cercano pero profesional
- Datos específicos de ${ciudad.nombre}, no genéricos
- Incluye precios reales aproximados de 2026
- Menciona barrios/zonas reales de ${ciudad.nombre}
- FAQs relevantes y prácticas

Genera el siguiente JSON (SOLO JSON válido, sin markdown):

{
  "meta_title": "Vivir en ${ciudad.nombre} 2026: Guía Completa para Extranjeros",
  "meta_description": "Todo sobre vivir en ${ciudad.nombre}: costos, trámites, barrios, ventajas. Guía práctica 2026 para extranjeros.",
  "meta_keywords": ["vivir en ${ciudad.nombre}", "mudarse a ${ciudad.nombre}", "extranjeros ${ciudad.nombre}", "coste de vida ${ciudad.nombre}"],
  "intro_text": "Párrafo intro de 3-4 líneas sobre por qué ${ciudad.nombre} es buena opción para extranjeros. Menciona clima, coste de vida, comunidad internacional.",
  "ventajas": [
    "Ventaja 1 específica de ${ciudad.nombre}",
    "Ventaja 2",
    "Ventaja 3",
    "Ventaja 4",
    "Ventaja 5"
  ],
  "barrios": [
    {
      "nombre": "Barrio real 1",
      "descripcion": "Descripción de 2-3 líneas: tipo de zona, precios aprox, perfil de residentes"
    },
    {
      "nombre": "Barrio real 2",
      "descripcion": "..."
    },
    {
      "nombre": "Barrio real 3",
      "descripcion": "..."
    }
  ],
  "coste_vida_alquiler": "Apartamento 1 dormitorio centro: 600-800€/mes. 2 dormitorios: 800-1000€. Zonas residenciales: 20-30% más barato. Depósito: 1-2 meses.",
  "coste_vida_compra": "Precio medio m²: 1500-2000€. Apartamento 70m² centro: 105.000-140.000€. Zonas residenciales: desde 90.000€. Gastos notaría + impuestos: ~10%.",
  "coste_vida_alimentacion": "Supermercado semanal (2 personas): 60-80€. Menú del día: 10-14€. Cena restaurante (2 personas): 35-50€. Mercado local: frutas/verduras muy económicas.",
  "coste_vida_transporte": "Billete bus: 1,50€. Bono mensual: 30-40€. Taxi aeropuerto-centro: 15-25€. Gasolina: 1,50€/L. Parking centro: 80-120€/mes.",
  "coste_vida_utilidades": "Luz + gas (70m²): 80-120€/mes. Agua: 25-40€/mes. Internet fibra: 30-50€/mes. Móvil: 10-30€/mes. Total mensual: ~150-250€.",
  "tramites": [
    "Solicitar NIE en Oficina de Extranjería o comisaría",
    "Empadronamiento en Ayuntamiento con contrato de alquiler",
    "Solicitud TIE (si aplica) tras empadronamiento",
    "Abrir cuenta bancaria con NIE y empadronamiento",
    "Alta en Seguridad Social si trabajas por cuenta ajena"
  ],
  "faqs": [
    {
      "pregunta": "¿Cuánto dinero necesito para mudarme a ${ciudad.nombre}?",
      "respuesta": "Respuesta práctica de 3-4 líneas con cifras reales"
    },
    {
      "pregunta": "¿Es difícil encontrar alquiler en ${ciudad.nombre}?",
      "respuesta": "..."
    },
    {
      "pregunta": "¿Qué visado necesito para vivir en ${ciudad.nombre}?",
      "respuesta": "..."
    },
    {
      "pregunta": "¿Hay comunidad internacional en ${ciudad.nombre}?",
      "respuesta": "..."
    },
    {
      "pregunta": "¿Cómo es el sistema de salud en ${ciudad.nombre}?",
      "respuesta": "..."
    }
  ],
  "clima_detalle": "Clima mediterráneo con 300+ días de sol. Veranos calurosos (28-35°C), inviernos suaves (10-18°C). Lluvias escasas (Oct-Nov). Ideal para vida al aire libre.",
  "temperatura_media": "19°C",
  "dias_sol": 320
}`;

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    totalTokens += response.usage?.total_tokens || 0;
    const content = JSON.parse(response.choices[0].message.content);
    
    console.log(`  ✅ Contenido generado (${response.usage?.total_tokens} tokens)`);
    return content;
  } catch (err) {
    console.log(`  ❌ Error: ${err.message}`);
    throw err;
  }
}

async function insertCityContent(ciudad, content) {
  if (DRY_RUN) {
    console.log(`  🧪 DRY RUN: no insertando en DB`);
    console.log(`  Contenido generado:`, JSON.stringify(content, null, 2).slice(0, 500) + '...');
    return;
  }

  const row = {
    ciudad_slug: ciudad.slug,
    idioma: 'es',
    meta_title: content.meta_title,
    meta_description: content.meta_description,
    meta_keywords: Array.isArray(content.meta_keywords) ? content.meta_keywords.join(', ') : content.meta_keywords,
    intro_text: content.intro_text,
    ventajas: content.ventajas,
    barrios: content.barrios,
    coste_vida_alquiler: content.coste_vida_alquiler,
    coste_vida_compra: content.coste_vida_compra,
    coste_vida_alimentacion: content.coste_vida_alimentacion,
    coste_vida_transporte: content.coste_vida_transporte,
    coste_vida_utilidades: content.coste_vida_utilidades,
    tramites: content.tramites,
    faqs: content.faqs,
    clima_detalle: content.clima_detalle,
    temperatura_media: content.temperatura_media,
    dias_sol: content.dias_sol,
    activo: true,
    generado_por_ia: true,
    revisado: false,
    fecha_generacion: new Date().toISOString()
  };

  const { error } = await supabase
    .from('ciudades_contenido')
    .upsert(row, { onConflict: 'ciudad_slug,idioma' });

  if (error) throw error;
  console.log(`  💾 Guardado en Supabase`);
}

async function main() {
  console.log('🌍 GENERADOR DE CONTENIDO PARA CIUDADES');
  console.log(`   Modelo: ${MODEL}`);
  console.log(`   Modo: ${DRY_RUN ? '🧪 DRY RUN' : '🚀 PRODUCCIÓN'}`);
  
  // Obtener ciudades del catálogo
  const { data: todasCiudades } = await supabase
    .from('ciudades_catalogo')
    .select('*')
    .order('poblacion', { ascending: false });

  if (!todasCiudades?.length) {
    console.error('❌ No hay ciudades en el catálogo');
    process.exit(1);
  }

  // Filtrar si se especificaron ciudades
  let ciudades = todasCiudades;
  if (TARGET_CITIES.length > 0) {
    ciudades = todasCiudades.filter(c => 
      TARGET_CITIES.some(target => 
        c.slug === target || c.nombre.toLowerCase().includes(target.toLowerCase())
      )
    );
    if (ciudades.length === 0) {
      console.error(`❌ No se encontraron ciudades que coincidan con: ${TARGET_CITIES.join(', ')}`);
      process.exit(1);
    }
  }

  console.log(`\n📋 ${ciudades.length} ciudades a procesar:`);
  ciudades.forEach(c => console.log(`   - ${c.nombre} (${c.slug})`));

  // Verificar cuáles ya tienen contenido
  const { data: existentes } = await supabase
    .from('ciudades_contenido')
    .select('ciudad_slug')
    .eq('idioma', 'es');

  const existentesSlugs = new Set((existentes || []).map(e => e.ciudad_slug));
  const ciudadesPendientes = ciudades.filter(c => !existentesSlugs.has(c.slug));

  if (ciudadesPendientes.length === 0) {
    console.log(`\n✅ Todas las ciudades ya tienen contenido generado`);
    return;
  }

  console.log(`\n🔄 ${ciudadesPendientes.length} ciudades sin contenido, generando...`);

  const start = Date.now();

  for (const ciudad of ciudadesPendientes) {
    try {
      const content = await generateCityContent(ciudad);
      await insertCityContent(ciudad, content);
      totalGenerated++;
      await sleep(3000); // Pausa entre ciudades
    } catch (err) {
      console.error(`❌ Error procesando ${ciudad.nombre}:`, err.message);
    }
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  const costEstimate = ((totalTokens / 1000000) * 2.50).toFixed(4); // gpt-4o: ~$2.50/M tokens

  console.log('\n' + '='.repeat(65));
  console.log('RESUMEN');
  console.log('='.repeat(65));
  console.log(`  ✅ Generadas:  ${totalGenerated} ciudades`);
  console.log(`  🔤 Tokens:     ${totalTokens.toLocaleString()}`);
  console.log(`  💰 Coste aprox: $${costEstimate} (gpt-4o)`);
  console.log(`  ⏱️  Tiempo:     ${elapsed}s`);
  console.log('');
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
