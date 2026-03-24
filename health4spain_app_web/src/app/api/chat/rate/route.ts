import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

const VALID_RATINGS = ['correcta', 'mejorable', 'erronea'] as const;

export async function PATCH(request: NextRequest) {
  try {
    const { id, rating } = await request.json();

    if (!id || !rating) {
      return NextResponse.json({ error: 'id and rating are required' }, { status: 400 });
    }

    if (!VALID_RATINGS.includes(rating)) {
      return NextResponse.json({ error: 'rating must be: correcta, mejorable, or erronea' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    const { error } = await supabase
      .from('chat_messages')
      .update({ rating, rated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
