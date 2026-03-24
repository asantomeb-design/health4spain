import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// Configurar Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Configurar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Definición de artículos a generar
const blogTitles = [
  // Guías de Ciudad (6)
  { title: "Vivir en Torrevieja: Guía Completa 2026", category: "guias-ciudad" },
  { title: "Valencia para Expatriados: Todo lo que Necesitas Saber", category: "guias-ciudad" },
  { title: "Málaga vs Alicante: ¿Dónde Establecerte en 2026?", category: "guias-ciudad" },
  { title: "Madrid para Extranjeros: Costos, Barrios y Consejos", category: "guias-ciudad" },
  { title: "Barcelona: Pros y Contras de Vivir en la Ciudad Condal", category: "guias-ciudad" },
  { title: "Las Mejores Ciudades Pequeñas de la Costa Blanca", category: "guias-ciudad" },
  
  // Visas y Procedimientos (8)
  { title: "Visa No Lucrativa 2026: Guía Paso a Paso Actualizada", category: "procedimientos" },
  { title: "Arraigo Social en España: Requisitos y Proceso Completo", category: "procedimientos" },
  { title: "Golden Visa España: ¿Vale la Pena en 2026?", category: "procedimientos" },
  { title: "Cómo Obtener el NIE: Guía Práctica y Documentación", category: "procedimientos" },
  { title: "Empadronamiento en España: Todo lo que Debes Saber", category: "procedimientos" },
  { title: "Renovación de Visa No Lucrativa: Errores Comunes a Evitar", category: "procedimientos" },
  { title: "Visas para Nómadas Digitales en España 2026", category: "procedimientos" },
  { title: "Reagrupación Familiar: Cómo Traer a tu Familia a España", category: "procedimientos" },
  
  // Seguros y Salud (5)
  { title: "Seguro de Salud para Visa No Lucrativa: Requisitos 2026", category: "salud" },
  { title: "Seguro Público vs Privado en España: ¿Cuál Elegir?", category: "salud" },
  { title: "Mejores Seguros de Salud para Expatriados en España", category: "salud" },
  { title: "Sistema de Salud Español: Guía para Extranjeros", category: "salud" },
  { title: "Cobertura Dental en España: Opciones y Recomendaciones", category: "salud" },
  
  // Finanzas y Costo de Vida (5)
  { title: "Costo de Vida: Alicante vs Murcia - Comparativa 2026", category: "finanzas" },
  { title: "Presupuesto Mensual Realista para Vivir en España", category: "finanzas" },
  { title: "Abrir una Cuenta Bancaria en España siendo Extranjero", category: "finanzas" },
  { title: "Impuestos para Residentes Extranjeros en España", category: "finanzas" },
  { title: "Alquilar vs Comprar en España: ¿Qué Conviene en 2026?", category: "finanzas" },
  
  // Vida Práctica (6)
  { title: "Primeros 30 Días en España: Checklist Completo", category: "vida-espana" },
  { title: "Aprender Español en España: Mejores Métodos y Escuelas", category: "vida-espana" },
  { title: "Transporte en España: Coche vs Transporte Público", category: "vida-espana" },
  { title: "Comer Fuera vs Cocinar: Costos Reales en España 2026", category: "vida-espana" },
  { title: "Hacer Amigos en España siendo Extranjero: Consejos Prácticos", category: "vida-espana" },
  { title: "El Clima de España: Qué Esperar en Cada Región", category: "vida-espana" },
];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function generateBlogContent(title: string, category: string): Promise<{ content: string; excerpt: string; metaDescription: string }> {
  console.log(`\n🤖 Generando contenido para: "${title}"...`);
  
  const prompt = `Eres un experto en contenido SEO para expatriados que quieren vivir en España. 

Escribe un artículo completo y detallado en formato HTML sobre: "${title}"

Requisitos:
- El contenido debe tener entre 1500-2000 palabras
- Usa HTML semántico con etiquetas <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>
- Incluye al menos 5 secciones principales con <h2>
- Cada sección debe tener 2-3 subsecciones con <h3>
- Incluye listas con viñetas donde sea apropiado
- El tono debe ser profesional pero cercano y útil
- Enfócate en información práctica y actualizada para 2026
- NO incluyas el título principal H1 (ya está en el template)
- Incluye datos específicos, números, rangos de precios cuando sea relevante
- Termina con una sección de "Conclusión" y un párrafo sobre cómo Health4Spain puede ayudar

El contenido debe estar optimizado para SEO y ser valioso para expatriados.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Eres un experto en redacción de contenido para expatriados en España, especializado en SEO y copywriting persuasivo."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 3000,
    });

    const content = completion.choices[0].message.content || '';
    
    // Generar excerpt
    const excerptPrompt = `Resume este título en una frase atractiva de máximo 160 caracteres: "${title}"`;
    const excerptCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: excerptPrompt }],
      temperature: 0.7,
      max_tokens: 100,
    });
    
    const excerpt = excerptCompletion.choices[0].message.content?.trim() || 
                   title.substring(0, 160);
    
    const metaDescription = excerpt.substring(0, 160);
    
    console.log(`✅ Contenido generado (${content.length} caracteres)`);
    
    return { content, excerpt, metaDescription };
    
  } catch (error) {
    console.error(`❌ Error generando contenido:`, error);
    throw error;
  }
}

async function insertBlogPost(
  title: string, 
  category: string,
  content: string,
  excerpt: string,
  metaDescription: string
) {
  const slug = generateSlug(title);
  
  const blogPost = {
    slug,
    title,
    excerpt,
    content,
    category,
    meta_title: title.substring(0, 70),
    meta_description: metaDescription,
    lang: 'es',
    status: 'published',
    published_at: new Date().toISOString(),
    author_name: 'Health4Spain',
    tags: [],
    featured_image: null,
  };

  const { data, error } = await supabase
    .from('blog_posts')
    .insert(blogPost)
    .select()
    .single();

  if (error) {
    console.error(`❌ Error insertando post "${title}":`, error);
    throw error;
  }

  console.log(`✅ Post insertado: ${slug}`);
  return data;
}

async function main() {
  console.log('🚀 Iniciando generación de posts del blog...\n');
  console.log(`📝 Total de posts a generar: ${blogTitles.length}\n`);
  
  let successCount = 0;
  let errorCount = 0;

  for (const [index, { title, category }] of blogTitles.entries()) {
    try {
      console.log(`\n[${index + 1}/${blogTitles.length}] Procesando: "${title}"`);
      
      // Generar contenido con OpenAI
      const { content, excerpt, metaDescription } = await generateBlogContent(title, category);
      
      // Insertar en Supabase
      await insertBlogPost(title, category, content, excerpt, metaDescription);
      
      successCount++;
      
      // Esperar 2 segundos entre llamadas para no saturar la API
      if (index < blogTitles.length - 1) {
        console.log('⏳ Esperando 2 segundos...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
    } catch (error) {
      console.error(`❌ Error procesando "${title}":`, error);
      errorCount++;
      // Continuar con el siguiente post
    }
  }

  console.log('\n\n========================================');
  console.log('🎉 Proceso completado!');
  console.log(`✅ Posts creados exitosamente: ${successCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log('========================================\n');
}

// Ejecutar
main().catch(console.error);
