-- =============================================
-- HEALTH4SPAIN - Row Level Security (RLS) Policies
-- =============================================
-- Ejecutar en Supabase SQL Editor DESPUÉS de crear las tablas
-- Esto permite que el panel admin funcione correctamente

-- =============================================
-- 1. HABILITAR RLS EN TODAS LAS TABLAS
-- =============================================

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 2. FUNCIÓN HELPER: Verificar si es Admin
-- =============================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Verificar si el email del usuario actual está en la lista de admins
  -- Los emails admin se configuran en la tabla admin_users o como constante
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = auth.jwt() ->> 'email'
    AND active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 3. TABLA DE ADMINISTRADORES
-- =============================================

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar admin inicial (cambiar por tu email)
INSERT INTO admin_users (email, name) VALUES 
  ('admin@health4spain.com', 'Admin Principal')
ON CONFLICT (email) DO NOTHING;

-- =============================================
-- 4. POLÍTICAS PARA LEADS
-- =============================================

-- Público: Crear leads (formulario de contacto)
CREATE POLICY "Público puede crear leads"
  ON leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admin: Ver todos los leads
CREATE POLICY "Admin puede ver leads"
  ON leads FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admin: Actualizar leads
CREATE POLICY "Admin puede actualizar leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admin: Eliminar leads
CREATE POLICY "Admin puede eliminar leads"
  ON leads FOR DELETE
  TO authenticated
  USING (is_admin());

-- =============================================
-- 5. POLÍTICAS PARA BLOG_POSTS
-- =============================================

-- Público: Ver posts publicados
CREATE POLICY "Público puede ver posts publicados"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- Admin: Ver todos los posts
CREATE POLICY "Admin puede ver todos los posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admin: Crear posts
CREATE POLICY "Admin puede crear posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Admin: Actualizar posts
CREATE POLICY "Admin puede actualizar posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admin: Eliminar posts
CREATE POLICY "Admin puede eliminar posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (is_admin());

-- =============================================
-- 6. POLÍTICAS PARA LANDING_PAGES
-- =============================================

-- Público: Ver landings activas
CREATE POLICY "Público puede ver landings activas"
  ON landing_pages FOR SELECT
  TO anon, authenticated
  USING (activo = true);

-- Admin: Ver todas las landings
CREATE POLICY "Admin puede ver todas las landings"
  ON landing_pages FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admin: Crear landings
CREATE POLICY "Admin puede crear landings"
  ON landing_pages FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Admin: Actualizar landings
CREATE POLICY "Admin puede actualizar landings"
  ON landing_pages FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admin: Eliminar landings
CREATE POLICY "Admin puede eliminar landings"
  ON landing_pages FOR DELETE
  TO authenticated
  USING (is_admin());

-- =============================================
-- 7. POLÍTICAS PARA STORAGE (blog-images)
-- =============================================
-- Ejecutar en Storage > Policies

-- En Supabase Dashboard:
-- 1. Ir a Storage > blog-images > Policies
-- 2. Crear las siguientes políticas:

-- SELECT (ver): Permitir a todos (imágenes públicas)
-- Nombre: "Público puede ver imágenes"
-- Allowed operation: SELECT
-- Target roles: anon, authenticated
-- Policy: true

-- INSERT (subir): Solo admins autenticados
-- Nombre: "Admin puede subir imágenes"
-- Allowed operation: INSERT
-- Target roles: authenticated
-- Policy: (SELECT is_admin())

-- DELETE (eliminar): Solo admins
-- Nombre: "Admin puede eliminar imágenes"
-- Allowed operation: DELETE
-- Target roles: authenticated
-- Policy: (SELECT is_admin())

-- =============================================
-- 8. ALTERNATIVA SIMPLE (sin función is_admin)
-- =============================================
-- Si prefieres no usar la función, puedes hardcodear los emails:

-- DROP POLICY IF EXISTS "Admin puede ver leads" ON leads;
-- CREATE POLICY "Admin puede ver leads"
--   ON leads FOR SELECT
--   TO authenticated
--   USING (auth.jwt() ->> 'email' IN ('admin@health4spain.com', 'otro@email.com'));

-- =============================================
-- 9. VERIFICAR POLÍTICAS
-- =============================================

-- Ver todas las políticas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public';

-- =============================================
-- 10. NOTAS IMPORTANTES
-- =============================================

-- 1. Las APIs con service_role key BYPASAN RLS completamente
--    Útil para scripts y integraciones externas

-- 2. El panel admin usa el cliente con anon key + auth de usuario
--    Por eso necesitamos RLS para que funcione

-- 3. Para añadir un nuevo admin:
--    INSERT INTO admin_users (email, name) VALUES ('nuevo@email.com', 'Nombre');

-- 4. Para desactivar un admin (sin eliminarlo):
--    UPDATE admin_users SET active = false WHERE email = 'email@example.com';
