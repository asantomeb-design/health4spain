// =============================================
// HEALTH4SPAIN · Partners · Dominio compartido
// =============================================
// Lógica de negocio del modelo de partners (Acceso 1 + Acceso 2):
//  - Matriz de precios por tier × plan
//  - Volúmenes base de leads/mes
//  - Descuentos multi-vertical (estándar + Founding)
//  - Mapeo tier ↔ ciudad para las 19 ciudades estratégicas
//  - Recargo CPL por leads que excedan volumen base
//  - Helpers de validación y formateo
//
// Toda la matemática de pricing vive aquí, no en componentes ni en BD.
// Si el cliente cambia tarifas, se cambia este fichero.
// =============================================

import type {
  PartnerPlan,
  PartnerTier,
  PartnerService,
} from '@/lib/types';

// ---------------------------------------------
// Catálogo de planes
// ---------------------------------------------
export const PARTNER_PLANS = ['ACTIVA', 'CRECE', 'ESCALA', 'LIDERA'] as const;

export const PARTNER_TIERS = ['A', 'B', 'C'] as const;

export const PARTNER_SERVICES: readonly PartnerService[] = [
  'seguros',
  'abogados',
  'inmobiliarias',
  'gestorias',
] as const;

// ---------------------------------------------
// Matriz de precios (€/mes) — confirmada por el cliente, abril 2026.
// Si cambia, cambiar aquí y en docs/MODELO_NEGOCIO.md.
// ---------------------------------------------
export const PARTNER_PRICES: Record<PartnerTier, Record<PartnerPlan, number>> = {
  A: { ACTIVA: 195, CRECE: 390, ESCALA: 690, LIDERA: 1095 },
  B: { ACTIVA: 145, CRECE: 290, ESCALA: 590, LIDERA: 890 },
  C: { ACTIVA: 95,  CRECE: 190, ESCALA: 390, LIDERA: 590 },
};

// Leads/mes incluidos en la cuota base de cada plan.
export const PARTNER_VOLUMES_BASE: Record<PartnerPlan, number> = {
  ACTIVA: 15,
  CRECE: 25,
  ESCALA: 45,
  LIDERA: 999, // sentinel: "ilimitado" en producto
};

// Recargo €/lead por exceso sobre el volumen base.
export const PARTNER_CPL_EXTRA: Record<PartnerPlan, number> = {
  ACTIVA: 25,
  CRECE: 25,
  ESCALA: 20,
  LIDERA: 0,
};

// Tiempos mínimos de progresión entre planes (meses).
export const PARTNER_PROGRESSION_MONTHS: Record<PartnerPlan, number> = {
  ACTIVA: 0,    // entrada
  CRECE: 3,     // tras 3 meses cumpliendo
  ESCALA: 9,    // tras 9 meses (3 + 6)
  LIDERA: 21,   // tras 21 meses (9 + 12)
};

// ---------------------------------------------
// Multi-vertical (descuentos sobre la cuota base)
// ---------------------------------------------
// El primer servicio = vertical principal (100% de cuota).
// Cada vertical adicional aplica un descuento incremental.
//   - Estándar: 0 / 10 / 30 / 40 %
//   - Founding: 0 / 15 / 35 / 45 % (5 pp más a partir de la 2ª vertical)
export const PARTNER_MULTI_VERTICAL_DISCOUNTS = {
  standard: [0, 0.10, 0.30, 0.40] as const,
  founding: [0, 0.15, 0.35, 0.45] as const,
};

// ---------------------------------------------
// Multi-zona
// ---------------------------------------------
// Una zona principal incluida en cualquier plan.
// Desde Plan ESCALA: hasta +2 zonas adicionales al 50% del precio base del tier
// de cada zona. En Plan LIDERA, la zona de influencia entera está incluida.
export const PARTNER_EXTRA_ZONE_RATIO = 0.5;
export const PARTNER_EXTRA_ZONES_FROM_PLAN: PartnerPlan = 'ESCALA';
export const PARTNER_MAX_EXTRA_ZONES_BY_PLAN: Record<PartnerPlan, number> = {
  ACTIVA: 0,
  CRECE: 0,
  ESCALA: 2,
  LIDERA: 99,
};

// ---------------------------------------------
// Founding Partner
// ---------------------------------------------
// Descuento aplicado durante los primeros N meses + bloqueo de precio + setup gratis.
export const PARTNER_FOUNDING_DISCOUNT = 0.30;        // 30% off
export const PARTNER_FOUNDING_DURATION_MONTHS = 6;
export const PARTNER_FOUNDING_TOTAL_SLOTS = 10;

