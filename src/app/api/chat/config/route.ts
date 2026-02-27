import { createServerSupabaseClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export const revalidate = 60;

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('chatbot_config')
      .select('enabled, agent_name, agent_avatar, primary_color, welcome_message, suggested_questions')
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { enabled: false, agent_name: 'Asistente', agent_avatar: '🏥', primary_color: '#293f92', welcome_message: {}, suggested_questions: {} },
        { status: 200 }
      );
    }

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
    });
  } catch (error) {
    console.error('Chat config API error:', error);
    return NextResponse.json(
      { enabled: false, agent_name: 'Asistente', agent_avatar: '🏥', primary_color: '#293f92', welcome_message: {}, suggested_questions: {} },
      { status: 200 }
    );
  }
}
