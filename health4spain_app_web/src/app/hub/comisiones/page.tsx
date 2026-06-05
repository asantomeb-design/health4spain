'use client';

import { useCallback, useEffect, useState } from 'react';
import { useHubUser } from '@/hooks/useHubUser';
import { formatEuros } from '@/lib/hub/commissions';

interface Linea {
  id: string;
  periodo: string;
  cliente: string | null;
  producto: string | null;
  poliza: string | null;
  comision_bruta: number;
  comision_neta: number | null;
  neto_pagar: number | null;
  estado: string;
  regimen: string | null;
  fecha_cobro_estimada: string | null;
}

// Spec multi-compañía: el closer ve tres bloques de estado
const BLOQUES = [
  { estado: 'consolidandose', titulo: 'Consolidándose', desc: 'Operaciones cerradas pendientes de validar.' },
  { estado: 'acumulado', titulo: 'Acumulado', desc: 'Asignado y pendiente de cobro según régimen.' },
  { estado: 'cobrado', titulo: 'Cobrado', desc: 'La compañía pagó; liquidación cerrada.' },
] as const;

export default function ComisionesPage() {
  const { fetchWithAuth, hubUser } = useHubUser();
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodoJ, setPeriodoJ] = useState('');

  const justificante = async () => {
    if (!periodoJ.trim()) return;
    const res = await fetchWithAuth(`/api/hub/liquidaciones/justificante?periodo=${encodeURIComponent(periodoJ.trim())}`);
    if (!res.ok) return;
    const html = await res.text();
    const blob = new Blob([html], { type: 'text/html' });
    window.open(URL.createObjectURL(blob), '_blank');
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth('/api/hub/liquidaciones/lineas?asignadas=true&limit=2000');
      const json = await res.json();
      if (json.success) setLineas(json.data);
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  useEffect(() => { load(); }, [load]);

  const porEstado = (estado: string) => lineas.filter((l) => l.estado === estado);
  const sumaNeto = (ls: Linea[]) => ls.reduce((s, l) => s + (Number(l.neto_pagar) || 0), 0);

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis comisiones</h1>
          <p className="text-gray-600 mt-2">{hubUser?.nombre} · neto a percibir tras IRPF.</p>
        </div>
        <div className="flex items-end gap-2">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Justificante</label>
            <input value={periodoJ} onChange={(e) => setPeriodoJ(e.target.value)} placeholder="MM-YYYY" className="px-3 py-2 border border-gray-300 rounded-lg w-32" />
          </div>
          <button onClick={justificante} className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
            Generar PDF
          </button>
        </div>
      </header>

      {/* Resumen 3 estados */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {BLOQUES.map((b) => {
          const ls = porEstado(b.estado);
          return (
            <div key={b.estado} className="border border-gray-200 rounded-xl p-6">
              <p className="text-xs uppercase tracking-widest text-gray-500">{b.titulo}</p>
              <p className="text-2xl font-bold mt-2">{formatEuros(sumaNeto(ls))}</p>
              <p className="text-sm text-gray-600 mt-1">{ls.length} línea(s)</p>
              <p className="text-xs text-gray-400 mt-2">{b.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Detalle por bloque */}
      {loading ? (
        <p className="text-gray-400">Cargando…</p>
      ) : (
        BLOQUES.map((b) => {
          const ls = porEstado(b.estado);
          if (ls.length === 0) return null;
          return (
            <section key={b.estado} className="mb-8">
              <h2 className="text-lg font-bold mb-3">{b.titulo}</h2>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="p-3">Periodo</th>
                      <th className="p-3">Póliza</th>
                      <th className="p-3">Cliente</th>
                      <th className="p-3">Producto</th>
                      <th className="p-3">Régimen</th>
                      <th className="p-3">Cobro est.</th>
                      <th className="p-3 text-right">Neto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {ls.map((l) => (
                      <tr key={l.id}>
                        <td className="p-3">{l.periodo}</td>
                        <td className="p-3 font-mono text-xs">{l.poliza || '—'}</td>
                        <td className="p-3">{l.cliente || '—'}</td>
                        <td className="p-3">{l.producto || '—'}</td>
                        <td className="p-3">{l.regimen || '—'}</td>
                        <td className="p-3">{l.fecha_cobro_estimada || '—'}</td>
                        <td className="p-3 text-right font-medium">{formatEuros(Number(l.neto_pagar) || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
