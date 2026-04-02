# ✅ Configuración Supabase Completada

## 📦 Lo que se ha configurado

### 1. Entorno Local (`.env.local`)

He creado el archivo `.env.local` con:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://dtbpgcmwniguslhfsbio.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Admin
NEXT_PUBLIC_ADMIN_EMAILS=asantomebb@gmail.com

# Otras variables (configurar según necesites)
NEXT_PUBLIC_TINYMCE_API_KEY=tu-api-key-de-tinymce
NEXT_PUBLIC_WHATSAPP_NUMBER=34XXXXXXXXX
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Health4Spain
```

### 2. Scripts de Verificación

- **`npm run test-supabase`**: Prueba la conexión con Supabase y verifica tablas, storage y auth

### 3. Documentación

- **`CONFIGURACION_VERCEL.md`**: Guía completa para configurar las variables de entorno en Vercel
- **GoHighLevel (opcional)**: Si usas CRM GHL, añade `GHL_PRIVATE_TOKEN`, `GHL_LOCATION_ID`, `GHL_INCOMING_WEBHOOK_SALUD` y opcionalmente `GHL_CUSTOM_FIELD_IDS` según `.env.example` — integración **lista en código** (abril 2026).

---

## 🚀 Próximos Pasos

### Paso 1: Verificar la conexión local

```bash
npm run test-supabase
```

Este comando verificará:
- ✅ Variables de entorno configuradas
- ✅ Conexión a Supabase funciona
- ✅ Tablas existen (blog_posts, landing_pages, leads)
- ✅ Storage buckets configurados (blog-images, media)
- ✅ Autenticación configurada

### Paso 2: Inicializar la base de datos (si es necesario)

Si el script de verificación indica que faltan tablas, ejecuta los scripts SQL:

1. Ve a tu proyecto en Supabase: https://dtbpgcmwniguslhfsbio.supabase.co
2. Dashboard → SQL Editor → New Query
3. Ejecuta los siguientes scripts en orden:

```bash
# 1. Crear tablas principales
/supabase/schema.sql

# 2. Crear tabla de landing pages
/supabase/landing-pages-schema.sql

# 3. Configurar políticas RLS
/supabase/rls-policies.sql

# 4. Crear storage buckets
/supabase/storage-buckets.sql

# 5. Configurar políticas de storage
/supabase/storage-policies.sql
```

### Paso 3: Configurar Google OAuth (para login)

1. Ve a Supabase: Settings → Authentication → Providers
2. Habilita "Google"
3. Configura:
   - **Client ID**: Obtener de Google Cloud Console
   - **Client Secret**: Obtener de Google Cloud Console
   - **Redirect URL**: Copiar y configurar en Google

### Paso 4: Obtener API Key de TinyMCE (para el blog)

1. Regístrate en https://www.tiny.cloud/
2. Crea una cuenta gratuita
3. Copia tu API Key
4. Añádela a `.env.local`:
   ```bash
   NEXT_PUBLIC_TINYMCE_API_KEY=tu-api-key
   ```

### Paso 5: Iniciar el proyecto

```bash
npm run dev
```

Visita http://localhost:3000 y verifica:
- ✅ La página principal carga
- ✅ El login de Google funciona
- ✅ Puedes acceder a `/administrator` con tu email autorizado
- ✅ El editor de blog funciona
- ✅ Los formularios de leads funcionan

### Paso 6: Configurar Vercel (para producción)

Sigue la guía en `CONFIGURACION_VERCEL.md`:

1. Ve a Vercel → Tu proyecto → Settings → Environment Variables
2. Añade todas las variables de entorno
3. Selecciona los entornos: Production, Preview, Development
4. Redeploy el proyecto

---

## 📋 Checklist de Configuración

### Local (Desarrollo)
- [x] `.env.local` creado con credenciales de Supabase
- [ ] `npm run test-supabase` ejecutado exitosamente
- [ ] Tablas de base de datos creadas
- [ ] Storage buckets configurados
- [ ] Google OAuth configurado
- [ ] TinyMCE API Key configurada
- [ ] `npm run dev` funciona correctamente

### Vercel (Producción)
- [ ] Variables de entorno de Supabase configuradas
- [ ] `NEXT_PUBLIC_ADMIN_EMAILS` configurado
- [ ] `NEXT_PUBLIC_SITE_URL` configurado con `https://www.health4spain.com` (producción)
- [ ] TinyMCE API Key configurada
- [ ] WhatsApp configurado (opcional)
- [ ] Google Analytics configurado (opcional)
- [ ] Proyecto redeployado

