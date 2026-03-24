-- =====================================================
-- MIGRACIÓN 07: Estructura COMPLETA multi-idioma
-- =====================================================
-- Idiomas soportados: es, en, fr, de, pt
--
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. TABLA DE IDIOMAS SOPORTADOS (referencia central)
-- =====================================================
CREATE TABLE IF NOT EXISTS idiomas (
  codigo VARCHAR(5) PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  nombre_nativo VARCHAR(50) NOT NULL,
  activo BOOLEAN DEFAULT true,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO idiomas (codigo, nombre, nombre_nativo, activo, orden) VALUES
  ('es', 'Español',    'Español',    true, 1),
  ('en', 'Inglés',     'English',    true, 2),
  ('fr', 'Francés',    'Français',   true, 3),
  ('de', 'Alemán',     'Deutsch',    true, 4),
  ('pt', 'Portugués',  'Português',  true, 5)
ON CONFLICT (codigo) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  nombre_nativo = EXCLUDED.nombre_nativo,
  activo = EXCLUDED.activo,
  orden = EXCLUDED.orden;

-- RLS: lectura pública
ALTER TABLE idiomas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Idiomas lectura publica" ON idiomas;
CREATE POLICY "Idiomas lectura publica" ON idiomas FOR SELECT USING (true);
DROP POLICY IF EXISTS "Idiomas admin" ON idiomas;
CREATE POLICY "Idiomas admin" ON idiomas FOR ALL USING (auth.role() = 'service_role');


-- =====================================================
-- 2. SERVICIOS_CATALOGO → Tabla de traducciones
-- =====================================================
-- servicios_catalogo tiene: slug, nombre, nombre_plural, icon, descripcion_corta, keywords
-- Los slugs son universales, pero nombre/descripcion deben traducirse

CREATE TABLE IF NOT EXISTS servicios_catalogo_traducciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  servicio_slug VARCHAR(50) NOT NULL REFERENCES servicios_catalogo(slug) ON DELETE CASCADE,
  idioma VARCHAR(5) NOT NULL REFERENCES idiomas(codigo),
  nombre VARCHAR(100) NOT NULL,
  nombre_plural VARCHAR(100),
  descripcion_corta TEXT,
  keywords TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_servicio_idioma UNIQUE (servicio_slug, idioma)
);

CREATE INDEX IF NOT EXISTS idx_serv_trad_slug ON servicios_catalogo_traducciones(servicio_slug);
CREATE INDEX IF NOT EXISTS idx_serv_trad_idioma ON servicios_catalogo_traducciones(idioma);

-- RLS
ALTER TABLE servicios_catalogo_traducciones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Servicios trad lectura publica" ON servicios_catalogo_traducciones;
CREATE POLICY "Servicios trad lectura publica" ON servicios_catalogo_traducciones FOR SELECT USING (true);
DROP POLICY IF EXISTS "Servicios trad admin" ON servicios_catalogo_traducciones;
CREATE POLICY "Servicios trad admin" ON servicios_catalogo_traducciones FOR ALL USING (auth.role() = 'service_role');

-- Copiar datos actuales de servicios_catalogo como traducciones en español
INSERT INTO servicios_catalogo_traducciones (servicio_slug, idioma, nombre, nombre_plural, descripcion_corta, keywords)
SELECT slug, 'es', nombre, nombre_plural, descripcion_corta, keywords
FROM servicios_catalogo
ON CONFLICT (servicio_slug, idioma) DO NOTHING;

-- Insertar traducciones EN INGLÉS
INSERT INTO servicios_catalogo_traducciones (servicio_slug, idioma, nombre, nombre_plural, descripcion_corta, keywords) VALUES
  ('seguros',       'en', 'Health Insurance',   'Health Insurance',   'Private health insurance for foreigners',                   ARRAY['health insurance', 'medical insurance', 'coverage', 'policy']),
  ('abogados',      'en', 'Lawyer',             'Lawyers',            'Family, civil, labor, immigration law and more',            ARRAY['lawyer', 'attorney', 'family law', 'immigration', 'visa', 'nie']),
  ('inmobiliarias', 'en', 'Real Estate',        'Real Estate',        'Buying, selling and renting properties',                    ARRAY['real estate', 'buy house', 'rent apartment', 'property']),
  ('gestorias',     'en', 'Administrative Agency','Administrative Agencies','Tax, administrative and labor procedures',             ARRAY['tax advisor', 'accountant', 'taxes', 'procedures', 'freelancer'])
ON CONFLICT (servicio_slug, idioma) DO NOTHING;

