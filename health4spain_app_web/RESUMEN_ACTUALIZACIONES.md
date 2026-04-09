# 📋 Resumen de Actualizaciones - Health4Spain

---

## 🆕 SEO: Landings visa no lucrativa + schemas + contacto + blog — 9 abril 2026

### 1. **100 Landings "Visa No Lucrativa"**
- 5 landing pages madre (1 por idioma) con contenido completo
- 95 landing pages por ciudad (19 ciudades × 5 idiomas) con meta SEO
- SQLs: `13-landing-visa-no-lucrativa.sql` (ES+EN), `14-landing-visa-no-lucrativa-de-fr-pt.sql` (DE+FR+PT)
- Script IA: `generate-visa-no-lucrativa-landings.ts` + npm `generate-visa-landings`

### 2. **Schema JSON-LD Extendido**
- `cityPlaceJsonLd()`: Schema Place en 19 destinos × 5 idiomas
- `localServiceJsonLd()`: Schema Service con areaServed local en landings servicio×ciudad
- Total schemas: Organization, WebSite, BlogPosting, BreadcrumbList, FAQPage, Service, Place

### 3. **Anti-Canibalización SEO**
- Keyword "visa no lucrativa" eliminada de /servicios/seguros (5 idiomas)
- Eliminada del bloque seguros en destinos (dictionaries.ts, 5 idiomas)
- Ahora exclusiva en landings dedicadas /servicios/seguro-salud-visa-no-lucrativa*

### 4. **Contacto y Footer**
- Teléfono real: +34 644 404 562 (antes placeholder)
- WhatsApp añadido en footer (enlace wa.me)
- Actualizado en Footer.tsx, WhatsAppButton.tsx, constants.ts, LeadForm.tsx

### 5. **Blog Styling**
- Estilos centralizados en `.blog-article-content` (globals.css)
- Jerarquía visual: H2 (2.25rem + borde), H3 (1.75rem), H4 (1.25rem)
- Spacing, listas con marcadores accent, tablas, blockquotes

### 6. **Home ES Meta**
- Description alineada con dictionaries.ts (sin "de salud")

---

## 🆕 GoHighLevel + leads en español — 2 abril 2026

- **CRM GHL**: Tras `POST /api/leads`, sincronización opcional por API v2 (upsert contacto) y **webhook entrante único** (`GHL_INCOMING_WEBHOOK_SALUD`).
- **Español en GHL**: `ghl-spanish-labels.ts` — mismas etiquetas que el formulario ES (`getDictionary('es').request`) para servicio, presupuesto, urgencia, idioma, ciudad (catálogo), estado, dispositivo; campos `*_es` en el JSON del webhook (`pais_origen_es`, `fecha_nacimiento_legible_es`, etc.).
- **Custom fields API**: valores en español cuando está configurado `GHL_CUSTOM_FIELD_IDS`.
- **Admin**: `/administrator/leads` con acción eliminar.
- **Formularios**: validación de urgencia en `LandingFormEmbed`; slugs unificados en los 5 idiomas.
- **Documentación**: `.env.example`, README, ESTADO_PROYECTO, índices y este archivo actualizados.

---

## 🆕 Logo unificado — 28 Febrero 2026

- **Logo único**: Toda la web usa `h4s vertical color_recortado.webp` (header, footer, Open Graph, Twitter Cards, JSON-LD y meta SEO).
- **Constantes**: `LOGO_PATHS` en `src/lib/constants.ts` (siglas, horizontal, vertical) apuntan al mismo archivo.
- **Layout y SEO**: `layout.tsx` y `src/lib/seo.tsx` usan el logo vertical para og:image y datos estructurados.
- **Documentación**: README, INDICE_DOCUMENTACION, ESTADO_PROYECTO, scripts/README, supabase/README y `public/images/README.md` actualizados (fechas 28 Feb 2026; imágenes/README describe hero, logo y chat).

---

## 🆕 Multi-Idioma Completo + Contenido Ciudades — 19-24 Febrero 2026

### 1. **Contenido Exhaustivo de 19 Ciudades**
- Script `generate-city-content-full.js` con guía completa (GUIA_COTENIDO_LANDING_DESTINOS)
- **14 secciones** por ciudad: intro, ventajas, barrios, coste de vida, clima, primeros 30 días, trámites, consulados, trabajo, entrada, riesgos frontera, residencia, integración, checklists, FAQs
- **8 nuevas columnas JSONB** en `ciudades_contenido` (migración `09-expand-ciudades-contenido.sql`)
- Campos TEXT expandidos (migración `10-expand-text-fields.sql`)
- Contenido específico y real para cada ciudad (no genérico)

### 2. **Traducción Masiva con OpenAI**
- Script `translate-cities-content.js`: 19 ciudades × 4 idiomas = 76 traducciones
- Traduce los 22 campos (incluyendo 8 JSONB con subestructuras)
- Flag `--force` para sobrescribir traducciones existentes
- Script `translate-all.js`: blog + landings a EN/FR/DE/PT

