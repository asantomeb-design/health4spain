'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Destino {
  slug: string;
  nombre: string;
  provincia: string;
  comunidad: string;
  poblacion: number | null;
  porcentaje_extranjeros: number | null;
  destacada: boolean;
  datos_extra: any;
}

export default function DestinosPage() {
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDestino, setEditingDestino] = useState<Destino | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Destino>>({
    slug: '',
    nombre: '',
    provincia: '',
    comunidad: '',
    poblacion: null,
    porcentaje_extranjeros: null,
    destacada: false,
    datos_extra: {},
  });
  const [filterDestacada, setFilterDestacada] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDestinos();
  }, [filterDestacada]);

  const fetchDestinos = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('ciudades_catalogo')
        .select('*')
        .order('nombre', { ascending: true });

      if (filterDestacada === 'true') query = query.eq('destacada', true);
      if (filterDestacada === 'false') query = query.eq('destacada', false);

      const { data, error } = await query;

      if (error) throw error;
      setDestinos(data || []);
    } catch (error) {
      console.error('Error fetching destinos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingDestino) {
        // Actualizar
        const { error } = await supabase
          .from('ciudades_catalogo')
          .update({
            nombre: formData.nombre,
            provincia: formData.provincia,
            comunidad: formData.comunidad,
            poblacion: formData.poblacion,
            porcentaje_extranjeros: formData.porcentaje_extranjeros,
            destacada: formData.destacada,
            datos_extra: formData.datos_extra,
          })
          .eq('slug', editingDestino.slug);

        if (error) throw error;
        alert('Destino actualizado correctamente');
      } else {
        // Crear
        const { error } = await supabase
          .from('ciudades_catalogo')
          .insert([{
            slug: formData.slug,
            nombre: formData.nombre,
            provincia: formData.provincia,
            comunidad: formData.comunidad,
            poblacion: formData.poblacion,
            porcentaje_extranjeros: formData.porcentaje_extranjeros,
            destacada: formData.destacada,
            datos_extra: formData.datos_extra,
          }]);

        if (error) throw error;
        alert('Destino creado correctamente');
      }

      // Reset form
      setFormData({
        slug: '',
        nombre: '',
        provincia: '',
        comunidad: '',
        poblacion: null,
        porcentaje_extranjeros: null,
        destacada: false,
        datos_extra: {},
      });
      setEditingDestino(null);
      setShowForm(false);
      fetchDestinos();
    } catch (error: any) {
      console.error('Error saving destino:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleEdit = (destino: Destino) => {
    setEditingDestino(destino);
    setFormData({
      slug: destino.slug,
      nombre: destino.nombre,
      provincia: destino.provincia,
      comunidad: destino.comunidad,
      poblacion: destino.poblacion,
      porcentaje_extranjeros: destino.porcentaje_extranjeros,
      destacada: destino.destacada,
      datos_extra: destino.datos_extra || {},
    });
    setShowForm(true);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('¿Estás seguro de eliminar este destino? Esto puede afectar las landing pages existentes.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('ciudades_catalogo')
        .delete()
        .eq('slug', slug);

      if (error) throw error;
      alert('Destino eliminado correctamente');
      fetchDestinos();
    } catch (error: any) {
      console.error('Error deleting destino:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const toggleDestacada = async (slug: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('ciudades_catalogo')
        .update({ destacada: !currentValue })
        .eq('slug', slug);

      if (error) throw error;

      setDestinos(destinos.map(d => d.slug === slug ? { ...d, destacada: !currentValue } : d));
    } catch (error) {
      console.error('Error updating:', error);
    }
  };

  const cancelEdit = () => {
    setEditingDestino(null);
    setShowForm(false);
    setFormData({
      slug: '',
      nombre: '',
      provincia: '',
      comunidad: '',
      poblacion: null,
      porcentaje_extranjeros: null,
      destacada: false,
      datos_extra: {},
    });
  };

  const filteredDestinos = destinos.filter(destino => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      destino.nombre.toLowerCase().includes(term) ||
      destino.provincia.toLowerCase().includes(term) ||
      destino.slug.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-8">
      {/* Header Minimal */}
      <div className="mb-12 pb-6 border-b border-gray-200">
        <h1 className="text-4xl font-bold mb-2">Destinos</h1>
        <p className="text-lg text-gray-600">Gestiona el catálogo de ciudades disponibles</p>
      </div>

      {/* Action Button */}
      <div className="mb-8">
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-minimal"
        >
          {showForm ? 'Cancelar' : 'Nuevo Destino'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-8 border border-gray-200 mb-12">
          <h2 className="text-2xl font-bold mb-6">
            {editingDestino ? 'Editar Destino' : 'Nuevo Destino'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label-minimal">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  disabled={!!editingDestino}
                  required
                  className="form-input-minimal disabled:opacity-50"
                  placeholder="torrevieja"
                />
              </div>
              <div>
                <label className="form-label-minimal">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  className="form-input-minimal"
                  placeholder="Torrevieja"
                />
              </div>
              <div>
                <label className="form-label-minimal">
                  Provincia *
                </label>
                <input
                  type="text"
                  value={formData.provincia}
                  onChange={(e) => setFormData({ ...formData, provincia: e.target.value })}
                  required
                  className="form-input-minimal"
                  placeholder="Alicante"
                />
              </div>
              <div>
                <label className="form-label-minimal">
                  Comunidad Autónoma *
                </label>
                <input
                  type="text"
                  value={formData.comunidad}
                  onChange={(e) => setFormData({ ...formData, comunidad: e.target.value })}
                  required
                  className="form-input-minimal"
                  placeholder="Comunidad Valenciana"
                />
              </div>
              <div>
                <label className="form-label-minimal">
                  Población
                </label>
                <input
                  type="number"
                  value={formData.poblacion || ''}
                  onChange={(e) => setFormData({ ...formData, poblacion: e.target.value ? parseInt(e.target.value) : null })}
                  className="form-input-minimal"
                  placeholder="82000"
                />
              </div>
              <div>
                <label className="form-label-minimal">
                  % Extranjeros
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.porcentaje_extranjeros || ''}
                  onChange={(e) => setFormData({ ...formData, porcentaje_extranjeros: e.target.value ? parseFloat(e.target.value) : null })}
                  className="form-input-minimal"
                  placeholder="28.00"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="destacada"
                checked={formData.destacada}
                onChange={(e) => setFormData({ ...formData, destacada: e.target.checked })}
                className="w-5 h-5"
              />
              <label htmlFor="destacada" className="text-sm font-medium">
                Ciudad destacada (se muestra en homepage)
              </label>
            </div>

            <div className="flex justify-start gap-4 pt-4">
              <button
                type="submit"
                className="btn-minimal"
              >
                {editingDestino ? 'Actualizar' : 'Crear'} Destino
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="btn-ghost-minimal"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-8 mb-12">
        <div className="border-t-3 border-accent pt-4">
          <p className="text-sm uppercase tracking-widest text-gray-600 mb-1">Total Destinos</p>
          <p className="text-4xl font-bold">{destinos.length}</p>
        </div>
        <div className="border-t-3 border-accent pt-4">
          <p className="text-sm uppercase tracking-widest text-gray-600 mb-1">Destacados</p>
          <p className="text-4xl font-bold">{destinos.filter(d => d.destacada).length}</p>
        </div>
        <div className="border-t-3 border-accent pt-4">
          <p className="text-sm uppercase tracking-widest text-gray-600 mb-1">Población Total</p>
          <p className="text-4xl font-bold">
            {(destinos.reduce((acc, d) => acc + (d.poblacion || 0), 0) / 1000000).toFixed(1)}M
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Buscar por nombre, provincia o slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input-minimal bg-white"
          />
          <select
            value={filterDestacada}
            onChange={(e) => setFilterDestacada(e.target.value)}
            className="form-input-minimal bg-white"
          >
            <option value="">Todos los destinos</option>
            <option value="true">Solo destacados</option>
            <option value="false">No destacados</option>
          </select>
          <button
            onClick={() => { setFilterDestacada(''); setSearchTerm(''); }}
            className="btn-ghost-minimal"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">Nombre</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">Slug</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">Provincia</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">Comunidad</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest">Población</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest">% Extran.</th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest">Destacada</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="text-lg">Cargando...</div>
                  </td>
                </tr>
              ) : filteredDestinos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                    No hay destinos configurados
                  </td>
                </tr>
              ) : (
                filteredDestinos.map((destino) => (
                  <tr key={destino.slug} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold">{destino.nombre}</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">{destino.slug}</td>
                    <td className="px-6 py-4 text-sm">{destino.provincia}</td>
                    <td className="px-6 py-4 text-sm">{destino.comunidad}</td>
                    <td className="px-6 py-4 text-sm text-right">
                      {destino.poblacion ? destino.poblacion.toLocaleString('es-ES') : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      {destino.porcentaje_extranjeros ? `${destino.porcentaje_extranjeros}%` : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleDestacada(destino.slug, destino.destacada)}
                        className={`text-lg transition-opacity ${
                          destino.destacada ? 'opacity-100' : 'opacity-20 hover:opacity-50'
                        }`}
                      >
                        ★
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleEdit(destino)}
                          className="text-sm font-medium hover:opacity-50 transition-opacity"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(destino.slug)}
                          className="text-sm font-medium text-accent hover:opacity-50 transition-opacity"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Count */}
        <div className="px-6 py-4 border-t border-gray-200 text-sm text-gray-600">
          Mostrando {filteredDestinos.length} de {destinos.length} destinos
        </div>
      </div>
    </div>
  );
}
