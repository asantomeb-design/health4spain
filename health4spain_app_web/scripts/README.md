# Scripts de Health4Spain

Automatización de generación de contenido, traducción y mantenimiento.

---

## ✅ ESTADO ACTUAL (2 abril 2026)

- ✅ **19 ciudades** con contenido completo (14 secciones basadas en guía migración)
- ✅ **Contenido traducido** a EN/FR/DE/PT con OpenAI GPT-4o
- ✅ **76 landing pages** generadas (4 servicios × 19 ciudades)
- ✅ **Blog multiidioma** traducido
- ✅ **644 páginas** en build final
- ✅ **Leads → Supabase + GoHighLevel** (opcional): ver README raíz y `.env.example`

---

## 🌍 generate-city-content-full.js ⭐ PRINCIPAL

Genera contenido SEO exhaustivo para las 19 ciudades basándose en la **GUIA_COTENIDO_LANDING_DESTINOS** (8 episodios + 3 anexos).

### Uso

```bash
# Todas las ciudades
node scripts/generate-city-content-full.js --all

# Ciudades específicas
node scripts/generate-city-content-full.js murcia alicante torrevieja

# Una ciudad
node scripts/generate-city-content-full.js cartagena
```

### Contenido Generado (14 secciones)

Cada ciudad recibe contenido específico y real:

| Sección | Campo DB | Tipo |
|---------|----------|------|
| Intro + por qué esta ciudad | `intro_text` | TEXT |
| Ventajas (5+) | `ventajas` | JSONB |
| Barrios/zonas (4+) | `barrios` | JSONB |
| Coste de vida | `coste_vida_*` (5 campos) | TEXT |
| Clima detallado | `clima_detalle` | TEXT |
| Primeros 30 días | `primeros_30_dias` | JSONB |
| Trámites esenciales (8+) | `tramites` | JSONB |
| Consulados y embajadas | `consulados_embajadas` | JSONB |
| Trabajo y emprendimiento | `trabajo_emprendimiento` | JSONB |
| Condiciones de entrada | `condiciones_entrada` | JSONB |
| Riesgos frontera | `riesgos_frontera` | JSONB |
| Residencia y nacionalidad | `residencia_nacionalidad` | JSONB |
| Integración práctica | `integracion_practica` | JSONB |
| Checklists (4 listas) | `checklists` | JSONB |
| FAQs (5+) | `faqs` | JSONB |
| Meta SEO | `meta_title`, `meta_description`, `meta_keywords` | TEXT |

### Características

- **Modelo**: GPT-4o (máxima calidad)
- **Prompt**: Basado íntegro en GUIA_COTENIDO_LANDING_DESTINOS
- **Datos reales**: Usa población, % extranjeros, provincia de `ciudades_catalogo`
- **Coste**: ~$0.43 para las 19 ciudades
- **Almacenamiento**: `ciudades_contenido` con `idioma='es'`

---

## 🌐 translate-cities-content.js

Traduce el contenido de ciudades del español a EN/FR/DE/PT usando OpenAI GPT-4o.

### Uso

```bash
# Traducir todas las ciudades a los 4 idiomas
node scripts/translate-cities-content.js --force

# Solo un idioma
node scripts/translate-cities-content.js --only=en

# Solo una ciudad
node scripts/translate-cities-content.js murcia

# Solo una ciudad y un idioma
node scripts/translate-cities-content.js --only=fr murcia
```

### Comportamiento

- Lee los registros en español de `ciudades_contenido`
- Traduce **todos** los campos (22 campos incluyendo 8 JSONB)
- Upsert en `ciudades_contenido` con el idioma correspondiente
- `--force`: Sobrescribe traducciones existentes
- Campos numéricos (temperatura_media, dias_sol) se copian sin traducir

### Coste

- ~$2.00 para 19 ciudades × 4 idiomas = 76 traducciones
- Modelo: GPT-4o

---

## 🔄 translate-all.js

Traducción masiva de blog posts y landing pages.

```bash
node scripts/translate-all.js
```

Traduce los contenidos de las tablas `blog_posts` y `landing_pages` del español a EN/FR/DE/PT.

---

## 📍 generate-landings.ts

Genera 76 landing pages (servicio × ciudad) con contenido SEO.

### Uso

```bash
npm run generate-landings                    # Todas
npm run generate-landings servicio=abogados  # Por servicio
npm run generate-landings ciudad=murcia      # Por ciudad
npm run check-landings                       # Verificar estado
npm run retry-landings                       # Regenerar incompletas
```

### Contenido por Landing

- Meta SEO (title, description, keywords)
- Hero (título, subtítulo, bullets)
- Problema → Solución
- Servicios específicos
- Por qué la ciudad
- FAQs (4-5)
- CTA

**Modelo**: GPT-4o-mini | **Coste**: ~$0.20 (76 landings)

---

## ✍️ generate-blog-posts.ts

Genera 30 artículos de blog en español.

```bash
npm run generate-blog
```

Categorías: Guías de Ciudad, Procedimientos, Salud, Finanzas, Vida en España.

**Modelo**: GPT-4o-mini | **Coste**: ~$1.00

---

## 🧪 test-supabase.ts

Verifica la conexión con Supabase.

```bash
npx ts-node scripts/test-supabase.ts
```

---

## 💰 Resumen de Costes

| Script | Modelo | Contenido | Coste |
|--------|--------|-----------|-------|
| `generate-city-content-full.js` | GPT-4o | 19 ciudades (14 secciones) | $0.43 |
| `translate-cities-content.js` | GPT-4o | 76 traducciones | ~$2.00 |
| `translate-all.js` | GPT-4o | Blog + landings × 4 idiomas | ~$1.50 |
| `generate-landings.ts` | GPT-4o-mini | 76 landing pages | $0.20 |
| `generate-blog-posts.ts` | GPT-4o-mini | 30 blog posts | $1.00 |
| **TOTAL** | | | **~$5.13** |

---

## 📋 Requisitos

Variables de entorno en `.env.local`:

```env
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Tablas necesarias:

```bash
supabase/schema.sql
supabase/landing-pages-schema.sql
supabase/09-expand-ciudades-contenido.sql
supabase/10-expand-text-fields.sql
```

---

## 🚀 Flujo de Trabajo

### Desde Cero

1. Ejecutar migraciones SQL en Supabase
2. `node scripts/generate-city-content-full.js --all` (contenido ciudades ES)
3. `node scripts/translate-cities-content.js --force` (traducir ciudades)
4. `npm run generate-landings` (76 landings)
5. `npm run generate-blog` (30 blog posts)
6. `node scripts/translate-all.js` (traducir blog + landings)
7. `npm run build` → Verificar 644 páginas

### Actualizar Contenido

```bash
# Regenerar una ciudad
node scripts/generate-city-content-full.js murcia

# Re-traducir
node scripts/translate-cities-content.js --force murcia
```

---

**Última actualización:** 2 de abril de 2026
