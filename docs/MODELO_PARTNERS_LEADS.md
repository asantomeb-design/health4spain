# 💼 Health4Spain - Modelo de Partners y Gestión de Leads

> **Documento Técnico del Modelo de Negocio**  
> Última actualización: Febrero 2026

---

## 🎯 PRINCIPIO FUNDAMENTAL

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   EL VISITANTE NO ES EL CLIENTE.                           │
│   EL VISITANTE ES EL PRODUCTO.                             │
│                                                             │
│   EL PARTNER (negocio) ES EL CLIENTE.                      │
│   EL PARTNER PAGA POR LEADS CUALIFICADOS.                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Lo Que Vendemos

**NO vendemos** acceso a un listado de profesionales.  
**SÍ vendemos** leads cualificados con información completa.

### La Diferencia Clave

| Marketplace Tradicional | Health4Spain |
|------------------------|--------------|
| Usuario ve lista de proveedores | Usuario NO ve proveedores |
| Usuario elige y contacta | H4S asigna y contacta |
| Partner paga por aparecer | Partner paga por lead recibido |
| Fuga fácil (Google Maps) | Sin info para fugarse |
| Competencia visible | Sin competencia visible |

---

## 🚫 PREVENCIÓN DE FUGA DE LEADS

### La Realidad

Sí, es inevitable que algunos usuarios intenten buscar directamente en Google:
> "Peluquería Paquito Torrevieja"

**Eso no se puede ni se debe bloquear.**

El error no es que exista esa posibilidad.  
El error es diseñar el marketplace como si no existiera.

### Nuestra Estrategia

Health4Spain **acepta** la fuga natural, la **limita** al máximo, y la **compensa** con volumen y valor.

### Medidas Anti-Fuga

#### 1. NO MOSTRAR INFORMACIÓN IDENTIFICABLE

En ningún momento de la web pública se muestra:
- ❌ Nombre del partner
- ❌ Dirección exacta
- ❌ Teléfono
- ❌ Email
- ❌ Enlace a web
- ❌ Enlace a Google Maps
- ❌ Fotos del local
- ❌ Nombre del profesional

#### 2. CAMBIAR EL ENFOQUE MENTAL

No comunicamos: *"Aquí tienes esta peluquería"*  
Comunicamos: *"Te asignamos un profesional adecuado a tu perfil"*

El usuario **no está eligiendo**. Está **siendo atendido**.

#### 3. APORTAR VENTAJAS EXCLUSIVAS

El usuario que pasa por H4S obtiene:
- ✅ Prioridad en citas
- ✅ Precio cerrado previamente
- ✅ Idioma garantizado
- ✅ Soporte post-servicio de H4S
- ✅ Alguien que le llama (no tiene que buscar)

#### 4. HACER EL CONTACTO DIRECTO INCÓMODO

Si el usuario intentara buscar por su cuenta:
- Tendría que explicar su caso desde cero
- Probablemente encontraría barrera idiomática
- No sabría si el profesional tiene experiencia con extranjeros
- Tendría que comparar opciones solo

Con H4S:
- Ya explicó su caso una vez
- Le garantizamos idioma
- Le garantizamos experiencia con extranjeros
- No tiene que comparar

#### 5. REVELAR NOMBRE SOLO AL CONTACTAR

El nombre del partner se revela **únicamente** cuando H4S contacta al usuario para confirmar la asignación:

```
"Hola María, te hemos asignado a Clínica Dental Costa.
Te van a llamar hoy a las 17h."
```

En ese momento, el lead ya está registrado y facturado.

---

## 📊 ARQUITECTURA DE DATOS (SUPABASE)

### Entidad: PARTNER

