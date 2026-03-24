'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Stats {
  totalLeads: number;
  leadsThisMonth: number;
  leadsByService: { servicio: string; count: number }[];
  leadsByCity: { ciudad: string; count: number }[];
  leadsByStatus: { status: string; count: number }[];
  recentLeads: any[];
  totalPosts: number;
  publishedPosts: number;
  totalLandings: number;
  reviewedLandings: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Total leads
      const { count: totalLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true });

      // Leads este mes
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { count: leadsThisMonth } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

      // Leads por servicio
      const { data: leadsByServiceData } = await supabase
        .from('leads')
        .select('servicio');
      
      const serviceCounts: Record<string, number> = {};
      leadsByServiceData?.forEach(l => {
        serviceCounts[l.servicio] = (serviceCounts[l.servicio] || 0) + 1;
      });
      const leadsByService = Object.entries(serviceCounts)
        .map(([servicio, count]) => ({ servicio, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Leads por ciudad
      const { data: leadsByCityData } = await supabase
        .from('leads')
        .select('ciudad');
      
      const cityCounts: Record<string, number> = {};
      leadsByCityData?.forEach(l => {
        cityCounts[l.ciudad] = (cityCounts[l.ciudad] || 0) + 1;
      });
      const leadsByCity = Object.entries(cityCounts)
        .map(([ciudad, count]) => ({ ciudad, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Leads por status
      const { data: leadsByStatusData } = await supabase
        .from('leads')
        .select('status');
      
      const statusCounts: Record<string, number> = {};
      leadsByStatusData?.forEach(l => {
        statusCounts[l.status] = (statusCounts[l.status] || 0) + 1;
      });
      const leadsByStatus = Object.entries(statusCounts)
        .map(([status, count]) => ({ status, count }));

      // Últimos leads
      const { data: recentLeads } = await supabase
        .from('leads')
        .select('id, nombre, email, servicio, ciudad, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5);

      // Posts del blog
      const { count: totalPosts } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true });

      const { count: publishedPosts } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

      // Landings
      const { count: totalLandings } = await supabase
        .from('landing_pages')
        .select('*', { count: 'exact', head: true });

      const { count: reviewedLandings } = await supabase
        .from('landing_pages')
        .select('*', { count: 'exact', head: true })
        .eq('revisado', true);

      setStats({
        totalLeads: totalLeads || 0,
        leadsThisMonth: leadsThisMonth || 0,
        leadsByService,
        leadsByCity,
        leadsByStatus,
        recentLeads: recentLeads || [],
        totalPosts: totalPosts || 0,
        publishedPosts: publishedPosts || 0,
        totalLandings: totalLandings || 0,
        reviewedLandings: reviewedLandings || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statusLabels: Record<string, string> = {
    nuevo: 'Nuevos',
    contactado: 'Contactados',
    cualificado: 'Cualificados',
    asignado: 'Asignados',
    convertido: 'Convertidos',
    perdido: 'Perdidos',
  };

  const statusColors: Record<string, string> = {
    nuevo: 'bg-blue-100 text-blue-800',
    contactado: 'bg-yellow-100 text-yellow-800',
    cualificado: 'bg-purple-100 text-purple-800',
    asignado: 'bg-indigo-100 text-indigo-800',
    convertido: 'bg-green-100 text-green-800',
    perdido: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="p-8">
      {/* Header Minimal */}
      <div className="mb-16 pb-8 border-b border-gray-200">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Dashboard</h1>
        <p className="text-lg text-gray-600">Resumen general de Health4Spain</p>
      </div>

      {/* Stats Cards - Minimal Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="border-t-3 border-accent pt-6">
          <p className="text-xs uppercase tracking-widest text-gray-600 mb-2">Total Leads</p>
          <p className="text-4xl font-bold">{stats?.totalLeads}</p>
        </div>
        <div className="border-t-3 border-accent pt-6">
          <p className="text-xs uppercase tracking-widest text-gray-600 mb-2">Leads Este Mes</p>
          <p className="text-4xl font-bold">{stats?.leadsThisMonth}</p>
        </div>
        <div className="border-t-3 border-accent pt-6">
          <p className="text-xs uppercase tracking-widest text-gray-600 mb-2">Posts Publicados</p>
          <p className="text-4xl font-bold">
            {stats?.publishedPosts} <span className="text-xl text-gray-400">/ {stats?.totalPosts}</span>
          </p>
        </div>
        <div className="border-t-3 border-accent pt-6">
          <p className="text-xs uppercase tracking-widest text-gray-600 mb-2">Landings Revisadas</p>
          <p className="text-4xl font-bold">
            {stats?.reviewedLandings} <span className="text-xl text-gray-400">/ {stats?.totalLandings}</span>
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Por Servicio */}
        <div className="bg-gray-50 p-8 border border-gray-200">
          <h3 className="text-xl font-bold mb-6">Leads por Servicio</h3>
          <div className="space-y-4">
            {stats?.leadsByService.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-sm font-medium capitalize">{item.servicio}</span>
                <span className="text-2xl font-bold">{item.count}</span>
              </div>
            ))}
            {stats?.leadsByService.length === 0 && (
              <p className="text-sm text-gray-400">Sin datos</p>
            )}
          </div>
        </div>

        {/* Por Ciudad */}
        <div className="bg-gray-50 p-8 border border-gray-200">
          <h3 className="text-xl font-bold mb-6">Leads por Ciudad</h3>
          <div className="space-y-4">
            {stats?.leadsByCity.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-sm font-medium capitalize">{item.ciudad}</span>
                <span className="text-2xl font-bold">{item.count}</span>
              </div>
            ))}
            {stats?.leadsByCity.length === 0 && (
              <p className="text-sm text-gray-400">Sin datos</p>
            )}
          </div>
        </div>

        {/* Por Status */}
        <div className="bg-gray-50 p-8 border border-gray-200">
          <h3 className="text-xl font-bold mb-6">Estado de Leads</h3>
          <div className="space-y-4">
            {stats?.leadsByStatus.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-sm font-medium">
                  {statusLabels[item.status] || item.status}
                </span>
                <span className="text-2xl font-bold">{item.count}</span>
              </div>
            ))}
            {stats?.leadsByStatus.length === 0 && (
              <p className="text-sm text-gray-400">Sin datos</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-white border border-gray-200">
        <div className="p-8 border-b border-gray-200">
          <h3 className="text-2xl font-bold">Últimos Leads</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">Nombre</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">Servicio</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">Ciudad</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold">{lead.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{lead.email}</td>
                  <td className="px-6 py-4 text-sm capitalize">{lead.servicio}</td>
                  <td className="px-6 py-4 text-sm capitalize">{lead.ciudad}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2 py-1 bg-gray-100 uppercase tracking-wider">
                      {statusLabels[lead.status] || lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(lead.created_at).toLocaleDateString('es-ES')}
                  </td>
                </tr>
              ))}
              {stats?.recentLeads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    No hay leads todavía
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
