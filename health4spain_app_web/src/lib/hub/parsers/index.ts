// =============================================
// HEALTH4SPAIN · HUB · Registro de parsers por compañía
// =============================================
// Punto único para resolver el parser de una compañía a partir de su
// `parser_key` (hub_companies.parser_key). Añadir una compañía nueva:
//   1) crear src/lib/hub/parsers/<compania>.ts que exporte un CompanyParser
//   2) importarlo y registrarlo en PARSERS aquí
// Nada más cambia en el módulo de asignación ni en el export contable.

import type { CompanyParser } from './types';
import { asisaParser } from './asisa';
import { genericParser } from './generic';

const PARSERS: Record<string, CompanyParser> = {
  [asisaParser.key]: asisaParser,
  [genericParser.key]: genericParser,
};

/** Devuelve el parser para una key; cae al genérico si no hay adaptador. */
export function getParser(parserKey: string | null | undefined): CompanyParser {
  if (!parserKey) return genericParser;
  return PARSERS[parserKey] ?? genericParser;
}

/** Lista de adaptadores disponibles (para UI admin). */
export function listParsers(): { key: string; label: string }[] {
  return Object.values(PARSERS).map((p) => ({ key: p.key, label: p.label }));
}

export type { CompanyParser } from './types';
