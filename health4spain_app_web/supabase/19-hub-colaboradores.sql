-- =============================================
-- HEALTH4SPAIN · HUB COLABORADORES (B2E interno)
-- =============================================
-- Cuadro de mando interno del equipo comercial. NO es la web pública.
-- Modela SOLO lo que es source-of-truth del Hub (según Blueprint Web Javi v1.0):
--   · usuarios internos y roles
--   · configuración de comisiones (terna closer × compañía × producto)
--   · liquidaciones de aseguradoras cargadas por CSV (Spec multi-compañía v1.0)
--   · líneas de liquidación asignadas a closers
--   · snapshots CVR (se poblarán cuando GHL entregue datos reales)
--   · audit log inmutable
--   · idempotencia de webhooks GHL
--
-- Lo que NO modelamos (vive en GoHighLevel, lo mantiene Claudia):
--   leads, contactos, oportunidades, tareas, comunicaciones.
--
-- Convenciones del proyecto (idénticas a 16-partner-leads.sql):
--   · snake_case + plural. Prefijo `hub_` para agrupar el subsistema interno
--     y no mezclarlo con las tablas de la web pública (leads, partner_leads…).
--   · RLS activada. El acceso operativo va por APIs server-side con
--     SUPABASE_SERVICE_ROLE_KEY (bypassa RLS). anon NO lee nada.
--   · Trigger updated_at en cada tabla mutable.
-- =============================================


-- =============================================
-- 1. hub_users · miembros internos del equipo
-- =============================================
-- Un registro por persona del equipo H4S/COASEMED que accede al Hub.
-- Se enlaza con Supabase Auth (auth_user_id) y con GHL (ghl_user_id).
CREATE TABLE IF NOT EXISTS hub_users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Identidad
  nombre text NOT NULL,
  email text NOT NULL UNIQUE,
  nif text,                                  -- para liquidaciones / IRPF
  iban text,                                 -- para export contable

  -- Rol jerárquico (Blueprint §04)
  rol text NOT NULL DEFAULT 'closer' CHECK (rol IN (
    'admin',        -- Adolfo · control total
    'supervisor',   -- Ana · su equipo
    'tecnico',      -- Claudia · integraciones GHL
    'closer'        -- Tamara, Noelia… · operativa
  )),

  -- Canal del closer (afecta al reparto de comisión: interno 30% / externo 40%)
  canal text DEFAULT 'interno' CHECK (canal IN ('interno', 'externo')),

  -- Jerarquía: a qué supervisor reporta (NULL para admin/supervisor raíz)
  supervisor_id uuid REFERENCES hub_users(id) ON DELETE SET NULL,

  -- Productos que tiene permiso para trabajar (asignación)
  productos_asignados text[] DEFAULT ARRAY[]::text[],

  -- Enlaces externos
  auth_user_id uuid,                         -- id en Supabase Auth (login)
  ghl_user_id text,                          -- id del user en GoHighLevel

  -- Estado
  activo boolean NOT NULL DEFAULT true,

  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS hub_users_email_idx       ON hub_users (lower(email));
CREATE INDEX IF NOT EXISTS hub_users_rol_idx         ON hub_users (rol);
CREATE INDEX IF NOT EXISTS hub_users_supervisor_idx  ON hub_users (supervisor_id);
CREATE INDEX IF NOT EXISTS hub_users_ghl_idx         ON hub_users (ghl_user_id) WHERE ghl_user_id IS NOT NULL;


-- =============================================
-- 2. hub_companies · catálogo de aseguradoras
-- =============================================
-- Cada compañía con la que se liquidan comisiones. El parser CSV se elige
-- por `parser_key` (Spec multi-compañía §3.8: arquitectura de adaptadores).
CREATE TABLE IF NOT EXISTS hub_companies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,                  -- 'asisa', 'lbs', 'aegon'…
  nombre text NOT NULL,                       -- 'ASISA', 'LBS Seguros'…
  parser_key text NOT NULL DEFAULT 'generic', -- adaptador que normaliza su CSV
  -- Régimen de cobro por defecto (puede sobreescribirse por producto):
  --   n+1 = cobro mes siguiente · n+2 = cobro dos meses después
  regimen_default text NOT NULL DEFAULT 'n+1' CHECK (regimen_default IN ('n+1', 'n+2')),
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS hub_companies_slug_idx ON hub_companies (slug);


