/**
 * Script para borrar landing pages incorrectas y generar las correctas
 */

import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface Servicio {
  slug: string;
  nombre: string;
  nombre_plural: string;
  icon: string;
  descripcion_corta: string;
  keywords: string[];
}

interface Ciudad {
  slug: string;
  nombre: string;
  provincia: string;
  comunidad: string;
  poblacion: number;
  porcentaje_extranjeros: number;
  destacada: boolean;
  datos_extra: {
    aeropuerto_cercano: string;
    distancia_aeropuerto: number;
  };
}

function buildPrompt(servicio: Servicio, ciudad: Ciudad): string {
  return `Eres un experto copywriter SEO especializado en servicios para extranjeros en España. 
Genera contenido para una landing page de "${servicio.nombre}" en "${ciudad.nombre}".

DATOS DEL SERVICIO:
- Nombre: ${servicio.nombre}
- Descripción: ${servicio.descripcion_corta}
- Keywords: ${servicio.keywords.join(', ')}

DATOS DE LA CIUDAD:
- Ciudad: ${ciudad.nombre}
- Provincia: ${ciudad.provincia}
- Comunidad: ${ciudad.comunidad}
- Población: ${ciudad.poblacion.toLocaleString()} habitantes
- % Extranjeros: ${ciudad.porcentaje_extranjeros}%
- Aeropuerto más cercano: ${ciudad.datos_extra.aeropuerto_cercano} (${ciudad.datos_extra.distancia_aeropuerto} min)

INSTRUCCIONES:
1. El contenido debe ser ÚNICO y específico para esta combinación servicio+ciudad
2. Usa datos reales de la ciudad cuando sea posible
3. El tono debe ser profesional pero cercano
4. Optimiza para SEO con las keywords naturalmente integradas
5. El público objetivo son extranjeros (británicos, alemanes, franceses, nórdicos) que viven o quieren vivir en España

Genera un JSON con EXACTAMENTE esta estructura (responde SOLO con el JSON, sin explicaciones):

{
  "meta_title": "Máximo 60 caracteres, incluir ciudad y servicio",
  "meta_description": "Máximo 155 caracteres, llamada a la acción",
  "meta_keywords": "5-8 keywords separadas por comas",
  
  "hero_title": "Pregunta o afirmación impactante con ciudad",
  "hero_subtitle": "2-3 frases explicando el valor, máximo 200 caracteres",
  "hero_bullets": ["4 bullets cortos con beneficios clave"],
  
  "problem_title": "Título corto tipo '¿Te suena esto?'",
  "problems": ["5 problemas comunes que tiene el usuario"],
  "solution_title": "Título de solución tipo 'Nuestra solución'",
  "solution_text": "Párrafo de 2-3 frases explicando cómo resolvemos el problema",
  
  "services_title": "Título para la sección de servicios específicos",
  "services": [
    {"icon": "emoji", "title": "Servicio 1", "description": "Descripción corta"},
    {"icon": "emoji", "title": "Servicio 2", "description": "Descripción corta"},
    {"icon": "emoji", "title": "Servicio 3", "description": "Descripción corta"},
    {"icon": "emoji", "title": "Servicio 4", "description": "Descripción corta"},
    {"icon": "emoji", "title": "Servicio 5", "description": "Descripción corta"},
    {"icon": "emoji", "title": "Servicio 6", "description": "Descripción corta"}
  ],
  
  "why_city_title": "¿Por qué [servicio] en [ciudad]?",
  "why_city_text": "Párrafo específico sobre por qué esta ciudad es relevante para este servicio",
  "why_city_stats": [
    {"value": "dato numérico", "label": "descripción corta"},
    {"value": "dato numérico", "label": "descripción corta"},
    {"value": "dato numérico", "label": "descripción corta"},
    {"value": "dato numérico", "label": "descripción corta"}
  ],
  
  "faqs": [
    {"question": "Pregunta frecuente 1 específica de ciudad+servicio", "answer": "Respuesta detallada"},
    {"question": "Pregunta frecuente 2", "answer": "Respuesta detallada"},
    {"question": "Pregunta frecuente 3", "answer": "Respuesta detallada"},
    {"question": "Pregunta frecuente 4", "answer": "Respuesta detallada"}
  ],
  
  "cta_title": "Llamada a la acción con ciudad",
  "cta_subtitle": "Frase corta de urgencia/beneficio"
}`;
}

async function main() {
  console.log('🔧 CORRIGIENDO LANDING PAGES\n');
  
  // 1. Borrar gestorias-zaragoza
  console.log('🗑️  Borrando gestorias-zaragoza...');
  const { error: deleteError } = await supabase
    .from('landing_pages')
    .delete()
    .eq('slug', 'gestorias-zaragoza');
  
  if (deleteError) {
    console.error('❌ Error borrando:', deleteError);
    return;
  }
  console.log('✅ gestorias-zaragoza eliminada\n');
  
  // 2. Obtener servicio y ciudad
  const { data: servicio } = await supabase
    .from('servicios_catalogo')
    .select('*')
    .eq('slug', 'gestorias')
    .single();
  
  const { data: ciudad } = await supabase
    .from('ciudades_catalogo')
    .select('*')
    .eq('slug', 'san-javier')
    .single();
  
  if (!servicio || !ciudad) {
    console.error('❌ No se encontró el servicio o la ciudad');
    return;
  }
  
  // 3. Generar contenido
  console.log('🔄 Generando gestorias-san-javier...');
  const startTime = Date.now();
  
  const prompt = buildPrompt(servicio, ciudad);
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Eres un copywriter SEO experto. Responde SOLO con JSON válido, sin markdown ni explicaciones.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });
  
  const responseText = completion.choices[0].message.content || '';
  const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const generated = JSON.parse(cleanJson);
  
  const slug = 'gestorias-san-javier';
  const content = {
    slug,
    servicio_slug: 'gestorias',
    servicio_nombre: servicio.nombre,
    ciudad_slug: 'san-javier',
    ciudad_nombre: ciudad.nombre,
    provincia: ciudad.provincia,
    ...generated,
    generado_por_ia: true,
    fecha_generacion: new Date().toISOString(),
    activo: true,
  };
  
  // 4. Guardar
  const { error: saveError } = await supabase
    .from('landing_pages')
    .insert(content);
  
  if (saveError) {
    console.error('❌ Error guardando:', saveError);
    return;
  }
  
  console.log(`✅ gestorias-san-javier generado (${Date.now() - startTime}ms)\n`);
  console.log('========================================');
  console.log('✅ ¡CORRECCIÓN COMPLETA!');
  console.log('========================================\n');
}

main().catch(console.error);
