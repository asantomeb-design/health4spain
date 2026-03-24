/**
 * Script para REGENERAR landing pages vacías o incompletas
 * 
 * USO:
 *   npm run retry-landings
 * 
 * Detecta automáticamente cuáles están incompletas y las regenera
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

interface LandingContent {
  slug: string;
  servicio_slug: string;
  servicio_nombre: string;
  ciudad_slug: string;
  ciudad_nombre: string;
  provincia: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  hero_title: string;
  hero_subtitle: string;
  hero_bullets: string[];
  problem_title: string;
  problems: string[];
  solution_title: string;
  solution_text: string;
  services_title: string;
  services: { icon: string; title: string; description: string }[];
  why_city_title: string;
  why_city_text: string;
  why_city_stats: { value: string; label: string }[];
  faqs: { question: string; answer: string }[];
  cta_title: string;
  cta_subtitle: string;
}

interface ExistingLanding {
  slug: string;
  meta_title?: string;
  hero_title?: string;
  hero_subtitle?: string;
  services?: any;
  faqs?: any;
  problem_title?: string;
  solution_text?: string;
}

// ============================================
// FUNCIONES DE VALIDACIÓN
// ============================================

function isLandingIncomplete(landing: ExistingLanding): boolean {
  if (!landing.meta_title || landing.meta_title.trim().length < 10) return true;
  if (!landing.hero_title || landing.hero_title.trim().length < 10) return true;
  if (!landing.hero_subtitle || landing.hero_subtitle.trim().length < 20) return true;
  if (!landing.services || !Array.isArray(landing.services) || landing.services.length < 3) return true;
  if (!landing.faqs || !Array.isArray(landing.faqs) || landing.faqs.length < 2) return true;
  if (!landing.problem_title || landing.problem_title.trim().length < 5) return true;
  if (!landing.solution_text || landing.solution_text.trim().length < 30) return true;
  return false;
}

async function getExistingLandings(): Promise<ExistingLanding[]> {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('slug, meta_title, hero_title, hero_subtitle, services, faqs, problem_title, solution_text');
  
  if (error) {
    console.error('❌ Error:', error);
    return [];
  }
  return data || [];
}

// ============================================
// FUNCIONES DE GENERACIÓN
// ============================================

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

async function getServicios(): Promise<Servicio[]> {
  const { data, error } = await supabase.from('servicios_catalogo').select('*');
  if (error) throw error;
  return data || [];
}

async function getCiudades(): Promise<Ciudad[]> {
  const { data, error } = await supabase.from('ciudades_catalogo').select('*');
  if (error) throw error;
  return data || [];
}

async function generateLandingContent(servicio: Servicio, ciudad: Ciudad): Promise<LandingContent | null> {
  const slug = `${servicio.slug}-${ciudad.slug}`;
  const startTime = Date.now();
  
  console.log(`🔄 Regenerando: ${slug}...`);
  
  try {
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
    const tokensInput = completion.usage?.prompt_tokens || 0;
    const tokensOutput = completion.usage?.completion_tokens || 0;
    
    const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const generated = JSON.parse(cleanJson);
    
    const content: LandingContent = {
      slug,
      servicio_slug: servicio.slug,
      servicio_nombre: servicio.nombre,
      ciudad_slug: ciudad.slug,
      ciudad_nombre: ciudad.nombre,
      provincia: ciudad.provincia,
      ...generated
    };
    
    await supabase.from('landing_generation_log').insert({
      slug,
      modelo_ia: 'gpt-4o-mini',
      prompt_usado: prompt.substring(0, 500) + '...',
      tokens_input: tokensInput,
      tokens_output: tokensOutput,
      coste_estimado: (tokensInput * 0.00015 + tokensOutput * 0.0006) / 1000,
      exito: true,
      tiempo_ms: Date.now() - startTime,
    });
    
    console.log(`✅ ${slug} (${tokensInput + tokensOutput} tokens, ${Date.now() - startTime}ms)`);
    return content;
    
  } catch (error: any) {
    console.error(`❌ Error en ${slug}:`, error.message);
    
    await supabase.from('landing_generation_log').insert({
      slug,
      modelo_ia: 'gpt-4o-mini',
      exito: false,
      error_mensaje: error.message,
      tiempo_ms: Date.now() - startTime,
    });
    
    return null;
  }
}

async function saveLanding(content: LandingContent): Promise<boolean> {
  try {
    const { error } = await supabase.from('landing_pages').upsert({
      slug: content.slug,
      servicio_slug: content.servicio_slug,
      servicio_nombre: content.servicio_nombre,
      ciudad_slug: content.ciudad_slug,
      ciudad_nombre: content.ciudad_nombre,
      provincia: content.provincia,
      meta_title: content.meta_title,
      meta_description: content.meta_description,
      meta_keywords: content.meta_keywords,
      hero_title: content.hero_title,
      hero_subtitle: content.hero_subtitle,
      hero_bullets: content.hero_bullets,
      problem_title: content.problem_title,
      problems: content.problems,
      solution_title: content.solution_title,
      solution_text: content.solution_text,
      services_title: content.services_title,
      services: content.services,
      why_city_title: content.why_city_title,
      why_city_text: content.why_city_text,
      why_city_stats: content.why_city_stats,
      faqs: content.faqs,
      cta_title: content.cta_title,
      cta_subtitle: content.cta_subtitle,
      generado_por_ia: true,
      fecha_generacion: new Date().toISOString(),
      activo: true,
    }, { onConflict: 'slug' });
    
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error(`❌ Error guardando ${content.slug}:`, error.message);
    return false;
  }
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('🔄 REGENERANDO LANDING PAGES INCOMPLETAS...\n');
  
  // Detectar páginas incompletas
  const existing = await getExistingLandings();
  const incomplete = existing.filter(isLandingIncomplete);
  
  if (incomplete.length === 0) {
    console.log('✅ No hay landing pages incompletas para regenerar\n');
    return;
  }
  
  console.log(`⚠️  Encontradas ${incomplete.length} landing pages incompletas\n`);
  
  // Obtener catálogos
  const servicios = await getServicios();
  const ciudades = await getCiudades();
  
  // Crear mapa de slugs incompletos
  const incompleteSlugs = new Set(incomplete.map(l => l.slug));
  
  // Filtrar solo las combinaciones incompletas
  const toRegenerate: { servicio: Servicio; ciudad: Ciudad }[] = [];
  
  for (const servicio of servicios) {
    for (const ciudad of ciudades) {
      const slug = `${servicio.slug}-${ciudad.slug}`;
      if (incompleteSlugs.has(slug)) {
        toRegenerate.push({ servicio, ciudad });
      }
    }
  }
  
  console.log(`🎯 Regenerando ${toRegenerate.length} landing pages...\n`);
  
  let success = 0;
  let failed = 0;
  
  for (const { servicio, ciudad } of toRegenerate) {
    const content = await generateLandingContent(servicio, ciudad);
    
    if (content) {
      const saved = await saveLanding(content);
      if (saved) {
        success++;
      } else {
        failed++;
      }
    } else {
      failed++;
    }
    
    // Delay para evitar rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n========================================');
  console.log(`✅ Regeneradas exitosamente: ${success}`);
  console.log(`❌ Fallidas: ${failed}`);
  console.log(`📊 Total: ${toRegenerate.length}`);
  console.log('========================================\n');
  
  if (failed > 0) {
    console.log('⚠️  Algunas páginas fallaron. Ejecuta de nuevo:');
    console.log('   npm run retry-landings\n');
  } else {
    console.log('✅ ¡Todas las páginas se regeneraron correctamente!\n');
  }
}

main().catch(console.error);
