# Health4Spain (H4S)

**Marketplace de Servicios para Extranjeros en España** | 🌍 5 Idiomas | 19 Ciudades | SEO Completo

Health4Spain es una plataforma-marketplace digital que conecta a personas extranjeras con profesionales y servicios especializados en España. Marketplace neutral que facilita el encuentro entre usuarios y profesionales verificados.

---

## 📌 Resumen Ejecutivo

### 1️⃣ **4 Servicios Esenciales**

1. **Seguros de Salud** - Pólizas obligatorias para visados
2. **Abogados** - Familia, civil, laboral, extranjería
3. **Inmobiliarias** - Especialistas en extranjeros
4. **Gestorías** - Trámites y documentación

### 2️⃣ **19 Ciudades Estratégicas**

- **Región de Murcia (12)**: Murcia, Cartagena, Lorca, Mazarrón, Torre Pacheco, San Javier, San Pedro del Pinatar, Molina de Segura, Águilas, Cieza, Jumilla, Yecla
- **Provincia de Alicante (7)**: Alicante, Elche, Torrevieja, Orihuela, Rojales, Benidorm, Dénia

### 3️⃣ **5 Idiomas Completos**

- 🇪🇸 Español (`/es/`) - Idioma base
- 🇬🇧 Inglés (`/en/`)
- 🇫🇷 Francés (`/fr/`)
- 🇩🇪 Alemán (`/de/`)
- 🇵🇹 Portugués (`/pt/`)

### 4️⃣ **176+ landing pages SEO + blog + destinos**

176+ landing pages SEO (76 servicio×ciudad + 100 visa no lucrativa) + blog multiidioma + páginas de destinos

**✅ ESTADO**: Proyecto multi-idioma, SEO completo, **GoHighLevel (CRM: API + webhook único, segmentación por `servicio` / `tipo_ruta`) + leads en español**, panel admin de leads, **módulo Partners Fase 1**, **Hub Colaboradores v1 (comisiones multi-compañía + `/hub`)**, **asistente IA del blog + grupos de traducción (`translation_group_id`) + portadas IA**, **Meta Pixel (Facebook Ads) con consentimiento GDPR**, **guía interactiva vivir en España** (`/guia-vivir-espana.html`), production-ready — **v3.5.0** (12 jun 2026)

---

## 🚀 Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Storage**: Supabase Storage (imágenes WebP)
- **Logo**: Unificado en toda la web con `h4s vertical color_recortado.webp` (header, footer, Open Graph, SEO)
- **Estilos**: Tailwind CSS
- **Editor**: TinyMCE
- **IA**: OpenAI (chat Mar-IA, **asistente blog**: propuestas/redacción/traducción/imagen; modelos configurables en BD; búsqueda noticias vía **`web_search`** nativo)
- **Chat IA (Mar-IA)**: Widget flotante con asistente virtual; detección de idioma en dos agentes; contexto desde Supabase (servicios, ciudades, blog, landings); sin caché para estado activo/inactivo
- **Optimización**: sharp (conversión WebP)
- **i18n**: Sistema híbrido (Supabase dinámico + dictionaries.ts estático)

---

## 📁 Estructura del Proyecto

