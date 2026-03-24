import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Valida autenticación de admin usando Supabase Auth
 * Lee el token JWT del header Authorization: Bearer <token>
 * 
 * Uso en APIs:
 * const authResult = await validateAdminAuth(request);
 * if (authResult.error) return authResult.error;
 * // authResult.user contiene el usuario autenticado
 */

interface AuthResult {
  user: {
    id: string;
    email: string;
  } | null;
  error: NextResponse | null;
}

// Lista de emails admin
const getAdminEmails = (): string[] => {
  const emails = process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
  return emails.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
};

const isAdminEmail = (email: string | undefined): boolean => {
  if (!email) return false;
  
  const adminEmails = getAdminEmails();
  
  // Si no hay emails configurados, denegar por seguridad en producción
  if (adminEmails.length === 0) {
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ ADMIN_EMAILS no configurado - acceso denegado');
      return false;
    }
    console.warn('⚠️ ADMIN_EMAILS no configurado - permitiendo en desarrollo');
    return true;
  }
  
  return adminEmails.includes(email.toLowerCase());
};

export async function validateAdminAuth(request: NextRequest): Promise<AuthResult> {
  const authHeader = request.headers.get('Authorization');
  
  // Verificar que hay header de autorización
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      user: null,
      error: NextResponse.json(
        { success: false, error: 'Token de autenticación requerido' },
        { status: 401 }
      ),
    };
  }
  
  const token = authHeader.slice(7); // Quitar "Bearer "
  
  try {
    // Crear cliente de Supabase con service role para verificar el token
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    
    // Verificar el token JWT
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return {
        user: null,
        error: NextResponse.json(
          { success: false, error: 'Token inválido o expirado' },
          { status: 401 }
        ),
      };
    }
    
    // Verificar que es admin
    if (!isAdminEmail(user.email)) {
      return {
        user: null,
        error: NextResponse.json(
          { success: false, error: 'No tienes permisos de administrador' },
          { status: 403 }
        ),
      };
    }
    
    return {
      user: {
        id: user.id,
        email: user.email!,
      },
      error: null,
    };
    
  } catch (err) {
    console.error('Error validating auth:', err);
    return {
      user: null,
      error: NextResponse.json(
        { success: false, error: 'Error de autenticación' },
        { status: 500 }
      ),
    };
  }
}

/**
 * Helper para verificar si la request es pública (GET sin auth)
 */
export function isPublicRequest(request: NextRequest): boolean {
  return request.method === 'GET' && !request.headers.get('Authorization');
}
