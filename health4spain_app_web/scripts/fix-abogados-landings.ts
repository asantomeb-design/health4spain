/**
 * Script para corregir terminología en landing pages de abogados
 * Sustituye "Abogado Extranjería" / "Abogados de Extranjería" por "Abogado" / "Abogados"
 *
 * Uso:
 *   npx ts-node scripts/fix-abogados-landings.ts
 *
 * Requiere .env.local con NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Sustituir TODAS las variantes de extranjería en texto (todo el contenido)
function fixText(text: string | null): string | null {
  if (!text || typeof text !== 'string') return text;
  return text
    // Títulos y nombres de servicio
    .replace(/Abogados de Extranjería/g, 'Abogados')
    .replace(/Abogado de Extranjería/g, 'Abogado')
    .replace(/Abogados Extranjería/g, 'Abogados')
    .replace(/Abogado Extranjería/g, 'Abogado')
    .replace(/abogados de extranjería/g, 'abogados')
    .replace(/abogado de extranjería/g, 'abogado')
    // Frases comunes
    .replace(/trámites de extranjería/g, 'trámites legales')
    .replace(/tramites de extranjeria/g, 'trámites legales')
    .replace(/Expertos en trámites de extranjería/g, 'Expertos en trámites legales')
    .replace(/Expertos en extranjería/g, 'Expertos en derecho')
    .replace(/Asesoría personalizada para extranjeros/g, 'Asesoría legal personalizada')
    .replace(/asesoría para extranjeros/g, 'asesoría legal')
    .replace(/problemas de extranjería/g, 'asuntos legales')
    .replace(/servicios de extranjería/g, 'servicios legales')
    // Oficinas de Extranjería: mantener nombre oficial del organismo
    .replace(/Oficinas de extranjería/g, 'Oficinas de Extranjería')
    // Cualquier "extranjería" restante -> "legal"
    .replace(/extranjería/g, 'legal')
    .replace(/extranjeria/g, 'legal');
}

// Sustituir en array de strings
function fixStrings(arr: string[] | null): string[] | null {
  if (!arr || !Array.isArray(arr)) return arr;
  return arr.map((s) => fixText(s) ?? s);
}

// Sustituir en array de objetos con title/description
function fixServices(services: Array<{ icon?: string; title: string; description: string }> | null) {
  if (!services || !Array.isArray(services)) return services;
  return services.map((s) => ({
    ...s,
    title: fixText(s.title) ?? s.title,
    description: fixText(s.description) ?? s.description,
  }));
}

// Sustituir en array de objetos con question/answer
function fixFaqs(faqs: Array<{ question: string; answer: string }> | null) {
  if (!faqs || !Array.isArray(faqs)) return faqs;
  return faqs.map((f) => ({
    question: fixText(f.question) ?? f.question,
    answer: fixText(f.answer) ?? f.answer,
  }));
}

// Sustituir en array de stats (value, label)
function fixStats(stats: Array<{ value: string; label: string }> | null) {
  if (!stats || !Array.isArray(stats)) return stats;
  return stats.map((s) => ({
    ...s,
    label: fixText(s.label) ?? s.label,
  }));
}

async function main() {
  console.log('🔧 Corrigiendo landing pages de abogados...\n');

  const { data: landings, error: fetchError } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('servicio_slug', 'abogados');

  if (fetchError) {
    console.error('❌ Error al obtener landings:', fetchError.message);
    process.exit(1);
  }

  if (!landings || landings.length === 0) {
    console.log('No hay landing pages de abogados.');
    return;
  }

  console.log(`Encontradas ${landings.length} landing pages de abogados.\n`);

  let updated = 0;
  let errors = 0;

  for (const landing of landings) {
    const updates: Record<string, unknown> = {};

    // Campos de texto simples
    const servNom = fixText(landing.servicio_nombre);
    if (servNom !== landing.servicio_nombre) updates.servicio_nombre = servNom;

    const metaTitle = fixText(landing.meta_title);
    if (metaTitle !== landing.meta_title) updates.meta_title = metaTitle;

    const metaDesc = fixText(landing.meta_description);
    if (metaDesc !== landing.meta_description) updates.meta_description = metaDesc;

    if (landing.meta_keywords) {
      const origKw = typeof landing.meta_keywords === 'string' ? landing.meta_keywords : (Array.isArray(landing.meta_keywords) ? landing.meta_keywords.join(', ') : '');
      const metaKw = fixText(origKw);
      if (metaKw && metaKw !== origKw) updates.meta_keywords = metaKw;
    }

    const heroTitle = fixText(landing.hero_title);
    if (heroTitle !== landing.hero_title) updates.hero_title = heroTitle;

    const heroSub = fixText(landing.hero_subtitle);
    if (heroSub !== landing.hero_subtitle) updates.hero_subtitle = heroSub;

    const probTitle = fixText(landing.problem_title);
    if (probTitle !== landing.problem_title) updates.problem_title = probTitle;

    const solTitle = fixText(landing.solution_title);
    if (solTitle !== landing.solution_title) updates.solution_title = solTitle;

    const solText = fixText(landing.solution_text);
    if (solText !== landing.solution_text) updates.solution_text = solText;

    const srvTitle = fixText(landing.services_title);
    if (srvTitle !== landing.services_title) updates.services_title = srvTitle;

    const whyTitle = fixText(landing.why_city_title);
    if (whyTitle !== landing.why_city_title) updates.why_city_title = whyTitle;

    const whyText = fixText(landing.why_city_text);
    if (whyText !== landing.why_city_text) updates.why_city_text = whyText;

    const ctaTitle = fixText(landing.cta_title);
    if (ctaTitle !== landing.cta_title) updates.cta_title = ctaTitle;

    const ctaSub = fixText(landing.cta_subtitle);
    if (ctaSub !== landing.cta_subtitle) updates.cta_subtitle = ctaSub;

    // Arrays
    const heroBullets = fixStrings(landing.hero_bullets);
    if (JSON.stringify(heroBullets) !== JSON.stringify(landing.hero_bullets)) updates.hero_bullets = heroBullets;

    const problems = fixStrings(landing.problems);
    if (JSON.stringify(problems) !== JSON.stringify(landing.problems)) updates.problems = problems;

    const services = fixServices(landing.services);
    if (JSON.stringify(services) !== JSON.stringify(landing.services)) updates.services = services;

    const faqs = fixFaqs(landing.faqs);
    if (JSON.stringify(faqs) !== JSON.stringify(landing.faqs)) updates.faqs = faqs;

    const whyStats = fixStats(landing.why_city_stats);
    if (JSON.stringify(whyStats) !== JSON.stringify(landing.why_city_stats)) updates.why_city_stats = whyStats;

    if (Object.keys(updates).length === 0) {
      console.log(`  ⏭️  ${landing.slug} - sin cambios`);
      continue;
    }

    const { error: updateError } = await supabase
      .from('landing_pages')
      .update(updates)
      .eq('id', landing.id);

    if (updateError) {
      console.error(`  ❌ ${landing.slug}:`, updateError.message);
      errors++;
    } else {
      console.log(`  ✅ ${landing.slug} - actualizado`);
      updated++;
    }
  }

  console.log(`\n✅ ${updated} landings actualizadas`);
  if (errors > 0) console.log(`❌ ${errors} errores`);
}

main().catch(console.error);
