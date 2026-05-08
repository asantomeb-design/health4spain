# Historial de Desarrollo - Health4Spain

## Versión 3.4.0 (8 mayo 2026)

### Blog: asistente IA, traducciones enlazadas y documentación

- **`ai_blog_config`** + wizard «Crear con IA», Config IA, APIs `/api/admin/blog/ai/*` (OpenAI + SerpAPI opcional para noticias).
- **`translation_group_id`** en `blog_posts`; migración `17-blog-translation-groups.sql`; `GET /api/blog/translations`; SEO `buildBlogAlternates`; helper **`src/lib/blog-locale-switch.ts`** usado por **`Navigation.tsx`** y **`LanguageSwitcher.tsx`** (salto al slug correcto entre idiomas en artículos publicados).
- Migración **`18-ai-blog-model-image-gpt-image-1.5.sql`** aplicada en Supabase producción: **`model_image`** y DEFAULT **`gpt-image-1.5`** en `ai_blog_config`.
- Editor: «Generar portada con IA»; **`generate-cover`** normaliza tamaños imagen según modelo (gpt-image vs DALL·E 3).
- Documentación nueva/unificada: **`docs/BLOG_IA_Y_TRADUCCIONES.md`**; actualizados README, ÍNDICE, ESTADO_PROYECTO, supabase/README, GUIA Supabase, CONFIGURACION_VERCEL, AUDITORIA, ESTRATEGIA_BLOG (esquema real), `.env.example`.

---

## Versión 3.2.0 (9 abril 2026)

### SEO: Landings visa no lucrativa + schemas + anti-canibalización

- **100 landings "visa no lucrativa"**: 5 landing madre + 95 landings ciudad (19 ciudades × 5 idiomas). SQL: `13-landing-visa-no-lucrativa.sql`, `14-landing-visa-no-lucrativa-de-fr-pt.sql`.
- **Script generación IA**: `scripts/generate-visa-no-lucrativa-landings.ts` + npm script `generate-visa-landings`.
- **Schema JSON-LD extendido**: `cityPlaceJsonLd()` en destinos (Place con ciudad, provincia, población, % extranjeros) y `localServiceJsonLd()` en landings servicio×ciudad (Service con areaServed local).
- **Anti-canibalización**: keyword "visa no lucrativa" eliminada de `/servicios/seguros` y bloque seguros en destinos (`dictionaries.ts`) — ahora solo en las landings dedicadas.
- **Contacto real**: Teléfono +34 644 404 562 + WhatsApp en footer. Actualizado en `Footer.tsx`, `WhatsAppButton.tsx`, `constants.ts`, `LeadForm.tsx`.
- **Blog styling**: Estilos artículos centralizados en `.blog-article-content` (`globals.css`) con jerarquía H2/H3/H4, spacing, listas, tablas, blockquotes.
- **Home ES**: Meta description alineada con `dictionaries.ts`.
- **Código**: `src/lib/seo.tsx` (2 funciones nuevas), `src/lib/dictionaries.ts` (bloque seguros genérico), `src/app/globals.css`, 5 idiomas × servicios + destinos + blog.

---

## Versión 3.1.0 (2 abril 2026)

### GoHighLevel y leads en español

- **Integración GHL**: Tras insertar en Supabase, `createGHLContact` (API v2 upsert) y `sendLeadToGHLIncomingWebhook` (URL `GHL_INCOMING_WEBHOOK_SALUD`) con una sola pasada de `buildGhlWebhookSpanishFields` (fire-and-forget desde `/api/leads`).
- **Español en CRM**: Custom fields con etiquetas ES; webhook con `servicio_es`, `urgencia_es`, `presupuesto_es`, `ciudad_servicio_espana_nombre`, `pais_origen_es`, `fecha_nacimiento_legible_es`, etc.
- **Admin**: `/administrator/leads` — eliminar leads.
- **Código**: `src/lib/gohighlevel.ts`, `src/lib/ghl-spanish-labels.ts`, `src/app/api/leads/route.ts`.
- **Config**: `.env.example` (variables y mapeo sugerido en GHL).
- **Documentación abril 2026:** decisión de **una sola subcuenta** GHL (sin duplicar locations); segmentación en CRM vía `servicio`, `tipo_ruta` (`salud` \| `otros`) y workflows. Detalle en **`README.md`** (sección CRM GoHighLevel).