```sql
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Datos empresa
    nombre_comercial VARCHAR(200) NOT NULL,
    razon_social VARCHAR(200),
    cif VARCHAR(20),
    direccion TEXT,
    ciudad_id UUID REFERENCES ciudades(id),
    codigo_postal VARCHAR(10),
    
    -- Contacto operativo (interno, no público)
    contacto_nombre VARCHAR(100),
    contacto_email VARCHAR(200),
    contacto_telefono VARCHAR(20),
    contacto_whatsapp VARCHAR(20),
    horario_contacto VARCHAR(100),
    
    -- Configuración de servicio
    servicio_id UUID REFERENCES servicios(id),
    especialidades TEXT[], -- Array de especialidades
    ciudades_cobertura UUID[], -- Ciudades que cubre
    idiomas TEXT[], -- ['es', 'en', 'de', 'fr']
    capacidad_leads_mes INTEGER DEFAULT 50,
    
    -- Configuración comercial
    precio_por_lead DECIMAL(10,2),
    modelo_pago VARCHAR(20) DEFAULT 'por_lead', -- por_lead, suscripcion, hibrido
    descuento_volumen JSONB, -- {"50": 10, "100": 15} = 10% a partir de 50 leads
    
    -- Estado
    estado VARCHAR(20) DEFAULT 'pendiente', -- pendiente, activo, pausado, inactivo
    verificado BOOLEAN DEFAULT false,
    tier VARCHAR(20) DEFAULT 'basic', -- basic, premium, exclusive
    
    -- Métricas (calculadas)
    total_leads_recibidos INTEGER DEFAULT 0,
    leads_mes_actual INTEGER DEFAULT 0,
    tasa_contacto DECIMAL(5,2), -- % leads contactados
    tasa_conversion DECIMAL(5,2), -- % leads convertidos
    valoracion_media DECIMAL(3,2), -- 1-5
    saldo_pendiente DECIMAL(10,2) DEFAULT 0,
    
    -- Auditoría
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Entidad: LEAD

```sql
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_lead VARCHAR(20) UNIQUE, -- 2026-01-27-0042
    
    -- Datos de contacto
    nombre VARCHAR(200) NOT NULL,
    email VARCHAR(200),
    telefono VARCHAR(30) NOT NULL,
    telefono_verificado BOOLEAN DEFAULT false,
    idioma_preferido VARCHAR(5) DEFAULT 'es',
    acepta_privacidad BOOLEAN DEFAULT true,
    acepta_marketing BOOLEAN DEFAULT false,
    
    -- Perfil
    nacionalidad VARCHAR(100),
    pais_residencia VARCHAR(100),
    edad_rango VARCHAR(20), -- '22-34', '35-49', '50-59', '60-70'
    situacion VARCHAR(50), -- 'planificando', 'recien_llegado', 'residente'
    
    -- Necesidad
    servicio_id UUID REFERENCES servicios(id),
    ciudad_interes_id UUID REFERENCES ciudades(id),
    descripcion_necesidad TEXT,
    urgencia VARCHAR(20), -- 'esta_semana', 'este_mes', 'sin_prisa'
    presupuesto VARCHAR(50),
    requisitos_especiales TEXT,
    respuestas_formulario JSONB, -- Todas las respuestas del formulario
    
    -- Tracking
    landing_page VARCHAR(500),
    idioma_web VARCHAR(5),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    dispositivo VARCHAR(50),
    ip_address VARCHAR(50),
    
    -- Cualificación
    puntuacion_total INTEGER,
    puntuacion_detalle JSONB, -- {"edad": 50, "nacionalidad": 40, ...}
    clasificacion VARCHAR(10), -- 'hot', 'warm', 'cold'
    
    -- Estado del lead (ciclo de vida)
    estado VARCHAR(20) DEFAULT 'nuevo',
    -- nuevo → contactado_h4s → asignado → enviado → {contactado_partner, rechazado, expirado} → convertido
    
    -- Contacto H4S → Usuario
    fecha_contacto_h4s TIMESTAMPTZ,
    resultado_contacto_h4s VARCHAR(50), -- 'confirmado', 'no_contesta', 'rechaza', 'reprogramar'
    notas_contacto_h4s TEXT,
    
    -- Auditoría
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Entidad: LEAD_PARTNER (Tabla de Asignación)

