-- =============================================
-- CHAT MESSAGES - Historial de conversaciones del chatbot IA
-- =============================================
-- Cada fila = un intercambio (pregunta del usuario + respuesta de la IA).
-- Ejecutar en Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL,
  user_message text NOT NULL,
  assistant_message text NOT NULL,
  lang text DEFAULT 'es',
  model text,
  rating text CHECK (rating IN ('correcta', 'mejorable', 'erronea')),
  rated_at timestamptz,
  tokens_used integer,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages (session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_lang ON chat_messages (lang);
CREATE INDEX IF NOT EXISTS idx_chat_messages_rating ON chat_messages (rating);

-- RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chat_messages_insert" ON chat_messages;
CREATE POLICY "chat_messages_insert" ON chat_messages
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "chat_messages_read" ON chat_messages;
CREATE POLICY "chat_messages_read" ON chat_messages
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "chat_messages_update" ON chat_messages;
CREATE POLICY "chat_messages_update" ON chat_messages
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