---

## Versión 3.0.1 (28 Febrero 2026)

### Logo unificado

- **Logo único**: Toda la web usa `h4s vertical color_recortado.webp` como logo.
- **Constantes**: En `src/lib/constants.ts`, `LOGO_PATHS.siglas`, `LOGO_PATHS.horizontal` y `LOGO_PATHS.vertical` apuntan al mismo archivo.
- **Uso**: Header/navegación, footer, Open Graph, Twitter Cards, JSON-LD y meta SEO (layout y `src/lib/seo.tsx`).
- **Documentación**: README e índices actualizados; `public/images/README.md` describe hero, logo y resto de imágenes.

---

## Versión 2.6.0 (12 Febrero 2026)

### Formulario Embebido en Landings

- **Componente**: `LandingFormEmbed.tsx` — Formulario de conversión directa en hero de landings
- **Condición**: Solo cuando `servicio_slug` y `ciudad_slug` existen (ej. gestorias-jumilla)
- **Flujo**: 2 pasos (datos personales + presupuesto/urgencia), servicio y ciudad fijos
- **Estética**: Idéntica a ContactFormClient (/solicitar) — labels, grids, botones
- **Ubicación**: Debajo de bullets del hero, centrado en PC (`mx-auto`)
- **Rutas**: `servicios/[slug]` y `destinos/[slug]`

### Landings: Mejoras UX

- **H1 interlineado**: `!leading-[1.5]` para evitar solapamiento en títulos largos
- **Formulario centrado**: `max-w-2xl mx-auto` en desktop
- **Iconos**: Círculo-X → Checkmark en sección problemas
- **Enlaces**: `servicio=X&ciudad=Y` en URL → /solicitar abre directamente en paso 3

### Iconos Unificados

- **Seguridad**: Globo → Shield/Lock para "Datos protegidos" (ContactFormClient, LeadForm, PreFooterCTA)
- **Problemas landings**: Círculo-X → Checkmark (servicios/[slug], destinos/[slug])

---

## Versión 2.5.1 (11 Febrero 2026)

### Banner de Cookies (GDPR / Normativa UE)

- **Componente**: `CookieConsent.tsx` — Banner de consentimiento conforme a GDPR
- **Categorías**: Esenciales (siempre activas), Análisis, Marketing — sin casillas pre-marcadas
- **Opciones**: Aceptar todas, Rechazar opcionales, Personalizar (checkboxes por categoría)
- **Modificar consentimiento**: Enlace "Modificar consentimiento de cookies" en footer (Legal)
- **Lib**: `src/lib/cookie-consent.ts` — `getStoredConsent()`, `canUseAnalytics()`, `canUseMarketing()`
- **Página**: `/es/cookies` — Actualizada con referencia al enlace de modificación

### Corrección Menú Móvil

- **Parpadeo**: Corrección del comportamiento del menú móvil en `Navigation.tsx`

---

## Versión 2.5.0 (11 Febrero 2026)

### URL Canónica con www

- **Dominio**: `https://www.health4spain.com` (siempre con www)
- **Redirect 301**: `health4spain.com` → `www.health4spain.com` (next.config.js)
- **metadataBase**: layout.tsx actualizado para canonical y Open Graph
- **Sitemap**: sitemap.ts, sitemap-html con URL www
- **Variables**: .env.example, constants.ts

### UX: Tamaños "Solicitar →" unificados

- **Estándar**: 1rem móvil, 1.125rem desktop, font-weight 600
- **Aplicado en**: /destinos (lista de ciudades), /servicios (lista de servicios)
- **Antes**: destinos usaba text-2xl; ahora usa clase service-arrow
- **Override**: service-item-minimal .service-arrow en globals.css

### Navegación: Blog en navbar

- **Componente**: `Navigation.tsx` — **único navbar del sitio público**
- **Nota**: El layout usa solo `Navigation.tsx`. `Header.tsx` es legacy (no montado en layout); ambos pueden usar `blog-locale-switch.ts` para artículos `/blog/[slug]`.
- **Añadido**: Enlace Blog entre Servicios y Contacto
- **Orden**: Inicio → Destinos → Servicios → Blog → Contacto