-- =============================================
-- 3. hub_commission_config · % por terna closer × compañía × producto
-- =============================================
-- Spec multi-compañía §3.3: el % a aplicar es personalizado por la terna.
-- Editable por Admin sin redeploy (Blueprint §03: "EDITABLE por Admin").
CREATE TABLE IF NOT EXISTS hub_commission_config (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,

  hub_user_id uuid NOT NULL REFERENCES hub_users(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES hub_companies(id) ON DELETE CASCADE,
  producto text NOT NULL,                     -- 'ASISA Particulares', 'Decesos'…

  -- % que se lleva el closer sobre la comisión bruta liquidada por la compañía.
  pct_closer numeric(6,3) NOT NULL DEFAULT 0 CHECK (pct_closer >= 0 AND pct_closer <= 100),

  -- Régimen de cobro específico de esta terna (NULL = usar el de la compañía).
  regimen text CHECK (regimen IS NULL OR regimen IN ('n+1', 'n+2')),

  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),

  UNIQUE (hub_user_id, company_id, producto)
);

CREATE INDEX IF NOT EXISTS hub_commission_config_user_idx    ON hub_commission_config (hub_user_id);
CREATE INDEX IF NOT EXISTS hub_commission_config_company_idx ON hub_commission_config (company_id);


-- =============================================
-- 4. hub_csv_uploads · ficheros de liquidación cargados
-- =============================================
-- Spec multi-compañía §3.1: idempotencia por hash + periodo + compañía.
CREATE TABLE IF NOT EXISTS hub_csv_uploads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,

  company_id uuid NOT NULL REFERENCES hub_companies(id) ON DELETE RESTRICT,
  periodo text NOT NULL,                      -- 'MM-YYYY' (PER. LIQUIDACION)

  -- SHA-256 del contenido del fichero. La combinación con periodo+compañía
  -- evita doble carga del mismo extracto.
  file_hash text NOT NULL,
  filename text NOT NULL,

  -- Métricas de la carga
  n_lineas integer NOT NULL DEFAULT 0,
  n_lineas_validas integer NOT NULL DEFAULT 0,
  n_lineas_error integer NOT NULL DEFAULT 0,
  total_comision_bruta numeric(14,2) NOT NULL DEFAULT 0,

  -- Auditoría
  uploaded_by_email text,
  estado text NOT NULL DEFAULT 'cargado' CHECK (estado IN (
    'cargado',      -- parseado y almacenado
    'asignando',    -- en proceso de asignación manual
    'cerrado',      -- todas las líneas asignadas y liquidación cerrada
    'anulado'       -- carga descartada
  )),

  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),

  UNIQUE (company_id, periodo, file_hash)
);

CREATE INDEX IF NOT EXISTS hub_csv_uploads_company_periodo_idx ON hub_csv_uploads (company_id, periodo);


