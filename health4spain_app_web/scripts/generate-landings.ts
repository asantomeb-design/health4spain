/**
 * Script para generar contenido de landing pages con OpenAI
 * 
 * USO:
 *   npx ts-node scripts/generate-landings.ts
 *   npx ts-node scripts/generate-landings.ts --servicio=abogados
 *   npx ts-node scripts/generate-landings.ts --ciudad=mazarron
 *   npx ts-node scripts/generate-landings.ts --slug=abogados-mazarron
 *   npx ts-node scripts/generate-landings.ts --retry-failed (regenera solo las vacías/incompletas)
 *   npx ts-node scripts/generate-landings.ts --check (solo verifica cuáles están vacías)
 * 
 * REQUISITOS:
 *   - OPENAI_API_KEY en .env.local
 *   - SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local
 *   - npm install openai @supabase/supabase-js dotenv
 */

import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Necesitamos service_role para escribir
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

// ============================================
// PROMPT TEMPLATE
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

// ============================================
// FUNCIONES PRINCIPALES
// ============================================

async function getServicios(): Promise<Servicio[]> {
  const { data, error } = await supabase
    .from('servicios_catalogo')
    .select('*');
  
  if (error) throw error;
  return data || [];
}

async function getCiudades(): Promise<Ciudad[]> {
  const { data, error } = await supabase
    .from('ciudades_catalogo')
    .select('*');
  
  if (error) throw error;
  return data || [];
}

