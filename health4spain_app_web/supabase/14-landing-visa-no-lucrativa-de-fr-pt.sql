-- =============================================
-- LANDING MADRE + 19 CIUDADES: Visa No Lucrativa
-- Idiomas: DE, FR, PT (complementa el SQL 13 que ya insertó ES + EN)
-- =============================================

-- =============================================
-- LANDING MADRE: DEUTSCH (de)
-- =============================================
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
  'Krankenversicherung',
  'espana',
  'Spanien',
  NULL,
  'Krankenversicherung Visum ohne Erwerbstätigkeit | Health4Spain',
  'Private Krankenversicherung für Ihr Visum ohne Erwerbstätigkeit in Spanien. Pflichtversicherung. Wir vergleichen ASISA, Caser u.a. Antwort in 24h. Kostenlos.',
  'krankenversicherung visum ohne erwerbstätigkeit spanien, private krankenversicherung spanien visum, pflichtversicherung aufenthalt spanien',
  'Krankenversicherung für Visum ohne Erwerbstätigkeit in Spanien',
  'Wenn Sie mit einem Visum ohne Erwerbstätigkeit oder einer Aufenthaltserlaubnis in Spanien leben möchten, benötigen Sie eine private Krankenversicherung, die den Anforderungen des spanischen Konsulats entspricht. Diese Versicherung muss eine vollständige Deckung bieten, ohne Selbstbeteiligung und ohne Kapitallimit. Bei Health4Spain verbinden wir Sie in weniger als 24 Stunden kostenlos mit dem richtigen Fachmann.',
  '["Vollständige Deckung ohne Selbstbeteiligung", "Von allen spanischen Konsulaten akzeptiert", "Wir vergleichen ASISA, Caser und weitere", "Antwort in weniger als 24 Stunden"]'::jsonb,
  'Warum brauchen Sie eine Krankenversicherung für das Visum ohne Erwerbstätigkeit?',
  '["Das spanische Recht verlangt eine gültige private Krankenversicherung für die gesamte Aufenthaltsdauer", "Das Konsulat überprüft diese Anforderung bei der Antragstellung — ohne Versicherung wird das Visum verweigert", "Die Versicherung muss das gesamte spanische Staatsgebiet abdecken, ohne Selbstbeteiligung", "Sie muss Krankenhausaufenthalt, Notfälle, Konsultationen und Operationen umfassen", "Sie muss von einer in Spanien zugelassenen Versicherungsgesellschaft ausgestellt sein"]'::jsonb,
  'Wie wir Ihnen helfen',
  'Wir sind keine Versicherungsgesellschaft. Wir sind die Brücke zwischen Ihnen und den besten Fachleuten der Branche. Wenn Sie uns kontaktieren, analysiert ein auf Expats spezialisierter Berater Ihr Profil (Alter, Wohnort, Visumdauer, Krankengeschichte) und präsentiert Ihnen die besten Optionen von Unternehmen wie ASISA, Caser oder anderen zugelassenen Versicherern. Sie entscheiden. Wir berechnen nichts.',
  'Versicherungsanforderungen für das Visum ohne Erwerbstätigkeit',
  '[{"icon": "🏥", "title": "Deckung in ganz Spanien", "description": "Die Versicherung muss in allen autonomen Gemeinschaften ohne geografische Einschränkungen gültig sein"},{"icon": "💶", "title": "Keine Selbstbeteiligung", "description": "Der Zugang zur medizinischen Versorgung darf keine zusätzlichen Kosten für den Versicherten haben"},{"icon": "🏨", "title": "Krankenhausaufenthalt und Chirurgie", "description": "Vollständige Deckung für Krankenhausaufenthalt, chirurgische Eingriffe und Notfälle"},{"icon": "📋", "title": "Vollständige Gültigkeit", "description": "Die Versicherung muss während des gesamten beantragten Aufenthaltszeitraums gültig sein"},{"icon": "✅", "title": "Zugelassener Versicherer in Spanien", "description": "Muss von einem in Spanien zugelassenen Unternehmen ausgestellt sein"}]'::jsonb,
  NULL, NULL, '[]'::jsonb,
  '[{"question": "Was kostet eine Krankenversicherung für das Visum ohne Erwerbstätigkeit in Spanien?", "answer": "Die Kosten variieren je nach Alter, gewähltem Unternehmen und Deckung. Orientierend liegt der übliche Bereich für einen 50-jährigen Erwachsenen bei 60 bis 130 Euro pro Monat. Wir erstellen Ihnen ein unverbindliches Angebot in weniger als 24 Stunden."},{"question": "Kann ich eine Versicherung ohne NIE abschließen?", "answer": "Ja. Mehrere Versicherer ermöglichen den Abschluss mit Reisepass, während die NIE beantragt wird. Wir kümmern uns darum."},{"question": "Werden Vorerkrankungen abgedeckt?", "answer": "Das hängt vom Unternehmen und der Policenart ab. Es gibt spezielle Optionen für Personen mit Vorerkrankungen. Wir beraten Sie nach Ihrem Fall."},{"question": "Deckt die Versicherung die Rückführung in mein Heimatland ab?", "answer": "Ja, die meisten Policen beinhalten Rückführungsdeckung und medizinischen Transport in Ihr Heimatland bei Bedarf."}]'::jsonb,
  'Fordern Sie Ihr kostenloses Angebot an',
  'Wir verbinden Sie mit einem Berater, der auf Versicherungen für Visa ohne Erwerbstätigkeit spezialisiert ist. Kostenlos, unverbindlich. Antwort in 24 Stunden.',
  'de', true, true, false
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
-- LANDING MADRE: FRANÇAIS (fr)
-- =============================================
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
  'Assurance Santé',
  'espana',
  'Espagne',
  NULL,
  'Assurance Santé Visa Non Lucratif Espagne | Health4Spain',
  'Assurance santé privée pour votre visa non lucratif en Espagne. Couverture obligatoire. Nous comparons ASISA, Caser et plus. Réponse en 24h. Gratuit.',
  'assurance santé visa non lucratif espagne, assurance médicale espagne visa, assurance privée résidence espagne',
  'Assurance Santé pour Visa Non Lucratif en Espagne',
  'Si vous souhaitez vivre en Espagne avec un visa non lucratif ou un permis de résidence, vous avez besoin d''une assurance santé privée conforme aux exigences du Consulat espagnol. Cette assurance doit offrir une couverture complète, sans franchise et sans plafond de capital. Chez Health4Spain, nous vous mettons en contact avec le bon professionnel en moins de 24 heures, sans frais pour vous.',
  '["Couverture complète sans franchise", "Acceptée par tous les consulats espagnols", "Nous comparons ASISA, Caser et plus", "Réponse en moins de 24 heures"]'::jsonb,
  'Pourquoi avez-vous besoin d''une assurance santé pour le visa non lucratif ?',
  '["La loi espagnole exige une assurance médicale privée valide pendant toute la durée du séjour", "Le Consulat vérifie cette exigence lors de la demande — sans assurance, le visa est refusé", "L''assurance doit couvrir tout le territoire espagnol, sans franchise ni copaiement", "Elle doit inclure l''hospitalisation, les urgences, les consultations et la chirurgie", "Elle doit être émise par une compagnie d''assurance autorisée en Espagne"]'::jsonb,
  'Comment nous vous aidons',
  'Nous ne sommes pas une compagnie d''assurance. Nous sommes le pont entre vous et les meilleurs professionnels du secteur. Lorsque vous nous contactez, un conseiller spécialisé dans les expatriés analyse votre profil (âge, ville de résidence, durée du visa, antécédents médicaux) et vous présente les options les plus adaptées de compagnies comme ASISA, Caser ou d''autres assureurs autorisés. Vous décidez. Nous ne facturons rien.',
  'Exigences d''assurance pour le visa non lucratif',
  '[{"icon": "🏥", "title": "Couverture sur tout le territoire espagnol", "description": "L''assurance doit être valide dans toutes les communautés autonomes sans restrictions géographiques"},{"icon": "💶", "title": "Sans franchise ni copaiement", "description": "L''accès aux soins médicaux ne peut pas avoir de coûts supplémentaires pour l''assuré"},{"icon": "🏨", "title": "Hospitalisation et chirurgie", "description": "Couverture complète pour l''hospitalisation, les interventions chirurgicales et les urgences"},{"icon": "📋", "title": "Validité complète", "description": "L''assurance doit rester valide pendant toute la période de résidence demandée"},{"icon": "✅", "title": "Assureur autorisé en Espagne", "description": "Doit être émise par une compagnie autorisée à opérer en territoire espagnol"}]'::jsonb,
  NULL, NULL, '[]'::jsonb,
  '[{"question": "Combien coûte une assurance santé pour le visa non lucratif en Espagne ?", "answer": "Le coût varie selon l''âge de l''assuré, la compagnie choisie et la couverture. À titre indicatif, pour un adulte de 50 ans, la fourchette habituelle est de 60 à 130 euros par mois. Nous vous fournissons un devis personnalisé sans engagement en moins de 24 heures."},{"question": "Puis-je souscrire une assurance sans NIE ?", "answer": "Oui. Plusieurs assureurs permettent de souscrire avec un passeport pendant que le NIE est en cours de traitement. Nous nous en occupons pour vous."},{"question": "Les conditions préexistantes sont-elles couvertes ?", "answer": "Cela dépend de la compagnie et du type de police. Il existe des options spécifiques pour les personnes ayant des conditions préexistantes. Nous vous conseillons selon votre cas."},{"question": "L''assurance couvre-t-elle le rapatriement dans mon pays d''origine ?", "answer": "Oui, la plupart des polices incluent la couverture de rapatriement et le transfert médical vers votre pays d''origine en cas de nécessité."}]'::jsonb,
  'Demandez votre devis gratuit',
  'Nous vous mettons en contact avec un conseiller spécialisé en assurance pour visa non lucratif. Sans frais, sans engagement. Réponse en 24 heures.',
  'fr', true, true, false
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
-- LANDING MADRE: PORTUGUÊS (pt)
-- =============================================
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
  'Seguro de Saúde',
  'espana',
  'Espanha',
  NULL,
  'Seguro de Saúde Visto Não Lucrativo Espanha | Health4Spain',
  'Seguro de saúde privado para o seu visto não lucrativo em Espanha. Cobertura obrigatória. Comparamos ASISA, Caser e mais. Resposta em 24h. Gratuito.',
  'seguro saúde visto não lucrativo espanha, seguro médico espanha visto, seguro privado residência espanha',
  'Seguro de Saúde para Visto Não Lucrativo em Espanha',
  'Se deseja viver em Espanha com um visto não lucrativo ou uma autorização de residência, precisa de um seguro de saúde privado que cumpra os requisitos exigidos pelo Consulado espanhol. Este seguro deve ter cobertura completa, sem copagamentos e sem limite de capital segurado. Na Health4Spain conectamo-lo com o profissional adequado em menos de 24 horas, sem custos para si.',
  '["Cobertura completa sem copagamentos", "Aceite por todos os consulados espanhóis", "Comparamos ASISA, Caser e mais seguradoras", "Resposta em menos de 24 horas"]'::jsonb,
  'Porque precisa de um seguro de saúde para o visto não lucrativo?',
  '["A lei espanhola exige um seguro médico privado válido durante todo o período de estadia", "O Consulado verifica este requisito no momento da candidatura — sem seguro, o visto é recusado", "O seguro deve cobrir todo o território espanhol, sem copagamentos nem franquias", "Deve incluir hospitalização, urgências, consultas e cirurgia", "Deve ser emitido por uma companhia de seguros autorizada em Espanha"]'::jsonb,
  'Como o ajudamos',
  'Não somos uma companhia de seguros. Somos a ponte entre si e os melhores profissionais do setor. Quando nos contacta, um consultor especializado em expatriados analisa o seu perfil (idade, cidade de residência, duração do visto, historial médico) e apresenta-lhe as opções mais adequadas de companhias como ASISA, Caser ou outras autorizadas. Você decide. Nós não cobramos nada.',
  'Requisitos do seguro para visto não lucrativo',
  '[{"icon": "🏥", "title": "Cobertura em todo o território espanhol", "description": "O seguro deve ser válido em todas as comunidades autónomas sem restrições geográficas"},{"icon": "💶", "title": "Sem copagamentos nem franquias", "description": "O acesso aos cuidados médicos não pode ter custos adicionais para o segurado"},{"icon": "🏨", "title": "Hospitalização e cirurgia", "description": "Cobertura completa de hospitalização, intervenções cirúrgicas e urgências"},{"icon": "📋", "title": "Validade completa", "description": "O seguro deve estar vigente durante todo o período de residência solicitado"},{"icon": "✅", "title": "Seguradora autorizada em Espanha", "description": "Deve ser emitido por uma companhia com licença para operar em território espanhol"}]'::jsonb,
  NULL, NULL, '[]'::jsonb,
  '[{"question": "Quanto custa um seguro de saúde para o visto não lucrativo em Espanha?", "answer": "O custo varia conforme a idade do segurado, a companhia escolhida e a cobertura. Como orientação, para um adulto de 50 anos, a faixa habitual é de 60 a 130 euros por mês. Damos-lhe um orçamento personalizado sem compromisso em menos de 24 horas."},{"question": "Posso contratar o seguro sem ter o NIE?", "answer": "Sim. Várias seguradoras permitem contratar com passaporte enquanto o NIE está a ser tramitado. Tratamos disso por si."},{"question": "Cobre condições pré-existentes?", "answer": "Depende da companhia e do tipo de apólice. Existem opções específicas para pessoas com condições prévias. Aconselhamo-lo conforme o seu caso."},{"question": "O seguro cobre repatriação para o meu país de origem?", "answer": "Sim, a maioria das apólices inclui cobertura de repatriação e transferência médica para o seu país de origem em caso de necessidade."}]'::jsonb,
  'Solicite o seu orçamento gratuito',
  'Conectamo-lo com um consultor especializado em seguros para visto não lucrativo. Sem custos, sem compromisso. Resposta em 24 horas.',
  'pt', true, true, false
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
-- LANDING × CIUDAD: 19 ciudades × DE
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
  'Krankenversicherung',
  c.slug,
  c.nombre,
  c.provincia,
  'Visum-Krankenversicherung ' || c.nombre || ' | Health4Spain',
  'Krankenversicherung für Visum ohne Erwerbstätigkeit in ' || c.nombre || '. Ohne Selbstbeteiligung, zugelassene Versicherer. Kostenloses Angebot in 24h.',
  'visum ohne erwerbstätigkeit versicherung ' || c.nombre || ', krankenversicherung ' || c.nombre || ' ausländer',
  'Krankenversicherung für Visum ohne Erwerbstätigkeit in ' || c.nombre,
  'Private Krankenversicherung ohne Selbstbeteiligung für Ihr Visum ohne Erwerbstätigkeit in ' || c.nombre || '. Wir vergleichen zugelassene Versicherer. Kostenlos für Sie.',
  '[]'::jsonb,
  NULL, '[]'::jsonb, NULL, NULL,
  NULL, '[]'::jsonb, NULL, NULL, '[]'::jsonb,
  '[]'::jsonb,
  'Versicherungen für Visum ohne Erwerbstätigkeit in ' || c.nombre || ' vergleichen',
  'Kostenloses Angebot in 24 Stunden. Unverbindlich.',
  'de', true, false, false
