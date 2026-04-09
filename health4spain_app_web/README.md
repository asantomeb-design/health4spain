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

**✅ ESTADO**: Proyecto multi-idioma, SEO completo, **GoHighLevel (CRM) + leads en español**, panel admin de leads, production-ready — **v3.2.0** (9 Abr 2026)

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
- **IA**: OpenAI (GPT-4o, GPT-4o-mini, GPT-4.1, GPT-3.5 Turbo) para chat y generación de contenido
- **Chat IA (Mar-IA)**: Widget flotante con asistente virtual; detección de idioma en dos agentes; contexto desde Supabase (servicios, ciudades, blog, landings); sin caché para estado activo/inactivo
- **Optimización**: sharp (conversión WebP)
- **i18n**: Sistema híbrido (Supabase dinámico + dictionaries.ts estático)

---

## 📁 Estructura del Proyecto

```
health4spain/
├── src/
│   ├── app/
│   │   ├── api/                    # API Routes (chat, chat/config, chat/rate, leads)
│   │   ├── administrator/          # Panel admin (Chat IA, Chat History, Blog, Leads…)
│   │   ├── es/                     # Rutas español
│   │   │   ├── blog/               # Blog + [slug]
│   │   │   ├── contacto/
│   │   │   ├── destinos/           # Listado + [slug] (19 ciudades)
│   │   │   ├── servicios/          # Listado + [slug] (4 servicios)
│   │   │   ├── solicitar/          # Formulario multi-paso
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
│   │   ├── CookieConsent.tsx       # GDPR
│   │   ├── LandingFormEmbed.tsx    # Formulario en landings
│   │   └── ServiceIcon.tsx         # Iconos por servicio
│   └── lib/
│       ├── supabase.ts             # Cliente Supabase
│       ├── data.ts                 # Capa de datos compartida (locale-aware)
│       ├── dictionaries.ts         # Traducciones UI (5 idiomas, 200+ claves)
│       ├── routes.ts               # URLs traducidas por idioma
│       ├── seo.tsx                 # SEO helpers (JSON-LD, OG, hreflang, Place, Service+areaServed)
│       ├── services.ts             # RPCs traducidas
│       └── ciudades.ts             # Funciones ciudades
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
│   └── 14-landing-visa-no-lucrativa-de-fr-pt.sql  # Landings visa no lucrativa DE+FR+PT
└── public/images/                      # chat_ia_logo.jpg (avatar Mar-IA), favicon, logos
```

---

## 🌐 Sistema Multi-Idioma

### Arquitectura Híbrida

| Tipo de contenido | Fuente | Cómo funciona |
|-------------------|--------|---------------|
| **UI estático** (botones, títulos, labels) | `src/lib/dictionaries.ts` | 200+ claves en 5 idiomas |
| **Blog posts** | Supabase `blog_posts` | Columna `lang` (es/en/fr/de/pt) |
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
- ✅ **Hreflang**: Alternates en todas las páginas (5 idiomas)
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
| `blog_posts` | 30+ × 5 | Artículos blog multiidioma |
| `ciudades_catalogo` | 19 | Catálogo ciudades |
| `servicios_catalogo` | 4 | Catálogo servicios |
| `leads` | Variable | Leads capturados (privado; no accesible por el chat) |
| `chatbot_config` | 1 | Configuración Chat IA: enabled, modelo, prompts, tablas de conocimiento |
| `chat_messages` | Variable | Historial de conversaciones y valoraciones (privado) |
| `idiomas` | 5 | Idiomas activos |
| `servicios_catalogo_traducciones` | 4 × 5 | Traducciones servicios |
| `ciudades_catalogo_traducciones` | 19 × 5 | Traducciones ciudades |

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

- **POST `/api/leads`**: guarda en Supabase (`leads`) y, si hay variables de entorno, sincroniza con GHL.
- **API v2**: `createGHLContact` — upsert de contacto; custom fields con **texto en español** (servicio, urgencia, presupuesto, ciudad de interés, idioma) vía `src/lib/ghl-spanish-labels.ts` y `GHL_CUSTOM_FIELD_IDS` (JSON en `.env`).
- **Webhook entrante único**: `GHL_INCOMING_WEBHOOK_SALUD` — payload con slugs técnicos y campos `*_es` (`servicio_es`, `urgencia_es`, `presupuesto_es`, `ciudad_servicio_espana_nombre`, `pais_origen_es`, `fecha_nacimiento_legible_es`, etc.) para workflows y merge tags **sin traducir en GHL**; el formulario puede estar en EN/FR/DE/PT.
- **Admin**: `/administrator/leads` — listado y **eliminación** de leads (auth admin).
- **Detalle**: variables y mapeo sugerido en `.env.example`.

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
OPENAI_API_KEY=                    # Requerido para Chat Mar-IA y scripts de generación
NEXT_PUBLIC_TINYMCE_API_KEY=
NEXT_PUBLIC_WHATSAPP_NUMBER=34644404562
NEXT_PUBLIC_SITE_URL=https://www.health4spain.com

# GoHighLevel (opcional — ver .env.example para mapeo de campos)
# GHL_PRIVATE_TOKEN=
# GHL_LOCATION_ID=
# GHL_INCOMING_WEBHOOK_SALUD=
# GHL_CUSTOM_FIELD_IDS={"ciudad_interes":"uuid-..."}
```

---

## 📄 Documentación

- [ESTADO_PROYECTO.md](./ESTADO_PROYECTO.md) - Estado actual completo
- [INDICE_DOCUMENTACION.md](./INDICE_DOCUMENTACION.md) - Índice completo
- [docs/AUDITORIA.md](./docs/AUDITORIA.md) - Auditoría técnica
- [docs/MODELO_NEGOCIO.md](./docs/MODELO_NEGOCIO.md) - Modelo de negocio
- [scripts/README.md](./scripts/README.md) - Scripts disponibles

---

**Estado**: ✅ MULTI-IDIOMA, SEO COMPLETO, GHL + LEADS (ES), PRODUCTION-READY  
**Última actualización**: 9 de abril de 2026  
**Versión**: 3.2.0  
**Build**: 748+ páginas estáticas (tras landings visa no lucrativa en BD)  
**Licencia**: Privado - Health4Spain © 2026
