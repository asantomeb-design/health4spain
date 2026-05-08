# Blog: asistente IA, traducciones y multi-idioma

**Referencia técnica** (mayo 2026). Complementa la visión editorial en [`ESTRATEGIA_BLOG.md`](./ESTRATEGIA_BLOG.md).

---

## Resumen

| Área | Qué hay |
|------|---------|
| **Redacción asistida** | Wizard en `/administrator/blog` → «Crear con IA»: propuestas (blog o noticias vía SerpAPI), redacción con búsqueda web opcional, portada con modelo de imagen OpenAI, guardado como **borrador**. |
| **Configuración** | `/administrator/blog/ai-config` y tabla Supabase `ai_blog_config` (`supabase/15-ai-blog-config.sql`). |
| **Idioma maestro** | El contenido nuevo con IA se crea siempre en **español**; las demás lenguas se generan con **Traducir con IA** desde el editor del post ES. |
| **Enlaces entre traducciones** | Columna `translation_group_id` (UUID compartido por cada versión idioma del mismo artículo). `supabase/17-blog-translation-groups.sql`. |
| **SEO hreflang** | `buildBlogAlternates()` en `src/lib/seo.tsx` + slugs reales por idioma desde `getBlogTranslations()` (`src/lib/data.ts`). |
| **Selector de idioma en artículos** | `Navigation.tsx` (navbar público) y `LanguageSwitcher.tsx` llaman a `GET /api/blog/translations` y usan `hrefForLocaleSwitch()` (`src/lib/blog-locale-switch.ts`). Sin traducción publicada → se enlaza al listado `/{locale}/blog`. |
| **Portadas IA** | Subidas a Storage `blog-images` carpeta `ai-covers/`. En el editor: «Generar portada con IA». Tamaños de imagen según modelo (gpt-image vs DALL·E 3) normalizados en `/api/admin/blog/ai/generate-cover`. |

---

## Variables de entorno

| Variable | Dónde | Uso |
|----------|--------|-----|
| `OPENAI_API_KEY` | Servidor (Vercel / `.env.local`) | Chat Mar-IA, asistente blog (texto + imágenes), scripts si aplica. |
| `SERPAPI_KEY` | Servidor | Modo «Noticias» del asistente (Google News vía SerpAPI). Sin clave, ese modo no funcionará. |

No exponer ninguna clave con prefijo `NEXT_PUBLIC_`.

---

## Base de datos

### `blog_posts`

Campos relevantes (además de título, slug, contenido HTML, SEO, etc.):

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `lang` | `es` \| `en` \| `de` \| `fr` \| `pt` | Idioma del post. |
| `translation_group_id` | `uuid` NOT NULL | Mismo UUID para todas las filas que son traducciones entre sí. Índice único `(translation_group_id, lang)` evita duplicar idioma en un grupo. |
| `status` | texto | `draft` \| `published` \| `archived` |
| `featured_image` | texto opcional | URL pública (p. ej. Supabase Storage). |

La migración **17** hace backfill heurístico (mismo `slug` + misma `category` que la versión ES) para datos antiguos; el trigger asigna UUID en nuevos inserts si no se envía grupo.

### `ai_blog_config`

Tabla **singleton** (una fila): modelos OpenAI (propuestas, redactor, traductor, imagen), temperaturas, prompts sistema, estilo de imagen, tamaño, parámetros SerpAPI/noticias, guía editorial. RLS: solo rol de servicio / políticas acordes al proyecto.

---

## API Routes (blog IA)

Todas bajo `/api/admin/blog/ai/*` exigen **JWT de admin** (`Authorization: Bearer`, Supabase session) salvo que se indique lo contrario.

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET/PUT | `/api/admin/blog/ai/config` | Leer/actualizar `ai_blog_config`. |
| POST | `/api/admin/blog/ai/suggest-titles` | Propuestas de títulos (blog). |
| POST | `/api/admin/blog/ai/search-news` | Titulares noticias (SerpAPI). |
| POST | `/api/admin/blog/ai/write` | Generar cuerpo del artículo. |
| POST | `/api/admin/blog/ai/generate-cover` | Imagen portada → sube a `blog-images/ai-covers/`. |
| POST | `/api/admin/blog/ai/save-draft` | Persistir borrador (asigna grupo si aplica). |
| POST | `/api/admin/blog/ai/translate` | Traducir desde post ES a otros idiomas (reutiliza `translation_group_id`). |

### Pública (sin auth)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/blog/translations?slug=…&lang=…` | Mapa `{ es?: slug, en?: slug, … }` de **posts publicados** del mismo grupo. Cache-Control público. |

---

## Flujo recomendado para el equipo

1. **Crear con IA** (español) → revisar borrador → publicar cuando toque.  
2. Abrir el artículo en español → **Traducir con IA** → revisar borradores EN/DE/FR/PT.  
3. **Generar portada con IA** en el wizard o en el bloque «Imagen destacada» del editor.  
4. En **Config IA**, si usas **`gpt-image-*`** (`gpt-image-1.5`, `gpt-image-2`, etc.), elegir tamaño `auto`, `1024x1024`, `1536x1024` o `1024x1536` (no usar `1792x1024` como valor fijo; el backend también normaliza). **`gpt-image-2`** puede exigir **organización verificada** en OpenAI; si recibes 403, usa **`gpt-image-1.5`** hasta completar la verificación.

---

## Código clave

| Ruta | Rol |
|------|-----|
| `src/components/admin/BlogAIAssistant.tsx` | Wizard 4 pasos. |
| `src/lib/ai/openai-blog.ts` | Cliente OpenAI, config, utilidades (p. ej. `safeChatCompletion` para modelos sin temperature custom). |
| `src/lib/ai/serpapi.ts` | Wrapper noticias. |
| `src/lib/blog-locale-switch.ts` | Regex artículo blog + `hrefForLocaleSwitch`. |
| `src/components/Navigation.tsx` | Navbar producción + fetch traducciones en posts. |
| `src/lib/data.ts` | `getBlogTranslations`, lecturas blog públicas. |

`Header.tsx` no forma parte del layout actual (`es/layout.tsx` usa `Navigation`), pero reutiliza el mismo helper por si se usa en otro contexto.

---

## Orden de migraciones SQL (fragmento)

Después de `15-ai-blog-config.sql`, ejecutar **`17-blog-translation-groups.sql`** y, si quieres forzar **`gpt-image-1.5`** en config existente, **`18-ai-blog-model-image-gpt-image-1.5.sql`**, en producción si aún no están aplicadas. Ver lista completa en [`supabase/README.md`](../supabase/README.md).

---

## Incidencias frecuentes

- **400 temperature / sampling**: modelos como `gpt-5-mini` pueden rechazar `temperature`; el código reintenta sin sampling (`safeChatCompletion`).  
- **Portada IA falla por tamaño**: revisar modelo en Config IA y tabla de tamaños en la misma pantalla.  
- **403 «organization must be verified» con `gpt-image-2`**: verificar la organización en [OpenAI → Organization settings](https://platform.openai.com/settings/organization/general) o cambiar temporalmente el modelo de imagen a **`gpt-image-1.5`**.  
- **Upload Storage**: bucket `blog-images` público + políticas que permitan **service role** escribir desde API routes.

---

*Mantener este archivo al cambiar rutas, env vars o restricciones del asistente.*
