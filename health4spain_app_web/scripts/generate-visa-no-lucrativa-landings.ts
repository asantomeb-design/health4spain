/**
 * Genera contenido SEO para las landing pages de VISA NO LUCRATIVA × ciudad
 * con OpenAI. Rellena las filas creadas por los SQL 13 y 14.
 * Soporta 5 idiomas: ES, EN, DE, FR, PT
 *
 * Uso:
 *   npm run generate-visa-landings                    # Todas (95 landings)
 *   npm run generate-visa-landings -- --idioma=de     # Solo alemán (19)
 *   npm run generate-visa-landings -- --slug=seguro-salud-visa-no-lucrativa-torrevieja
 *
 * Requiere .env.local: OPENAI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

function buildPromptES(ciudad: string, provincia: string): string {
  return `Eres un copywriter SEO experto en seguros para expatriados. Genera el contenido completo de una landing page sobre SEGURO DE SALUD PARA VISA NO LUCRATIVA en ${ciudad} (${provincia}), España.

CONTEXTO:
- Público: extranjeros que quieren vivir en España con visa no lucrativa y necesitan un seguro de salud obligatorio.
- El seguro debe ser privado, sin copagos, sin franquicias, con cobertura completa en todo el territorio español.
- Health4Spain NO es aseguradora: conecta al usuario con asesores especializados que comparan aseguradoras (ASISA, Caser, DKV, Sanitas, Adeslas...).
- La landing es ESPECÍFICA para ${ciudad}: menciona datos locales, hospitales, comunidad extranjera, etc.

REGLAS SEO:
1. Keyword principal: "seguro visa no lucrativa ${ciudad}"
2. Keywords secundarias: "seguro salud ${ciudad} extranjeros", "seguro médico privado ${ciudad}", "seguro residencia ${ciudad}"
3. El H1 debe contener la keyword principal
4. Contenido orientado 100% a la conversión: el usuario necesita contratar un seguro AHORA para su visa
5. Menciona requisitos legales reales: sin copagos, cobertura completa, aseguradora autorizada en España
6. Incluye datos reales de ${ciudad}: población extranjera, hospitales/clínicas privadas, comunidad expat
7. Evita fluff marketing. Sé directo, informativo y útil.

Responde SOLO con JSON válido (sin markdown):

{
  "meta_title": "Seguro Visa No Lucrativa en ${ciudad} (máx 60 caracteres)",
  "meta_description": "Seguro de salud para visa no lucrativa en ${ciudad}. Sin copagos, aseguradoras autorizadas. (máx 155 caracteres)",
  "meta_keywords": "seguro visa no lucrativa ${ciudad}, seguro salud ${ciudad} extranjeros, seguro medico privado ${ciudad}",
  "hero_title": "Seguro de Salud para Visa No Lucrativa en ${ciudad}",
  "hero_subtitle": "Párrafo de 2-3 frases: por qué necesitas seguro en ${ciudad} para tu visa, qué hacemos, respuesta en 24h",
  "hero_bullets": ["4 bullets: sin copagos, cobertura completa, aseguradoras autorizadas, respuesta 24h"],
  "problem_title": "¿Necesitas un seguro para tu visa no lucrativa en ${ciudad}?",
  "problems": ["5 problemas reales del expat en ${ciudad}: requisitos consulado, no sé qué seguro elegir, precios confusos, no hablo español, miedo a que rechacen la visa"],
  "solution_title": "Cómo te ayudamos en ${ciudad}",
  "solution_text": "Párrafo explicando que comparamos aseguradoras, analizamos perfil, sin coste, respuesta en 24h",
  "services_title": "Requisitos del seguro para visa no lucrativa en ${ciudad}",
  "services": [
    {"icon": "🏥", "title": "Cobertura territorial completa", "description": "Válido en toda España, incluida ${ciudad} y ${provincia}"},
    {"icon": "💶", "title": "Sin copagos", "description": "Requisito obligatorio para la visa no lucrativa"},
    {"icon": "🏨", "title": "Hospitalización y cirugía", "description": "Cobertura completa en hospitales de ${ciudad}"},
    {"icon": "📋", "title": "Vigencia completa", "description": "Duración mínima igual al periodo de residencia solicitado"},
    {"icon": "✅", "title": "Aseguradora autorizada", "description": "Compañía con licencia en España: ASISA, Caser, DKV..."}
  ],
  "why_city_title": "Vivir en ${ciudad} con visa no lucrativa",
  "why_city_text": "Párrafo sobre ${ciudad} para expats: comunidad extranjera, sanidad privada disponible, calidad de vida, clima",
  "why_city_stats": [
    {"value": "dato real", "label": "Habitantes"},
    {"value": "dato real", "label": "% extranjeros"},
    {"value": "dato real", "label": "Hospitales/clínicas privadas"},
    {"value": "dato real", "label": "Temperatura media anual"}
  ],
  "faqs": [
    {"question": "¿Cuánto cuesta un seguro para visa no lucrativa en ${ciudad}?", "answer": "Respuesta con rango de precios según edad (60-130€/mes)"},
    {"question": "¿Qué requisitos debe cumplir el seguro para la visa no lucrativa?", "answer": "Sin copagos, cobertura completa, aseguradora autorizada en España"},
    {"question": "¿Puedo contratar el seguro sin NIE en ${ciudad}?", "answer": "Sí, con pasaporte. Lo gestionamos por ti"},
    {"question": "¿Qué aseguradoras operan en ${ciudad}?", "answer": "Menciona aseguradoras reales con presencia en ${provincia}"}
  ],
  "cta_title": "Compara seguros para visa no lucrativa en ${ciudad}",
  "cta_subtitle": "Presupuesto gratuito en 24 horas. Sin compromiso."
}`;
}

function buildPromptEN(ciudad: string, provincia: string): string {
  return `You are an expert SEO copywriter for expat insurance. Generate the full content for a landing page about HEALTH INSURANCE FOR NON-LUCRATIVE VISA in ${ciudad} (${provincia}), Spain.

CONTEXT:
- Audience: foreigners who want to live in Spain on a non-lucrative visa and need mandatory health insurance.
- The insurance must be private, with no co-pays, no deductibles, and full coverage across all of Spain.
- Health4Spain is NOT an insurance company: we connect users with specialised advisors who compare insurers (ASISA, Caser, DKV, Sanitas, Adeslas...).
- This landing is SPECIFIC to ${ciudad}: mention local data, hospitals, expat community, etc.

SEO RULES:
1. Primary keyword: "non-lucrative visa insurance ${ciudad}"
2. Secondary keywords: "health insurance ${ciudad} foreigners", "private medical insurance ${ciudad}", "Spain visa insurance ${ciudad}"
3. H1 must contain the primary keyword
4. Content 100% conversion-oriented: the user needs insurance NOW for their visa
5. Mention real legal requirements: no co-pays, full coverage, insurer authorised in Spain
6. Include real data about ${ciudad}: foreign population, private hospitals/clinics, expat community
7. No marketing fluff. Be direct, informative and useful.

Respond ONLY with valid JSON (no markdown):

{
  "meta_title": "Non-Lucrative Visa Insurance ${ciudad} (max 60 chars)",
  "meta_description": "Health insurance for non-lucrative visa in ${ciudad}. No co-pays, authorised insurers. (max 155 chars)",
  "meta_keywords": "non-lucrative visa insurance ${ciudad}, health insurance ${ciudad} foreigners, private medical insurance ${ciudad}",
  "hero_title": "Health Insurance for Non-Lucrative Visa in ${ciudad}",
  "hero_subtitle": "2-3 sentence paragraph: why you need insurance in ${ciudad} for your visa, what we do, reply in 24h",
  "hero_bullets": ["4 bullets: no co-pays, full coverage, authorised insurers, 24h response"],
  "problem_title": "Need insurance for your non-lucrative visa in ${ciudad}?",
  "problems": ["5 real expat problems in ${ciudad}: consulate requirements, confusing options, high prices, language barrier, visa rejection fear"],
  "solution_title": "How we help you in ${ciudad}",
  "solution_text": "Paragraph: we compare insurers, analyse your profile, no cost, reply in 24h",
  "services_title": "Insurance requirements for non-lucrative visa in ${ciudad}",
  "services": [
    {"icon": "🏥", "title": "Full territorial coverage", "description": "Valid across all of Spain, including ${ciudad} and ${provincia}"},
    {"icon": "💶", "title": "No co-pays", "description": "Mandatory requirement for the non-lucrative visa"},
    {"icon": "🏨", "title": "Hospitalisation and surgery", "description": "Full coverage at ${ciudad} hospitals"},
    {"icon": "📋", "title": "Full validity period", "description": "Minimum duration matching your residence permit"},
    {"icon": "✅", "title": "Authorised insurer", "description": "Company licensed in Spain: ASISA, Caser, DKV..."}
  ],
  "why_city_title": "Living in ${ciudad} on a non-lucrative visa",
  "why_city_text": "Paragraph about ${ciudad} for expats: foreign community, private healthcare, quality of life, climate",
  "why_city_stats": [
    {"value": "real data", "label": "Population"},
    {"value": "real data", "label": "% foreigners"},
    {"value": "real data", "label": "Private hospitals/clinics"},
    {"value": "real data", "label": "Average annual temperature"}
  ],
  "faqs": [
    {"question": "How much does non-lucrative visa insurance cost in ${ciudad}?", "answer": "Price range by age (60-130€/month)"},
    {"question": "What requirements must the insurance meet for the non-lucrative visa?", "answer": "No co-pays, full coverage, insurer authorised in Spain"},
    {"question": "Can I get insurance without a NIE in ${ciudad}?", "answer": "Yes, with your passport. We handle it for you"},
    {"question": "Which insurers operate in ${ciudad}?", "answer": "Mention real insurers with presence in ${provincia}"}
  ],
  "cta_title": "Compare non-lucrative visa insurance in ${ciudad}",
  "cta_subtitle": "Free quote in 24 hours. No obligation."
}`;
}

function buildPromptDE(ciudad: string, provincia: string): string {
  return `Du bist ein erfahrener SEO-Texter für Expat-Versicherungen. Erstelle den vollständigen Inhalt einer Landing Page über KRANKENVERSICHERUNG FÜR VISUM OHNE ERWERBSTÄTIGKEIT in ${ciudad} (${provincia}), Spanien.

KONTEXT:
- Zielgruppe: Ausländer, die mit einem Visum ohne Erwerbstätigkeit in Spanien leben möchten und eine Pflicht-Krankenversicherung brauchen.
- Die Versicherung muss privat sein, ohne Selbstbeteiligung, ohne Franchise, mit Volldeckung in ganz Spanien.
- Health4Spain ist KEIN Versicherer: wir verbinden Nutzer mit spezialisierten Beratern, die Versicherer vergleichen (ASISA, Caser, DKV, Sanitas, Adeslas...).
- Diese Landing ist SPEZIFISCH für ${ciudad}: erwähne lokale Daten, Krankenhäuser, Expat-Community usw.

SEO-REGELN:
1. Haupt-Keyword: "visum krankenversicherung ${ciudad}"
2. Neben-Keywords: "krankenversicherung ${ciudad} ausländer", "private krankenversicherung ${ciudad}", "visum versicherung ${ciudad}"
3. H1 muss das Haupt-Keyword enthalten
4. Inhalt 100% conversionsorientiert
5. Echte rechtliche Anforderungen erwähnen: keine Selbstbeteiligung, Volldeckung, in Spanien zugelassener Versicherer
6. Echte Daten über ${ciudad} einbeziehen: Ausländeranteil, Privatkliniken, Expat-Community
7. Kein Marketing-Fluff. Direkt, informativ und nützlich.

Antworte NUR mit gültigem JSON (kein Markdown):

{
  "meta_title": "Visum-Krankenversicherung ${ciudad} (max 60 Zeichen)",
  "meta_description": "Krankenversicherung für Visum ohne Erwerbstätigkeit in ${ciudad}. Ohne Selbstbeteiligung. (max 155 Zeichen)",
  "meta_keywords": "visum krankenversicherung ${ciudad}, krankenversicherung ${ciudad} ausländer, private krankenversicherung ${ciudad}",
  "hero_title": "Krankenversicherung für Visum ohne Erwerbstätigkeit in ${ciudad}",
  "hero_subtitle": "2-3 Sätze: Warum Sie in ${ciudad} eine Versicherung für Ihr Visum brauchen, was wir tun, Antwort in 24h",
  "hero_bullets": ["4 Bullets: keine Selbstbeteiligung, Volldeckung, zugelassene Versicherer, 24h Antwort"],
  "problem_title": "Brauchen Sie eine Versicherung für Ihr Visum in ${ciudad}?",
  "problems": ["5 echte Probleme: Konsulat-Anforderungen, verwirrende Optionen, hohe Preise, Sprachbarriere, Angst vor Visum-Ablehnung"],
  "solution_title": "Wie wir Ihnen in ${ciudad} helfen",
  "solution_text": "Absatz: Wir vergleichen Versicherer, analysieren Ihr Profil, kostenlos, Antwort in 24h",
  "services_title": "Versicherungsanforderungen für das Visum in ${ciudad}",
  "services": [
    {"icon": "🏥", "title": "Vollständige territoriale Deckung", "description": "Gültig in ganz Spanien, einschließlich ${ciudad} und ${provincia}"},
    {"icon": "💶", "title": "Keine Selbstbeteiligung", "description": "Pflichtanforderung für das Visum ohne Erwerbstätigkeit"},
    {"icon": "🏨", "title": "Krankenhausaufenthalt und Chirurgie", "description": "Volldeckung in Krankenhäusern in ${ciudad}"},
    {"icon": "📋", "title": "Vollständige Gültigkeit", "description": "Mindestdauer entsprechend Ihrer Aufenthaltserlaubnis"},
    {"icon": "✅", "title": "Zugelassener Versicherer", "description": "In Spanien lizenziertes Unternehmen: ASISA, Caser, DKV..."}
  ],
  "why_city_title": "Leben in ${ciudad} mit Visum ohne Erwerbstätigkeit",
  "why_city_text": "Absatz über ${ciudad} für Expats: ausländische Community, private Gesundheitsversorgung, Lebensqualität, Klima",
  "why_city_stats": [
    {"value": "echte Daten", "label": "Einwohner"},
    {"value": "echte Daten", "label": "% Ausländer"},
    {"value": "echte Daten", "label": "Privatkliniken"},
    {"value": "echte Daten", "label": "Durchschnittliche Jahrestemperatur"}
  ],
  "faqs": [
    {"question": "Was kostet eine Visum-Krankenversicherung in ${ciudad}?", "answer": "Preisspanne nach Alter (60-130€/Monat)"},
    {"question": "Welche Anforderungen muss die Versicherung für das Visum erfüllen?", "answer": "Keine Selbstbeteiligung, Volldeckung, in Spanien zugelassener Versicherer"},
    {"question": "Kann ich ohne NIE eine Versicherung in ${ciudad} abschließen?", "answer": "Ja, mit Reisepass. Wir kümmern uns darum"},
    {"question": "Welche Versicherer sind in ${ciudad} tätig?", "answer": "Echte Versicherer mit Präsenz in ${provincia} nennen"}
  ],
  "cta_title": "Visum-Versicherungen in ${ciudad} vergleichen",
  "cta_subtitle": "Kostenloses Angebot in 24 Stunden. Unverbindlich."
}`;
}

function buildPromptFR(ciudad: string, provincia: string): string {
  return `Tu es un rédacteur SEO expert en assurance pour expatriés. Génère le contenu complet d'une landing page sur l'ASSURANCE SANTÉ POUR VISA NON LUCRATIF à ${ciudad} (${provincia}), Espagne.

CONTEXTE :
- Public : étrangers qui veulent vivre en Espagne avec un visa non lucratif et ont besoin d'une assurance santé obligatoire.
- L'assurance doit être privée, sans franchise, sans copaiement, avec couverture complète sur tout le territoire espagnol.
- Health4Spain N'EST PAS un assureur : nous connectons les utilisateurs avec des conseillers spécialisés qui comparent les assureurs (ASISA, Caser, DKV, Sanitas, Adeslas...).
- Cette landing est SPÉCIFIQUE à ${ciudad} : mentionne des données locales, hôpitaux, communauté expatriée, etc.

RÈGLES SEO :
1. Mot-clé principal : "assurance visa non lucratif ${ciudad}"
2. Mots-clés secondaires : "assurance santé ${ciudad} étrangers", "assurance médicale privée ${ciudad}", "assurance visa ${ciudad}"
3. Le H1 doit contenir le mot-clé principal
4. Contenu 100% orienté conversion
5. Mentionner les exigences légales réelles : sans franchise, couverture complète, assureur autorisé en Espagne
6. Inclure des données réelles sur ${ciudad} : population étrangère, hôpitaux/cliniques privées, communauté expat
7. Pas de fluff marketing. Sois direct, informatif et utile.

Réponds UNIQUEMENT avec du JSON valide (pas de markdown) :

{
  "meta_title": "Assurance Visa Non Lucratif ${ciudad} (max 60 caractères)",
  "meta_description": "Assurance santé pour visa non lucratif à ${ciudad}. Sans franchise, assureurs autorisés. (max 155 caractères)",
  "meta_keywords": "assurance visa non lucratif ${ciudad}, assurance santé ${ciudad} étrangers, assurance médicale privée ${ciudad}",
  "hero_title": "Assurance Santé pour Visa Non Lucratif à ${ciudad}",
  "hero_subtitle": "Paragraphe de 2-3 phrases : pourquoi vous avez besoin d'une assurance à ${ciudad} pour votre visa, ce que nous faisons, réponse en 24h",
  "hero_bullets": ["4 bullets : sans franchise, couverture complète, assureurs autorisés, réponse 24h"],
  "problem_title": "Besoin d'une assurance pour votre visa non lucratif à ${ciudad} ?",
  "problems": ["5 problèmes réels de l'expat à ${ciudad} : exigences du consulat, options confuses, prix élevés, barrière linguistique, peur du refus de visa"],
  "solution_title": "Comment nous vous aidons à ${ciudad}",
  "solution_text": "Paragraphe : nous comparons les assureurs, analysons votre profil, sans frais, réponse en 24h",
  "services_title": "Exigences d'assurance pour le visa non lucratif à ${ciudad}",
  "services": [
    {"icon": "🏥", "title": "Couverture territoriale complète", "description": "Valide dans toute l'Espagne, y compris ${ciudad} et ${provincia}"},
    {"icon": "💶", "title": "Sans franchise", "description": "Exigence obligatoire pour le visa non lucratif"},
    {"icon": "🏨", "title": "Hospitalisation et chirurgie", "description": "Couverture complète dans les hôpitaux de ${ciudad}"},
    {"icon": "📋", "title": "Validité complète", "description": "Durée minimale correspondant à votre permis de résidence"},
    {"icon": "✅", "title": "Assureur autorisé", "description": "Compagnie autorisée en Espagne : ASISA, Caser, DKV..."}
  ],
  "why_city_title": "Vivre à ${ciudad} avec un visa non lucratif",
  "why_city_text": "Paragraphe sur ${ciudad} pour les expats : communauté étrangère, soins privés, qualité de vie, climat",
  "why_city_stats": [
    {"value": "donnée réelle", "label": "Population"},
    {"value": "donnée réelle", "label": "% étrangers"},
    {"value": "donnée réelle", "label": "Hôpitaux/cliniques privées"},
    {"value": "donnée réelle", "label": "Température moyenne annuelle"}
  ],
  "faqs": [
    {"question": "Combien coûte une assurance visa non lucratif à ${ciudad} ?", "answer": "Fourchette de prix par âge (60-130€/mois)"},
    {"question": "Quelles exigences l'assurance doit-elle remplir pour le visa non lucratif ?", "answer": "Sans franchise, couverture complète, assureur autorisé en Espagne"},
    {"question": "Puis-je souscrire une assurance sans NIE à ${ciudad} ?", "answer": "Oui, avec votre passeport. Nous nous en occupons"},
    {"question": "Quels assureurs opèrent à ${ciudad} ?", "answer": "Mentionner les assureurs réels présents dans ${provincia}"}
  ],
  "cta_title": "Comparer les assurances visa non lucratif à ${ciudad}",
  "cta_subtitle": "Devis gratuit en 24 heures. Sans engagement."
}`;
}

function buildPromptPT(ciudad: string, provincia: string): string {
  return `És um redator SEO especialista em seguros para expatriados. Gera o conteúdo completo de uma landing page sobre SEGURO DE SAÚDE PARA VISTO NÃO LUCRATIVO em ${ciudad} (${provincia}), Espanha.

CONTEXTO:
- Público: estrangeiros que querem viver em Espanha com um visto não lucrativo e precisam de um seguro de saúde obrigatório.
- O seguro deve ser privado, sem copagamentos, sem franquias, com cobertura completa em todo o território espanhol.
- Health4Spain NÃO é seguradora: conecta o utilizador com consultores especializados que comparam seguradoras (ASISA, Caser, DKV, Sanitas, Adeslas...).
- Esta landing é ESPECÍFICA para ${ciudad}: menciona dados locais, hospitais, comunidade estrangeira, etc.

REGRAS SEO:
1. Palavra-chave principal: "seguro visto não lucrativo ${ciudad}"
2. Palavras-chave secundárias: "seguro saúde ${ciudad} estrangeiros", "seguro médico privado ${ciudad}", "seguro residência ${ciudad}"
3. O H1 deve conter a palavra-chave principal
4. Conteúdo 100% orientado à conversão
5. Mencionar requisitos legais reais: sem copagamentos, cobertura completa, seguradora autorizada em Espanha
6. Incluir dados reais de ${ciudad}: população estrangeira, hospitais/clínicas privadas, comunidade expat
7. Sem fluff de marketing. Sê direto, informativo e útil.

Responde APENAS com JSON válido (sem markdown):

{
  "meta_title": "Seguro Visto Não Lucrativo ${ciudad} (máx 60 caracteres)",
  "meta_description": "Seguro de saúde para visto não lucrativo em ${ciudad}. Sem copagamentos, seguradoras autorizadas. (máx 155 caracteres)",
  "meta_keywords": "seguro visto não lucrativo ${ciudad}, seguro saúde ${ciudad} estrangeiros, seguro médico privado ${ciudad}",
  "hero_title": "Seguro de Saúde para Visto Não Lucrativo em ${ciudad}",
  "hero_subtitle": "Parágrafo de 2-3 frases: porque precisa de seguro em ${ciudad} para o seu visto, o que fazemos, resposta em 24h",
  "hero_bullets": ["4 bullets: sem copagamentos, cobertura completa, seguradoras autorizadas, resposta 24h"],
  "problem_title": "Precisa de um seguro para o seu visto não lucrativo em ${ciudad}?",
  "problems": ["5 problemas reais do expat em ${ciudad}: requisitos do consulado, opções confusas, preços altos, barreira linguística, medo de recusa do visto"],
  "solution_title": "Como o ajudamos em ${ciudad}",
  "solution_text": "Parágrafo: comparamos seguradoras, analisamos o seu perfil, sem custos, resposta em 24h",
  "services_title": "Requisitos do seguro para visto não lucrativo em ${ciudad}",
  "services": [
    {"icon": "🏥", "title": "Cobertura territorial completa", "description": "Válido em toda a Espanha, incluindo ${ciudad} e ${provincia}"},
    {"icon": "💶", "title": "Sem copagamentos", "description": "Requisito obrigatório para o visto não lucrativo"},
    {"icon": "🏨", "title": "Hospitalização e cirurgia", "description": "Cobertura completa nos hospitais de ${ciudad}"},
    {"icon": "📋", "title": "Validade completa", "description": "Duração mínima igual ao período de residência solicitado"},
    {"icon": "✅", "title": "Seguradora autorizada", "description": "Companhia com licença em Espanha: ASISA, Caser, DKV..."}
  ],
  "why_city_title": "Viver em ${ciudad} com visto não lucrativo",
  "why_city_text": "Parágrafo sobre ${ciudad} para expats: comunidade estrangeira, saúde privada, qualidade de vida, clima",
  "why_city_stats": [
    {"value": "dado real", "label": "Habitantes"},
    {"value": "dado real", "label": "% estrangeiros"},
    {"value": "dado real", "label": "Hospitais/clínicas privadas"},
    {"value": "dado real", "label": "Temperatura média anual"}
  ],
  "faqs": [
    {"question": "Quanto custa um seguro para visto não lucrativo em ${ciudad}?", "answer": "Faixa de preços por idade (60-130€/mês)"},
    {"question": "Que requisitos deve cumprir o seguro para o visto não lucrativo?", "answer": "Sem copagamentos, cobertura completa, seguradora autorizada em Espanha"},
    {"question": "Posso contratar seguro sem NIE em ${ciudad}?", "answer": "Sim, com passaporte. Tratamos disso por si"},
    {"question": "Que seguradoras operam em ${ciudad}?", "answer": "Mencionar seguradoras reais com presença em ${provincia}"}
  ],
  "cta_title": "Comparar seguros para visto não lucrativo em ${ciudad}",
  "cta_subtitle": "Orçamento gratuito em 24 horas. Sem compromisso."
}`;
}

const SYSTEM_MESSAGES: Record<string, string> = {
  es: 'Eres un copywriter SEO. Responde SOLO con JSON válido, sin markdown.',
  en: 'You are an SEO copywriter. Respond ONLY with valid JSON, no markdown.',
  de: 'Du bist ein SEO-Texter. Antworte NUR mit gültigem JSON, kein Markdown.',
  fr: 'Tu es un rédacteur SEO. Réponds UNIQUEMENT avec du JSON valide, pas de markdown.',
  pt: 'És um redator SEO. Responde APENAS com JSON válido, sem markdown.',
};

const PROMPT_BUILDERS: Record<string, (ciudad: string, provincia: string) => string> = {
  es: buildPromptES,
  en: buildPromptEN,
  de: buildPromptDE,
  fr: buildPromptFR,
  pt: buildPromptPT,
};

async function generateLanding(landing: Record<string, unknown>): Promise<Record<string, unknown> | null> {
  const slug = landing.slug as string;
  const idioma = landing.idioma as string;
  const ciudad = (landing.ciudad_nombre || '') as string;
  const provincia = (landing.provincia || '') as string;

  try {
    const buildPrompt = PROMPT_BUILDERS[idioma] || PROMPT_BUILDERS['es'];
    const prompt = buildPrompt(ciudad, provincia);
    const systemMsg = SYSTEM_MESSAGES[idioma] || SYSTEM_MESSAGES['es'];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemMsg },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const text = completion.choices[0].message.content || '';
    const cleanJson = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const generated = JSON.parse(cleanJson);

    return {
      meta_title: (generated.meta_title || '').substring(0, 70),
      meta_description: (generated.meta_description || '').substring(0, 160),
      meta_keywords: generated.meta_keywords || '',
      hero_title: generated.hero_title || '',
      hero_subtitle: generated.hero_subtitle || '',
      hero_bullets: generated.hero_bullets || [],
      problem_title: generated.problem_title || null,
      problems: generated.problems || [],
      solution_title: generated.solution_title || null,
      solution_text: generated.solution_text || null,
      services_title: generated.services_title || null,
      services: generated.services || [],
      why_city_title: generated.why_city_title || null,
      why_city_text: generated.why_city_text || null,
      why_city_stats: generated.why_city_stats || [],
      faqs: generated.faqs || [],
      cta_title: generated.cta_title || null,
      cta_subtitle: generated.cta_subtitle || null,
    };
  } catch (err: unknown) {
    console.error(`  ❌ ${slug}:`, err instanceof Error ? err.message : err);
    return null;
  }
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Falta OPENAI_API_KEY en .env.local');
    process.exit(1);
  }

  console.log('🔄 Generando contenido para landings VISA NO LUCRATIVA × ciudad...\n');

  const slugFilter = process.argv.find((a) => a.startsWith('--slug='));
  const onlySlug = slugFilter ? slugFilter.split('=')[1] : null;

  const idiomaFilter = process.argv.find((a) => a.startsWith('--idioma='));
  const onlyIdioma = idiomaFilter ? idiomaFilter.split('=')[1] : null;

  let query = supabase
    .from('landing_pages')
    .select('*')
    .like('slug', 'seguro-salud-visa-no-lucrativa-%')
    .eq('activo', true);

  if (onlySlug) {
    query = query.eq('slug', onlySlug);
    console.log(`   Solo slug: ${onlySlug}\n`);
  }
  if (onlyIdioma) {
    query = query.eq('idioma', onlyIdioma);
    console.log(`   Solo idioma: ${onlyIdioma}\n`);
  }

  const { data: landings, error: fetchError } = await query;

  if (fetchError) {
    console.error('❌ Error:', fetchError.message);
    process.exit(1);
  }

  if (!landings || landings.length === 0) {
    console.log('No hay landings de visa no lucrativa por ciudad. ¿Ejecutaste los SQL 13 y 14?');
    return;
  }

  console.log(`Encontradas ${landings.length} landings. Generando contenido...\n`);

  let ok = 0;
  let fail = 0;

  for (const landing of landings) {
    process.stdout.write(`  [${landing.idioma}] ${landing.slug}... `);

    const content = await generateLanding(landing);

    if (!content) {
      fail++;
      continue;
    }

    const { error: updateError } = await supabase
      .from('landing_pages')
      .update({
        ...content,
        generado_por_ia: true,
        fecha_generacion: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', landing.id);

    if (updateError) {
      console.log(`❌ ${updateError.message}`);
      fail++;
    } else {
      console.log('✅');
      ok++;
    }

    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\n✅ ${ok} landings generadas`);
  if (fail > 0) console.log(`❌ ${fail} errores`);
}

main().catch(console.error);