```sql
-- TABLA CLAVE: Un lead puede ir a MÚLTIPLES partners
-- Cada envío es una transacción facturable independiente

CREATE TABLE lead_partner (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) NOT NULL,
    partner_id UUID REFERENCES partners(id) NOT NULL,
    
    -- Envío
    fecha_asignacion TIMESTAMPTZ DEFAULT NOW(),
    fecha_envio TIMESTAMPTZ,
    metodo_envio VARCHAR(20), -- 'email', 'panel', 'whatsapp', 'api'
    confirmacion_entrega BOOLEAN DEFAULT false,
    fecha_confirmacion_entrega TIMESTAMPTZ,
    
    -- Estado del lead para este partner
    estado VARCHAR(20) DEFAULT 'asignado',
    -- asignado → enviado → {contactado, rechazado, expirado} → convertido
    fecha_cambio_estado TIMESTAMPTZ,
    notas_partner TEXT,
    
    -- Facturación
    precio_lead DECIMAL(10,2),
    facturable BOOLEAN DEFAULT true,
    facturado BOOLEAN DEFAULT false,
    factura_id UUID REFERENCES facturas(id),
    fecha_facturacion TIMESTAMPTZ,
    
    -- Feedback del partner
    motivo_rechazo VARCHAR(50),
    -- 'no_contactable', 'no_responde', 'ya_cliente', 'otro_servicio', 
    -- 'otra_zona', 'spam', 'otro'
    detalle_rechazo TEXT,
    
    -- Resultado
    convertido BOOLEAN DEFAULT false,
    valor_conversion DECIMAL(10,2), -- Si el partner reporta venta
    fecha_conversion TIMESTAMPTZ,
    
    -- Disputa
    disputa_abierta BOOLEAN DEFAULT false,
    disputa_motivo TEXT,
    disputa_resuelta BOOLEAN,
    disputa_resultado VARCHAR(20), -- 'aprobada', 'rechazada'
    
    -- Auditoría
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(lead_id, partner_id) -- Un partner solo recibe un lead una vez
);
```

### Entidad: FACTURA

```sql
CREATE TABLE facturas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_factura VARCHAR(20) UNIQUE, -- F-2026-0001
    partner_id UUID REFERENCES partners(id) NOT NULL,
    
    -- Periodo
    fecha_emision DATE,
    periodo_mes INTEGER,
    periodo_año INTEGER,
    fecha_vencimiento DATE,
    
    -- Desglose
    concepto_principal VARCHAR(200),
    cantidad_leads INTEGER,
    precio_unitario_medio DECIMAL(10,2),
    subtotal_leads DECIMAL(10,2),
    suscripcion DECIMAL(10,2) DEFAULT 0,
    descuentos DECIMAL(10,2) DEFAULT 0,
    base_imponible DECIMAL(10,2),
    iva_porcentaje DECIMAL(5,2) DEFAULT 21,
    iva_importe DECIMAL(10,2),
    total DECIMAL(10,2),
    
    -- Estado
    estado VARCHAR(20) DEFAULT 'borrador',
    -- borrador → emitida → pagada → impagada → cancelada
    fecha_pago TIMESTAMPTZ,
    metodo_pago VARCHAR(50),
    
    -- Documentos
    pdf_url VARCHAR(500),
    
    -- Auditoría
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tablas de Soporte

```sql
-- Servicios disponibles
CREATE TABLE servicios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug_es VARCHAR(50) UNIQUE,
    slug_en VARCHAR(50),
    slug_de VARCHAR(50),
    slug_fr VARCHAR(50),
    nombre_es VARCHAR(100),
    nombre_en VARCHAR(100),
    nombre_de VARCHAR(100),
    nombre_fr VARCHAR(100),
    precio_lead_base DECIMAL(10,2),
    activo BOOLEAN DEFAULT true
);

-- Ciudades
CREATE TABLE ciudades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(50) UNIQUE,
    nombre VARCHAR(100),
    provincia VARCHAR(100),
    comunidad_autonoma VARCHAR(100),
    poblacion INTEGER,
    porcentaje_extranjeros DECIMAL(5,2),
    activo BOOLEAN DEFAULT true
);

-- Precios personalizados por servicio/ciudad/partner
CREATE TABLE precios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    servicio_id UUID REFERENCES servicios(id),
    ciudad_id UUID REFERENCES ciudades(id),
    partner_id UUID REFERENCES partners(id),
    precio DECIMAL(10,2),
    UNIQUE(servicio_id, ciudad_id, partner_id)
);