### Documentación

- **docs/AUDITORIA.md** (NUEVO): Auditoría completa — rutas, fuentes de datos, CTAs, flujo leads
- README.md: Flujo de datos, CTAs, referencia a auditoría
- RESUMEN_ACTUALIZACIONES.md: Nueva sección mejoras 11 Feb
- CONFIGURACION_VERCEL.md: NEXT_PUBLIC_SITE_URL con www
- docs/ESTRATEGIA_BLOG.md: URLs de ejemplo con www
- INDICE_DOCUMENTACION.md: Fecha actualizada, enlace a auditoría

---

## Versión 2.4.0 (Febrero 2025)

### Migración Destinos a Supabase

- **Fuente única**: Destinos y ciudades desde `ciudades_catalogo` (Supabase)
- **`/es/destinos`**: Usa `getCiudades()`, agrupa por comunidad
- **`/es/contacto`**: Server component que pasa ciudades desde Supabase al formulario
- **`/api/ciudades`**: Nuevo endpoint para componentes cliente (LeadForm)
- **Eliminado**: `src/lib/destinos.ts` (duplicado estático)

### Abogados Generalizado

- **De "Abogados de Extranjería" a "Abogados"** en toda la web
- Incluye: familia, civil, laboral, extranjería y más
- Migración SQL: `supabase/03-actualizar-abogados.sql`

### Diseño y UX

- **Diseño minimalista**: Negro, blanco, rojo. Panel admin actualizado
- **CTAs ampliados**: Servicios, destinos, perfiles y stats totalmente clicables
- **Botón móvil fijo**: "Solicitar Información" en la parte inferior (oculto en contacto)
- **Perfiles actualizados**: Jubilados, Trabajadores, Inversores, Estudiantes

---

## Versión 2.3.0 (Enero 2025)

### Panel de Administración Completo

**Autenticación unificada con Supabase Auth:**
- Login en `/administrator/login` con email/password
- Verificación de emails autorizados via `NEXT_PUBLIC_ADMIN_EMAILS`
- JWT tokens para autenticación en APIs
- Protección de rutas con `ProtectedRoute` component

**Dashboard (`/administrator`):**
- Estadísticas: total leads, leads del mes, posts publicados, landings revisadas
- Gráficos: leads por servicio (top 5), por ciudad (top 5), por estado
- Tabla de últimos 5 leads

**Gestión de Leads (`/administrator/leads`):**
- Lista paginada con filtros (estado, servicio, ciudad, búsqueda)
- Modal de detalle con toda la información del lead
- Cambio de estado: nuevo → contactado → cualificado → asignado → convertido/perdido
- Indicadores de score y urgencia

**Editor de Blog (`/administrator/blog`):**
- Lista de posts con filtros (estado, categoría, búsqueda)
- Editor completo con TinyMCE
- Gestión de imagen destacada
- SEO: meta título, meta descripción
- Estados: borrador, publicado, archivado

**Gestor de Medios (`/administrator/media`):**
- Galería de imágenes del bucket `blog-images`
- Subida drag & drop o por botón
- Creación de carpetas para organizar
- Copiar URL, eliminar imágenes
- Integrado en el editor de blog

**Gestión de Landings (`/administrator/landings`):**
- Lista de 76 landing pages (4 servicios × 19 ciudades)
- Filtros por servicio, estado de revisión
- Toggle de revisado/activo
- Estadísticas de progreso

### APIs Actualizadas

Todas las APIs protegidas ahora usan **Supabase Auth JWT**:

```
POST /api/blog          → Requiere Bearer token
PUT /api/blog/[slug]    → Requiere Bearer token
DELETE /api/blog/[slug] → Requiere Bearer token
GET /api/leads          → Requiere Bearer token
POST /api/upload        → Requiere Bearer token
DELETE /api/upload      → Requiere Bearer token
POST /api/landings      → Requiere Bearer token
PUT /api/landings/[slug] → Requiere Bearer token
...
```

