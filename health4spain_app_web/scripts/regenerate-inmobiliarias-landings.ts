/**
 * Regenera TODO el contenido de las landing pages de INMOBILIARIAS con OpenAI
 * Optimizado para SEO con keywords reales.
 *
 * Uso:
 *   npm run regenerate-inmobiliarias-landings
 *
 * Requiere .env.local: OPENAI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const TEXT_FIELDS = [
  'meta_title', 'meta_description', 'meta_keywords',
  'hero_title', 'hero_subtitle', 'hero_bullets',
  'problem_title', 'problems', 'solution_title', 'solution_text',
  'services_title', 'services', 'why_city_title', 'why_city_text', 'why_city_stats',
  'faqs', 'cta_title', 'cta_subtitle'
] as const;

function buildRegeneratePrompt(landing: Record<string, unknown>): string {
  const ciudad = landing.ciudad_nombre || 'la ciudad';
  const provincia = landing.provincia || '';

  return `Eres un copywriter SEO experto. REESCRIBE el contenido de esta landing page de inmobiliarias.

CONTEXTO:
- Ciudad: ${ciudad} (${provincia})
- El servicio es INMOBILIARIA: comprar casa, alquilar piso, vender propiedad, hipotecas, etc.
- Público: extranjeros que quieren comprar, alquilar o vender propiedades en España.

REGLAS SEO ESTRICTAS:
1. USA KEYWORDS REALES: "comprar casa", "alquilar piso", "venta de vivienda", "inmobiliaria", NO "hogar perfecto"
2. El H1 debe ser DIRECTO: "Inmobiliaria en ${ciudad}" + servicios (comprar, alquilar, vender)
3. Menciona tipos de propiedad: piso, casa, chalet, apartamento, villa
4. Evita lenguaje marketing fluff como "hogar de tus sueños"
5. Los problemas deben ser reales: encontrar piso, entender hipotecas, trámites compraventa

TAREA:
Reescribe TODO el contenido con KEYWORDS SEO. Incluye servicios:
- Compra de vivienda (pisos, casas, chalets)
- Alquiler (corta y larga temporada)
- Venta de propiedades
- Asesoramiento hipotecas
- Gestión de trámites y documentación
- Tasaciones

Responde SOLO con un JSON válido con esta estructura exacta (sin markdown):

{
  "meta_title": "Inmobiliaria en ${ciudad} - Comprar Casa, Alquilar (máx 60)",
  "meta_description": "Inmobiliaria en ${ciudad}. Comprar casa, alquilar piso, vender vivienda. Asesoramiento gratuito (máx 155 caracteres)",
  "meta_keywords": "inmobiliaria ${ciudad}, comprar casa ${ciudad}, alquilar piso, venta vivienda, pisos ${provincia}",
  "hero_title": "Inmobiliaria en ${ciudad} - Comprar, Alquilar, Vender (H1 con keywords)",
  "hero_subtitle": "Inmobiliaria especializada en ${ciudad} para comprar casa, alquilar piso o vender tu propiedad. Ayudamos a extranjeros con todo el proceso.",
  "hero_bullets": ["4 bullets con beneficios concretos"],
  "problem_title": "¿Buscas vivienda en ${ciudad}?",
  "problems": ["5 problemas CONCRETOS: 'No encuentro pisos en alquiler', 'No entiendo el proceso de compra en España', 'Necesito hipoteca siendo extranjero', 'Quiero vender mi casa rápido', 'No sé qué documentos necesito'"],
  "solution_title": "Tu inmobiliaria en ${ciudad}",
  "solution_text": "Te ayudamos a encontrar tu piso o casa en ${ciudad}, gestionar la compra o alquiler, y resolver todos los trámites. Asesoramiento en tu idioma.",
  "services_title": "Servicios inmobiliarios en ${ciudad}",
  "services": [
    {"icon": "emoji", "title": "Comprar Casa o Piso", "description": "Pisos, casas, chalets, apartamentos. Te ayudamos con visitas y negociación"},
    {"icon": "emoji", "title": "Alquiler", "description": "Alquiler larga temporada, corta temporada, gestión de contratos"},
    {"icon": "emoji", "title": "Vender Propiedad", "description": "Tasación, marketing, visitas, tramitación de venta"},
    {"icon": "emoji", "title": "Asesoría Hipotecas", "description": "Te ayudamos a conseguir hipoteca, mejores condiciones bancarias"},
    {"icon": "emoji", "title": "Gestión Integral", "description": "NIE, escrituras, registro, impuestos, suministros"},
    {"icon": "emoji", "title": "Valoración Gratuita", "description": "Tasación de tu propiedad sin compromiso"}
  ],
  "why_city_title": "¿Por qué vivir en ${ciudad}?",
  "why_city_text": "Párrafo sobre ventajas de ${ciudad} para vivir (clima, servicios, comunidad extranjera, precios)",
  "why_city_stats": [
    {"value": "dato", "label": "Habitantes"},
    {"value": "dato", "label": "Precio medio m²"},
    {"value": "dato", "label": "% extranjeros"},
    {"value": "dato", "label": "Días de sol al año"}
  ],
  "faqs": [
    {"question": "¿Cuánto cuesta comprar una casa en ${ciudad}?", "answer": "Respuesta con precios aproximados y costes adicionales (notario, registro, impuestos)"},
    {"question": "¿Puedo comprar sin ser residente?", "answer": "Respuesta sobre proceso para no residentes, NIE necesario"},
    {"question": "¿Cómo funciona el alquiler en ${ciudad}?", "answer": "Respuesta sobre contratos, fianzas, duración"},
    {"question": "¿Qué impuestos hay al comprar?", "answer": "Respuesta sobre ITP/IVA, plusvalía, IBI"}
  ],
  "cta_title": "Encuentra tu vivienda en ${ciudad}",
  "cta_subtitle": "Asesoramiento gratuito. Te respondemos en menos de 24 horas"
}`;
}

async function regenerateLanding(landing: Record<string, unknown>): Promise<Record<string, unknown> | null> {
  const slug = landing.slug as string;

  try {
    const prompt = buildRegeneratePrompt(landing);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Eres un copywriter SEO. Responde SOLO con JSON válido, sin markdown.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const text = completion.choices[0].message.content || '';
    const cleanJson = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const generated = JSON.parse(cleanJson);

    return {
      ...landing,
      servicio_nombre: 'Inmobiliaria',
      meta_title: generated.meta_title.substring(0, 60),
      meta_description: generated.meta_description.substring(0, 155),
      meta_keywords: generated.meta_keywords,
      hero_title: generated.hero_title,
      hero_subtitle: generated.hero_subtitle,
      hero_bullets: generated.hero_bullets || [],
      problem_title: generated.problem_title,
      problems: generated.problems || [],
      solution_title: generated.solution_title,
      solution_text: generated.solution_text,
      services_title: generated.services_title,
      services: generated.services || [],
      why_city_title: generated.why_city_title,
      why_city_text: generated.why_city_text,
      why_city_stats: generated.why_city_stats || [],
      faqs: generated.faqs || [],
      cta_title: generated.cta_title,
      cta_subtitle: generated.cta_subtitle,
    };
  } catch (err: unknown) {
    console.error(`  ❌ ${slug}:`, err instanceof Error ? err.message : err);
    return null;
  }
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Falta OPENAI_API_KEY en .env.local');
    process.exit(1);
  }

  console.log('🔄 Regenerando landing pages de inmobiliarias con OpenAI...\n');
  console.log('   Servicio: INMOBILIARIAS (comprar, alquilar, vender...)\n');

  const slugFilter = process.argv.find((a) => a.startsWith('--slug='));
  const onlySlug = slugFilter ? slugFilter.split('=')[1] : null;

  let query = supabase.from('landing_pages').select('*').eq('servicio_slug', 'inmobiliarias');
  if (onlySlug) {
    query = query.eq('slug', onlySlug);
    console.log(`   Solo: ${onlySlug}\n`);
  }

  const { data: landings, error: fetchError } = await query;

  if (fetchError) {
    console.error('❌ Error:', fetchError.message);
    process.exit(1);
  }

  if (!landings || landings.length === 0) {
    console.log('No hay landings de inmobiliarias.');
    return;
  }

  console.log(`Encontradas ${landings.length} landings. Regenerando...\n`);

  let ok = 0;
  let fail = 0;

  for (const landing of landings) {
    process.stdout.write(`  ${landing.slug}... `);

    const updated = await regenerateLanding(landing);

    if (!updated) {
      fail++;
      continue;
    }

    const { error: updateError } = await supabase
      .from('landing_pages')
      .update({
        servicio_nombre: updated.servicio_nombre,
        meta_title: updated.meta_title,
        meta_description: updated.meta_description,
        meta_keywords: updated.meta_keywords,
        hero_title: updated.hero_title,
        hero_subtitle: updated.hero_subtitle,
        hero_bullets: updated.hero_bullets,
        problem_title: updated.problem_title,
        problems: updated.problems,
        solution_title: updated.solution_title,
        solution_text: updated.solution_text,
        services_title: updated.services_title,
        services: updated.services,
        why_city_title: updated.why_city_title,
        why_city_text: updated.why_city_text,
        why_city_stats: updated.why_city_stats,
        faqs: updated.faqs,
        cta_title: updated.cta_title,
        cta_subtitle: updated.cta_subtitle,
        generado_por_ia: true,
        fecha_generacion: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', landing.id);

    if (updateError) {
      console.log(`❌ ${updateError.message}`);
      fail++;
    } else {
      console.log('✅');
      ok++;
    }

    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\n✅ ${ok} landings regeneradas`);
  if (fail > 0) console.log(`❌ ${fail} errores`);
}

main().catch(console.error);