```
health4spain/
├── src/
│   ├── app/
│   │   ├── api/                    # API Routes (chat, leads, partners/*, blog, admin/blog/ai/*)
│   │   ├── administrator/          # Panel admin (Chat IA, Chat History, Blog + IA, Leads, Partners…)
│   │   ├── es/                     # Rutas español
│   │   │   ├── blog/               # Blog + [slug]
│   │   │   ├── contacto/
│   │   │   ├── destinos/           # Listado + [slug] (19 ciudades)
│   │   │   ├── servicios/          # Listado + [slug] (4 servicios)
│   │   │   ├── solicitar/          # Formulario multi-paso
│   │   │   ├── partners/           # Captación B2B (Acceso 1 público + Acceso 2 privado por token)
│   │   │   └── ...                 # Privacidad, términos, etc.
│   │   ├── en/                     # English (same structure)
│   │   ├── fr/                     # Français
│   │   ├── de/                     # Deutsch
│   │   └── pt/                     # Português
│   ├── components/
│   │   ├── Navigation.tsx          # Navbar con selector idioma
│   │   ├── Footer.tsx              # Footer multiidioma
│   │   ├── HtmlLang.tsx            # Dynamic <html lang="">
│   │   ├── AIChatWidget.tsx        # Chat Mar-IA (widget flotante, avatar chat_ia_logo.jpg)
│   │   ├── CookieConsent.tsx       # GDPR (Análisis + Marketing)
│   │   ├── GoogleAnalytics.tsx     # GA4 + Consent Mode v2
│   │   ├── MetaPixel.tsx           # Meta Pixel (solo tras cookies Marketing)
│   │   ├── LandingFormEmbed.tsx    # Formulario en landings
│   │   └── ServiceIcon.tsx         # Iconos por servicio
│   └── lib/
│       ├── supabase.ts             # Cliente Supabase
│       ├── data.ts                 # Capa de datos compartida (locale-aware)
│       ├── dictionaries.ts         # Traducciones UI (5 idiomas, 200+ claves)
│       ├── routes.ts               # URLs traducidas por idioma
│       ├── seo.tsx                 # SEO helpers (JSON-LD, OG, hreflang, buildBlogAlternates…)
│       ├── blog-locale-switch.ts   # Enlaces de idioma coherentes en /blog/[slug]
│       ├── meta-pixel.ts           # Meta Pixel: load, PageView, Lead
│       ├── services.ts             # RPCs traducidas
│       ├── ciudades.ts             # Funciones ciudades
│       └── partners.ts             # Lógica negocio Partners (precios Tier×Plan, ciudades→tier, multi-vertical, Founding, ROI)
├── scripts/
│   ├── generate-city-content-full.js  # Generador contenido ciudades (guía completa)
│   ├── translate-cities-content.js    # Traductor ciudades (4 idiomas)
│   ├── translate-all.js               # Traductor masivo (blog, landings)
│   ├── generate-landings.ts           # Generador landing pages
│   ├── generate-visa-no-lucrativa-landings.ts  # Generador landings visa no lucrativa
│   └── generate-blog-posts.ts         # Generador blog
├── supabase/
│   ├── schema.sql                     # Esquema principal
│   ├── 07-estructura-completa-multi-idioma.sql
│   ├── 09-expand-ciudades-contenido.sql  # Nuevas secciones guía
│   ├── 10-expand-text-fields.sql         # Campos expandidos
│   ├── 11-chatbot-config.sql             # Configuración Chat IA (singleton)
│   ├── 12-chat-messages.sql              # Historial conversaciones + ratings
│   ├── 13-landing-visa-no-lucrativa.sql       # Landings visa no lucrativa ES+EN
│   ├── 14-landing-visa-no-lucrativa-de-fr-pt.sql  # Landings visa no lucrativa DE+FR+PT
│   ├── 15-ai-blog-config.sql              # Tabla ai_blog_config (asistente IA del blog)
│   ├── 16-partner-leads.sql               # Captación de partners B2B (Fase 1)
│   ├── 17-blog-translation-groups.sql     # translation_group_id en blog_posts + backfill + índices
│   └── 18-ai-blog-model-image-gpt-image-1.5.sql  # model_image → gpt-image-1.5 (+ DEFAULT); ✅ aplicado prod mayo 2026
└── public/images/                      # chat_ia_logo.jpg (avatar Mar-IA), favicon, logos
```

---

## 🌐 Sistema Multi-Idioma

### Arquitectura Híbrida

