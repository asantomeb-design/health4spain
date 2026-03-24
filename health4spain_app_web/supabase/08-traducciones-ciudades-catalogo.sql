-- =====================================================
-- MIGRACIÓN 08: Traducciones ciudades_catalogo (en, fr, de, pt)
-- =====================================================
-- Ya existe español (19 filas). Insertamos los otros 4 idiomas.
-- Los nombres de ciudades y provincias NO se traducen (son nombres propios).
-- Solo se traducen: descripcion y perfil_economico.
-- =====================================================

-- =====================================================
-- INGLÉS (en)
-- =====================================================
INSERT INTO ciudades_catalogo_traducciones (ciudad_slug, idioma, descripcion, perfil_economico) VALUES
  ('murcia',            'en', 'Capital of the region, services hub',              'Services, logistics, IT'),
  ('cartagena',         'en', 'Historic port city',                               'Port, industry, energy'),
  ('lorca',             'en', 'Agro-industrial centre',                           'Agro-industry, livestock'),
  ('mazarron',          'en', 'Quiet coastline',                                  'Seasonal tourism, agriculture'),
  ('torre-pacheco',     'en', 'Distribution centre',                              'Agro-industry, logistics'),
  ('san-javier',        'en', 'Living by the Mar Menor',                          'Tourism, services, hospitality'),
  ('san-pedro-pinatar', 'en', 'Quiet and active retreat',                         'Tourism, social-health services'),
  ('molina-de-segura',  'en', 'Stable industrial employment',                     'Agri-food industry, logistics'),
  ('aguilas',           'en', 'Southern coast of Murcia',                         'Tourism, construction'),
  ('cieza',             'en', 'Segura river valley',                              'Agriculture, cereals'),
  ('jumilla',           'en', 'Land of wines',                                    'Viticulture, agriculture'),
  ('yecla',             'en', 'Furniture manufacturing centre',                   'Furniture, ceramics, industry'),
  ('alicante',          'en', 'Capital of the Costa Blanca',                      'Tourism, services, commerce'),
  ('elche',             'en', 'Guaranteed industrial employment',                 'Footwear, textiles, agriculture'),
  ('torrevieja',        'en', 'Your retirement on the Costa Blanca',              'Premium tourism, retirement'),
  ('orihuela',          'en', 'Living in the heart of Bajo Segura',               'Agriculture, tourism, commerce'),
  ('rojales',           'en', 'Quiet retreat with premium services',              'Retirement, residential tourism'),
  ('benidorm',          'en', 'Tourist capital of the Mediterranean',             'Mass tourism'),
  ('denia',             'en', 'Creative gastronomic city',                        'Gastro-tourism, fishing')
ON CONFLICT (ciudad_slug, idioma) DO NOTHING;

-- =====================================================
-- FRANCÉS (fr)
-- =====================================================
INSERT INTO ciudades_catalogo_traducciones (ciudad_slug, idioma, descripcion, perfil_economico) VALUES
  ('murcia',            'fr', 'Capitale de la région, centre de services',        'Services, logistique, IT'),
  ('cartagena',         'fr', 'Ville portuaire historique',                       'Port, industrie, énergie'),
  ('lorca',             'fr', 'Centre agro-industriel',                           'Agro-industrie, élevage'),
  ('mazarron',          'fr', 'Côte tranquille',                                  'Tourisme saisonnier, agriculture'),
  ('torre-pacheco',     'fr', 'Centre de distribution',                           'Agro-industrie, logistique'),
  ('san-javier',        'fr', 'Vivre au bord du Mar Menor',                      'Tourisme, services, hôtellerie'),
  ('san-pedro-pinatar', 'fr', 'Retraite tranquille et active',                   'Tourisme, services socio-sanitaires'),
  ('molina-de-segura',  'fr', 'Emploi industriel stable',                        'Industrie agroalimentaire, logistique'),
  ('aguilas',           'fr', 'Côte sud de Murcie',                              'Tourisme, construction'),
  ('cieza',             'fr', 'Vallée du fleuve Segura',                         'Agriculture, céréales'),
  ('jumilla',           'fr', 'Terre de vins',                                   'Viticulture, agriculture'),
  ('yecla',             'fr', 'Centre du meuble',                                'Meuble, céramique, industrie'),
  ('alicante',          'fr', 'Capitale de la Costa Blanca',                     'Tourisme, services, commerce'),
  ('elche',             'fr', 'Emploi industriel garanti',                       'Chaussure, textile, agriculture'),
  ('torrevieja',        'fr', 'Votre retraite sur la Costa Blanca',              'Tourisme premium, retraite'),
  ('orihuela',          'fr', 'Vivre au cœur du Bajo Segura',                   'Agriculture, tourisme, commerce'),
  ('rojales',           'fr', 'Retraite tranquille avec services premium',       'Retraite, tourisme résidentiel'),
  ('benidorm',          'fr', 'Capitale touristique de la Méditerranée',         'Tourisme de masse'),
  ('denia',             'fr', 'Ville gastronomique créative',                    'Tourisme gastronomique, pêche')
ON CONFLICT (ciudad_slug, idioma) DO NOTHING;

