-- =============================================
-- HEALTH4SPAIN - Storage: Bucket y Políticas
-- =============================================
-- Ejecutar en Supabase SQL Editor
-- 
-- ANTES de ejecutar esto:
-- 1. Ir a Dashboard > Storage > New bucket
-- 2. Nombre: "blog-images"
-- 3. Public: ✅ ON
-- 4. Click Create bucket
-- =============================================

-- =============================================
-- POLÍTICAS DE ACCESO
-- =============================================
-- ⚠️ CAMBIAR LOS EMAILS POR LOS DE TUS ADMINISTRADORES

-- 1. Cualquiera puede VER imágenes (público)
CREATE POLICY "Público puede ver imágenes"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');

-- 2. Solo admins pueden SUBIR
CREATE POLICY "Admin puede subir imágenes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog-images'
  AND auth.jwt() ->> 'email' IN (
    'asantomebb@gmail.com'
  )
);

-- 3. Solo admins pueden ACTUALIZAR
CREATE POLICY "Admin puede actualizar imágenes"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'blog-images'
  AND auth.jwt() ->> 'email' IN (
    'asantomebb@gmail.com'
  )
)
WITH CHECK (
  bucket_id = 'blog-images'
  AND auth.jwt() ->> 'email' IN (
    'asantomebb@gmail.com'
  )
);

-- 4. Solo admins pueden ELIMINAR
CREATE POLICY "Admin puede eliminar imágenes"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-images'
  AND auth.jwt() ->> 'email' IN (
    'asantomebb@gmail.com'
  )
);


-- =============================================
-- VERIFICAR POLÍTICAS
-- =============================================
-- SELECT * FROM pg_policies WHERE tablename = 'objects';


-- =============================================
-- ESTRUCTURA DE CARPETAS RECOMENDADA
-- =============================================
--
-- blog-images/
--   ├── posts/
--   │   ├── guia-nie/
--   │   └── vivir-alicante/
--   ├── landings/
--   ├── general/
--   └── 2025/
--       └── 01/
--
-- =============================================


-- =============================================
-- NOTAS
-- =============================================
-- 
-- 1. Bucket "Public" = URLs accesibles sin auth
--    Las políticas controlan QUIÉN puede modificar
--
-- 2. Permisos resultantes:
--    - Visitantes: ver imágenes ✅
--    - Visitantes: subir/borrar ❌
--    - Admins: todo ✅
--
-- 3. La API /api/upload usa service_role key
--    que BYPASA estas políticas (más seguro)
--
-- 4. El panel admin usa las APIs, no Supabase directo
--
-- =============================================
