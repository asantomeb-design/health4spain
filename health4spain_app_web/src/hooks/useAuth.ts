'use client';

import { useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// Lista de emails admin (desde env pública)
const getAdminEmails = (): string[] => {
  const emails = process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
  return emails.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
};

const isAdminEmail = (email: string | undefined): boolean => {
  if (!email) return false;
  
  const adminEmails = getAdminEmails();
  
  // Si no hay emails configurados, permitir cualquiera (desarrollo)
  if (adminEmails.length === 0) {
    console.warn('⚠️ NEXT_PUBLIC_ADMIN_EMAILS no configurado - cualquier usuario puede acceder al admin');
    return true;
  }
  
  return adminEmails.includes(email.toLowerCase());
};

interface AuthState {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isAdmin: false,
    isLoading: true,
  });

  useEffect(() => {
    let mounted = true;
    
    // Timeout para evitar loading infinito
    const timeout = setTimeout(() => {
      if (mounted) {
        console.error('Auth timeout - no se pudo conectar a Supabase');
        setState({
          user: null,
          session: null,
          isAdmin: false,
          isLoading: false,
        });
      }
    }, 5000); // 5 segundos timeout

    // Obtener sesión actual
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        clearTimeout(timeout);
        if (!mounted) return;
        
        if (error) {
          console.error('Error getting session:', error);
          setState({
            user: null,
            session: null,
            isAdmin: false,
            isLoading: false,
          });
          return;
        }
        
        setState({
          user: session?.user ?? null,
          session,
          isAdmin: isAdminEmail(session?.user?.email),
          isLoading: false,
        });
      })
      .catch((error) => {
        clearTimeout(timeout);
        if (!mounted) return;
        
        console.error('Error in getSession:', error);
        setState({
          user: null,
          session: null,
          isAdmin: false,
          isLoading: false,
        });
      });

    // Escuchar cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) {
          setState({
            user: session?.user ?? null,
            session,
            isAdmin: isAdminEmail(session?.user?.email),
            isLoading: false,
          });
        }
      }
    );

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Verificar si es admin
    if (!isAdminEmail(data.user?.email)) {
      await supabase.auth.signOut();
      throw new Error('No tienes permisos de administrador');
    }
    
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  /**
   * Obtener el token de acceso actual
   * Útil para llamadas a APIs que requieren autenticación
   */
  const getAccessToken = useCallback(async (): Promise<string | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  }, []);

  /**
   * Helper para hacer fetch autenticado a las APIs
   * Añade automáticamente el header Authorization con el token
   */
  const fetchWithAuth = useCallback(async (
    url: string, 
    options: RequestInit = {}
  ): Promise<Response> => {
    const token = await getAccessToken();
    
    if (!token) {
      throw new Error('No hay sesión activa');
    }
    
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }, [getAccessToken]);

  return {
    ...state,
    signIn,
    signOut,
    getAccessToken,
    fetchWithAuth,
  };
}
