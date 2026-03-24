-- =====================================================
-- MIGRACIÓN: Añadir codigo_pais y fecha_nacimiento a leads
-- =====================================================
-- Ejecutar en Supabase SQL Editor
-- Los códigos de país coinciden con los países seleccionables del formulario

-- Añadir columna codigo_pais (código telefónico: +34, +44, etc.)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS codigo_pais VARCHAR(10);

-- Añadir columna fecha_nacimiento
ALTER TABLE leads ADD COLUMN IF NOT EXISTS fecha_nacimiento DATE;

-- Nota: Los leads existentes conservan telefono tal cual. Los nuevos usarán codigo_pais + telefono.

-- Comentarios
COMMENT ON COLUMN leads.codigo_pais IS 'Código de país telefónico (+34, +44, etc.) - obligatorio';
COMMENT ON COLUMN leads.fecha_nacimiento IS 'Fecha de nacimiento del cliente';
