-- =============================================
-- LANDING MADRE: Seguro de Salud Visa No Lucrativa
-- ES + EN (las landing × ciudad se generan con el script)
-- =============================================

-- VERSION ESPAÑOL
INSERT INTO landing_pages (
  slug, servicio_slug, servicio_nombre, ciudad_slug, ciudad_nombre, provincia,
  meta_title, meta_description, meta_keywords,
  hero_title, hero_subtitle, hero_bullets,
  problem_title, problems,
  solution_title, solution_text,
  services_title, services,
  why_city_title, why_city_text, why_city_stats,
  faqs,
  cta_title, cta_subtitle,
  idioma, activo, revisado, generado_por_ia
) VALUES (
  'seguro-salud-visa-no-lucrativa',
  'seguros',
  'Seguros de Salud',
  'espana',
  'España',
  NULL,
  'Seguro de Salud para Visa No Lucrativa en España | Health4Spain',
  'Seguro de salud privado para tu visado no lucrativo en España. Cobertura obligatoria homologada. Comparamos ASISA, Caser y más. Respuesta en 24h. Sin coste.',
  'seguro salud visa no lucrativa, seguro medico visa no lucrativa españa, seguro privado visado no lucrativo, seguro obligatorio residencia españa',
  'Seguro de Salud para Visa No Lucrativa en España',
  'Si quieres vivir en España con una visa no lucrativa o un permiso de residencia, necesitas un seguro de salud privado que cumpla los requisitos exigidos por el Consulado español. Este seguro debe tener cobertura completa, sin copagos y sin límite de capital asegurado. En Health4Spain te conectamos con el profesional adecuado en menos de 24 horas, sin coste para ti.',
  '["Cobertura completa sin copagos", "Aceptado por todos los consulados españoles", "Comparamos ASISA, Caser y más aseguradoras", "Respuesta en menos de 24 horas"]'::jsonb,
  '¿Por qué necesitas un seguro de salud para la visa no lucrativa?',
  '["La normativa española exige un seguro médico privado vigente durante todo el periodo de estancia", "El Consulado verifica este requisito en el momento de la solicitud — sin seguro, la visa no se concede", "El seguro debe cubrir todo el territorio español, sin copagos ni franquicias", "Debe incluir hospitalización, urgencias, consultas y cirugía", "Debe estar expedido por una compañía aseguradora autorizada en España"]'::jsonb,
  'Cómo te ayudamos',
  'No somos una aseguradora. Somos el puente entre tú y los mejores profesionales del sector. Cuando nos contactas, un asesor especializado en expatriados analiza tu perfil (edad, ciudad de residencia, duración del visado, historial médico) y te presenta las opciones más adecuadas de compañías como ASISA, Caser u otras autorizadas. Tú decides. Nosotros no cobramos nada.',
  'Requisitos del seguro para visa no lucrativa',
  '[{"icon": "🏥", "title": "Cobertura en todo el territorio español", "description": "El seguro debe ser válido en todas las comunidades autónomas sin restricciones geográficas"},{"icon": "💶", "title": "Sin copagos ni franquicias", "description": "El acceso a la atención médica no puede tener costes adicionales para el asegurado"},{"icon": "🏨", "title": "Hospitalización y cirugía", "description": "Cobertura completa de hospitalización, intervenciones quirúrgicas y urgencias"},{"icon": "📋", "title": "Vigencia completa", "description": "El seguro debe estar vigente durante todo el periodo de residencia solicitado"},{"icon": "✅", "title": "Aseguradora autorizada en España", "description": "Debe estar expedido por una compañía con licencia para operar en territorio español"}]'::jsonb,
  NULL, NULL, '[]'::jsonb,
  '[{"question": "¿Cuánto cuesta un seguro de salud para la visa no lucrativa en España?", "answer": "El coste varía según la edad del asegurado, la compañía elegida y la cobertura. Orientativamente, para un adulto de 50 años, el rango habitual es de 60 a 130 euros al mes. Te damos un presupuesto personalizado sin compromiso en menos de 24 horas."},{"question": "¿Se puede contratar el seguro sin tener ya el NIE?", "answer": "Sí. Varias aseguradoras permiten contratar con pasaporte mientras se tramita el NIE. Lo gestionamos para ti."},{"question": "¿Cubre preexistencias?", "answer": "Depende de la compañía y el tipo de póliza. Hay opciones específicas para personas con condiciones previas. Te asesoramos según tu caso."},{"question": "¿El seguro cubre si me tengo que volver a mi país de origen?", "answer": "Sí, la mayoría de pólizas incluyen cobertura de repatriación y traslado sanitario al país de origen en caso de necesidad."}]'::jsonb,
  'Solicita tu presupuesto gratuito',
  'Te conectamos con un asesor especializado en seguros para visa no lucrativa. Sin coste, sin compromiso. Respuesta en 24 horas.',
  'es', true, true, false
)
ON CONFLICT (slug, idioma) DO UPDATE SET
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  meta_keywords = EXCLUDED.meta_keywords,
  hero_title = EXCLUDED.hero_title,
  hero_subtitle = EXCLUDED.hero_subtitle,
  hero_bullets = EXCLUDED.hero_bullets,
  problem_title = EXCLUDED.problem_title,
  problems = EXCLUDED.problems,
  solution_title = EXCLUDED.solution_title,
  solution_text = EXCLUDED.solution_text,
  services_title = EXCLUDED.services_title,
  services = EXCLUDED.services,
  faqs = EXCLUDED.faqs,
  cta_title = EXCLUDED.cta_title,
  cta_subtitle = EXCLUDED.cta_subtitle,
  updated_at = NOW();

