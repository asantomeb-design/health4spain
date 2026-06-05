// =============================================
// HEALTH4SPAIN · HUB · Parser CSV genérico (fallback)
// =============================================
// Para compañías sin adaptador específico todavía. Intenta mapear columnas
// por nombres habituales. Sirve de base mientras se construye el adaptador
// dedicado de cada compañía (Aegon, Mapfre, Mutua…).

import type { HubParsedLine, HubParseResult } from '@/lib/types';
import {
  parseSpanishNumber,
  parseSpanishDate,
  splitCsvLine,
  normalizeHeader,
  type CompanyParser,
} from './types';

// Alias de cabecera → clave interna (cada clave admite varios nombres).
const ALIASES: Record<string, string[]> = {
  nif_agente: ['NIF AGENTE', 'NIF', 'CIF AGENTE'],
  nombre_agente: ['NOMBRE DEL AGENTE', 'AGENTE', 'MEDIADOR'],
  cliente: ['CLIENTE', 'COD CLIENTE'],
  producto: ['RAZON SOCIAL', 'PRODUCTO', 'RAMO', 'MODALIDAD'],
  subramo: ['SUBRAMO'],
  poliza: ['POLIZA', 'N POLIZA', 'NUM POLIZA', 'CONTRATO'],
  asegurado: ['NOMBRE ASEGURADO', 'ASEGURADO', 'TOMADOR'],
  fecha_desde: ['FECHA DESDE', 'F. EFECTO', 'EFECTO'],
  fecha_hasta: ['FECHA HASTA', 'F. VENCIMIENTO', 'VENCIMIENTO'],
  prima_neta: ['PRIMA NETA', 'PRIMA', 'BASE'],
  comision: ['COMISION', 'IMPORTE COMISION', 'COMISIONES'],
  comision_pct: ['COMISION %', '% COMISION', 'PORCENTAJE'],
  ref_externa: ['REF-EXTERNA', 'REFERENCIA', 'REF'],
  periodo: ['PER. LIQUIDACION', 'PERIODO', 'LIQUIDACION'],
};

function buildIndex(headers: string[]): Record<string, number> {
  const idx: Record<string, number> = {};
  for (const [key, names] of Object.entries(ALIASES)) {
    const pos = headers.findIndex((h) => names.map(normalizeHeader).includes(h));
    if (pos >= 0) idx[key] = pos;
  }
  return idx;
}

function parseGeneric(rawText: string): HubParseResult {
  const lines = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .filter((l) => l.trim() !== '');

  const empty: HubParseResult = {
    lineas: [], n_total: 0, n_validas: 0, n_error: 0,
    total_comision_bruta: 0, periodo_detectado: null,
  };
  if (lines.length < 2) return empty;

  const sep = [';', ',', '\t']
    .map((s) => ({ s, n: lines[0].split(s).length }))
    .sort((a, b) => b.n - a.n)[0].s;

  const headers = splitCsvLine(lines[0], sep).map(normalizeHeader);
  const idx = buildIndex(headers);

  if (idx.poliza == null || idx.comision == null) {
    return { ...empty, n_error: Math.max(0, lines.length - 1) };
  }

  const get = (cols: string[], key: string) =>
    idx[key] != null ? cols[idx[key]] : undefined;

  const out: HubParsedLine[] = [];
  let totalBruta = 0;
  let nValidas = 0;
  let nError = 0;
  let periodoDetectado: string | null = null;

  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i], sep);
    const errores: string[] = [];
    const comisionBruta = parseSpanishNumber(get(cols, 'comision'));
    const poliza = get(cols, 'poliza')?.trim() || null;
    if (comisionBruta == null) errores.push('COMISION vacía o no numérica');
    if (!poliza) errores.push('POLIZA vacía');

    const periodo = (get(cols, 'periodo') || '').trim() || null;
    if (periodo && !periodoDetectado) periodoDetectado = periodo;

    const raw: Record<string, unknown> = {};
    headers.forEach((h, j) => { raw[h] = cols[j] ?? ''; });

    const linea: HubParsedLine = {
      nif_agente: get(cols, 'nif_agente')?.trim() || null,
      nombre_agente: get(cols, 'nombre_agente')?.trim() || null,
      cliente: get(cols, 'cliente')?.trim() || null,
      producto: get(cols, 'producto')?.trim() || null,
      subramo: get(cols, 'subramo')?.trim() || null,
      poliza,
      asegurado: get(cols, 'asegurado')?.trim() || null,
      fecha_desde: parseSpanishDate(get(cols, 'fecha_desde')),
      fecha_hasta: parseSpanishDate(get(cols, 'fecha_hasta')),
      prima_neta: parseSpanishNumber(get(cols, 'prima_neta')),
      comision_bruta: comisionBruta ?? 0,
      comision_pct_compania: parseSpanishNumber(get(cols, 'comision_pct')),
      ref_externa: get(cols, 'ref_externa')?.trim() || null,
      periodo,
      raw,
      errores,
    };

    if (errores.length === 0) {
      nValidas++;
      totalBruta += linea.comision_bruta;
    } else {
      nError++;
    }
    out.push(linea);
  }

  return {
    lineas: out,
    n_total: out.length,
    n_validas: nValidas,
    n_error: nError,
    total_comision_bruta: Math.round((totalBruta + Number.EPSILON) * 100) / 100,
    periodo_detectado: periodoDetectado,
  };
}

export const genericParser: CompanyParser = {
  key: 'generic',
  label: 'Genérico',
  parse: parseGeneric,
};
