# 🗄️ Guía Paso a Paso: Configurar Base de Datos en Supabase

Esta guía te ayudará a configurar completamente tu base de datos en Supabase.

---

## 📋 Prerequisitos

Antes de empezar, asegúrate de tener:
- ✅ Cuenta en Supabase creada
- ✅ Proyecto creado: https://dtbpgcmwniguslhfsbio.supabase.co
- ✅ Credenciales configuradas en `.env.local`

---

## Paso 1: Crear las Tablas Principales

### 1.1 Ve al SQL Editor

1. Abre tu proyecto en Supabase: https://dtbpgcmwniguslhfsbio.supabase.co
2. En el menú lateral, busca: **SQL Editor**
3. Click en **+ New query**

### 1.2 Ejecuta el Script de Esquema

1. Abre el archivo: `supabase/schema.sql`
2. Copia TODO el contenido
3. Pégalo en el SQL Editor de Supabase
4. Click en **▶ Run** (esquina inferior derecha)
5. Deberías ver: **Success. No rows returned**

**✅ Esto creará:**
- Tabla `blog_posts` (para el blog)
- Tabla `leads` (para los formularios)
- Tabla `partners` (para profesionales)
- Índices para mejor rendimiento
- Triggers para `updated_at`
- Políticas RLS básicas

---

## Paso 2: Crear Landing Pages

### 2.1 Nueva Query

1. En SQL Editor, click en **+ New query**

### 2.2 Ejecuta el Script de Landing Pages

1. Abre el archivo: `supabase/landing-pages-schema.sql`
2. Copia TODO el contenido
3. Pégalo en el SQL Editor
4. Click en **▶ Run**
5. Deberías ver: **Success. No rows returned**

**✅ Esto creará:**
- Tabla `landing_pages` (para páginas dinámicas)
- Índices para SEO
- Políticas RLS

---

## Paso 3: Configurar Políticas RLS

### 3.1 Nueva Query

1. En SQL Editor, click en **+ New query**

### 3.2 Ejecuta el Script de RLS

1. Abre el archivo: `supabase/rls-policies.sql`
2. Copia TODO el contenido
3. Pégalo en el SQL Editor
4. Click en **▶ Run**

**✅ Esto configurará:**
- Permisos de lectura pública para contenido publicado
- Permisos de escritura solo para administradores
- Seguridad a nivel de fila (RLS)

---

## Paso 4: Crear Storage Buckets

### 4.1 Ve a Storage

1. En el menú lateral, busca: **Storage**
2. Click en **+ New bucket**

### 4.2 Crea el Bucket "blog-images"

1. **Name**: `blog-images`
2. **Public bucket**: ✅ **Activado** (muy importante)
3. **File size limit**: 5 MB (opcional)
4. **Allowed MIME types**: `image/*` (opcional)
5. Click en **Create bucket**

### 4.3 Crea el Bucket "media" (opcional)

Repite el proceso:
1. **Name**: `media`
2. **Public bucket**: ✅ **Activado**
3. Click en **Create bucket**

---

## Paso 5: Configurar Políticas de Storage

### 5.1 Nueva Query en SQL Editor

1. Ve a **SQL Editor**
2. Click en **+ New query**

### 5.2 Ejecuta las Políticas de Storage

1. Abre el archivo: `supabase/storage-policies.sql`
2. Copia TODO el contenido
3. Pégalo en el SQL Editor
4. Click en **▶ Run**

**✅ Esto configurará:**
- Lectura pública de imágenes (para que se vean en la web)
- Escritura solo para administradores autorizados
- Permisos correctos en el bucket `blog-images`

---

## Paso 6: Configurar Autenticación (Google OAuth)

### 6.1 Obtener Credenciales de Google

Primero necesitas crear un proyecto en Google Cloud:

1. Ve a: https://console.cloud.google.com/
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a: **APIs & Services** → **Credentials**
4. Click en **+ Create Credentials** → **OAuth client ID**
5. Tipo de aplicación: **Web application**
6. Nombre: `Health4Spain`

### 6.2 Configurar URLs en Google

En la configuración del OAuth client:

**Authorized JavaScript origins:**
```
https://dtbpgcmwniguslhfsbio.supabase.co
http://localhost:3000
https://tu-dominio.com
```

**Authorized redirect URIs:**
```
https://dtbpgcmwniguslhfsbio.supabase.co/auth/v1/callback
http://localhost:3000/auth/callback
https://tu-dominio.com/auth/callback
```

Guarda y copia:
- **Client ID**: `123456789-abc...apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-abc...`

### 6.3 Configurar en Supabase

1. Ve a tu proyecto en Supabase
2. **Authentication** → **Providers**
3. Busca **Google**
4. Activa el toggle **Enable Sign in with Google**
5. Pega:
   - **Client ID**: El que copiaste de Google
   - **Client Secret**: El que copiaste de Google
6. Copia la **Callback URL** que aparece (ya la añadimos en Google)
7. Click en **Save**

---

## Paso 7: Verificar la Configuración

### 7.1 Ejecutar Script de Verificación

Vuelve a tu terminal local y ejecuta:

```bash
npm run test-supabase
```

Deberías ver algo como:

