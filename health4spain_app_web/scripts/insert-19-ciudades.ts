/**
 * Script para insertar las 19 ciudades estratégicas en Supabase
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CIUDADES_19 = [
  // REGIÓN DE MURCIA (12)
  {
    slug: 'murcia',
    nombre: 'Murcia',
    provincia: 'Murcia',
    comunidad: 'Región de Murcia',
    poblacion: 460000,
    porcentaje_extranjeros: 13.00,
    destacada: true,
    datos_extra: {
      aeropuerto_cercano: 'Corvera',
      distancia_aeropuerto: 30,
      categoria: 'Capital',
      perfil_economico: 'Servicios, logística, IT',
      descripcion: 'Capital de la región, centro de servicios'
    }
  },
  {
    slug: 'cartagena',
    nombre: 'Cartagena',
    provincia: 'Murcia',
    comunidad: 'Región de Murcia',
    poblacion: 215000,
    porcentaje_extranjeros: 13.00,
    destacada: true,
    datos_extra: {
      aeropuerto_cercano: 'Corvera',
      distancia_aeropuerto: 25,
      categoria: 'Puerto industrial',
      perfil_economico: 'Puerto, industria, energía',
      descripcion: 'Ciudad portuaria histórica'
    }
  },
  {
    slug: 'lorca',
    nombre: 'Lorca',
    provincia: 'Murcia',
    comunidad: 'Región de Murcia',
    poblacion: 98000,
    porcentaje_extranjeros: 20.00,
    destacada: false,
    datos_extra: {
      aeropuerto_cercano: 'Corvera',
      distancia_aeropuerto: 70,
      categoria: 'Agroindustrial',
      perfil_economico: 'Agroindustria, ganadería',
      descripcion: 'Centro agroindustrial'
    }
  },
  {
    slug: 'mazarron',
    nombre: 'Mazarrón',
    provincia: 'Murcia',
    comunidad: 'Región de Murcia',
    poblacion: 33000,
    porcentaje_extranjeros: 20.00,
    destacada: false,
    datos_extra: {
      aeropuerto_cercano: 'Corvera',
      distancia_aeropuerto: 45,
      categoria: 'Costa Cálida',
      perfil_economico: 'Turismo estacional, agrícola',
      descripcion: 'Costa tranquila'
    }
  },
  {
    slug: 'torre-pacheco',
    nombre: 'Torre Pacheco',
    provincia: 'Murcia',
    comunidad: 'Región de Murcia',
    poblacion: 38000,
    porcentaje_extranjeros: 30.00,
    destacada: false,
    datos_extra: {
      aeropuerto_cercano: 'Corvera',
      distancia_aeropuerto: 15,
      categoria: 'Agroindustrial',
      perfil_economico: 'Agroindustria, logística',
      descripcion: 'Centro de distribución'
    }
  },
  {
    slug: 'san-javier',
    nombre: 'San Javier',
    provincia: 'Murcia',
    comunidad: 'Región de Murcia',
    poblacion: 33000,
    porcentaje_extranjeros: 25.00,
    destacada: false,
    datos_extra: {
      aeropuerto_cercano: 'Corvera',
      distancia_aeropuerto: 5,
      categoria: 'Mar Menor',
      perfil_economico: 'Turismo, servicios, hostelería',
      descripcion: 'Vive junto al Mar Menor'
    }
  },
  {
    slug: 'san-pedro-pinatar',
    nombre: 'San Pedro del Pinatar',
    provincia: 'Murcia',
    comunidad: 'Región de Murcia',
    poblacion: 27000,
    porcentaje_extranjeros: 20.00,
    destacada: false,
    datos_extra: {
      aeropuerto_cercano: 'Corvera',
      distancia_aeropuerto: 15,
      categoria: 'Mar Menor',
      perfil_economico: 'Turismo, servicios sociosanitarios',
      descripcion: 'Retiro tranquilo y activo'
    }
  },
  {
    slug: 'molina-de-segura',
    nombre: 'Molina de Segura',
    provincia: 'Murcia',
    comunidad: 'Región de Murcia',
    poblacion: 74000,
    porcentaje_extranjeros: 15.00,
    destacada: false,
    datos_extra: {
      aeropuerto_cercano: 'Corvera',
      distancia_aeropuerto: 35,
      categoria: 'Industrial',
      perfil_economico: 'Industria agroalimentaria, logística',
      descripcion: 'Empleo estable industrial'
    }
  },
  {
    slug: 'aguilas',
    nombre: 'Águilas',
    provincia: 'Murcia',
    comunidad: 'Región de Murcia',
    poblacion: 35000,
    porcentaje_extranjeros: 15.00,
    destacada: false,
    datos_extra: {
      aeropuerto_cercano: 'Corvera',
      distancia_aeropuerto: 90,
      categoria: 'Costa Cálida',
      perfil_economico: 'Turismo, construcción',
      descripcion: 'Costa sur de Murcia'
    }
  },
  {
    slug: 'cieza',
    nombre: 'Cieza',
    provincia: 'Murcia',
    comunidad: 'Región de Murcia',
    poblacion: 28000,
    porcentaje_extranjeros: 18.00,
    destacada: false,
    datos_extra: {
      aeropuerto_cercano: 'Corvera',
      distancia_aeropuerto: 80,
      categoria: 'Agrícola',
      perfil_economico: 'Agricultura, cerealista',
      descripcion: 'Valle del río Segura'
    }
  },
  {
    slug: 'jumilla',
    nombre: 'Jumilla',
    provincia: 'Murcia',
    comunidad: 'Región de Murcia',
    poblacion: 24000,
    porcentaje_extranjeros: 16.00,
    destacada: false,
    datos_extra: {
      aeropuerto_cercano: 'Corvera',
      distancia_aeropuerto: 90,
      categoria: 'Vitivinícola',
      perfil_economico: 'Vitivinicultura, agricultura',
      descripcion: 'Tierra de vinos'
    }
  },
  {
    slug: 'yecla',
    nombre: 'Yecla',
    provincia: 'Murcia',
    comunidad: 'Región de Murcia',
    poblacion: 31000,
    porcentaje_extranjeros: 14.00,
    destacada: false,
    datos_extra: {
      aeropuerto_cercano: 'Corvera',
      distancia_aeropuerto: 100,
      categoria: 'Industrial',
      perfil_economico: 'Mueble, cerámica, industrial',
      descripcion: 'Centro del mueble'
    }
  },
  // PROVINCIA DE ALICANTE (7)
  {
    slug: 'alicante',
    nombre: 'Alicante',
    provincia: 'Alicante',
    comunidad: 'Comunidad Valenciana',
    poblacion: 330000,
    porcentaje_extranjeros: 23.00,
    destacada: true,
    datos_extra: {
      aeropuerto_cercano: 'Alicante',
      distancia_aeropuerto: 15,
      categoria: 'Costa Blanca',
      perfil_economico: 'Turismo, servicios, comercio',
      descripcion: 'Capital de la Costa Blanca'
    }
  },
  {
    slug: 'elche',
    nombre: 'Elche',
    provincia: 'Alicante',
    comunidad: 'Comunidad Valenciana',
    poblacion: 230000,
    porcentaje_extranjeros: 20.00,
    destacada: false,
    datos_extra: {
      aeropuerto_cercano: 'Alicante',
      distancia_aeropuerto: 20,
      categoria: 'Industrial',
      perfil_economico: 'Calzado, textil, agrícola',
      descripcion: 'Empleo industrial garantizado'
    }
  },
  {
    slug: 'torrevieja',
    nombre: 'Torrevieja',
    provincia: 'Alicante',
    comunidad: 'Comunidad Valenciana',
    poblacion: 90000,
    porcentaje_extranjeros: 28.00,
    destacada: true,
    datos_extra: {
      aeropuerto_cercano: 'Alicante',
      distancia_aeropuerto: 40,
      categoria: 'Costa Blanca Sur',
      perfil_economico: 'Turismo premium, retiro',
      descripcion: 'Tu retiro en la Costa Blanca'
    }
  },
  {
    slug: 'orihuela',
    nombre: 'Orihuela',
    provincia: 'Alicante',
    comunidad: 'Comunidad Valenciana',
    poblacion: 110000,
    porcentaje_extranjeros: 18.00,
    destacada: false,
    datos_extra: {
      aeropuerto_cercano: 'Alicante',
      distancia_aeropuerto: 50,
      categoria: 'Bajo Segura',
      perfil_economico: 'Agrícola, turismo, comercio',
      descripcion: 'Vive en el corazón del Bajo Segura'
    }
  },
  {
    slug: 'rojales',
    nombre: 'Rojales',
    provincia: 'Alicante',
    comunidad: 'Comunidad Valenciana',
    poblacion: 35000,
    porcentaje_extranjeros: 22.00,
    destacada: false,
    datos_extra: {
      aeropuerto_cercano: 'Alicante',
      distancia_aeropuerto: 35,
      categoria: 'Costa Blanca Sur',
      perfil_economico: 'Retiro, turismo residencial',
      descripcion: 'Retiro tranquilo con servicios premium'
    }
  },
  {
    slug: 'benidorm',
    nombre: 'Benidorm',
    provincia: 'Alicante',
    comunidad: 'Comunidad Valenciana',
    poblacion: 70000,
    porcentaje_extranjeros: 35.00,
    destacada: true,
    datos_extra: {
      aeropuerto_cercano: 'Alicante',
      distancia_aeropuerto: 50,
      categoria: 'Costa Blanca',
      perfil_economico: 'Turismo de masas',
      descripcion: 'Capital turística del Mediterráneo'
    }
  },
  {
    slug: 'denia',
    nombre: 'Dénia',
    provincia: 'Alicante',
    comunidad: 'Comunidad Valenciana',
    poblacion: 42000,
    porcentaje_extranjeros: 15.00,
    destacada: false,
    datos_extra: {
      aeropuerto_cercano: 'Alicante',
      distancia_aeropuerto: 90,
      categoria: 'Costa Blanca Norte',
      perfil_economico: 'Turismo gastronómico, pesca',
      descripcion: 'Ciudad gastronómica creativa'
    }
  }
];

async function main() {
  console.log('🚀 INSERTANDO LAS 19 CIUDADES ESTRATÉGICAS\n');
  
  let success = 0;
  let failed = 0;
  
  for (const ciudad of CIUDADES_19) {
    const { error } = await supabase
      .from('ciudades_catalogo')
      .upsert(ciudad, { onConflict: 'slug' });
    
    if (error) {
      console.error(`❌ Error insertando ${ciudad.nombre}:`, error.message);
      failed++;
    } else {
      console.log(`✅ ${ciudad.nombre} (${ciudad.provincia})`);
      success++;
    }
  }
  
  console.log('\n========================================');
  console.log(`✅ Insertadas: ${success}`);
  console.log(`❌ Fallidas: ${failed}`);
  console.log('========================================\n');
  
  // Verificar
  const { data, error } = await supabase
    .from('ciudades_catalogo')
    .select('provincia')
    .in('slug', CIUDADES_19.map(c => c.slug));
  
  if (!error && data) {
    const porProvincia = data.reduce((acc: any, row: any) => {
      acc[row.provincia] = (acc[row.provincia] || 0) + 1;
      return acc;
    }, {});
    
    console.log('📊 Verificación por provincia:');
    Object.entries(porProvincia).forEach(([prov, count]) => {
      console.log(`   ${prov}: ${count} ciudades`);
    });
  }
  
  console.log('\n💡 Ahora ejecuta:');
  console.log('   npm run generate-landings\n');
}

main().catch(console.error);
