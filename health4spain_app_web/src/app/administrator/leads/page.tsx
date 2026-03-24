'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Lead {
  id: string;
  nombre: string;
  email: string;
  codigo_pais?: string;
  telefono: string;
  fecha_nacimiento?: string;
  pais_origen?: string;
  servicio: string;
  ciudad: string;
  urgencia: string;
  mensaje: string | null;
  status: string;
  score: number;
  landing_page: string;
  created_at: string;
}

const statusLabels: Record<string, string> = {
  nuevo: 'Nuevo',
  contactado: 'Contactado',
  cualificado: 'Cualificado',
  asignado: 'Asignado',
  en_proceso: 'En Proceso',
  convertido: 'Convertido',
  perdido: 'Perdido',
  descartado: 'Descartado',
};

const statusColors: Record<string, string> = {
  nuevo: 'bg-blue-100 text-blue-800',
  contactado: 'bg-yellow-100 text-yellow-800',
  cualificado: 'bg-purple-100 text-purple-800',
  asignado: 'bg-indigo-100 text-indigo-800',
  en_proceso: 'bg-cyan-100 text-cyan-800',
  convertido: 'bg-green-100 text-green-800',
  perdido: 'bg-gray-100 text-gray-800',
  descartado: 'bg-gray-100 text-gray-800',
};

const urgencyLabels: Record<string, string> = {
  esta_semana: 'Esta semana',
  este_mes: 'Este mes',
  sin_prisa: 'Sin prisa',
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // Filtros
  const [filterStatus, setFilterStatus] = useState('');
  const [filterServicio, setFilterServicio] = useState('');
  const [filterCiudad, setFilterCiudad] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 20;

  useEffect(() => {
    fetchLeads();
  }, [page, filterStatus, filterServicio, filterCiudad]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('leads')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (filterStatus) query = query.eq('status', filterStatus);
      if (filterServicio) query = query.eq('servicio', filterServicio);
      if (filterCiudad) query = query.eq('ciudad', filterCiudad);

      const from = (page - 1) * perPage;
      const to = from + perPage - 1;
      
      const { data, error, count } = await query.range(from, to);

      if (error) throw error;

      setLeads(data || []);
      setTotalPages(Math.ceil((count || 0) / perPage));
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', leadId);

      if (error) throw error;

      setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
      if (selectedLead?.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const formatTelefono = (lead: Lead) => {
    if (lead.codigo_pais) {
      return `${lead.codigo_pais} ${lead.telefono}`;
    }
    return lead.telefono;
  };

  const filteredLeads = leads.filter(lead => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const telefonoCompleto = formatTelefono(lead);
    return (
      lead.nombre.toLowerCase().includes(term) ||
      lead.email.toLowerCase().includes(term) ||
      telefonoCompleto.includes(term)
    );
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Leads</h1>
        <p className="text-gray-500 mt-1">Gestiona los leads recibidos</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[accent] focus:border-transparent outline-none"
          />
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[accent] focus:border-transparent outline-none"
          >
            <option value="">Todos los estados</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <select
            value={filterServicio}
            onChange={(e) => { setFilterServicio(e.target.value); setPage(1); }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[accent] focus:border-transparent outline-none"
          >
            <option value="">Todos los servicios</option>
            <option value="seguros">Seguros</option>
            <option value="abogados">Abogados</option>
            <option value="inmobiliarias">Inmobiliarias</option>
            <option value="gestorias">Gestorías</option>
          </select>
          <select
            value={filterCiudad}
            onChange={(e) => { setFilterCiudad(e.target.value); setPage(1); }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[accent] focus:border-transparent outline-none"
          >
            <option value="">Todas las ciudades</option>
            <option value="torrevieja">Torrevieja</option>
            <option value="alicante">Alicante</option>
            <option value="murcia">Murcia</option>
            <option value="cartagena">Cartagena</option>
            <option value="orihuela">Orihuela</option>
          </select>
          <button
            onClick={() => { setFilterStatus(''); setFilterServicio(''); setFilterCiudad(''); setSearchTerm(''); setPage(1); }}
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contacto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Servicio</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ciudad</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Urgencia</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center">
                    <div className="w-6 h-6 border-2 border-[accent] border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                    No se encontraron leads
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{lead.nombre}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div>{lead.email}</div>
                      <div className="text-xs text-gray-400">{formatTelefono(lead)}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 capitalize">{lead.servicio}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 capitalize">{lead.ciudad}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {urgencyLabels[lead.urgencia] || lead.urgencia}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${
                        lead.score >= 80 ? 'text-green-600' : 
                        lead.score >= 60 ? 'text-yellow-600' : 'text-gray-600'
                      }`}>
                        {lead.score}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[lead.status] || 'bg-gray-100'}`}>
                        {statusLabels[lead.status] || lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(lead.created_at).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="text-accent hover:text-accent-600 text-sm font-medium"
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Página {page} de {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedLead.nombre}</h2>
                <p className="text-gray-500 text-sm mt-1">Lead #{selectedLead.id.slice(0, 8)}</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Email</p>
                  <p className="text-gray-900">{selectedLead.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Teléfono</p>
                  <p className="text-gray-900">{formatTelefono(selectedLead)}</p>
                </div>
                {selectedLead.fecha_nacimiento && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Fecha nacimiento</p>
                    <p className="text-gray-900">{new Date(selectedLead.fecha_nacimiento).toLocaleDateString('es-ES')}</p>
                  </div>
                )}
                {selectedLead.pais_origen && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">País origen</p>
                    <p className="text-gray-900">{selectedLead.pais_origen}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Servicio</p>
                  <p className="text-gray-900 capitalize">{selectedLead.servicio}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Ciudad</p>
                  <p className="text-gray-900 capitalize">{selectedLead.ciudad}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Urgencia</p>
                  <p className="text-gray-900">{urgencyLabels[selectedLead.urgencia] || selectedLead.urgencia}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Score</p>
                  <p className={`font-semibold ${
                    selectedLead.score >= 80 ? 'text-green-600' : 
                    selectedLead.score >= 60 ? 'text-yellow-600' : 'text-gray-600'
                  }`}>
                    {selectedLead.score} / 100
                  </p>
                </div>
              </div>

              {/* Message */}
              {selectedLead.mensaje && (
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Mensaje</p>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedLead.mensaje}</p>
                </div>
              )}

              {/* Landing Page */}
              {selectedLead.landing_page && (
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Origen</p>
                  <p className="text-gray-600 text-sm">{selectedLead.landing_page}</p>
                </div>
              )}

              {/* Status Update */}
              <div>
                <p className="text-xs text-gray-500 uppercase mb-2">Cambiar Estado</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => updateLeadStatus(selectedLead.id, value)}
                      className={`px-3 py-1.5 text-sm rounded-full border transition ${
                        selectedLead.status === value
                          ? statusColors[value]
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timestamps */}
              <div className="pt-4 border-t text-sm text-gray-500">
                Creado el {new Date(selectedLead.created_at).toLocaleString('es-ES')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