| Tipo de contenido | Fuente | Cómo funciona |
|-------------------|--------|---------------|
| **UI estático** (botones, títulos, labels) | `src/lib/dictionaries.ts` | 200+ claves en 5 idiomas |
| **Blog posts** | Supabase `blog_posts` | `lang` (es/en/fr/de/pt) + `translation_group_id` (UUID por familia de traducciones) |
| **Landing pages** | Supabase `landing_pages` | Columna `idioma` |
| **Contenido ciudades** | Supabase `ciudades_contenido` | Columna `idioma` + 22 campos JSONB |
| **Catálogos** | Supabase RPCs | `get_servicio_traducido()`, `get_ciudad_traducida()` |
| **URLs** | `src/lib/routes.ts` | Rutas traducidas por idioma |

### Contenido de Ciudades (basado en Guía Completa)

Cada página de ciudad incluye **14 secciones**:

1. **Intro** - Por qué elegir la ciudad
2. **Ventajas** - 5+ ventajas específicas
3. **Barrios** - 4+ barrios reales con precios
4. **Coste de vida** - Alquiler, compra, alimentación, transporte, suministros
5. **Clima** - Detalle climatológico
6. **Primeros 30 días** - Guía semana a semana
7. **Trámites esenciales** - Paso a paso con ubicaciones
8. **Consulados y embajadas** - Lista por país + documentos
9. **Trabajo y emprendimiento** - Sectores, portales, tips autónomo
10. **Condiciones de entrada** - Sin visa / con visa / documentos
11. **Riesgos frontera** - Errores comunes, qué no hacer, consejos
12. **Residencia y nacionalidad** - Tipos residencia, arraigo, nacionalidad
13. **Integración práctica** - Asociaciones, apps, idiomas, comunidades
14. **Checklists** - Antes de viajar, primeros días, trámites, integración
15. **FAQs** - 5+ preguntas frecuentes

### SEO Implementado

- ✅ **JSON-LD**: Organization, WebSite, BlogPosting, BreadcrumbList, FAQPage, Service, Place
- ✅ **Hreflang**: Alternates en todas las páginas; en artículos del blog, URLs por **slug real** por idioma (`buildBlogAlternates`)
- ✅ **Canonicals**: URL canónica por página
- ✅ **Open Graph / Twitter Cards**: Metadata social completa
- ✅ **robots.txt** y **sitemap.xml** dinámicos
- ✅ **HTML lang dinámico**: `<html lang="es|en|fr|de|pt">`
- ✅ **Alt text descriptivo**: En todas las imágenes hero
- ✅ **SSG con revalidate**: Blog y destinos pre-renderizados

---

## 🛠️ Scripts Disponibles

```bash
# Contenido de ciudades (guía completa)
node scripts/generate-city-content-full.js --all        # 19 ciudades en español
node scripts/generate-city-content-full.js murcia        # Solo una ciudad
node scripts/translate-cities-content.js --force          # Traducir a EN/FR/DE/PT

# Traducción masiva
node scripts/translate-all.js                             # Blog + landings a 4 idiomas

# Landing pages
npm run generate-landings                                 # 76 landing pages
npm run generate-visa-landings                            # 100 landings visa no lucrativa
npm run check-landings                                    # Verificar estado

# Blog
npm run generate-blog                                     # Posts de blog

# Performance
npm run images:webp                                       # PNG → WebP
```

---

## 📊 Base de Datos (Supabase)

### Tablas Principales

| Tabla | Registros | Descripción |
|-------|-----------|-------------|
| `ciudades_contenido` | 19 × 5 = 95 | Contenido completo ciudades (22 campos, 5 idiomas) |
| `landing_pages` | 176+ | Landing pages SEO |
| `blog_posts` | 30+ × 5 | Artículos blog; columnas `lang`, `translation_group_id` |
| `ai_blog_config` | 1 | Configuración asistente IA del blog (singleton) |
| `ciudades_catalogo` | 19 | Catálogo ciudades |
| `servicios_catalogo` | 4 | Catálogo servicios |
| `leads` | Variable | Leads capturados (privado; no accesible por el chat) |
| `chatbot_config` | 1 | Configuración Chat IA: enabled, modelo, prompts, tablas de conocimiento |
| `chat_messages` | Variable | Historial de conversaciones y valoraciones (privado) |
| `idiomas` | 5 | Idiomas activos |
| `servicios_catalogo_traducciones` | 4 × 5 | Traducciones servicios |
| `ciudades_catalogo_traducciones` | 19 × 5 | Traducciones ciudades |

