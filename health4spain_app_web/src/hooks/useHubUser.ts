'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { HubRole, HubCanal } from '@/lib/types';
import type { HubCapability } from '@/lib/hub/permissions';

export interface HubMe {
  id: string;
  nombre: string;
  email: string;
  rol: HubRole;
  rol_label: string;
  canal: HubCanal;
  supervisor_id: string | null;
  productos_asignados: string[];
  capabilities: HubCapability[];
}

interface HubAuthState {
  hubUser: HubMe | null;
  isLoading: boolean;
}

async function fetchHubMe(token: string): Promise<HubMe | null> {
  try {
    const res = await fetch('/api/hub/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.success ? (json.data as HubMe) : null;
  } catch {
    return null;
  }
}

export function useHubUser() {
  const [state, setState] = useState<HubAuthState>({ hubUser: null, isLoading: true });

  useEffect(() => {
    let mounted = true;
    const timeout = setTimeout(() => {
      if (mounted) setState({ hubUser: null, isLoading: false });
    }, 6000);

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      clearTimeout(timeout);
      if (!mounted) return;
      if (!session?.access_token) {
        setState({ hubUser: null, isLoading: false });
        return;
      }
      const hubUser = await fetchHubMe(session.access_token);
      if (!mounted) return;
      setState({ hubUser, isLoading: false });
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_e, session) => {
      if (!mounted) return;
      if (!session?.access_token) {
        setState({ hubUser: null, isLoading: false });
        return;
      }
      setState((p) => ({ ...p, isLoading: true }));
      const hubUser = await fetchHubMe(session.access_token);
      if (!mounted) return;
      setState({ hubUser, isLoading: false });
    });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const can = useCallback(
    (cap: HubCapability) => state.hubUser?.capabilities.includes(cap) ?? false,
    [state.hubUser]
  );

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const token = data.session?.access_token;
    const hubUser = token ? await fetchHubMe(token) : null;
    if (!hubUser) {
      await supabase.auth.signOut();
      throw new Error('Este usuario no tiene acceso al Hub');
    }
    setState({ hubUser, isLoading: false });
    return hubUser;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setState({ hubUser: null, isLoading: false });
  };

  const fetchWithAuth = useCallback(async (url: string, options: RequestInit = {}) => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) throw new Error('No hay sesión activa');
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }, []);

  return { ...state, can, signIn, signOut, fetchWithAuth };
}
