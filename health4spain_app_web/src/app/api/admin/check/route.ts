import { NextRequest, NextResponse } from 'next/server';
import { validateAdminAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const authResult = await validateAdminAuth(request);
  if (authResult.error) return authResult.error;

  return NextResponse.json({
    success: true,
    is_admin: true,
    user: authResult.user,
  });
}