---

## ✍️ Blog: asistente IA y traducciones

- **Documentación detallada**: [`docs/BLOG_IA_Y_TRADUCCIONES.md`](./docs/BLOG_IA_Y_TRADUCCIONES.md) (APIs, env, migraciones, flujo ES → traducir).
- **Admin**: listado `/administrator/blog` — botones «Config IA», «Crear con IA»; editor de post — «Traducir con IA» (solo si `lang === es`), «Generar portada con IA» en imagen destacada.
- **Público**: `GET /api/blog/translations` alimenta el selector de idioma en **`Navigation.tsx`** (layout ES/EN/FR/DE/PT) para saltar al slug correcto entre traducciones publicadas.

---

## 🤖 Chat IA (Mar-IA)

- **Widget flotante** en todas las páginas (idioma según ruta); avatar `chat_ia_logo.jpg`.
- **Configurador** en `/administrator/chat-ia`: estado (on/off guarda en BD al instante), modelo OpenAI, temperatura, prompts, apariencia, mensajes de bienvenida, tablas de conocimiento.
- **Historial** en `/administrator/chat-history`: conversaciones, valoración (correcta/mejorable/errónea), métricas por idioma.
- **Dos agentes**: uno detecta idioma del mensaje; el otro responde en ese idioma usando solo tablas permitidas.
- **Tablas de conocimiento** (solo lectura): `servicios_catalogo`, `ciudades_contenido`, `blog_posts`, `landing_pages`. Nunca: `leads`, `chat_messages`, `chatbot_config`, `partners`.
- **Sin caché** en `/api/chat/config`; widget refetch cada 5 s para que activar/desactivar se vea al momento.

---

## 📇 CRM GoHighLevel (GHL) y leads

### Qué hace el código (resumen técnico)

- **POST `/api/leads`**: valida, guarda **siempre** en Supabase en la tabla **`leads`** (una sola tabla para todos los servicios) y, si están configuradas las variables, dispara integraciones GHL **en segundo plano** (no bloquean la respuesta al usuario).
- **API v2** (`src/lib/gohighlevel.ts` → `createGHLContact`): upsert de contacto en la **location** indicada por `GHL_LOCATION_ID`, con token `GHL_PRIVATE_TOKEN`. Custom fields en español vía `GHL_CUSTOM_FIELD_IDS` (JSON en `.env`) y etiquetas por tipo de servicio.
- **Webhook entrante** (`sendLeadToGHLIncomingWebhook`): **un único** endpoint configurable con `GHL_INCOMING_WEBHOOK_SALUD`. Envío **POST** con cuerpo **JSON** en cada lead. El payload incluye slugs técnicos (`servicio`, `ciudad`, etc.) y campos legibles en español (`servicio_es`, `urgencia_es`, `presupuesto_es`, `ciudad_servicio_espana_nombre`, `pais_origen_es`, `fecha_nacimiento_legible_es`, …) desde `src/lib/ghl-spanish-labels.ts`, para que en GHL se trabaje en español aunque el formulario se envíe en EN/FR/DE/PT.
- **Campos útiles para automatizaciones**: `servicio` (`seguros` | `abogados` | `inmobiliarias` | `gestorias`) y **`tipo_ruta`**: `salud` si el usuario eligió seguros de salud, **`otros`** en el resto de casos. Así se puede ramificar en un solo flujo con **Si/No** o filtros sin cambiar la web.
- **Admin**: `/administrator/leads` — listado y eliminación de leads (solo admins). Detalle de variables: `.env.example`.

> **Nombre de la variable `GHL_INCOMING_WEBHOOK_SALUD`:** es histórico (primer planteamiento solo canal “salud”). Hoy **esa URL recibe todos los leads**; la distinción salud vs otros va en el JSON (`tipo_ruta`, `servicio`).

