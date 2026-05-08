-- =============================================
-- Blog IA: modelo de imagen por defecto gpt-image-1.5
-- =============================================
-- Evita 403 de OpenAI cuando la organización aún no está verificada para gpt-image-2.
-- Ejecutar en Supabase SQL Editor después de 17-blog-translation-groups.sql (o cuando ya exista ai_blog_config).
-- Idempotente: actualiza la fila singleton y el DEFAULT de la columna.

UPDATE ai_blog_config
SET model_image = 'gpt-image-1.5'
WHERE true;

ALTER TABLE ai_blog_config
  ALTER COLUMN model_image SET DEFAULT 'gpt-image-1.5';
