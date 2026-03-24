/**
 * Regenera TODO el contenido de las landing pages de GESTORÍAS con OpenAI
 * Optimizado para SEO con keywords reales.
 *
 * Uso:
 *   npm run regenerate-gestorias-landings
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

  return `Eres un copywriter SEO experto. REESCRIBE el contenido de esta landing page de gestorías.

CONTEXTO:
- Ciudad: ${ciudad} (${provincia})
- El servicio es GESTORÍA: trámites administrativos, fiscales, autónomos, NIE, empadronamiento, impuestos, etc.
- Público: extranjeros que viven o quieren vivir en España y necesitan ayuda con burocracia.

REGLAS SEO ESTRICTAS:
1. USA KEYWORDS REALES: "gestoría", "autonomo", "declaracion renta", "NIE", "empadronamiento", NO "solución administrativa"
2. El H1 debe ser DIRECTO: "Gestoría en ${ciudad}" + servicios concretos
3. Menciona trámites CONCRETOS: alta autónomo, modelo 303, IRPF, empadronamiento, NIE
4. Evita lenguaje marketing fluff, sé específico
5. Los problemas deben ser trámites reales que la gente busca

TAREA:
Reescribe TODO el contenido con KEYWORDS SEO. Incluye servicios:
- Alta y gestión de autónomos (cuota, modelo 303, IVA)
- Declaración de la renta (IRPF, modelo 100)
- NIE y trámites de extranjería
- Empadronamiento
- Impuestos (IVA, IRPF, sociedades)
- Gestión laboral y nóminas

Responde SOLO con un JSON válido con esta estructura exacta (sin markdown):

{
  "meta_title": "Gestoría en ${ciudad} - Autónomos, Renta, NIE (máx 60 caracteres)",
  "meta_description": "Gestoría en ${ciudad} para autónomos, declaración renta, NIE, empadronamiento. Primera consulta gratis (máx 155 caracteres)",
  "meta_keywords": "gestoria ${ciudad}, autonomo ${ciudad}, declaracion renta, NIE, empadronamiento, gestoria ${provincia}",
  "hero_title": "Gestoría en ${ciudad} - Autónomos, Declaración Renta, NIE (H1 con keywords SEO)",
  "hero_subtitle": "Gestoría especializada en ${ciudad} para autónomos, declaración de la renta, trámites de NIE, empadronamiento y más. Te ahorramos tiempo y dinero.",
  "hero_bullets": ["4 bullets con beneficios concretos de usar gestoría"],
  "problem_title": "¿Necesitas ayuda con estos trámites en ${ciudad}?",
  "problems": ["5 trámites/problemas CONCRETOS: 'Alta como autónomo', 'Declaración de la renta atrasada', 'No consigo cita para el NIE', 'No entiendo el modelo 303', 'Empadronamiento en ${ciudad}'"],
  "solution_title": "Gestoría especializada en ${ciudad}",
  "solution_text": "Te ayudamos con todos tus trámites administrativos y fiscales en ${ciudad}. Autónomos, impuestos, NIE, empadronamiento y más. Primera consulta gratuita.",
  "services_title": "Servicios de gestoría en ${ciudad}",
  "services": [
    {"icon": "emoji", "title": "Gestoría Autónomos", "description": "Alta, baja, cuota, modelo 303, IVA trimestral, cambio actividad"},
    {"icon": "emoji", "title": "Declaración Renta", "description": "IRPF, modelo 100, deducciones, devoluciones, renta atrasada"},
    {"icon": "emoji", "title": "NIE y Extranjería", "description": "Certificado NIE, cita previa, renovación, empadronamiento"},
    {"icon": "emoji", "title": "Gestión Laboral", "description": "Nóminas, contratos, altas/bajas Seguridad Social"},
    {"icon": "emoji", "title": "Contabilidad", "description": "Libros contables, cuentas anuales, auditoría"},
    {"icon": "emoji", "title": "Consulta Gratuita", "description": "Primera consulta sin compromiso"}
  ],
  "why_city_title": "Gestoría local en ${ciudad}",
  "why_city_text": "Párrafo breve sobre ventajas de tener gestoría local en ${ciudad} (conocimiento normativa local, oficinas cercanas, trámites presenciales)",
  "why_city_stats": [
    {"value": "dato", "label": "Habitantes"},
    {"value": "dato", "label": "Autónomos en ${ciudad}"},
    {"value": "dato", "label": "Oficina Hacienda más cercana"},
    {"value": "dato", "label": "Oficina Seguridad Social"}
  ],
  "faqs": [
    {"question": "¿Cuánto cuesta una gestoría en ${ciudad}?", "answer": "Respuesta con precios aproximados según servicio"},
    {"question": "¿Cómo darme de alta como autónomo en ${ciudad}?", "answer": "Respuesta sobre proceso y documentación"},
    {"question": "¿Cuándo hay que hacer la declaración de la renta?", "answer": "Respuesta sobre plazos y obligación"},
    {"question": "¿Puedo obtener el NIE con una gestoría?", "answer": "Respuesta sobre ayuda con NIE y documentación"}
  ],
  "cta_title": "Contacta con nuestra gestoría en ${ciudad}",
  "cta_subtitle": "Primera consulta gratuita. Te respondemos en menos de 24 horas"
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
      servicio_nombre: 'Gestoría',
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

  console.log('🔄 Regenerando landing pages de gestorías con OpenAI...\n');
  console.log('   Servicio: GESTORÍAS (autónomos, renta, NIE, empadronamiento...)\n');

  const slugFilter = process.argv.find((a) => a.startsWith('--slug='));
  const onlySlug = slugFilter ? slugFilter.split('=')[1] : null;

  let query = supabase.from('landing_pages').select('*').eq('servicio_slug', 'gestorias');
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
    console.log('No hay landings de gestorías.');
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
