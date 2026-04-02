import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, handleSupabaseError } from '@/lib/supabase';
import { validateAdminAuth } from '@/lib/auth';
import { Lead } from '@/lib/types';
import { buildGhlWebhookSpanishFields } from '@/lib/ghl-spanish-labels';
import { createGHLContact, sendLeadToGHLIncomingWebhook } from '@/lib/gohighlevel';

// POST /api/leads - Crear nuevo lead (endpoint público)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validación básica (ciudad puede venir como ciudad_interes en LandingFormEmbed)
    const ciudad = body.ciudad || body.ciudad_interes;
    const requiredFields = ['nombre', 'email', 'telefono', 'servicio'];
    const missingFields = requiredFields.filter(field => !body[field]);
    if (!ciudad) missingFields.push('ciudad');
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Faltan campos requeridos: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const servicioNorm = String(body.servicio ?? '').trim();
    const ciudadNorm = String(ciudad ?? '').trim();
    if (!servicioNorm || !ciudadNorm) {
      return NextResponse.json(
        { success: false, error: 'Servicio o ciudad no válidos' },
        { status: 400 }
      );
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Email no válido' },
        { status: 400 }
      );
    }
    
    const supabase = createServerSupabaseClient();
    
    // Verificar si ya existe un lead reciente con este email + servicio (anti-spam)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id')
      .eq('email', body.email)
      .eq('servicio', servicioNorm)
      .gte('created_at', oneHourAgo)
      .single();
    
    if (existingLead) {
      return NextResponse.json(
        { success: false, error: 'Ya recibimos tu solicitud. Te contactaremos pronto.' },
        { status: 409 }
      );
    }
    
    // Usar score del frontend o calcular
    const score = body.score || calculateLeadScore(body);
    
    // Teléfono: si hay codigo_pais, guardar solo el número; si no, formato legacy (completo)
    const telefonoValor = body.codigo_pais
      ? (body.telefono || '').replace(/\D/g, '').trim()
      : (body.telefono || '').trim();

    // Crear lead
    const urgenciaNorm = String(body.urgencia ?? '').trim();
    const newLead: Partial<Lead> = {
      nombre: body.nombre.trim(),
      email: body.email.toLowerCase().trim(),
      codigo_pais: body.codigo_pais || undefined,
      telefono: telefonoValor,
      fecha_nacimiento: body.fecha_nacimiento || undefined,
      servicio: servicioNorm,
      ciudad: ciudadNorm,
      pais_origen: body.pais_origen || undefined,
      ciudad_origen: body.ciudad_origen || undefined,
      presupuesto: body.presupuesto || undefined,
      urgencia: urgenciaNorm || 'no_especificado',
      idioma_preferido: body.idioma_preferido || 'es',
      mensaje: body.mensaje?.trim() || undefined,
      landing_page: body.landing_page || '',
      utm_source: body.utm_source || undefined,
      utm_medium: body.utm_medium || undefined,
      utm_campaign: body.utm_campaign || undefined,
      dispositivo: body.dispositivo || undefined,
      status: 'nuevo',
      score,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from('leads')
      .insert(newLead)
      .select()
      .single();
    
    if (error) {
      return NextResponse.json(handleSupabaseError(error), { status: 500 });
    }
    
    const ciudadServicioNombre =
      typeof body.ciudad_servicio_espana_nombre === 'string'
        ? body.ciudad_servicio_espana_nombre.trim()
        : '';

    const leadRow = data as Lead;
    const ghlExtras = {
      ciudadServicioNombre: ciudadServicioNombre || undefined,
    };

    // GHL: una sola derivación ES (slugs → etiquetas `request` español) para API + webhook; no bloquea el 201.
    buildGhlWebhookSpanishFields(leadRow, ghlExtras)
      .then((ghlSpanish) =>
        Promise.all([
          createGHLContact(
            {
              nombre: data.nombre,
              email: data.email,
              telefono: data.telefono,
              codigo_pais: data.codigo_pais,
              ciudad: data.ciudad,
              ciudad_origen: data.ciudad_origen,
              pais_origen: data.pais_origen,
              fecha_nacimiento: data.fecha_nacimiento,
              servicio: data.servicio,
              presupuesto: data.presupuesto,
              urgencia: data.urgencia,
              idioma_preferido: data.idioma_preferido,
              mensaje: data.mensaje,
              landing_page: data.landing_page,
              utm_source: data.utm_source,
              utm_medium: data.utm_medium,
              utm_campaign: data.utm_campaign,
              score: data.score,
            },
            ghlSpanish
          ),
          sendLeadToGHLIncomingWebhook(leadRow, {
            ...ghlExtras,
            spanishFields: ghlSpanish,
          }),
        ])
      )
      .catch((err) => console.error('[GHL] Error preparando/enviando lead:', err));
    
    return NextResponse.json({
      success: true,
      message: 'Solicitud recibida. Te contactaremos en menos de 24 horas.',
      data: { id: data.id }, // Solo devolvemos el ID por privacidad
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// GET /api/leads - Listar leads (requiere Supabase Auth admin)
export async function GET(request: NextRequest) {
  try {
    // Validar autenticación admin
    const authResult = await validateAdminAuth(request);
    if (authResult.error) return authResult.error;
    
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const per_page = parseInt(searchParams.get('per_page') || '20');
    const status = searchParams.get('status');
    const servicio = searchParams.get('servicio');
    const ciudad = searchParams.get('ciudad');
    const search = searchParams.get('search');
    
    const supabase = createServerSupabaseClient();
    
    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });
    
    if (status) query = query.eq('status', status);
    if (servicio) query = query.eq('servicio', servicio);
    if (ciudad) query = query.eq('ciudad', ciudad);
    if (search) {
      query = query.or(`nombre.ilike.%${search}%,email.ilike.%${search}%,telefono.ilike.%${search}%`);
    }
    
    const from = (page - 1) * per_page;
    const to = from + per_page - 1;
    query = query.range(from, to);
    
    const { data, error, count } = await query;
    
    if (error) {
      return NextResponse.json(handleSupabaseError(error), { status: 500 });
    }
    
    return NextResponse.json({
      data: data || [],
      total: count || 0,
      page,
      per_page,
      total_pages: Math.ceil((count || 0) / per_page),
    });
    
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Función para calcular score del lead (1-100)
function calculateLeadScore(lead: Record<string, unknown>): number {
  let score = 50; // Base
  
  // Presupuesto
  const presupuesto = lead.presupuesto as string;
  if (presupuesto === 'mas-30000') score += 50;
  else if (presupuesto === '15000-30000') score += 35;
  else if (presupuesto === '5000-15000') score += 20;
  else if (presupuesto === 'menos-5000') score += 10;
  else if (presupuesto === 'no-seguro') score += 15;
  
  // Urgencia
  const urgencia = lead.urgencia as string;
  if (urgencia === 'esta-semana') score += 30;
  else if (urgencia === 'este-mes') score += 20;
  else if (urgencia === 'proximo-trimestre') score += 10;
  else if (urgencia === 'solo-informacion') score += 5;
  
  // Teléfono válido
  const telefono = lead.telefono as string;
  if (telefono && telefono.length >= 9) score += 5;
  
  // Mensaje detallado
  const mensaje = lead.mensaje as string;
  if (mensaje && mensaje.length > 50) score += 5;
  
  // Servicio de alto valor
  const highValueServices = ['seguros', 'abogados', 'inmobiliarias'];
  if (highValueServices.includes(lead.servicio as string)) score += 10;
  
  // Ciudad específica (no "otra")
  if (lead.ciudad && lead.ciudad !== 'otra') score += 5;
  
  return Math.min(100, Math.max(1, score));
}
