# Configuración de Supabase para Health4Spain

**Última actualización:** 9 abril 2026

---

## 1. Crear Proyecto

1. Ir a [supabase.com](https://supabase.com) y crear nuevo proyecto
2. Guardar las credenciales (Settings > API):
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service role key → `SUPABASE_SERVICE_ROLE_KEY`

## 2. Ejecutar Esquemas SQL

En **SQL Editor**, ejecutar en orden:

| # | Archivo | Descripción |
|---|---------|-------------|
| 1 | `schema.sql` | Esquema principal (leads, blog_posts) |
| 2 | `landing-pages-schema.sql` | Landing pages + ciudades_catalogo + servicios_catalogo |
| 3 | `01-limpiar-ciudades.sql` | (Opcional) Limpia ciudades no estratégicas |
| 4 | `02-insertar-19-ciudades.sql` | 19 ciudades: 12 Murcia + 7 Alicante |
| 5 | `03-actualizar-abogados.sql` | Abogados general (no solo extranjería) |
| 6 | `06-soporte-multi-idioma.sql` | Tabla idiomas + columnas idioma en tablas |
| 7 | `07-estructura-completa-multi-idioma.sql` | RPCs, traducciones servicios/ciudades |
| 8 | `08-traducciones-ciudades-catalogo.sql` | Traducciones catálogos EN/FR/DE/PT |
| 9 | `09-expand-ciudades-contenido.sql` | 8 columnas JSONB (guía migración completa) |
| 10 | `10-expand-text-fields.sql` | Campos expandidos a TEXT (meta, coste_vida, etc.) |
| 11 | `11-chatbot-config.sql` | Tabla `chatbot_config` (configuración Chat IA, singleton) |
| 12 | `12-chat-messages.sql` | Tabla `chat_messages` (historial conversaciones + ratings) |
| 13 | `13-landing-visa-no-lucrativa.sql` | Landings visa no lucrativa ES+EN (2 madre + 38 ciudad) |
| 14 | `14-landing-visa-no-lucrativa-de-fr-pt.sql` | Landings visa no lucrativa DE+FR+PT (3 madre + 57 ciudad) |
| 15 | `rls-policies.sql` | Row Level Security |
| 16 | `storage-policies.sql` | Políticas Storage |

## 3. Tablas Principales

| Tabla | Descripción | Idiomas |
|-------|-------------|---------|
| `leads` | Leads capturados (`POST /api/leads`); opcional envío a GoHighLevel | - |
| `blog_posts` | Artículos de blog | `lang` (es/en/fr/de/pt) |
| `landing_pages` | Landing pages SEO (76 servicio×ciudad + 100 visa no lucrativa) | `idioma` |
| `ciudades_catalogo` | 19 ciudades base | - |
| `servicios_catalogo` | 4 servicios base | - |
| `ciudades_contenido` | Contenido completo ciudades (22 campos) | `idioma` |
| `idiomas` | Idiomas activos (5) | - |
| `servicios_catalogo_traducciones` | Nombres servicios traducidos | 5 idiomas |
| `ciudades_catalogo_traducciones` | Nombres ciudades traducidos | 5 idiomas |
| `chatbot_config` | Configuración Chat IA (enabled, modelo, prompts, tablas conocimiento) | 1 fila |
| `chat_messages` | Historial conversaciones Mar-IA + valoración (correcta/mejorable/errónea) | Variable |

### ciudades_contenido (22 campos)

Tabla principal del contenido de ciudades con 14 secciones:

| Campo | Tipo | Contenido |
|-------|------|-----------|
| `meta_title` | VARCHAR(255) | Título SEO |
| `meta_description` | VARCHAR(500) | Descripción SEO |
| `meta_keywords` | TEXT | Keywords SEO |
| `intro_text` | TEXT | Introducción extensa |
| `ventajas` | JSONB | Array de ventajas |
| `barrios` | JSONB | Array de barrios/zonas |
| `coste_vida_alquiler` | TEXT | Coste alquiler |
| `coste_vida_compra` | TEXT | Coste compra |
| `coste_vida_alimentacion` | TEXT | Coste alimentación |
| `coste_vida_transporte` | TEXT | Coste transporte |
| `coste_vida_utilidades` | TEXT | Coste suministros |
| `clima_detalle` | TEXT | Clima detallado |
| `tramites` | JSONB | Trámites esenciales |
| `faqs` | JSONB | Preguntas frecuentes |
| `primeros_30_dias` | JSONB | Guía primeros 30 días |
| `consulados_embajadas` | JSONB | Info consular |
| `trabajo_emprendimiento` | JSONB | Sectores, portales, autónomos |
| `condiciones_entrada` | JSONB | Requisitos entrada España |
| `riesgos_frontera` | JSONB | Errores comunes frontera |
| `residencia_nacionalidad` | JSONB | Tipos residencia + nacionalidad |
| `integracion_practica` | JSONB | Asociaciones, apps, comunidades |
| `checklists` | JSONB | 4 checklists (viaje, primeros días, trámites, integración) |

### RPCs Disponibles

| Función | Descripción |
|---------|-------------|
| `get_servicio_traducido(p_slug, p_lang)` | Servicio con nombre traducido |
| `get_ciudad_traducida(p_slug, p_lang)` | Ciudad con nombre traducido |

## 4. Configurar Storage

1. Dashboard > **Storage** > **New bucket**
2. Nombre: `blog-images` | Public: ✅ ON
3. Ejecutar `storage-policies.sql`

## 5. Configurar Autenticación

1. **Authentication** > **Providers** > Email habilitado
2. **Authentication** > **Users** > Crear usuario admin
3. Email debe coincidir con `NEXT_PUBLIC_ADMIN_EMAILS`

## 6. Variables de Entorno

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_ADMIN_EMAILS=tu-email@gmail.com
```

---

## Troubleshooting

### "Invalid API key"
- Verificar keys en `.env.local`
- Reiniciar servidor (`npm run dev`)

### No puedo hacer login
- Crear usuario en Authentication > Users
- Email debe coincidir con `NEXT_PUBLIC_ADMIN_EMAILS`

### Las imágenes no se suben
- Verificar bucket `blog-images` (público)
- Ejecutar `storage-policies.sql`

### Error con columnas JSONB
- Verificar que `09-expand-ciudades-contenido.sql` se ejecutó
- Verificar que `10-expand-text-fields.sql` se ejecutó
