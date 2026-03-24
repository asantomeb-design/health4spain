-- =====================================================
-- HEALTH4SPAIN - SCHEMA DE BASE DE DATOS SUPABASE
-- =====================================================
-- Ejecutar en Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLA: blog_posts
-- =====================================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image VARCHAR(500),
    category VARCHAR(50) DEFAULT 'guias',
    tags TEXT[] DEFAULT '{}',
    meta_title VARCHAR(70),
    meta_description VARCHAR(170),
    lang VARCHAR(2) DEFAULT 'es',
    translations JSONB DEFAULT '{}',
    author_id UUID,
    author_name VARCHAR(100),
    status VARCHAR(20) DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_slug_lang UNIQUE (slug, lang)
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_lang ON blog_posts(lang);

-- =====================================================
-- TABLA: leads (actualizada con nuevos campos)
-- =====================================================
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Datos de contacto
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    
    -- Origen del lead
    pais_origen VARCHAR(100),
    ciudad_origen VARCHAR(100),
    
    -- Necesidad
    servicio VARCHAR(50) NOT NULL,
    ciudad VARCHAR(50) NOT NULL,
    presupuesto VARCHAR(50),
    urgencia VARCHAR(30) DEFAULT 'no_especificado',
    idioma_preferido VARCHAR(2) DEFAULT 'es',
    mensaje TEXT,
    
    -- Tracking
    landing_page VARCHAR(500),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    dispositivo VARCHAR(20),
    
    -- Estado
    status VARCHAR(20) DEFAULT 'nuevo',
    score INTEGER DEFAULT 50,
    
    -- Asignación
    partner_id UUID,
    assigned_at TIMESTAMPTZ,
    contacted_at TIMESTAMPTZ,
    converted_at TIMESTAMPTZ,
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_servicio ON leads(servicio);
CREATE INDEX IF NOT EXISTS idx_leads_ciudad ON leads(ciudad);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- =====================================================
-- TABLA: partners
-- =====================================================
CREATE TABLE IF NOT EXISTS partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_comercial VARCHAR(200) NOT NULL,
    razon_social VARCHAR(200),
    cif VARCHAR(20),
    email VARCHAR(255) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    direccion VARCHAR(300),
    ciudad VARCHAR(100),
    tipo_servicio TEXT[] DEFAULT '{}',
    ciudades_cobertura TEXT[] DEFAULT '{}',
    idiomas TEXT[] DEFAULT '{"es"}',
    status VARCHAR(20) DEFAULT 'pendiente',
    verificado BOOLEAN DEFAULT FALSE,
    leads_max_mes INTEGER DEFAULT 50,
    leads_actuales_mes INTEGER DEFAULT 0,
    precio_lead DECIMAL(10, 2) DEFAULT 25.00,
    leads_totales INTEGER DEFAULT 0,
    leads_convertidos INTEGER DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_partners_status ON partners(status);
CREATE INDEX IF NOT EXISTS idx_partners_ciudad ON partners(ciudad);

-- =====================================================
-- TRIGGER para updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_partners_updated_at ON partners;
CREATE TRIGGER update_partners_updated_at
    BEFORE UPDATE ON partners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- RLS básico
-- =====================================================
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Blog: lectura pública de publicados
CREATE POLICY "Blog públicos" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Blog admin insert" ON blog_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Blog admin update" ON blog_posts FOR UPDATE USING (true);
CREATE POLICY "Blog admin delete" ON blog_posts FOR DELETE USING (true);

-- Leads: insertar público
CREATE POLICY "Leads crear público" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Leads admin select" ON leads FOR SELECT USING (true);
CREATE POLICY "Leads admin update" ON leads FOR UPDATE USING (true);
CREATE POLICY "Leads admin delete" ON leads FOR DELETE USING (true);

-- Partners: solo admin
CREATE POLICY "Partners admin" ON partners FOR ALL USING (true);