-- Usuarios del panel de partners
CREATE TABLE usuarios_partner (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID REFERENCES partners(id),
    email VARCHAR(200) UNIQUE,
    password_hash VARCHAR(200),
    nombre VARCHAR(100),
    rol VARCHAR(20) DEFAULT 'operador', -- admin, operador
    activo BOOLEAN DEFAULT true,
    ultimo_acceso TIMESTAMPTZ
);

-- Usuarios admin de H4S
CREATE TABLE usuarios_admin (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(200) UNIQUE,
    password_hash VARCHAR(200),
    nombre VARCHAR(100),
    rol VARCHAR(20) DEFAULT 'operador', -- superadmin, admin, operador
    activo BOOLEAN DEFAULT true
);

-- Historial de cambios de estado del lead
CREATE TABLE lead_estado_historial (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id),
    estado_anterior VARCHAR(20),
    estado_nuevo VARCHAR(20),
    usuario_id UUID, -- Puede ser admin o sistema
    notas TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔄 CICLO DE VIDA DEL LEAD

### Estados del Lead

```
                    ┌─────────────┐
                    │   NUEVO     │ Lead acaba de entrar
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ CONTACTADO  │ H4S ha llamado al usuario
                    │    H4S      │ para confirmar necesidad
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │CONFIRMADO│ │NO CONTESTA│ │ RECHAZA  │
        └────┬─────┘ └────┬─────┘ └──────────┘
             │            │              │
             │      (reintento)          │
             │            │              ▼
             │            │         DESCARTADO
             ▼            │
        ┌──────────┐      │
        │ ASIGNADO │◄─────┘ Partner(s) seleccionado(s)
        └────┬─────┘
             │
             ▼
        ┌──────────┐
        │ ENVIADO  │ Partner recibe el lead
        └────┬─────┘
             │
    ┌────────┼────────┬────────────┐
    ▼        ▼        ▼            ▼
┌────────┐┌────────┐┌────────┐┌────────┐
│CONTACTA││RECHAZA ││EXPIRA  ││DISPUTA │
│  DO    ││  DO    ││  DO    ││        │
└───┬────┘└───┬────┘└────────┘└───┬────┘
    │         │                   │
    │         ▼                   ▼
    │    (se revisa           (H4S decide)
    │     motivo)
    │
    ▼
┌────────┐
│CONVERT.│ El partner reporta venta
└────────┘
```

### Tiempos de Respuesta

| Clasificación | H4S contacta | Partner debe contactar |
|---------------|--------------|------------------------|
| 🔥 HOT | <1 hora | <2 horas desde envío |
| 🟡 WARM | <4 horas | <24 horas desde envío |
| 🔵 COLD | <24 horas | <48 horas desde envío |

---

## 🎯 LÓGICA DE ASIGNACIÓN

### Paso 1: Filtrar Partners Elegibles

```python
partners_elegibles = partners.filter(
    servicio == lead.servicio AND
    lead.ciudad IN partner.ciudades_cobertura AND
    lead.idioma IN partner.idiomas AND
    partner.estado == 'activo' AND
    partner.leads_mes_actual < partner.capacidad_leads_mes AND
    partner.saldo_pendiente < limite_credito
)
```

### Paso 2: Ordenar por Prioridad

```python
partners_ordenados = partners_elegibles.order_by(
    tier DESC,  # Premium primero
    valoracion_media DESC,  # Mejor valorados
    leads_mes_actual ASC  # Rotación equitativa
)
```

### Paso 3: Seleccionar Cantidad

| Clasificación Lead | Partners a Asignar |
|-------------------|--------------------|
| 🔥 HOT | 1-2 (menos = más exclusivo) |
| 🟡 WARM | 2-3 |
| 🔵 COLD | 3-4 |

### Paso 4: Modelos de Asignación

| Modelo | Descripción | Cuándo Usar |
|--------|-------------|-------------|
| **Exclusivo** | 1 solo partner por zona/servicio | Partner Premium que paga más |
| **Competitivo** | 2-3 partners reciben el mismo lead | Mejor servicio al usuario |
| **Round-Robin** | Rotación equitativa | Por defecto |
| **Por Rating** | Mejor valorado primero | Leads HOT |

---

## 📱 PANEL DEL PARTNER

### Dashboard Principal

