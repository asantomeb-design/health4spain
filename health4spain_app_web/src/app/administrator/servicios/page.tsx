'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Servicio {
  slug: string;
  nombre: string;
  nombre_plural: string;
  icon: string;
  descripcion_corta: string;
  keywords: string[];
}

export default function ServiciosPage() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Servicio>>({
    slug: '',
    nombre: '',
    nombre_plural: '',
    icon: '',
    descripcion_corta: '',
    keywords: [],
  });
  const [keywordInput, setKeywordInput] = useState('');

  const EMOJI_OPTIONS = [
    '⚖️', '🏢', '🏥', '📝', '🤝', '💼', '🏡', '👨‍👩‍👧‍👦', '✈️', '🇪🇸', '💶', '📄',
    '🚗', '🎓', '🏥', '🛡️', '🦷', '🔑', '🏷️', '📈', '📊', '👥', '🔍', '📱'
  ];

  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('servicios_catalogo')
        .select('*')
        .order('nombre', { ascending: true });

      if (error) throw error;
      setServicios(data || []);
    } catch (error) {
      console.error('Error fetching servicios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingServicio) {
        // Actualizar
        const { error } = await supabase
          .from('servicios_catalogo')
          .update({
            nombre: formData.nombre,
            nombre_plural: formData.nombre_plural,
            icon: formData.icon,
            descripcion_corta: formData.descripcion_corta,
            keywords: formData.keywords,
          })
          .eq('slug', editingServicio.slug);

        if (error) throw error;
        alert('Servicio actualizado correctamente');
      } else {
        // Crear
        const { error } = await supabase
          .from('servicios_catalogo')
          .insert([{
            slug: formData.slug,
            nombre: formData.nombre,
            nombre_plural: formData.nombre_plural,
            icon: formData.icon,
            descripcion_corta: formData.descripcion_corta,
            keywords: formData.keywords,
          }]);

        if (error) throw error;
        alert('Servicio creado correctamente');
      }

      // Reset form
      setFormData({
        slug: '',
        nombre: '',
        nombre_plural: '',
        icon: '',
        descripcion_corta: '',
        keywords: [],
      });
      setKeywordInput('');
      setEditingServicio(null);
      setShowForm(false);
      fetchServicios();
    } catch (error: any) {
      console.error('Error saving servicio:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleEdit = (servicio: Servicio) => {
    setEditingServicio(servicio);
    setFormData({
      slug: servicio.slug,
      nombre: servicio.nombre,
      nombre_plural: servicio.nombre_plural,
      icon: servicio.icon,
      descripcion_corta: servicio.descripcion_corta,
      keywords: servicio.keywords || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('¿Estás seguro de eliminar este servicio? Esto puede afectar las landing pages existentes.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('servicios_catalogo')
        .delete()
        .eq('slug', slug);

      if (error) throw error;
      alert('Servicio eliminado correctamente');
      fetchServicios();
    } catch (error: any) {
      console.error('Error deleting servicio:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim()) {
      setFormData({
        ...formData,
        keywords: [...(formData.keywords || []), keywordInput.trim()],
      });
      setKeywordInput('');
    }
  };

  const removeKeyword = (index: number) => {
    setFormData({
      ...formData,
      keywords: (formData.keywords || []).filter((_, i) => i !== index),
    });
  };

  const cancelEdit = () => {
    setEditingServicio(null);
    setShowForm(false);
    setFormData({
      slug: '',
      nombre: '',
      nombre_plural: '',
      icon: '',
      descripcion_corta: '',
      keywords: [],
    });
    setKeywordInput('');
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Servicios</h1>
          <p className="text-gray-500 mt-1">Gestiona el catálogo de servicios disponibles</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 transition"
        >
          {showForm ? 'Cancelar' : 'Nuevo Servicio'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingServicio ? 'Editar Servicio' : 'Nuevo Servicio'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  disabled={!!editingServicio}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[accent] focus:border-transparent outline-none disabled:bg-gray-100"
                  placeholder="abogados"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[accent] focus:border-transparent outline-none"
                  placeholder="Abogado"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Plural *
                </label>
                <input
                  type="text"
                  value={formData.nombre_plural}
                  onChange={(e) => setFormData({ ...formData, nombre_plural: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[accent] focus:border-transparent outline-none"
                  placeholder="Abogados"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icono (emoji)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-16 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[accent] focus:border-transparent outline-none text-center text-2xl emoji-blue bg-white"
                    placeholder="⚖️"
                  />
                  <div className="flex-1 flex flex-wrap gap-1 p-2 bg-gray-50 border border-gray-200 rounded-lg">
                    {EMOJI_OPTIONS.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: emoji })}
                        className="w-8 h-8 flex items-center justify-center text-xl hover:bg-white hover:shadow-sm rounded transition emoji-blue bg-transparent border-0 cursor-pointer"
                        title="Seleccionar emoji"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción Corta
              </label>
              <textarea
                value={formData.descripcion_corta}
                onChange={(e) => setFormData({ ...formData, descripcion_corta: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[accent] focus:border-transparent outline-none"
                placeholder="Especialistas en visados, NIE, arraigo y nacionalidad"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keywords SEO
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[accent] focus:border-transparent outline-none"
                  placeholder="Añadir keyword"
                />
                <button
                  type="button"
                  onClick={addKeyword}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Añadir
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData.keywords || []).map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-[accent] rounded-full text-sm"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(index)}
                      className="hover:text-accent"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 transition"
              >
                {editingServicio ? 'Actualizar' : 'Crear'} Servicio
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">Total Servicios</p>
          <p className="text-2xl font-bold text-gray-900">{servicios.length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Icono</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keywords</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center">
                    <div className="w-6 h-6 border-2 border-[accent] border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : servicios.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    No hay servicios configurados
                  </td>
                </tr>
              ) : (
                servicios.map((servicio) => (
                  <tr key={servicio.slug} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-2xl">
                      <span className="emoji-blue inline-block">{servicio.icon}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-mono">{servicio.slug}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="font-medium">{servicio.nombre}</div>
                      <div className="text-gray-500 text-xs">{servicio.nombre_plural}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                      {servicio.descripcion_corta}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(servicio.keywords || []).slice(0, 3).map((keyword, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            {keyword}
                          </span>
                        ))}
                        {(servicio.keywords || []).length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{(servicio.keywords || []).length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(servicio)}
                          className="text-[accent] hover:text-[accent-600] text-sm font-medium"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(servicio.slug)}
                          className="text-accent hover:text-accent-600 text-sm font-medium"
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
      </div>
    </div>
  );
}
