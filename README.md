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

### 4️⃣ **644 Páginas Estáticas**

76 landing pages SEO + blog multiidioma + páginas de destinos con contenido completo

**✅ ESTADO**: Proyecto multi-idioma, SEO completo, production-ready (24 Feb 2026)

---

## 🚀 Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Storage**: Supabase Storage (imágenes WebP)
- **Estilos**: Tailwind CSS
- **Editor**: TinyMCE
- **IA**: OpenAI GPT-4o / GPT-4o-mini
- **Optimización**: sharp (conversión WebP)
- **i18n**: Sistema híbrido (Supabase dinámico + dictionaries.ts estático)

---

## 📁 Estructura del Proyecto

```
health4spain/
├── src/
│   ├── app/
│   │   ├── api/                    # API Routes
│   │   ├── administrator/          # Panel admin
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
│   │   ├── CookieConsent.tsx       # GDPR
│   │   ├── LandingFormEmbed.tsx    # Formulario en landings
│   │   └── ServiceIcon.tsx         # Iconos por servicio
│   └── lib/
│       ├── supabase.ts             # Cliente Supabase
│       ├── data.ts                 # Capa de datos compartida (locale-aware)
│       ├── dictionaries.ts         # Traducciones UI (5 idiomas, 200+ claves)
│       ├── routes.ts               # URLs traducidas por idioma
│       ├── seo.tsx                 # SEO helpers (JSON-LD, OG, hreflang)
│       ├── services.ts             # RPCs traducidas
│       └── ciudades.ts             # Funciones ciudades
├── scripts/
│   ├── generate-city-content-full.js  # Generador contenido ciudades (guía completa)
│   ├── translate-cities-content.js    # Traductor ciudades (4 idiomas)
│   ├── translate-all.js               # Traductor masivo (blog, landings)
│   ├── generate-landings.ts           # Generador landing pages
│   └── generate-blog-posts.ts         # Generador blog
├── supabase/
│   ├── schema.sql                     # Esquema principal
│   ├── 07-estructura-completa-multi-idioma.sql
│   ├── 09-expand-ciudades-contenido.sql  # Nuevas secciones guía
│   └── 10-expand-text-fields.sql         # Campos expandidos
└── public/images/
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

- ✅ **JSON-LD**: Organization, WebSite, BlogPosting, BreadcrumbList, FAQPage, Service
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
| `landing_pages` | 76+ | Landing pages SEO |
| `blog_posts` | 30+ × 5 | Artículos blog multiidioma |
| `ciudades_catalogo` | 19 | Catálogo ciudades |
| `servicios_catalogo` | 4 | Catálogo servicios |
| `leads` | Variable | Leads capturados |
| `idiomas` | 5 | Idiomas activos |
| `servicios_catalogo_traducciones` | 4 × 5 | Traducciones servicios |
| `ciudades_catalogo_traducciones` | 19 × 5 | Traducciones ciudades |

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
OPENAI_API_KEY=
NEXT_PUBLIC_TINYMCE_API_KEY=
NEXT_PUBLIC_WHATSAPP_NUMBER=34600000000
NEXT_PUBLIC_SITE_URL=https://www.health4spain.com
```

---

## 📄 Documentación

- [ESTADO_PROYECTO.md](./ESTADO_PROYECTO.md) - Estado actual completo
- [INDICE_DOCUMENTACION.md](./INDICE_DOCUMENTACION.md) - Índice completo
- [docs/AUDITORIA.md](./docs/AUDITORIA.md) - Auditoría técnica
- [docs/MODELO_NEGOCIO.md](./docs/MODELO_NEGOCIO.md) - Modelo de negocio
- [scripts/README.md](./scripts/README.md) - Scripts disponibles

---

**Estado**: ✅ MULTI-IDIOMA, SEO COMPLETO, PRODUCTION-READY  
**Última actualización**: 24 de Febrero 2026  
**Build**: 644 páginas estáticas  
**Licencia**: Privado - Health4Spain © 2026
