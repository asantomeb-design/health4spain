# 📊 Estado del Proyecto Health4Spain

**Fecha de última actualización:** 12 de junio de 2026

---

## ✅ ESTADO ACTUAL: MULTI-IDIOMA + SEO + GHL/LEADS + PARTNERS FASE 1 + HUB COLABORADORES + BLOG IA + PRODUCTION-READY

### 🎯 Hitos Alcanzados

- ✅ **Hub Colaboradores v1** (junio 2026): app interna `/hub` para comisiones del equipo de ventas. Carga CSV multi-compañía (ASISA + genérico), asignación a closers, cálculo IRPF/régimen, export contable, justificante PDF, RBAC 4 roles, audit log. BD `19-hub-colaboradores.sql` en producción. Integración GHL **preparada** (webhook + lectura pipelines/usuarios); **CVR automático pendiente** de Claudia. Detalle: **`docs/HUB_COLABORADORES.md`** · resumen cliente: **`HUB_ESTADO_SENCILLO.md`**.
- ✅ **Asistente IA del blog** (mayo 2026): wizard «Crear con IA», Config IA (`ai_blog_config`), traducción desde editor (solo artículo ES), portadas IA (`blog-images/ai-covers/`), búsqueda de noticias vía OpenAI `web_search` (SerpAPI eliminado). Documentación: **`docs/BLOG_IA_Y_TRADUCCIONES.md`**.
- ✅ **Blog enlazado entre idiomas**: columna `translation_group_id`, API `GET /api/blog/translations`, hreflang con slugs reales (`buildBlogAlternates`), navbar (`Navigation.tsx`) con `hrefForLocaleSwitch`. Migración **`supabase/17-blog-translation-groups.sql`**.
- ✅ **Partners Fase 1 — Captación B2B** (mayo 2026): funnel completo… Detalle: **`docs/PARTNERS_FASE1_CAPTACION.md`**. **Fix jun 2026:** grids `partners-steps-grid` en `/es/partners` (texto ya no se corta en columnas estrechas).
- ✅ **GoHighLevel integrado** (API upsert + webhook único `GHL_INCOMING_WEBHOOK_SALUD`): valores legibles en **español** en CRM aunque el lead venga de formulario EN/FR/DE/PT (`src/lib/ghl-spanish-labels.ts`, campos `*_es` en webhook y custom fields API). **Una sola location GHL** acordada con el cliente; el JSON incluye `servicio` y `tipo_ruta` (`salud` / `otros`) para filtros y workflows. Fuente de verdad: **`README.md` → «CRM GoHighLevel (GHL) y leads»** (decisión de producto y nombre histórico de la variable).
- ✅ **Panel admin** `/administrator/leads`: listado y eliminación de leads.
- ✅ **Panel admin** `/administrator/partners`: listado paginado con filtros (stage, servicio, ciudad), modal de detalle con cualificar A/B/C, rechazar, regenerar token, cambio manual de stage.
- ✅ **5 idiomas completos** (ES, EN, FR, DE, PT) con páginas idénticas
- ✅ **748+ páginas estáticas** generadas en build (tras landings visa no lucrativa en BD)
- ✅ **19 ciudades con contenido exhaustivo** basado en guía de migración (14 secciones)
- ✅ **Contenido ciudades traducido** a 4 idiomas con OpenAI GPT-4o
- ✅ **SEO completo**: JSON-LD, hreflang, canonicals, OG, Twitter Cards, robots.txt
- ✅ **176+ landing pages SEO** (76 servicio×ciudad + 100 visa no lucrativa)
- ✅ **100 landings "visa no lucrativa"** (5 madre + 95 ciudad) en 5 idiomas
- ✅ **Schema JSON-LD extendido**: Place en destinos, Service+areaServed en landings
- ✅ **Anti-canibalización SEO**: keyword "visa no lucrativa" exclusiva en landings dedicadas
- ✅ **Contacto actualizado**: teléfono real +34 644 404 562 + WhatsApp en footer
- ✅ **Blog styling**: estilos centralizados en globals.css (.blog-article-content)
- ✅ **Blog multiidioma** con artículos por idioma (`lang`), grupos de traducción (`translation_group_id`) y hreflang correcto en URLs de artículo
- ✅ **Formulario embebido** en landings (conversión directa)
- ✅ **Chat IA (Mar-IA)**: widget flotante, configurador en admin, historial y valoraciones, detección de idioma en dos agentes, contexto desde BD (servicios, ciudades, blog, landings); estado on/off persistido en BD y sin caché

