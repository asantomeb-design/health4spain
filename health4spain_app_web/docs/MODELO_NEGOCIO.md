# 💼 Health4Spain - Modelo de Negocio y Partners

> **Documento Técnico del Modelo de Negocio**  
> Última actualización: mayo de 2026

---

## 🗺️ Mapa de la documentación

Este doc describe el **modelo conceptual y operativo** del negocio. La implementación se reparte en dos fases con docs independientes:

| Fase | Qué cubre | Doc | Estado |
|------|-----------|-----|--------|
| **Fase 1 · Captación** | Atraer al partner, cualificarlo, conseguir que firme. Acceso 1 público + Acceso 2 privado por magic link + admin de cualificación + matriz Tier × Plan + Founding (10 plazas). | [`PARTNERS_FASE1_CAPTACION.md`](./PARTNERS_FASE1_CAPTACION.md) | ✅ Operativo (mayo 2026) |
| **Fase 2 · Operativa post-firma** | Asignación de leads al partner, panel del partner activo, facturación, disputas, KPIs. | [`MODELO_PARTNERS_LEADS.md`](./MODELO_PARTNERS_LEADS.md) | 📖 Diseño (target / v2) |

Lo que sigue en este documento es la base conceptual común a ambas fases.

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

---

## 🚫 PREVENCIÓN DE FUGA DE LEADS

### Medidas Anti-Fuga

1. **NO MOSTRAR INFORMACIÓN IDENTIFICABLE**
   - ❌ Nombre del partner
   - ❌ Dirección exacta
   - ❌ Teléfono / Email / Web
   - ❌ Fotos del local

2. **CAMBIAR EL ENFOQUE MENTAL**
   - No: *"Aquí tienes esta peluquería"*
   - Sí: *"Te asignamos un profesional adecuado a tu perfil"*

3. **APORTAR VENTAJAS EXCLUSIVAS**
   - ✅ Prioridad en citas
   - ✅ Precio cerrado previamente
   - ✅ Idioma garantizado
   - ✅ Soporte post-servicio de H4S

---

## 📊 ARQUITECTURA DE DATOS

### Entidad: PARTNER

```sql
partners (
    id, nombre_comercial, razon_social, cif,
    servicio_id, ciudades_cobertura[], idiomas[],
    capacidad_leads_mes, precio_por_lead,
    estado, tier, verificado
)
```

### Entidad: LEAD

```sql
leads (
    id, numero_lead,
    nombre, email, telefono, idioma_preferido,
    servicio_id, ciudad_interes_id, descripcion_necesidad,
    urgencia, puntuacion_total, clasificacion,
    estado, landing_page, utm_source
)
```

### Entidad: LEAD_PARTNER (Asignación)

```sql
lead_partner (
    id, lead_id, partner_id,
    fecha_asignacion, estado,
    precio_lead, facturable, facturado,
    convertido, valor_conversion
)
```

---

## 🔄 CICLO DE VIDA DEL LEAD

```
NUEVO → CONTACTADO_H4S → ASIGNADO → ENVIADO → CONTACTADO/CONVERTIDO
```

### Tiempos de Respuesta

| Clasificación | H4S contacta | Partner debe contactar |
|---------------|--------------|------------------------|
| 🔥 HOT | <1 hora | <2 horas |
| 🟡 WARM | <4 horas | <24 horas |
| 🔵 COLD | <24 horas | <48 horas |

---

## 🎯 LÓGICA DE ASIGNACIÓN

1. **Filtrar** partners elegibles (servicio, ciudad, idioma, capacidad)
2. **Ordenar** por tier, valoración, leads recibidos
3. **Seleccionar** cantidad según clasificación del lead

| Clasificación | Partners |
|---------------|----------|
| 🔥 HOT | 1-2 |
| 🟡 WARM | 2-3 |
| 🔵 COLD | 3-4 |

---

## 💰 FACTURACIÓN

### Calendario Mensual

| Día | Acción |
|-----|--------|
| 1-5 | Generación de facturas borrador |
| 10 | Emisión y envío |
| 25 | Vencimiento |
| +30 | Suspensión de leads |

---

## 📈 MÉTRICAS CLAVE (KPIs)

### Para H4S

| Métrica | Objetivo |
|---------|----------|
| Ingresos mensuales | >€30K (mes 6) |
| Leads por partner | >15/mes |
| Tasa de disputa | <5% |
| Tasa de impago | <3% |

### Para Partners

| Métrica | Descripción |
|---------|-------------|
| Tasa de contacto | % leads contactados |
| Tasa de conversión | % leads convertidos |
| ROI | (Ventas - Coste leads) / Coste |

---

## 🔒 REGLAS CON PARTNERS

### Obligaciones
1. Contactar en tiempo según clasificación
2. Actualizar estado en 48h
3. No incentivar contacto directo futuro
4. Pagar facturas en plazo

### Consecuencias

| Infracción | Consecuencia |
|------------|--------------|
| Retraso contacto | Warning → Reducción leads |
| Incentivar contacto directo | Suspensión → Baja |
| Impago >30 días | Suspensión |
| Impago >60 días | Baja definitiva |

---

## 💸 Estructura de monetización

| Línea | Cuándo | Detalle |
|-------|--------|---------|
| **Suscripción de partner** (planes ACTIVA / CRECE / ESCALA / LIDERA) | Tras firma | Cuota mensual fija según Tier × Plan. Detalle: [`PARTNERS_FASE1_CAPTACION.md` §3.1](./PARTNERS_FASE1_CAPTACION.md#31-tarifas-tier--plan-mes). |
| **Lead extra (CPL)** | Por encima de los leads incluidos en el plan | 35€/lead (ACTIVA) → 0€ (LIDERA, ilimitado). |
| **Multi-vertical** | Partner que opera 2-4 verticales en su zona | Descuento progresivo 0/10/30/40 (+5pp Founding). |
| **Zonas adicionales** | Desde plan ESCALA | 50 % del precio base de la zona principal. |
| **Comisión sobre venta** | Diferida (v2+) | Acuerdos puntuales por servicio (3-10 %). |
| **Destacados premium / micro-sites** | Diferidos (v2+) | Posicionamiento extra dentro del directorio. |

> Programa **Founding** (primeras 10 plazas): 30 % de descuento durante 6 meses + bloqueo de precio vitalicio + setup gratis. Solo se firma 1 vez globalmente. Detalle: [`PARTNERS_FASE1_CAPTACION.md` §3.5](./PARTNERS_FASE1_CAPTACION.md#35-founding-partners-10-plazas-globales).

---

*Este documento define el modelo operativo de Health4Spain. Para el detalle de la implementación actual de captación de partners, ver [`PARTNERS_FASE1_CAPTACION.md`](./PARTNERS_FASE1_CAPTACION.md).*
