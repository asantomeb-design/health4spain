# 📚 Índice de Documentación - Health4Spain

**Fecha:** 30 de junio de 2026  
**Estado:** ✅ Multi-idioma (5) | SEO completo | GHL + leads (v2 jun 2026) | Partners Fase 1 | **Hub Colaboradores v1** | Blog IA + translation_group_id | Meta Pixel | Guía vivir España (HTML) | Production-ready  
**Versión:** 3.6.1

---

## 📖 Documentación Principal

### 🎯 Documentos de Estado

| Archivo | Descripción | Estado |
|---------|-------------|--------|
| **[README.md](./README.md)** | 📘 Visión general, stack, GHL/leads ES, blog IA y traducciones | ✅ Actualizado |
| **[ESTADO_PROYECTO.md](./ESTADO_PROYECTO.md)** | 📊 Estado actual + hitos + números | ✅ Actualizado |
| **[RESUMEN_ACTUALIZACIONES.md](./RESUMEN_ACTUALIZACIONES.md)** | 📝 Log de actualizaciones | ✅ Actualizado |
| **[guion-cambios-cliente.txt](./guion-cambios-cliente.txt)** | 📝 Guion cambios cliente | ✅ Actualizado |

### 📋 Guías

| Archivo | Descripción | Estado |
|---------|-------------|--------|
| **[GUIA_FINAL.md](./GUIA_FINAL.md)** | 🎓 Proceso de corrección | ✅ Completo |
| **[GUIA_COTENIDO_LANDING_DESTINOS](./GUIA_COTENIDO_LANDING_DESTINOS)** | 📖 Guía completa contenido ciudades (8 episodios + 3 anexos) | ✅ Base |

### ⚙️ Configuración

| Archivo | Descripción | Estado |
|---------|-------------|--------|
| **[CONFIGURACION_COMPLETADA.md](./CONFIGURACION_COMPLETADA.md)** | 🔧 Setup del proyecto | 📖 Referencia |
| **[CONFIGURACION_VERCEL.md](./CONFIGURACION_VERCEL.md)** | 🚀 Deploy en Vercel (+ vars GHL alineadas con README) | ✅ Actualizado |
| **[GUIA_CONFIGURACION_SUPABASE.md](./GUIA_CONFIGURACION_SUPABASE.md)** | 🗄️ Setup Supabase | 📖 Referencia |

---

## 📁 Documentación por Carpetas

### 📂 `/docs`

| Archivo | Descripción | Estado |
|---------|-------------|--------|
| **[AUDITORIA.md](./docs/AUDITORIA.md)** | 🔍 Auditoría (incl. nota GHL/leads abr 2026) | ✅ Actualizado |
| **[HISTORIAL.md](./docs/HISTORIAL.md)** | 📜 Historial de cambios | ✅ Actualizado |
| **[SCRIPTS_LANDINGS.md](./docs/SCRIPTS_LANDINGS.md)** | 🤖 Scripts de generación | ✅ Actualizado |
| **[MODELO_NEGOCIO.md](./docs/MODELO_NEGOCIO.md)** | 💰 Modelo de negocio | 📖 Referencia |
| **[PARTNERS_FASE1_CAPTACION.md](./docs/PARTNERS_FASE1_CAPTACION.md)** | 🤝 Partners Fase 1: captación + cualificación + magic link + Founding (BD, APIs, planes, ciudades→tier, ROI, operativa closer) | ✅ Actualizado |
| **[HUB_COLABORADORES.md](./docs/HUB_COLABORADORES.md)** | 🏢 Hub interno: comisiones multi-compañía, `/hub`, APIs, RBAC, GHL pendiente CVR | ✅ Nuevo |
| **[HUB_ESTADO_SENCILLO.md](./HUB_ESTADO_SENCILLO.md)** | 📄 Resumen Hub/Partners/CRM para reunión cliente (lenguaje sencillo) | ✅ Nuevo |
| **[reunion-cliente-resumen.pdf](./docs/reunion-cliente-resumen.pdf)** | 📄 PDF maquetado reunión cliente (jun 2026) | ✅ Nuevo |
| **[MODELO_PARTNERS_LEADS.md](./docs/MODELO_PARTNERS_LEADS.md)** | 🤝 Partners post-firma: asignación, panel partner activo, facturación (target/v2; GHL operativo) | 📖 Referencia (v2) |
| **[BLOG_IA_Y_TRADUCCIONES.md](./docs/BLOG_IA_Y_TRADUCCIONES.md)** | ✍️ Asistente IA blog, SerpAPI, `translation_group_id`, APIs, Navigation/hreflang | ✅ Nuevo |
| **[META_PIXEL.md](./docs/META_PIXEL.md)** | 📊 Meta Pixel: variable Vercel, eventos Lead/PageView, GDPR, verificación | ✅ Nuevo |
| **[GUIA_VIVIR_ESPANA.md](./docs/GUIA_VIVIR_ESPANA.md)** | 🗺️ Guía HTML estática: URL, mantenimiento, rutas formulario por idioma, enlaces, política v1 | ✅ Nuevo |
| **[ESTRATEGIA_BLOG.md](./docs/ESTRATEGIA_BLOG.md)** | ✍️ Estrategia SEO blog (visión editorial); esquema BD en doc técnico anterior | 📖 Referencia |