### 3. **Páginas de Destinos Actualizadas**
- 5 páginas dinámicas `[slug]/page.tsx` (ES/EN/FR/DE/PT) muestran las 14 secciones
- Renderizado condicional: solo muestra secciones con datos
- Todas las etiquetas UI via `dictionaries.ts`
- Diseño idéntico entre idiomas

### 4. **Diccionarios Expandidos**
- `src/lib/dictionaries.ts`: 200+ claves en 5 idiomas
- Nuevas claves: `first30Days`, `consulatesTitle`, `workSectors`, `checklistBeforeTravel`, `entryConditions`, `borderRisks`, `residenceTitle`, `integrationTitle`, etc.

### 5. **SEO Completo**
- JSON-LD: Organization, WebSite, BlogPosting, BreadcrumbList, FAQPage, Service
- Hreflang alternates en todas las páginas (5 idiomas)
- Canonical URLs, Open Graph, Twitter Cards
- `<html lang="">` dinámico via `HtmlLang.tsx`
- robots.txt y sitemap.xml dinámicos

### 6. **Build Exitoso**
- **644 páginas estáticas** generadas
- **0 errores** en `next build`

---

## 🆕 Sistema Multi-Idioma Base — 14-18 Febrero 2026

### 1. **Estructura de Carpetas por Idioma**
- `src/app/es/` (base) duplicado a `en/`, `fr/`, `de/`, `pt/`
- URLs traducidas: destinations, services, contact, etc.
- `src/lib/routes.ts` centraliza las rutas por idioma

### 2. **Sistema de Traducciones**
- `src/lib/dictionaries.ts`: traducciones estáticas UI
- Supabase: tablas multiidioma (columna `idioma`/`lang`)
- RPCs: `get_servicio_traducido()`, `get_ciudad_traducida()`
- Migraciones: `06`, `07`, `08` para soporte multi-idioma

### 3. **Componentes Actualizados**
- `Navigation.tsx`: selector de idioma
- `Footer.tsx`: links traducidos
- `HtmlLang.tsx`: dynamic `<html lang="">`
- `seo.tsx`: helpers SEO multiidioma
- `data.ts`: capa de datos locale-aware

---

## 🆕 Formulario Embebido y Landings — 12 Febrero 2026

### 1. **LandingFormEmbed**
- Formulario de conversión directa en hero de landings con servicio+ciudad
- 2 pasos: datos personales + presupuesto/urgencia
- Estética idéntica a /solicitar
- Centrado en PC con `mx-auto`

### 2. **Landings UX**
- H1 con `!leading-[1.5]` para evitar solapamiento
- Icono checkmark en sección problemas
- Enlaces con `servicio=X&ciudad=Y` → /solicitar abre en paso 3

---

## 🆕 Mejoras UX y Configuración — 11 Febrero 2026

### 1. **Banner de Cookies (GDPR)**
- `CookieConsent.tsx` conforme a GDPR
- Categorías: Esenciales, Análisis, Marketing

### 2. **URL Canónica con www**
- Redirect 301: `health4spain.com` → `www.health4spain.com`

### 3. **Condensación UX (50% menos scroll)**
- Secciones: py-16/32 → py-8/16
- Hero: 65vh → 55vh
- Headings reducidos 30-40%

### 4. **Formulario Ultra-Compacto**
- Servicios: lista vertical sin iconos
- Ciudades: grid 3-5 columnas
- Todo visible sin scroll en cada paso

---

## 📊 Evolución del Proyecto

| Fecha | Hito | Páginas |
|-------|------|---------|
| 7 Feb 2026 | 76 landing pages generadas | ~200 |
| 11 Feb 2026 | UX condensada + GDPR | ~200 |
| 12 Feb 2026 | Formulario embebido en landings | ~200 |
| 14-18 Feb 2026 | Multi-idioma base (5 idiomas) | ~600 |
| 19-24 Feb 2026 | Contenido ciudades completo + traducido | **644** |
| 2 Abr 2026 | GHL + webhook español + admin leads | — |
| 9 Abr 2026 | SEO visa no lucrativa + schemas + contacto + blog | — |

---

## 💰 Costes IA Acumulados

| Concepto | Modelo | Coste |
|----------|--------|-------|
| 76 landing pages | GPT-4o-mini | $0.20 |
| 100 landings visa no lucrativa | GPT-4o-mini | ~$0.30 |
| 30 blog posts | GPT-4o-mini | $1.00 |
| 19 ciudades contenido completo | GPT-4o | $0.43 |
| 76 traducciones ciudades | GPT-4o | ~$2.00 |
| Traducciones blog + landings | GPT-4o | ~$1.50 |
| **TOTAL** | | **~$5.43** |

---

**Fecha de actualización:** 9 de abril de 2026  
**Estado:** ✅ MULTI-IDIOMA + SEO + GHL/LEADS (ES) + PRODUCTION-READY  
**Versión:** 3.2.0
