-- Expandir ciudades_contenido para incluir TODAS las secciones de la guía

-- Sección: Primeros 30 días
ALTER TABLE ciudades_contenido 
ADD COLUMN IF NOT EXISTS primeros_30_dias JSONB DEFAULT NULL;

COMMENT ON COLUMN ciudades_contenido.primeros_30_dias IS 'Array de pasos para los primeros 30 días: [{titulo, descripcion, dias}]';

-- Sección: Consulados y embajadas
ALTER TABLE ciudades_contenido 
ADD COLUMN IF NOT EXISTS consulados_embajadas JSONB DEFAULT NULL;

COMMENT ON COLUMN ciudades_contenido.consulados_embajadas IS 'Info de consulados: {descripcion, lista_consulados: [{pais, direccion, telefono, web}], documentos_basicos: []}';

-- Sección: Trabajo y emprendimiento
ALTER TABLE ciudades_contenido 
ADD COLUMN IF NOT EXISTS trabajo_emprendimiento JSONB DEFAULT NULL;

COMMENT ON COLUMN ciudades_contenido.trabajo_emprendimiento IS 'Info laboral: {sectores_principales: [], donde_buscar: [], tips_emprendimiento: []}';

-- Sección: Condiciones de entrada
ALTER TABLE ciudades_contenido 
ADD COLUMN IF NOT EXISTS condiciones_entrada JSONB DEFAULT NULL;

COMMENT ON COLUMN ciudades_contenido.condiciones_entrada IS 'Requisitos: {sin_visa: [], con_visa: [], documentos_requeridos: []}';

-- Sección: Riesgos frontera
ALTER TABLE ciudades_contenido 
ADD COLUMN IF NOT EXISTS riesgos_frontera JSONB DEFAULT NULL;

COMMENT ON COLUMN ciudades_contenido.riesgos_frontera IS 'Alertas: {errores_comunes: [], que_no_hacer: [], consejos: []}';

-- Sección: Residencia y nacionalidad
ALTER TABLE ciudades_contenido 
ADD COLUMN IF NOT EXISTS residencia_nacionalidad JSONB DEFAULT NULL;

COMMENT ON COLUMN ciudades_contenido.residencia_nacionalidad IS 'Trámites legales: {tipos_residencia: [], proceso_nacionalidad: [], requisitos: []}';

-- Sección: Integración práctica
ALTER TABLE ciudades_contenido 
ADD COLUMN IF NOT EXISTS integracion_practica JSONB DEFAULT NULL;

COMMENT ON COLUMN ciudades_contenido.integracion_practica IS 'Recursos: {asociaciones: [], comunidades_online: [], apps_utiles: [], cursos_idiomas: []}';

-- Sección: Checklists
ALTER TABLE ciudades_contenido 
ADD COLUMN IF NOT EXISTS checklists JSONB DEFAULT NULL;

COMMENT ON COLUMN ciudades_contenido.checklists IS 'Checklists por tema: {antes_viajar: [], primeros_dias: [], tramites: [], integracion: []}';

-- Índices para búsqueda en JSON
CREATE INDEX IF NOT EXISTS idx_ciudades_contenido_consulados 
ON ciudades_contenido USING GIN (consulados_embajadas);

CREATE INDEX IF NOT EXISTS idx_ciudades_contenido_trabajo 
ON ciudades_contenido USING GIN (trabajo_emprendimiento);

-- Migración completada
