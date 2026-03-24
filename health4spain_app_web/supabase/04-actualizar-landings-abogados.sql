-- ============================================
-- Actualizar terminología en landing_pages
-- De "Abogado Extranjería" / "Abogados de Extranjería" a "Abogado" / "Abogados"
-- ============================================

-- servicio_nombre (ej: "Abogado Extranjería" -> "Abogado")
UPDATE landing_pages
SET servicio_nombre = REPLACE(REPLACE(servicio_nombre, 'Abogado Extranjería', 'Abogado'), 'Abogados de Extranjería', 'Abogados')
WHERE servicio_slug = 'abogados'
  AND (servicio_nombre ILIKE '%extranjería%' OR servicio_nombre ILIKE '%extranjeria%');

-- meta_title
UPDATE landing_pages
SET meta_title = REPLACE(REPLACE(REPLACE(REPLACE(
  meta_title,
  'Abogado de Extranjería', 'Abogado'),
  'Abogados de Extranjería', 'Abogados'),
  'Abogado Extranjería', 'Abogado'),
  'Abogados Extranjería', 'Abogados')
WHERE servicio_slug = 'abogados'
  AND (meta_title ILIKE '%extranjería%' OR meta_title ILIKE '%extranjeria%');

-- hero_title
UPDATE landing_pages
SET hero_title = REPLACE(REPLACE(REPLACE(REPLACE(
  hero_title,
  'Abogado de Extranjería', 'Abogado'),
  'Abogados de Extranjería', 'Abogados'),
  'Abogado Extranjería', 'Abogado'),
  'Abogados Extranjería', 'Abogados')
WHERE servicio_slug = 'abogados'
  AND (hero_title ILIKE '%extranjería%' OR hero_title ILIKE '%extranjeria%');

-- meta_description (sustituir variantes)
UPDATE landing_pages
SET meta_description = REPLACE(REPLACE(REPLACE(REPLACE(
  meta_description,
  'abogado de extranjería', 'abogado'),
  'abogados de extranjería', 'abogados'),
  'Abogado de Extranjería', 'Abogado'),
  'Abogados de Extranjería', 'Abogados')
WHERE servicio_slug = 'abogados'
  AND (meta_description ILIKE '%extranjería%' OR meta_description ILIKE '%extranjeria%');

-- cta_title si existe
UPDATE landing_pages
SET cta_title = REPLACE(REPLACE(REPLACE(REPLACE(
  cta_title,
  'Abogado de Extranjería', 'Abogado'),
  'Abogados de Extranjería', 'Abogados'),
  'Abogado Extranjería', 'Abogado'),
  'Abogados Extranjería', 'Abogados')
WHERE servicio_slug = 'abogados'
  AND cta_title IS NOT NULL
  AND (cta_title ILIKE '%extranjería%' OR cta_title ILIKE '%extranjeria%');

-- why_city_title
UPDATE landing_pages
SET why_city_title = REPLACE(REPLACE(REPLACE(REPLACE(
  why_city_title,
  'Abogado de Extranjería', 'Abogado'),
  'Abogados de Extranjería', 'Abogados'),
  'Abogado Extranjería', 'Abogado'),
  'Abogados Extranjería', 'Abogados')
WHERE servicio_slug = 'abogados'
  AND why_city_title IS NOT NULL
  AND (why_city_title ILIKE '%extranjería%' OR why_city_title ILIKE '%extranjeria%');
