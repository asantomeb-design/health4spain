/**
 * Mostrar TODO el contenido de una landing page
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function showContent() {
  const slug = process.argv[2] || 'abogados-cieza';
  
  console.log(`📄 CONTENIDO COMPLETO DE: ${slug}\n`);
  console.log('='.repeat(80) + '\n');

  const { data: landing, error } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }

  console.log('🌐 URL:', `https://generadorleads.vercel.app/${slug}`);
  console.log('🏙️  Ciudad:', landing.ciudad_nombre);
  console.log('📍 Provincia:', landing.provincia);
  console.log('\n' + '='.repeat(80));
  
  console.log('\n📊 SEO METADATA:');
  console.log('─'.repeat(80));
  console.log('Meta Title:', landing.meta_title);
  console.log('Meta Description:', landing.meta_description);
  console.log('Meta Keywords:', landing.meta_keywords);

  console.log('\n\n🎯 HERO SECTION:');
  console.log('─'.repeat(80));
  console.log('H1 (hero_title):', landing.hero_title);
  console.log('\nSubtítulo:', landing.hero_subtitle);
  console.log('\nBullets:');
  landing.hero_bullets?.forEach((b: string, i: number) => console.log(`  ${i + 1}. ${b}`));

  console.log('\n\n❌ SECCIÓN DE PROBLEMAS:');
  console.log('─'.repeat(80));
  console.log('H2 (problem_title):', landing.problem_title);
  console.log('\nProblemas:');
  landing.problems?.forEach((p: string, i: number) => console.log(`  ${i + 1}. ${p}`));

  console.log('\n\n✅ SECCIÓN DE SOLUCIÓN:');
  console.log('─'.repeat(80));
  console.log('H2 (solution_title):', landing.solution_title);
  console.log('\nTexto:', landing.solution_text);

  console.log('\n\n🔧 SECCIÓN DE SERVICIOS:');
  console.log('─'.repeat(80));
  console.log('H2 (services_title):', landing.services_title);
  console.log('\nServicios:');
  landing.services?.forEach((s: any, i: number) => {
    console.log(`  ${i + 1}. ${s.icon} H3: "${s.title}"`);
    console.log(`     Descripción: ${s.description}`);
  });

  console.log('\n\n🏙️  SECCIÓN POR QUÉ ESTA CIUDAD:');
  console.log('─'.repeat(80));
  console.log('H2 (why_city_title):', landing.why_city_title);
  console.log('\nTexto:', landing.why_city_text);
  console.log('\nEstadísticas:');
  landing.why_city_stats?.forEach((s: any) => {
    console.log(`  📊 ${s.value} - ${s.label}`);
  });

  console.log('\n\n❓ SECCIÓN DE FAQs:');
  console.log('─'.repeat(80));
  landing.faqs?.forEach((faq: any, i: number) => {
    console.log(`${i + 1}. H3: "${faq.question}"`);
    console.log(`   Respuesta: ${faq.answer}\n`);
  });

  console.log('\n🎉 SECCIÓN CTA FINAL:');
  console.log('─'.repeat(80));
  console.log('H2 (cta_title):', landing.cta_title);
  console.log('Subtítulo:', landing.cta_subtitle);

  console.log('\n\n' + '='.repeat(80));
  console.log('📅 Última actualización:', landing.updated_at);
  console.log('🤖 Generado por IA:', landing.generado_por_ia);
  console.log('📅 Fecha generación:', landing.fecha_generacion);
  console.log('='.repeat(80) + '\n');
}

showContent().catch(console.error);
