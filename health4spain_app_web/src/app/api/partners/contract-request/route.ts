import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, handleSupabaseError } from '@/lib/supabase';
import { tierForCity, PARTNER_PLANS, PARTNER_SERVICES } from '@/lib/partners';
import type { PartnerLead, PartnerPlan, PartnerTier, PartnerLeadStage } from '@/lib/types';

// =============================================
// /api/partners/contract-request
// ---------------------------------------------
//  POST · público (con token) → registra la selección del partner cuando
//                               pulsa "Solicitar contrato Founding" en Acceso 2.
//
// Body:
//  {
//     token: string,
//     plan: 'ACTIVA'|'CRECE'|'ESCALA'|'LIDERA',
//     verticales: string[],          // primera = vertical principal
//     zonas_adicionales?: string[],  // solo si plan >= ESCALA
//     founding?: boolean,
//     notes?: string
//  }
//
// Efecto: actualiza `partner_leads` con la selección y mueve el stage a
//         'contrato_solicitado'. El closer recibe la notificación vía
//         /administrator/partners y prepara el pack legal manualmente.
// =============================================

const VALID_PLANS = new Set<PartnerPlan>(PARTNER_PLANS);
const VALID_VERTICALES = new Set<string>(PARTNER_SERVICES);

const VALID_STAGES_FOR_CONTRACT: ReadonlySet<PartnerLeadStage> = new Set([
  'cualificado',
  'contrato_solicitado',
]);

interface Body {
  token?: string;
  plan?: PartnerPlan;
  verticales?: string[];
  zonas_adicionales?: string[];
  founding?: boolean;
  notes?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Body;
    const token = (body.token || '').trim();
    const plan = body.plan;
    const verticalesInput = Array.isArray(body.verticales) ? body.verticales : [];

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Falta token de acceso' },
        { status: 401 }
      );
    }
    if (!plan || !VALID_PLANS.has(plan)) {
      return NextResponse.json(
        { success: false, error: 'Plan no válido' },
        { status: 400 }
      );
    }
    const verticales = verticalesInput
      .map((v) => String(v).toLowerCase().trim())
      .filter((v) => VALID_VERTICALES.has(v));

    if (verticales.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Debes seleccionar al menos una vertical' },
        { status: 400 }
      );
    }
    if (verticales.length > 4) {
      return NextResponse.json(
        { success: false, error: 'Máximo 4 verticales' },
        { status: 400 }
      );
    }

    const zonasAdicionales = Array.isArray(body.zonas_adicionales)
      ? body.zonas_adicionales
          .map((z) => String(z).toLowerCase().trim())
          .filter(Boolean)
          .slice(0, 99)
      : [];

    // Reglas de coherencia plan ↔ zonas adicionales:
    if (plan === 'ACTIVA' || plan === 'CRECE') {
      if (zonasAdicionales.length > 0) {
        return NextResponse.json(
          { success: false, error: 'Las zonas adicionales requieren plan Escala o Lidera' },
          { status: 400 }
        );
      }
    }
    if (plan === 'ESCALA' && zonasAdicionales.length > 2) {
      return NextResponse.json(
        { success: false, error: 'Plan Escala admite hasta 2 zonas adicionales' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();
    const nowIso = new Date().toISOString();

    // Validar token vigente y stage permitido.
    const { data: existing, error: fetchErr } = await supabase
      .from('partner_leads')
      .select('id, stage, ciudad_principal, access_token_expires_at')
      .eq('access_token', token)
      .maybeSingle();

    if (fetchErr) {
      console.error('[partners/contract-request] fetch error:', fetchErr);
      return NextResponse.json(handleSupabaseError(fetchErr), { status: 500 });
    }
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Enlace inválido o caducado.' },
        { status: 401 }
      );
    }
    if (
      !existing.access_token_expires_at ||
      new Date(existing.access_token_expires_at).getTime() <= Date.now()
    ) {
      return NextResponse.json(
        { success: false, error: 'Enlace caducado. Solicita uno nuevo al equipo H4S.' },
        { status: 401 }
      );
    }
    if (!VALID_STAGES_FOR_CONTRACT.has(existing.stage as PartnerLeadStage)) {
      return NextResponse.json(
        { success: false, error: 'Tu solicitud no está en un estado que permita contratar.' },
        { status: 409 }
      );
    }

    const tier: PartnerTier = tierForCity(existing.ciudad_principal);

    const updates: Partial<PartnerLead> = {
      stage: 'contrato_solicitado',
      contract_plan: plan,
      contract_tier: tier,
      contract_verticales: verticales,
      contract_zonas_adicionales: zonasAdicionales,
      contract_founding: Boolean(body.founding),
      contract_notes: typeof body.notes === 'string' ? body.notes.trim().slice(0, 2000) : null,
      contract_requested_at: nowIso,
    };

    const { data, error } = await supabase
      .from('partner_leads')
      .update(updates)
      .eq('id', existing.id)
      .select('id, contract_plan, contract_tier, contract_verticales, contract_founding')
      .single();

    if (error) {
      console.error('[partners/contract-request] update error:', error);
      return NextResponse.json(handleSupabaseError(error), { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message:
        'Solicitud de contrato registrada. El equipo H4S preparará el pack legal y te lo enviará en menos de 48 horas hábiles.',
      data,
    });
  } catch (err) {
    console.error('Error in /api/partners/contract-request:', err);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
