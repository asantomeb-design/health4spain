-- =============================================
-- CHATBOT IA - Configuración del agente
-- =============================================
-- Tabla singleton para almacenar la configuración del chatbot IA.
-- Ejecutar en Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS chatbot_config (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Estado
  enabled boolean DEFAULT false,
  
  -- Modelo OpenAI
  model text DEFAULT 'gpt-4o-mini',
  temperature real DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 2),
  max_tokens integer DEFAULT 1024 CHECK (max_tokens > 0 AND max_tokens <= 16384),
  top_p real DEFAULT 1.0 CHECK (top_p >= 0 AND top_p <= 1),
  frequency_penalty real DEFAULT 0.0 CHECK (frequency_penalty >= 0 AND frequency_penalty <= 2),
  presence_penalty real DEFAULT 0.0 CHECK (presence_penalty >= 0 AND presence_penalty <= 2),
  
  -- Prompts
  system_prompt text DEFAULT 'Eres el asistente virtual de Health4Spain, plataforma especializada en ayudar a extranjeros que quieren vivir, estudiar, trabajar o retirarse en España, con presencia en 19 ciudades de la Región de Murcia y la Provincia de Alicante. Tu conocimiento está basado en el libro oficial "Vivir en España desde Alicante y Murcia" (2026).

IDIOMAS
Responde SIEMPRE en el idioma en que te escriba el usuario, sin comentar el cambio.
Idiomas: Español | Inglés | Francés | Alemán | Portugués

LOS 4 SERVICIOS (orden de prioridad)
1. Seguros de Salud → Asisa, Aegon, Sanitas, DKV (en este orden)
2. Abogados → Extranjería, visados, residencia, reagrupación, inmobiliaria
3. Gestorías → NIE, empadronamiento, fiscal, autónomos, homologación
4. Inmobiliarias → Compra y alquiler para extranjeros

LOS 4 PERFILES
1. Jubilados/No Lucrativa → ~28.000€/año, seguro privado obligatorio. Ciudades top: Torrevieja, Orihuela, Benidorm, Mazarrón, San Javier
2. Trabajadores → Visado trabajo, autónomos, homologación títulos. Ciudades top: Murcia, Alicante, Cartagena, Elche
3. Estudiantes → Visado estudios, seguro obligatorio, cuenta bancaria. Ciudades top: Murcia, Alicante, Cartagena
4. Familias → Reagrupación, escuelas, residencia familiar. Ciudades top: Orihuela, Torrevieja, Murcia, Alicante, Dénia

CÓMO RESPONDER
- Tono cercano y claro, como un amigo experto
- Si mencionan una ciudad, enfoca la respuesta en esa ubicación
- Recomienda el servicio H4S adecuado para cada caso
- Menciona el libro como recurso gratuito cuando sea relevante
- Al detectar necesidad clara, invitar siempre al formulario: "¿Quieres que te conectemos? Rellena el formulario, te contactamos en <24h."
- Nunca dar asesoramiento legal o fiscal vinculante
- Si no tienes certeza, derivar siempre al especialista H4S',
  
  -- Apariencia
  agent_name text DEFAULT 'Asistente Health4Spain',
  agent_avatar text DEFAULT '🏥',
  primary_color text DEFAULT '#293f92',
  
  -- Mensajes multiidioma (JSONB)
  welcome_message jsonb DEFAULT '{
    "es": "¡Hola! 👋 Soy el asistente virtual de Health4Spain. ¿En qué puedo ayudarte?",
    "en": "Hello! 👋 I''m the Health4Spain virtual assistant. How can I help you?",
    "fr": "Bonjour! 👋 Je suis l''assistant virtuel de Health4Spain. Comment puis-je vous aider?",
    "de": "Hallo! 👋 Ich bin der virtuelle Assistent von Health4Spain. Wie kann ich Ihnen helfen?",
    "pt": "Olá! 👋 Sou o assistente virtual da Health4Spain. Como posso ajudá-lo?"
  }'::jsonb,
  
  suggested_questions jsonb DEFAULT '{
    "es": ["¿Qué seguros de salud ofrecéis?", "Necesito un abogado de extranjería", "¿En qué ciudades operáis?", "¿Cómo funciona el servicio?"],
    "en": ["What health insurance do you offer?", "I need an immigration lawyer", "In which cities do you operate?", "How does the service work?"],
    "fr": ["Quelles assurances santé proposez-vous?", "J''ai besoin d''un avocat en immigration", "Dans quelles villes êtes-vous présents?", "Comment fonctionne le service?"],
    "de": ["Welche Krankenversicherungen bieten Sie an?", "Ich brauche einen Einwanderungsanwalt", "In welchen Städten sind Sie tätig?", "Wie funktioniert der Service?"],
    "pt": ["Que seguros de saúde oferecem?", "Preciso de um advogado de imigração", "Em que cidades operam?", "Como funciona o serviço?"]
  }'::jsonb,
  
  -- Conocimiento
  knowledge_tables text[] DEFAULT ARRAY['servicios_catalogo', 'ciudades_contenido', 'blog_posts', 'landing_pages'],
  max_context_items integer DEFAULT 10 CHECK (max_context_items > 0 AND max_context_items <= 50),
  
  -- Historial
  max_history_messages integer DEFAULT 10 CHECK (max_history_messages > 0 AND max_history_messages <= 50),
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_chatbot_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS chatbot_config_updated_at ON chatbot_config;
CREATE TRIGGER chatbot_config_updated_at
  BEFORE UPDATE ON chatbot_config
  FOR EACH ROW
  EXECUTE FUNCTION update_chatbot_config_updated_at();

-- Limitar a una sola fila (debe crearse ANTES del INSERT)
CREATE OR REPLACE FUNCTION enforce_singleton_chatbot_config()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT count(*) FROM chatbot_config) >= 1 THEN
    RAISE EXCEPTION 'chatbot_config only allows one row';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_singleton ON chatbot_config;
CREATE TRIGGER enforce_singleton
  BEFORE INSERT ON chatbot_config
  FOR EACH ROW
  EXECUTE FUNCTION enforce_singleton_chatbot_config();

-- Insertar fila por defecto SOLO si la tabla está vacía
INSERT INTO chatbot_config (id)
SELECT gen_random_uuid()
WHERE NOT EXISTS (SELECT 1 FROM chatbot_config);

-- RLS: lectura pública (para el widget), escritura solo autenticados
ALTER TABLE chatbot_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chatbot_config_read" ON chatbot_config;
CREATE POLICY "chatbot_config_read" ON chatbot_config
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "chatbot_config_write" ON chatbot_config;
CREATE POLICY "chatbot_config_write" ON chatbot_config
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
