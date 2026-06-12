# 🤝 Partners · Fase 1 · Captación, cualificación y firma

> **Documento técnico-operativo del módulo de captación de partners (B2B).**
> Versión: v1 · 5 mayo 2026
> Cubre: Acceso 1 (landing pública), cualificación humana (admin), Acceso 2 (panel privado tras token), solicitud de contrato Founding y operativa diaria del closer.

---

## 0. Contexto en una página

Health4Spain monetiza **vendiendo plazas a profesionales** (abogados, gestorías, inmobiliarias, agencias de seguros). Para que esto funcione necesitamos un **funnel de captación de partners** propio, separado del flujo público de leads de cliente final.

Esta Fase 1 entrega ese funnel completo end-to-end **sin integraciones externas pesadas** (Signaturit, Stripe, GoCardless, Calendly se difieren a v1.5/v2). Todo el proceso de pago y firma se gestiona **manualmente fuera de la app** durante v0:

```
[Acceso 1 público]                            [Acceso 2 privado]
                          (closer humano)
landing /es/partners → lead en BD → cualificación → token (UUID, 7d) → panel ROI/configurador → solicitud contrato → pack legal manual
                              ↑                       ↑
                       /administrator/partners      copia URL al WhatsApp del partner
```

> **Diferencia con `MODELO_PARTNERS_LEADS.md`:** ese doc describe la operativa post-firma (lead → asignación → facturación → panel del partner activo). Este doc cubre **lo que hay antes**: cómo conseguimos que el partner firme.

---

## 1. Arquitectura

### 1.1 Capas

| Capa | Archivos clave |
|------|----------------|
| BD (Supabase) | `supabase/16-partner-leads.sql` |
| Tipos / dominio | `src/lib/types.ts` (`PartnerLead`, `PartnerPlan`, `PartnerTier`, …) |
| Lógica de negocio | `src/lib/partners.ts` (precios, descuentos, ciudades→tier, ROI) |
| API pública (form + token) | `src/app/api/partners/leads/route.ts`, `src/app/api/partners/access/[token]/route.ts`, `src/app/api/partners/contract-request/route.ts` |
| API admin | `src/app/api/partners/leads/route.ts` (GET), `src/app/api/partners/qualify/route.ts` |
| Frontend público (Acceso 1) | `src/app/es/partners/page.tsx`, `src/app/es/partners/PartnersFormClient.tsx`, `src/app/es/partners/gracias/page.tsx` |
| Frontend privado (Acceso 2) | `src/app/es/partners/acceso/page.tsx`, `src/app/es/partners/acceso/PartnerAccessClient.tsx`, `src/app/es/partners/acceso/contrato/page.tsx` |
| Admin H4S | `src/app/administrator/partners/page.tsx` (listado + acciones) + entrada en `src/app/administrator/layout.tsx` |
| Routing / i18n | `src/lib/routes.ts` (clave `partners`), `src/lib/dictionaries.ts` (`footer.forPartners`), `src/components/Footer.tsx` |

### 1.2 Diagrama de secuencia

```
Partner (web)             Closer (admin)            Sistema
    │                           │                      │
    │  POST /api/partners/leads │                      │
    ├──────────────────────────────────────────────────►
    │                           │                      │  insert partner_leads
    │                           │                      │  stage = 'solicitud_recibida'
    │  → /es/partners/gracias   │                      │
    │                           │                      │
    │                           │  GET /api/partners/leads (admin)
    │                           ├──────────────────────►
    │                           │                      │
    │                           │  POST /api/partners/qualify
    │                           │  { id, action: 'qualify', tipo: 'A' }
    │                           ├──────────────────────►
    │                           │                      │  update partner_leads
    │                           │                      │  cualificacion_tipo = 'A'
    │                           │                      │  access_token = UUID v4
    │                           │                      │  access_token_expires_at = now()+7d
    │                           │                      │  stage = 'cualificado'
    │                           │  ← access_url        │
    │                           │  (copiada al portapapeles)
    │  ← URL via WhatsApp/email │                      │
    │                           │                      │
    │  GET /api/partners/access/[token]                │
    ├──────────────────────────────────────────────────►
    │                           │                      │  validar token (no caducado, not 'rechazado')
    │  ← datos saneados         │                      │  upsert access_first_seen_at / last_seen_at
    │                           │                      │
    │  POST /api/partners/contract-request             │
    │  { token, plan, verticales, founding }           │
    ├──────────────────────────────────────────────────►
    │                           │                      │  update partner_leads
    │                           │                      │  contract_plan/tier/verticales/founding
    │                           │                      │  contract_requested_at = NOW()
    │                           │                      │  stage = 'contrato_solicitado'
    │  → /es/partners/acceso/contrato                  │
    │                           │                      │
    │                           │  (offline) prepara pack legal y firma manual
    │                           │                      │
    │                           │  POST /api/partners/qualify
    │                           │  { id, action: 'set_stage', stage: 'contratado' }
    │                           ├──────────────────────►
```

