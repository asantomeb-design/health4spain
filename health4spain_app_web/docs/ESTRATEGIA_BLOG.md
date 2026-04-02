# 📝 Health4Spain - Estrategia de Blog y Contenidos

> **Documento conceptual**  
> El blog como motor de SEO y autoridad  
> *(Abril 2026: para estado del producto y captación de leads/GHL, ver `README.md` en la raíz del proyecto.)*

---

## 🎯 OBJETIVO DEL BLOG

El blog NO es un diario ni un lugar para "publicar noticias". Es una **máquina de captar tráfico SEO** que debe:

1. **Atraer visitantes** por búsquedas informacionales ("cómo conseguir visa no lucrativa")
2. **Cualificarlos** según su perfil e interés
3. **Dirigirlos** a las páginas de servicio×ciudad (donde convertimos)

```
VISITANTE busca en Google:
"requisitos arraigo social españa 2026"
              │
              ▼
        ARTÍCULO DEL BLOG
    "Guía completa del Arraigo Social"
              │
              ▼
         CTA en el artículo:
   "¿Necesitas un abogado en tu zona?"
              │
              ▼
      PÁGINA DE CONVERSIÓN
   /abogados/murcia/ → Formulario
```

---

## 🏗️ ARQUITECTURA DEL BLOG

### Estructura de URLs

```
ÍNDICE DEL BLOG:
/{idioma}/blog/

CATEGORÍAS:
/{idioma}/blog/guias/
/{idioma}/blog/tramites/
/{idioma}/blog/vida-en-espana/
/{idioma}/blog/noticias/

ARTÍCULOS:
/{idioma}/blog/{slug-del-articulo}/

EJEMPLO COMPLETO (URL canónica: www.health4spain.com):
www.health4spain.com/es/blog/                           → Índice ES
www.health4spain.com/es/blog/guias/                     → Categoría guías ES
www.health4spain.com/es/blog/arraigo-social-requisitos/ → Artículo ES

www.health4spain.com/en/blog/                        → Índice EN
www.health4spain.com/en/blog/guides/                 → Categoría guías EN
www.health4spain.com/en/blog/social-roots-requirements/ → Artículo EN

www.health4spain.com/de/blog/                        → Índice DE
www.health4spain.com/de/blog/ratgeber/               → Categoría guías DE
www.health4spain.com/de/blog/soziale-verwurzelung-anforderungen/ → Artículo DE
```

---

## 📂 CATEGORÍAS DEL BLOG

### 1. GUÍAS PRÁCTICAS (`/blog/guias/`)
Contenido evergreen, alta búsqueda, actualización anual.

| Tema | Keywords objetivo | Perfil |
|------|-------------------|--------|
| Visa No Lucrativa paso a paso | "visa no lucrativa españa requisitos" | Jubilados EU |
| Arraigo Social: requisitos 2026 | "arraigo social españa" | Trabajadores LATAM |
| Reagrupación familiar completa | "reagrupacion familiar españa" | Familias |
| Golden Visa España | "golden visa españa inversión" | Inversores |
| NIE vs TIE: diferencias | "diferencia nie tie españa" | Todos |
| Empadronamiento extranjeros | "como empadronarse en españa extranjero" | Todos |
| Homologar título universitario | "homologar titulo españa" | Jóvenes |
| Canje carnet de conducir | "canjear carnet conducir españa" | Todos |

### 2. TRÁMITES POR CIUDAD (`/blog/tramites/`)
Contenido local, SEO geolocalizado.

| Tema | Keywords objetivo |
|------|-------------------|
| Oficina extranjería Murcia: cita y dirección | "extranjeria murcia cita previa" |
| Empadronarse en Torrevieja | "empadronamiento torrevieja" |
| Consulado británico Alicante | "consulado britanico alicante" |
| Hospitales públicos Cartagena | "hospital cartagena españa" |

### 3. VIDA EN ESPAÑA (`/blog/vida-en-espana/`)
Contenido lifestyle, atrae tráfico menos comercial pero genera confianza.

