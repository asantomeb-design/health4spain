-- =====================================================
-- MIGRACIÓN: Soporte multi-idioma (portugués y futuros)
-- =====================================================
-- Ejecutar en Supabase SQL Editor
--
-- Problema: landing_pages tiene UNIQUE(slug) y ciudades_contenido
-- tiene UNIQUE(ciudad_slug). Eso impide tener el mismo contenido
-- en varios idiomas. Cambiamos a UNIQUE(slug, idioma).

-- =====================================================
-- 1. landing_pages: UNIQUE(slug) → UNIQUE(slug, idioma)
-- =====================================================
ALTER TABLE landing_pages DROP CONSTRAINT IF EXISTS landing_pages_slug_key;
ALTER TABLE landing_pages ADD CONSTRAINT landing_pages_slug_idioma_key UNIQUE (slug, idioma);

-- =====================================================
-- 2. ciudades_contenido: UNIQUE(ciudad_slug) → UNIQUE(ciudad_slug, idioma)
-- =====================================================
ALTER TABLE ciudades_contenido DROP CONSTRAINT IF EXISTS ciudades_contenido_ciudad_slug_key;
ALTER TABLE ciudades_contenido ADD CONSTRAINT ciudades_contenido_slug_idioma_key UNIQUE (ciudad_slug, idioma);

-- =====================================================
-- 3. blog_posts ya está bien: UNIQUE(slug, lang) ✓
-- =====================================================
-- No requiere cambios.