---

## 📊 Números

### Páginas por Idioma

| Idioma | Home | Blog | Destinos | Servicios | Legal/Otros | Total |
|--------|------|------|----------|-----------|-------------|-------|
| 🇪🇸 ES | 1 | 1 + [slug] | 1 + 19 [slug] | 1 + 4 [slug] | 8 | ~130+ |
| 🇬🇧 EN | 1 | 1 + [slug] | 1 + 19 [slug] | 1 + 4 [slug] | 8 | ~130+ |
| 🇫🇷 FR | 1 | 1 + [slug] | 1 + 19 [slug] | 1 + 4 [slug] | 8 | ~130+ |
| 🇩🇪 DE | 1 | 1 + [slug] | 1 + 19 [slug] | 1 + 4 [slug] | 8 | ~130+ |
| 🇵🇹 PT | 1 | 1 + [slug] | 1 + 19 [slug] | 1 + 4 [slug] | 8 | ~130+ |
| **Total build** | | | | | | **748+** |

### Contenido de Ciudades

| Campo | Descripción |
|-------|-------------|
| **19 ciudades** × **5 idiomas** = **95 registros** en `ciudades_contenido` |
| **14 secciones** por ciudad (basadas en GUIA_COTENIDO_LANDING_DESTINOS) |
| **22 campos** en la tabla (incluyendo 8 JSONB nuevos) |

### Secciones por Ciudad

1. Intro + ventajas + barrios
2. Coste de vida (alquiler, compra, alimentación, transporte, suministros)
3. Clima detallado
4. Primeros 30 días (guía semana a semana)
5. Trámites esenciales
6. Consulados y embajadas
7. Trabajo y emprendimiento
8. Condiciones de entrada en España
9. Riesgos al pasar la frontera
10. Residencia legal y nacionalidad
11. Integración práctica
12. Checklists (antes de viajar, primeros días, trámites, integración)
13. FAQs
14. Meta SEO

---

## 🌐 Sistema Multi-Idioma

### Traducciones UI (dictionaries.ts)
- **200+ claves** en cada idioma
- Cubre: navegación, formularios, landing UI, SEO, legal, blog, destinos

### Traducciones Dinámicas (Supabase)
- Blog posts: columna `lang`
- Landing pages: columna `idioma`
- Contenido ciudades: columna `idioma`
- Catálogos: tablas `_traducciones` + RPCs

### URLs Traducidas (routes.ts)

| Sección | ES | EN | FR | DE | PT |
|---------|----|----|----|----|-----|
| Destinos | destinos | destinations | destinations | reiseziele | destinos |
| Servicios | servicios | services | services | dienstleistungen | servicos |
| Blog | blog | blog | blog | blog | blog |
| Contacto | contacto | contact | contact | kontakt | contacto |
| Solicitar | solicitar | request | demande | anfrage | solicitar |

---

## 🔍 SEO Implementado

### Por Página
- ✅ Meta title y description únicos
- ✅ Canonical URL
- ✅ Hreflang alternates (5 idiomas)
- ✅ Open Graph (título, descripción, URL, imagen, locale)
- ✅ Twitter Cards

