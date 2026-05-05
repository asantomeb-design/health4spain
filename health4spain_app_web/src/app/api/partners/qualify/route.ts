import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, handleSupabaseError } from '@/lib/supabase';
import { validateAdminAuth } from '@/lib/auth';
import { buildPartnerAccessUrl, PARTNER_ACCESS_TOKEN_TTL_DAYS } from '@/lib/partners';
import type { PartnerLeadStage } from '@/lib/types';

// =============================================
// /api/partners/qualify
// ---------------------------------------------
//  POST · admin → procesa una acción sobre un partner_lead.
//
//  Body shape:
//   {
//     id: string,                                 // partner_lead.id
//     action: 'qualify' | 'reject' |
//             'regenerate_token' | 'set_stage',
//     // dependiendo del action:
//     cualificacion_tipo?: 'A'|'B'|'C',           // qualify
//     cualificacion_notas?: string,               // qualify | reject
//     stage?: PartnerLeadStage,                   // set_stage
//   }
// =============================================

const VALID_STAGES: ReadonlySet<PartnerLeadStage> = new Set([
  'solicitud_recibida',
  'en_revision',
  'llamada_agendada',
  'cualificado',
  'rechazado',
  'contrato_solicitado',
  'contratado',
  'baja',
]);

interface QualifyBody {
  id?: string;
  action?: 'qualify' | 'reject' | 'regenerate_token' | 'set_stage';
  cualificacion_tipo?: 'A' | 'B' | 'C';
  cualificacion_notas?: string;
  stage?: PartnerLeadStage;
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await validateAdminAuth(request);
    if (authResult.error) return authResult.error;
    const adminEmail = authResult.user?.email ?? null;

    const body = (await request.json()) as QualifyBody;
    const id = (body.id || '').trim();
    const action = body.action;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Falta id del partner_lead' },
        { status: 400 }
      );
    }
    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Falta action' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();
    const ttl = `${PARTNER_ACCESS_TOKEN_TTL_DAYS} days`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + PARTNER_ACCESS_TOKEN_TTL_DAYS * 86400 * 1000);

    // ---------- QUALIFY ----------
    if (action === 'qualify') {
      const tipo = body.cualificacion_tipo;
      if (!tipo || !['A', 'B', 'C'].includes(tipo)) {
        return NextResponse.json(
          { success: false, error: 'cualificacion_tipo debe ser A, B o C' },
          { status: 400 }
        );
      }

      // Genera token UUID v4 desde la BD (sin depender de Node crypto en runtime edge).
      // gen_random_uuid() requiere pgcrypto, ya disponible en proyectos Supabase modernos.
      const { data, error } = await supabase
        .from('partner_leads')
        .update({
          access_token: crypto.randomUUID(),
          access_token_expires_at: expiresAt.toISOString(),
          stage: 'cualificado' satisfies PartnerLeadStage,
          cualificacion_tipo: tipo,
          cualificacion_notas: body.cualificacion_notas?.trim() || null,
          cualificado_por_email: adminEmail,
          cualificado_at: now.toISOString(),
        })
        .eq('id', id)
        .select('id, access_token, access_token_expires_at')
        .single();

      if (error) {
        console.error('[partners/qualify] update error:', error);
        return NextResponse.json(handleSupabaseError(error), { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: `Partner cualificado · token válido durante ${ttl}.`,
        data: {
          id: data.id,
          access_token: data.access_token,
          access_token_expires_at: data.access_token_expires_at,
          access_url: data.access_token ? buildPartnerAccessUrl(data.access_token) : null,
        },
      });
    }

    // ---------- REJECT ----------
    if (action === 'reject') {
      const { data, error } = await supabase
        .from('partner_leads')
        .update({
          stage: 'rechazado' satisfies PartnerLeadStage,
          cualificacion_notas: body.cualificacion_notas?.trim() || null,
          cualificado_por_email: adminEmail,
          cualificado_at: now.toISOString(),
          // Invalidamos token si existía
          access_token: null,
          access_token_expires_at: null,
        })
        .eq('id', id)
        .select('id')
        .single();

      if (error) {
        return NextResponse.json(handleSupabaseError(error), { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: 'Partner marcado como rechazado.',
        data: { id: data.id },
      });
    }

    // ---------- REGENERATE TOKEN ----------
    if (action === 'regenerate_token') {
      const { data, error } = await supabase
        .from('partner_leads')
        .update({
          access_token: crypto.randomUUID(),
          access_token_expires_at: expiresAt.toISOString(),
        })
        .eq('id', id)
        .select('id, access_token, access_token_expires_at')
        .single();

      if (error) {
        return NextResponse.json(handleSupabaseError(error), { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: `Token regenerado · válido durante ${ttl}.`,
        data: {
          id: data.id,
          access_token: data.access_token,
          access_token_expires_at: data.access_token_expires_at,
          access_url: data.access_token ? buildPartnerAccessUrl(data.access_token) : null,
        },
      });
    }

    // ---------- SET STAGE ----------
    if (action === 'set_stage') {
      const stage = body.stage;
      if (!stage || !VALID_STAGES.has(stage)) {
        return NextResponse.json(
          { success: false, error: 'stage no válido' },
          { status: 400 }
        );
      }
      const { data, error } = await supabase
        .from('partner_leads')
        .update({ stage })
        .eq('id', id)
        .select('id, stage')
        .single();

      if (error) {
        return NextResponse.json(handleSupabaseError(error), { status: 500 });
      }
      return NextResponse.json({
        success: true,
        message: `Stage actualizado a ${stage}.`,
        data,
      });
    }

    return NextResponse.json(
      { success: false, error: 'action no reconocida' },
      { status: 400 }
    );
  } catch (err) {
    console.error('Error in /api/partners/qualify:', err);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