```
┌─────────────────────────────────────────────────────────────┐
│ CLÍNICA DENTAL COSTA BLANCA                    [Cerrar sesión]
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 📊 RESUMEN - ENERO 2026                                    │
│                                                             │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│ │   23    │ │   21    │ │    8    │ │  €805   │           │
│ │ Leads   │ │Contacta-│ │Converti-│ │Pendiente│           │
│ │recibidos│ │  dos    │ │  dos    │ │facturar │           │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
│                                                             │
│ ─────────────────────────────────────────────────────      │
│                                                             │
│ ⚠️ LEADS PENDIENTES DE ACCIÓN (2)                          │
│                                                             │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ 🔥 #0042 - Hans Mueller                             │   │
│ │    Implantes dentales | Alemán | 62 años            │   │
│ │    Recibido: hace 2 horas                           │   │
│ │    ⚠️ CONTACTAR ANTES DE LAS 18:00                  │   │
│ │                                                     │   │
│ │    [Ver detalle] [Marcar contactado] [Rechazar]    │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ 🟡 #0039 - Sarah Johnson                            │   │
│ │    Ortodoncia | Inglés | 45 años                    │   │
│ │    Recibido: hace 18 horas                          │   │
│ │    Contactar hoy                                    │   │
│ │                                                     │   │
│ │    [Ver detalle] [Marcar contactado] [Rechazar]    │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
│ ─────────────────────────────────────────────────────      │
│                                                             │
│ 📋 HISTORIAL DE LEADS                           [Ver todos] │
│                                                             │
│ #0038 | John Smith      | ✅ Convertido | €2.400          │
│ #0037 | Marie Dupont    | ✅ Contactado | Pendiente       │
│ #0036 | Klaus Weber     | ❌ Rechazado  | No contactable  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Detalle de un Lead

```
┌─────────────────────────────────────────────────────────────┐
│ LEAD #0042 - Hans Mueller                         🔥 HOT   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ DATOS DE CONTACTO                                          │
│ ────────────────                                           │
│ Nombre: Hans Mueller                                        │
│ Teléfono: +49 170 XXX XXXX        [📞 Llamar] [💬 WhatsApp]│
│ Email: hans.mueller@email.de      [📧 Enviar email]        │
│ Idioma preferido: Alemán 🇩🇪                               │
│                                                             │
│ PERFIL                                                      │
│ ──────                                                      │
│ Nacionalidad: Alemana                                       │
│ Edad: 62 años                                              │
│ Situación: Residente en Torrevieja                         │
│                                                             │
│ NECESIDAD                                                   │
│ ─────────                                                   │
│ Servicio: Dentista                                         │
│ Tratamiento solicitado: Implantes dentales                 │
│ Urgencia: Este mes                                         │
│ Seguro dental: No, pago privado                            │
│                                                             │
│ Notas del cliente:                                         │
│ "Necesito 2 implantes en la parte superior.                │
│  Ya me han hecho el estudio en Alemania."                  │
│                                                             │
│ INFORMACIÓN DEL LEAD                                        │
│ ────────────────────                                        │
│ Puntuación: 142 puntos (HOT)                               │
│ Valor estimado: €2.500 - €4.000                            │
│ Recibido: 27/01/2026 14:32                                 │
│ Precio de este lead: €35                                   │
│                                                             │
│ ⚠️ El cliente espera tu llamada HOY entre 17h-18h          │
│                                                             │
│ ─────────────────────────────────────────────────────      │
│                                                             │
│ ACTUALIZAR ESTADO                                          │
│                                                             │
│ ( ) Contactado - He hablado con el cliente                 │
│     Fecha contacto: [___________]                          │
│     Notas: [_________________________________]             │
│                                                             │
│ ( ) Convertido - El cliente ha contratado                  │
│     Valor de la venta: [___________] €                     │
│     Fecha: [___________]                                   │
│                                                             │
│ ( ) Rechazar lead - No es válido                           │
│     Motivo: [Seleccionar ▼]                                │
│       - Teléfono/email incorrecto                          │
│       - No responde tras 3 intentos                        │
│       - Ya era mi cliente                                  │
│       - Busca otro servicio                                │
│       - Fuera de mi zona                                   │
│       - Información falsa / spam                           │
│       - Otro                                               │
│     Detalle: [_________________________________]           │
│                                                             │
│ [      GUARDAR CAMBIOS      ]                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🖥️ PANEL DE ADMINISTRACIÓN (H4S)