### JSON-LD Structured Data
- ✅ **Organization** - En todas las home pages
- ✅ **WebSite** - En todas las home pages
- ✅ **BlogPosting** - En artículos de blog
- ✅ **BreadcrumbList** - En destinos y servicios dinámicos
- ✅ **FAQPage** - En destinos y servicios con FAQs
- ✅ **Service** - En páginas de servicios y landings servicio×ciudad (**areaServed**)
- ✅ **Place** - En páginas de destinos (cityPlaceJsonLd)

### Técnico
- ✅ `robots.txt` dinámico
- ✅ `sitemap.xml` dinámico
- ✅ `<html lang="">` dinámico por ruta
- ✅ SSG con `revalidate` para blog y destinos
- ✅ `generateStaticParams` para pre-renderizado
- ✅ Alt text descriptivo en todas las imágenes

---

## 📁 Base de Datos (Supabase)

### Tablas

| Tabla | Registros | Idiomas |
|-------|-----------|---------|
| `ciudades_contenido` | 95 | 5 (es/en/fr/de/pt) |
| `landing_pages` | 176+ | 5 |
| `blog_posts` | 150+ | 5 |
| `ciudades_catalogo` | 19 | - |
| `servicios_catalogo` | 4 | - |
| `ciudades_catalogo_traducciones` | 95 | 5 |
| `servicios_catalogo_traducciones` | 20 | 5 |
| `idiomas` | 5 | - |
| `leads` | Variable | - |
| `chatbot_config` | 1 | Configuración Chat IA (singleton) |
| `ai_blog_config` | 1 | Configuración asistente IA del blog (singleton) |
| `chat_messages` | Variable | Historial conversaciones Mar-IA + valoración |
| `partner_leads` | Variable | Captación de partners B2B: formulario + cualificación + token + selección contrato |

### Migraciones SQL Ejecutadas

1. `schema.sql` - Esquema base
2. `landing-pages-schema.sql` - Landing pages
3. `06-soporte-multi-idioma.sql` - Soporte multiidioma
4. `07-estructura-completa-multi-idioma.sql` - Estructura completa
5. `08-traducciones-ciudades-catalogo.sql` - Traducciones catálogos
6. `09-expand-ciudades-contenido.sql` - 8 nuevas columnas JSONB (guía completa)
7. `10-expand-text-fields.sql` - Campos TEXT expandidos
8. `11-chatbot-config.sql` - Tabla configuración Chat IA
9. `12-chat-messages.sql` - Tabla historial conversaciones
10. `13-landing-visa-no-lucrativa.sql` - Landings visa no lucrativa ES+EN
11. `14-landing-visa-no-lucrativa-de-fr-pt.sql` - Landings visa no lucrativa DE+FR+PT
12. `15-ai-blog-config.sql` - Configuración del asistente IA del blog
13. `16-partner-leads.sql` - Captación de partners B2B (Fase 1)
14. `17-blog-translation-groups.sql` - Grupos de traducción del blog (`translation_group_id` + trigger + índice único idioma por grupo)
15. `18-ai-blog-model-image-gpt-image-1.5.sql` - `model_image` → `gpt-image-1.5` + DEFAULT columna (alternativa a error 403 con `gpt-image-2`) — **✅ ejecutado en Supabase producción (mayo 2026)**

---

## 🛠️ Scripts

### Generación de Contenido

| Script | Función | Modelo | Coste aprox |
|--------|---------|--------|-------------|
| `generate-city-content-full.js` | Contenido completo 19 ciudades (guía) | GPT-4o | $0.43 |
| `translate-cities-content.js` | Traducir ciudades a 4 idiomas | GPT-4o | ~$2.00 |
| `translate-all.js` | Traducir blog + landings | GPT-4o | ~$1.50 |
| `generate-landings.ts` | 76 landing pages | GPT-4o-mini | $0.20 |
| `generate-visa-no-lucrativa-landings.ts` | 100 landings visa no lucrativa | — | — |
| `generate-blog-posts.ts` | 30 artículos blog | GPT-4o-mini | $1.00 |

