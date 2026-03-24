/**
 * Script temporal para revisar cuántas páginas tienen "extranjería" en su contenido
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function checkExtranjeria() {
  console.log('🔍 Buscando páginas con "extranjería" en el contenido...\n');

  // Obtener todas las landing pages de abogados
  const { data: landings, error } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('servicio_slug', 'abogados');

  if (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }

  if (!landings || landings.length === 0) {
    console.log('No hay landings de abogados.');
    return;
  }

  console.log(`Total de páginas de abogados: ${landings.length}\n`);

  // Buscar "extranjería" en todos los campos de texto
  let paginasConExtranjeria = 0;
  const detalles: any[] = [];

  for (const landing of landings) {
    const contenidoCompleto = JSON.stringify(landing).toLowerCase();
    const menciones = (contenidoCompleto.match(/extranjería|extranjer[ií]a/g) || []).length;

    if (menciones > 0) {
      paginasConExtranjeria++;
      
      // Revisar en qué campos aparece
      const campos: string[] = [];
      if (landing.meta_title?.toLowerCase().includes('extranjería')) campos.push('meta_title');
      if (landing.meta_description?.toLowerCase().includes('extranjería')) campos.push('meta_description');
      if (landing.meta_keywords?.toLowerCase().includes('extranjería')) campos.push('meta_keywords');
      if (landing.hero_title?.toLowerCase().includes('extranjería')) campos.push('hero_title');
      if (landing.hero_subtitle?.toLowerCase().includes('extranjería')) campos.push('hero_subtitle');
      if (JSON.stringify(landing.hero_bullets || []).toLowerCase().includes('extranjería')) campos.push('hero_bullets');
      if (JSON.stringify(landing.problems || []).toLowerCase().includes('extranjería')) campos.push('problems');
      if (landing.solution_text?.toLowerCase().includes('extranjería')) campos.push('solution_text');
      if (JSON.stringify(landing.services || []).toLowerCase().includes('extranjería')) campos.push('services');
      if (landing.why_city_text?.toLowerCase().includes('extranjería')) campos.push('why_city_text');
      if (JSON.stringify(landing.faqs || []).toLowerCase().includes('extranjería')) campos.push('faqs');

      detalles.push({
        slug: landing.slug,
        ciudad: landing.ciudad_nombre,
        menciones,
        campos,
        url: `https://generadorleads.vercel.app/${landing.slug}`
      });
    }
  }

  console.log(`\n📊 RESULTADOS:`);
  console.log(`   Páginas CON "extranjería": ${paginasConExtranjeria}`);
  console.log(`   Páginas SIN "extranjería": ${landings.length - paginasConExtranjeria}`);
  console.log(`   Porcentaje: ${((paginasConExtranjeria / landings.length) * 100).toFixed(1)}%\n`);

  if (paginasConExtranjeria > 0) {
    console.log('📋 DETALLES DE PÁGINAS CON "EXTRANJERÍA":\n');
    detalles.forEach((d, i) => {
      console.log(`${i + 1}. ${d.ciudad} (${d.slug})`);
      console.log(`   Menciones: ${d.menciones}`);
      console.log(`   Campos afectados: ${d.campos.join(', ')}`);
      console.log(`   URL: ${d.url}`);
      console.log('');
    });

    console.log('\n💡 RECOMENDACIÓN:');
    console.log('   Ejecuta: npm run regenerate-abogados-landings');
    console.log('   Para regenerar TODAS las páginas con contenido actualizado.\n');
  } else {
    console.log('✅ ¡Todas las páginas están limpias!\n');
  }
}

checkExtranjeria().catch(console.error);
