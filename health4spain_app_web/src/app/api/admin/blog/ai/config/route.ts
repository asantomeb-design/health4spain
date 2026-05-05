import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, handleSupabaseError } from '@/lib/supabase';
import { validateAdminAuth } from '@/lib/auth';
import { invalidateAiBlogConfigCache } from '@/lib/ai/openai-blog';

const EDITABLE_FIELDS = [
  'enabled',
  'model_proposals',
  'model_writer',
  'model_translator',
  'model_image',
  'temperature_proposals',
  'temperature_writer',
  'temperature_translator',
  'target_word_count',
  'image_size',
  'image_style',
  'news_country',
  'news_language',
  'news_timeframe',
  'editorial_guidelines',
  'proposals_system_prompt',
  'writer_system_prompt',
  'translator_system_prompt',
] as const;

export async function GET(request: NextRequest) {
  const auth = await validateAdminAuth(request);
  if (auth.error) return auth.error;

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from('ai_blog_config').select('*').limit(1).single();

  if (error) {
    return NextResponse.json(handleSupabaseError(error), { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

export async function PUT(request: NextRequest) {
  const auth = await validateAdminAuth(request);
  if (auth.error) return auth.error;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'JSON inválido' },
      { status: 400 }
    );
  }

  const updates: Record<string, unknown> = {};
  for (const key of EDITABLE_FIELDS) {
    if (key in body) updates[key] = body[key];
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { success: false, error: 'No hay campos válidos para actualizar' },
      { status: 400 }
    );
  }

  const supabase = createServerSupabaseClient();

  const { data: current, error: findError } = await supabase
    .from('ai_blog_config')
    .select('id')
    .limit(1)
    .single();

  if (findError || !current) {
    return NextResponse.json(
      { success: false, error: 'Config no encontrada. Ejecuta supabase/15-ai-blog-config.sql' },
      { status: 404 }
    );
  }

  const { data, error } = await supabase
    .from('ai_blog_config')
    .update(updates)
    .eq('id', current.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(handleSupabaseError(error), { status: 500 });
  }

  invalidateAiBlogConfigCache();

  return NextResponse.json({
    success: true,
    data,
    message: 'Configuración actualizada',
  });
}