-- VERSION INGLÉS
INSERT INTO landing_pages (
  slug, servicio_slug, servicio_nombre, ciudad_slug, ciudad_nombre, provincia,
  meta_title, meta_description, meta_keywords,
  hero_title, hero_subtitle, hero_bullets,
  problem_title, problems,
  solution_title, solution_text,
  services_title, services,
  why_city_title, why_city_text, why_city_stats,
  faqs,
  cta_title, cta_subtitle,
  idioma, activo, revisado, generado_por_ia
) VALUES (
  'seguro-salud-visa-no-lucrativa',
  'seguros',
  'Health Insurance',
  'espana',
  'Spain',
  NULL,
  'Health Insurance for Non-Lucrative Visa Spain | Health4Spain',
  'Private health insurance for Spain non-lucrative visa. Meet the mandatory coverage requirement. We compare top insurers. Reply in 24h. Free service.',
  'health insurance non-lucrative visa spain, medical insurance spain visa, private health insurance spanish residency, non-lucrative visa insurance requirement',
  'Health Insurance for Non-Lucrative Visa Spain',
  'If you want to live in Spain on a non-lucrative visa or residence permit, you need private health insurance that meets the requirements set by the Spanish Consulate. This insurance must provide full coverage, with no co-pays and no capital limit. At Health4Spain we connect you with the right professional in under 24 hours, at no cost to you.',
  '["Full coverage with no co-pays", "Accepted by all Spanish consulates", "We compare ASISA, Caser and more", "Response in under 24 hours"]'::jsonb,
  'Why do you need health insurance for the non-lucrative visa?',
  '["Spanish law requires valid private health insurance for the entire period of stay", "The Consulate verifies this requirement at the time of application — without insurance, the visa is denied", "The insurance must cover the entire Spanish territory, with no co-pays or deductibles", "It must include hospitalisation, emergencies, consultations and surgery", "It must be issued by an insurance company authorised to operate in Spain"]'::jsonb,
  'How we help you',
  'We are not an insurance company. We are the bridge between you and the best professionals in the sector. When you contact us, an advisor specialising in expats analyses your profile (age, city of residence, visa duration, medical history) and presents you with the most suitable options from companies like ASISA, Caser or other authorised insurers. You decide. We charge nothing.',
  'Insurance requirements for non-lucrative visa',
  '[{"icon": "🏥", "title": "Coverage across all of Spain", "description": "The insurance must be valid in all autonomous communities with no geographical restrictions"},{"icon": "💶", "title": "No co-pays or deductibles", "description": "Access to medical care cannot have additional costs for the insured"},{"icon": "🏨", "title": "Hospitalisation and surgery", "description": "Full coverage for hospitalisation, surgical procedures and emergencies"},{"icon": "📋", "title": "Full validity period", "description": "The insurance must remain valid for the entire residence period requested"},{"icon": "✅", "title": "Authorised Spanish insurer", "description": "Must be issued by a company licensed to operate in Spanish territory"}]'::jsonb,
  NULL, NULL, '[]'::jsonb,
  '[{"question": "How much does health insurance for the non-lucrative visa in Spain cost?", "answer": "The cost varies depending on the age of the insured, the company chosen and the coverage. As a guide, for a 50-year-old adult, the typical range is 60 to 130 euros per month. We give you a personalised quote with no obligation in under 24 hours."},{"question": "Can I take out insurance without already having a NIE?", "answer": "Yes. Several insurers allow you to sign up with your passport while your NIE is being processed. We handle it for you."},{"question": "Does it cover pre-existing conditions?", "answer": "It depends on the company and the type of policy. There are specific options for people with pre-existing conditions. We advise you based on your case."},{"question": "Does the insurance cover repatriation to my home country?", "answer": "Yes, most policies include repatriation coverage and medical transfer to your home country if needed."}]'::jsonb,
  'Request your free quote',
  'We connect you with an advisor specialising in insurance for non-lucrative visas. No cost, no obligation. Response in 24 hours.',
  'en', true, true, false
)
ON CONFLICT (slug, idioma) DO UPDATE SET
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  meta_keywords = EXCLUDED.meta_keywords,
  hero_title = EXCLUDED.hero_title,
  hero_subtitle = EXCLUDED.hero_subtitle,
  hero_bullets = EXCLUDED.hero_bullets,
  problem_title = EXCLUDED.problem_title,
  problems = EXCLUDED.problems,
  solution_title = EXCLUDED.solution_title,
  solution_text = EXCLUDED.solution_text,
  services_title = EXCLUDED.services_title,
  services = EXCLUDED.services,
  faqs = EXCLUDED.faqs,
  cta_title = EXCLUDED.cta_title,
  cta_subtitle = EXCLUDED.cta_subtitle,
  updated_at = NOW();

