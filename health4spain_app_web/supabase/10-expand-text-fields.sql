-- Expandir límites de campos de texto en ciudades_contenido

-- Meta campos necesitan ser más largos
ALTER TABLE ciudades_contenido 
ALTER COLUMN meta_title TYPE VARCHAR(255);

ALTER TABLE ciudades_contenido 
ALTER COLUMN meta_description TYPE VARCHAR(500);

-- Campos de coste de vida a TEXT
ALTER TABLE ciudades_contenido 
ALTER COLUMN coste_vida_alquiler TYPE TEXT;

ALTER TABLE ciudades_contenido 
ALTER COLUMN coste_vida_compra TYPE TEXT;

ALTER TABLE ciudades_contenido 
ALTER COLUMN coste_vida_alimentacion TYPE TEXT;

ALTER TABLE ciudades_contenido 
ALTER COLUMN coste_vida_transporte TYPE TEXT;

ALTER TABLE ciudades_contenido 
ALTER COLUMN coste_vida_utilidades TYPE TEXT;

-- Intro y clima a TEXT
ALTER TABLE ciudades_contenido 
ALTER COLUMN intro_text TYPE TEXT;

ALTER TABLE ciudades_contenido 
ALTER COLUMN clima_detalle TYPE TEXT;

-- Migración completada
