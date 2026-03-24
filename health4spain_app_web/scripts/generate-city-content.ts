/**
 * Script para generar contenido SEO extendido de ciudades con OpenAI
 * 
 * USO:
 *   npx ts-node scripts/generate-city-content.ts
 *   npx ts-node scripts/generate-city-content.ts --ciudad=marbella
 *   npx ts-node scripts/generate-city-content.ts --destacadas
 * 
 * REQUISITOS:
 *   - OPENAI_API_KEY en .env.local
 *   - SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local
 */

import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================
// TIPOS
// ============================================

interface Ciudad {
  slug: string;
  nombre: string;
  provincia: string;
  comunidad: string;
  poblacion: number;
  porcentaje_extranjeros: number;
  destacada: boolean;
  datos_extra: {
    aeropuerto_cercano?: string;
    distancia_aeropuerto?: number;
    categoria?: string;
    descripcion?: string;
  };
}

interface CiudadContenido {
  ciudad_slug: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  intro_text: string;
  barrios: Array<{ nombre: string; descripcion: string }>;
  coste_vida_alquiler: string;
  coste_vida_compra: string;
  coste_vida_alimentacion: string;
  coste_vida_transporte: string;
  coste_vida_utilidades: string;
  tramites: string[];
  faqs: Array<{ pregunta: string; respuesta: string }>;
  ventajas: string[];
  clima_detalle: string;
  temperatura_media: string;
  dias_sol: number;
}

// ============================================
// PROMPT TEMPLATE
// ============================================