-- =============================================
-- LANDING × CIUDAD: Crear las 19 filas vacías (ES)
-- El contenido se genera con el script generate-visa-no-lucrativa-landings.ts
-- =============================================

INSERT INTO landing_pages (
  slug, servicio_slug, servicio_nombre, ciudad_slug, ciudad_nombre, provincia,
  meta_title, meta_description, meta_keywords,
  hero_title, hero_subtitle, hero_bullets,
  problem_title, problems, solution_title, solution_text,
  services_title, services, why_city_title, why_city_text, why_city_stats,
  faqs, cta_title, cta_subtitle,
  idioma, activo, revisado, generado_por_ia
)
SELECT
  'seguro-salud-visa-no-lucrativa-' || c.slug,
  'seguros',
  'Seguros de Salud',
  c.slug,
  c.nombre,
  c.provincia,
  'Seguro Visa No Lucrativa en ' || c.nombre || ' | Health4Spain',
  'Seguro de salud para visa no lucrativa en ' || c.nombre || '. Cobertura sin copagos, aseguradoras autorizadas. Presupuesto gratis en 24h.',
  'seguro visa no lucrativa ' || c.nombre || ', seguro salud ' || c.nombre || ' extranjeros',
  'Seguro de Salud para Visa No Lucrativa en ' || c.nombre,
  'Seguro de salud privado sin copagos para tu visa no lucrativa en ' || c.nombre || '. Comparamos aseguradoras autorizadas. Sin coste para ti.',
  '[]'::jsonb,
  NULL, '[]'::jsonb, NULL, NULL,
  NULL, '[]'::jsonb, NULL, NULL, '[]'::jsonb,
  '[]'::jsonb,
  'Compara seguros para visa no lucrativa en ' || c.nombre,
  'Presupuesto gratuito en 24 horas. Sin compromiso.',
  'es', true, false, false
FROM ciudades_catalogo c
WHERE c.slug IN (
  'murcia', 'cartagena', 'lorca', 'mazarron', 'torre-pacheco',
  'san-javier', 'san-pedro-pinatar', 'molina-de-segura', 'aguilas',
  'cieza', 'jumilla', 'yecla',
  'alicante', 'elche', 'torrevieja', 'orihuela', 'rojales', 'benidorm', 'denia'
)
ON CONFLICT (slug, idioma) DO NOTHING;

-- Lo mismo para EN
INSERT INTO landing_pages (
  slug, servicio_slug, servicio_nombre, ciudad_slug, ciudad_nombre, provincia,
  meta_title, meta_description, meta_keywords,
  hero_title, hero_subtitle, hero_bullets,
  problem_title, problems, solution_title, solution_text,
  services_title, services, why_city_title, why_city_text, why_city_stats,
  faqs, cta_title, cta_subtitle,
  idioma, activo, revisado, generado_por_ia
)
SELECT
  'seguro-salud-visa-no-lucrativa-' || c.slug,
  'seguros',
  'Health Insurance',
  c.slug,
  c.nombre,
  c.provincia,
  'Non-Lucrative Visa Insurance in ' || c.nombre || ' | Health4Spain',
  'Health insurance for non-lucrative visa in ' || c.nombre || '. No co-pays, authorised insurers. Free quote in 24h.',
  'non-lucrative visa insurance ' || c.nombre || ', health insurance ' || c.nombre || ' foreigners',
  'Health Insurance for Non-Lucrative Visa in ' || c.nombre,
  'Private health insurance with no co-pays for your non-lucrative visa in ' || c.nombre || '. We compare authorised insurers. Free for you.',
  '[]'::jsonb,
  NULL, '[]'::jsonb, NULL, NULL,
  NULL, '[]'::jsonb, NULL, NULL, '[]'::jsonb,
  '[]'::jsonb,
  'Compare non-lucrative visa insurance in ' || c.nombre,
  'Free quote in 24 hours. No obligation.',
  'en', true, false, false
FROM ciudades_catalogo c
WHERE c.slug IN (
  'murcia', 'cartagena', 'lorca', 'mazarron', 'torre-pacheco',
  'san-javier', 'san-pedro-pinatar', 'molina-de-segura', 'aguilas',
  'cieza', 'jumilla', 'yecla',
  'alicante', 'elche', 'torrevieja', 'orihuela', 'rojales', 'benidorm', 'denia'
)
ON CONFLICT (slug, idioma) DO NOTHING;

-- =============================================
-- VERIFICACIÓN
-- =============================================
SELECT slug, ciudad_nombre, idioma, activo, revisado
FROM landing_pages
WHERE slug LIKE 'seguro-salud-visa-no-lucrativa%'
ORDER BY idioma, slug;
