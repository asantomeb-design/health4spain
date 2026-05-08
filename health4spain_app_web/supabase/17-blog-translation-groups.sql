-- =============================================
-- BLOG TRANSLATION GROUPS
-- =============================================
-- Vincula traducciones de un mismo artículo en distintos idiomas usando un
-- UUID compartido (translation_group_id). Hace que el cambiador de idioma
-- y las hreflang funcionen con slugs distintos por idioma.
--
-- Ejecutar en Supabase SQL Editor.
-- Idempotente: se puede ejecutar varias veces sin efectos no deseados.

-- 1) Columna nueva ----------------------------------------------------------
ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS translation_group_id uuid;

-- Índice para búsquedas rápidas por grupo
CREATE INDEX IF NOT EXISTS blog_posts_translation_group_id_idx
  ON blog_posts (translation_group_id);

-- Índice compuesto para resolver "dame el hermano en idioma X" rápido
CREATE INDEX IF NOT EXISTS blog_posts_group_lang_idx
  ON blog_posts (translation_group_id, lang);

-- 2) Backfill heurístico ----------------------------------------------------
-- Estrategia, en orden:
--   a) Cada post ES sin group_id recibe un UUID nuevo.
--   b) Para cada post no-ES, intentamos casarlo con un post ES en el mismo
--      slug y la misma categoría → mismo group_id.
--   c) Si no hay match exacto, el post no-ES recibe su propio group_id
--      (queda huérfano pero sigue funcionando individualmente; se puede
--      enlazar manualmente más tarde).

-- a) Asignar group_id a todos los posts ES que aún no lo tengan
UPDATE blog_posts
SET translation_group_id = gen_random_uuid()
WHERE lang = 'es'
  AND translation_group_id IS NULL;

-- b) Para cada post no-ES sin group_id, copiar el de su hermano ES con
--    mismo slug + misma categoría (el caso típico de los artículos
--    traducidos manualmente que no cambiaron el slug)
UPDATE blog_posts AS bp
SET translation_group_id = es.translation_group_id
FROM blog_posts AS es
WHERE bp.translation_group_id IS NULL
  AND bp.lang <> 'es'
  AND es.lang = 'es'
  AND es.slug = bp.slug
  AND es.category = bp.category
  AND es.translation_group_id IS NOT NULL;

-- c) Cualquier post sin group_id (no se ha encontrado hermano ES) recibe uno
--    propio para que también pueda construir su URL canónica
UPDATE blog_posts
SET translation_group_id = gen_random_uuid()
WHERE translation_group_id IS NULL;

-- 3) NOT NULL definitivo ----------------------------------------------------
-- Una vez backfilleado todo, lo hacemos obligatorio para nuevas filas.
ALTER TABLE blog_posts
  ALTER COLUMN translation_group_id SET NOT NULL;

-- 4) Trigger: garantizar group_id automático en futuros INSERT --------------
-- Si alguien inserta sin pasar translation_group_id, se le asigna uno nuevo.
CREATE OR REPLACE FUNCTION ensure_blog_translation_group_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.translation_group_id IS NULL THEN
    NEW.translation_group_id := gen_random_uuid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blog_posts_ensure_translation_group ON blog_posts;
CREATE TRIGGER blog_posts_ensure_translation_group
  BEFORE INSERT ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION ensure_blog_translation_group_id();

-- 5) Constraint: dentro de un grupo, cada idioma aparece como mucho una vez
--    (un grupo no puede tener dos posts en español, por ejemplo).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'blog_posts_unique_lang_per_group'
  ) THEN
    EXECUTE 'CREATE UNIQUE INDEX blog_posts_unique_lang_per_group
             ON blog_posts (translation_group_id, lang)';
  END IF;
EXCEPTION WHEN unique_violation THEN
  RAISE NOTICE 'Hay duplicados de idioma dentro de un mismo translation_group_id. Revísalos manualmente antes de aplicar el unique index.';
END $$;
