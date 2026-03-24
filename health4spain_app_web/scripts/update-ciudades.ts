/**
 * Script para actualizar el catálogo de ciudades con las principales ciudades de España
 * 
 * Uso:
 *   npm run update-ciudades
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const NUEVAS_CIUDADES = [
  // Ciudades principales de España
  { slug: 'madrid', nombre: 'Madrid', provincia: 'Madrid', comunidad: 'Comunidad de Madrid', poblacion: 3300000, porcentaje_extranjeros: 13.50, destacada: true, datos_extra: { aeropuerto_cercano: 'Madrid-Barajas', distancia_aeropuerto: 15, categoria: 'Centro', descripcion: 'Capital cosmopolita' }},
  { slug: 'barcelona', nombre: 'Barcelona', provincia: 'Barcelona', comunidad: 'Cataluña', poblacion: 1600000, porcentaje_extranjeros: 17.80, destacada: true, datos_extra: { aeropuerto_cercano: 'Barcelona-El Prat', distancia_aeropuerto: 20, categoria: 'Cataluña', descripcion: 'Arte y mediterráneo' }},
  { slug: 'valencia', nombre: 'Valencia', provincia: 'Valencia', comunidad: 'Comunidad Valenciana', poblacion: 800000, porcentaje_extranjeros: 12.50, destacada: true, datos_extra: { aeropuerto_cercano: 'Valencia', distancia_aeropuerto: 12, categoria: 'Levante', descripcion: 'Ciudad de las artes' }},
  { slug: 'malaga', nombre: 'Málaga', provincia: 'Málaga', comunidad: 'Andalucía', poblacion: 580000, porcentaje_extranjeros: 9.20, destacada: true, datos_extra: { aeropuerto_cercano: 'Málaga-Costa del Sol', distancia_aeropuerto: 10, categoria: 'Costa del Sol', descripcion: 'Costa andaluza' }},
  { slug: 'marbella', nombre: 'Marbella', provincia: 'Málaga', comunidad: 'Andalucía', poblacion: 145000, porcentaje_extranjeros: 35.50, destacada: true, datos_extra: { aeropuerto_cercano: 'Málaga-Costa del Sol', distancia_aeropuerto: 50, categoria: 'Costa del Sol', descripcion: 'Lujo y glamour' }},
  { slug: 'sevilla', nombre: 'Sevilla', provincia: 'Sevilla', comunidad: 'Andalucía', poblacion: 690000, porcentaje_extranjeros: 4.80, destacada: true, datos_extra: { aeropuerto_cercano: 'Sevilla', distancia_aeropuerto: 15, categoria: 'Andalucía', descripcion: 'Flamenco y tradición' }},
  { slug: 'palma', nombre: 'Palma de Mallorca', provincia: 'Baleares', comunidad: 'Islas Baleares', poblacion: 420000, porcentaje_extranjeros: 20.30, destacada: true, datos_extra: { aeropuerto_cercano: 'Palma de Mallorca', distancia_aeropuerto: 10, categoria: 'Islas Baleares', descripcion: 'Perla del mediterráneo' }},
  { slug: 'tenerife', nombre: 'Tenerife', provincia: 'Santa Cruz de Tenerife', comunidad: 'Canarias', poblacion: 930000, porcentaje_extranjeros: 15.60, destacada: true, datos_extra: { aeropuerto_cercano: 'Tenerife Sur', distancia_aeropuerto: 60, categoria: 'Islas Canarias', descripcion: 'Eterna primavera' }},
  { slug: 'las-palmas', nombre: 'Las Palmas', provincia: 'Las Palmas', comunidad: 'Canarias', poblacion: 380000, porcentaje_extranjeros: 12.40, destacada: true, datos_extra: { aeropuerto_cercano: 'Gran Canaria', distancia_aeropuerto: 20, categoria: 'Islas Canarias', descripcion: 'Clima tropical' }},
  { slug: 'ibiza', nombre: 'Ibiza', provincia: 'Baleares', comunidad: 'Islas Baleares', poblacion: 150000, porcentaje_extranjeros: 28.70, destacada: true, datos_extra: { aeropuerto_cercano: 'Ibiza', distancia_aeropuerto: 8, categoria: 'Islas Baleares', descripcion: 'Vida y naturaleza' }},
  { slug: 'granada', nombre: 'Granada', provincia: 'Granada', comunidad: 'Andalucía', poblacion: 230000, porcentaje_extranjeros: 6.50, destacada: true, datos_extra: { aeropuerto_cercano: 'Granada-Jaén', distancia_aeropuerto: 17, categoria: 'Andalucía', descripcion: 'Alhambra y sierra' }},
  { slug: 'bilbao', nombre: 'Bilbao', provincia: 'Vizcaya', comunidad: 'País Vasco', poblacion: 350000, porcentaje_extranjeros: 7.20, destacada: true, datos_extra: { aeropuerto_cercano: 'Bilbao', distancia_aeropuerto: 12, categoria: 'País Vasco', descripcion: 'Cultura y gastronomía' }},
  { slug: 'fuengirola', nombre: 'Fuengirola', provincia: 'Málaga', comunidad: 'Andalucía', poblacion: 80000, porcentaje_extranjeros: 32.40, destacada: true, datos_extra: { aeropuerto_cercano: 'Málaga-Costa del Sol', distancia_aeropuerto: 25, categoria: 'Costa del Sol', descripcion: 'Playas y familias' }},
  { slug: 'estepona', nombre: 'Estepona', provincia: 'Málaga', comunidad: 'Andalucía', poblacion: 70000, porcentaje_extranjeros: 28.60, destacada: true, datos_extra: { aeropuerto_cercano: 'Málaga-Costa del Sol', distancia_aeropuerto: 80, categoria: 'Costa del Sol', descripcion: 'Pueblo andaluz' }},
  { slug: 'nerja', nombre: 'Nerja', provincia: 'Málaga', comunidad: 'Andalucía', poblacion: 22000, porcentaje_extranjeros: 35.80, destacada: false, datos_extra: { aeropuerto_cercano: 'Málaga-Costa del Sol', distancia_aeropuerto: 55, categoria: 'Costa del Sol', descripcion: 'Balcón de Europa' }},
  { slug: 'benidorm', nombre: 'Benidorm', provincia: 'Alicante', comunidad: 'Comunidad Valenciana', poblacion: 68000, porcentaje_extranjeros: 24.00, destacada: true, datos_extra: { aeropuerto_cercano: 'Alicante', distancia_aeropuerto: 50, categoria: 'Costa Blanca', descripcion: '' }},
];

async function updateCiudades() {
  console.log('\n🏙️  Actualizando catálogo de ciudades...\n');
  
  let insertados = 0;
  let actualizados = 0;
  let errores = 0;
  
  for (const ciudad of NUEVAS_CIUDADES) {
    try {
      // Intentar insertar o actualizar
      const { data, error } = await supabase
        .from('ciudades_catalogo')
        .upsert(ciudad, { 
          onConflict: 'slug',
          ignoreDuplicates: false 
        })
        .select();
      
      if (error) {
        console.log(`   ❌ ${ciudad.nombre}: ${error.message}`);
        errores++;
      } else {
        console.log(`   ✅ ${ciudad.nombre} (${ciudad.provincia})`);
        if (data && data.length > 0) {
          actualizados++;
        } else {
          insertados++;
        }
      }
    } catch (err) {
      console.log(`   ❌ ${ciudad.nombre}: Error desconocido`);
      errores++;
    }
  }
  
  console.log('\n📊 Resumen:');
  console.log(`   ✅ Procesadas: ${NUEVAS_CIUDADES.length}`);
  console.log(`   ➕ Insertadas/Actualizadas: ${insertados + actualizados}`);
  console.log(`   ❌ Errores: ${errores}`);
  
  // Verificar total de ciudades
  const { count } = await supabase
    .from('ciudades_catalogo')
    .select('*', { count: 'exact', head: true });
  
  console.log(`\n📍 Total de ciudades en catálogo: ${count}`);
  console.log('\n✅ Actualización completada!\n');
}

updateCiudades();
