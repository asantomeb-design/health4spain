-- ============================================
-- TABLA: landing_pages
-- Contenido SEO para páginas servicio×ciudad
-- ============================================

CREATE TABLE IF NOT EXISTS landing_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Identificadores (slug único: "abogados-mazarron")
  slug VARCHAR(100) UNIQUE NOT NULL,
  servicio_slug VARCHAR(50) NOT NULL,
  servicio_nombre VARCHAR(100) NOT NULL,
  ciudad_slug VARCHAR(50) NOT NULL,
  ciudad_nombre VARCHAR(100) NOT NULL,
  provincia VARCHAR(50),
  
  -- SEO
  meta_title VARCHAR(70) NOT NULL,
  meta_description VARCHAR(160) NOT NULL,
  meta_keywords TEXT,
  
  -- Hero Section
  hero_title VARCHAR(200) NOT NULL,
  hero_subtitle TEXT NOT NULL,
  hero_bullets JSONB DEFAULT '[]'::jsonb,
  hero_image_url TEXT,
  
  -- Problema / Solución
  problem_title VARCHAR(100),
  problems JSONB DEFAULT '[]'::jsonb,
  solution_title VARCHAR(100),
  solution_text TEXT,
  
  -- Servicios específicos
  services_title VARCHAR(150),
  services JSONB DEFAULT '[]'::jsonb,
  -- Formato: [{"icon": "📄", "title": "NIE", "description": "..."}]
  
  -- Por qué esta ciudad
  why_city_title VARCHAR(150),
  why_city_text TEXT,
  why_city_stats JSONB DEFAULT '[]'::jsonb,
  -- Formato: [{"value": "25%", "label": "Población extranjera"}]
  
  -- FAQ (importante para SEO)
  faqs JSONB DEFAULT '[]'::jsonb,
  -- Formato: [{"question": "...", "answer": "..."}]
  
  -- CTA
  cta_title VARCHAR(150),
  cta_subtitle VARCHAR(200),
  
  -- Contenido adicional (para schema.org, rich snippets)
  schema_org JSONB,
  
  -- Control
  idioma VARCHAR(5) DEFAULT 'es',
  activo BOOLEAN DEFAULT true,
  generado_por_ia BOOLEAN DEFAULT false,
  revisado BOOLEAN DEFAULT false,
  fecha_generacion TIMESTAMPTZ,
  fecha_revision TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_landing_servicio ON landing_pages(servicio_slug);
CREATE INDEX IF NOT EXISTS idx_landing_ciudad ON landing_pages(ciudad_slug);
CREATE INDEX IF NOT EXISTS idx_landing_activo ON landing_pages(activo);
CREATE INDEX IF NOT EXISTS idx_landing_idioma ON landing_pages(idioma);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_landing_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_landing_updated ON landing_pages;
CREATE TRIGGER trigger_landing_updated
  BEFORE UPDATE ON landing_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_landing_timestamp();

-- RLS (Row Level Security)
ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;

-- Política: Lectura pública (las landing pages son públicas)
DROP POLICY IF EXISTS "Landing pages públicas" ON landing_pages;
CREATE POLICY "Landing pages públicas" ON landing_pages
  FOR SELECT USING (activo = true);

-- Política: Solo admins pueden modificar
DROP POLICY IF EXISTS "Solo admins modifican landings" ON landing_pages;
CREATE POLICY "Solo admins modifican landings" ON landing_pages
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- TABLA: landing_generation_log
-- Registro de generaciones con IA
-- ============================================

CREATE TABLE IF NOT EXISTS landing_generation_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  landing_id UUID REFERENCES landing_pages(id) ON DELETE CASCADE,
  slug VARCHAR(100) NOT NULL,
  
  -- Info de generación
  modelo_ia VARCHAR(50) NOT NULL, -- gpt-4, gpt-3.5-turbo, etc.
  prompt_usado TEXT,
  tokens_input INTEGER,
  tokens_output INTEGER,
  coste_estimado DECIMAL(10, 6),
  
  -- Resultado
  exito BOOLEAN DEFAULT false,
  error_mensaje TEXT,
  tiempo_ms INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DATOS INICIALES: Servicios y Ciudades
-- ============================================

-- Tabla auxiliar de servicios (para el script de generación)
CREATE TABLE IF NOT EXISTS servicios_catalogo (
  slug VARCHAR(50) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  nombre_plural VARCHAR(100),
  icon VARCHAR(10),
  descripcion_corta TEXT,
  keywords TEXT[]
);

INSERT INTO servicios_catalogo (slug, nombre, nombre_plural, icon, descripcion_corta, keywords) VALUES
  ('seguros', 'Seguro de Salud', 'Seguros de Salud', '🏥', 'Seguros médicos privados para extranjeros', ARRAY['seguro salud', 'seguro medico', 'aseguradora', 'poliza', 'cobertura medica']),
  ('abogados', 'Abogado', 'Abogados', '⚖️', 'Familia, civil, laboral, extranjería y más. Todas las especialidades.', ARRAY['abogado', 'abogados', 'familia', 'civil', 'laboral', 'extranjeria', 'visado', 'nie', 'divorcio', 'herencias']),
  ('inmobiliarias', 'Inmobiliaria', 'Inmobiliarias', '🏠', 'Compra, venta y alquiler de propiedades', ARRAY['inmobiliaria', 'comprar casa', 'alquilar piso', 'vivienda', 'propiedad']),
  ('gestorias', 'Gestoría', 'Gestorías', '📋', 'Trámites administrativos, fiscales y laborales', ARRAY['gestoria', 'gestor', 'impuestos', 'autonomo', 'declaracion', 'tramites'])
