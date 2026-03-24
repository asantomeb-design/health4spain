import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Cliente para el navegador (público, con auth)
// Solo crear cliente si las variables están disponibles
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

// Cliente para el servidor (con service role key - BYPASSA RLS)
export const createServerSupabaseClient = (): SupabaseClient => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Cliente admin para el navegador (usa service role via API route)
// NOTA: Para operaciones admin desde el frontend, usamos el cliente normal
// pero las tablas deben tener RLS configurado correctamente, o usar APIs

// Helper para manejar errores de Supabase
export const handleSupabaseError = (error: { message?: string; code?: string }) => {
  console.error('Supabase error:', error);
  return {
    success: false,
    error: error.message || 'Error de base de datos',
    code: error.code,
  };
};

// Lista de emails de administradores autorizados
export const getAdminEmails = (): string[] => {
  const emails = process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
  return emails.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
};

// Verificar si un email es admin
export const isAdminEmail = (email: string | undefined): boolean => {
  if (!email) return false;
  
  const adminEmails = getAdminEmails();
  
  // Si no hay emails configurados, permitir cualquiera (desarrollo)
  if (adminEmails.length === 0) {
    console.warn('⚠️ ADMIN_EMAILS no configurado - cualquier usuario puede acceder al admin');
    return true;
  }
  
  return adminEmails.includes(email.toLowerCase());
};

// Crear cliente con sesión del usuario actual
export const createAuthenticatedClient = async (): Promise<SupabaseClient | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return null;
  }
  
  // El cliente ya está autenticado con la sesión
  return supabase;
};