### Supabase (Base de datos)
- [ ] Tablas creadas (schema.sql)
- [ ] Landing pages configuradas (landing-pages-schema.sql)
- [ ] RLS policies aplicadas (rls-policies.sql)
- [ ] Storage buckets creados (storage-buckets.sql)
- [ ] Storage policies aplicadas (storage-policies.sql)
- [ ] Google OAuth configurado en Authentication

---

## ⚠️ Notas de Seguridad

### Variables Públicas (frontend - seguras de exponer)
Estas variables empiezan con `NEXT_PUBLIC_` y son accesibles desde el navegador:

- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` (tiene permisos limitados por RLS)
- ✅ `NEXT_PUBLIC_ADMIN_EMAILS`
- ✅ `NEXT_PUBLIC_TINYMCE_API_KEY`
- ✅ `NEXT_PUBLIC_SITE_URL`
- ✅ `NEXT_PUBLIC_WHATSAPP_NUMBER`
- ✅ `NEXT_PUBLIC_GA_MEASUREMENT_ID`

### Variables Privadas (backend - NUNCA exponer)
Estas variables NO tienen `NEXT_PUBLIC_` y solo son accesibles en el servidor:

- ❌ `SUPABASE_SERVICE_ROLE_KEY` (bypassa todas las políticas RLS)
- ❌ `OPENAI_API_KEY`
- ❌ `RESEND_API_KEY`

**IMPORTANTE**: Nunca uses variables privadas en componentes de React o código que se ejecute en el navegador.

---

## 🐛 Solución de Problemas

### Error: "Supabase client error"
- Verifica que las variables en `.env.local` estén correctamente configuradas
- Ejecuta `npm run test-supabase` para diagnosticar

### Error: "Relation does not exist"
- Las tablas no están creadas
- Ejecuta los scripts SQL en Supabase SQL Editor

### Error: "Row Level Security policy violation"
- Las políticas RLS no están configuradas correctamente
- Ejecuta `rls-policies.sql` en Supabase

### Error: "Storage bucket not found"
- Los buckets de storage no existen
- Ejecuta `storage-buckets.sql` y `storage-policies.sql`

### Error: "No tienes permisos de administrador"
- Verifica que tu email esté en `NEXT_PUBLIC_ADMIN_EMAILS`
- El email debe coincidir exactamente con el de tu cuenta de Google

---

## 📞 Recursos Útiles

- **Supabase Dashboard**: https://dtbpgcmwniguslhfsbio.supabase.co
- **Documentación Supabase**: https://supabase.com/docs
- **TinyMCE**: https://www.tiny.cloud/
- **Google Cloud Console**: https://console.cloud.google.com/
- **Vercel Dashboard**: https://vercel.com/dashboard

---

## 🎉 ¡Todo Listo!

Has completado la configuración de Supabase para tu proyecto Health4Spain.

**Comandos útiles**:
- `npm run dev` - Iniciar servidor de desarrollo
- `npm run test-supabase` - Verificar conexión a Supabase
- `npm run build` - Compilar para producción
- `npm run generate-landings` - Generar landing pages con IA

**Próximo paso**: Ejecuta `npm run test-supabase` para verificar que todo esté configurado correctamente.
