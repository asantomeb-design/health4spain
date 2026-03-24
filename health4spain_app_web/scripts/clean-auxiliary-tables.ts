/**
 * Script para limpiar y ajustar las tablas auxiliares
 * - landing_generation_log
 * - ciudades_contenido
 * 
 * Ejecutar DESPUÉS de generar las 76 landing pages
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Las 19 ciudades correctas
const CIUDADES_CORRECTAS = [
  'murcia', 'cartagena', 'lorca', 'mazarron', 'torre-pacheco',
  'san-javier', 'san-pedro-pinatar', 'molina-de-segura', 'aguilas',
  'cieza', 'jumilla', 'yecla',
  'alicante', 'elche', 'torrevieja', 'orihuela', 'rojales', 'benidorm', 'denia'
];

async function main() {
  console.log('🧹 LIMPIANDO TABLAS AUXILIARES\n');
  console.log('========================================');
  console.log('Tablas a limpiar:');
  console.log('1. landing_generation_log');
  console.log('2. ciudades_contenido');
  console.log('========================================\n');
  
  // ============================================
  // 1. LIMPIAR landing_generation_log
  // ============================================
  console.log('📋 1. Limpiando landing_generation_log...\n');
  
  // Contar registros antes
  const { count: logBefore } = await supabase
    .from('landing_generation_log')
    .select('*', { count: 'exact', head: true });
  
  console.log(`   Registros ANTES: ${logBefore || 0}`);
  
  // Obtener todos los slugs de landing pages que SÍ existen
  const { data: landingsExistentes } = await supabase
    .from('landing_pages')
    .select('slug');
  
  const slugsValidos = landingsExistentes?.map(l => l.slug) || [];
  
  if (slugsValidos.length === 0) {
    console.log('   ⚠️  No hay landing pages generadas todavía');
    console.log('   💡 Primero ejecuta: npm run generate-landings\n');
    return;
  }
  
  // Borrar logs de landing pages que ya no existen
  const { error: errorLog } = await supabase
    .from('landing_generation_log')
    .delete()
    .not('slug', 'in', `(${slugsValidos.map(s => `'${s}'`).join(',')})`);
  
  if (errorLog) {
    console.error('   ❌ Error:', errorLog.message);
  } else {
    console.log('   ✅ Logs de landing pages incorrectas eliminados');
  }
  
  // Contar registros después
  const { count: logAfter } = await supabase
    .from('landing_generation_log')
    .select('*', { count: 'exact', head: true });
  
  console.log(`   Registros DESPUÉS: ${logAfter || 0}`);
  console.log(`   Eliminados: ${(logBefore || 0) - (logAfter || 0)}\n`);
  
  // ============================================
  // 2. LIMPIAR ciudades_contenido
  // ============================================
  console.log('📋 2. Limpiando ciudades_contenido...\n');
  
  // Contar registros antes
  const { count: ciudadesBefore } = await supabase
    .from('ciudades_contenido')
    .select('*', { count: 'exact', head: true });
  
  console.log(`   Registros ANTES: ${ciudadesBefore || 0}`);
  
  // Borrar contenido de ciudades que no están en las 19
  const { error: errorCiudades } = await supabase
    .from('ciudades_contenido')
    .delete()
    .not('ciudad_slug', 'in', `(${CIUDADES_CORRECTAS.map(c => `'${c}'`).join(',')})`);
  
  if (errorCiudades) {
    console.error('   ❌ Error:', errorCiudades.message);
  } else {
    console.log('   ✅ Contenido de ciudades incorrectas eliminado');
  }
  
  // Contar registros después
  const { count: ciudadesAfter } = await supabase
    .from('ciudades_contenido')
    .select('*', { count: 'exact', head: true });
  
  console.log(`   Registros DESPUÉS: ${ciudadesAfter || 0}`);
  console.log(`   Eliminados: ${(ciudadesBefore || 0) - (ciudadesAfter || 0)}\n`);
  
  // ============================================
  // RESUMEN FINAL
  // ============================================
  console.log('========================================');
  console.log('✅ TABLAS AUXILIARES LIMPIAS');
  console.log('========================================');
  
  // Verificar estado final
  const { count: landingsTotal } = await supabase
    .from('landing_pages')
    .select('*', { count: 'exact', head: true });
  
  const { data: ciudadesTotal } = await supabase
    .from('ciudades_catalogo')
    .select('slug');
  
  console.log(`📊 Landing pages: ${landingsTotal || 0}`);
  console.log(`📊 Ciudades catálogo: ${ciudadesTotal?.length || 0}`);
  console.log(`📊 Landing generation log: ${logAfter || 0} registros`);
  console.log(`📊 Ciudades contenido: ${ciudadesAfter || 0} registros`);
  console.log('========================================\n');
  
  if (landingsTotal === 76 && ciudadesTotal?.length === 19) {
    console.log('✅ TODO PERFECTO!');
    console.log('   - 76 landing pages generadas');
    console.log('   - 19 ciudades en catálogo');
    console.log('   - Tablas auxiliares limpias\n');
  } else {
    console.log('⚠️  VERIFICAR:');
    if (landingsTotal !== 76) {
      console.log(`   - Landing pages: ${landingsTotal} (deberían ser 76)`);
    }
    if (ciudadesTotal?.length !== 19) {
      console.log(`   - Ciudades: ${ciudadesTotal?.length} (deberían ser 19)`);
    }
    console.log('');
  }
  
  // Sugerencias para ciudades_contenido
  const ciudadesSinContenido = CIUDADES_CORRECTAS.filter(slug => 
    !ciudadesAfter || ciudadesAfter === 0
  );
  
  if (ciudadesSinContenido.length > 0 && ciudadesAfter === 0) {
    console.log('💡 OPCIONAL: Generar contenido para ciudades');
    console.log('   Las 19 ciudades no tienen contenido extendido');
    console.log('   Para generarlo ejecuta:');
    console.log('   npm run generate-cities\n');
  }
}

main().catch(console.error);
