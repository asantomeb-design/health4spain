# Meta Pixel (Facebook) — Health4Spain

**Pixel ID:** `1885591562124890`  
**Estado:** ✅ Activo en producción (mayo 2026)  
**Referencia Meta:** [Set up and install the Meta Pixel](https://www.facebook.com/business/help/952192354843755?id=1205376682832142)

---

## Resumen

El Meta Pixel mide visitas y conversiones de campañas de Meta Ads. En Health4Spain está integrado en la **web Next.js** (no solo en HTMLs de prototipo en `partners_doc/`).

| Capa | Qué hace |
|------|----------|
| **Código base** | `PageView` en todas las páginas públicas |
| **Eventos** | `Lead` al enviar formularios; `Contact` en landings HTML (mailto/WhatsApp) |
| **Consentimiento** | Solo se carga si el usuario acepta cookies de **Marketing** (GDPR) |

---

## Archivos en el código

| Archivo | Rol |
|---------|-----|
| `src/app/layout.tsx` | Monta `<MetaPixel />` globalmente (como `GoogleAnalytics`) |
| `src/components/MetaPixel.tsx` | Inicializa pixel tras consentimiento; `PageView` en cambio de ruta |
| `src/lib/meta-pixel.ts` | Loader oficial Meta, `trackMetaEvent()`, `loadMetaPixel()` |
| `src/components/CookieConsent.tsx` | Llama `loadMetaPixel()` al aceptar Marketing |

### Formularios con evento `Lead`

- `src/components/LeadForm.tsx`
- `src/components/LandingFormEmbed.tsx`
- `src/app/es/solicitar/ContactFormClient.tsx`
- `src/app/es/partners/PartnersFormClient.tsx`

### Excluido a propósito

- `/administrator/*` — panel interno, no campañas
- Hub logado (`nueva_fase_partners/H4S_Hub_App_v17.html`)

### HTMLs de prototipo (partners)

También llevan pixel + eventos en:

- `partners_doc/H4S_Partners_Web_Final (1).html`
- `partners_doc/H4S_Partners_Acceso1_Atraccion.html`
- `partners_doc/H4S_Partners_Acceso2_Cualificado.html`
- `nueva_fase_partners/H4S_Partners_ES_Landing,ultima v.html`
- `nueva_fase_partners/H4S_Sistema_Plazas_v2.html`

Solo aplican si esos HTML se sirven directamente; la web principal es Next.js.

---

## Variable de entorno

```env
NEXT_PUBLIC_META_PIXEL_ID=1885591562124890
```

| Entorno | Dónde configurar |
|---------|------------------|
| Local | `.env.local` |
| Vercel | Settings → Environment Variables → Production + Preview |
| Documentación | `.env.example`, `CONFIGURACION_VERCEL.md` |

Tras añadir o cambiar la variable en Vercel: **Redeploy** obligatorio.

---

## Verificación

1. Entrar en `https://www.health4spain.com` (cualquier idioma).
2. Aceptar cookies → marcar **Marketing** (o «Aceptar todas»).
3. Extensión [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc):
   - Debe mostrar pixel `1885591562124890`
   - Evento `PageView` activo
4. Enviar un formulario de prueba → debe aparecer `Lead`.
5. **Events Manager** (Meta) → pixel → Test events / Overview.

### Si no aparece el pixel

- ¿Aceptaste cookies de Marketing?
- ¿Está `NEXT_PUBLIC_META_PIXEL_ID` en Vercel y hubo redeploy?
- ¿Miras la web Next.js y no un HTML suelto de `partners_doc/`?

---

## Diferencia con Google Analytics

| | Google Analytics | Meta Pixel |
|---|------------------|------------|
| Objetivo | Tráfico y comportamiento | Optimización de anuncios Meta |
| Ubicación | `GoogleAnalytics.tsx` en `layout.tsx` | `MetaPixel.tsx` en `layout.tsx` |
| Consentimiento | Categoría **Análisis** | Categoría **Marketing** |
| Eventos clave | page_view, custom events | PageView, Lead, Contact |

---

## Próximo paso opcional: Conversions API (CAPI)

Meta recomienda complementar el pixel del navegador con **Conversions API** (envío server-side desde `/api/leads` cuando se crea un lead). Mejora medición con bloqueadores de cookies e iOS. No implementado aún.
