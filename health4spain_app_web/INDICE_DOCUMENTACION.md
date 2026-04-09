# 📚 Índice de Documentación - Health4Spain

**Fecha:** 9 de abril de 2026  
**Estado:** ✅ Multi-idioma (5) | SEO completo | GHL + leads (ES) | 744+ páginas | 176+ landings SEO | Production-ready  
**Versión:** 3.2.0

---

## 📖 Documentación Principal

### 🎯 Documentos de Estado

| Archivo | Descripción | Estado |
|---------|-------------|--------|
| **[README.md](./README.md)** | 📘 Visión general, stack, GHL/leads ES, multi-idioma | ✅ Actualizado |
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
| **[CONFIGURACION_VERCEL.md](./CONFIGURACION_VERCEL.md)** | 🚀 Deploy en Vercel (+ vars GHL) | ✅ Actualizado |
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
| **[MODELO_PARTNERS_LEADS.md](./docs/MODELO_PARTNERS_LEADS.md)** | 🤝 Partners y leads (+ GHL operativo) | ✅ Actualizado |
| **[ESTRATEGIA_BLOG.md](./docs/ESTRATEGIA_BLOG.md)** | ✍️ Estrategia SEO blog | 📖 Referencia |

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

---

## 🎯 Guías Rápidas por Tarea

### Chat IA (Mar-IA)
- **Widget**: `src/components/AIChatWidget.tsx` (avatar: `public/images/chat_ia_logo.jpg`)
- **Config**: `/administrator/chat-ia` (estado on/off en BD, modelo, prompts, tablas de conocimiento)
- **Historial**: `/administrator/chat-history`
- **APIs**: `/api/chat`, `/api/chat/config`, `/api/chat/rate`

### Leads y GoHighLevel (listo)
- **Captura**: `POST /api/leads` → Supabase `leads` + (opcional) GHL API + webhook único
- **Código**: `src/lib/gohighlevel.ts`, `src/lib/ghl-spanish-labels.ts`
- **Admin**: `/administrator/leads` (listado y borrado)
- **Env / mapeo**: `.env.example` (`GHL_PRIVATE_TOKEN`, `GHL_LOCATION_ID`, `GHL_INCOMING_WEBHOOK_SALUD`, `GHL_CUSTOM_FIELD_IDS`)

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
| Páginas estáticas | 744+ |
| Idiomas | 5 (ES, EN, FR, DE, PT) |
| Ciudades | 19 |
| Secciones por ciudad | 14 |
| Claves traducción UI | 200+ |
| Landing pages SEO | 176+ |
| Artículos blog | 30+ × 5 idiomas |
| Tablas Supabase | 11+ (incl. chatbot_config, chat_messages) |

---

**Última actualización:** 9 de abril de 2026  
**Versión:** 3.2.0