### Decisión de producto: una sola subcuenta GHL (definitiva)

*Documentación de acuerdo comercial y modelo de datos; abril 2026.*

Durante el diseño de la integración se valoraron varios escenarios:

1. **Petición inicial (operaciones / automatizaciones):** conectar la encuesta web con GHL mediante **webhook entrante**, **POST en JSON**, y **señalar por separado** los interesados en **seguros de salud** frente al resto de servicios (para encadenar automatizaciones distintas).
2. **Escenario intermedio:** plantear **dos subcuentas (locations)** en GHL — por ejemplo separar “seguros” y “no seguros”, o interpretar mensajes del cliente sobre distintas marcas / captación. Eso implicaba **dos listas de contactos** y dos URLs de webhook generadas cada una **dentro de su propia location** (el segmento `.../hooks/<LOCATION_ID>/...` en la URL identifica la subcuenta).
3. **Decisión final acordada con el cliente:** **no** hace falta duplicar subcuentas. **Todos los leads** pueden centralizarse en **una sola location** GHL. El cliente es **agencia de seguros**: en CRM filtrará y priorizará **seguros de salud** para su propia venta, y con el resto de datos **repartirá** u orientará leads de otros servicios según su modelo operativo.

**Consecuencia para la implementación:** la aplicación usa **un solo webhook** (`GHL_INCOMING_WEBHOOK_SALUD`) y un solo `GHL_LOCATION_ID` para la API. La segmentación “salud vs otros” queda en **datos del payload** (`tipo_ruta`, `servicio`, etiquetas que añade la API) y en la **configuración de workflows** en GHL (condiciones, etiquetas, asignaciones), no en dos cuentas obligatorias.

Si en el futuro se pidiera de nuevo **envío a dos locations distintas**, habría que volver a **dos URLs** (una por location) y/o **lógica condicional** en servidor para `GHL_LOCATION_ID` + token por ramo; no es el escenario vigente tras la decisión anterior.

---

## 🤝 Partners · Captación B2B (Fase 1)

> **Detalle completo:** [`docs/PARTNERS_FASE1_CAPTACION.md`](./docs/PARTNERS_FASE1_CAPTACION.md). Operativa post-firma (asignación de leads, facturación, panel del partner activo): [`docs/MODELO_PARTNERS_LEADS.md`](./docs/MODELO_PARTNERS_LEADS.md).

Funnel completo end-to-end para que un profesional (abogado, gestoría, inmobiliaria, agente de seguros) entre en H4S como partner pagador:

```
landing /es/partners → POST /api/partners/leads → partner_leads (Supabase)
                                  ↓
                   /administrator/partners (closer)
                                  ↓                          (copia URL al portapapeles)
                  qualify A/B/C → access_token (UUID, TTL 7d) ──────────────► WhatsApp/email del partner
                                                                                       ↓
                                          /es/partners/acceso?token=...  (Acceso 2)
                                                ROI calc · multi-vertical · Founding
                                                          ↓
                                          POST /api/partners/contract-request
                                                stage = contrato_solicitado
                                                          ↓
                                            (firma manual offline en v0)
                                                          ↓
                                                  stage = contratado
```

### Componentes