---

## 2. Base de datos · `partner_leads`

Migración: **`supabase/16-partner-leads.sql`** (208 líneas, idempotente).

### 2.1 Estructura (resumen funcional)

| Bloque | Campos | Para qué |
|--------|--------|----------|
| **Identificación** | `id`, `nombre`, `empresa`, `email`, `telefono` | Datos del formulario |
| **Servicio** | `servicio` (`seguros`/`abogados`/`inmobiliarias`/`gestorias`), `ciudad_principal`, `ciudad_es_estrategica` | Qué presta y dónde |
| **Cualificación auto** | `anos_ejerciendo`, `pct_cartera_extranjera` (`menos_10`/`10_30`/`30_60`/`mas_60`), `idiomas[]`, `about` | Pre-scoring del closer |
| **Atribución** | `source` (default `web_acceso1`), `landing_page`, `utm_source`, `utm_medium`, `utm_campaign`, `ip_address`, `user_agent` | Marketing |
| **Funnel** | `stage` (8 valores, ver §2.2), `cualificacion_tipo` (`A`/`B`/`C`), `cualificacion_notas`, `cualificado_por_email`, `cualificado_at` | Estado y notas del closer |
| **Token de acceso** | `access_token` (UUID, único), `access_token_expires_at` (TTL 7 días), `access_first_seen_at`, `access_last_seen_at` | Magic link a Acceso 2 |
| **Selección de contrato** | `contract_plan` (`ACTIVA`/`CRECE`/`ESCALA`/`LIDERA`), `contract_tier` (`A`/`B`/`C`), `contract_verticales[]`, `contract_zonas_adicionales[]`, `contract_founding`, `contract_notes`, `contract_requested_at` | Lo que el partner pide firmar |
| **Hitos post-firma** | `signed_at`, `setup_started_at`, `first_lead_delivered_at` | Tracking onboarding manual |
| **GDPR / auditoría** | `privacy_accepted`, `privacy_accepted_at`, `created_at`, `updated_at` | Trazabilidad |

> **Decisión de diseño:** **una sola tabla** que acompaña al partner desde el formulario hasta la firma. Cuando esté firmado y operativo se promocionará a `partners` (entidad operativa con leads, facturación, etc., que vive en `MODELO_PARTNERS_LEADS.md`).

### 2.2 Estados (`stage`)

```
solicitud_recibida   ← creada por POST /api/partners/leads
        │
        ▼
   en_revision       ← (opcional) closer inicia análisis
        │
        ├─► llamada_agendada     ← (opcional) cita con Calendly/manual
        │
        ▼
   cualificado       ← qualify A/B/C → token generado
        │
        ├─► rechazado            ← qualify reject (token invalidado)
        │
        ▼
contrato_solicitado  ← partner pulsó "Solicitar contrato Founding"
        │
        ▼
   contratado        ← (manual) tras firma offline + setup
        │
        ▼
       baja          ← terminación del contrato
```

### 2.3 Índices y RLS

* Índices: `created_at DESC`, `email`, `stage`, `servicio`, `ciudad_principal`, `access_token UNIQUE`.
* RLS: **deny all** a `anon` y a `authenticated`. Solo `service_role` (back-end) puede leer/escribir. El frontend admin nunca toca la tabla directamente; pasa por las API routes con `validateAdminAuth`.
* Vista de apoyo: `admin_partner_leads_overview` (sin PII sensible, para queries rápidas/dashboards futuros).

---

## 3. Lógica de negocio · `src/lib/partners.ts`

### 3.1 Tarifas Tier × Plan (€/mes)

> **Las plazas de Activa/Crece/Escala son COMPARTIDAS** (varios partners por zona). Solo **Lidera** otorga exclusividad geográfica, y se desbloquea por trayectoria (mín. 21 meses + KPIs), no por dinero.