function buildPrompt(ciudad: Ciudad): string {
  return `Eres un experto copywriter SEO especializado en guías de expatriación a España.
Genera contenido COMPLETO y DETALLADO para una guía de "Vivir en ${ciudad.nombre}" dirigida a expatriados.

DATOS DE LA CIUDAD:
- Nombre: ${ciudad.nombre}
- Provincia: ${ciudad.provincia}
- Comunidad: ${ciudad.comunidad}
- Población: ${ciudad.poblacion.toLocaleString()} habitantes
- % Extranjeros: ${ciudad.porcentaje_extranjeros}%
${ciudad.datos_extra.aeropuerto_cercano ? `- Aeropuerto: ${ciudad.datos_extra.aeropuerto_cercano} (${ciudad.datos_extra.distancia_aeropuerto} min)` : ''}
${ciudad.datos_extra.categoria ? `- Categoría: ${ciudad.datos_extra.categoria}` : ''}

INSTRUCCIONES CRÍTICAS:
1. El contenido debe ser EXTENSO (mínimo 1500 palabras totales)
2. ESPECÍFICO de ${ciudad.nombre} - usa datos reales y características únicas
3. Tono profesional pero cercano
4. Optimizado para SEO - keywords naturalmente integradas
5. Público objetivo: expatriados europeos (británicos, alemanes, franceses, nórdicos)
6. Incluye información PRÁCTICA y ÚTIL que realmente necesitan

Genera un JSON con esta estructura (responde SOLO con el JSON):

{
  "meta_title": "Máximo 60 caracteres, optimizado SEO, incluir año 2026",
  "meta_description": "Máximo 155 caracteres, llamada a la acción",
  "meta_keywords": "8-10 keywords long-tail separadas por comas",
  
  "intro_text": "Párrafo introductorio de 200-300 palabras explicando por qué ${ciudad.nombre} es ideal para expatriados. Menciona características únicas, calidad de vida, clima, comunidad internacional. Debe ser inspirador pero realista.",
  
  "barrios": [
    {"nombre": "Barrio/Zona 1", "descripcion": "Descripción detallada de 60-100 palabras: características, tipo de propiedades, perfil de residentes, servicios, ambiente, precios aproximados"},
    {"nombre": "Barrio/Zona 2", "descripcion": "..."},
    {"nombre": "Barrio/Zona 3", "descripcion": "..."},
    {"nombre": "Barrio/Zona 4", "descripcion": "..."},
    {"nombre": "Barrio/Zona 5", "descripcion": "..."}
  ],
  
  "coste_vida_alquiler": "Descripción detallada del mercado de alquiler: rangos de precios para estudios, 2 dorm, 3 dorm, diferentes zonas. Ejemplos concretos. 100-150 palabras.",
  "coste_vida_compra": "Precios de compra de vivienda: apartamentos, casas, propiedades premium. Precio por m². Zonas más caras/baratas. 100-150 palabras.",
  "coste_vida_alimentacion": "Coste mensual de compra, precios en supermercados, mercados locales, comer fuera (menú del día, restaurante medio, restaurante alto). Ejemplos concretos. 80-120 palabras.",
  "coste_vida_transporte": "Transporte público (abonos, billetes), necesidad de coche, combustible, taxis, conexión aeropuerto. 80-100 palabras.",
  "coste_vida_utilidades": "Luz, agua, gas, internet, móvil. Precios mensuales aproximados. 60-80 palabras.",
  
  "tramites": [
    "Trámite 1: descripción detallada con ubicación específica si aplica",
    "Trámite 2: ...",
    "Trámite 3: ...",
    "Trámite 4: ...",
    "Trámite 5: ...",
    "Trámite 6: ...",
    "Trámite 7: ...",
    "Trámite 8: ..."
  ],
  
  "faqs": [
    {
      "pregunta": "¿Es caro vivir en ${ciudad.nombre}?",
      "respuesta": "Respuesta detallada de 100-150 palabras con datos específicos, comparaciones, ejemplos concretos"
    },
    {
      "pregunta": "¿Necesito hablar español en ${ciudad.nombre}?",
      "respuesta": "Respuesta detallada..."
    },
    {
      "pregunta": "¿Qué tipo de visado necesito para vivir en ${ciudad.nombre}?",
      "respuesta": "Respuesta detallada con opciones..."
    },
    {
      "pregunta": "¿Cómo es la sanidad en ${ciudad.nombre}?",
      "respuesta": "Respuesta detallada con hospitales, centros de salud..."
    },
    {
      "pregunta": "¿Es segura ${ciudad.nombre}?",
      "respuesta": "Respuesta realista..."
    },
    {
      "pregunta": "¿Hay buenos colegios internacionales en ${ciudad.nombre}?",
      "respuesta": "Respuesta con nombres de colegios si los hay..."
    },
    {
      "pregunta": "¿Cómo es el transporte en ${ciudad.nombre}?",
      "respuesta": "Respuesta detallada..."
    },
    {
      "pregunta": "¿Qué hacer en ${ciudad.nombre}? / ¿Hay trabajo en ${ciudad.nombre}?",
      "respuesta": "Respuesta específica de la ciudad..."
    }
  ],
  
  "ventajas": [
    "Ventaja específica 1 de ${ciudad.nombre}",
    "Ventaja específica 2",
    "Ventaja específica 3",
    "Ventaja específica 4",
    "Ventaja específica 5",
    "Ventaja específica 6"
  ],
  
  "clima_detalle": "Descripción detallada del clima de ${ciudad.nombre}: temperaturas por estaciones, precipitaciones, vientos, microclima si aplica. 80-120 palabras.",
  "temperatura_media": "Ejemplo: 18°C media anual",
  "dias_sol": Número estimado de días de sol al año (número entero)
}`;
}

// ============================================
// FUNCIONES PRINCIPALES
// ============================================

async function getCiudades(destacadas?: boolean): Promise<Ciudad[]> {
  let query = supabase.from('ciudades_catalogo').select('*');
  
  if (destacadas) {
    query = query.eq('destacada', true);
  }
  
  query = query.order('nombre');
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data || [];
}