// ---------------------------------------------
// Mapeo tier por ciudad — 19 ciudades estratégicas
// ---------------------------------------------
// Criterio (alineado con la doctrina del cliente):
//  - Tier A · ciudades costeras con alta penetración expat (>30% no-españoles)
//  - Tier B · ciudades costeras o capitales con expat moderado
//  - Tier C · interior y mercados en desarrollo
//
// Si una ciudad no está en este mapa (ej. el partner escribió "otra"),
// el closer asigna tier manualmente en la llamada.
export const PARTNER_CITY_TIER: Record<string, PartnerTier> = {
  // ==== ALICANTE ====
  // Tier A — costa con alta concentración de expats
  torrevieja: 'A',
  orihuela: 'A',
  benidorm: 'A',
  denia: 'A',
  // Tier B — capital y entornos urbanos
  alicante: 'B',
  elche: 'B',
  rojales: 'B',

  // ==== MURCIA ====
  // Tier B — Mar Menor, costa y capital
  murcia: 'B',
  cartagena: 'B',
  'san-pedro-pinatar': 'B',
  'san-javier': 'B',
  'torre-pacheco': 'B',
  mazarron: 'B',
  // Tier C — interior y mercados emergentes
  lorca: 'C',
  'molina-de-segura': 'C',
  aguilas: 'C',
  cieza: 'C',
  jumilla: 'C',
  yecla: 'C',
};

/** Devuelve el tier sugerido para una ciudad (slug). 'B' por defecto si desconocida. */
export function tierForCity(citySlug: string | null | undefined): PartnerTier {
  if (!citySlug) return 'B';
  const slug = citySlug.toLowerCase().trim();
  return PARTNER_CITY_TIER[slug] ?? 'B';
}

/** ¿Es la ciudad una de las 19 estratégicas? Para distinguir del "otra" del formulario. */
export function isStrategicCity(citySlug: string | null | undefined): boolean {
  if (!citySlug) return false;
  return Object.prototype.hasOwnProperty.call(
    PARTNER_CITY_TIER,
    citySlug.toLowerCase().trim()
  );
}

// ---------------------------------------------
// Cálculos
// ---------------------------------------------
export interface PartnerPriceBreakdown {
  /** Precio base del plan en este tier (€/mes) */
  basePrice: number;
  /** Cuota mensual final tras aplicar Founding (si procede) (€/mes) */
  monthlyFee: number;
  /** Descuento aplicado al base (0-1) */
  foundingDiscount: number;
  /** Volumen base de leads/mes */
  volumeBase: number;
  /** Recargo €/lead por exceso */
  cplExtra: number;
}

export function computePartnerPrice(
  tier: PartnerTier,
  plan: PartnerPlan,
  founding: boolean = false
): PartnerPriceBreakdown {
  const basePrice = PARTNER_PRICES[tier][plan];
  const foundingDiscount = founding ? PARTNER_FOUNDING_DISCOUNT : 0;
  const monthlyFee = Math.round(basePrice * (1 - foundingDiscount));
  return {
    basePrice,
    monthlyFee,
    foundingDiscount,
    volumeBase: PARTNER_VOLUMES_BASE[plan],
    cplExtra: PARTNER_CPL_EXTRA[plan],
  };
}

export interface MultiVerticalBreakdown {
  servicio: string;
  position: 1 | 2 | 3 | 4;
  discount: number;
  price: number;
}

/**
 * Calcula la cuota total cuando el partner contrata varias verticales.
 * El orden del array `verticales` determina la prelación: índice 0 = principal.
 */
export function computeMultiVertical(
  tier: PartnerTier,
  plan: PartnerPlan,
  verticales: string[],
  founding: boolean = false
): { items: MultiVerticalBreakdown[]; total: number } {
  if (!verticales || verticales.length === 0) {
    return { items: [], total: 0 };
  }
  const base = PARTNER_PRICES[tier][plan];
  const discounts = founding
    ? PARTNER_MULTI_VERTICAL_DISCOUNTS.founding
    : PARTNER_MULTI_VERTICAL_DISCOUNTS.standard;

  const items: MultiVerticalBreakdown[] = verticales.slice(0, 4).map((servicio, i) => {
    const discount = discounts[i] ?? discounts[discounts.length - 1];
    const price = Math.round(base * (1 - discount));
    return {
      servicio,
      position: (i + 1) as 1 | 2 | 3 | 4,
      discount,
      price,
    };
  });

  const total = items.reduce((sum, it) => sum + it.price, 0);
  return { items, total };
}