| Plan / Tier | A · Premium | B · Medio | C · Desarrollo |
|-------------|-------------|-----------|----------------|
| ACTIVA  | 290 € | 200 € | 130 € |
| CRECE   | 590 € | 420 € | 290 € |
| ESCALA  | 990 € | 720 € | 490 € |
| LIDERA  | 1.690 € | 1.250 € | 850 € |

| Plan | Leads/mes incluidos | Coste por lead extra | Desbloqueo |
|------|---------------------|----------------------|------------|
| ACTIVA | 8 | 35 € | Plan de entrada |
| CRECE | 18 | 25 € | Tras 3-6 meses (KPIs) |
| ESCALA | 35 | 18 € | Tras 9-12 meses |
| LIDERA | ilimitado | 0 € | Tras 21+ meses + performance |

### 3.2 Mapeo ciudades → tier (las 19 estratégicas pactadas)

| Tier A · Premium | Tier B · Medio | Tier C · Desarrollo |
|------------------|----------------|---------------------|
| Alicante, Murcia, Torrevieja, Benidorm, Cartagena | Elche, Orihuela, Lorca, Dénia, Molina de Segura, San Pedro del Pinatar, Torre Pacheco | Mazarrón, San Javier, Águilas, Cieza, Jumilla, Yecla, Rojales |

> **Importante:** ciudades fuera de las 19 → `ciudad_es_estrategica = false` y `tier_sugerido` por defecto (no se mapea automáticamente). El closer decide si abrir esa zona o rechazar. Decisión de cliente (mayo 2026): «las 19 son las pactadas y presupuestadas; si el cliente quiere más, las paga».

### 3.3 Multi-vertical · descuento progresivo

Un partner puede operar varias verticales en su zona (ej. abogado + gestoría). El descuento se aplica sobre el precio base de cada vertical adicional, en orden de prelación:

| Posición | Descuento estándar | Descuento Founding (+5pp) |
|----------|--------------------|----------------------------|
| 1ª (principal) | 0 % | 0 % |
| 2ª | 10 % | 15 % |
| 3ª | 30 % | 35 % |
| 4ª | 40 % | 45 % |

Implementado en `computeMultiVertical(tier, plan, verticales[], founding)`.

### 3.4 Zonas adicionales

* Solo desbloqueable a partir del plan **ESCALA**.
* Coste de cada zona extra = **50 %** del precio base de la zona principal.
* Máximos por plan: ACTIVA 0 · CRECE 0 · ESCALA 2 · LIDERA 5.
* Implementado en `computeExtraZonesCost`.

### 3.5 Founding Partners (10 plazas globales)

* **30 % de descuento** durante 6 meses sobre la cuota mensual.
* +5 puntos porcentuales en descuentos multi-vertical.
* Bloqueo de precio de por vida (no aumenta tras los 6 meses).
* Setup técnico gratuito.
* Constantes: `PARTNER_FOUNDING_DISCOUNT = 0.30`, `PARTNER_FOUNDING_DURATION_MONTHS = 6`, `PARTNER_FOUNDING_TOTAL_SLOTS = 10`.

### 3.6 Calculadora ROI

`computeRoi({ tier, plan, leadsPerMonth, closeRate, ticketAverage, recurrence, founding })` retorna:

```ts
{
  monthlyFee, opsPerMonth, revenueMonth, revenueYear,
  cplMonth, netYear, roi, paybackMonths
}
```

Es la base del módulo interactivo de Acceso 2 (sliders → KPIs en vivo).

### 3.7 Magic link

* `buildPartnerAccessUrl(token, locale='es')` → `https://www.health4spain.com/es/partners/acceso?token=<UUID>`.
* TTL: 7 días (`PARTNER_ACCESS_TOKEN_TTL_DAYS`). Se regenera con `action: 'regenerate_token'`.
* `NEXT_PUBLIC_SITE_URL` se usa como base; en local, fallback a `http://localhost:3000`.

---

## 4. API · referencia rápida

| Endpoint | Auth | Qué hace |
|----------|------|----------|
| `POST /api/partners/leads` | Pública | Crea `partner_leads` desde el formulario público (validación + anti-spam básico). |
| `GET /api/partners/leads` | Admin | Listado paginado con filtros (`stage`, `servicio`, `ciudad`, `search`, `page`, `per_page`). |
| `POST /api/partners/qualify` | Admin | `action`: `qualify` (genera token + cualificacion_tipo), `reject` (invalida token), `regenerate_token`, `set_stage`. |
| `GET /api/partners/access/[token]` | Pública | Valida token y devuelve un subset saneado de PII para Acceso 2. Loguea visitas. |
| `POST /api/partners/contract-request` | Pública (con token) | Guarda selección plan/verticales/founding y mueve a `contrato_solicitado`. |