| Tema | Keywords objetivo | Perfil |
|------|-------------------|--------|
| Coste de vida en Torrevieja 2026 | "coste vida torrevieja" | Jubilados |
| Mejores zonas para vivir en Murcia | "donde vivir en murcia" | Familias |
| Comunidad británica Costa Blanca | "britanicos costa blanca" | UK expats |
| Clima en la Costa Cálida | "clima murcia todo el año" | Todos |
| Sistema sanitario español para extranjeros | "sanidad publica españa extranjeros" | Todos |

### 4. NOTICIAS Y ACTUALIDAD (`/blog/noticias/`)
Contenido temporal, genera picos de tráfico, requiere actualización constante.

| Tema | Cuándo publicar |
|------|-----------------|
| Cambios en la ley de extranjería | Cuando haya reforma |
| Nuevos requisitos visa no lucrativa | Cuando cambien |
| Brexit: últimas novedades para británicos | Cuando haya updates |
| Plazos extranjería: situación actual | Trimestral |

---

## 🌍 ESTRATEGIA MULTIIDIOMA DEL BLOG

### ¿Traducimos TODO?

**NO.** Cada idioma tiene su propia estrategia de contenidos porque las búsquedas son diferentes:

| Idioma | Enfoque principal | Artículos prioritarios |
|--------|-------------------|------------------------|
| 🇪🇸 **Español** | Trabajadores LATAM, trámites | Arraigo, reagrupación, NIE |
| 🇬🇧 **Inglés** | Jubilados UK, inversores | Non-lucrative visa, healthcare, Brexit |
| 🇩🇪 **Alemán** | Jubilados DE, calidad de vida | Krankenversicherung, Ruhestand |
| 🇫🇷 **Francés** | Mixto, lifestyle | Retraite, coût de la vie |

### Matriz de Contenidos por Idioma

```
                        ES    EN    DE    FR
                        ──    ──    ──    ──
Arraigo Social          ✅    ❌    ❌    ❌   (solo interesa a LATAM)
Non-Lucrative Visa      ✅    ✅    ✅    ✅   (interesa a todos no-UE)
Golden Visa             ✅    ✅    ✅    ✅   (inversores globales)
Brexit y británicos     ❌    ✅    ❌    ❌   (solo UK)
Seguro salud jubilados  ✅    ✅    ✅    ✅   (todos los jubilados)
Coste vida Torrevieja   ✅    ✅    ✅    ✅   (todos)
Reagrupación familiar   ✅    ❌    ❌    ❌   (principalmente LATAM)
Sistema sanitario       ✅    ✅    ✅    ✅   (todos)
```

### Contenido "Puente" (traducido) vs "Nativo" (único)

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| **Puente** | Mismo tema, traducido y adaptado | "Visa no lucrativa" existe en 4 idiomas |
| **Nativo** | Solo existe en un idioma | "Arraigo social" solo en ES |

---

## 📄 ESTRUCTURA DE UN ARTÍCULO

### Anatomía SEO de un Post