### Dashboard Principal

```
┌─────────────────────────────────────────────────────────────┐
│ HEALTH4SPAIN - ADMIN                           [Admin User] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 📊 MÉTRICAS GENERALES - ENERO 2026                         │
│                                                             │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│ │   847   │ │   812   │ │   234   │ │ €12.450 │           │
│ │ Leads   │ │Enviados │ │Converti-│ │Facturado│           │
│ │ totales │ │ partners│ │  dos    │ │         │           │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
│                                                             │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│ │   47    │ │   3.2%  │ │   28    │ │  €890   │           │
│ │Partners │ │  Tasa   │ │Disputas │ │Pendiente│           │
│ │ activos │ │ disputa │ │abiertas │ │ cobro   │           │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
│                                                             │
│ ─────────────────────────────────────────────────────      │
│                                                             │
│ 📍 LEADS POR CIUDAD                  📋 LEADS POR SERVICIO │
│                                                             │
│ Torrevieja    ████████████ 312       Seguros    ████ 187   │
│ Alicante      ████████ 198           Dentistas  ████ 156   │
│ Murcia        ██████ 145             Abogados   ███ 134    │
│ Benidorm      ████ 89                Inmobiliar.███ 128    │
│ Otros         ██ 103                 Otros      ██ 242     │
│                                                             │
│ ─────────────────────────────────────────────────────      │
│                                                             │
│ ⚠️ REQUIERE ATENCIÓN                                       │
│                                                             │
│ • 12 leads pendientes de contacto H4S (>2h)                │
│ • 28 disputas pendientes de resolución                     │
│ • 3 partners con facturas vencidas >15 días                │
│ • 5 leads HOT sin asignar                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Gestión de Leads

```
┌─────────────────────────────────────────────────────────────┐
│ GESTIÓN DE LEADS                                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Filtros: [Estado ▼] [Ciudad ▼] [Servicio ▼] [Fecha ▼]     │
│                                                             │
│ ─────────────────────────────────────────────────────      │
│                                                             │
│ #0047 | 🔥 | María García    | Seguros  | Torrevieja      │
│        NUEVO | Hace 5 min | Sin asignar                    │
│        [Contactar] [Asignar] [Ver]                         │
│                                                             │
│ #0046 | 🔥 | John Smith      | Abogados | Alicante        │
│        CONTACTADO_H4S | Hace 1h | Confirmado               │
│        [Asignar partners] [Ver]                            │
│                                                             │
│ #0045 | 🟡 | Hans Mueller    | Dentista | Torrevieja      │
│        ENVIADO | Hace 3h | 2 partners                      │
│        [Ver estado] [Ver]                                  │
│                                                             │
│ #0044 | 🟡 | Marie Dupont    | Clínicas | Murcia          │
│        DISPUTA | Hace 1 día | Revisar                      │
│        [Resolver disputa] [Ver]                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 💰 PROCESO DE FACTURACIÓN

### Calendario Mensual

| Día | Acción |
|-----|--------|
| 1-5 | Generación de facturas borrador |
| 5-10 | Revisión de disputas pendientes |
| 10 | Emisión de facturas |
| 10 | Envío por email a partners |
| 25 | Fecha de vencimiento |
| 26-30 | Recordatorios automáticos |
| +15 días | Segundo aviso |
| +30 días | Suspensión de leads |
| +45 días | Desactivación del partner |

### Contenido de la Factura

