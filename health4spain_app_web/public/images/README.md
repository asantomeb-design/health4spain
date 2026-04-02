# Imágenes del sitio

## Hero por página

Las imágenes de hero se definen en `src/lib/constants.ts` en `HERO_IMAGES`:

- `hero-home.webp` — Home
- `hero-servicios.webp` — Servicios
- `hero-destinos.webp` — Destinos
- `hero-contacto.webp` — Contacto
- `hero-nosotros.webp` — Sobre nosotros

Formato recomendado: 1920×1080 px, WebP.

## Logo

El logo unificado del sitio es **`h4s vertical color_recortado.webp`**. Se usa en:

- **Header / navegación**: `LOGO_PATHS.siglas` (en `src/lib/constants.ts`)
- **Footer**: `LOGO_PATHS.horizontal`
- **Open Graph y Twitter Cards**: `layout.tsx` y `src/lib/seo.tsx`
- **JSON-LD y meta SEO**: `src/lib/seo.tsx`

Todas las rutas de logo apuntan al mismo archivo en `LOGO_PATHS` (siglas, vertical, horizontal).

## Otros

- `chat_ia_logo.jpg` — Avatar del widget de chat Mar-IA (`AIChatWidget.tsx`, ruta `/images/chat_ia_logo.jpg`).
- `favicon.png` — Origen del favicon; en la raíz de `public/` se usan `favicon.ico`, `icon.png`, `apple-icon.png` y `manifest.json` para SEO e indexación.

_Documentación alineada con el README del proyecto (abril 2026)._