```
┌─────────────────────────────────────────────────────────────┐
│ BREADCRUMB                                                  │
│ Inicio > Blog > Guías > Visa No Lucrativa                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ H1: Visa No Lucrativa España 2026: Guía Completa           │
│                                                             │
│ Meta: "Todo sobre la visa no lucrativa: requisitos,        │
│ documentos, seguro médico obligatorio y proceso paso       │
│ a paso. Actualizado enero 2026."                           │
│                                                             │
│ 📅 Actualizado: Enero 2026 | ⏱️ 12 min lectura            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ÍNDICE DEL ARTÍCULO (Table of Contents)                    │
│ 1. ¿Qué es la visa no lucrativa?                           │
│ 2. Requisitos económicos                                    │
│ 3. Seguro médico obligatorio                               │
│ 4. Documentación necesaria                                  │
│ 5. Proceso paso a paso                                      │
│ 6. Tiempos y costes                                        │
│ 7. Preguntas frecuentes                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ CONTENIDO                                                   │
│                                                             │
│ H2: ¿Qué es la visa no lucrativa?                          │
│ Párrafo explicativo...                                      │
│                                                             │
│ H2: Requisitos económicos                                   │
│ Párrafo + tabla de importes IPREM...                       │
│                                                             │
│ ┌─────────────────────────────────────────────────────┐    │
│ │ 💡 CTA INTERMEDIO                                   │    │
│ │ ¿Necesitas ayuda con tu visa no lucrativa?         │    │
│ │ [Habla con un abogado especializado]               │    │
│ │ → Enlace a /abogados/torrevieja/ (o ciudad)        │    │
│ └─────────────────────────────────────────────────────┘    │
│                                                             │
│ H2: Seguro médico obligatorio                              │
│ Párrafo + requisitos del seguro...                         │
│                                                             │
│ ┌─────────────────────────────────────────────────────┐    │
│ │ 💡 CTA INTERMEDIO                                   │    │
│ │ Compara seguros para visa no lucrativa             │    │
│ │ [Ver seguros recomendados]                         │    │
│ │ → Enlace a /seguros/torrevieja/                    │    │
│ └─────────────────────────────────────────────────────┘    │
│                                                             │
│ H2: Proceso paso a paso                                     │
│ Lista numerada...                                           │
│                                                             │
│ H2: Preguntas frecuentes (FAQ Schema)                      │
│ Acordeón con FAQs...                                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ CTA FINAL                                                   │
│                                                             │
│ ┌─────────────────────────────────────────────────────┐    │
│ │ 🎯 ¿PREPARANDO TU MUDANZA A ESPAÑA?                │    │
│ │                                                     │    │
│ │ Te conectamos con seguros, abogados, inmobiliarias y gestorías          │    │
│ │ especializados en tu zona.                         │    │
│ │                                                     │    │
│ │ ¿Dónde quieres vivir?                              │    │
│ │ [Torrevieja] [Alicante] [Murcia] [Otra ciudad]    │    │
│ │                                                     │    │
│ │ → Cada botón lleva a página de ciudad              │    │
│ └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ARTÍCULOS RELACIONADOS                                     │
│                                                             │
│ → Seguro médico para visa no lucrativa: qué necesitas      │
│ → Coste de vida en la Costa Blanca 2026                    │
│ → Mejores ciudades para jubilarse en España                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SIDEBAR (en desktop)                                        │
│                                                             │
│ ┌─────────────────────────────────────────────────────┐    │
│ │ 📋 FORMULARIO RÁPIDO                               │    │
│ │ "¿Necesitas asesoramiento?"                        │    │
│ │ [Nombre]                                           │    │
│ │ [Email]                                            │    │
│ │ [Ciudad de interés ▼]                              │    │
│ │ [Enviar]                                           │    │
│ └─────────────────────────────────────────────────────┘    │
│                                                             │
│ 📍 CIUDADES POPULARES                                      │
│ → Torrevieja                                               │
│ → Alicante                                                 │
│ → Murcia                                                   │
│                                                             │
│ 💼 SERVICIOS                                               │
│ → Seguros de salud                                         │
│ → Abogados                                     │
│ → Inmobiliarias                                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔗 ESTRATEGIA DE ENLACES INTERNOS

### Desde el Blog hacia Páginas de Conversión

Cada artículo debe tener **mínimo 3 enlaces** a páginas de servicio×ciudad:

```
ARTÍCULO: "Visa no lucrativa requisitos"
    │
    ├── Enlace a /seguros/torrevieja/
    │   "Necesitarás un seguro médico privado"
    │
    ├── Enlace a /abogados/alicante/
    │   "Un abogado puede gestionar tu solicitud"
    │
    └── Enlace a /inmobiliarias/murcia/
        "También necesitarás demostrar alojamiento"
```

### Desde Páginas de Conversión hacia el Blog

Las páginas de servicio×ciudad enlazan a artículos relevantes:

```
PÁGINA: /seguros/torrevieja/
    │
    ├── "Aprende más sobre el seguro para visa no lucrativa"
    │   → /blog/seguro-medico-visa-no-lucrativa/
    │
    └── "Guía del sistema sanitario español"
        → /blog/sanidad-publica-espana-extranjeros/
```

### Cluster de Contenidos

Cada tema principal tiene un **artículo pilar** y varios **artículos satélite**:

```
PILAR: "Visa No Lucrativa: Guía Completa"
           │
           ├── SATÉLITE: "Requisitos económicos visa no lucrativa"
           ├── SATÉLITE: "Seguro médico para visa no lucrativa"
           ├── SATÉLITE: "Renovar visa no lucrativa"
           ├── SATÉLITE: "Visa no lucrativa vs visa de jubilado"
           └── SATÉLITE: "Trabajar con visa no lucrativa: ¿es posible?"

