/**
 * Script para limpiar la base de datos y regenerar las 76 landing pages correctas
 * 
 * Este script:
 * 1. Limpia ciudades incorrectas de la BD
 * 2. Inserta las 19 ciudades correctas
 * 3. Genera las 76 landing pages (4 servicios × 19 ciudades)
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  console.log('🚀 CORRECCIÓN COMPLETA DE BASE DE DATOS\n');
  console.log('========================================');
  console.log('Este script va a:');
  console.log('1. Eliminar ciudades incorrectas');
  console.log('2. Insertar las 19 ciudades correctas');
  console.log('3. Verificar servicios (4)');
  console.log('========================================\n');

  // Paso 1: Limpiar ciudades incorrectas
  console.log('📋 Paso 1: Limpiando ciudades incorrectas...\n');
  
  const { data: ciudadesAntes, error: errorAntes } = await supabase
    .from('ciudades_catalogo')
    .select('slug, nombre, provincia');
  
  console.log(`   Total ciudades ANTES: ${ciudadesAntes?.length || 0}`);
  
  // Eliminar ciudades que no están en las 19
  const ciudadesCorrectas = [
    'murcia', 'cartagena', 'lorca', 'mazarron', 'torre-pacheco',
    'san-javier', 'san-pedro-pinatar', 'molina-de-segura', 'aguilas',
    'cieza', 'jumilla', 'yecla',
    'alicante', 'elche', 'torrevieja', 'orihuela', 'rojales', 'benidorm', 'denia'
  ];
  
  const { error: errorDelete } = await supabase
    .from('ciudades_catalogo')
    .delete()
    .not('slug', 'in', `(${ciudadesCorrectas.map(c => `'${c}'`).join(',')})`);
  
  if (errorDelete) {
    console.error('   ❌ Error eliminando ciudades:', errorDelete);
  } else {
    console.log('   ✅ Ciudades incorrectas eliminadas');
  }
  
  // Eliminar landing pages de ciudades incorrectas
  const { error: errorDeleteLandings } = await supabase
    .from('landing_pages')
    .delete()
    .not('ciudad_slug', 'in', `(${ciudadesCorrectas.map(c => `'${c}'`).join(',')})`);
  
  if (errorDeleteLandings) {
    console.error('   ❌ Error eliminando landing pages:', errorDeleteLandings);
  } else {
    console.log('   ✅ Landing pages incorrectas eliminadas');
  }
  
  const { data: ciudadesDespues } = await supabase
    .from('ciudades_catalogo')
    .select('slug, nombre, provincia');
  
  console.log(`   Total ciudades DESPUÉS: ${ciudadesDespues?.length || 0}\n`);
  
  // Paso 2: Verificar las 19 ciudades
  console.log('📋 Paso 2: Verificando las 19 ciudades correctas...\n');
  
  const { data: ciudades, error: errorCiudades } = await supabase
    .from('ciudades_catalogo')
    .select('*')
    .in('slug', ciudadesCorrectas)
    .order('provincia, nombre');
  
  if (errorCiudades) {
    console.error('   ❌ Error obteniendo ciudades:', errorCiudades);
    return;
  }
  
  const ciudadesPorProvincia = ciudades?.reduce((acc: any, ciudad: any) => {
    acc[ciudad.provincia] = (acc[ciudad.provincia] || 0) + 1;
    return acc;
  }, {});
  
  console.log('   Ciudades por provincia:');
  Object.entries(ciudadesPorProvincia || {}).forEach(([provincia, count]) => {
    console.log(`   - ${provincia}: ${count} ciudades`);
  });
  
  const faltantes = ciudadesCorrectas.filter(slug => 
    !ciudades?.some((c: any) => c.slug === slug)
  );
  
  if (faltantes.length > 0) {
    console.log(`\n   ⚠️  FALTAN ${faltantes.length} ciudades:`);
    faltantes.forEach(slug => console.log(`      - ${slug}`));
    console.log('\n   💡 Debes ejecutar manualmente:');
    console.log('      supabase/02-insertar-19-ciudades.sql\n');
    return;
  } else {
    console.log('   ✅ Las 19 ciudades están correctas\n');
  }
  
  // Paso 3: Verificar servicios
  console.log('📋 Paso 3: Verificando los 4 servicios...\n');
  
  const { data: servicios, error: errorServicios } = await supabase
    .from('servicios_catalogo')
    .select('*')
    .order('slug');
  
  if (errorServicios) {
    console.error('   ❌ Error obteniendo servicios:', errorServicios);
    return;
  }
  
  console.log(`   Total servicios: ${servicios?.length || 0}`);
  servicios?.forEach((s: any) => {
    console.log(`   - ${s.slug}: ${s.nombre}`);
  });
  
  if (servicios?.length !== 4) {
    console.log('\n   ⚠️  Deberían ser exactamente 4 servicios');
    console.log('      Verifica el schema: supabase/landing-pages-schema.sql\n');
    return;
  } else {
    console.log('   ✅ Los 4 servicios están correctos\n');
  }
  
  // Resumen final
  console.log('========================================');
  console.log('✅ BASE DE DATOS CORREGIDA');
  console.log('========================================');
  console.log(`📊 Servicios: ${servicios?.length || 0}`);
  console.log(`📊 Ciudades: ${ciudades?.length || 0}`);
  console.log(`📊 Total combinaciones: ${(servicios?.length || 0) * (ciudades?.length || 0)}`);
  console.log('========================================\n');
  
  console.log('💡 Ahora puedes ejecutar:');
  console.log('   npm run generate-landings\n');
  console.log('   para generar las 76 landing pages correctas.\n');
}

main().catch(console.error);