async function generateCiudadContent(ciudad: Ciudad): Promise<CiudadContenido | null> {
  const startTime = Date.now();
  
  console.log(`\n🔄 Generando contenido para: ${ciudad.nombre}...`);
  
  try {
    const prompt = buildPrompt(ciudad);
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // Usamos el modelo más potente para contenido largo y de calidad
      messages: [
        {
          role: 'system',
          content: 'Eres un copywriter SEO experto en guías de expatriación. Generas contenido extenso, detallado y específico. Responde SOLO con JSON válido, sin markdown.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 4000,
    });

    const responseText = completion.choices[0].message.content || '';
    const tokensInput = completion.usage?.prompt_tokens || 0;
    const tokensOutput = completion.usage?.completion_tokens || 0;
    
    // Parsear JSON
    const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const generated = JSON.parse(cleanJson);
    
    const content: CiudadContenido = {
      ciudad_slug: ciudad.slug,
      ...generated
    };
    
    const elapsed = Date.now() - startTime;
    const coste = (tokensInput * 0.0025 + tokensOutput * 0.01) / 1000; // Precios GPT-4o
    
    console.log(`✅ ${ciudad.nombre} generado`);
    console.log(`   📊 ${tokensInput + tokensOutput} tokens (${tokensInput} in / ${tokensOutput} out)`);
    console.log(`   💰 Coste: $${coste.toFixed(4)}`);
    console.log(`   ⏱️  Tiempo: ${elapsed}ms`);
    
    return content;
    
  } catch (error: any) {
    console.error(`❌ Error en ${ciudad.nombre}:`, error.message);
    return null;
  }
}

async function saveContenido(content: CiudadContenido): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('ciudades_contenido')
      .upsert({
        ciudad_slug: content.ciudad_slug,
        meta_title: content.meta_title,
        meta_description: content.meta_description,
        meta_keywords: content.meta_keywords,
        intro_text: content.intro_text,
        barrios: content.barrios,
        coste_vida_alquiler: content.coste_vida_alquiler,
        coste_vida_compra: content.coste_vida_compra,
        coste_vida_alimentacion: content.coste_vida_alimentacion,
        coste_vida_transporte: content.coste_vida_transporte,
        coste_vida_utilidades: content.coste_vida_utilidades,
        tramites: content.tramites,
        faqs: content.faqs,
        ventajas: content.ventajas,
        clima_detalle: content.clima_detalle,
        temperatura_media: content.temperatura_media,
        dias_sol: content.dias_sol,
        generado_por_ia: true,
        fecha_generacion: new Date().toISOString(),
        activo: true,
      }, {
        onConflict: 'ciudad_slug'
      });
    
    if (error) throw error;
    return true;
    
  } catch (error: any) {
    console.error(`❌ Error guardando ${content.ciudad_slug}:`, error.message);
    return false;
  }
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('🚀 Generando contenido SEO de ciudades con OpenAI...\n');
  
  // Parsear argumentos
  const args = process.argv.slice(2);
  const filters: { ciudad?: string; destacadas?: boolean } = {};
  
  args.forEach(arg => {
    if (arg === '--destacadas') {
      filters.destacadas = true;
    } else {
      const [key, value] = arg.replace('--', '').split('=');
      if (key === 'ciudad' && value) {
        filters.ciudad = value;
      }
    }
  });
  
  // Obtener ciudades
  let ciudades = await getCiudades(filters.destacadas);
  
  if (filters.ciudad) {
    ciudades = ciudades.filter(c => c.slug === filters.ciudad);
  }
  
  if (ciudades.length === 0) {
    console.log('❌ No se encontraron ciudades con esos filtros');
    return;
  }
  
  console.log(`📊 Ciudades a procesar: ${ciudades.length}`);
  ciudades.forEach(c => console.log(`   - ${c.nombre}`));
  console.log('');
  
  let success = 0;
  let failed = 0;
  let totalCoste = 0;
  
  for (const ciudad of ciudades) {
    const content = await generateCiudadContent(ciudad);
    
    if (content) {
      const saved = await saveContenido(content);
      if (saved) {
        success++;
      } else {
        failed++;
      }
    } else {
      failed++;
    }
    
    // Delay para no saturar la API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n========================================');
  console.log(`✅ Exitosas: ${success}`);
  console.log(`❌ Fallidas: ${failed}`);
  console.log(`📊 Total: ${ciudades.length}`);
  console.log('========================================\n');
}

main().catch(console.error);
