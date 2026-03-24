-- ============================================
-- Actualizar servicio Abogados (más general)
-- De "Abogados de Extranjería" a "Abogados"
-- ============================================

UPDATE servicios_catalogo 
SET 
  nombre = 'Abogado',
  nombre_plural = 'Abogados',
  descripcion_corta = 'Familia, civil, laboral, extranjería y más. Todas las especialidades.',
  keywords = ARRAY['abogado', 'abogados', 'familia', 'civil', 'laboral', 'extranjeria', 'visado', 'nie', 'divorcio', 'herencias']
WHERE slug = 'abogados';
