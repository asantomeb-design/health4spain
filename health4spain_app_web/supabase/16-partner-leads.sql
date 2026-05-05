-- =============================================
-- HEALTH4SPAIN · PARTNER LEADS
-- =============================================
-- Tabla única que cubre todo el ciclo del candidato a partner:
--   1) Formulario público (Acceso 1) → fila con stage='solicitud_recibida'
--   2) Llamada de cualificación del closer → genera token y stage='cualificado'
--   3) Acceso al panel privado (Acceso 2) → marca primer acceso
--   4) "Solicitar contrato Founding" → guarda selección plan/verticales/zonas
--   5) Firma manual fuera de la app → stage='contratado' (v1.5)
--
-- Convenciones del proyecto:
--  - El cliente final usa la tabla `leads`. Aquí va el partner-candidato.
--  - Snake_case + plural para nombres de tabla (no mezclamos audiencias).
--  - RLS activada. Inserción pública restringida a campos del formulario.
--  - La gestión completa (cualificar, generar token, ver selección) la hace
--    SUPABASE_SERVICE_ROLE_KEY desde APIs server-side. No exponemos a anon.
-- =============================================

CREATE TABLE IF NOT EXISTS partner_leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,

  -- ===== Datos de contacto (formulario Acceso 1) =====
  nombre text NOT NULL,
  empresa text NOT NULL,
  email text NOT NULL,
  telefono text NOT NULL,

  -- ===== Perfil profesional =====
  servicio text NOT NULL CHECK (servicio IN ('seguros','abogados','inmobiliarias','gestorias')),
  ciudad_principal text NOT NULL,                 -- slug si está en CITIES, texto libre si "otra"
  ciudad_es_estrategica boolean DEFAULT false,    -- true si está en las 19 ciudades del catálogo
  anos_ejerciendo integer CHECK (anos_ejerciendo IS NULL OR anos_ejerciendo BETWEEN 0 AND 80),
  pct_cartera_extranjera text CHECK (
    pct_cartera_extranjera IS NULL OR pct_cartera_extranjera IN (
      'menos_10','10_30','30_60','mas_60'
    )
  ),
  idiomas text[] DEFAULT ARRAY[]::text[],         -- ['es','en','de','fr','pt','nl','ru','sv','no','da','fi','it','pl','ar']
  about text,                                     -- texto libre opcional

  -- ===== Tracking =====
  source text DEFAULT 'web_acceso1',              -- web_acceso1 | manual_admin | referral
  landing_page text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  ip_address inet,
  user_agent text,

  -- ===== Cualificación (admin) =====
  -- stage: estado del candidato en el embudo
  stage text NOT NULL DEFAULT 'solicitud_recibida' CHECK (stage IN (
    'solicitud_recibida',   -- recién enviado el formulario
    'en_revision',          -- closer ha visto el lead
    'llamada_agendada',     -- el partner ha agendado llamada
    'cualificado',          -- llamada hecha y encaja → token generado
    'rechazado',            -- llamada hecha y NO encaja
    'contrato_solicitado',  -- ha pulsado "Solicitar contrato" en Acceso 2
    'contratado',           -- firma manual completada (v1.5)
    'baja'                  -- ex-partner que ha dejado el servicio
  )),
  cualificacion_tipo text CHECK (cualificacion_tipo IS NULL OR cualificacion_tipo IN ('A','B','C')),
  cualificacion_notas text,
  cualificado_por_email text,                     -- email del admin que cualificó
  cualificado_at timestamptz,

  -- ===== Token de acceso al panel privado (Acceso 2) =====
  access_token uuid UNIQUE,                       -- generado al cualificar
  access_token_expires_at timestamptz,            -- por defecto 7 días desde cualificación
  access_first_seen_at timestamptz,               -- primera vez que abrió Acceso 2
  access_last_seen_at timestamptz,                -- última visita

  -- ===== Selección del partner en Acceso 2 ("Solicitar contrato Founding") =====
  contract_plan text CHECK (
    contract_plan IS NULL OR contract_plan IN ('ACTIVA','CRECE','ESCALA','LIDERA')
  ),
  contract_tier text CHECK (
    contract_tier IS NULL OR contract_tier IN ('A','B','C')
  ),
  contract_verticales text[],                     -- ['abogados','seguros',...] en orden de preferencia
  contract_zonas_adicionales text[],              -- slugs de ciudades adicionales (solo si plan >= ESCALA)
  contract_founding boolean DEFAULT false,        -- true si solicita condiciones Founding
  contract_notes text,                            -- notas que añade el partner al pulsar el CTA
  contract_requested_at timestamptz,

  -- ===== Firma y onboarding (v1.5 — manual por ahora) =====
  signed_at timestamptz,
  setup_started_at timestamptz,
  first_lead_delivered_at timestamptz,

  -- ===== Anti-spam y privacidad =====
  privacy_accepted boolean NOT NULL DEFAULT false,
  privacy_accepted_at timestamptz,

  -- ===== Timestamps =====
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS partner_leads_email_idx        ON partner_leads (lower(email));
CREATE INDEX IF NOT EXISTS partner_leads_stage_idx        ON partner_leads (stage);
CREATE INDEX IF NOT EXISTS partner_leads_servicio_idx     ON partner_leads (servicio);
CREATE INDEX IF NOT EXISTS partner_leads_ciudad_idx       ON partner_leads (ciudad_principal);
CREATE INDEX IF NOT EXISTS partner_leads_created_at_idx   ON partner_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS partner_leads_access_token_idx ON partner_leads (access_token) WHERE access_token IS NOT NULL;