-- =============================================
-- 5. hub_liquidacion_lineas · cada línea del CSV asignable a un closer
-- =============================================
-- Spec multi-compañía §3.2 / §3.3 / §3.4. Esquema interno común
-- (normalizado desde cualquier compañía) + raw original para trazabilidad.
CREATE TABLE IF NOT EXISTS hub_liquidacion_lineas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,

  csv_upload_id uuid NOT NULL REFERENCES hub_csv_uploads(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES hub_companies(id) ON DELETE RESTRICT,
  periodo text NOT NULL,                      -- 'MM-YYYY'

  -- ===== Esquema interno común (normalizado de las 25 col. ASISA) =====
  nif_agente text,
  nombre_agente text,
  cliente text,
  producto text,                              -- de RAZON SOCIAL (mapeable)
  subramo text,                               -- puede ser 'VACIO' literal
  poliza text,
  asegurado text,
  fecha_desde date,                           -- NULL válido en ANUAL
  fecha_hasta date,                           -- NULL válido en ANUAL
  prima_neta numeric(14,2),
  comision_bruta numeric(14,2) NOT NULL DEFAULT 0,   -- col 14 COMISION
  comision_pct_compania numeric(8,3),         -- col 15 COMISION %
  ref_externa text,

  -- Raw original completo de la fila (fidelidad total para auditoría)
  raw jsonb NOT NULL DEFAULT '{}'::jsonb,

  -- ===== Asignación manual asistida (§3.3) =====
  -- Una póliza puede repartirse entre varios closers: cada reparto es una
  -- fila hija con su pct_reparto (suma 100% por línea-origen). En el caso
  -- simple (1 closer) hay una sola fila con pct_reparto=100.
  hub_user_id uuid REFERENCES hub_users(id) ON DELETE SET NULL,  -- closer asignado
  pct_reparto numeric(6,3) NOT NULL DEFAULT 100 CHECK (pct_reparto >= 0 AND pct_reparto <= 100),
  pct_closer numeric(6,3),                    -- % aplicado (de commission_config)
  assigned_by_email text,
  assigned_at timestamptz,

  -- ===== Cálculo de comisión =====
  comision_neta numeric(14,2),                -- bruta × pct_reparto × pct_closer + bonus
  bonus_cvr numeric(14,2) DEFAULT 0,
  irpf_pct numeric(6,3) NOT NULL DEFAULT 15,  -- parametrizable
  irpf_importe numeric(14,2),
  neto_pagar numeric(14,2),

  -- ===== Régimen y estado (§3.4) =====
  regimen text CHECK (regimen IS NULL OR regimen IN ('n+1', 'n+2')),
  fecha_cobro_estimada date,
  estado text NOT NULL DEFAULT 'consolidandose' CHECK (estado IN (
    'consolidandose',   -- en proceso de validación, aún no asignada al estado final
    'acumulado',        -- asignada, pendiente de cobro según régimen
    'cobrado',          -- compañía pagó, liquidación cerrada, closer cobró
    'liquidada'         -- pagada al closer (estado final)
  )),

  liquidacion_id uuid,                        -- FK a hub_liquidaciones (se setea al cerrar mes)

  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS hub_liq_lineas_upload_idx    ON hub_liquidacion_lineas (csv_upload_id);
CREATE INDEX IF NOT EXISTS hub_liq_lineas_user_idx      ON hub_liquidacion_lineas (hub_user_id);
CREATE INDEX IF NOT EXISTS hub_liq_lineas_estado_idx    ON hub_liquidacion_lineas (estado);
CREATE INDEX IF NOT EXISTS hub_liq_lineas_periodo_idx   ON hub_liquidacion_lineas (periodo);
CREATE INDEX IF NOT EXISTS hub_liq_lineas_poliza_idx    ON hub_liquidacion_lineas (poliza);
CREATE INDEX IF NOT EXISTS hub_liq_lineas_liq_idx       ON hub_liquidacion_lineas (liquidacion_id) WHERE liquidacion_id IS NOT NULL;


-- =============================================
-- 6. hub_liquidaciones · nómina mensual por closer
-- =============================================
-- Agregado mensual con workflow de 6 estados (Visión Flujos §06).
CREATE TABLE IF NOT EXISTS hub_liquidaciones (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,

  hub_user_id uuid NOT NULL REFERENCES hub_users(id) ON DELETE RESTRICT,
  periodo text NOT NULL,                      -- 'MM-YYYY'

  -- Totalizadores (congelados al cerrar el mes)
  total_bruto numeric(14,2) NOT NULL DEFAULT 0,
  total_irpf numeric(14,2) NOT NULL DEFAULT 0,
  total_neto numeric(14,2) NOT NULL DEFAULT 0,
  n_lineas integer NOT NULL DEFAULT 0,

  -- Workflow de estados (Visión Flujos §06)
  estado text NOT NULL DEFAULT 'pendiente' CHECK (estado IN (
    'pendiente',             -- mes en curso, acumula items
    'pendiente_aprobacion',  -- cron día 1, espera supervisor
    'aprobada',              -- validada por supervisor
    'elegible',              -- reconciliada con extracto compañía (admin)
    'liquidada',             -- pagada al closer (final)
    'rechazada'              -- bloqueada por disputa o error
  )),

  -- Auditoría del workflow
  aprobada_por_email text,
  aprobada_at timestamptz,
  pagada_at timestamptz,
  pago_referencia text,                       -- ref. transferencia bancaria
  comentario text,

  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),

  UNIQUE (hub_user_id, periodo)
);

CREATE INDEX IF NOT EXISTS hub_liquidaciones_user_idx    ON hub_liquidaciones (hub_user_id);
CREATE INDEX IF NOT EXISTS hub_liquidaciones_periodo_idx ON hub_liquidaciones (periodo);
CREATE INDEX IF NOT EXISTS hub_liquidaciones_estado_idx  ON hub_liquidaciones (estado);