ON CONFLICT (slug) DO NOTHING;

-- Tabla auxiliar de ciudades
CREATE TABLE IF NOT EXISTS ciudades_catalogo (
  slug VARCHAR(50) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  provincia VARCHAR(50) NOT NULL,
  comunidad VARCHAR(50) NOT NULL,
  poblacion INTEGER,
  porcentaje_extranjeros DECIMAL(5,2),
  destacada BOOLEAN DEFAULT false,
  datos_extra JSONB
);

-- ============================================
-- TABLA: ciudades_contenido
-- Contenido SEO extendido para páginas de ciudades
-- ============================================

CREATE TABLE IF NOT EXISTS ciudades_contenido (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ciudad_slug VARCHAR(50) UNIQUE NOT NULL REFERENCES ciudades_catalogo(slug) ON DELETE CASCADE,
  
  -- SEO
  meta_title VARCHAR(70) NOT NULL,
  meta_description VARCHAR(160) NOT NULL,
  meta_keywords TEXT,
  
  -- Contenido principal
  intro_text TEXT NOT NULL,
  
  -- Barrios/Zonas
  barrios JSONB DEFAULT '[]'::jsonb,
  -- Formato: [{"nombre": "Centro", "descripcion": "..."}]
  
  -- Coste de vida detallado
  coste_vida_alquiler TEXT,
  coste_vida_compra TEXT,
  coste_vida_alimentacion TEXT,
  coste_vida_transporte TEXT,
  coste_vida_utilidades TEXT,
  
  -- Trámites específicos
  tramites JSONB DEFAULT '[]'::jsonb,
  -- Formato: ["Trámite 1", "Trámite 2", ...]
  
  -- FAQs
  faqs JSONB DEFAULT '[]'::jsonb,
  -- Formato: [{"pregunta": "...", "respuesta": "..."}]
  
  -- Puntos de interés
  ventajas JSONB DEFAULT '[]'::jsonb,
  -- Formato: ["Ventaja 1", "Ventaja 2", ...]
  
  -- Datos adicionales
  clima_detalle TEXT,
  temperatura_media VARCHAR(50),
  dias_sol INTEGER,
  
  -- Control
  idioma VARCHAR(5) DEFAULT 'es',
  activo BOOLEAN DEFAULT true,
  generado_por_ia BOOLEAN DEFAULT false,
  revisado BOOLEAN DEFAULT false,
  fecha_generacion TIMESTAMPTZ,
  fecha_revision TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_ciudades_contenido_activo ON ciudades_contenido(activo);
CREATE INDEX IF NOT EXISTS idx_ciudades_contenido_ciudad ON ciudades_contenido(ciudad_slug);

-- Trigger para updated_at
DROP TRIGGER IF EXISTS trigger_ciudades_contenido_updated ON ciudades_contenido;
CREATE TRIGGER trigger_ciudades_contenido_updated
  BEFORE UPDATE ON ciudades_contenido
  FOR EACH ROW
  EXECUTE FUNCTION update_landing_timestamp();

-- RLS
ALTER TABLE ciudades_contenido ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Contenido ciudades público" ON ciudades_contenido;
CREATE POLICY "Contenido ciudades público" ON ciudades_contenido
  FOR SELECT USING (activo = true);

DROP POLICY IF EXISTS "Solo admins modifican contenido ciudades" ON ciudades_contenido;
CREATE POLICY "Solo admins modifican contenido ciudades" ON ciudades_contenido
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- DATOS INICIALES: LAS 19 CIUDADES ESTRATÉGICAS
-- ============================================
-- Región de Murcia (12): Murcia, Cartagena, Lorca, Mazarrón, Torre Pacheco, 
--                        San Javier, San Pedro del Pinatar, Molina de Segura, 
--                        Águilas, Cieza, Jumilla, Yecla
-- Provincia de Alicante (7): Alicante, Elche, Torrevieja, Orihuela, 
--                            Rojales, Benidorm, Denia
--
-- IMPORTANTE: Las ciudades se insertan desde el archivo separado:
-- supabase/ciudades-19-iniciales.sql
-- 
-- Total de landing pages: 4 servicios × 19 ciudades = 76 landing pages
-- ============================================

-- Ver archivo: supabase/ciudades-19-iniciales.sql para los INSERT statements

-- ============================================
-- COMENTARIOS
-- ============================================

COMMENT ON TABLE landing_pages IS 'Contenido SEO para landing pages: 4 servicios × 19 ciudades = 76 landing pages generadas con IA';
COMMENT ON TABLE servicios_catalogo IS 'Catálogo de los 4 servicios esenciales: Seguros, Abogados, Inmobiliarias, Gestorías';
COMMENT ON TABLE ciudades_catalogo IS 'Catálogo de las 19 ciudades estratégicas iniciales (12 Murcia + 7 Alicante)';
COMMENT ON COLUMN landing_pages.slug IS 'Slug único: servicio-ciudad (ej: seguros-torrevieja, abogados-murcia)';
COMMENT ON COLUMN landing_pages.hero_bullets IS 'Array JSON de bullets para el hero: ["bullet1", "bullet2"]';
COMMENT ON COLUMN landing_pages.services IS 'Array JSON de servicios: [{"icon": "📄", "title": "NIE", "description": "..."}]';
COMMENT ON COLUMN landing_pages.faqs IS 'Array JSON de FAQs: [{"question": "...", "answer": "..."}]';