-- =====================================================
-- ALEMÁN (de)
-- =====================================================
INSERT INTO ciudades_catalogo_traducciones (ciudad_slug, idioma, descripcion, perfil_economico) VALUES
  ('murcia',            'de', 'Hauptstadt der Region, Dienstleistungszentrum',    'Dienstleistungen, Logistik, IT'),
  ('cartagena',         'de', 'Historische Hafenstadt',                           'Hafen, Industrie, Energie'),
  ('lorca',             'de', 'Agroindustrielles Zentrum',                        'Agrarindustrie, Viehzucht'),
  ('mazarron',          'de', 'Ruhige Küste',                                    'Saisonaler Tourismus, Landwirtschaft'),
  ('torre-pacheco',     'de', 'Verteilungszentrum',                              'Agrarindustrie, Logistik'),
  ('san-javier',        'de', 'Leben am Mar Menor',                              'Tourismus, Dienstleistungen, Gastgewerbe'),
  ('san-pedro-pinatar', 'de', 'Ruhiger und aktiver Rückzugsort',                'Tourismus, soziale Gesundheitsdienste'),
  ('molina-de-segura',  'de', 'Stabile industrielle Beschäftigung',              'Lebensmittelindustrie, Logistik'),
  ('aguilas',           'de', 'Südküste von Murcia',                             'Tourismus, Bauwesen'),
  ('cieza',             'de', 'Tal des Flusses Segura',                          'Landwirtschaft, Getreide'),
  ('jumilla',           'de', 'Land der Weine',                                  'Weinbau, Landwirtschaft'),
  ('yecla',             'de', 'Möbelzentrum',                                    'Möbel, Keramik, Industrie'),
  ('alicante',          'de', 'Hauptstadt der Costa Blanca',                     'Tourismus, Dienstleistungen, Handel'),
  ('elche',             'de', 'Garantierte industrielle Beschäftigung',          'Schuhe, Textil, Landwirtschaft'),
  ('torrevieja',        'de', 'Ihr Ruhestand an der Costa Blanca',              'Premium-Tourismus, Ruhestand'),
  ('orihuela',          'de', 'Leben im Herzen des Bajo Segura',                'Landwirtschaft, Tourismus, Handel'),
  ('rojales',           'de', 'Ruhiger Rückzugsort mit Premium-Services',       'Ruhestand, Wohntourismus'),
  ('benidorm',          'de', 'Touristische Hauptstadt des Mittelmeers',        'Massentourismus'),
  ('denia',             'de', 'Kreative gastronomische Stadt',                   'Gastronomie-Tourismus, Fischerei')
ON CONFLICT (ciudad_slug, idioma) DO NOTHING;

-- =====================================================
-- PORTUGUÉS (pt)
-- =====================================================
INSERT INTO ciudades_catalogo_traducciones (ciudad_slug, idioma, descripcion, perfil_economico) VALUES
  ('murcia',            'pt', 'Capital da região, centro de serviços',            'Serviços, logística, TI'),
  ('cartagena',         'pt', 'Cidade portuária histórica',                       'Porto, indústria, energia'),
  ('lorca',             'pt', 'Centro agroindustrial',                            'Agroindústria, pecuária'),
  ('mazarron',          'pt', 'Costa tranquila',                                  'Turismo sazonal, agricultura'),
  ('torre-pacheco',     'pt', 'Centro de distribuição',                           'Agroindústria, logística'),
  ('san-javier',        'pt', 'Viver junto ao Mar Menor',                        'Turismo, serviços, hotelaria'),
  ('san-pedro-pinatar', 'pt', 'Retiro tranquilo e ativo',                        'Turismo, serviços sociossanitários'),
  ('molina-de-segura',  'pt', 'Emprego industrial estável',                      'Indústria agroalimentar, logística'),
  ('aguilas',           'pt', 'Costa sul de Múrcia',                             'Turismo, construção'),
  ('cieza',             'pt', 'Vale do rio Segura',                              'Agricultura, cereais'),
  ('jumilla',           'pt', 'Terra de vinhos',                                 'Viticultura, agricultura'),
  ('yecla',             'pt', 'Centro do móvel',                                 'Móveis, cerâmica, indústria'),
  ('alicante',          'pt', 'Capital da Costa Blanca',                         'Turismo, serviços, comércio'),
  ('elche',             'pt', 'Emprego industrial garantido',                    'Calçado, têxtil, agricultura'),
  ('torrevieja',        'pt', 'A sua reforma na Costa Blanca',                   'Turismo premium, reforma'),
  ('orihuela',          'pt', 'Viver no coração do Bajo Segura',                'Agricultura, turismo, comércio'),
  ('rojales',           'pt', 'Retiro tranquilo com serviços premium',           'Reforma, turismo residencial'),
  ('benidorm',          'pt', 'Capital turística do Mediterrâneo',               'Turismo de massa'),
  ('denia',             'pt', 'Cidade gastronómica criativa',                    'Turismo gastronómico, pesca')
ON CONFLICT (ciudad_slug, idioma) DO NOTHING;

-- =====================================================
-- VERIFICACIÓN
-- =====================================================
SELECT idioma, COUNT(*) AS total
FROM ciudades_catalogo_traducciones
GROUP BY idioma
ORDER BY idioma;