FROM ciudades_catalogo c
WHERE c.slug IN (
  'murcia', 'cartagena', 'lorca', 'mazarron', 'torre-pacheco',
  'san-javier', 'san-pedro-pinatar', 'molina-de-segura', 'aguilas',
  'cieza', 'jumilla', 'yecla',
  'alicante', 'elche', 'torrevieja', 'orihuela', 'rojales', 'benidorm', 'denia'
)
ON CONFLICT (slug, idioma) DO NOTHING;

-- =============================================
-- LANDING × CIUDAD: 19 ciudades × FR
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
  'Assurance Santé',
  c.slug,
  c.nombre,
  c.provincia,
  'Assurance Visa Non Lucratif ' || c.nombre || ' | Health4Spain',
  'Assurance santé pour visa non lucratif à ' || c.nombre || '. Sans franchise, assureurs autorisés. Devis gratuit en 24h.',
  'assurance visa non lucratif ' || c.nombre || ', assurance santé ' || c.nombre || ' étrangers',
  'Assurance Santé pour Visa Non Lucratif à ' || c.nombre,
  'Assurance santé privée sans franchise pour votre visa non lucratif à ' || c.nombre || '. Nous comparons les assureurs autorisés. Gratuit pour vous.',
  '[]'::jsonb,
  NULL, '[]'::jsonb, NULL, NULL,
  NULL, '[]'::jsonb, NULL, NULL, '[]'::jsonb,
  '[]'::jsonb,
  'Comparer les assurances visa non lucratif à ' || c.nombre,
  'Devis gratuit en 24 heures. Sans engagement.',
  'fr', true, false, false
