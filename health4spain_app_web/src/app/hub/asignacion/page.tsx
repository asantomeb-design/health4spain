'use client';

import { useCallback, useEffect, useState } from 'react';
import { useHubUser } from '@/hooks/useHubUser';
import { formatEuros, HUB_LINEA_ESTADO_LABELS } from '@/lib/hub/commissions';

interface Company { id: string; nombre: string; }
interface Closer { id: string; nombre: string; }
interface Linea {
  id: string;
  periodo: string;
  cliente: string | null;
  producto: string | null;
  poliza: string | null;
  asegurado: string | null;
  comision_bruta: number;
  comision_neta: number | null;
  neto_pagar: number | null;
  estado: string;
  regimen: string | null;
  hub_user_id: string | null;
  hub_users: { nombre: string } | null;
}

export default function AsignacionPage() {
  const { fetchWithAuth, can } = useHubUser();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [closers, setClosers] = useState<Closer[]>([]);
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [companyId, setCompanyId] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [asignadas, setAsignadas] = useState('false');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [closerId, setCloserId] = useState('');
  const [pctReparto, setPctReparto] = useState('100');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchWithAuth('/api/hub/companies').then((r) => r.json()).then((j) => j.success && setCompanies(j.data)).catch(() => {});
    fetchWithAuth('/api/hub/users?rol=closer').then((r) => r.json()).then((j) => j.success && setClosers(j.data)).catch(() => {});
  }, [fetchWithAuth]);

  const loadLineas = useCallback(async () => {
    setLoading(true);
    setSelected(new Set());
    const params = new URLSearchParams();
    if (companyId) params.set('company_id', companyId);
    if (periodo.trim()) params.set('periodo', periodo.trim());
    if (asignadas) params.set('asignadas', asignadas);
    if (q.trim()) params.set('q', q.trim());
    try {
      const res = await fetchWithAuth(`/api/hub/liquidaciones/lineas?${params.toString()}`);
      const json = await res.json();
      if (json.success) setLineas(json.data);
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth, companyId, periodo, asignadas, q]);

  useEffect(() => {
    loadLineas();
  }, [loadLineas]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === lineas.length) setSelected(new Set());
    else setSelected(new Set(lineas.map((l) => l.id)));
  };

  const assign = async () => {
    setMsg('');
    if (!closerId) return setMsg('Selecciona un closer.');
    if (selected.size === 0) return setMsg('Selecciona al menos una línea.');
    setLoading(true);
    try {
      const res = await fetchWithAuth('/api/hub/liquidaciones/assign', {
        method: 'POST',
        body: JSON.stringify({
          linea_ids: Array.from(selected),
          hub_user_id: closerId,
          pct_reparto: Number(pctReparto) || 100,
        }),
      });
      const json = await res.json();
      setMsg(json.message || json.error || '');
      if (json.success) await loadLineas();
    } finally {
      setLoading(false);
    }
  };

  const exportCsv = async () => {
    if (!periodo.trim()) return setMsg('Indica el periodo (MM-YYYY) para exportar.');
    const params = new URLSearchParams({ periodo: periodo.trim() });
    if (companyId) params.set('company_id', companyId);
    const res = await fetchWithAuth(`/api/hub/liquidaciones/export?${params.toString()}`);
    if (!res.ok) {
      const j = await res.json().catch(() => null);
      return setMsg(j?.error || 'No se pudo exportar.');
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `liquidacion_${periodo.trim()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!can('liquidaciones.assign')) {
    return <div className="p-10 text-gray-600">No tienes permiso para asignar líneas.</div>;
  }

  const totalSel = lineas
    .filter((l) => selected.has(l.id))
    .reduce((s, l) => s + (Number(l.comision_bruta) || 0), 0);

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Asignación de comisiones</h1>
        <p className="text-gray-600 mt-2">Asigna cada línea del CSV al closer que cerró la operación.</p>
      </header>

      {/* Filtros */}
      <div className="flex flex-wrap items-end gap-3 mb-5">
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Compañía</label>
          <select value={companyId} onChange={(e) => setCompanyId(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">Todas</option>
            {companies.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Periodo</label>
          <input value={periodo} onChange={(e) => setPeriodo(e.target.value)} placeholder="MM-YYYY" className="px-3 py-2 border border-gray-300 rounded-lg w-32" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Estado</label>
          <select value={asignadas} onChange={(e) => setAsignadas(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
            <option value="false">Sin asignar</option>
            <option value="true">Asignadas</option>
            <option value="">Todas</option>
          </select>
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Buscar</label>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Póliza, cliente, asegurado…" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        {can('liquidaciones.export') && (
          <button onClick={exportCsv} className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
            Exportar CSV
          </button>
        )}
      </div>

      {/* Barra de asignación */}
      <div className="flex flex-wrap items-end gap-3 mb-5 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Closer</label>
          <select value={closerId} onChange={(e) => setCloserId(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">— Selecciona —</option>
            {closers.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">% reparto</label>
          <input value={pctReparto} onChange={(e) => setPctReparto(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg w-24" />
        </div>
        <button onClick={assign} disabled={loading || selected.size === 0} className="px-5 py-2 bg-accent text-white font-medium rounded-lg hover:bg-accent-600 disabled:opacity-50">
          Asignar {selected.size > 0 ? `(${selected.size})` : ''}
        </button>
        {selected.size > 0 && (
          <span className="text-sm text-gray-600">Bruta seleccionada: <strong>{formatEuros(totalSel)}</strong></span>
        )}
        {msg && <span className="text-sm text-gray-700">{msg}</span>}
      </div>

      {/* Tabla */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="p-3 w-10">
                <input type="checkbox" checked={lineas.length > 0 && selected.size === lineas.length} onChange={toggleAll} />
              </th>
              <th className="p-3">Póliza</th>
              <th className="p-3">Cliente / Asegurado</th>
              <th className="p-3">Producto</th>
              <th className="p-3 text-right">Bruta</th>
              <th className="p-3">Closer</th>
              <th className="p-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && <tr><td colSpan={7} className="p-6 text-center text-gray-400">Cargando…</td></tr>}
            {!loading && lineas.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-gray-400">Sin líneas para los filtros seleccionados.</td></tr>}
            {!loading && lineas.map((l) => (
              <tr key={l.id} className={selected.has(l.id) ? 'bg-accent-50' : ''}>
                <td className="p-3"><input type="checkbox" checked={selected.has(l.id)} onChange={() => toggle(l.id)} /></td>
                <td className="p-3 font-mono text-xs">{l.poliza || '—'}</td>
                <td className="p-3">{l.cliente || l.asegurado || '—'}</td>
                <td className="p-3">{l.producto || '—'}</td>
                <td className="p-3 text-right">{formatEuros(Number(l.comision_bruta) || 0)}</td>
                <td className="p-3">{l.hub_users?.nombre || <span className="text-gray-400">sin asignar</span>}</td>
                <td className="p-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100">{HUB_LINEA_ESTADO_LABELS[l.estado] || l.estado}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
