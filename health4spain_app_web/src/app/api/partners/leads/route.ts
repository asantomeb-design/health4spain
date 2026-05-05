import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, handleSupabaseError } from '@/lib/supabase';
import { validateAdminAuth } from '@/lib/auth';
import { isStrategicCity } from '@/lib/partners';
import type { PartnerLead, PartnerLeadFormPayload } from '@/lib/types';

// =============================================
// /api/partners/leads
// ---------------------------------------------
//  POST  · público   → registra solicitud del formulario Acceso 1
//  GET   · admin     → listado paginado con filtros básicos
//
// En v0 el flujo es manual: NO se dispara webhook GHL al crear un
// partner-lead. Los admins ven los candidatos en /administrator/partners
// y los procesan a mano. Cuando se integre GHL para partners, se añadirá
// aquí (siguiendo el patrón "fire-and-forget en background" de /api/leads).
// =============================================

const VALID_SERVICES = new Set(['seguros', 'abogados', 'inmobiliarias', 'gestorias']);
const VALID_CARTERA = new Set(['menos_10', '10_30', '30_60', 'mas_60']);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function trim(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<PartnerLeadFormPayload>;

    const nombre = trim(body.nombre);
    const empresa = trim(body.empresa);
    const email = trim(body.email).toLowerCase();
    const telefono = trim(body.telefono);
    const servicio = trim(body.servicio);
    const ciudadPrincipal = trim(body.ciudad_principal);

    const missing: string[] = [];
    if (!nombre) missing.push('nombre');
    if (!empresa) missing.push('empresa');
    if (!email) missing.push('email');
    if (!telefono) missing.push('telefono');
    if (!servicio) missing.push('servicio');
    if (!ciudadPrincipal) missing.push('ciudad_principal');

    if (missing.length > 0) {
      return NextResponse.json(
        { success: false, error: `Faltan campos requeridos: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Email no válido' },
        { status: 400 }
      );
    }

    if (!VALID_SERVICES.has(servicio)) {
      return NextResponse.json(
        { success: false, error: 'Servicio no válido' },
        { status: 400 }
      );
    }

    if (!body.privacy_accepted) {
      return NextResponse.json(
        { success: false, error: 'Debes aceptar la política de privacidad' },
        { status: 400 }
      );
    }

    const pctCartera = trim(body.pct_cartera_extranjera) || undefined;
    if (pctCartera && !VALID_CARTERA.has(pctCartera)) {
      return NextResponse.json(
        { success: false, error: 'Valor inválido para % cartera extranjera' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // Anti-duplicado: misma combinación email+servicio en la última hora.
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: existing } = await supabase
      .from('partner_leads')
      .select('id')
      .eq('email', email)
      .eq('servicio', servicio)
      .gte('created_at', oneHourAgo)
      .limit(1)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Ya hemos recibido tu solicitud. Te contactaremos pronto.' },
        { status: 409 }
      );
    }

    const ciudadSlug = ciudadPrincipal.toLowerCase();

    // Idiomas: aceptamos array o string separado por comas/espacios.
    let idiomas: string[] = [];
    if (Array.isArray(body.idiomas)) {
      idiomas = body.idiomas.map((s) => String(s).toLowerCase().trim()).filter(Boolean);
    } else if (typeof body.idiomas === 'string') {
      idiomas = (body.idiomas as string)
        .split(/[,;]/)
        .map((s) => s.toLowerCase().trim())
        .filter(Boolean);
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      null;

    const newLead: Partial<PartnerLead> = {
      nombre,
      empresa,
      email,
      telefono,
      servicio: servicio as PartnerLead['servicio'],
      ciudad_principal: ciudadSlug,
      ciudad_es_estrategica: isStrategicCity(ciudadSlug),
      anos_ejerciendo:
        typeof body.anos_ejerciendo === 'number' && Number.isFinite(body.anos_ejerciendo)
          ? Math.max(0, Math.min(80, Math.round(body.anos_ejerciendo)))
          : null,
      pct_cartera_extranjera: (pctCartera as PartnerLead['pct_cartera_extranjera']) ?? null,
      idiomas,
      about: trim(body.about) || null,
      source: 'web_acceso1',
      landing_page: trim(body.landing_page) || '/es/partners',
      utm_source: trim(body.utm_source) || null,
      utm_medium: trim(body.utm_medium) || null,
      utm_campaign: trim(body.utm_campaign) || null,
      ip_address: ip,
      user_agent: request.headers.get('user-agent') || null,
      stage: 'solicitud_recibida',
      privacy_accepted: true,
      privacy_accepted_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('partner_leads')
      .insert(newLead)
      .select('id')
      .single();

    if (error) {
      console.error('[partner_leads] insert error:', error);
      return NextResponse.json(handleSupabaseError(error), { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Hemos recibido tu solicitud. Te llamamos en menos de 24 horas hábiles.',
        data: { id: data.id },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Error creating partner lead:', err);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await validateAdminAuth(request);
    if (authResult.error) return authResult.error;

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get('per_page') || '20', 10)));
    const stage = searchParams.get('stage');
    const servicio = searchParams.get('servicio');
    const ciudad = searchParams.get('ciudad');
    const search = searchParams.get('search');

    const supabase = createServerSupabaseClient();

    let query = supabase
      .from('partner_leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (stage) query = query.eq('stage', stage);
    if (servicio) query = query.eq('servicio', servicio);
    if (ciudad) query = query.eq('ciudad_principal', ciudad);
    if (search) {
      query = query.or(
        `nombre.ilike.%${search}%,empresa.ilike.%${search}%,email.ilike.%${search}%,telefono.ilike.%${search}%`
      );
    }

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) {
      return NextResponse.json(handleSupabaseError(error), { status: 500 });
    }

    return NextResponse.json({
      data: data || [],
      total: count || 0,
      page,
      per_page: perPage,
      total_pages: Math.ceil((count || 0) / perPage),
    });
  } catch (err) {
    console.error('Error fetching partner leads:', err);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