### Uso

```bash
# Ciudades (contenido completo basado en guía)
node scripts/generate-city-content-full.js --all
node scripts/generate-city-content-full.js murcia alicante

# Traducir ciudades
node scripts/translate-cities-content.js --force
node scripts/translate-cities-content.js --only=en murcia

# Traducción masiva
node scripts/translate-all.js

# Landing pages
npm run generate-landings
npm run generate-visa-landings
npm run check-landings
```

---

## 📈 Performance

### Build
- **748+ páginas** generadas estáticamente (tras landings visa no lucrativa en BD)
- **Build time**: ~45 segundos
- **0 errores**

### Core Web Vitals
- **LCP**: < 2.5s (WebP + Image priority)
- **FID**: < 100ms
- **CLS**: < 0.1

---

## 🚀 Próximos Pasos

### Pendiente
- [ ] Google Search Console + sitemap submission
- [ ] Testing cross-browser
- [ ] Onboarding primeros 10 partners (Founding) — captura via `/es/partners`, cualificación manual, firma offline
- [ ] Dashboard del partner activo post-firma (`MODELO_PARTNERS_LEADS.md` v2)
- [ ] Integración Calendly en Acceso 2 (agendado de llamada de cualificación) — high-impact, low-effort
- [ ] Stripe + GoCardless para suscripciones partners (cuando haya >30 partners)
- [ ] Signaturit para firma digital (cuando volumen ≥ 20 firmas/mes)
- [ ] Email/WhatsApp automatizado al generar token de Acceso 2

### Completado Recientemente (Jun 2026 — Hub Colaboradores)
- ✅ **Migración 19** + 9 tablas Hub en producción; seed ASISA/LBS.
- ✅ **SPA `/hub`** + APIs comisiones multi-compañía + parsers CSV + export + justificante.
- ✅ **GHL Hub**: `ghl-client.ts`, `/hub/integraciones`, webhook `/api/hub/ghl/webhook` (CVR pendiente Claudia).
- ✅ **Docs**: `docs/HUB_COLABORADORES.md`, `HUB_ESTADO_SENCILLO.md`, `docs/reunion-cliente-resumen.pdf`.
- ✅ **Fix UX** `/es/partners`: columnas «De Google a Tu Agenda» y planes.

### Completado Recientemente (May 2026 — Meta Pixel)
- ✅ **Meta Pixel** (`1885591562124890`) en web Next.js: `MetaPixel.tsx` + `meta-pixel.ts` en `layout.tsx`.
- ✅ Eventos `Lead` en formularios (leads, solicitar, partners); consentimiento GDPR (cookies Marketing).
- ✅ Variable `NEXT_PUBLIC_META_PIXEL_ID` en Vercel; verificado con Meta Pixel Helper en producción.
- ✅ Documentación: `docs/META_PIXEL.md`, actualizados README, CONFIGURACION_VERCEL, índices.

### Completado Recientemente (May 2026 — Blog IA y traducciones)
- ✅ **`ai_blog_config`** + rutas `/api/admin/blog/ai/*` (propuestas, noticias SerpAPI, redacción, portada, borrador, traducción).
- ✅ **`translation_group_id`** en `blog_posts` + `/api/blog/translations` + SEO `buildBlogAlternates` + `Navigation`/`LanguageSwitcher` con `blog-locale-switch.ts`.
- ✅ Editor: «Generar portada con IA»; normalización de tamaños imagen gpt-image vs DALL·E en `generate-cover`.