```
┌─────────────────────────────────────────────────────────────┐
│                        FACTURA                              │
│                      F-2026-0042                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ EMISOR                          CLIENTE                     │
│ Health4Spain S.L.               Clínica Dental Costa S.L.  │
│ CIF: BXXXXXXXX                  CIF: BXXXXXXXX             │
│ Dirección...                    Dirección...               │
│                                                             │
│ Fecha emisión: 10/02/2026                                  │
│ Fecha vencimiento: 25/02/2026                              │
│ Periodo: Enero 2026                                        │
│                                                             │
│ ─────────────────────────────────────────────────────      │
│                                                             │
│ CONCEPTO                              CANTIDAD    IMPORTE  │
│                                                             │
│ Leads cualificados Enero 2026              23              │
│   - Leads dentista (€35/ud)                21      €735,00 │
│   - Leads rechazados aprobados             -2      -€70,00 │
│                                                             │
│ ─────────────────────────────────────────────────────      │
│                                         SUBTOTAL   €665,00 │
│                                         IVA 21%    €139,65 │
│                                         ─────────────────  │
│                                         TOTAL      €804,65 │
│                                                             │
│ ─────────────────────────────────────────────────────      │
│                                                             │
│ Forma de pago: Transferencia bancaria                      │
│ IBAN: ES00 0000 0000 0000 0000 0000                        │
│ Concepto: F-2026-0042 + Nombre empresa                     │
│                                                             │
│ [Ver detalle de leads incluidos]                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚠️ GESTIÓN DE DISPUTAS

### Motivos de Rechazo Válidos

| Motivo | Descripción | Acción H4S |
|--------|-------------|------------|
| No contactable | Teléfono incorrecto, no existe | Verificar y aprobar |
| No responde | 3+ intentos sin respuesta | Aprobar si hay registro |
| Ya cliente | Era cliente del partner | Verificar y aprobar |
| Otro servicio | Buscaba algo diferente | Revisar formulario |
| Otra zona | Fuera de cobertura | Error de asignación, aprobar |
| Spam | Datos falsos, bot | Verificar IP/patrón |

### Proceso de Resolución

1. Partner rechaza lead con motivo
2. H4S recibe notificación
3. H4S verifica (llamada al usuario si necesario)
4. H4S decide: aprobar disputa (no cobrar) o rechazar (cobrar)
5. Se notifica al partner
6. Se ajusta factura si procede

### Objetivo de Tasa de Disputa

**< 5%** de leads enviados deberían ser disputados.

Si un partner tiene >10% de disputas:
- Revisar calidad de leads asignados
- Revisar si el partner cumple requisitos
- Posible conversación para alinear expectativas

---

## 📈 MÉTRICAS CLAVE (KPIs)

### Para H4S

| Métrica | Fórmula | Objetivo |
|---------|---------|----------|
| Ingresos mensuales | Σ leads facturados × precio | >€10K mes 1, >€30K mes 6 |
| Leads por partner | Total leads / Partners activos | >15/mes/partner |
| Tasa de disputa | Disputas / Leads enviados | <5% |
| Tasa de impago | Facturas impagadas / Total | <3% |
| Coste por lead | Gasto marketing / Leads | <€10 |
| Tasa de conversión web | Leads / Visitas | >3% |

### Para Partners (visible en su panel)

| Métrica | Descripción |
|---------|-------------|
| Leads recibidos | Total del mes |
| Tasa de contacto | % leads que contactaron |
| Tasa de conversión | % leads que convirtieron |
| Valor medio | Facturación media por lead convertido |
| ROI | (Valor ventas - Coste leads) / Coste leads |
| Coste adquisición | Coste leads / Clientes adquiridos |

---

## 🔒 REGLAS CON PARTNERS

### Obligaciones del Partner

1. **Contactar en tiempo** según clasificación del lead
2. **Actualizar estado** del lead en 48h máximo
3. **No incentivar** contacto directo futuro fuera de H4S
4. **Mantener calidad** de servicio al usuario
5. **Pagar facturas** en plazo

### Prohibiciones

1. ❌ Decir al usuario "la próxima vez llámame directo"
2. ❌ Compartir leads con terceros
3. ❌ Usar datos para marketing sin consentimiento
4. ❌ Rechazar leads sin motivo justificado
5. ❌ Acumular impagos

### Consecuencias

| Infracción | Consecuencia |
|------------|--------------|
| Retraso contacto reiterado | Warning → Reducción leads |
| No actualizar estados | Suspensión temporal |
| Incentivar contacto directo | Suspensión → Baja |
| Impago >30 días | Suspensión de leads |
| Impago >60 días | Baja definitiva |

---

*Este documento define el modelo operativo de Health4Spain. Se actualizará según evolucione el negocio.*
