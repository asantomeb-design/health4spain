/**
 * Regenera TODO el contenido de las landing pages de abogados con OpenAI
 * Adapta el texto a ABOGADOS EN GENERAL (familia, civil, laboral, extranjería, penal, herencias...)
 * NO solo abogados de extranjería.
 *
 * Uso:
 *   npm run regenerate-abogados-landings
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

// Campos de texto que se regeneran
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

  return `Eres un copywriter SEO experto. REESCRIBE el contenido de esta landing page de abogados.

CONTEXTO:
- Ciudad: ${ciudad} (${provincia})
- El servicio es ABOGADOS EN GENERAL: familia, civil, laboral, extranjería, penal, herencias, divorcios, contratos, etc.
- NO es solo "abogados de extranjería". Es un despacho/plataforma que conecta con abogados de TODAS las especialidades.
- Público: extranjeros que viven o quieren vivir en España y necesitan asesoría legal.

REGLAS SEO ESTRICTAS:
1. USA KEYWORDS REALES que la gente busca: "abogado divorcio", "abogado despido", "abogado herencias", NO "solución legal", "asesoría integral"
2. El H1 debe ser DIRECTO: "Abogados en ${ciudad}" + especialidades concretas
3. Los títulos deben incluir las palabras que la gente teclea en Google
4. Evita lenguaje marketing fluff, sé específico y claro
5. Menciona problemas legales CONCRETOS: divorcio, despido, testamento, NIE, reclamación

TAREA:
Reescribe TODO el contenido para reflejar abogados generales con KEYWORDS SEO. Incluye variedad de servicios:
- Derecho de familia (divorcios, custodia, pensión alimenticia)
- Civil (contratos, reclamaciones, indemnizaciones)
- Laboral (despidos, finiquitos, reclamaciones salariales)
- Extranjería (NIE, visados, residencia, nacionalidad)
- Penal (denuncias, defensa penal)
- Herencias (testamentos, sucesiones, impuesto de sucesiones)

Responde SOLO con un JSON válido con esta estructura exacta (sin markdown):

{
  "meta_title": "Abogados en ${ciudad} - Divorcio, Laboral, Civil | Health4Spain (máx 60 caracteres)",
  "meta_description": "Abogados en ${ciudad} especializados en divorcio, despido, herencias, extranjería. Consulta gratuita. (máx 155 caracteres)",
  "meta_keywords": "abogados ${ciudad}, abogado divorcio ${ciudad}, abogado despido, abogado herencias, abogado extranjería, abogado ${provincia}",
  "hero_title": "Abogados en ${ciudad} - Divorcio, Laboral, Civil, Extranjería (H1 con keywords SEO, NO usar frases marketing como 'solución legal')",
  "hero_subtitle": "Abogados especializados en ${ciudad} para divorcios, despidos, herencias, trámites de extranjería y más. Primera consulta gratuita.",
  "hero_bullets": ["4 bullets con beneficios concretos, NO frases genéricas"],
  "problem_title": "¿Necesitas un abogado? Estos son los casos más comunes en ${ciudad}",
  "problems": ["5 problemas legales CONCRETOS con keywords: 'Trámites de divorcio complicados', 'Despido improcedente', 'Problemas con herencias', 'Obtener el NIE o visado', 'Reclamación de deudas'"],
  "solution_title": "Abogados especializados en ${ciudad}",
  "solution_text": "Te conectamos con abogados expertos en ${ciudad} especializados en divorcio, derecho laboral, herencias, extranjería y más. Primera consulta gratuita.",
  "services_title": "Especialidades legales en ${ciudad}",
  "services": [
    {"icon": "emoji", "title": "Abogado de Familia", "description": "Divorcio, custodia, pensión alimenticia, modificación de medidas"},
    {"icon": "emoji", "title": "Abogado Extranjería", "description": "NIE, visados, residencia, nacionalidad española, arraigo"},
    {"icon": "emoji", "title": "Abogado Laboral", "description": "Despido improcedente, finiquito, reclamación salarial, accidentes laborales"},
    {"icon": "emoji", "title": "Abogado Civil", "description": "Reclamaciones, contratos, indemnizaciones, responsabilidad civil"},
    {"icon": "emoji", "title": "Abogado Herencias", "description": "Testamentos, sucesiones, impuesto de sucesiones, reparto herencia"},
    {"icon": "emoji", "title": "Consulta Gratuita", "description": "Primera consulta sin compromiso para evaluar tu caso"}
  ],
  "why_city_title": "Abogados locales en ${ciudad}",
  "why_city_text": "Párrafo breve sobre ventajas de tener abogado local en ${ciudad} (conocimiento normativa local, oficinas cercanas, etc.)",
  "why_city_stats": [
    {"value": "dato", "label": "Habitantes"},
    {"value": "dato", "label": "Población extranjera"},
    {"value": "dato", "label": "Aeropuerto más cercano"},
    {"value": "dato", "label": "Oficinas de Extranjería en la región"}
  ],
  "faqs": [
    {"question": "¿Cuánto cuesta un abogado en ${ciudad}?", "answer": "Respuesta con precios aproximados y mención de primera consulta gratuita"},
    {"question": "¿Qué abogado necesito para un divorcio en ${ciudad}?", "answer": "Respuesta sobre abogado de familia y proceso divorcio"},
    {"question": "¿Cómo reclamar un despido improcedente?", "answer": "Respuesta sobre abogado laboral y reclamación despido"},
    {"question": "¿Cuánto tarda el trámite de NIE o residencia?", "answer": "Respuesta sobre tiempos y proceso extranjería"}
  ],
  "cta_title": "Encuentra tu abogado en ${ciudad}",
  "cta_subtitle": "Primera consulta gratuita. Te conectamos en menos de 24 horas"
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
      servicio_nombre: 'Abogado',
      meta_title: generated.meta_title,
      meta_description: generated.meta_description,
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

  console.log('🔄 Regenerando landing pages de abogados con OpenAI...\n');
  console.log('   Servicio: ABOGADOS EN GENERAL (familia, civil, laboral, extranjería, penal, herencias...)\n');

  const slugFilter = process.argv.find((a) => a.startsWith('--slug='));
  const onlySlug = slugFilter ? slugFilter.split('=')[1] : null;

  let query = supabase.from('landing_pages').select('*').eq('servicio_slug', 'abogados');
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
    console.log('No hay landings de abogados.');
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