-- FK diferida de líneas → liquidaciones (se crea ahora que existe la tabla)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'hub_liq_lineas_liquidacion_fk'
  ) THEN
    ALTER TABLE hub_liquidacion_lineas
      ADD CONSTRAINT hub_liq_lineas_liquidacion_fk
      FOREIGN KEY (liquidacion_id) REFERENCES hub_liquidaciones(id) ON DELETE SET NULL;
  END IF;
END $$;


-- =============================================
-- 7. hub_snapshots_cvr · foto diaria del CVR por closer
-- =============================================
-- Visión Flujos §04. Se poblará cuando GHL entregue leads reales.
CREATE TABLE IF NOT EXISTS hub_snapshots_cvr (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  hub_user_id uuid NOT NULL REFERENCES hub_users(id) ON DELETE CASCADE,
  fecha date NOT NULL DEFAULT CURRENT_DATE,
  leads_recibidos_30d integer NOT NULL DEFAULT 0,
  leads_cerrados_30d integer NOT NULL DEFAULT 0,
  cvr numeric(6,2) NOT NULL DEFAULT 0,        -- (cerrados/recibidos)*100
  nivel text CHECK (nivel IN ('elite', 'optimo', 'objetivo', 'minimo', 'riesgo')),
  bonus_pct numeric(5,3) NOT NULL DEFAULT 0,  -- +1 / +0.5 / +0.25 / 0
  created_at timestamptz NOT NULL DEFAULT NOW(),
  UNIQUE (hub_user_id, fecha)
);

CREATE INDEX IF NOT EXISTS hub_snapshots_cvr_user_fecha_idx ON hub_snapshots_cvr (hub_user_id, fecha DESC);


-- =============================================
-- 8. hub_audit_log · registro inmutable de acciones sensibles
-- =============================================
-- Blueprint §07 + Spec multi-compañía §3.7. Append-only.
CREATE TABLE IF NOT EXISTS hub_audit_log (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ts timestamptz NOT NULL DEFAULT NOW(),
  actor_email text,
  actor_rol text,
  ip_address inet,
  action text NOT NULL,                       -- 'csv_upload','linea_asignada','liquidacion_aprobada'…
  resource_type text,                         -- 'hub_csv_uploads','hub_liquidacion_lineas'…
  resource_id text,
  metadata jsonb DEFAULT '{}'::jsonb,         -- estado_anterior/estado_nuevo, razón…
  result text DEFAULT 'ok'
);

CREATE INDEX IF NOT EXISTS hub_audit_log_ts_idx       ON hub_audit_log (ts DESC);
CREATE INDEX IF NOT EXISTS hub_audit_log_action_idx   ON hub_audit_log (action);
CREATE INDEX IF NOT EXISTS hub_audit_log_resource_idx ON hub_audit_log (resource_type, resource_id);


-- =============================================
-- 9. hub_processed_events · idempotencia de webhooks GHL
-- =============================================
-- Blueprint §06. Evita procesar dos veces el mismo evento.
CREATE TABLE IF NOT EXISTS hub_processed_events (
  event_id text PRIMARY KEY,
  event_type text,
  received_at timestamptz NOT NULL DEFAULT NOW()
);


-- =============================================
-- Triggers updated_at (uno por tabla mutable)
-- =============================================
CREATE OR REPLACE FUNCTION hub_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS hub_users_updated_at ON hub_users;
CREATE TRIGGER hub_users_updated_at BEFORE UPDATE ON hub_users
  FOR EACH ROW EXECUTE FUNCTION hub_set_updated_at();

DROP TRIGGER IF EXISTS hub_companies_updated_at ON hub_companies;
CREATE TRIGGER hub_companies_updated_at BEFORE UPDATE ON hub_companies
  FOR EACH ROW EXECUTE FUNCTION hub_set_updated_at();

DROP TRIGGER IF EXISTS hub_commission_config_updated_at ON hub_commission_config;
CREATE TRIGGER hub_commission_config_updated_at BEFORE UPDATE ON hub_commission_config
  FOR EACH ROW EXECUTE FUNCTION hub_set_updated_at();

DROP TRIGGER IF EXISTS hub_csv_uploads_updated_at ON hub_csv_uploads;
CREATE TRIGGER hub_csv_uploads_updated_at BEFORE UPDATE ON hub_csv_uploads
  FOR EACH ROW EXECUTE FUNCTION hub_set_updated_at();

DROP TRIGGER IF EXISTS hub_liquidacion_lineas_updated_at ON hub_liquidacion_lineas;
CREATE TRIGGER hub_liquidacion_lineas_updated_at BEFORE UPDATE ON hub_liquidacion_lineas
  FOR EACH ROW EXECUTE FUNCTION hub_set_updated_at();

