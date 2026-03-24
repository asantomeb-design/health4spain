/**
 * Script para VERIFICAR landing pages vacías o incompletas
 * 
 * USO:
 *   npm run check-landings
 * 
 * NO genera nada, solo muestra un reporte
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================
// TIPOS
// ============================================

interface ExistingLanding {
  slug: string;
  meta_title?: string;
  hero_title?: string;
  hero_subtitle?: string;
  services?: any;
  faqs?: any;
  problem_title?: string;
  solution_text?: string;
}

// ============================================
// FUNCIONES DE VALIDACIÓN
// ============================================

function isLandingIncomplete(landing: ExistingLanding): boolean {
  // Verificar campos críticos
  if (!landing.meta_title || landing.meta_title.trim().length < 10) return true;
  if (!landing.hero_title || landing.hero_title.trim().length < 10) return true;
  if (!landing.hero_subtitle || landing.hero_subtitle.trim().length < 20) return true;
  
  // Verificar arrays JSON
  if (!landing.services || !Array.isArray(landing.services) || landing.services.length < 3) return true;
  if (!landing.faqs || !Array.isArray(landing.faqs) || landing.faqs.length < 2) return true;
  
  // Verificar contenido textual
  if (!landing.problem_title || landing.problem_title.trim().length < 5) return true;
  if (!landing.solution_text || landing.solution_text.trim().length < 30) return true;
  
  return false;
}

async function getExistingLandings(): Promise<ExistingLanding[]> {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('slug, meta_title, hero_title, hero_subtitle, services, faqs, problem_title, solution_text');
  
  if (error) {
    console.error('❌ Error obteniendo landing pages existentes:', error);
    return [];
  }
  
  return data || [];
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('🔍 VERIFICANDO LANDING PAGES EXISTENTES...\n');
  
  const existing = await getExistingLandings();
  console.log(`📊 Total landing pages encontradas: ${existing.length}\n`);
  
  if (existing.length === 0) {
    console.log('⚠️  No hay landing pages en la base de datos\n');
    console.log('💡 Ejecuta: npm run generate-landings\n');
    return;
  }
  
  const incomplete = existing.filter(isLandingIncomplete);
  
  if (incomplete.length === 0) {
    console.log('✅ ¡PERFECTO! Todas las landing pages están completas\n');
    return;
  }
  
  console.log(`⚠️  Landing pages incompletas o vacías: ${incomplete.length}\n`);
  
  // Agrupar por problemas
  const problems = {
    noTitle: [] as string[],
    noHero: [] as string[],
    noServices: [] as string[],
    noFaqs: [] as string[],
    noProblem: [] as string[],
    noSolution: [] as string[],
  };
  
  incomplete.forEach(landing => {
    const slug = landing.slug;
    if (!landing.meta_title || landing.meta_title.trim().length < 10) problems.noTitle.push(slug);
    if (!landing.hero_title || landing.hero_title.trim().length < 10) problems.noHero.push(slug);
    if (!landing.services || !Array.isArray(landing.services) || landing.services.length < 3) problems.noServices.push(slug);
    if (!landing.faqs || !Array.isArray(landing.faqs) || landing.faqs.length < 2) problems.noFaqs.push(slug);
    if (!landing.problem_title || landing.problem_title.trim().length < 5) problems.noProblem.push(slug);
    if (!landing.solution_text || landing.solution_text.trim().length < 30) problems.noSolution.push(slug);
  });
  
  console.log('📋 RESUMEN DE PROBLEMAS:');
  if (problems.noTitle.length > 0) console.log(`   - Sin título SEO: ${problems.noTitle.length}`);
  if (problems.noHero.length > 0) console.log(`   - Sin hero completo: ${problems.noHero.length}`);
  if (problems.noServices.length > 0) console.log(`   - Sin servicios: ${problems.noServices.length}`);
  if (problems.noFaqs.length > 0) console.log(`   - Sin FAQs: ${problems.noFaqs.length}`);
  if (problems.noProblem.length > 0) console.log(`   - Sin problema: ${problems.noProblem.length}`);
  if (problems.noSolution.length > 0) console.log(`   - Sin solución: ${problems.noSolution.length}`);
  
  console.log('\n🔧 PARA REGENERAR ESTAS PÁGINAS:');
  console.log('   npm run retry-landings\n');
  
  console.log('📝 LISTA DE SLUGS INCOMPLETOS:');
  incomplete.slice(0, 20).forEach(landing => {
    console.log(`   - ${landing.slug}`);
  });
  
  if (incomplete.length > 20) {
    console.log(`   ... y ${incomplete.length - 20} más\n`);
  } else {
    console.log('');
  }
  
  console.log('========================================');
  console.log(`✅ Completas: ${existing.length - incomplete.length}`);
  console.log(`⚠️  Incompletas: ${incomplete.length}`);
  console.log(`📊 Total: ${existing.length}`);
  console.log('========================================\n');
}

main().catch(console.error);
