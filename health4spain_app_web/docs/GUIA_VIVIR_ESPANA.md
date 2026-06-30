# Guía interactiva «Vivir en España» (HTML estático)

**URL pública:** https://www.health4spain.com/guia-vivir-espana.html  
**Versión documentada:** 3.6.1 · **30 junio 2026**

---

## Qué es

Página **autocontenida** (HTML + CSS + JS embebidos) con:

- Itinerario paso a paso (NIE, trámites, seguro, TIE…)
- Fichas de **19 ciudades** (comisaría, sanidad, transporte, asociaciones)
- Recomendador por perfil («No sé dónde ir»)
- Directorio de **asociaciones** por nacionalidad y localidad
- **Generador de itinerario** personalizado (origen, perfil, ciudad)
- **5 idiomas** de interfaz (ES, EN, DE, FR, PT) vía JS + `localStorage`

No es una ruta Next.js: se sirve desde `public/` y Vercel la expone en la raíz del dominio.

---

## Archivos en el repositorio

| Archivo | Uso |
|---------|-----|
| `public/guia-vivir-espana.html` | **Producción** — lo que ve el usuario |
| `guia definitiva para vivir en España_ORG.html` | Copia de trabajo / backup del cliente (debe mantenerse **idéntica** a `public/`) |

Tras cada cambio en producción, sincronizar ambos archivos.

---

## Política de mantenimiento (acordada jun 2026)

1. **Estado actual:** v1 provisional en HTML; suficiente mientras no requiera menú, CMS ni integración profunda con la app.
2. **Entregas del cliente:** el HTML del cliente sirve como **referencia de contenido**, no como canal de publicación directa sin revisión.
3. **Próxima evolución:** integrar en Next.js solo si entra en navegación principal, requiere edición frecuente o debe compartir analytics/legal/chat con el resto del site.
4. **Antes de publicar cambios:** revisar enlaces internos (formularios por idioma) y externos (asociaciones, URLs oficiales).

---

## Enlaces internos → formularios Health4Spain

Los CTAs usan `survPath()` / `survUrl()` en el JS embebido. **Deben coincidir** con `src/lib/routes.ts` (`request` por locale):

| Idioma UI (`LANG`) | Ruta formulario | Ejemplo |
|--------------------|-----------------|---------|
| `es` | `/es/solicitar` | `…/es/solicitar?servicio=seguros-de-salud&ciudad=torrevieja` |
| `pt` | `/pt/solicitar` | `…/pt/solicitar?servicio=gestorias` |
| `en` | `/en/request` | `…/en/request?servicio=abogados` |
| `de` | `/de/anfrage` | `…/de/anfrage?servicio=inmobiliarias` |
| `fr` | `/fr/demande` | `…/fr/demande?servicio=seguros-de-salud` |

**Contacto** en la cabecera apunta siempre a `/es/contacto` (intencional).

**Error histórico corregido (30 jun 2026):** la guía usaba `/en/solicitar`, `/de/solicitar`, `/fr/solicitar` → **404**. Sustituido por las rutas de la tabla anterior.

---

## Enlaces oficiales clave (mantenimiento)

| Recurso | URL correcta (jun 2026) |
|---------|-------------------------|
| Cita NIE (icpplus) | `https://sede.administracionespublicas.gob.es/icpplus/` |
| Impreso EX-15 | `https://www.inclusion.gob.es/web/migraciones/modelos-generales` |
| Tasa 790-012 | `https://sede.policia.gob.es/Tasa790_012/` |
| UNEDasiss | `https://unedasiss.uned.es` (no `unedasiss.es`) |
| Movibus (Murcia) | `https://movibus.carm.es/` (no `movibus.es`, SSL roto) |
| ALSA | `https://www.alsa.es` |

Algunos dominios `.gob.es` responden **403** a bots/curl pero funcionan en navegador.

---

## Asociaciones (datos embebidos)

Listas en constantes `NAT` y `LOC` dentro del HTML. Si una web cae:

- Actualizar URL si hay dominio nuevo (ej. HELP Murcia: `helpmurciamarmenor.es`).
- Si no hay web fiable: **quitar** la propiedad `w` y dejar nombre + teléfono (`m`).

Corrección **30 jun 2026:** enlaces rotos de ARIPI, AIPEA, ASVEGA, AHN (web eliminada); Beneluxos → raíz `viw-costablanca.com`; HELP Murcia → `.es`.

---

## Despliegue

1. Editar `public/guia-vivir-espana.html`
2. Copiar a `guia definitiva para vivir en España_ORG.html`
3. `git commit` + `git push` → Vercel redeploy automático
4. Verificar en producción (Ctrl+F5): https://www.health4spain.com/guia-vivir-espana.html

**Nota Dropbox:** si git falla con `Permission denied` en `.git/objects`, cerrar Dropbox sync antes de commit.

---

## Commits relacionados

| Commit | Descripción |
|--------|-------------|
| `509f8be` | Alta guía ORG + limpieza listeners duplicados |
| `d36003a` | Misma limpieza en `public/` |
| `2ca1818` | Corrección enlaces rotos (formularios, EX-15, UNEDasiss, transporte, asociaciones) |

---

## Referencias cruzadas

- Rutas Next traducidas: `src/lib/routes.ts`
- Formulario ES: `src/app/es/solicitar/page.tsx`
- Formularios EN/DE/FR: `src/app/en/request`, `de/anfrage`, `fr/demande`
- Meta Pixel: esta guía **no** incluye pixel ni cookie banner de Next; CTAs van a rutas Next que sí lo tienen.