> El admin web nunca toca Supabase directamente para esta tabla; usa `useAuth().fetchWithAuth()` que añade `Authorization: Bearer <jwt>`. Server-side, `validateAdminAuth(request)` verifica que el email del JWT esté en `ADMIN_EMAILS`.

---

## 5. Frontend público (Acceso 1)

### 5.1 `/es/partners` · landing pública

**Server Component** con metadata SEO + secciones estáticas:

1. Hero con propuesta de valor.
2. Cadena de captura (4-5 pasos: formulario → llamada → contrato → setup → primer lead).
3. Tabla de planes con **precios blureados** (anti-spoiler / anti-fuga competencia).
4. Founding Partner Program (10 plazas, perks, sentido de urgencia).
5. Proceso paso a paso.
6. Formulario (`PartnersFormClient` · Client Component).
7. FAQ.

**Diseño:** sigue el patrón Modern Minimalist del resto del sitio (`section`, `container-base`/`container-narrow`, acento `#3bbdda`).

**Layout jun 2026:** las secciones de 5 pasos («De Google a Tu Agenda») y 4 pasos («Cómo se Accede») usan clases **`partners-steps-grid`** y **`partners-step-card`** (`globals.css`), no `service-grid-2x2` de la home (max 900px + tipografía grande). Evita texto cortado en columnas estrechas.

**CRM:** los `partner_leads` **no** se envían a GoHighLevel en v0; se gestionan en `/administrator/partners`. GHL sigue siendo solo para leads de cliente final.

### 5.2 `/es/partners/gracias` · confirmación honesta

Tras enviar el formulario el usuario aterriza aquí. **No se le simula una "cualificación instantánea"** (lo proponía el cliente con animación CSS); en su lugar le decimos la verdad: «un closer revisará tu perfil y te llamará».

### 5.3 Por qué solo `/es`

En v0 la captación se hace en español: el cliente firma con partners locales y el material legal está en ES. Las rutas `partners` están reservadas en `routes.ts` para los 5 idiomas, pero solo se renderiza en ES. El footer (en cualquier locale) enlaza a `/es/partners` directamente — `t.footer.forPartners` traducido a los 5 idiomas (`Hazte partner` / `Become a partner` / `Devenir partenaire` / `Partner werden` / `Torne-se parceiro`).

---

## 6. Frontend privado (Acceso 2)

### 6.1 `/es/partners/acceso?token=<UUID>` · panel de configuración

**Client Component** (`PartnerAccessClient.tsx`) con 3 bloques:

#### 6.1.1 Tarifas para tu zona
* Pre-cargado con el `tier_sugerido` que el closer asignó.
* 4 cards (ACTIVA/CRECE/ESCALA/LIDERA) con precio base + descuento Founding aplicado en línea.
* Solo `ACTIVA` es **clickable** (es el único contratable de entrada). Los demás muestran el plazo de desbloqueo («tras 3 meses», «tras 9 meses», «por trayectoria 21m+»).
* Selector inferior para simular otros tiers (útil cuando el closer pide cambiar tier en la llamada).

#### 6.1.2 Calculadora ROI
* 4 sliders: leads/mes, tasa de cierre, ticket medio, recurrencia anual.
* 3 KPIs en vivo: revenue/mes, coste H4S, ROI.
* Tabla detallada: ops cerradas, revenue anual, cuota anual, CPL extra, margen neto, payback.
* Defaults inteligentes por servicio (ticket y recurrencia).

#### 6.1.3 Configura tu contratación
* Multi-vertical con 4 cards (1 por servicio). Click → toggle. Reordenable (botón ↑) para fijar la principal.
* Resumen de cuota total con cascada de descuentos.
* Notas para el closer (texto libre, max 2.000 chars).
* CTA «Solicitar contrato Founding» → `POST /api/partners/contract-request` → redirige a `/es/partners/acceso/contrato`.

### 6.2 `/es/partners/acceso/contrato` · confirmación tras solicitud

Mensaje honesto sobre próximos pasos (preparación pack legal, llamada de cierre, firma manual, setup técnico, primer lead). No promete fechas concretas más allá de **48h hábiles** para envío del contrato.

### 6.3 Estados de error

* Token ausente → «Falta el enlace de acceso».
* Token caducado / inválido / partner rechazado → mensaje claro + CTA volver a `/es/partners`.
* Error de red en el POST → permite reintentar (no recarga la página).