-- Insertar traducciones EN FRANCÉS
INSERT INTO servicios_catalogo_traducciones (servicio_slug, idioma, nombre, nombre_plural, descripcion_corta, keywords) VALUES
  ('seguros',       'fr', 'Assurance Santé',       'Assurances Santé',       'Assurances médicales privées pour étrangers',              ARRAY['assurance santé', 'assurance médicale', 'couverture', 'police']),
  ('abogados',      'fr', 'Avocat',                'Avocats',                'Famille, civil, travail, immigration et plus',              ARRAY['avocat', 'famille', 'civil', 'travail', 'immigration', 'visa', 'nie']),
  ('inmobiliarias', 'fr', 'Immobilier',            'Agences Immobilières',   'Achat, vente et location de propriétés',                   ARRAY['immobilier', 'acheter maison', 'louer appartement', 'propriété']),
  ('gestorias',     'fr', 'Cabinet de Gestion',    'Cabinets de Gestion',    'Démarches administratives, fiscales et sociales',           ARRAY['gestionnaire', 'comptable', 'impôts', 'démarches', 'auto-entrepreneur'])
ON CONFLICT (servicio_slug, idioma) DO NOTHING;

-- Insertar traducciones EN ALEMÁN
INSERT INTO servicios_catalogo_traducciones (servicio_slug, idioma, nombre, nombre_plural, descripcion_corta, keywords) VALUES
  ('seguros',       'de', 'Krankenversicherung',   'Krankenversicherungen',  'Private Krankenversicherung für Ausländer',                ARRAY['Krankenversicherung', 'Versicherung', 'Deckung', 'Police']),
  ('abogados',      'de', 'Anwalt',                'Anwälte',                'Familien-, Zivil-, Arbeits- und Ausländerrecht',            ARRAY['Anwalt', 'Rechtsanwalt', 'Familie', 'Zivil', 'Arbeit', 'Einwanderung', 'Visum', 'NIE']),
  ('inmobiliarias', 'de', 'Immobilien',            'Immobilien',             'Kauf, Verkauf und Vermietung von Immobilien',              ARRAY['Immobilien', 'Haus kaufen', 'Wohnung mieten', 'Eigentum']),
  ('gestorias',     'de', 'Steuerbüro',            'Steuerbüros',            'Steuerliche, administrative und arbeitsrechtliche Verfahren', ARRAY['Steuerbüro', 'Steuerberater', 'Steuern', 'Verfahren', 'Selbstständig'])
ON CONFLICT (servicio_slug, idioma) DO NOTHING;

-- Insertar traducciones EN PORTUGUÉS
INSERT INTO servicios_catalogo_traducciones (servicio_slug, idioma, nombre, nombre_plural, descripcion_corta, keywords) VALUES
  ('seguros',       'pt', 'Seguro de Saúde',      'Seguros de Saúde',       'Seguros médicos privados para estrangeiros',               ARRAY['seguro saúde', 'seguro médico', 'cobertura', 'apólice']),
  ('abogados',      'pt', 'Advogado',              'Advogados',              'Família, civil, trabalho, imigração e mais',               ARRAY['advogado', 'família', 'civil', 'trabalho', 'imigração', 'visto', 'nie']),
  ('inmobiliarias', 'pt', 'Imobiliária',           'Imobiliárias',           'Compra, venda e aluguer de propriedades',                  ARRAY['imobiliária', 'comprar casa', 'alugar apartamento', 'propriedade']),
  ('gestorias',     'pt', 'Assessoria',            'Assessorias',            'Trâmites administrativos, fiscais e laborais',             ARRAY['assessoria', 'contabilista', 'impostos', 'trâmites', 'autônomo'])
ON CONFLICT (servicio_slug, idioma) DO NOTHING;


-- =====================================================
-- 3. CIUDADES_CATALOGO → Tabla de traducciones
-- =====================================================
-- Los slugs/datos geográficos son universales, pero
-- datos_extra.descripcion y datos_extra.perfil_economico deben traducirse

CREATE TABLE IF NOT EXISTS ciudades_catalogo_traducciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ciudad_slug VARCHAR(50) NOT NULL REFERENCES ciudades_catalogo(slug) ON DELETE CASCADE,
  idioma VARCHAR(5) NOT NULL REFERENCES idiomas(codigo),
  descripcion TEXT,
  perfil_economico TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_ciudad_cat_idioma UNIQUE (ciudad_slug, idioma)
);

CREATE INDEX IF NOT EXISTS idx_ciudad_trad_slug ON ciudades_catalogo_traducciones(ciudad_slug);
CREATE INDEX IF NOT EXISTS idx_ciudad_trad_idioma ON ciudades_catalogo_traducciones(idioma);

