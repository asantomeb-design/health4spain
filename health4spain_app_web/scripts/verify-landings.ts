/**
 * Script para verificar el estado actual de las landing pages
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  console.log('📊 VERIFICANDO ESTADO DE LANDING PAGES\n');
  
  // Total de landing pages
  const { count: total } = await supabase
    .from('landing_pages')
    .select('*', { count: 'exact', head: true });
  
  console.log(`📄 Total landing pages: ${total || 0} de 76 esperadas\n`);
  
  // Por servicio
  const { data: porServicio } = await supabase
    .from('landing_pages')
    .select('servicio_slug');
  
  if (porServicio) {
    const count: Record<string, number> = {};
    porServicio.forEach(l => {
      count[l.servicio_slug] = (count[l.servicio_slug] || 0) + 1;
    });
    
    console.log('Por servicio:');
    Object.entries(count).forEach(([servicio, num]) => {
      console.log(`  - ${servicio}: ${num} de 19`);
    });
  }
  
  console.log('');
  
  // Ciudades y servicios en catálogo
  const { data: servicios } = await supabase
    .from('servicios_catalogo')
    .select('slug');
  
  const { data: ciudades } = await supabase
    .from('ciudades_catalogo')
    .select('slug');
  
  const servicioSlugs = servicios?.map(s => s.slug) || [];
  const ciudadSlugs = ciudades?.map(c => c.slug) || [];
  
  console.log(`📦 Servicios en catálogo: ${servicioSlugs.length}`);
  console.log(`   ${servicioSlugs.join(', ')}\n`);
  
  console.log(`🏙️  Ciudades en catálogo: ${ciudadSlugs.length}`);
  console.log(`   ${ciudadSlugs.join(', ')}\n`);
  
  // Detectar qué combinaciones faltan
  const { data: existing } = await supabase
    .from('landing_pages')
    .select('slug');
  
  const existingSlugs = new Set(existing?.map(l => l.slug) || []);
  const missing: string[] = [];
  
  for (const servicio of servicioSlugs) {
    for (const ciudad of ciudadSlugs) {
      const slug = `${servicio}-${ciudad}`;
      if (!existingSlugs.has(slug)) {
        missing.push(slug);
      }
    }
  }
  
  if (missing.length > 0) {
    console.log(`❌ FALTAN ${missing.length} landing pages:\n`);
    missing.forEach(slug => console.log(`   - ${slug}`));
    console.log('\n💡 Para generarlas, ejecuta:');
    missing.forEach(slug => {
      console.log(`   npm run generate-landings -- --slug=${slug}`);
    });
  } else {
    console.log('✅ ¡PERFECTO! Todas las 76 landing pages están generadas\n');
  }
}

main().catch(console.error);