- **BD**: `partner_leads` (`supabase/16-partner-leads.sql`) · una sola tabla cubre todo el funnel hasta la firma.
- **Lógica de negocio**: `src/lib/partners.ts` · matriz Tier × Plan (4 planes × 3 tiers), 19 ciudades estratégicas mapeadas a A/B/C, descuento multi-vertical (0/10/30/40 +5pp Founding), zonas adicionales (desde ESCALA), Founding (10 plazas, 30% × 6 meses, bloqueo de precio vitalicio), `computeRoi()` para la calculadora.
- **API**: `POST /api/partners/leads` (público), `GET /api/partners/leads` (admin), `POST /api/partners/qualify` (admin · qualify/reject/regenerate_token/set_stage), `GET /api/partners/access/[token]` (público · valida y devuelve PII saneada), `POST /api/partners/contract-request` (público vía token).
- **Frontend público**: `/es/partners` (landing con planes blureados + formulario), `/es/partners/gracias` (confirmación honesta — el closer llamará).
- **Frontend privado**: `/es/partners/acceso?token=...` (panel ROI + selector verticales + CTA contrato), `/es/partners/acceso/contrato` (confirmación post-solicitud).
- **Admin H4S**: `/administrator/partners` · listado paginado con filtros (stage, servicio, ciudad, búsqueda) + modal de detalle con acciones one-click (cualificar A/B/C copia URL al portapapeles, rechazar, regenerar token, cambiar stage).
- **Footer**: enlace «Hazte partner» (`t.footer.forPartners` traducido a 5 idiomas) apuntando a `/es/partners`.

### Decisiones de producto importantes (Fase 1)

- **19 ciudades estratégicas** son las pactadas y presupuestadas con el cliente. Cualquier ciudad fuera de esas 19 queda como `ciudad_es_estrategica = false` y el closer decide si abrir la zona o rechazar (acuerdo de mayo 2026).
- **Plazas compartidas por defecto**: ACTIVA/CRECE/ESCALA permiten varios partners por zona. La **exclusividad** solo la otorga el plan **LIDERA**, desbloqueable por trayectoria (mín. 21 meses + KPIs), no por dinero.
- **Magic link en lugar de auth para partners**: tras la cualificación humana, el closer genera un token UUID v4 (TTL 7 días) y lo envía por WhatsApp/email. Acceso 2 valida server-side, sin cuentas Supabase Auth ni passwords. Reduce fricción y elimina superficie de ataque.
- **Pre-cualificación honesta**: tras enviar el formulario, el partner aterriza en una página de «un humano te llamará en 24h» en lugar de una falsa cualificación instantánea animada (lo proponía la propuesta inicial).
- **Pagos / firmas / agendado**: en v0 todo es **manual** (transferencia SEPA, PDF firmado, llamada por WhatsApp). Stripe + GoCardless + Signaturit + Calendly se difieren a v1.5/v2.
- **Solo `/es` en v0**: la captación es en castellano (material legal solo en ES). Las rutas `partners` están reservadas en `routes.ts` para los 5 idiomas; el footer enlaza siempre a `/es/partners`.
- **Layout jun 2026**: sección «De Google a Tu Agenda» usa `partners-steps-grid` (no `service-grid-2x2` de la home) para evitar texto cortado en 5 columnas.

---

## 🏢 Hub Colaboradores (equipo interno · comisiones)

App privada **`/hub`** para closers, supervisores, admin y técnico. **No es Partners** ni el CRM de leads públicos.

| Qué hace | Estado |
|----------|--------|
| Carga CSV aseguradoras (ASISA + genérico), dedup, asignación a closers | ✅ |
| Cálculo comisión, IRPF, régimen n+1/n+2, export gestoría, PDF justificante | ✅ |
| CVR / bonus en tiempo real vía GHL | ⏳ Pendiente Claudia |
| Partners en GHL | ❌ No aplica |

- **Doc técnica**: [`docs/HUB_COLABORADORES.md`](./docs/HUB_COLABORADORES.md)
- **Resumen cliente**: [`HUB_ESTADO_SENCILLO.md`](./HUB_ESTADO_SENCILLO.md)
- **BD**: `supabase/19-hub-colaboradores.sql` (producción)
- **Env Hub**: `GHL_WEBHOOK_SECRET`, `GHL_STAGE_RECIBIDO`, `GHL_STAGE_CERRADO` (ver `.env.example`)

---

## 🎨 Diseño y UX

- **Modern Minimalist**: Negro, blanco, acento azul (`#3bbdda`)
- **Mobile-first**: Grid denso, botones optimizados
- **Formulario multi-paso**: Servicios → Ciudades → Datos → Presupuesto
- **Landings**: Formulario embebido en hero (conversión directa)
- **Condensación UX**: 50% menos padding, todo above the fold