---

## 7. Admin · `/administrator/partners`

### 7.1 Listado

Tabla paginada (20/página) con filtros:

* **Búsqueda libre** (Enter): nombre, empresa, email.
* **Estado** (`stage`): los 8 valores.
* **Servicio**: 4 verticales.
* **Ciudad**: las 19 estratégicas (selector poblado desde `CITIES`).

Cada fila muestra: fecha de solicitud, profesional, servicio·ciudad (marca si NO es estratégica), `stage` (con color), tipo de cualificación, estado del token («Vigente» en verde / «Caducado» en gris).

### 7.2 Modal de detalle

Vista de ficha completa. Muestra toda la información introducida por el partner + cualificación + estado del token + selección de contrato (si la hubo).

#### 7.2.1 Acciones rápidas (botones)

| Botón | Acción server | Efecto |
|-------|---------------|--------|
| ✓ Cualificar Tipo A (firma) | `qualify` con tipo A | Genera token UUID, TTL 7d, `stage = cualificado`, copia URL al portapapeles automáticamente. |
| ◐ Cualificar Tipo B (dudoso) | `qualify` con tipo B | Igual que A. |
| ○ Cualificar Tipo C (no encaja) | `qualify` con tipo C | Igual que A pero anota que no encaja. |
| ✕ Rechazar | `reject` | Invalida token, `stage = rechazado`. Pide motivo. |

Tipos A/B/C son una **etiqueta interna del closer**; los tres generan token igualmente (queda a criterio del closer enviar o no el enlace). El sistema no fuerza la decisión.

#### 7.2.2 Token

* Si hay token vigente: muestra URL en monospace, copia con un click, regenerar (invalida el anterior, crea uno nuevo).
* Si caducado: aviso y CTA «Cualificar» / «Regenerar».

#### 7.2.3 Cambio manual de stage

Pills clicables para mover el lead a cualquier estado (útil para registrar firma offline, pasar a contratado, dar de baja…).

### 7.3 Sidebar

Entrada **«Partners»** añadida en `administrator/layout.tsx` con icono propio (siluetas grupales).

---

## 8. Flujo operativo del closer (día a día)

```
Mañana                                      Tarde / siguientes días
─────────                                   ─────────────────────
1. Abre /administrator/partners             6. Llama / WhatsApp al partner
2. Filtra stage = solicitud_recibida        7. Tras la llamada:
3. Abre el primero                             - Si encaja: Cualificar A
4. Lee about/años/cartera/idiomas              - Si dudoso:  Cualificar B
5. Decide:                                     - Si no:      Rechazar
   - ¿Servicio en su zona estratégica?      8. La URL se copia sola al portapapeles
   - ¿% cartera extranjera ≥ 30%?           9. La envía por WhatsApp/email
   - ¿Idiomas relevantes para zona?         10. Espera notificación de
   - ¿Encaja con perfil cliente final?          stage = contrato_solicitado
                                            11. Pasa el lead al equipo legal
                                            12. Tras firma manual:
                                                 set_stage = contratado
```

**SLA interno orientativo:** primera llamada al partner < 24h hábiles desde `solicitud_recibida`. Token enviado el mismo día de la llamada cuando hay encaje.

---

## 9. Seguridad y privacidad

* **PII** (nombre, email, teléfono, empresa) solo accesible vía `service_role` o admins autenticados. RLS bloquea explícitamente a anon y authenticated.
* **Tokens UUID v4 + TTL 7d** para Acceso 2: no exponen PII, no son adivinables, caducan.
* `GET /api/partners/access/[token]` devuelve **subset saneado** (`PartnerAccessPublicData`): solo lo necesario para hidratar el panel; nunca el `id`, ni notas internas, ni cualificación, ni email.
* Visitas al panel privado quedan registradas (`access_first_seen_at`, `access_last_seen_at`) para auditoría.
* `privacy_accepted` y `privacy_accepted_at` se guardan al enviar el formulario.
* Anti-spam básico: validación de campos, longitudes, rate-limit implícito por Vercel + Supabase.

---

## 10. Lo que **NO** está en Fase 1 (deferido)