Todos enlazan entre sí y al pilar.
El pilar enlaza a todos los satélites.
```

---

## 📊 DATOS DEL BLOG EN SUPABASE

### Tabla: BLOG_POSTS

```
BLOG_POSTS
│
├── Identificadores
│   ├── id (UUID)
│   ├── slug (único por idioma)
│   └── slug_translations (JSON) → {"es": "arraigo-social", "en": "social-roots"}
│
├── Contenido por idioma
│   ├── title_es, title_en, title_de, title_fr
│   ├── content_es, content_en, content_de, content_fr (Markdown o HTML)
│   ├── excerpt_es, excerpt_en, excerpt_de, excerpt_fr
│   └── meta_description_es, meta_description_en...
│
├── Categorización
│   ├── category (guias / tramites / vida-en-espana / noticias)
│   ├── tags [] (array de etiquetas)
│   └── target_profiles [] (móviles / familias / consolidados / jubilados)
│
├── SEO
│   ├── focus_keyword_es, focus_keyword_en...
│   ├── secondary_keywords [] 
│   └── canonical_url (si aplica)
│
├── Relaciones
│   ├── related_cities [] → FK a ciudades mencionadas
│   ├── related_services [] → FK a servicios mencionados
│   ├── related_posts [] → FK a artículos relacionados
│   └── pillar_post_id → FK al artículo pilar (si es satélite)
│
├── Media
│   ├── featured_image
│   ├── featured_image_alt
│   └── images [] (galería)
│
├── Publicación
│   ├── status (borrador / revision / publicado / archivado)
│   ├── published_at
│   ├── updated_at
│   └── author
│
├── Métricas (calculadas o importadas)
│   ├── views_total
│   ├── views_last_30_days
│   ├── avg_time_on_page
│   └── leads_generated (cuántos leads vinieron de este artículo)
│
└── Idiomas disponibles
    └── available_locales [] → ["es", "en"] (no todos tienen los 4)
```

### Tabla: BLOG_CATEGORIES

```
BLOG_CATEGORIES
│
├── id
├── slug_es, slug_en, slug_de, slug_fr
├── name_es, name_en, name_de, name_fr
├── description_es, description_en...
└── parent_id (para subcategorías, si las hay)
```

### Tabla: BLOG_TAGS

```
BLOG_TAGS
│
├── id
├── slug
├── name_es, name_en, name_de, name_fr
└── post_count (calculado)
```

---

## 📅 CALENDARIO EDITORIAL

### Frecuencia de Publicación

| Fase | Frecuencia | Objetivo |
|------|------------|----------|
| MVP (mes 1-2) | 2 artículos/semana | 16 artículos base |
| Escalado (mes 3-6) | 3 artículos/semana | 48 artículos más |
| Consolidación (mes 7-12) | 2 artículos/semana | Mantenimiento + actualización |

### Distribución por Categoría

```
MENSUAL (ejemplo: 12 artículos/mes)
│
├── Guías prácticas: 4 artículos (33%)
│   → Contenido evergreen, alto valor SEO
│
├── Trámites por ciudad: 4 artículos (33%)
│   → SEO local, diferenciador
│
├── Vida en España: 2 artículos (17%)
│   → Lifestyle, confianza, compartible
│
└── Noticias: 2 artículos (17%)
    → Actualidad, picos de tráfico