---

## 💰 Modelo de Negocio

1. **Leads cualificados**: 15-50€/lead
2. **Comisión servicios**: 3-10% sobre venta
3. **Suscripción partners**: 50-200€/mes
4. **Destacados premium**: 100-500€/mes

---

## 🔧 Variables de Entorno

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_ADMIN_EMAILS=admin@health4spain.com
OPENAI_API_KEY=                    # Chat Mar-IA + asistente blog (texto/imagen) + scripts
SERPAPI_KEY=                       # Opcional: modo «Noticias» del asistente blog (Google News)
NEXT_PUBLIC_TINYMCE_API_KEY=
NEXT_PUBLIC_WHATSAPP_NUMBER=34614404562
NEXT_PUBLIC_SITE_URL=https://www.health4spain.com
NEXT_PUBLIC_META_PIXEL_ID=1885591562124890   # Meta Ads (ver docs/META_PIXEL.md)

# GoHighLevel (opcional — ver .env.example para mapeo de campos)
# GHL_PRIVATE_TOKEN=
# GHL_LOCATION_ID=
# GHL_INCOMING_WEBHOOK_SALUD=   # URL única; recibe todos los leads (ver sección GHL en README)
# GHL_CUSTOM_FIELD_IDS={"ciudad_interes":"uuid-..."}

# Hub Colaboradores (GHL entrante → CVR)
# GHL_WEBHOOK_SECRET=
# GHL_STAGE_RECIBIDO=
# GHL_STAGE_CERRADO=
# GHL_PIPELINE_SEGUROS=
```

---

## 📄 Documentación

- [ESTADO_PROYECTO.md](./ESTADO_PROYECTO.md) - Estado actual completo
- [INDICE_DOCUMENTACION.md](./INDICE_DOCUMENTACION.md) - Índice completo
- [docs/AUDITORIA.md](./docs/AUDITORIA.md) - Auditoría técnica
- [docs/MODELO_NEGOCIO.md](./docs/MODELO_NEGOCIO.md) - Modelo de negocio
- [docs/HUB_COLABORADORES.md](./docs/HUB_COLABORADORES.md) - Hub interno: comisiones, `/hub`, APIs, GHL
- [HUB_ESTADO_SENCILLO.md](./HUB_ESTADO_SENCILLO.md) - Resumen Hub/Partners para cliente
- [docs/reunion-cliente-resumen.pdf](./docs/reunion-cliente-resumen.pdf) - PDF reunión (jun 2026)
- [docs/PARTNERS_FASE1_CAPTACION.md](./docs/PARTNERS_FASE1_CAPTACION.md) - Partners Fase 1 (captación + cualificación + Founding)
- [docs/MODELO_PARTNERS_LEADS.md](./docs/MODELO_PARTNERS_LEADS.md) - Partners post-firma (asignación, facturación)
- [docs/BLOG_IA_Y_TRADUCCIONES.md](./docs/BLOG_IA_Y_TRADUCCIONES.md) - Asistente IA del blog, traducciones, hreflang, APIs
- [docs/META_PIXEL.md](./docs/META_PIXEL.md) - Meta Pixel: configuración, eventos, verificación
- [docs/ESTRATEGIA_BLOG.md](./docs/ESTRATEGIA_BLOG.md) - Estrategia editorial SEO (visión producto)
- [scripts/README.md](./scripts/README.md) - Scripts disponibles

---

**Estado**: ✅ MULTI-IDIOMA, SEO COMPLETO, GHL + LEADS (ES), PARTNERS FASE 1, BLOG IA + TRADUCCIONES ENLAZADAS, META PIXEL, PRODUCTION-READY  
**Última actualización**: 28 de mayo de 2026  
**Versión**: 3.4.0  
**Build**: 708+ páginas estáticas (incluye módulo Partners en `/es/partners` y `/administrator/partners`)  
**Licencia**: Privado - Health4Spain © 2026
