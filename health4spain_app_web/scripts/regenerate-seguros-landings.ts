/**
 * Regenera TODO el contenido de las landing pages de SEGUROS con OpenAI
 * Optimizado para SEO con keywords reales.
 *
 * Uso:
 *   npm run regenerate-seguros-landings
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

  return `Eres un copywriter SEO experto. REESCRIBE el contenido de esta landing page de seguros de salud.

CONTEXTO:
- Ciudad: ${ciudad} (${provincia})
- El servicio es SEGUROS DE SALUD PRIVADOS: para extranjeros residentes en España
- Público: extranjeros que necesitan seguro médico privado para visa, residencia o salud.

REGLAS SEO ESTRICTAS:
1. USA KEYWORDS REALES: "seguro salud", "seguro médico", "seguro privado", "aseguradora", NO "tranquilidad para tu salud"
2. El H1 debe ser DIRECTO: "Seguros de Salud en ${ciudad}" + beneficios (privados, para extranjeros)
3. Menciona necesidades CONCRETAS: visa no lucrativa, seguro para residencia, cobertura médica
4. Evita lenguaje marketing fluff
5. Los problemas deben ser reales: necesito seguro para visa, no tengo médico, esperas largas sanidad pública

TAREA:
Reescribe TODO el contenido con KEYWORDS SEO. Incluye servicios:
- Seguros para visa no lucrativa / Golden Visa
- Seguros para residencia (NIE, TIE)
- Seguro dental
- Seguro repatriación
- Cobertura sin copagos
- Médicos en inglés/alemán

Responde SOLO con un JSON válido con esta estructura exacta (sin markdown):

{
  "meta_title": "Seguros Salud en ${ciudad} - Privados Extranjeros (máx 60)",
  "meta_description": "Seguros salud privados en ${ciudad} para extranjeros. Visa, residencia, sin copagos. Compara precios (máx 155 caracteres)",
  "meta_keywords": "seguro salud ${ciudad}, seguro medico privado, seguro visa, aseguradora ${provincia}, seguro extranjeros",
  "hero_title": "Seguros de Salud en ${ciudad} - Privados para Extranjeros (H1 keywords)",
  "hero_subtitle": "Seguros de salud privados en ${ciudad} para extranjeros. Cobertura completa, sin copagos, médicos en tu idioma. Comparamos aseguradoras.",
  "hero_bullets": ["4 bullets con beneficios concretos de seguro privado"],
  "problem_title": "¿Necesitas seguro de salud en ${ciudad}?",
  "problems": ["5 problemas CONCRETOS: 'Necesito seguro para visa no lucrativa', 'Esperas muy largas en sanidad pública', 'Mi médico no habla inglés', 'Seguro caro con muchos copagos', 'No sé qué aseguradora elegir'"],
  "solution_title": "Comparador de seguros de salud en ${ciudad}",
  "solution_text": "Te ayudamos a encontrar el mejor seguro de salud privado en ${ciudad}. Comparamos aseguradoras, precios y coberturas. Sin copagos, médicos en tu idioma.",
  "services_title": "Tipos de seguros de salud en ${ciudad}",
  "services": [
    {"icon": "emoji", "title": "Seguro Visa No Lucrativa", "description": "Cobertura completa sin copagos para visa de residencia no lucrativa"},
    {"icon": "emoji", "title": "Seguro Golden Visa", "description": "Seguro premium para inversores con Golden Visa"},
    {"icon": "emoji", "title": "Seguro Dental", "description": "Cobertura dental completa: revisiones, limpiezas, tratamientos"},
    {"icon": "emoji", "title": "Seguro Repatriación", "description": "Traslado a tu país en caso de emergencia médica grave"},
    {"icon": "emoji", "title": "Médicos Multilingües", "description": "Médicos que hablan inglés, alemán, francés, holandés"},
    {"icon": "emoji", "title": "Presupuesto Gratuito", "description": "Comparamos precios de aseguradoras sin compromiso"}
  ],
  "why_city_title": "Seguros de salud para extranjeros en ${ciudad}",
  "why_city_text": "Párrafo sobre sanidad en ${ciudad} (hospitales, clínicas privadas, comunidad extranjera, ventajas seguro privado)",
  "why_city_stats": [
    {"value": "dato", "label": "Habitantes"},
    {"value": "dato", "label": "% extranjeros"},
    {"value": "dato", "label": "Hospitales privados"},
    {"value": "dato", "label": "Centros médicos"}
  ],
  "faqs": [
    {"question": "¿Cuánto cuesta un seguro de salud en ${ciudad}?", "answer": "Respuesta con precios aproximados según edad y cobertura (50-150€/mes)"},
    {"question": "¿Qué seguro necesito para la visa no lucrativa?", "answer": "Respuesta sobre requisitos: sin copagos, cobertura completa, aseguradoras aceptadas"},
    {"question": "¿Puedo contratar seguro sin NIE?", "answer": "Respuesta: sí, con pasaporte mientras tramitas NIE"},
    {"question": "¿Qué aseguradoras operan en ${ciudad}?", "answer": "Respuesta con ejemplos: Sanitas, Adeslas, Asisa, DKV, etc."}
  ],
  "cta_title": "Compara seguros de salud en ${ciudad}",
  "cta_subtitle": "Presupuesto gratuito. Te respondemos en menos de 24 horas"
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
      servicio_nombre: 'Seguro de Salud',
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

  console.log('🔄 Regenerando landing pages de seguros con OpenAI...\n');
  console.log('   Servicio: SEGUROS DE SALUD (privados para extranjeros...)\n');

  const slugFilter = process.argv.find((a) => a.startsWith('--slug='));
  const onlySlug = slugFilter ? slugFilter.split('=')[1] : null;

  let query = supabase.from('landing_pages').select('*').eq('servicio_slug', 'seguros');
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
    console.log('No hay landings de seguros.');
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