APIs públicas (sin auth):
- `GET /api/blog` - Posts publicados
- `GET /api/blog/[slug]` - Post individual
- `POST /api/leads` - Crear lead (formulario)
- `GET /api/landings` - Landings activas
- `GET /api/landings/[slug]` - Landing individual

### Archivos Creados

```
src/
├── app/administrator/
│   ├── layout.tsx
│   ├── page.tsx (Dashboard)
│   ├── login/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── leads/page.tsx
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── media/page.tsx
│   └── landings/page.tsx
├── components/admin/
│   ├── ProtectedRoute.tsx
│   └── MediaManager.tsx
├── hooks/
│   └── useAuth.ts
└── lib/
    ├── auth.ts (validación JWT)
    └── supabase.ts (helpers admin)

supabase/
├── rls-policies.sql
└── storage-policies.sql
```

---

## Versión 2.2.0 (Enero 2025)

### Sistema de Landing Pages con IA

**✅ COMPLETADO**: 76 landing pages generadas exitosamente (7 Febrero 2026)

**Esquema de base de datos:**
- Tabla `landing_pages` con todos los campos para contenido dinámico
- Tabla `ciudades_catalogo` con 19 ciudades estratégicas
- Tabla `servicios_catalogo` con 4 servicios esenciales
- Tabla `landing_generation_log` para tracking de generaciones
- 4 servicios × 19 ciudades = 76 landings

**Script de generación:**
- `scripts/generate-landings.ts` usando OpenAI GPT-4o-mini
- `scripts/retry-landings.ts` para regenerar landing pages incompletas
- `scripts/check-landings.ts` para verificar estado
- `scripts/verify-landings.ts` para detectar qué faltan
- Prompts optimizados para contenido SEO en español
- Coste real: ~$0.15-0.20 USD (129,200 tokens)

**Proceso de generación:**
- Primera ejecución: 68 exitosas, 8 con errores de JSON
- Corrección manual: Detectada y corregida `gestorias-zaragoza` → `gestorias-san-javier`
- Limpieza de logs: 222 registros obsoletos eliminados
- Tiempo total: ~12 minutos
- Estado final: 76/76 ✅

**Página dinámica:**
- `/es/destinos/[slug]/page.tsx` renderiza las landings
- URL pattern: `/es/destinos/{servicio}-{ciudad}`

**Ciudades incluidas:**
- Región de Murcia (12): Murcia, Cartagena, Lorca, Mazarrón, Torre Pacheco, San Javier, San Pedro del Pinatar, Molina de Segura, Águilas, Cieza, Jumilla, Yecla
- Provincia de Alicante (7): Alicante, Elche, Torrevieja, Orihuela, Rojales, Benidorm, Dénia

### Documentación

**Estructura `/docs`:**
- `ESTRATEGIA_BLOG.md` - Plan de contenido y SEO
- `MODELO_NEGOCIO.md` - Modelo de partners y leads
- `HISTORIAL.md` - Este archivo

**Limpieza:**
- Eliminados 9 archivos markdown redundantes del root
- Consolidada toda la documentación

---

## Versión 2.1.0 (Enero 2025)

### APIs REST

- `/api/blog` - CRUD de posts
- `/api/leads` - Gestión de leads con anti-spam
- `/api/upload` - Subida de imágenes a Supabase Storage

### Base de datos

- Tabla `blog_posts` con soporte multiidioma
- Tabla `leads` con scoring automático
- Índices optimizados para consultas frecuentes

---

## Versión 2.0.0 (Enero 2025)

### Migración a Next.js 15

- App Router con Server Components
- TypeScript estricto
- Tailwind CSS 3.4

### Estructura inicial

- Páginas públicas en `/es` y `/en`
- Componentes reutilizables
- Sistema de formularios con validación

---

## Notas Técnicas

### Next.js 15

- Params en rutas dinámicas son `Promise`: `const { slug } = await params`
- Usar `'use client'` para componentes con hooks

### Supabase

- Cliente público: `supabase` (con anon key)
- Cliente servidor: `createServerSupabaseClient()` (con service role)
- Service role bypasa RLS

### Autenticación

- Admin emails en `NEXT_PUBLIC_ADMIN_EMAILS`
- JWT verificado con `supabase.auth.getUser(token)`
- Hook `useAuth()` para frontend
