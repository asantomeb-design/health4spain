/**
 * Ver qué servicios hay en la base de datos y cuántas landings tienen
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function checkServices() {
  console.log('📊 SERVICIOS Y LANDING PAGES\n');
  console.log('='.repeat(80) + '\n');

  // Obtener todos los servicios
  const { data: servicios, error: errorServicios } = await supabase
    .from('servicios_catalogo')
    .select('*')
    .order('slug');

  if (errorServicios) {
    console.error('❌ Error:', errorServicios.message);
    process.exit(1);
  }

  // Obtener todas las landing pages
  const { data: landings, error: errorLandings } = await supabase
    .from('landing_pages')
    .select('slug, servicio_slug, servicio_nombre, ciudad_nombre, hero_title')
    .order('servicio_slug');

  if (errorLandings) {
    console.error('❌ Error:', errorLandings.message);
    process.exit(1);
  }

  console.log(`Total de servicios: ${servicios?.length || 0}`);
  console.log(`Total de landing pages: ${landings?.length || 0}\n`);
  console.log('─'.repeat(80) + '\n');

  // Agrupar por servicio
  for (const servicio of servicios || []) {
    const servicioLandings = landings?.filter(l => l.servicio_slug === servicio.slug) || [];
    
    console.log(`🔸 ${servicio.nombre_plural} (${servicio.slug})`);
    console.log(`   Descripción: ${servicio.descripcion_corta}`);
    console.log(`   Keywords: ${servicio.keywords?.join(', ') || 'N/A'}`);
    console.log(`   Landing pages: ${servicioLandings.length}`);
    
    if (servicioLandings.length > 0) {
      console.log(`   Ciudades:`);
      servicioLandings.slice(0, 5).forEach(l => {
        console.log(`      - ${l.ciudad_nombre}: ${l.hero_title?.substring(0, 50)}...`);
      });
      if (servicioLandings.length > 5) {
        console.log(`      ... y ${servicioLandings.length - 5} más`);
      }
    }
    console.log('');
  }

  console.log('─'.repeat(80) + '\n');
  
  // Mostrar ejemplo de H1 por cada servicio
  console.log('📝 EJEMPLOS DE H1 ACTUALES (para revisar SEO):\n');
  
  for (const servicio of servicios || []) {
    const ejemplo = landings?.find(l => l.servicio_slug === servicio.slug);
    if (ejemplo) {
      console.log(`${servicio.nombre_plural}:`);
      console.log(`   "${ejemplo.hero_title}"`);
      console.log(`   Ciudad: ${ejemplo.ciudad_nombre}`);
      console.log('');
    }
  }
}

checkServices().catch(console.error);
