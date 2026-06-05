// =============================================
// HEALTH4SPAIN · HUB · Motor de comisiones y liquidaciones
// =============================================
// Toda la matemática de comisión/IRPF/régimen vive aquí (pura, reutilizable
// cliente y servidor). Si el cliente cambia reglas, se cambia este fichero.
//
// Cadena de cálculo (Spec multi-compañía §3.3 + Visión Flujos §05):
//   bruta_asignada = comision_bruta × (pct_reparto / 100)   ← parte de la línea para este closer
//   comision_base  = bruta_asignada × (pct_closer / 100)    ← lo que gana el closer (terna)
//   bonus_cvr      = comision_base × (bonus_pct / 100)      ← bono por nivel CVR
//   comision_total = comision_base + bonus_cvr
//   irpf_importe   = comision_total × (irpf_pct / 100)
//   neto_pagar     = comision_total − irpf_importe

import type { HubCvrNivel, HubRegimen } from '@/lib/types';

export const IRPF_PCT_DEFAULT = 15;

// ---------------------------------------------
// Cálculo de comisión de una línea
// ---------------------------------------------
export interface ComisionInput {
  /** Comisión bruta liquidada por la compañía (col. 14 del CSV ASISA). */
  comisionBruta: number;
  /** % de la línea para este closer cuando una póliza se reparte (100 = sin reparto). */
  pctReparto?: number;
  /** % que se lleva el closer sobre su parte (de hub_commission_config). */
  pctCloser: number;
  /** Bono CVR aplicable (0 si no procede). */
  bonusPct?: number;
  /** Retención IRPF (15% por defecto, parametrizable). */
  irpfPct?: number;
}

export interface ComisionBreakdown {
  brutaAsignada: number;
  comisionBase: number;
  bonusCvr: number;
  comisionTotal: number;
  irpfPct: number;
  irpfImporte: number;
  netoPagar: number;
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function computeComisionLinea(input: ComisionInput): ComisionBreakdown {
  const pctReparto = input.pctReparto ?? 100;
  const bonusPct = input.bonusPct ?? 0;
  const irpfPct = input.irpfPct ?? IRPF_PCT_DEFAULT;

  const brutaAsignada = round2(input.comisionBruta * (pctReparto / 100));
  const comisionBase = round2(brutaAsignada * (input.pctCloser / 100));
  const bonusCvr = round2(comisionBase * (bonusPct / 100));
  const comisionTotal = round2(comisionBase + bonusCvr);
  const irpfImporte = round2(comisionTotal * (irpfPct / 100));
  const netoPagar = round2(comisionTotal - irpfImporte);

  return {
    brutaAsignada,
    comisionBase,
    bonusCvr,
    comisionTotal,
    irpfPct,
    irpfImporte,
    netoPagar,
  };
}

// ---------------------------------------------
// Régimen de cobro n+1 / n+2 → fecha estimada
// ---------------------------------------------
// El periodo viene como 'MM-YYYY'. La fecha de cobro estimada se sitúa el día
// 15 del mes resultante de sumar 1 (n+1) o 2 (n+2) meses al periodo.
//   Ej: periodo 05-2026, n+1 → 15-06-2026 · n+2 → 15-07-2026

export function mesesDeRegimen(regimen: HubRegimen): number {
  return regimen === 'n+2' ? 2 : 1;
}

/** Devuelve la fecha de cobro estimada en ISO (YYYY-MM-DD) o null si periodo inválido. */
export function fechaCobroEstimada(periodo: string, regimen: HubRegimen): string | null {
  const m = /^(\d{1,2})-(\d{4})$/.exec(periodo.trim());
  if (!m) return null;
  const mes = parseInt(m[1], 10);
  const anio = parseInt(m[2], 10);
  if (mes < 1 || mes > 12) return null;
  // Date en UTC para evitar saltos por zona horaria. Mes 0-indexado.
  const base = new Date(Date.UTC(anio, mes - 1, 15));
  base.setUTCMonth(base.getUTCMonth() + mesesDeRegimen(regimen));
  return base.toISOString().slice(0, 10);
}

// ---------------------------------------------
// Niveles CVR (Visión Flujos §04)
// ---------------------------------------------
// elite ≥15% (+1.0) · optimo 12-14.99 (+0.5) · objetivo 9-11.99 (+0.25)
// minimo 6-8.99 (0) · riesgo <6 (0)
export interface CvrNivelInfo {
  nivel: HubCvrNivel;
  label: string;
  bonusPct: number;
  minCvr: number;
  color: string;
}

export const CVR_NIVELES: CvrNivelInfo[] = [
  { nivel: 'elite',    label: 'Élite',    bonusPct: 1.0,  minCvr: 15, color: '#16A34A' },
  { nivel: 'optimo',   label: 'Óptimo',   bonusPct: 0.5,  minCvr: 12, color: '#2563EB' },
  { nivel: 'objetivo', label: 'Objetivo', bonusPct: 0.25, minCvr: 9,  color: '#D97706' },
  { nivel: 'minimo',   label: 'Mínimo',   bonusPct: 0,    minCvr: 6,  color: '#C05621' },
  { nivel: 'riesgo',   label: 'Riesgo',   bonusPct: 0,    minCvr: 0,  color: '#DC2626' },
];

/** Clasifica un CVR (porcentaje 0-100) en su nivel + bono. */
export function clasificarCvr(cvr: number): CvrNivelInfo {
  for (const n of CVR_NIVELES) {
    if (cvr >= n.minCvr) return n;
  }
  return CVR_NIVELES[CVR_NIVELES.length - 1];
}

/** Calcula CVR = (cerrados / recibidos) × 100, redondeado a 2 decimales. */
export function computeCvr(leadsCerrados: number, leadsRecibidos: number): number {
  if (leadsRecibidos <= 0) return 0;
  return round2((leadsCerrados / leadsRecibidos) * 100);
}

// ---------------------------------------------
// Etiquetas de estado (UI)
// ---------------------------------------------
export const HUB_LINEA_ESTADO_LABELS: Record<string, string> = {
  consolidandose: 'Consolidándose',
  acumulado: 'Acumulado',
  cobrado: 'Cobrado',
  liquidada: 'Liquidada',
};

export const HUB_LIQUIDACION_ESTADO_LABELS: Record<string, string> = {
  pendiente: 'Pendiente',
  pendiente_aprobacion: 'Pendiente de aprobación',
  aprobada: 'Aprobada',
  elegible: 'Elegible',
  liquidada: 'Liquidada',
  rechazada: 'Rechazada',
};

export function formatEuros(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
