-- ============================================
-- LIMPIEZA Y CORRECCIÓN DE CIUDADES
-- Ejecutar ANTES de insertar las 19 ciudades correctas
-- ============================================

-- 1. ELIMINAR todas las ciudades que NO son las 19 estratégicas
DELETE FROM ciudades_catalogo 
WHERE slug NOT IN (
  -- REGIÓN DE MURCIA (12)
  'murcia', 'cartagena', 'lorca', 'mazarron', 'torre-pacheco',
  'san-javier', 'san-pedro-pinatar', 'molina-de-segura', 'aguilas',
  'cieza', 'jumilla', 'yecla',
  -- PROVINCIA DE ALICANTE (7)
  'alicante', 'elche', 'torrevieja', 'orihuela', 'rojales', 'benidorm', 'denia'
);

-- 2. ELIMINAR landing pages de ciudades/servicios incorrectos
DELETE FROM landing_pages
WHERE ciudad_slug NOT IN (
  'murcia', 'cartagena', 'lorca', 'mazarron', 'torre-pacheco',
  'san-javier', 'san-pedro-pinatar', 'molina-de-segura', 'aguilas',
  'cieza', 'jumilla', 'yecla',
  'alicante', 'elche', 'torrevieja', 'orihuela', 'rojales', 'benidorm', 'denia'
)
OR servicio_slug NOT IN ('seguros', 'abogados', 'inmobiliarias', 'gestorias');

-- 3. VERIFICAR resultado
SELECT 
  provincia,
  COUNT(*) as total_ciudades,
  STRING_AGG(nombre, ', ' ORDER BY nombre) as ciudades
FROM ciudades_catalogo
GROUP BY provincia
ORDER BY provincia;

-- Debería mostrar:
-- Alicante: 7 ciudades
-- Murcia: 12 ciudades

-- 4. VERIFICAR landing pages existentes
SELECT 
  servicio_slug,
  COUNT(*) as total
FROM landing_pages
GROUP BY servicio_slug
ORDER BY servicio_slug;

-- Debería mostrar 4 servicios

SELECT COUNT(*) as total_landing_pages FROM landing_pages;
-- Debería mostrar un número menor o igual a 76 (4 servicios × 19 ciudades)