-- Trigger updated_at
CREATE OR REPLACE FUNCTION partner_leads_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS partner_leads_updated_at ON partner_leads;
CREATE TRIGGER partner_leads_updated_at
  BEFORE UPDATE ON partner_leads
  FOR EACH ROW EXECUTE FUNCTION partner_leads_set_updated_at();

-- =============================================
-- RLS · Row Level Security
-- =============================================
-- Política:
--   - El servidor (service role) tiene acceso total. Lo usa /api/partners/*.
--   - El cliente público (anon) NO puede leer nada de partner_leads.
--   - El cliente público NO puede insertar directamente: pasa por /api/partners/leads
--     que valida y usa service role. Esto evita formularios alternativos abusivos.
ALTER TABLE partner_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS partner_leads_no_anon_select ON partner_leads;
CREATE POLICY partner_leads_no_anon_select
  ON partner_leads FOR SELECT
  TO anon
  USING (false);

DROP POLICY IF EXISTS partner_leads_no_anon_insert ON partner_leads;
CREATE POLICY partner_leads_no_anon_insert
  ON partner_leads FOR INSERT
  TO anon
  WITH CHECK (false);

-- Service role no necesita policy explícita: bypass RLS por defecto.

-- =============================================
-- Helpers (vistas)
-- =============================================

-- Vista pública para el dashboard admin: campos seguros + datos derivados.
CREATE OR REPLACE VIEW admin_partner_leads_overview AS
SELECT
  id,
  created_at,
  updated_at,
  stage,
  cualificacion_tipo,
  nombre,
  empresa,
  email,
  telefono,
  servicio,
  ciudad_principal,
  ciudad_es_estrategica,
  anos_ejerciendo,
  pct_cartera_extranjera,
  idiomas,
  contract_plan,
  contract_tier,
  contract_verticales,
  contract_founding,
  contract_requested_at,
  cualificado_at,
  access_token IS NOT NULL                                                AS tiene_token,
  (access_token_expires_at IS NOT NULL AND access_token_expires_at > NOW()) AS token_vigente,
  access_first_seen_at,
  access_last_seen_at,
  signed_at
FROM partner_leads;

-- =============================================
-- Notas operativas
-- =============================================
-- 1. Generación del token:
--      UPDATE partner_leads SET
--        access_token = gen_random_uuid(),
--        access_token_expires_at = NOW() + INTERVAL '7 days',
--        stage = 'cualificado',
--        cualificado_at = NOW(),
--        cualificado_por_email = '<admin>',
--        cualificacion_tipo = 'A'
--      WHERE id = '<lead_id>';
--
-- 2. URL del partner:
--      https://www.health4spain.com/es/partners/acceso?token=<access_token>
--
-- 3. Validación en API (/api/partners/access/[token]):
--      SELECT ... FROM partner_leads
--       WHERE access_token = $1
--         AND access_token_expires_at > NOW()
--         AND stage IN ('cualificado','contrato_solicitado','contratado')
--      LIMIT 1;
--
-- 4. Para regenerar token (caducó o se perdió): basta con repetir paso 1.
-- =============================================