FROM ciudades_catalogo c
WHERE c.slug IN (
  'murcia', 'cartagena', 'lorca', 'mazarron', 'torre-pacheco',
  'san-javier', 'san-pedro-pinatar', 'molina-de-segura', 'aguilas',
  'cieza', 'jumilla', 'yecla',
  'alicante', 'elche', 'torrevieja', 'orihuela', 'rojales', 'benidorm', 'denia'
)
ON CONFLICT (slug, idioma) DO NOTHING;

-- =============================================
-- LANDING × CIUDAD: 19 ciudades × PT
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
  'Seguro de Saúde',
  c.slug,
  c.nombre,
  c.provincia,
  'Seguro Visto Não Lucrativo ' || c.nombre || ' | Health4Spain',
  'Seguro de saúde para visto não lucrativo em ' || c.nombre || '. Sem copagamentos, seguradoras autorizadas. Orçamento grátis em 24h.',
  'seguro visto não lucrativo ' || c.nombre || ', seguro saúde ' || c.nombre || ' estrangeiros',
  'Seguro de Saúde para Visto Não Lucrativo em ' || c.nombre,
  'Seguro de saúde privado sem copagamentos para o seu visto não lucrativo em ' || c.nombre || '. Comparamos seguradoras autorizadas. Sem custos para si.',
  '[]'::jsonb,
  NULL, '[]'::jsonb, NULL, NULL,
  NULL, '[]'::jsonb, NULL, NULL, '[]'::jsonb,
  '[]'::jsonb,
  'Comparar seguros para visto não lucrativo em ' || c.nombre,
  'Orçamento gratuito em 24 horas. Sem compromisso.',
  'pt', true, false, false
FROM ciudades_catalogo c
WHERE c.slug IN (
  'murcia', 'cartagena', 'lorca', 'mazarron', 'torre-pacheco',
  'san-javier', 'san-pedro-pinatar', 'molina-de-segura', 'aguilas',
  'cieza', 'jumilla', 'yecla',
  'alicante', 'elche', 'torrevieja', 'orihuela', 'rojales', 'benidorm', 'denia'
)
ON CONFLICT (slug, idioma) DO NOTHING;

-- =============================================
-- VERIFICACIÓN COMPLETA (5 idiomas)
-- =============================================
SELECT idioma, COUNT(*) as total
FROM landing_pages
WHERE slug LIKE 'seguro-salud-visa-no-lucrativa%'
GROUP BY idioma
ORDER BY idioma;