async function generateLandingContent(
  servicio: Servicio, 
  ciudad: Ciudad
): Promise<LandingContent | null> {
  const slug = `${servicio.slug}-${ciudad.slug}`;
  const startTime = Date.now();
  
  console.log(`\n🔄 Generando: ${slug}...`);
  
  try {
    const prompt = buildPrompt(servicio, ciudad);
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Más barato, suficiente calidad para esto
      messages: [
        {
          role: 'system',
          content: 'Eres un copywriter SEO experto. Responde SOLO con JSON válido, sin markdown ni explicaciones.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0].message.content || '';
    const tokensInput = completion.usage?.prompt_tokens || 0;
    const tokensOutput = completion.usage?.completion_tokens || 0;
    
    // Parsear JSON (limpiar posibles backticks)
    const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const generated = JSON.parse(cleanJson);
    
    // Construir objeto completo
    const content: LandingContent = {
      slug,
      servicio_slug: servicio.slug,
      servicio_nombre: servicio.nombre,
      ciudad_slug: ciudad.slug,
      ciudad_nombre: ciudad.nombre,
      provincia: ciudad.provincia,
      ...generated
    };
    
    // Guardar log de generación
    await supabase.from('landing_generation_log').insert({
      slug,
      modelo_ia: 'gpt-4o-mini',
      prompt_usado: prompt.substring(0, 500) + '...',
      tokens_input: tokensInput,
      tokens_output: tokensOutput,
      coste_estimado: (tokensInput * 0.00015 + tokensOutput * 0.0006) / 1000, // Precio aproximado
      exito: true,
      tiempo_ms: Date.now() - startTime,
    });
    
    console.log(`✅ ${slug} generado (${tokensInput + tokensOutput} tokens, ${Date.now() - startTime}ms)`);
    
    return content;
    
  } catch (error: any) {
    console.error(`❌ Error en ${slug}:`, error.message);
    
    // Guardar log de error
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
    const { error } = await supabase
      .from('landing_pages')
      .upsert({
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
      }, {
        onConflict: 'slug'
      });
    
    if (error) throw error;
    return true;
    
  } catch (error: any) {
    console.error(`❌ Error guardando ${content.slug}:`, error.message);
    return false;
  }
}

// ============================================
// VALIDACIÓN DE CONTENIDO
// ============================================

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

function isLandingIncomplete(landing: ExistingLanding): boolean {
  // Verificar campos críticos
  if (!landing.meta_title || landing.meta_title.trim().length < 10) return true;
  if (!landing.hero_title || landing.hero_title.trim().length < 10) return true;
  if (!landing.hero_subtitle || landing.hero_subtitle.trim().length < 20) return true;
  
  // Verificar arrays JSON
  if (!landing.services || !Array.isArray(landing.services) || landing.services.length < 3) return true;
  if (!landing.faqs || !Array.isArray(landing.faqs) || landing.faqs.length < 2) return true;
  
  // Verificar contenido textual
  if (!landing.problem_title || landing.problem_title.trim().length < 5) return true;
  if (!landing.solution_text || landing.solution_text.trim().length < 30) return true;
  
  return false;
}

async function getExistingLandings(): Promise<ExistingLanding[]> {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('slug, meta_title, hero_title, hero_subtitle, services, faqs, problem_title, solution_text');
  
  if (error) {
    console.error('Error obteniendo landing pages existentes:', error);
    return [];
  }
  
  return data || [];
}

async function checkIncompletePages() {
  console.log('🔍 Verificando landing pages existentes...\n');
  
  const existing = await getExistingLandings();
  console.log(`📊 Total landing pages encontradas: ${existing.length}\n`);
  
  const incomplete = existing.filter(isLandingIncomplete);
  
  if (incomplete.length === 0) {
    console.log('✅ Todas las landing pages están completas\n');
    return;
  }
  
  console.log(`⚠️  Landing pages incompletas o vacías: ${incomplete.length}\n`);
  
  // Agrupar por problemas
  const problems = {
    noTitle: [] as string[],
    noHero: [] as string[],
    noServices: [] as string[],
    noFaqs: [] as string[],
    noProblem: [] as string[],
    noSolution: [] as string[],
  };
  
  incomplete.forEach(landing => {
    const slug = landing.slug;
    if (!landing.meta_title || landing.meta_title.trim().length < 10) problems.noTitle.push(slug);
    if (!landing.hero_title || landing.hero_title.trim().length < 10) problems.noHero.push(slug);
    if (!landing.services || !Array.isArray(landing.services) || landing.services.length < 3) problems.noServices.push(slug);
    if (!landing.faqs || !Array.isArray(landing.faqs) || landing.faqs.length < 2) problems.noFaqs.push(slug);
    if (!landing.problem_title || landing.problem_title.trim().length < 5) problems.noProblem.push(slug);
    if (!landing.solution_text || landing.solution_text.trim().length < 30) problems.noSolution.push(slug);
  });
  
  console.log('📋 Resumen de problemas encontrados:');
  if (problems.noTitle.length > 0) console.log(`   - Sin título SEO: ${problems.noTitle.length}`);
  if (problems.noHero.length > 0) console.log(`   - Sin hero completo: ${problems.noHero.length}`);
  if (problems.noServices.length > 0) console.log(`   - Sin servicios: ${problems.noServices.length}`);
  if (problems.noFaqs.length > 0) console.log(`   - Sin FAQs: ${problems.noFaqs.length}`);
  if (problems.noProblem.length > 0) console.log(`   - Sin problema: ${problems.noProblem.length}`);
  if (problems.noSolution.length > 0) console.log(`   - Sin solución: ${problems.noSolution.length}`);
  
  console.log('\n🔧 Para regenerar estas páginas, ejecuta:');
  console.log('   npm run generate-landings -- --retry-failed\n');
  
  console.log('📝 Lista de slugs incompletos:');
  incomplete.forEach(landing => {
    console.log(`   - ${landing.slug}`);
  });
  console.log('');
}

// ============================================
// MAIN
// ============================================

async function main() {
  // Parsear argumentos desde process.argv O variables de entorno
  const args = process.argv.slice(2);
  
  // Debug: mostrar argumentos recibidos
  console.log('📋 Argumentos recibidos:', args);
  console.log('📋 Variables de entorno:', { 
    MODE: process.env.MODE,
    SERVICIO: process.env.SERVICIO,
    CIUDAD: process.env.CIUDAD,
    SLUG: process.env.SLUG
  });
  
  const filters: { servicio?: string; ciudad?: string; slug?: string } = {};
  let checkOnly = process.env.MODE === 'check' || args.includes('--check') || args.includes('check');
  let retryFailed = process.env.MODE === 'retry' || args.includes('--retry-failed') || args.includes('retry-failed');
  
  // Filtros desde variables de entorno o argumentos
  if (process.env.SERVICIO) filters.servicio = process.env.SERVICIO;
  if (process.env.CIUDAD) filters.ciudad = process.env.CIUDAD;
  if (process.env.SLUG) filters.slug = process.env.SLUG;
  
  args.forEach(arg => {
    if (arg === '--check' || arg === 'check') {
      checkOnly = true;
      console.log('✓ Modo verificación activado');
    } else if (arg === '--retry-failed' || arg === 'retry-failed') {
      retryFailed = true;
      console.log('✓ Modo regeneración activado');
    } else {
      const [key, value] = arg.replace('--', '').split('=');
      if (key && value) {
        filters[key as keyof typeof filters] = value;
        console.log(`✓ Filtro: ${key} = ${value}`);
      }
    }
  });
  
  // Si solo queremos verificar
  if (checkOnly) {
    console.log('\n🔍 MODO VERIFICACIÓN - No se generará contenido nuevo\n');
    await checkIncompletePages();
    return;
  }
  
  console.log('\n🚀 Iniciando generación de landing pages...\n');
  
  // Obtener datos
  const servicios = await getServicios();
  const ciudades = await getCiudades();
  
  console.log(`📊 Servicios: ${servicios.length}`);
  console.log(`📊 Ciudades: ${ciudades.length}`);
  console.log(`📊 Total combinaciones: ${servicios.length * ciudades.length}`);
  
  // Si queremos regenerar las fallidas
  let slugsToRegenerate: string[] = [];
  
  if (retryFailed) {
    console.log('\n🔄 Modo regeneración: detectando landing pages incompletas...');
    const existing = await getExistingLandings();
    const incomplete = existing.filter(isLandingIncomplete);
    slugsToRegenerate = incomplete.map(l => l.slug);
    console.log(`⚠️  Encontradas ${slugsToRegenerate.length} landing pages para regenerar\n`);
  }
  
  // Filtrar si hay argumentos
  let pairs: { servicio: Servicio; ciudad: Ciudad }[] = [];
  
  for (const servicio of servicios) {
    for (const ciudad of ciudades) {
      const slug = `${servicio.slug}-${ciudad.slug}`;
      
      // Si estamos en modo retry, solo regenerar las incompletas
      if (retryFailed && !slugsToRegenerate.includes(slug)) continue;
      
      // Aplicar filtros
      if (filters.slug && slug !== filters.slug) continue;
      if (filters.servicio && servicio.slug !== filters.servicio) continue;
      if (filters.ciudad && ciudad.slug !== filters.ciudad) continue;
      
      pairs.push({ servicio, ciudad });
    }
  }
  
  if (pairs.length === 0) {
    console.log('\n✅ No hay landing pages para generar/regenerar\n');
    return;
  }
  
  console.log(`\n🎯 Generando ${pairs.length} landing pages...\n`);
  
  let success = 0;
  let failed = 0;
  
  for (const { servicio, ciudad } of pairs) {
    // Generar contenido
    const content = await generateLandingContent(servicio, ciudad);
    
    if (content) {
      // Guardar en Supabase
      const saved = await saveLanding(content);
      if (saved) {
        success++;
      } else {
        failed++;
      }
    } else {
      failed++;
    }
    
    // Delay para no saturar la API (rate limiting)
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n========================================');
  console.log(`✅ Exitosas: ${success}`);
  console.log(`❌ Fallidas: ${failed}`);
  console.log(`📊 Total: ${pairs.length}`);
  console.log('========================================\n');
  
  // Si hubo fallos, sugerir reintentar
  if (failed > 0) {
    console.log('💡 Para reintentar solo las fallidas, ejecuta:');
    console.log('   npm run generate-landings -- --retry-failed\n');
  }
}

// Ejecutar
main().catch(console.error);
