// =============================================
// HEALTH4SPAIN · HUB · Parser CSV ASISA (25 columnas)
// =============================================
// Spec multi-compañía §3.2. Caso canónico de test:
//   Liquidacion comisiones_22009093W00_01_2026.csv (ASISA enero 2026)
//
// Reglas de parsing:
//   · Separador: ';'
//   · Decimal: ',' → '.'
//   · FECHA DESDE / FECHA HASTA vacías son válidas (líneas ANUAL/ANUALIZADA)
//   · SUBRAMO puede llegar con valor literal "VACIO" → string, no null
//   · Header-driven: resiliente al orden de columnas; valida columnas clave

import type { HubParsedLine, HubParseResult } from '@/lib/types';
import {
  parseSpanishNumber,
  parseSpanishDate,
  splitCsvLine,
  normalizeHeader,
  type CompanyParser,
} from './types';

// Cabeceras ASISA → clave interna. Normalizadas (sin acentos, mayúsculas).
const COLUMN_MAP: Record<string, keyof RawAsisaRow> = {
  'NIF AGENTE': 'nif_agente',
  'ORDEN': 'orden',
  'NOMBRE DEL AGENTE': 'nombre_agente',
  'CLIENTE': 'cliente',
  'RAZON SOCIAL': 'razon_social',
  'SUBRAMO': 'subramo',
  'POLIZA': 'poliza',
  'ORDEN POLIZA': 'orden_poliza',
  'NOMBRE ASEGURADO': 'nombre_asegurado',
  'FECHA DESDE': 'fecha_desde',
  'FECHA HASTA': 'fecha_hasta',
  'PRIMA NETA': 'prima_neta',
  'SIT. RECIBO': 'sit_recibo',
  'COMISION': 'comision',
  'COMISION %': 'comision_pct',
  'IND. COM.': 'ind_com',
  'ACCION': 'accion',
  'DELEGACION': 'delegacion',
  'RECIBO': 'recibo',
  'DC': 'dc',
  'SUBAGENTE': 'subagente',
  'REF-EXTERNA': 'ref_externa',
  'PER. LIQUIDACION': 'per_liquidacion',
  'CLEA': 'clea',
  'TOTAL_REC': 'total_rec',
};

interface RawAsisaRow {
  nif_agente?: string;
  orden?: string;
  nombre_agente?: string;
  cliente?: string;
  razon_social?: string;
  subramo?: string;
  poliza?: string;
  orden_poliza?: string;
  nombre_asegurado?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  prima_neta?: string;
  sit_recibo?: string;
  comision?: string;
  comision_pct?: string;
  ind_com?: string;
  accion?: string;
  delegacion?: string;
  recibo?: string;
  dc?: string;
  subagente?: string;
  ref_externa?: string;
  per_liquidacion?: string;
  clea?: string;
  total_rec?: string;
}

// Columnas mínimas para considerar el fichero un CSV ASISA válido.
const REQUIRED = ['NIF AGENTE', 'POLIZA', 'COMISION'];

function detectSeparator(headerLine: string): string {
  const counts = [';', ',', '\t'].map((s) => ({ s, n: headerLine.split(s).length }));
  counts.sort((a, b) => b.n - a.n);
  return counts[0].n > 1 ? counts[0].s : ';';
}

function parseAsisa(rawText: string): HubParseResult {
  const lines = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .filter((l) => l.trim() !== '');

  const empty: HubParseResult = {
    lineas: [],
    n_total: 0,
    n_validas: 0,
    n_error: 0,
    total_comision_bruta: 0,
    periodo_detectado: null,
  };
  if (lines.length < 2) return empty;

  const sep = detectSeparator(lines[0]);
  const headers = splitCsvLine(lines[0], sep).map(normalizeHeader);

  // Índice columna interna → posición en el CSV
  const colIndex: Partial<Record<keyof RawAsisaRow, number>> = {};
  headers.forEach((h, i) => {
    const key = COLUMN_MAP[h];
    if (key) colIndex[key] = i;
  });

  // Validar columnas mínimas (header-driven, resiliente al orden)
  const headerSet = new Set(headers);
  const missing = REQUIRED.filter((r) => !headerSet.has(normalizeHeader(r)));
  if (missing.length > 0) {
    return { ...empty, n_error: Math.max(0, lines.length - 1) };
  }

  const get = (cols: string[], key: keyof RawAsisaRow): string | undefined => {
    const idx = colIndex[key];
    return idx != null ? cols[idx] : undefined;
  };

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
    const perLiq = get(cols, 'per_liquidacion')?.trim() || null;

    if (comisionBruta == null) errores.push('COMISION vacía o no numérica');
    if (!poliza) errores.push('POLIZA vacía');

    // SUBRAMO: "VACIO" literal se conserva como string (§3.2)
    const subramo = get(cols, 'subramo');

    const periodo = normalizePeriodo(perLiq);
    if (periodo && !periodoDetectado) periodoDetectado = periodo;

    const raw: Record<string, unknown> = {};
    (Object.keys(COLUMN_MAP) as string[]).forEach((header) => {
      const key = COLUMN_MAP[header];
      raw[header] = get(cols, key) ?? '';
    });

    const linea: HubParsedLine = {
      nif_agente: get(cols, 'nif_agente')?.trim() || null,
      nombre_agente: get(cols, 'nombre_agente')?.trim() || null,
      cliente: get(cols, 'cliente')?.trim() || null,
      producto: get(cols, 'razon_social')?.trim() || null, // RAZON SOCIAL → producto
      subramo: subramo != null && subramo.trim() !== '' ? subramo.trim() : null,
      poliza,
      asegurado: get(cols, 'nombre_asegurado')?.trim() || null,
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

/** Normaliza PER. LIQUIDACION a 'MM-YYYY'. Acepta 'MM-YYYY', 'MM/YYYY', 'YYYY-MM'. */
function normalizePeriodo(value: string | null): string | null {
  if (!value) return null;
  const s = value.trim();
  let m = /^(\d{1,2})[-/](\d{4})$/.exec(s);
  if (m) return `${m[1].padStart(2, '0')}-${m[2]}`;
  m = /^(\d{4})[-/](\d{1,2})$/.exec(s);
  if (m) return `${m[2].padStart(2, '0')}-${m[1]}`;
  return null;
}

export const asisaParser: CompanyParser = {
  key: 'asisa',
  label: 'ASISA',
  parse: parseAsisa,
};
