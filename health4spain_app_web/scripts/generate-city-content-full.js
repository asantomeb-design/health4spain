#!/usr/bin/env node
/**
 * Genera contenido COMPLETO para ciudades basado en GUIA_COTENIDO_LANDING_DESTINOS
 * Incluye TODOS los episodios y anexos de la guía
 * 
 * Uso:
 *   node scripts/generate-city-content-full.js murcia alicante
 *   node scripts/generate-city-content-full.js --all
 *   node scripts/generate-city-content-full.js --dry-run murcia
 */

const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MODEL = 'gpt-4o';
const DRY_RUN = process.argv.includes('--dry-run');
const ALL_CITIES = process.argv.includes('--all');
const TARGET_CITIES = process.argv.filter(arg => 
  !arg.includes('node') && !arg.includes('.js') && !arg.startsWith('--')
);

let totalTokens = 0;
let totalGenerated = 0;
let totalErrors = 0;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Leer la guía completa
const guiaPath = path.join(__dirname, '..', 'GUIA_COTENIDO_LANDING_DESTINOS');
let GUIA_CONTENT = '';
try {
  GUIA_CONTENT = fs.readFileSync(guiaPath, 'utf-8');
} catch {
  console.error(`❌ No se encontró GUIA_COTENIDO_LANDING_DESTINOS`);
  process.exit(1);
}

