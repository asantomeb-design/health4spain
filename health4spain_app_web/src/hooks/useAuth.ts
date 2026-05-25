'use client';

import { useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
}

async function checkAdminViaApi(token: string): Promise<boolean> {
  try {
    const res = await fetch('/api/admin/check', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return false;
    const json = await res.json();
    return json?.is_admin === true;
  } catch {
    return false;
  }
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

        if (!session?.access_token) {
          setState({
            user: null,
            session: null,
            isAdmin: false,
            isLoading: false,
          });
          return;
        }

        checkAdminViaApi(session.access_token).then((isAdmin) => {
          if (!mounted) return;
          setState({
            user: session.user,
            session,
            isAdmin,
            isLoading: false,
          });
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
      async (_event, session) => {
        if (!mounted) return;

        if (!session?.access_token) {
          setState({
            user: null,
            session: null,
            isAdmin: false,
            isLoading: false,
          });
          return;
        }

        setState((prev) => ({ ...prev, isLoading: true }));

        const isAdmin = await checkAdminViaApi(session.access_token);

        if (!mounted) return;
        setState({
          user: session.user,
          session,
          isAdmin,
          isLoading: false,
        });
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

    const token = data.session?.access_token;
    const isAdmin = token ? await checkAdminViaApi(token) : false;

    if (!isAdmin) {
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
