/**
 * Script para listar todas las landing pages y ver qué tenemos exactamente
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  console.log('📋 LISTADO COMPLETO DE LANDING PAGES\n');
  
  const { data: landings, error } = await supabase
    .from('landing_pages')
    .select('slug, servicio_slug, ciudad_slug')
    .order('servicio_slug, ciudad_slug');
  
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  if (!landings) {
    console.log('❌ No hay landing pages');
    return;
  }
  
  console.log(`Total: ${landings.length}\n`);
  
  let currentServicio = '';
  let count = 0;
  
  landings.forEach((l, i) => {
    if (l.servicio_slug !== currentServicio) {
      if (currentServicio) console.log(`   → Total ${currentServicio}: ${count}\n`);
      currentServicio = l.servicio_slug;
      count = 0;
      console.log(`${l.servicio_slug.toUpperCase()}:`);
    }
    count++;
    console.log(`  ${count}. ${l.slug}`);
  });
  
  console.log(`   → Total ${currentServicio}: ${count}\n`);
}

main().catch(console.error);
