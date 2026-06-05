'use client';

import { useCallback, useEffect, useState } from 'react';
import { useHubUser } from '@/hooks/useHubUser';

interface Stage { id: string; name: string; }
interface Pipeline { id: string; name: string; stages: Stage[]; }
interface GhlUserRow { id: string; nombre: string; email: string | null; rol: string | null; }

export default function IntegracionesPage() {
  const { fetchWithAuth, can } = useHubUser();
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [users, setUsers] = useState<GhlUserRow[]>([]);
  const [pipeErr, setPipeErr] = useState('');
  const [usersErr, setUsersErr] = useState('');
  const [loading, setLoading] = useState(true);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, u] = await Promise.all([
        fetchWithAuth('/api/hub/ghl/pipelines').then((r) => r.json()).catch(() => null),
        fetchWithAuth('/api/hub/ghl/users').then((r) => r.json()).catch(() => null),
      ]);
      if (p?.success) setPipelines(p.data); else setPipeErr(p?.error || 'No se pudo leer pipelines de GHL.');
      if (u?.success) setUsers(u.data); else setUsersErr(u?.error || 'No se pudo leer usuarios de GHL.');
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  useEffect(() => { load(); }, [load]);

  const copy = (t: string) => navigator.clipboard?.writeText(t);

  if (!can('integrations.manage')) {
    return <div className="p-10 text-gray-600">No tienes permiso para gestionar integraciones.</div>;
  }

  const webhookUrl = origin ? `${origin}/api/hub/ghl/webhook?secret=TU_SECRET` : '/api/hub/ghl/webhook?secret=TU_SECRET';

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Integraciones · GoHighLevel</h1>
        <p className="text-gray-600 mt-2">
          Reutiliza el token y la subcuenta ya conectados para los leads. Aquí ves los IDs que hacen
          falta para el mapeo y la URL del webhook entrante.
        </p>
      </header>

      {/* Webhook entrante */}
      <section className="mb-10 border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-bold mb-2">Webhook entrante (GHL → Hub)</h2>
        <p className="text-sm text-gray-600 mb-3">
          Configura en GHL una acción «Webhook» (POST) hacia esta URL cuando cambie el stage de una
          oportunidad. Sustituye <code>TU_SECRET</code> por el valor de <code>GHL_WEBHOOK_SECRET</code>.
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 break-all">{webhookUrl}</code>
          <button onClick={() => copy(webhookUrl)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Copiar</button>
        </div>
      </section>

      {/* Pipelines */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Pipelines y stages</h2>
          <button onClick={load} className="text-sm text-accent hover:underline">Recargar</button>
        </div>
        {loading && <p className="text-gray-400 text-sm">Cargando desde GHL…</p>}
        {pipeErr && <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">{pipeErr}</p>}
        {!loading && !pipeErr && pipelines.map((p) => (
          <div key={p.id} className="border border-gray-200 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">{p.name}</h3>
              <code className="text-xs text-gray-500">{p.id}</code>
            </div>
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-gray-500">
                <tr><th className="py-1">Stage</th><th className="py-1">ID (para el mapeo CVR)</th><th></th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {p.stages.map((s) => (
                  <tr key={s.id}>
                    <td className="py-2">{s.name}</td>
                    <td className="py-2 font-mono text-xs text-gray-600">{s.id}</td>
                    <td className="py-2 text-right"><button onClick={() => copy(s.id)} className="text-xs text-accent hover:underline">copiar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </section>

      {/* Usuarios GHL */}
      <section>
        <h2 className="text-lg font-bold mb-3">Usuarios de GHL (para mapear con closers)</h2>
        {usersErr && <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">{usersErr}</p>}
        {!usersErr && (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
                <tr><th className="p-3">Nombre</th><th className="p-3">Email</th><th className="p-3">Rol GHL</th><th className="p-3">ghl_user_id</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="p-3">{u.nombre}</td>
                    <td className="p-3">{u.email || '—'}</td>
                    <td className="p-3">{u.rol || '—'}</td>
                    <td className="p-3 font-mono text-xs text-gray-600 flex items-center gap-2">
                      {u.id}
                      <button onClick={() => copy(u.id)} className="text-accent hover:underline">copiar</button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && !usersErr && (
                  <tr><td colSpan={4} className="p-6 text-center text-gray-400">Sin usuarios o GHL no configurado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