### 📂 `/scripts`

| Archivo | Descripción | Estado |
|---------|-------------|--------|
| **[README.md](./scripts/README.md)** | 🛠️ Todos los scripts | ✅ Actualizado |
| `generate-city-content-full.js` | 🌍 Generador contenido ciudades (guía completa) | ✅ Nuevo |
| `translate-cities-content.js` | 🌐 Traductor ciudades (EN/FR/DE/PT) | ✅ Nuevo |
| `translate-all.js` | 🔄 Traductor masivo (blog + landings) | ✅ Actualizado |
| `generate-landings.ts` | 📄 Generador landing pages | ✅ Operativo |
| `generate-visa-no-lucrativa-landings.ts` | 📄 Landings visa no lucrativa (IA) | ✅ Operativo |
| `generate-blog-posts.ts` | ✍️ Generador blog | ✅ Operativo |

### 📂 `/supabase`

| Archivo | Descripción | Estado |
|---------|-------------|--------|
| **[README.md](./supabase/README.md)** | 🗄️ Esquemas SQL | 📖 Referencia |
| `09-expand-ciudades-contenido.sql` | 8 columnas JSONB nuevas | ✅ Ejecutado |
| `10-expand-text-fields.sql` | Campos expandidos a TEXT | ✅ Ejecutado |
| `11-chatbot-config.sql` | Configuración Chat IA (singleton) | ✅ Ejecutado |
| `12-chat-messages.sql` | Historial conversaciones + ratings | ✅ Ejecutado |
| `13-landing-visa-no-lucrativa.sql` | Landings visa no lucrativa ES+EN | ✅ Ejecutado |
| `14-landing-visa-no-lucrativa-de-fr-pt.sql` | Landings visa no lucrativa DE+FR+PT | ✅ Ejecutado |
| `15-ai-blog-config.sql` | Configuración asistente IA del blog | ✅ Ejecutado |
| `16-partner-leads.sql` | Captación partners B2B (Fase 1) | ✅ Ejecutado |
| `17-blog-translation-groups.sql` | `translation_group_id` en `blog_posts`, backfill, índice único por grupo+lang | ✅ Ejecutar en prod si falta |
| `18-ai-blog-model-image-gpt-image-1.5.sql` | `model_image` → `gpt-image-1.5` + DEFAULT columna | ✅ Ejecutado en producción (mayo 2026) |
| `19-hub-colaboradores.sql` | **Hub Colaboradores**: 9 tablas + vista comisiones + seed compañías | ✅ Ejecutado en producción (jun 2026) |

---

## 🎯 Guías Rápidas por Tarea

### Blog IA y multi-idioma del blog
- **Doc técnica**: [`docs/BLOG_IA_Y_TRADUCCIONES.md`](./docs/BLOG_IA_Y_TRADUCCIONES.md)
- **Admin**: `/administrator/blog` (Crear con IA, Config IA), editor (Traducir con IA solo ES, Generar portada con IA)
- **API pública**: `GET /api/blog/translations?slug=&lang=` — mapa de slugs publicados por idioma
- **Código**: `src/lib/blog-locale-switch.ts`, `Navigation.tsx`, `src/lib/seo.tsx` (`buildBlogAlternates`)

### Chat IA (Mar-IA)
- **Widget**: `src/components/AIChatWidget.tsx` (avatar: `public/images/chat_ia_logo.jpg`)
- **Config**: `/administrator/chat-ia` (estado on/off en BD, modelo, prompts, tablas de conocimiento)
- **Historial**: `/administrator/chat-history`
- **APIs**: `/api/chat`, `/api/chat/config`, `/api/chat/rate`

### Leads y GoHighLevel (listo — actualizado jun 2026)
- **Captura**: `POST /api/leads` → Supabase `leads` (upsert email/teléfono) + GHL API + webhook (`GHL_INCOMING_WEBHOOK_SALUD`)
- **Webhook v2**: un POST **por servicio**; payload plano (`ciudad` = destino, `ciudad_origen` = procedencia, `origen: web`) — ver **`README.md`** § «Corrección payload GHL — junio 2026»
- **Briefs cliente**: `H4S_BR_1_v2.DOC` (definitivo), `H4S_BR_1.doc`, `Brief_Javi_Fix_Leads_Web.docx`
- **Código**: `src/lib/gohighlevel.ts`, `src/lib/ghl-spanish-labels.ts`, `src/app/api/leads/route.ts`
- **Admin**: `/administrator/leads`
- **Env**: `.env.example`, deploy **`CONFIGURACION_VERCEL.md`**