```

### Prioridad de Creación (Primeros 20 artículos)

| # | Artículo | Idiomas | Categoría | Prioridad |
|---|----------|---------|-----------|-----------|
| 1 | Visa no lucrativa: guía completa | ES, EN, DE, FR | Guías | 🔴 Alta |
| 2 | Seguro médico para visa no lucrativa | ES, EN, DE, FR | Guías | 🔴 Alta |
| 3 | Arraigo social: requisitos 2026 | ES | Guías | 🔴 Alta |
| 4 | NIE y TIE: diferencias y cómo obtenerlos | ES, EN | Guías | 🔴 Alta |
| 5 | Coste de vida en Torrevieja | ES, EN, DE | Vida | 🔴 Alta |
| 6 | Sistema sanitario español para extranjeros | ES, EN, DE, FR | Guías | 🔴 Alta |
| 7 | Empadronamiento: qué es y cómo hacerlo | ES, EN | Trámites | 🟡 Media |
| 8 | Oficina extranjería Murcia: cita y dirección | ES | Trámites | 🟡 Media |
| 9 | Mejores zonas para vivir en Alicante | ES, EN, DE | Vida | 🟡 Media |
| 10 | Brexit y residencia en España para británicos | EN | Guías | 🟡 Media |
| 11 | Reagrupación familiar: guía completa | ES | Guías | 🟡 Media |
| 12 | Golden Visa España: inversión mínima | ES, EN | Guías | 🟡 Media |
| 13 | Canje carnet de conducir en España | ES, EN | Trámites | 🟡 Media |
| 14 | Coste de vida en Murcia capital | ES | Vida | 🟢 Normal |
| 15 | Comunidad británica en Costa Blanca | EN | Vida | 🟢 Normal |
| 16 | Homologar título universitario | ES | Trámites | 🟢 Normal |
| 17 | Hospitales y centros de salud en Torrevieja | ES, EN | Trámites | 🟢 Normal |
| 18 | Abrir cuenta bancaria en España siendo extranjero | ES, EN | Trámites | 🟢 Normal |
| 19 | Clima en la Costa Cálida todo el año | ES, EN, DE | Vida | 🟢 Normal |
| 20 | Comparativa seguros salud para extranjeros | ES, EN | Guías | 🟢 Normal |

---

## 📈 MÉTRICAS DEL BLOG

### KPIs de Tráfico

| Métrica | Mes 3 | Mes 6 | Mes 12 |
|---------|-------|-------|--------|
| Visitas blog/mes | 2.000 | 8.000 | 20.000 |
| Artículos indexados | 20 | 60 | 120 |
| Keywords en top 10 | 15 | 80 | 300 |
| Tiempo medio en página | >3 min | >3 min | >3 min |

### KPIs de Conversión

| Métrica | Objetivo |
|---------|----------|
| CTR a páginas de servicio | >5% |
| Leads originados en blog | 20% del total |
| Formularios enviados desde blog | >3% visitantes |

### Tracking de Origen

Cada lead debe registrar si vino del blog:

```
LEAD
├── landing_page: "/blog/visa-no-lucrativa-requisitos/"
├── source: "organic"
└── utm_content: "blog-cta-sidebar"
```

Así podemos saber qué artículos generan más leads y optimizar.

---

## 🔄 FLUJO: DEL ARTÍCULO AL LEAD

```
GOOGLE: "requisitos visa no lucrativa españa"
                    │
                    ▼
         Artículo del blog aparece
         en posición 3 de resultados
                    │
                    ▼
         Usuario hace clic, lee artículo
         (3-5 minutos de lectura)
                    │
                    ├─────────────────────────────────┐
                    ▼                                 ▼
         Ve CTA intermedio:                  Ve sidebar con
         "¿Necesitas abogado?"               formulario rápido
                    │                                 │
                    ▼                                 ▼
         Clic en "Abogados en                Rellena formulario
         Torrevieja"                         directamente
                    │                                 │
                    ▼                                 │
         Llega a /abogados/torrevieja/              │
         Ve partners disponibles                     │
         Rellena formulario                          │
                    │                                 │
                    └─────────────────┬───────────────┘
                                      ▼
                              LEAD CREADO
                         (con referencia al artículo)
                                      │
                                      ▼
                         Asignación a Partner(s)
```

---

## ✅ RESUMEN

1. **El blog es SEO** → No es un diario, es una herramienta de captación.

2. **No todo se traduce** → Cada idioma tiene su estrategia propia.

3. **CTAs estratégicos** → Mínimo 3 enlaces a páginas de conversión por artículo.

4. **Clusters de contenido** → Artículos pilar + satélites interenlazados.

5. **Tracking riguroso** → Saber qué artículos generan leads.

6. **Calendario realista** → 2-3 artículos/semana, priorizando por valor SEO.

---

*Siguiente paso: Definir los primeros 10 artículos con sus keywords y estructura.*