```
🔍 Verificando configuración de Supabase...

1. Variables de entorno:
   ✅ NEXT_PUBLIC_SUPABASE_URL: ✓ Configurada
   ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: ✓ Configurada
   ✅ SUPABASE_SERVICE_ROLE_KEY: ✓ Configurada

2. Probando conexión con Anon Key (frontend):
   ✅ Conexión exitosa - Tabla blog_posts accesible

3. Probando conexión con Service Role Key (backend):
   ✅ Conexión exitosa - Tabla blog_posts accesible

4. Verificando tablas principales:
   ✅ blog_posts: Existe y es accesible
   ✅ landing_pages: Existe y es accesible
   ✅ leads: Existe y es accesible

5. Verificando storage buckets:
   ✅ blog-images: Existe
   ✅ media: Existe

6. Verificando autenticación:
   ✅ Auth configurado - 0 usuarios registrados

✅ Verificación completada!
```

### 7.2 Verificar en Supabase Dashboard

1. **Database** → **Tables**
   - ✅ Deberías ver: `blog_posts`, `landing_pages`, `leads`, `partners`

2. **Storage**
   - ✅ Deberías ver: `blog-images` (y opcionalmente `media`)

3. **Authentication** → **Providers**
   - ✅ Google debe estar activado con icono verde

---

## Paso 8: Probar la Aplicación

### 8.1 Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

### 8.2 Probar Funcionalidades

1. **Página principal**: http://localhost:3000
   - ✅ Debe cargar sin errores

2. **Login de Google**: http://localhost:3000/administrator/login
   - ✅ Debe mostrar botón "Continuar con Google"
   - ✅ Al hacer click, redirige a Google
   - ✅ Después de autenticar, redirige a `/administrator`

3. **Panel de Administrador**: http://localhost:3000/administrator
   - ✅ Solo accesible si tu email está en `NEXT_PUBLIC_ADMIN_EMAILS`
   - ✅ Debes ver el dashboard

4. **Formulario de Lead**: http://localhost:3000/es/presupuesto
   - ✅ Rellena y envía
   - ✅ Ve a Supabase → Database → `leads` → deberías ver el registro

5. **Editor de Blog**: http://localhost:3000/administrator/blog
   - ✅ Click en "Nuevo Artículo"
   - ✅ El editor TinyMCE debe cargar (necesitas API Key)

---

## ✅ Checklist Final

Marca cada ítem cuando lo completes:

### Base de Datos
- [ ] `schema.sql` ejecutado correctamente
- [ ] `landing-pages-schema.sql` ejecutado correctamente
- [ ] `rls-policies.sql` ejecutado correctamente
- [ ] Todas las tablas aparecen en Database → Tables

### Storage
- [ ] Bucket `blog-images` creado (público)
- [ ] Bucket `media` creado (opcional, público)
- [ ] `storage-policies.sql` ejecutado correctamente

### Autenticación
- [ ] Proyecto creado en Google Cloud Console
- [ ] OAuth Client ID creado
- [ ] URLs de redirección configuradas en Google
- [ ] Provider de Google activado en Supabase
- [ ] Client ID y Secret configurados en Supabase

### Verificación
- [ ] `npm run test-supabase` ejecutado sin errores
- [ ] `npm run dev` inicia sin errores
- [ ] Login de Google funciona
- [ ] Panel de administrador accesible
- [ ] Formularios de lead funcionan
- [ ] Editor de blog carga (con TinyMCE configurado)

---

## 🐛 Solución de Problemas Comunes

### Error: "relation 'blog_posts' does not exist"
**Causa**: No ejecutaste `schema.sql`
**Solución**: Ve al Paso 1 y ejecuta el script

### Error: "Storage bucket not found"
**Causa**: No creaste los buckets
**Solución**: Ve al Paso 4 y crea `blog-images`

### Error: "Unable to connect to Google"
**Causa**: Google OAuth no configurado correctamente
**Solución**: 
- Verifica que las URLs de redirección en Google incluyan la de Supabase
- Verifica que Client ID y Secret estén bien copiados

### Error: "No tienes permisos de administrador"
**Causa**: Tu email no está en `NEXT_PUBLIC_ADMIN_EMAILS`
**Solución**: Verifica el email en `.env.local` y reinicia el servidor

### Error: "TinyMCE failed to load"
**Causa**: No tienes API Key de TinyMCE configurada
**Solución**: 
1. Obtén API Key en https://www.tiny.cloud/
2. Añádela a `.env.local`: `NEXT_PUBLIC_TINYMCE_API_KEY=tu-api-key`
3. Reinicia el servidor

---

## 📞 Recursos

- **Supabase Dashboard**: https://dtbpgcmwniguslhfsbio.supabase.co
- **Documentación Supabase**: https://supabase.com/docs
- **Google Cloud Console**: https://console.cloud.google.com/
- **TinyMCE**: https://www.tiny.cloud/

---

## 🎉 ¡Felicitaciones!

Si completaste todos los pasos, tu base de datos está lista y tu aplicación debería funcionar perfectamente.

**Próximo paso**: Configurar las mismas variables de entorno en Vercel para producción (ver `CONFIGURACION_VERCEL.md`)
