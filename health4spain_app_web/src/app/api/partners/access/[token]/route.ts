import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { tierForCity, isStrategicCity } from '@/lib/partners';
import type { PartnerAccessPublicData, PartnerLead, PartnerLeadStage } from '@/lib/types';

// =============================================
// /api/partners/access/[token]
// ---------------------------------------------
//  GET · público (con token) → valida que el token sea válido y vigente, y
//                              devuelve un subconjunto seguro de datos del
//                              partner_lead para hidratar la página Acceso 2.
//
// Reglas:
//  - El token debe existir y no haber caducado (access_token_expires_at > now()).
//  - El stage debe ser uno de los que permiten acceso al panel privado:
//      cualificado, contrato_solicitado, contratado.
//  - La primera vez que el partner abre el panel registramos
//    access_first_seen_at; en cada visita posterior, access_last_seen_at.
//  - NUNCA se devuelve el email completo, teléfono ni datos sensibles aquí.
//    Solo first_name + empresa + ciudad/servicio para personalizar la UI.
// =============================================

const VALID_STAGES_FOR_ACCESS: ReadonlySet<PartnerLeadStage> = new Set([
  'cualificado',
  'contrato_solicitado',
  'contratado',
]);

function rejectInvalid() {
  return NextResponse.json(
    { success: false, error: 'Enlace inválido o caducado.' },
    { status: 401 }
  );
}

export async function GET(
  _request: NextRequest,
  context: { params: { token: string } }
) {
  const token = (context.params?.token || '').trim();
  if (!token) return rejectInvalid();

  // Validación básica de formato UUID (no estricta, solo para descartar basura).
  if (!/^[0-9a-fA-F-]{30,40}$/.test(token)) {
    return rejectInvalid();
  }

  try {
    const supabase = createServerSupabaseClient();
    const nowIso = new Date().toISOString();

    const { data, error } = await supabase
      .from('partner_leads')
      .select('*')
      .eq('access_token', token)
      .gt('access_token_expires_at', nowIso)
      .maybeSingle();

    if (error) {
      console.error('[partners/access] supabase error:', error);
      return rejectInvalid();
    }
    if (!data) return rejectInvalid();

    const lead = data as PartnerLead;
    if (!VALID_STAGES_FOR_ACCESS.has(lead.stage)) {
      return rejectInvalid();
    }

    // Marcar visita (no bloqueante para la respuesta).
    const updates: Record<string, string> = {
      access_last_seen_at: nowIso,
    };
    if (!lead.access_first_seen_at) updates.access_first_seen_at = nowIso;
    supabase
      .from('partner_leads')
      .update(updates)
      .eq('id', lead.id)
      .then(({ error: updErr }) => {
        if (updErr) console.error('[partners/access] update visit error:', updErr);
      });

    const firstName = (lead.nombre || '').split(/\s+/)[0] || '';

    const publicData: PartnerAccessPublicData = {
      id: lead.id,
      first_name: firstName,
      empresa: lead.empresa,
      servicio: lead.servicio,
      ciudad_principal: lead.ciudad_principal,
      ciudad_es_estrategica:
        Boolean(lead.ciudad_es_estrategica) || isStrategicCity(lead.ciudad_principal),
      tier_sugerido: tierForCity(lead.ciudad_principal),
      // En v0 todos los cualificados que entran a Acceso 2 son candidatos a Founding,
      // hasta que el cliente decida lo contrario. Cuando se llene la cohorte de 10,
      // este flag se decide en BD (columna a futuro) y se devuelve aquí.
      founding_disponible: true,
      contract_plan: lead.contract_plan ?? null,
      contract_verticales: lead.contract_verticales ?? null,
      contract_zonas_adicionales: lead.contract_zonas_adicionales ?? null,
      contract_founding: Boolean(lead.contract_founding),
      contract_requested_at: lead.contract_requested_at ?? null,
    };

    return NextResponse.json({ success: true, data: publicData });
  } catch (err) {
    console.error('Error validating partner access token:', err);
    return rejectInvalid();
  }
}