-- RLS
ALTER TABLE ciudades_catalogo_traducciones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Ciudades trad lectura publica" ON ciudades_catalogo_traducciones;
CREATE POLICY "Ciudades trad lectura publica" ON ciudades_catalogo_traducciones FOR SELECT USING (true);
DROP POLICY IF EXISTS "Ciudades trad admin" ON ciudades_catalogo_traducciones;
CREATE POLICY "Ciudades trad admin" ON ciudades_catalogo_traducciones FOR ALL USING (auth.role() = 'service_role');

-- Copiar datos actuales del JSON de ciudades_catalogo como traducciones en español
INSERT INTO ciudades_catalogo_traducciones (ciudad_slug, idioma, descripcion, perfil_economico)
SELECT slug, 'es', datos_extra->>'descripcion', datos_extra->>'perfil_economico'
FROM ciudades_catalogo
WHERE datos_extra IS NOT NULL
ON CONFLICT (ciudad_slug, idioma) DO NOTHING;


-- =====================================================
-- 4. LANDING_PAGES: verificar constraint (ya hecho en 06)
-- =====================================================
-- El constraint UNIQUE(slug, idioma) ya debería existir.
-- Lo recreamos por si acaso (idempotente).
ALTER TABLE landing_pages DROP CONSTRAINT IF EXISTS landing_pages_slug_key;
ALTER TABLE landing_pages DROP CONSTRAINT IF EXISTS landing_pages_slug_idioma_key;
ALTER TABLE landing_pages ADD CONSTRAINT landing_pages_slug_idioma_key UNIQUE (slug, idioma);


-- =====================================================
-- 5. BLOG_POSTS: ya tiene UNIQUE(slug, lang) ✓
-- =====================================================
-- No requiere cambios de constraint.
-- Verificamos que el default está correcto.
ALTER TABLE blog_posts ALTER COLUMN lang SET DEFAULT 'es';


-- =====================================================
-- 6. CIUDADES_CONTENIDO: verificar constraint (ya hecho en 06)
-- =====================================================
ALTER TABLE ciudades_contenido DROP CONSTRAINT IF EXISTS ciudades_contenido_ciudad_slug_key;
ALTER TABLE ciudades_contenido DROP CONSTRAINT IF EXISTS ciudades_contenido_slug_idioma_key;
ALTER TABLE ciudades_contenido ADD CONSTRAINT ciudades_contenido_slug_idioma_key UNIQUE (ciudad_slug, idioma);


-- =====================================================
-- 7. LEADS: verificar columna idioma_preferido
-- =====================================================
-- Ya existe con VARCHAR(2) DEFAULT 'es'. Ampliamos a VARCHAR(5) por coherencia.
ALTER TABLE leads ALTER COLUMN idioma_preferido TYPE VARCHAR(5);


-- =====================================================
-- 8. VISTA AUXILIAR: Estado de traducciones
-- =====================================================
-- Vista que muestra cuánto contenido hay por idioma en cada tabla.
-- Útil para el panel de administración.

DROP VIEW IF EXISTS v_estado_traducciones;
CREATE VIEW v_estado_traducciones AS

-- Landing pages por idioma
SELECT 
  'landing_pages' AS tabla,
  idioma,
  COUNT(*) AS total_filas,
  COUNT(*) FILTER (WHERE activo = true) AS activas
FROM landing_pages
GROUP BY idioma

UNION ALL

-- Blog posts por idioma
SELECT 
  'blog_posts' AS tabla,
  lang AS idioma,
  COUNT(*) AS total_filas,
  COUNT(*) FILTER (WHERE status = 'published') AS activas
FROM blog_posts
GROUP BY lang

UNION ALL

-- Ciudades contenido por idioma
SELECT 
  'ciudades_contenido' AS tabla,
  idioma,
  COUNT(*) AS total_filas,
  COUNT(*) FILTER (WHERE activo = true) AS activas
FROM ciudades_contenido
GROUP BY idioma

UNION ALL

-- Servicios traducciones
SELECT 
  'servicios_catalogo_traducciones' AS tabla,
  idioma,
  COUNT(*) AS total_filas,
  COUNT(*) AS activas
FROM servicios_catalogo_traducciones
GROUP BY idioma

UNION ALL

-- Ciudades catálogo traducciones
SELECT 
  'ciudades_catalogo_traducciones' AS tabla,
  idioma,
  COUNT(*) AS total_filas,
  COUNT(*) AS activas
