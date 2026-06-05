// =============================================
// HEALTH4SPAIN · HUB · Arquitectura de adaptadores CSV
// =============================================
// Spec multi-compañía §3.8: cada compañía = un adaptador que normaliza su CSV
// al esquema interno común (HubParsedLine). Añadir Aegon/Mapfre/Mutua = crear
// un nuevo parser que implemente esta interfaz y registrarlo en index.ts.
// El módulo de asignación y el export contable NO cambian.

import type { HubParseResult } from '@/lib/types';

export interface CompanyParser {
  /** Clave que enlaza con hub_companies.parser_key. */
  key: string;
  /** Nombre legible de la compañía. */
  label: string;
  /**
   * Parsea el contenido crudo del fichero (texto) y devuelve líneas
   * normalizadas + métricas. No lanza: las filas inválidas se marcan con
   * `errores` y no bloquean la importación (§3.2).
   */
  parse(rawText: string): HubParseResult;
}

// ---------------------------------------------
// Utilidades compartidas por todos los parsers
// ---------------------------------------------

/** Convierte número en formato español ("1.234,56") a number. null si vacío/ inválido. */
export function parseSpanishNumber(value: string | undefined | null): number | null {
  if (value == null) return null;
  const s = String(value).trim();
  if (s === '' || s.toUpperCase() === 'VACIO') return null;
  // Quitar separadores de miles (.) y normalizar decimal (,) → (.)
  const normalized = s.replace(/\./g, '').replace(',', '.').replace(/[^0-9.\-]/g, '');
  if (normalized === '' || normalized === '-' || normalized === '.') return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

/** Convierte fecha DD/MM/YYYY (o DD-MM-YYYY) a ISO YYYY-MM-DD. null si vacío. */
export function parseSpanishDate(value: string | undefined | null): string | null {
  if (value == null) return null;
  const s = String(value).trim();
  if (s === '') return null; // vacío válido en ANUAL (§3.2)
  const m = /^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})$/.exec(s);
  if (!m) return null;
  let [, dd, mm, yyyy] = m;
  if (yyyy.length === 2) yyyy = `20${yyyy}`;
  const d = dd.padStart(2, '0');
  const mo = mm.padStart(2, '0');
  const dt = new Date(`${yyyy}-${mo}-${d}T00:00:00Z`);
  if (Number.isNaN(dt.getTime())) return null;
  return `${yyyy}-${mo}-${d}`;
}

/**
 * Divide una línea CSV respetando comillas. Separador configurable.
 * ASISA usa ';'. Soporta campos entrecomillados con "".
 */
export function splitCsvLine(line: string, sep: string = ';'): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === sep && !inQuotes) {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out.map((c) => c.trim());
}

/** Normaliza un nombre de cabecera para comparar (sin acentos, mayúsc., espacios). */
export function normalizeHeader(h: string): string {
  return h
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .trim();
}