DROP TRIGGER IF EXISTS hub_liquidaciones_updated_at ON hub_liquidaciones;
CREATE TRIGGER hub_liquidaciones_updated_at BEFORE UPDATE ON hub_liquidaciones
  FOR EACH ROW EXECUTE FUNCTION hub_set_updated_at();


-- =============================================
-- RLS · Row Level Security
-- =============================================
-- Igual que partner_leads: el servidor (service role) tiene acceso total y lo
-- usan las APIs /api/hub/*. anon NO puede leer ni escribir nada directamente.
-- La jerarquía por rol (closer ve lo suyo, supervisor su equipo, admin todo)
-- se aplica en la capa de API, no en RLS, porque el login del Hub usa
-- Supabase Auth pero la autorización fina vive en hub_users.rol.
ALTER TABLE hub_users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE hub_companies          ENABLE ROW LEVEL SECURITY;
ALTER TABLE hub_commission_config  ENABLE ROW LEVEL SECURITY;
ALTER TABLE hub_csv_uploads        ENABLE ROW LEVEL SECURITY;
ALTER TABLE hub_liquidacion_lineas ENABLE ROW LEVEL SECURITY;
ALTER TABLE hub_liquidaciones      ENABLE ROW LEVEL SECURITY;
ALTER TABLE hub_snapshots_cvr      ENABLE ROW LEVEL SECURITY;
ALTER TABLE hub_audit_log          ENABLE ROW LEVEL SECURITY;
ALTER TABLE hub_processed_events   ENABLE ROW LEVEL SECURITY;

-- Bloqueo total a anon en todas las tablas del Hub.
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'hub_users','hub_companies','hub_commission_config','hub_csv_uploads',
    'hub_liquidacion_lineas','hub_liquidaciones','hub_snapshots_cvr',
    'hub_audit_log','hub_processed_events'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I_no_anon_all ON %I;', t, t);
    EXECUTE format(
      'CREATE POLICY %I_no_anon_all ON %I FOR ALL TO anon USING (false) WITH CHECK (false);',
      t, t
    );
  END LOOP;
END $$;


-- =============================================
-- Vistas de apoyo
-- =============================================

-- Resumen de comisiones por closer y estado (para vista "Mis Comisiones" §3.4).
CREATE OR REPLACE VIEW hub_comisiones_por_closer AS
SELECT
  l.hub_user_id,
  u.nombre        AS closer_nombre,
  l.periodo,
  l.estado,
  COUNT(*)                          AS n_lineas,
  COALESCE(SUM(l.comision_neta), 0) AS total_bruto,
  COALESCE(SUM(l.irpf_importe), 0)  AS total_irpf,
  COALESCE(SUM(l.neto_pagar), 0)    AS total_neto
FROM hub_liquidacion_lineas l
JOIN hub_users u ON u.id = l.hub_user_id
GROUP BY l.hub_user_id, u.nombre, l.periodo, l.estado;


-- =============================================
-- Seed mínimo · compañías iniciales
-- =============================================
INSERT INTO hub_companies (slug, nombre, parser_key, regimen_default) VALUES
  ('asisa', 'ASISA', 'asisa', 'n+2'),
  ('lbs',   'LBS Seguros', 'generic', 'n+1')
ON CONFLICT (slug) DO NOTHING;


-- =============================================
-- Notas operativas
-- =============================================
-- 1. Asignación de una línea a un closer (§3.3):
--      UPDATE hub_liquidacion_lineas SET
--        hub_user_id = '<closer>', pct_reparto = 100, pct_closer = <%>,
--        assigned_by_email = '<admin>', assigned_at = NOW(),
--        estado = 'acumulado'
--      WHERE id = '<linea>';
--    El cálculo de comision_neta/irpf/neto lo hace la API (src/lib/hub).
--
-- 2. Reparto múltiple de una póliza: se duplica la línea origen en N filas,
--    cada una con su hub_user_id y pct_reparto; la suma de pct_reparto = 100.
--
-- 3. Cierre mensual: crea/actualiza hub_liquidaciones, vincula líneas vía
--    liquidacion_id y congela totalizadores; estado → 'pendiente_aprobacion'.
--
-- 4. Audit: toda acción sensible inserta en hub_audit_log (append-only).
-- =============================================
