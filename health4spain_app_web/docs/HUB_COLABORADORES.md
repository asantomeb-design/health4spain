# Hub Colaboradores · Documentación técnica

> **App interna B2E** para el equipo comercial de Health4Spain (closers, supervisores, admin, técnico).  
> Gestiona **comisiones de aseguradoras** (CSV multi-compañía), asignación a closers, IRPF, export contable y justificantes.  
> **Versión:** v1 (junio 2026) · Presupuesto acordado: 3.300 € + IVA (Hub 2.500 + multi-compañía 800)

---

## Alcance implementado

| Módulo | Estado | Notas |
|--------|--------|-------|
| Esquema BD (`19-hub-colaboradores.sql`) | ✅ Producción | 9 tablas + vista `hub_comisiones_por_closer` |
| Auth multi-rol (`hub_users` + Supabase Auth) | ✅ | `/hub/login` · roles: admin, supervisor, tecnico, closer |
| RBAC (`src/lib/hub/permissions.ts`) | ✅ | Capacidades por rol; APIs y UI |
| Motor comisiones / IRPF / CVR (`commissions.ts`) | ✅ | n+1/n+2, bonus CVR (pendiente datos reales) |
| Multi-compañía: parser ASISA + genérico | ✅ | `src/lib/hub/parsers/` |
| Carga CSV + dedup hash | ✅ | `POST /api/hub/liquidaciones/upload` |
| Asignación línea → closer (bulk) | ✅ | `POST /api/hub/liquidaciones/assign` |
| Vista closer (3 estados) | ✅ | `/hub/comisiones` |
| Export CSV contable | ✅ | `GET /api/hub/liquidaciones/export` |
| Justificante imprimible/PDF | ✅ | `GET /api/hub/liquidaciones/justificante` |
| Integraciones GHL (lectura + webhook) | ⏳ Preparado | CVR automático pendiente confirmación Claudia |
| Leads GHL en tiempo real / panel leads Hub | ❌ Bloqueado | Espera credenciales/stages confirmados |

**Resumen para no técnicos:** [`HUB_ESTADO_SENCILLO.md`](../HUB_ESTADO_SENCILLO.md) · PDF reunión: [`docs/reunion-cliente-resumen.pdf`](./reunion-cliente-resumen.pdf)

---

## URLs

| Ruta | Quién | Descripción |
|------|-------|-------------|
| `/hub/login` | Todos | Login (Supabase Auth + resolución `hub_users`) |
| `/hub` | Autenticados | Dashboard por rol |
| `/hub/liquidaciones` | Admin, supervisor | Carga CSV aseguradora |
| `/hub/asignacion` | Admin, supervisor | Asignar líneas a closers |
| `/hub/comisiones` | Closer (+ supervisores) | Mis comisiones (3 estados) |
| `/hub/integraciones` | Admin, técnico | Pipelines/usuarios GHL + URL webhook |

---

## APIs (`/api/hub/*`)

Todas requieren `Authorization: Bearer <supabase_jwt>` salvo el webhook GHL.

| Método | Ruta | Capacidad | Descripción |
|--------|------|-----------|-------------|
| GET | `/api/hub/me` | hub.access | Perfil + rol + capacidades |
| GET | `/api/hub/companies` | hub.access | Aseguradoras activas |
| GET | `/api/hub/users?rol=closer` | liquidaciones.assign | Closers (supervisor: su equipo) |
| POST | `/api/hub/liquidaciones/upload` | liquidaciones.upload_csv | Parsear CSV, dedup, insertar líneas |
| GET | `/api/hub/liquidaciones/lineas` | hub.access | Listado con filtros y alcance por rol |
| POST | `/api/hub/liquidaciones/assign` | liquidaciones.assign | Asignar + calcular comisión |
| GET | `/api/hub/liquidaciones/export` | liquidaciones.export | CSV contable (Manolo) |
| GET | `/api/hub/liquidaciones/justificante` | comisiones.view.own | HTML imprimible por periodo |
| GET | `/api/hub/ghl/pipelines` | integrations.manage | Pipelines + stages GHL |
| GET | `/api/hub/ghl/users` | integrations.manage | Usuarios GHL (mapeo closers) |
| GET/POST | `/api/hub/ghl/webhook` | — | Webhook entrante GHL (secret) |

---

## Base de datos

Migración: **`supabase/19-hub-colaboradores.sql`** (ejecutada en producción junio 2026).

| Tabla | Uso |
|-------|-----|
| `hub_users` | Colaboradores internos (rol, canal, `ghl_user_id`, supervisor) |
| `hub_companies` | Aseguradoras (slug, `parser_key`, régimen default) |
| `hub_commission_config` | % closer por compañía/producto |
| `hub_csv_uploads` | Registro de cargas (hash dedup) |
| `hub_liquidacion_lineas` | Líneas CSV + asignación + cálculo |
| `hub_liquidaciones` | Nómina mensual por closer (workflow 6 estados) |
| `hub_snapshots_cvr` | CVR diario por closer (pendiente poblar) |
| `hub_audit_log` | Auditoría append-only |
| `hub_processed_events` | Idempotencia webhooks GHL |

RLS: **deny all** para `anon`/`authenticated`; acceso vía `service_role` en APIs.

Seed: ASISA + LBS Seguros en `hub_companies`.

---

## Código principal

```
src/lib/hub/
  auth.ts          validateHubAuth()
  permissions.ts   RBAC
  commissions.ts   Motor comisiones, IRPF, CVR, régimen n+1/n+2
  audit.ts         hub_audit_log
  ghl-client.ts    Lectura GHL (reutiliza GHL_PRIVATE_TOKEN)
  parsers/         ASISA (25 col) + genérico

src/hooks/useHubUser.ts
src/app/hub/       SPA
src/app/api/hub/   APIs
```

---

## Variables de entorno (Hub + GHL entrante)

Ver `.env.example` (sección Hub Colaboradores):

```env
GHL_WEBHOOK_SECRET=          # Obligatorio para activar webhook entrante
GHL_STAGE_RECIBIDO=          # UUID stage GHL = lead recibido (CVR)
GHL_STAGE_CERRADO=           # UUID stage GHL = venta cerrada (CVR)
GHL_PIPELINE_SEGUROS=        # Opcional: acotar búsqueda oportunidades
```

Reutiliza **`GHL_PRIVATE_TOKEN`** y **`GHL_LOCATION_ID`** ya configurados para leads.

---

## Diferencia con Partners

| | **Partners** (`/es/partners`) | **Hub** (`/hub`) |
|---|---|---|
| Usuario | Negocio externo (abogado, etc.) | Comercial interno H4S |
| Objetivo | Captar y firmar partners | Pagar comisiones del equipo |
| CRM GHL | **No** (tabla `partner_leads`) | Solo para CVR (pendiente) |
| Doc | `PARTNERS_FASE1_CAPTACION.md` | Este documento |

---

## Pendiente (Claudia / cliente)

1. Confirmar stages GHL: recibido vs cerrado/ganado.
2. Mapeo closer ↔ `ghl_user_id`.
3. Activar webhook POST → `/api/hub/ghl/webhook?secret=...`
4. Poblar `hub_users` en BD (emails + roles) y vincular Supabase Auth.

Tras eso: activar recálculo CVR en webhook y snapshots en `hub_snapshots_cvr`.
