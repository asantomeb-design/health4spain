/**
 * Script para borrar todas las landing pages y regenerarlas correctamente
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  console.log('🗑️  LIMPIANDO LANDING PAGES ANTIGUAS\n');
  
  // Ver cuántas hay antes
  const { count: before } = await supabase
    .from('landing_pages')
    .select('*', { count: 'exact', head: true });
  
  console.log(`   Landing pages ANTES: ${before || 0}\n`);
  
  // Borrar TODAS las landing pages
  console.log('   Borrando todas las landing pages...');
  const { error } = await supabase
    .from('landing_pages')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Condición que borra todas
  
  if (error) {
    console.error('   ❌ Error:', error);
    return;
  }
  
  // Verificar que se borraron
  const { count: after } = await supabase
    .from('landing_pages')
    .select('*', { count: 'exact', head: true });
  
  console.log(`   Landing pages DESPUÉS: ${after || 0}`);
  console.log('   ✅ Todas las landing pages eliminadas\n');
  
  // Verificar ciudades y servicios
  const { data: ciudades } = await supabase
    .from('ciudades_catalogo')
    .select('slug, nombre, provincia');
  
  const { data: servicios } = await supabase
    .from('servicios_catalogo')
    .select('slug, nombre');
  
  console.log('========================================');
  console.log('✅ BASE DE DATOS LIMPIA');
  console.log('========================================');
  console.log(`📊 Servicios: ${servicios?.length || 0}`);
  console.log(`📊 Ciudades: ${ciudades?.length || 0}`);
  console.log(`📊 Total a generar: ${(servicios?.length || 0) * (ciudades?.length || 0)} landing pages`);
  console.log('========================================\n');
  
  if (ciudades?.length !== 19) {
    console.log('⚠️  ATENCIÓN: Deberían ser 19 ciudades!');
    console.log(`   Encontradas: ${ciudades?.length}\n`);
  }
  
  if (servicios?.length !== 4) {
    console.log('⚠️  ATENCIÓN: Deberían ser 4 servicios!');
    console.log(`   Encontrados: ${servicios?.length}\n`);
  }
  
  console.log('💡 Ahora ejecuta:');
  console.log('   npm run generate-landings\n');
  console.log('   para generar las 76 landing pages correctas.\n');
}

main().catch(console.error);
