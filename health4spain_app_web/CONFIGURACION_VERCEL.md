# 🚀 Configuración de Vercel - Health4Spain

## 📋 Variables de Entorno para Vercel

Debes configurar estas variables de entorno en tu proyecto de Vercel:

### 1. Ve a tu proyecto en Vercel
- Dashboard → Tu Proyecto → Settings → Environment Variables

### 2. Añade las siguientes variables:

#### 🔐 SUPABASE (Obligatorio)

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://dtbpgcmwniguslhfsbio.supabase.co` | URL de tu proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0YnBnY213bmlndXNsaGZzYmlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMTg3MTksImV4cCI6MjA4NTY5NDcxOX0.E6wgzfgBffGyZqnVMY4ljqPI7tm47t8JBJwjOwUHRm0` | Clave pública (frontend) |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0YnBnY213bmlndXNsaGZzYmlvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDExODcxOSwiZXhwIjoyMDg1Njk0NzE5fQ.mtN8Vy3mtrfFwVujCzE9qsKApf4D0mzzzr5Msyggp7Y` | Clave servidor (backend) ⚠️ |

#### 👤 ADMINISTRACIÓN (Obligatorio)

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `NEXT_PUBLIC_ADMIN_EMAILS` | `asantomebb@gmail.com` | Emails admin (separados por coma) |

#### 🌐 SITIO (Obligatorio)

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `NEXT_PUBLIC_SITE_URL` | `https://www.health4spain.com` | URL canónica (siempre con www) |
| `NEXT_PUBLIC_SITE_NAME` | `Health4Spain` | Nombre del sitio |

#### 📝 TINYMCE (Obligatorio para Blog)

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `NEXT_PUBLIC_TINYMCE_API_KEY` | Tu API Key | Obtener en https://www.tiny.cloud/ |

#### 📱 WHATSAPP (Opcional)

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `34XXXXXXXXX` | Número sin + ni espacios |

#### 📊 ANALYTICS (Opcional)

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` | Google Analytics 4 |
| `NEXT_PUBLIC_GTM_ID` | `GTM-XXXXXXX` | Google Tag Manager |

#### 🤖 OPENAI (Opcional)

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `OPENAI_API_KEY` | `sk-...` | Para generar landings automáticamente |

#### 📧 EMAIL (Opcional)

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `RESEND_API_KEY` | `re_...` | API de Resend.com |
| `NOTIFICATION_EMAIL` | `leads@health4spain.com` | Email para notificaciones |

#### 📇 GoHighLevel CRM (Opcional, listo en código)

| Variable | Descripción |
|----------|-------------|
| `GHL_PRIVATE_TOKEN` | Token de integración privada (scopes contacts) |
| `GHL_LOCATION_ID` | Location ID de la sub-cuenta |
| `GHL_INCOMING_WEBHOOK_SALUD` | URL del webhook entrante (un solo flujo para todos los servicios) |
| `GHL_CUSTOM_FIELD_IDS` | JSON `{ "clave": "uuid-campo-ghl" }` — ver `.env.example` |

Si el repo en GitHub incluye la carpeta padre, en Vercel el **Root Directory** debe ser `health4spain_app_web`.

---

## ⚙️ Configuración en Vercel

### Paso a paso:

1. **Accede a Vercel**: https://vercel.com/dashboard
2. **Selecciona tu proyecto**: Health4Spain
3. **Ve a Settings**: Settings → Environment Variables
4. **Añade cada variable**:
   - Pega el nombre de la variable
   - Pega el valor
   - Selecciona los entornos: ✅ Production, ✅ Preview, ✅ Development
   - Click en "Save"
5. **Redeploy**: Después de añadir todas las variables
   - Ve a "Deployments"
   - Click en los tres puntos del último deployment
   - Selecciona "Redeploy"

---

## ⚠️ Notas de Seguridad

- ❌ **NUNCA** subas el archivo `.env.local` a Git
- ❌ **NUNCA** expongas la `SUPABASE_SERVICE_ROLE_KEY` en el frontend
- ✅ Las variables que empiezan con `NEXT_PUBLIC_` son públicas (frontend)
- ✅ Las variables sin `NEXT_PUBLIC_` son privadas (solo servidor)

---

## ✅ Verificación

Después de configurar Vercel, verifica que todo funcione:

1. **Frontend**: Las variables `NEXT_PUBLIC_*` deben estar accesibles
2. **Backend**: Las rutas API deben poder usar `SUPABASE_SERVICE_ROLE_KEY`
3. **Auth**: Debe funcionar el login de Google
4. **Admin**: Solo emails autorizados pueden acceder a `/administrator`

---

## 🔄 Entornos

- **Production**: Tu dominio principal (ej: `https://www.health4spain.com` - siempre con www)
- **Preview**: Branches de Git (para testing)
- **Development**: Local (usa `.env.local`)

---

## 📞 Siguiente paso: Configurar TinyMCE

Para que el editor del blog funcione, necesitas:

1. Crear cuenta en https://www.tiny.cloud/
2. Obtener API Key gratuita
3. Añadir `NEXT_PUBLIC_TINYMCE_API_KEY` en Vercel

---

## 🗄️ Configuración de Supabase

Asegúrate de que en Supabase tengas configurado:

1. **Autenticación**: Settings → Authentication
   - ✅ Google OAuth configurado
   - ✅ Email confirmación (opcional)

2. **Storage**: Storage → Buckets
   - ✅ Bucket `blog-images` público
   - ✅ Bucket `media` público

3. **Database**: Tables
   - ✅ `blog_posts`
   - ✅ `landing_pages`
   - ✅ `leads`
   - ✅ RLS policies configuradas

4. **API**: Settings → API
   - ✅ URL y keys configuradas (ya lo tienes ✅)

---

## 📝 Checklist Final

- [ ] Variables de Supabase configuradas en Vercel
- [ ] `NEXT_PUBLIC_ADMIN_EMAILS` configurado
- [ ] `NEXT_PUBLIC_SITE_URL` configurado con `https://www.health4spain.com`
- [ ] TinyMCE API Key obtenida y configurada
- [ ] Proyecto redeployado en Vercel
- [ ] Login de Google funcionando
- [ ] Acceso al panel de administrador funcionando
- [ ] Editor de blog funcionando
- [ ] Formularios de leads funcionando
- [ ] (Opcional) Variables GHL configuradas y contacto creado en workflow de prueba

---

## 🆘 Solución de Problemas

### Error: "Supabase URL no configurada"
- Verifica que `NEXT_PUBLIC_SUPABASE_URL` esté en Vercel
- Redeploy el proyecto

### Error: "No tienes permisos de administrador"
- Verifica que `NEXT_PUBLIC_ADMIN_EMAILS` incluya tu email
- El email debe ser exactamente el mismo que usas en Google

### Error: "TinyMCE no carga"
- Obtén API Key en https://www.tiny.cloud/
- Configura `NEXT_PUBLIC_TINYMCE_API_KEY` en Vercel

---

**¡Todo listo!** 🎉

Una vez configurado Vercel con estas variables, tu aplicación estará lista para producción.