### Completado Recientemente (May 2026 — Partners Fase 1)
- ✅ **Tabla `partner_leads`** (`supabase/16-partner-leads.sql`): 8 estados de funnel, token UUID con TTL 7d, RLS estricto.
- ✅ **Lógica de negocio** centralizada en `src/lib/partners.ts`: matriz Tier × Plan, 19 ciudades→tier, multi-vertical (cascada 0/10/30/40 +5pp Founding), zonas adicionales (50%, desde ESCALA), Founding (30% × 6 meses, 10 plazas), `computeRoi()`.
- ✅ **APIs**: `POST/GET /api/partners/leads`, `POST /api/partners/qualify` (qualify/reject/regenerate_token/set_stage), `GET /api/partners/access/[token]`, `POST /api/partners/contract-request`.
- ✅ **Acceso 1 público**: `/es/partners` (landing con planes blureados + formulario) + `/es/partners/gracias` (confirmación honesta).
- ✅ **Acceso 2 privado**: `/es/partners/acceso?token=...` con calculadora ROI interactiva, selector multi-vertical reordenable, total mensual en vivo, CTA Founding; `/es/partners/acceso/contrato` para confirmación.
- ✅ **Admin**: `/administrator/partners` (listado + filtros + modal con acciones one-click) + entrada en sidebar.
- ✅ **i18n**: clave `partners` en `routes.ts` (5 idiomas reservados), `t.footer.forPartners` traducido en los 5 idiomas, enlace «Hazte partner» en footer.
- ✅ **Decisiones de producto cerradas**: 19 ciudades estratégicas (no más sin pago), plazas compartidas (exclusividad solo en LIDERA por trayectoria), v0 100% manual (firma + pago + agendado).
- ✅ **Build limpio**: 708 páginas estáticas, 0 errores. Fixes preexistentes corregidos: `images.generate` size literal y `setStep` en `BlogAIAssistant`.

### Completado Recientemente (Abr 2026 — SEO)
- ✅ **Landings visa no lucrativa**: 100 filas en `landing_pages` (5 madre + 95 ciudad; SQL `13-landing-visa-no-lucrativa.sql` y `14-landing-visa-no-lucrativa-de-fr-pt.sql`)
- ✅ **Script** `scripts/generate-visa-no-lucrativa-landings.ts` + `npm run generate-visa-landings`
- ✅ **JSON-LD** en `src/lib/seo.tsx`: Place en destinos (`cityPlaceJsonLd`), Service con `areaServed` en landings servicio×ciudad (`localServiceJsonLd`)
- ✅ **Anti-canibalización**: keyword "visa no lucrativa" retirada de `/servicios/seguros` y bloque seguros en destinos (`dictionaries.ts`); solo en landings dedicadas
- ✅ **Contacto**: +34 644 404 562 y WhatsApp (`Footer.tsx`, `WhatsAppButton.tsx`, `constants.ts`, `LeadForm.tsx`)
- ✅ **Blog**: estilos de artículos en `.blog-article-content` (`globals.css`), 5 idiomas
- ✅ **Home ES**: meta description alineada con `dictionaries.ts` (sin "de salud")
- ✅ **`landing_pages`**: ~176+ filas (76 originales + 100 visa no lucrativa)

### Completado Recientemente (Abr 2026)
- ✅ Integración CRM GoHighLevel (variables en `.env.example`; texto ES en API + webhook único; decisión **una location** — `README.md` § CRM GHL)
- ✅ Validación y flujo de leads alineados (p. ej. urgencia en `LandingFormEmbed`)

### Completado Recientemente (Feb 2026)
- ✅ Multi-idioma completo (5 idiomas)
- ✅ Contenido ciudades con guía completa (14 secciones)
- ✅ SEO exhaustivo (JSON-LD, hreflang, OG, canonicals)
- ✅ Blog traducido a 4 idiomas
- ✅ Traducción automática con OpenAI
- ✅ Chat IA Mar-IA: widget, configurador, historial, dos agentes idioma, tablas de conocimiento y bloqueo de tablas privadas

---

**Estado**: ✅ MULTI-IDIOMA + SEO + GHL/LEADS (ES) + PARTNERS FASE 1 + HUB COLABORADORES v1 + BLOG IA + PRODUCTION-READY  
**Última actualización**: 12 de junio de 2026  
**Versión**: 3.5.0