FROM ciudades_catalogo_traducciones
GROUP BY idioma

ORDER BY tabla, idioma;

-- Permisos para la vista
GRANT SELECT ON v_estado_traducciones TO anon, authenticated;


-- =====================================================
-- 9. FUNCIÓN: Obtener servicio traducido
-- =====================================================
CREATE OR REPLACE FUNCTION get_servicio_traducido(p_slug VARCHAR, p_idioma VARCHAR DEFAULT 'es')
RETURNS TABLE(
  slug VARCHAR,
  nombre VARCHAR,
  nombre_plural VARCHAR,
  icon VARCHAR,
  descripcion_corta TEXT,
  keywords TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    sc.slug,
    COALESCE(t.nombre, sc.nombre) AS nombre,
    COALESCE(t.nombre_plural, sc.nombre_plural) AS nombre_plural,
    sc.icon,
    COALESCE(t.descripcion_corta, sc.descripcion_corta) AS descripcion_corta,
    COALESCE(t.keywords, sc.keywords) AS keywords
  FROM servicios_catalogo sc
  LEFT JOIN servicios_catalogo_traducciones t
    ON t.servicio_slug = sc.slug AND t.idioma = p_idioma
  WHERE sc.slug = p_slug;
END;
$$ LANGUAGE plpgsql STABLE;


-- =====================================================
-- 10. FUNCIÓN: Obtener todos los servicios traducidos
-- =====================================================
CREATE OR REPLACE FUNCTION get_servicios_traducidos(p_idioma VARCHAR DEFAULT 'es')
RETURNS TABLE(
  slug VARCHAR,
  nombre VARCHAR,
  nombre_plural VARCHAR,
  icon VARCHAR,
  descripcion_corta TEXT,
  keywords TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    sc.slug,
    COALESCE(t.nombre, sc.nombre) AS nombre,
    COALESCE(t.nombre_plural, sc.nombre_plural) AS nombre_plural,
    sc.icon,
    COALESCE(t.descripcion_corta, sc.descripcion_corta) AS descripcion_corta,
    COALESCE(t.keywords, sc.keywords) AS keywords
  FROM servicios_catalogo sc
  LEFT JOIN servicios_catalogo_traducciones t
    ON t.servicio_slug = sc.slug AND t.idioma = p_idioma
  ORDER BY sc.slug;
END;
$$ LANGUAGE plpgsql STABLE;


-- =====================================================
-- 11. FUNCIÓN: Obtener ciudad con traducción
-- =====================================================
CREATE OR REPLACE FUNCTION get_ciudad_traducida(p_slug VARCHAR, p_idioma VARCHAR DEFAULT 'es')
RETURNS TABLE(
  slug VARCHAR,
  nombre VARCHAR,
  provincia VARCHAR,
  comunidad VARCHAR,
  poblacion INTEGER,
  porcentaje_extranjeros DECIMAL,
  destacada BOOLEAN,
  descripcion TEXT,
  perfil_economico TEXT,
  datos_extra JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    cc.slug,
    cc.nombre,
    cc.provincia,
    cc.comunidad,
    cc.poblacion,
    cc.porcentaje_extranjeros,
    cc.destacada,
    COALESCE(t.descripcion, cc.datos_extra->>'descripcion') AS descripcion,
    COALESCE(t.perfil_economico, cc.datos_extra->>'perfil_economico') AS perfil_economico,
    cc.datos_extra
  FROM ciudades_catalogo cc
  LEFT JOIN ciudades_catalogo_traducciones t
    ON t.ciudad_slug = cc.slug AND t.idioma = p_idioma
  WHERE cc.slug = p_slug;
END;
$$ LANGUAGE plpgsql STABLE;


-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================
-- Ejecuta esto para comprobar que todo está correcto:

SELECT '--- TABLAS CREADAS ---' AS info;
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('idiomas', 'servicios_catalogo_traducciones', 'ciudades_catalogo_traducciones')
ORDER BY tablename;

SELECT '--- CONSTRAINTS MULTI-IDIOMA ---' AS info;
SELECT conname, conrelid::regclass AS tabla
FROM pg_constraint
WHERE conname IN (
  'landing_pages_slug_idioma_key',
  'ciudades_contenido_slug_idioma_key',
  'unique_slug_lang',
  'unique_servicio_idioma',
  'unique_ciudad_cat_idioma'
);

SELECT '--- ESTADO DE TRADUCCIONES ---' AS info;
SELECT * FROM v_estado_traducciones;

SELECT '--- FUNCIONES CREADAS ---' AS info;
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name LIKE 'get_%_traduc%';
