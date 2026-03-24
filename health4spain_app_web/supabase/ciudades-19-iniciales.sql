-- ============================================
-- CIUDADES INICIALES: LAS 19 CIUDADES ESTRATÉGICAS
-- Basado en la documentación estratégica de Health4Spain
-- ============================================

-- Limpiar ciudades existentes (CUIDADO: solo ejecutar en desarrollo)
-- TRUNCATE TABLE ciudades_catalogo CASCADE;

-- ============================================
-- REGIÓN DE MURCIA (12 ciudades)
-- ============================================

INSERT INTO ciudades_catalogo (slug, nombre, provincia, comunidad, poblacion, porcentaje_extranjeros, destacada, datos_extra) VALUES
  -- 1. Murcia Capital
  ('murcia', 'Murcia', 'Murcia', 'Región de Murcia', 460000, 13.00, true, 
   '{"aeropuerto_cercano": "Corvera", "distancia_aeropuerto": 30, "categoria": "Capital", 
     "perfil_economico": "Servicios, logística, IT", "descripcion": "Capital de la región, centro de servicios"}'),
  
  -- 2. Cartagena
  ('cartagena', 'Cartagena', 'Murcia', 'Región de Murcia', 215000, 13.00, true, 
   '{"aeropuerto_cercano": "Corvera", "distancia_aeropuerto": 25, "categoria": "Puerto industrial", 
     "perfil_economico": "Puerto, industria, energía", "descripcion": "Ciudad portuaria histórica"}'),
  
  -- 3. Lorca
  ('lorca', 'Lorca', 'Murcia', 'Región de Murcia', 98000, 20.00, false, 
   '{"aeropuerto_cercano": "Corvera", "distancia_aeropuerto": 70, "categoria": "Agroindustrial", 
     "perfil_economico": "Agroindustria, ganadería", "descripcion": "Centro agroindustrial"}'),
  
  -- 4. Mazarrón
  ('mazarron', 'Mazarrón', 'Murcia', 'Región de Murcia', 33000, 20.00, false, 
   '{"aeropuerto_cercano": "Corvera", "distancia_aeropuerto": 45, "categoria": "Costa Cálida", 
     "perfil_economico": "Turismo estacional, agrícola", "descripcion": "Costa tranquila"}'),
  
  -- 5. Torre Pacheco
  ('torre-pacheco', 'Torre Pacheco', 'Murcia', 'Región de Murcia', 38000, 30.00, false, 
   '{"aeropuerto_cercano": "Corvera", "distancia_aeropuerto": 15, "categoria": "Agroindustrial", 
     "perfil_economico": "Agroindustria, logística", "descripcion": "Centro de distribución"}'),
  
  -- 6. San Javier
  ('san-javier', 'San Javier', 'Murcia', 'Región de Murcia', 33000, 25.00, false, 
   '{"aeropuerto_cercano": "Corvera", "distancia_aeropuerto": 5, "categoria": "Mar Menor", 
     "perfil_economico": "Turismo, servicios, hostelería", "descripcion": "Vive junto al Mar Menor"}'),
  
  -- 7. San Pedro del Pinatar
  ('san-pedro-pinatar', 'San Pedro del Pinatar', 'Murcia', 'Región de Murcia', 27000, 20.00, false, 
   '{"aeropuerto_cercano": "Corvera", "distancia_aeropuerto": 15, "categoria": "Mar Menor", 
     "perfil_economico": "Turismo, servicios sociosanitarios", "descripcion": "Retiro tranquilo y activo"}'),
  
  -- 8. Molina de Segura
  ('molina-de-segura', 'Molina de Segura', 'Murcia', 'Región de Murcia', 74000, 15.00, false, 
   '{"aeropuerto_cercano": "Corvera", "distancia_aeropuerto": 35, "categoria": "Industrial", 
     "perfil_economico": "Industria agroalimentaria, logística", "descripcion": "Empleo estable industrial"}'),
  
  -- 9. Águilas
  ('aguilas', 'Águilas', 'Murcia', 'Región de Murcia', 35000, 15.00, false, 
   '{"aeropuerto_cercano": "Corvera", "distancia_aeropuerto": 90, "categoria": "Costa Cálida", 
     "perfil_economico": "Turismo, construcción", "descripcion": "Costa sur de Murcia"}'),
  
  -- 10. Cieza
  ('cieza', 'Cieza', 'Murcia', 'Región de Murcia', 28000, 18.00, false, 
   '{"aeropuerto_cercano": "Corvera", "distancia_aeropuerto": 80, "categoria": "Agrícola", 
     "perfil_economico": "Agricultura, cerealista", "descripcion": "Valle del río Segura"}'),
  
  -- 11. Jumilla
  ('jumilla', 'Jumilla', 'Murcia', 'Región de Murcia', 24000, 16.00, false, 
   '{"aeropuerto_cercano": "Corvera", "distancia_aeropuerto": 90, "categoria": "Vitivinícola", 
     "perfil_economico": "Vitivinicultura, agricultura", "descripcion": "Tierra de vinos"}'),
  
  -- 12. Yecla
  ('yecla', 'Yecla', 'Murcia', 'Región de Murcia', 31000, 14.00, false, 
   '{"aeropuerto_cercano": "Corvera", "distancia_aeropuerto": 100, "categoria": "Industrial", 
     "perfil_economico": "Mueble, cerámica, industrial", "descripcion": "Centro del mueble"}'
);

