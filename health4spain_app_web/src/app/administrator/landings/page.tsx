'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Landing {
  id: string;
  slug: string;
  servicio_slug: string;
  ciudad_slug: string;
  meta_title: string;
  hero_title: string;
  activo: boolean;
  revisado: boolean;
  generado_por_ia: boolean;
  created_at: string;
  updated_at: string;
}

const servicios = [
  { value: 'abogados', label: 'Abogados' },
  { value: 'seguros', label: 'Seguros' },
  { value: 'inmobiliarias', label: 'Inmobiliarias' },
  { value: 'gestorias', label: 'Gestorías' },
];

export default function LandingsPage() {
  const [landings, setLandings] = useState<Landing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterServicio, setFilterServicio] = useState('');
  const [filterRevisado, setFilterRevisado] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Stats
  const [stats, setStats] = useState({ total: 0, revisadas: 0, activas: 0 });

  useEffect(() => {
    fetchLandings();
    fetchStats();
  }, [filterServicio, filterRevisado]);

  const fetchStats = async () => {
    const { count: total } = await supabase.from('landing_pages').select('*', { count: 'exact', head: true });
    const { count: revisadas } = await supabase.from('landing_pages').select('*', { count: 'exact', head: true }).eq('revisado', true);
    const { count: activas } = await supabase.from('landing_pages').select('*', { count: 'exact', head: true }).eq('activo', true);
    setStats({ total: total || 0, revisadas: revisadas || 0, activas: activas || 0 });
  };

  const fetchLandings = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('landing_pages')
        .select('id, slug, servicio_slug, ciudad_slug, meta_title, hero_title, activo, revisado, generado_por_ia, created_at, updated_at')
        .order('slug', { ascending: true });

      if (filterServicio) query = query.eq('servicio_slug', filterServicio);
      if (filterRevisado === 'true') query = query.eq('revisado', true);
      if (filterRevisado === 'false') query = query.eq('revisado', false);

      const { data, error } = await query;

      if (error) throw error;
      setLandings(data || []);
    } catch (error) {
      console.error('Error fetching landings:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRevisado = async (slug: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('landing_pages')
        .update({ revisado: !currentValue, updated_at: new Date().toISOString() })
        .eq('slug', slug);

      if (error) throw error;

      setLandings(landings.map(l => l.slug === slug ? { ...l, revisado: !currentValue } : l));
      fetchStats();
    } catch (error) {
      console.error('Error updating:', error);
    }
  };

  const toggleActivo = async (slug: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('landing_pages')
        .update({ activo: !currentValue, updated_at: new Date().toISOString() })
        .eq('slug', slug);

      if (error) throw error;

      setLandings(landings.map(l => l.slug === slug ? { ...l, activo: !currentValue } : l));
      fetchStats();
    } catch (error) {
      console.error('Error updating:', error);
    }
  };

  const filteredLandings = landings.filter(landing => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      landing.slug.toLowerCase().includes(term) ||
      landing.ciudad_slug.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Landing Pages</h1>
        <p className="text-gray-500 mt-1">Gestiona las 76 landing pages generadas por IA (4 servicios × 19 ciudades)</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">Total Landings</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">Revisadas</p>
          <p className="text-2xl font-bold text-green-600">{stats.revisadas}</p>
          <p className="text-xs text-gray-400">{stats.total > 0 ? Math.round((stats.revisadas / stats.total) * 100) : 0}% completado</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">Activas</p>
          <p className="text-2xl font-bold text-blue-600">{stats.activas}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Buscar por slug o ciudad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[accent] focus:border-transparent outline-none"
          />
          <select
            value={filterServicio}
            onChange={(e) => setFilterServicio(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[accent] focus:border-transparent outline-none"
          >
            <option value="">Todos los servicios</option>
            {servicios.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <select
            value={filterRevisado}
            onChange={(e) => setFilterRevisado(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[accent] focus:border-transparent outline-none"
          >
            <option value="">Todas</option>
            <option value="true">Solo revisadas</option>
            <option value="false">Pendientes de revisión</option>
          </select>
          <button
            onClick={() => { setFilterServicio(''); setFilterRevisado(''); setSearchTerm(''); }}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Servicio</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ciudad</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Revisado</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Activo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    <div className="w-6 h-6 border-2 border-[accent] border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : filteredLandings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    No hay landings. Ejecuta el script de generación.
                  </td>
                </tr>
              ) : (
                filteredLandings.map((landing) => (
                  <tr key={landing.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 font-mono">{landing.slug}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 capitalize">{landing.servicio_slug}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 capitalize">{landing.ciudad_slug}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-xs">{landing.hero_title || landing.meta_title}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleRevisado(landing.slug, landing.revisado)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                          landing.revisado
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-green-400'
                        }`}
                      >
                        {landing.revisado && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleActivo(landing.slug, landing.activo)}
                        className={`relative w-10 h-5 rounded-full transition ${
                          landing.activo ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                            landing.activo ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/es/servicios/${landing.slug}`}
                          target="_blank"
                          className="text-accent hover:text-accent-600 text-sm font-medium"
                        >
                          Ver
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Count */}
        <div className="px-4 py-3 border-t text-sm text-gray-500">
          Mostrando {filteredLandings.length} de {stats.total} landings
        </div>
      </div>
    </div>
  );
}
