import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { createGHLContact } from '@/lib/gohighlevel';

interface HandoffBody {
  nombre?: string;
  telefono?: string;
  codigo_pais?: string;
  email?: string;
  tags?: string[];
  lang?: string;
  session_id?: string;
  /** Resumen de la conversación para el asesor (opcional). */
  transcript?: string;
}

const TAG_REGEX = /^[a-z0-9-]{1,40}$/;

function sanitizeTags(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const t of raw) {
    const clean = String(t || '').trim().toLowerCase();
    if (TAG_REGEX.test(clean) && !out.includes(clean)) out.push(clean);
    if (out.length >= 20) break;
  }
  return out;
}

// POST /api/chat/handoff — el visitante pide hablar con una persona desde Mar-IA.
// Crea/actualiza el contacto en GHL con las etiquetas acumuladas + bot-handoff-humano
// (un workflow de GHL hace el round-robin y asigna el closer).
export async function POST(request: NextRequest) {
  try {
    const body: HandoffBody = await request.json();

    const nombre = (body.nombre || '').trim();
    const telefono = (body.telefono || '').trim();
    const email = (body.email || '').trim();

    if (!nombre) {
      return NextResponse.json(
        { success: false, error: 'El nombre es obligatorio' },
        { status: 400 }
      );
    }
    if (!telefono && !email) {
      return NextResponse.json(
        { success: false, error: 'Indica un teléfono/WhatsApp o un email' },
        { status: 400 }
      );
    }
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { success: false, error: 'Email no válido' },
          { status: 400 }
        );
      }
    }

    const idioma = (body.lang || 'es').trim();
    const tags = sanitizeTags(body.tags);
    const extraTags = ['origen-chat', 'bot-handoff-humano', ...tags];

    const mensaje = (body.transcript || '').slice(0, 1500) || 'Solicitud de contacto desde el chat de Mar-IA.';

    // GHL nunca debe romper la respuesta al usuario: se ejecuta sin bloquear.
    createGHLContact(
      {
        nombre,
        email: email || undefined,
        telefono,
        codigo_pais: body.codigo_pais?.trim() || undefined,
        idioma_preferido: idioma,
        mensaje,
        landing_page: 'chat-maria',
        utm_source: 'chat',
        utm_medium: 'maria',
      },
      null,
      extraTags
    ).catch((err) => console.error('[GHL] Error en handoff de chat:', err));

    // Dejar rastro en el historial de chat (no bloquea).
    if (body.session_id) {
      const supabase = createServerSupabaseClient();
      supabase
        .from('chat_messages')
        .insert({
          session_id: body.session_id,
          user_message: '[HANDOFF] Solicita hablar con un asesor',
          assistant_message: `Contacto: ${nombre} · ${telefono || email} · tags: ${extraTags.join(', ')}`,
          lang: idioma,
          model: 'handoff',
        })
        .then(({ error }) => {
          if (error) console.error('[Handoff] Error registrando en chat_messages:', error.message);
        });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Handoff API error:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