-- ============================================
-- PROVINCIA DE ALICANTE (7 ciudades)
-- ============================================

INSERT INTO ciudades_catalogo (slug, nombre, provincia, comunidad, poblacion, porcentaje_extranjeros, destacada, datos_extra) VALUES
  -- 13. Alicante Capital
  ('alicante', 'Alicante', 'Alicante', 'Comunidad Valenciana', 330000, 23.00, true, 
   '{"aeropuerto_cercano": "Alicante", "distancia_aeropuerto": 15, "categoria": "Costa Blanca", 
     "perfil_economico": "Turismo, servicios, comercio", "descripcion": "Capital de la Costa Blanca"}'),
  
  -- 14. Elche
  ('elche', 'Elche', 'Alicante', 'Comunidad Valenciana', 230000, 20.00, false, 
   '{"aeropuerto_cercano": "Alicante", "distancia_aeropuerto": 20, "categoria": "Industrial", 
     "perfil_economico": "Calzado, textil, agrícola", "descripcion": "Empleo industrial garantizado"}'),
  
  -- 15. Torrevieja
  ('torrevieja', 'Torrevieja', 'Alicante', 'Comunidad Valenciana', 90000, 28.00, true, 
   '{"aeropuerto_cercano": "Alicante", "distancia_aeropuerto": 40, "categoria": "Costa Blanca Sur", 
     "perfil_economico": "Turismo premium, retiro", "descripcion": "Tu retiro en la Costa Blanca"}'),
  
  -- 16. Orihuela
  ('orihuela', 'Orihuela', 'Alicante', 'Comunidad Valenciana', 110000, 18.00, false, 
   '{"aeropuerto_cercano": "Alicante", "distancia_aeropuerto": 50, "categoria": "Bajo Segura", 
     "perfil_economico": "Agrícola, turismo, comercio", "descripcion": "Vive en el corazón del Bajo Segura"}'),
  
  -- 17. Rojales
  ('rojales', 'Rojales', 'Alicante', 'Comunidad Valenciana', 35000, 22.00, false, 
   '{"aeropuerto_cercano": "Alicante", "distancia_aeropuerto": 35, "categoria": "Costa Blanca Sur", 
     "perfil_economico": "Retiro, turismo residencial", "descripcion": "Retiro tranquilo con servicios premium"}'),
  
  -- 18. Benidorm
  ('benidorm', 'Benidorm', 'Alicante', 'Comunidad Valenciana', 70000, 35.00, true, 
   '{"aeropuerto_cercano": "Alicante", "distancia_aeropuerto": 50, "categoria": "Costa Blanca", 
     "perfil_economico": "Turismo de masas", "descripcion": "Capital turística del Mediterráneo"}'),
  
  -- 19. Denia
  ('denia', 'Dénia', 'Alicante', 'Comunidad Valenciana', 42000, 15.00, false, 
   '{"aeropuerto_cercano": "Alicante", "distancia_aeropuerto": 90, "categoria": "Costa Blanca Norte", 
     "perfil_economico": "Turismo gastronómico, pesca", "descripcion": "Ciudad gastronómica creativa"}'
)
ON CONFLICT (slug) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  provincia = EXCLUDED.provincia,
  comunidad = EXCLUDED.comunidad,
  poblacion = EXCLUDED.poblacion,
  porcentaje_extranjeros = EXCLUDED.porcentaje_extranjeros,
  destacada = EXCLUDED.destacada,
  datos_extra = EXCLUDED.datos_extra;

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Contar ciudades por provincia
SELECT provincia, COUNT(*) as total
FROM ciudades_catalogo
WHERE slug IN (
  'murcia', 'cartagena', 'lorca', 'mazarron', 'torre-pacheco', 
  'san-javier', 'san-pedro-pinatar', 'molina-de-segura', 'aguilas', 
  'cieza', 'jumilla', 'yecla',
  'alicante', 'elche', 'torrevieja', 'orihuela', 'rojales', 'benidorm', 'denia'
)
GROUP BY provincia
ORDER BY provincia;

-- Listar las 19 ciudades estratégicas
SELECT 
  slug, 
  nombre, 
  provincia, 
  poblacion,
  porcentaje_extranjeros,
  datos_extra->>'perfil_economico' as perfil_economico
FROM ciudades_catalogo
WHERE slug IN (
  'murcia', 'cartagena', 'lorca', 'mazarron', 'torre-pacheco', 
  'san-javier', 'san-pedro-pinatar', 'molina-de-segura', 'aguilas', 
  'cieza', 'jumilla', 'yecla',
  'alicante', 'elche', 'torrevieja', 'orihuela', 'rojales', 'benidorm', 'denia'
)
ORDER BY provincia, nombre;

-- ============================================
-- COMENTARIOS FINALES
-- ============================================

COMMENT ON TABLE ciudades_catalogo IS 'Catálogo de las 19 ciudades iniciales estratégicas: 12 en Murcia + 7 en Alicante';