async function generateCityContent(ciudad) {
  console.log(`\n📝 Generando contenido COMPLETO para ${ciudad.nombre} (${ciudad.slug})...`);
  
  const prompt = `Eres un experto en contenido para migrantes que quieren vivir en España. Vas a crear contenido COMPLETO Y EXHAUSTIVO para una guía sobre "Vivir en ${ciudad.nombre}" siguiendo EXACTAMENTE la estructura de la guía que te proporciono.

CONTEXTO DE LA CIUDAD:
- Nombre: ${ciudad.nombre}
- Población: ${ciudad.poblacion} habitantes
- % Extranjeros: ${ciudad.porcentaje_extranjeros}%
- Provincia: ${ciudad.provincia}
${ciudad.datos_extra ? `- Datos adicionales: ${JSON.stringify(ciudad.datos_extra)}` : ''}

GUÍA DE REFERENCIA (DEBES SEGUIR ESTA ESTRUCTURA):
${GUIA_CONTENT}

INSTRUCCIONES CRÍTICAS:
1. Adapta TODO el contenido de la guía a ${ciudad.nombre} específicamente
2. Usa datos reales de ${ciudad.nombre} (barrios reales, precios reales de 2026, instituciones reales)
3. Incluye información sobre consulados disponibles en ${ciudad.nombre} o provincia
4. Menciona asociaciones reales de apoyo a migrantes en ${ciudad.nombre}
5. Escribe en español de España, tono profesional pero cercano
6. Sé específico: no uses frases genéricas como "la ciudad ofrece..." sino datos concretos

GENERA EL SIGUIENTE JSON COMPLETO (SOLO JSON, SIN MARKDOWN):

{
  "meta_title": "Vivir en ${ciudad.nombre} 2026: Guía Completa para Extranjeros | Trámites, Trabajo, Residencia",
  "meta_description": "Guía completa para vivir en ${ciudad.nombre}: primeros 30 días, consulados, trabajo, residencia, costes. Info oficial 2026.",
  "meta_keywords": ["vivir en ${ciudad.nombre}", "mudarse a ${ciudad.nombre}", "extranjeros ${ciudad.nombre}", "residencia ${ciudad.nombre}", "trabajo ${ciudad.nombre}"],
  
  "intro_text": "Párrafo introductorio de 4-5 líneas sobre por qué ${ciudad.nombre} es excelente para extranjeros. Menciona clima, coste de vida, comunidad internacional, calidad de vida.",
  
  "ventajas": [
    "Ventaja específica 1 de ${ciudad.nombre}",
    "Ventaja específica 2",
    "Ventaja específica 3",
    "Ventaja específica 4",
    "Ventaja específica 5"
  ],
  
  "barrios": [
    {
      "nombre": "Nombre de barrio real 1",
      "descripcion": "Descripción del barrio: tipo de ambiente, precios de alquiler aproximados, perfil de residentes, servicios."
    },
    {
      "nombre": "Nombre de barrio real 2",
      "descripcion": "..."
    },
    {
      "nombre": "Nombre de barrio real 3",
      "descripcion": "..."
    },
    {
      "nombre": "Nombre de barrio real 4",
      "descripcion": "..."
    }
  ],
  
  "coste_vida_alquiler": "Apartamento 1 dormitorio centro: XXX-XXX€/mes. Apartamento 2 dormitorios periferia: XXX-XXX€/mes. Habitación compartida: XXX-XXX€/mes. Datos específicos de ${ciudad.nombre}.",
  
  "coste_vida_compra": "Precio medio por m² en ${ciudad.nombre}: XXX-XXX€. Zona centro vs periferia. Tendencias 2026.",
  
  "coste_vida_alimentacion": "Supermercado semanal (2 personas): XX-XX€. Comida restaurante económico: XX€. Menú del día: XX€. Café: X,XX€.",
  
  "coste_vida_transporte": "Billete bus/tranvía: X,XX€. Bono mensual: XX€. Taxi inicio: X€. Gasolina litro: X,XX€. Datos de ${ciudad.nombre}.",
  
  "coste_vida_utilidades": "Luz + gas (piso 70m²): XX-XXX€/mes. Internet: XX-XX€/mes. Agua: XX-XX€/mes. Móvil: XX€/mes.",
  
  "tramites": [
    "Paso 1: Descripción específica del trámite en ${ciudad.nombre} (dónde ir, qué documentos)",
    "Paso 2: ...",
    "Paso 3: ...",
    "Paso 4: Empadronamiento en Ayuntamiento de ${ciudad.nombre} (dirección aproximada si es posible)",
    "Paso 5: Solicitud TIE en Oficina de Extranjería (ubicación si es posible)"
  ],
  
  "faqs": [
    {
      "pregunta": "¿Cuánto dinero necesito para mudarme a ${ciudad.nombre}?",
      "respuesta": "Para mudarte a ${ciudad.nombre}, considera un presupuesto inicial de X.XXX-X.XXX€ que cubra: fianza (1 mes), primer mes de alquiler, gastos de instalación, reserva para primeros meses."
    },
    {
      "pregunta": "¿Es difícil encontrar trabajo en ${ciudad.nombre}?",
      "respuesta": "En ${ciudad.nombre} los sectores con más demanda son: [sectores específicos]. El mercado laboral es [característica]. Recursos: [mencionar algún recurso local]."
    },
    {
      "pregunta": "¿Qué visado necesito para vivir en ${ciudad.nombre}?",
      "respuesta": "Depende de tu nacionalidad y situación. Ciudadanos UE no necesitan visado. Otros: visado de estudios, trabajo, no lucrativo, etc. Consulta en el consulado español de tu país."
    },
    {
      "pregunta": "¿Hay consulados en ${ciudad.nombre}?",
      "respuesta": "En ${ciudad.nombre} o su provincia hay consulados de: [listar países si los hay, o decir 'para la mayoría de países debes ir a Madrid/Alicante/Valencia']."
    },
    {
      "pregunta": "¿Dónde puedo aprender español en ${ciudad.nombre}?",
      "respuesta": "En ${ciudad.nombre} puedes: Escuela Oficial de Idiomas, ayuntamiento (cursos gratuitos), ONGs como [mencionar alguna], academias privadas."
    }
  ],
  
  "clima_detalle": "Descripción del clima de ${ciudad.nombre}: tipo de clima (mediterráneo/continental/etc), temperaturas medias por estación, lluvias, mejor época del año, cómo afecta a la vida diaria.",
  
  "temperatura_media": "XX°C",
  "dias_sol": XXX,
  
  "primeros_30_dias": [
    {
      "titulo": "Semana 1: Documentación y empadronamiento",
      "descripcion": "Organiza carpeta con documentos. Pide cita para empadronamiento en Ayuntamiento de ${ciudad.nombre}. Si tienes visado de residencia, pide cita para TIE.",
      "dias": "1-7"
    },
    {
      "titulo": "Semana 2: Sanidad y vivienda",
      "descripcion": "Acude a cita de empadronamiento. Investiga acceso a sanidad (centro de salud en ${ciudad.nombre}). Si es temporal, busca seguro privado.",
      "dias": "8-14"
    },
    {
      "titulo": "Semana 3: Cuenta bancaria y alquiler",
      "descripcion": "Abre cuenta bancaria española (bancos en ${ciudad.nombre}: [mencionar algunos]). Busca vivienda definitiva en portales o grupos locales.",
      "dias": "15-21"
    },
    {
      "titulo": "Semana 4: Integración y red de apoyo",
      "descripcion": "Visita asociaciones de apoyo a migrantes en ${ciudad.nombre} (ver sección de integración). Apúntate a curso de español. Haz balance del mes.",
      "dias": "22-30"
    }
  ],
  
  "consulados_embajadas": {
    "descripcion": "Los consulados extranjeros en ${ciudad.nombre} o provincia ofrecen servicios a ciudadanos de sus países. Algunos trámites requieren acudir al consulado en Madrid o capitales mayores.",
    "lista_consulados": [
      {
        "pais": "Reino Unido",
        "direccion": "Consulado Honorario en ${ciudad.nombre} (verificar dirección actualizada)",
        "telefono": "Consultar gov.uk",
        "web": "https://www.gov.uk/world/spain"
      },
      {
        "pais": "Alemania / Francia / Países Bajos",
        "direccion": "Consulados honorarios o agencias (verificar según país)",
        "telefono": "Consultar web oficial",
        "web": "Buscar en web del Ministerio de Asuntos Exteriores"
      },
      {
        "pais": "Países latinoamericanos",
        "direccion": "Algunos tienen consulados honorarios. Muchos remiten a Madrid/Barcelona",
        "telefono": "Consultar embajada en Madrid",
        "web": "Buscar 'Consulado de [país] en España'"
      }
    ],
    "documentos_basicos": [
      "Pasaporte o documento de identidad",
      "Formularios específicos del trámite",
      "Fotografías tamaño carnet",
      "Justificantes (depende del trámite: empadronamiento, titulación, etc)"
    ]
  },
  
  "trabajo_emprendimiento": {
    "sectores_principales": [
      "Sector 1 importante en ${ciudad.nombre} (ej: turismo, agricultura, tecnología)",
      "Sector 2",
      "Sector 3",
      "Sector 4"
    ],
    "donde_buscar": [
      "Infojobs, Indeed, LinkedIn",
      "Oficina del SEPE en ${ciudad.nombre}",
      "Empresas de trabajo temporal (ETT): Adecco, Randstad",
      "Redes personales y grupos de Facebook de ${ciudad.nombre}",
      "Portales específicos del sector [si aplica]"
    ],
    "tips_emprendimiento": [
      "Alta como autónomo: ~250€/mes de cuota",
      "Cámaras de Comercio de ${ciudad.nombre}/provincia ofrecen asesoramiento",
      "Coworkings en ${ciudad.nombre}: [mencionar alguno si conoces o decir 'creciendo']",
      "Recursos: INFO (Murcia) o IVACE (Valencia) según provincia",
      "Plan de negocio esencial antes de empezar"
    ]
  },
  
  "condiciones_entrada": {
    "sin_visa": [
      "Ciudadanos UE/EEE/Suiza: libre circulación",
      "Muchos países latinoamericanos: hasta 90 días en 180 días sin visado",
      "Debes llevar: pasaporte válido, billete de vuelta, justificante de alojamiento, medios económicos (mín 100€/día, primer día 900€), seguro médico 30.000€"
    ],
    "con_visa": [
      "Si tu país requiere visado Schengen: tramitarlo en consulado español",
      "Visados de larga duración (residencia): estudios, trabajo, no lucrativa, reagrupación",
      "Una vez en España, recoger TIE en 30 días"
    ],
    "documentos_requeridos": [
      "Pasaporte vigente (mín 3 meses después de salida prevista)",
      "Billete de ida y vuelta (o salida del espacio Schengen)",
      "Reserva de alojamiento o carta de invitación",
      "Seguro médico con cobertura 30.000€",
      "Justificante de medios económicos",
      "Visado (si aplica)"
    ]
  },
  
  "riesgos_frontera": {
    "errores_comunes": [
      "No llevar billete de vuelta dentro de 90 días",
      "No poder demostrar medios económicos",
      "Incoherencias entre tu relato y documentos (decir 'turismo' pero llevar CV)",
      "Reservas de hotel falsas o no confirmadas",
      "Pasaporte a punto de caducar"
    ],
    "que_no_hacer": [
      "No mientas sobre el motivo del viaje",
      "No entres con contrato de trabajo si vienes como turista",
      "No uses documentos falsos o manipulados (delito grave)",
      "No discutas con el agente fronterizo",
      "No viajes sin seguro médico si es obligatorio"
    ],
    "consejos": [
      "Lleva copias de todos los documentos (físicas y digitales)",
      "Responde preguntas con claridad y coherencia",
      "Si te retienen, pide hablar con abogado y contactar tu consulado",
      "Conoce tus derechos: derecho a intérprete, a explicación, a asistencia",
      "En caso de denegación, puedes presentar alegaciones"
    ]
  },
  
  "residencia_nacionalidad": {
    "tipos_residencia": [
      "Residencia temporal (1 año, renovable): estudios, trabajo, reagrupación, no lucrativa",
      "Residencia temporal renovada (2 años): tras primer año",
      "Residencia de larga duración (5 años): tras 5 años de residencia legal continuada",
      "Arraigo social: 3 años en España + contrato trabajo + vínculos",
      "Arraigo laboral: 6 meses trabajados (aunque sin papeles, difícil probar)"
    ],
    "proceso_nacionalidad": [
      "Tras 10 años de residencia legal (regla general)",
      "Tras 2 años para iberoamericanos, Andorra, Filipinas, Guinea Ecuatorial, Portugal",
      "Tras 1 año para nacidos en España, refugiados, casados con español",
      "Requisitos: antecedentes limpios, DELE A2, CCSE, integración",
      "Ventajas: ciudadanía UE, libertad movimiento, voto"
    ],
    "requisitos": [
      "Residencia legal continuada",
      "Medios económicos según tipo de residencia",
      "Seguro médico (según caso)",
      "Empadronamiento",
      "Documentación apostillada y traducida",
      "Para nacionalidad: exámenes DELE y CCSE"
    ]
  },
  
  "integracion_practica": {
    "asociaciones": [
      "Nombre de asociación real en ${ciudad.nombre} o provincia (ej: 'Murcia Acoge', 'Asti-Alicante', etc según corresponda)",
      "Cruz Roja ${ciudad.nombre}",
      "Servicios sociales del Ayuntamiento de ${ciudad.nombre}",
      "Fundación Cepaim (si tiene delegación)",
      "Otras ONGs locales"
    ],
    "comunidades_online": [
      "Grupos de Facebook: 'Extranjeros en ${ciudad.nombre}', 'Latinos en ${ciudad.nombre}'",
      "Foros y blogs de expats en España",
      "Reddit: r/IWantOut, r/Spain",
      "Grupos de WhatsApp o Telegram de tu nacionalidad"
    ],
    "apps_utiles": [
      "Mi Carpeta de la Seguridad Social (vida laboral)",
      "Certificado Digital / Cl@ve (trámites online)",
      "Google Maps / Moovit (transporte ${ciudad.nombre})",
      "Idealista / Fotocasa (vivienda)",
      "Aplicación del transporte público local si existe"
    ],
    "cursos_idiomas": [
      "Escuela Oficial de Idiomas (EOI) de ${ciudad.nombre}",
      "Cursos gratuitos en Ayuntamiento de ${ciudad.nombre}",
      "ONGs: Cruz Roja, asociaciones de migrantes",
      "Academias privadas",
      "Intercambios de idiomas en cafés y centros culturales"
    ]
  },
  
  "checklists": {
    "antes_viajar": [
      "✅ Visado aprobado (si aplica)",
      "✅ Pasaporte vigente (mín 6 meses)",
      "✅ Seguro médico contratado (30.000€)",
      "✅ Billete de ida y vuelta",
      "✅ Reserva de alojamiento primeros días",
      "✅ Documentos apostillados y traducidos",
      "✅ Presupuesto inicial calculado",
      "✅ Contactos de emergencia (consulado, abogado, familia)"
    ],
    "primeros_dias": [
      "✅ Pedir cita empadronamiento",
      "✅ Pedir cita TIE (si tienes visado residencia)",
      "✅ Buscar alojamiento definitivo",
      "✅ Localizar centro de salud",
      "✅ Abrir cuenta bancaria española",
      "✅ Comprar tarjeta SIM española",
      "✅ Orientarte en la ciudad (transporte, supermercados, servicios)"
    ],
    "tramites": [
      "✅ Empadronamiento realizado",
      "✅ TIE recogida (si aplica)",
      "✅ Alta en Seguridad Social (si trabajas)",
      "✅ Contrato de alquiler firmado",
      "✅ Alta de suministros (luz, agua, internet)",
      "✅ Tarjeta sanitaria solicitada",
      "✅ Certificado digital o Cl@ve obtenido"
    ],
    "integracion": [
      "✅ Inscrito en curso de español",
      "✅ Visitada asociación de apoyo",
      "✅ Unido a grupo o comunidad local",
      "✅ Conocidos los servicios del barrio",
      "✅ Rutina establecida",
      "✅ Red social básica creada",
      "✅ Actividades de ocio identificadas"
    ]
  }
}

RECUERDA: 
- Usa nombres REALES de barrios de ${ciudad.nombre}
- Precios REALES aproximados de 2026
- Asociaciones REALES si las conoces
- Sé ESPECÍFICO, no genérico
- JSON válido, sin comentarios, sin markdown`;

  const maxAttempts = 5;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        response_format: { type: 'json_object' }
      });

      totalTokens += response.usage?.total_tokens || 0;
      const content = JSON.parse(response.choices[0].message.content);
      
      console.log(`  ✅ Contenido generado (${response.usage?.total_tokens} tokens)`);
      return content;
      
    } catch (err) {
      const isRateLimit = (err.status === 429 || err.statusCode === 429) || 
        /rate limit|Rate limit|overloaded/i.test(err.message || '');
      const waitMs = isRateLimit ? 60000 : 5000 * (attempt + 1);
      
      if (attempt < maxAttempts - 1) {
        console.log(`  ⏳ Reintento ${attempt + 1}/${maxAttempts}${isRateLimit ? ' (rate limit, 60s)' : ''}: ${err.message}`);
        await sleep(waitMs);
      } else {
        throw err;
      }
    }
  }
}