/**
 * Calcula el coste de zonas adicionales (50% del precio base de cada tier).
 * `extraZones` es un array de tiers (uno por zona adicional).
 */
export function computeExtraZonesCost(
  plan: PartnerPlan,
  extraZones: PartnerTier[]
): { allowed: number; charged: number; cost: number } {
  const allowed = PARTNER_MAX_EXTRA_ZONES_BY_PLAN[plan];
  const sliced = extraZones.slice(0, allowed);
  // En LIDERA las zonas de influencia van incluidas (sin coste extra).
  if (plan === 'LIDERA') {
    return { allowed, charged: sliced.length, cost: 0 };
  }
  const cost = sliced.reduce(
    (sum, t) => sum + Math.round(PARTNER_PRICES[t][plan] * PARTNER_EXTRA_ZONE_RATIO),
    0
  );
  return { allowed, charged: sliced.length, cost };
}

// ---------------------------------------------
// ROI helper (puro, reutilizable cliente y servidor)
// ---------------------------------------------
export interface RoiInputs {
  tier: PartnerTier;
  plan: PartnerPlan;
  leadsPerMonth: number;
  closeRate: number;       // 0-1
  ticketAverage: number;   // € por operación
  recurrence: number;      // 1-5x al año
  founding?: boolean;
}

export interface RoiOutputs {
  opsPerMonth: number;
  revenueMonth: number;
  revenueYear: number;
  monthlyFee: number;
  cplMonth: number;
  totalCostYear: number;
  netYear: number;
  roi: number;
  paybackMonths: number;
}

export function computeRoi(input: RoiInputs): RoiOutputs {
  const price = computePartnerPrice(input.tier, input.plan, input.founding);
  const opsPerMonth = input.leadsPerMonth * input.closeRate;
  const revenueMonth = opsPerMonth * input.ticketAverage;
  const revenueYear = revenueMonth * 12 * input.recurrence;
  const extraLeads = Math.max(0, input.leadsPerMonth - price.volumeBase);
  const cplMonth = extraLeads * price.cplExtra;
  const totalCostYear = (price.monthlyFee + cplMonth) * 12;
  const netYear = revenueYear - totalCostYear;
  const roi = totalCostYear > 0 ? revenueYear / totalCostYear : 0;
  const monthlyMargin = revenueMonth - (price.monthlyFee + cplMonth);
  const paybackMonths = monthlyMargin > 0 ? totalCostYear / (revenueMonth * input.recurrence) : 0;
  return {
    opsPerMonth,
    revenueMonth,
    revenueYear,
    monthlyFee: price.monthlyFee,
    cplMonth,
    totalCostYear,
    netYear,
    roi,
    paybackMonths,
  };
}

// ---------------------------------------------
// Token de acceso al panel privado (Acceso 2)
// ---------------------------------------------
// El token se persiste en BD (`partner_leads.access_token`) como UUID v4
// generado por gen_random_uuid(). Aquí solo definimos la duración por defecto
// y un helper para construir la URL pública.
export const PARTNER_ACCESS_TOKEN_TTL_DAYS = 7;

/** Construye la URL absoluta del panel privado del partner. */
export function buildPartnerAccessUrl(token: string, locale: 'es' = 'es'): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.health4spain.com').replace(/\/$/, '');
  return `${base}/${locale}/partners/acceso?token=${encodeURIComponent(token)}`;
}

// ---------------------------------------------
// Etiquetas humanas (para UI sin recurrir a dictionaries.ts)
// ---------------------------------------------
export const PARTNER_PLAN_LABELS: Record<PartnerPlan, string> = {
  ACTIVA: 'Activa',
  CRECE: 'Crece',
  ESCALA: 'Escala',
  LIDERA: 'Lidera',
};

export const PARTNER_TIER_LABELS: Record<PartnerTier, string> = {
  A: 'Tier A · Premium',
  B: 'Tier B · Media',
  C: 'Tier C · En desarrollo',
};

export const PARTNER_SERVICE_LABELS: Record<PartnerService, string> = {
  seguros: 'Mediador / Agente de seguros',
  abogados: 'Abogado de extranjería',
  inmobiliarias: 'Inmobiliaria',
  gestorias: 'Gestoría / Asesoría fiscal',
};

export const PARTNER_SERVICE_ICONS: Record<PartnerService, string> = {
  seguros: '🛡️',
  abogados: '⚖️',
  inmobiliarias: '🏠',
  gestorias: '📋',
};

export function formatEuros(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