### Hub Colaboradores (comisiones internas)
- **Doc técnica**: [`docs/HUB_COLABORADORES.md`](./docs/HUB_COLABORADORES.md)
- **Resumen cliente**: [`HUB_ESTADO_SENCILLO.md`](./HUB_ESTADO_SENCILLO.md) · PDF [`docs/reunion-cliente-resumen.pdf`](./docs/reunion-cliente-resumen.pdf)
- **App**: `/hub/login` → dashboard, liquidaciones, asignación, comisiones, integraciones GHL
- **APIs**: `/api/hub/*` · código en `src/lib/hub/`
- **BD**: `supabase/19-hub-colaboradores.sql` · **CVR GHL pendiente** (Claudia: stages + webhook + mapeo closers)
- **Nota**: Partners (`/es/partners`) **no** usa GHL; Hub sí para rendimiento/CVR.

### Partners (Fase 1 — captación B2B)
- **Doc completo**: **[`docs/PARTNERS_FASE1_CAPTACION.md`](./docs/PARTNERS_FASE1_CAPTACION.md)** (BD, APIs, planes, ciudades→tier, ROI, operativa diaria del closer).
- **Acceso 1 público**: `/es/partners` (landing + formulario sin precios), `/es/partners/gracias` (confirmación honesta).
- **Acceso 2 privado** (magic link UUID, TTL 7d): `/es/partners/acceso?token=...` (calculadora ROI + selector multi-vertical + CTA contrato Founding), `/es/partners/acceso/contrato`.
- **Admin**: `/administrator/partners` (listado paginado + filtros + modal con cualificar A/B/C → token al portapapeles, rechazar, regenerar, set_stage).
- **APIs**: `POST/GET /api/partners/leads`, `POST /api/partners/qualify`, `GET /api/partners/access/[token]`, `POST /api/partners/contract-request`.
- **Lógica de negocio**: `src/lib/partners.ts` — matriz Tier × Plan, 19 ciudades→tier, multi-vertical (0/10/30/40 +5pp Founding), zonas adicionales (50%, desde ESCALA), Founding (30% × 6m), `computeRoi()`.
- **BD**: `supabase/16-partner-leads.sql` (tabla `partner_leads`, RLS deny all anon/authenticated, vista `admin_partner_leads_overview`).
- **i18n**: `t.footer.forPartners` traducido en los 5 idiomas; clave `partners` reservada en `routes.ts`. En v0 solo se renderiza `/es/partners`; el footer de cualquier locale enlaza a esa URL.

### Guía «Vivir en España» (HTML estático)
- **Doc técnica**: [`docs/GUIA_VIVIR_ESPANA.md`](./docs/GUIA_VIVIR_ESPANA.md)
- **Producción**: `public/guia-vivir-espana.html` → https://www.health4spain.com/guia-vivir-espana.html
- **Backup cliente**: `guia definitiva para vivir en España_ORG.html` (mantener sincronizado)
- **CTAs formulario**: alinear con `src/lib/routes.ts` (`solicitar` / `request` / `anfrage` / `demande`)

### Contenido de Ciudades

1. Editar `GUIA_COTENIDO_LANDING_DESTINOS` si necesitas cambiar la estructura
2. `node scripts/generate-city-content-full.js --all` - Regenerar español
3. `node scripts/translate-cities-content.js --force` - Traducir a 4 idiomas

### Multi-Idioma

- **UI estático**: Editar `src/lib/dictionaries.ts`
- **URLs**: Editar `src/lib/routes.ts`
- **Contenido dinámico**: Supabase (columna `idioma`/`lang`)
- **Traducción masiva**: `node scripts/translate-all.js`

### SEO

- **Helpers**: `src/lib/seo.tsx` (JSON-LD, OG, hreflang)
- **Robots**: `src/app/robots.ts`
- **Sitemap**: `src/app/sitemap.ts`
- **HTML lang**: `src/components/HtmlLang.tsx`

### Deploy

1. `npm run build` (verifica 744+ páginas, 0 errores)
2. `git push` → Vercel autodeploy

---

## 📊 Estadísticas del Proyecto

| Métrica | Valor |
|---------|-------|
| Páginas estáticas | 708+ |
| Idiomas | 5 (ES, EN, FR, DE, PT) |
| Ciudades | 19 |
| Secciones por ciudad | 14 |
| Claves traducción UI | 200+ |
| Landing pages SEO | 176+ |
| Artículos blog | 30+ × 5 idiomas |
| Tablas Supabase | 21+ (incl. chatbot_config, chat_messages, partner_leads, hub_*, **ai_blog_config**) |
| Endpoints API Partners | 4 (`leads`, `qualify`, `access/[token]`, `contract-request`) |

---

**Última actualización:** 30 de junio de 2026  
**Versión:** 3.6.1