async function main() {
  console.log('🌍 GENERACIÓN COMPLETA DE CONTENIDO DE CIUDADES');
  console.log(`   Modelo: ${MODEL}`);
  console.log(`   Modo: ${DRY_RUN ? '🧪 DRY RUN' : '🚀 PRODUCCIÓN'}`);
  console.log('');

  const start = Date.now();

  // Obtener todas las ciudades
  const { data: ciudades, error } = await supabase
    .from('ciudades_catalogo')
    .select('slug, nombre, poblacion, porcentaje_extranjeros, provincia, datos_extra')
    .order('nombre');

  if (error || !ciudades?.length) {
    console.error('❌ Error obteniendo ciudades:', error?.message);
    process.exit(1);
  }

  let ciudadesToProcess = ciudades;

  // Filtrar por ciudades específicas si se indicaron
  if (!ALL_CITIES && TARGET_CITIES.length > 0) {
    ciudadesToProcess = ciudades.filter(c =>
      TARGET_CITIES.some(target =>
        c.slug === target || c.nombre.toLowerCase().includes(target.toLowerCase())
      )
    );
    
    if (ciudadesToProcess.length === 0) {
      console.error(`❌ No se encontraron ciudades: ${TARGET_CITIES.join(', ')}`);
      process.exit(1);
    }
  }

  console.log(`📋 ${ciudadesToProcess.length} ciudades a procesar\n`);

  for (const ciudad of ciudadesToProcess) {
    try {
      const content = await generateCityContent(ciudad);
      
      if (!DRY_RUN) {
        const row = {
          ciudad_slug: ciudad.slug,
          idioma: 'es',
          meta_title: content.meta_title,
          meta_description: content.meta_description,
          meta_keywords: content.meta_keywords,
          intro_text: content.intro_text,
          ventajas: content.ventajas,
          barrios: content.barrios,
          coste_vida_alquiler: content.coste_vida_alquiler,
          coste_vida_compra: content.coste_vida_compra,
          coste_vida_alimentacion: content.coste_vida_alimentacion,
          coste_vida_transporte: content.coste_vida_transporte,
          coste_vida_utilidades: content.coste_vida_utilidades,
          tramites: content.tramites,
          faqs: content.faqs,
          clima_detalle: content.clima_detalle,
          temperatura_media: content.temperatura_media,
          dias_sol: content.dias_sol,
          primeros_30_dias: content.primeros_30_dias,
          consulados_embajadas: content.consulados_embajadas,
          trabajo_emprendimiento: content.trabajo_emprendimiento,
          condiciones_entrada: content.condiciones_entrada,
          riesgos_frontera: content.riesgos_frontera,
          residencia_nacionalidad: content.residencia_nacionalidad,
          integracion_practica: content.integracion_practica,
          checklists: content.checklists,
          activo: true,
          generado_por_ia: true,
          revisado: false,
          fecha_generacion: new Date().toISOString()
        };

        const { error: upsertError } = await supabase
          .from('ciudades_contenido')
          .upsert(row, { onConflict: 'ciudad_slug,idioma' });

        if (upsertError) throw upsertError;
        console.log(`  💾 Guardado en Supabase`);
      } else {
        console.log(`  🧪 DRY RUN: contenido generado pero no insertado`);
      }
      
      totalGenerated++;
      await sleep(3000);
      
    } catch (err) {
      console.log(`  ❌ Error: ${err.message}`);
      totalErrors++;
    }
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  const costEstimate = ((totalTokens / 1000000) * 2.50).toFixed(4);

  console.log('\n' + '='.repeat(65));
  console.log('RESUMEN');
  console.log('='.repeat(65));
  console.log(`  ✅ Generadas:  ${totalGenerated} ciudades`);
  console.log(`  ❌ Errores:     ${totalErrors}`);
  console.log(`  🔤 Tokens:      ${totalTokens.toLocaleString()}`);
  console.log(`  💰 Coste aprox: $${costEstimate} (${MODEL})`);
  console.log(`  ⏱️  Tiempo:      ${elapsed}s`);
  console.log('');
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