| Funcionalidad | Por qué se defiere | Cuándo |
|---------------|--------------------|--------|
| Integración GHL para `partner_leads` | El funnel B2B no se confunde con el de cliente final; añadirlo añade fricción operativa al closer sin valor inmediato. | v1 (cuando haya volumen ≥ 30 partners/mes) |
| **Signaturit** firma digital | Coste, integración compleja, baja frecuencia esperada (10-20 firmas/mes). Manual con PDF + DocuSign gratis es suficiente. | v1.5 |
| **Stripe + GoCardless** suscripciones | Pagos manuales SEPA mensual durante v0 (10 partners founding). Auto cuando haya >30 partners. | v2 |
| **Calendly** agendado de llamadas | Manual desde WhatsApp en v0. | v1 (high-impact, low-effort) |
| Email/WhatsApp automatizado al generar token | El closer copia/pega manualmente, lo que añade contacto humano valioso en esta fase. | v1 |
| Traducción del Acceso 1 a EN/FR/DE/PT | Material legal solo en ES. | Cuando haya partners no-españoles |
| Panel privado del partner ya operativo (post-firma) | Es el otro lado del negocio; especificado en `MODELO_PARTNERS_LEADS.md`. | v2 (Fase 2 Partners) |

---

## 11. Despliegue

### 11.1 Aplicar migración SQL

```sql
-- En Supabase SQL Editor
\i supabase/16-partner-leads.sql
```

Es idempotente (`IF NOT EXISTS`, `IF NOT EXISTS` en políticas, etc.). Re-ejecutar es seguro.

### 11.2 Variables de entorno

No requiere variables nuevas. Reutiliza:

* `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
* `NEXT_PUBLIC_SITE_URL` (para `buildPartnerAccessUrl`)
* `ADMIN_EMAILS` / `NEXT_PUBLIC_ADMIN_EMAILS` (para acceso al panel)

### 11.3 Build

`npm run build` debe pasar limpio. Las nuevas rutas en el output:

```
○ /es/partners                              3.58 kB
○ /es/partners/acceso                       7.20 kB
○ /es/partners/acceso/contrato              0.25 kB
○ /es/partners/gracias                      0.25 kB
○ /administrator/partners                   7.91 kB
ƒ /api/partners/access/[token]
ƒ /api/partners/contract-request
ƒ /api/partners/leads
ƒ /api/partners/qualify
```

### 11.4 Smoke test post-deploy

1. Abrir `/es/partners` → enviar formulario con datos de prueba.
2. En Supabase comprobar inserción en `partner_leads`.
3. Login como admin → `/administrator/partners` → ver el lead.
4. Cualificar Tipo A → comprobar URL en portapapeles.
5. Pegar URL en navegador anónimo → ver Acceso 2 con datos correctos.
6. Pulsar «Solicitar contrato Founding» → confirmación + `stage = contrato_solicitado` en BD.
7. En admin: `set_stage = contratado` → desaparece de los filtros activos por defecto.

---

## 12. Métricas a vigilar (cuando entre en producción)

| KPI | Cómo medirlo | Objetivo razonable v0 |
|-----|--------------|------------------------|
| Conversión visita → solicitud | Visitas `/es/partners` vs filas en `partner_leads` | ≥ 3 % |
| Conversión solicitud → cualificado | `cualificado` / `solicitud_recibida` | ≥ 60 % |
| Tasa de uso del token | `access_first_seen_at IS NOT NULL` / tokens emitidos | ≥ 80 % |
| Conversión cualificado → contrato_solicitado | `contrato_solicitado` / `cualificado` | ≥ 40 % |
| Conversión contrato_solicitado → contratado | `contratado` / `contrato_solicitado` | ≥ 70 % |
| TTL token vs first_seen | media (`access_first_seen_at - cualificado_at`) | < 48 h |
| Founding slots restantes | `PARTNER_FOUNDING_TOTAL_SLOTS - count(stage IN contrato_solicitado, contratado, where contract_founding)` | manual hasta agotar 10 |

---

## 13. Referencias cruzadas

* **Modelo de negocio general** → [`docs/MODELO_NEGOCIO.md`](./MODELO_NEGOCIO.md)
* **Operativa post-firma** (asignación de leads, facturación, panel partner activo) → [`docs/MODELO_PARTNERS_LEADS.md`](./MODELO_PARTNERS_LEADS.md)
* **Estado del proyecto** → [`ESTADO_PROYECTO.md`](../ESTADO_PROYECTO.md)
* **Documentación raíz** → [`README.md`](../README.md), [`INDICE_DOCUMENTACION.md`](../INDICE_DOCUMENTACION.md)
* **Migración SQL** → [`supabase/16-partner-leads.sql`](../supabase/16-partner-leads.sql)

---

*Health4Spain · Partners Fase 1 · v1 · 5 mayo 2026.*
