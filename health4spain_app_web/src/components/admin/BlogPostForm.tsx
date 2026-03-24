'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { BlogPost, BLOG_CATEGORIES } from '@/lib/types';

// Cargar TinyMCE dinámicamente (solo en cliente)
const BlogEditor = dynamic(() => import('./BlogEditor'), {
  ssr: false,
  loading: () => <div className="h-[600px] bg-gray-100 animate-pulse rounded-lg" />,
});

interface BlogPostFormProps {
  initialData?: Partial<BlogPost>;
  onSubmit: (data: Partial<BlogPost>) => Promise<void>;
  isLoading?: boolean;
}

export default function BlogPostForm({ initialData, onSubmit, isLoading }: BlogPostFormProps) {
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category: 'guias',
    tags: [],
    meta_title: '',
    meta_description: '',
    lang: 'es',
    status: 'draft',
    author_name: 'Health4Spain',
    ...initialData,
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generar slug desde título
    if (name === 'title' && !initialData?.slug) {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || [],
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title?.trim()) newErrors.title = 'El título es requerido';
    if (!formData.slug?.trim()) newErrors.slug = 'El slug es requerido';
    if (!formData.excerpt?.trim()) newErrors.excerpt = 'El extracto es requerido';
    if (!formData.content?.trim()) newErrors.content = 'El contenido es requerido';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!validate()) return;
    
    const dataToSubmit = {
      ...formData,
      status,
      meta_title: formData.meta_title || formData.title,
      meta_description: formData.meta_description || formData.excerpt,
    };
    
    await onSubmit(dataToSubmit);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fijo */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {initialData?.id ? 'Editar artículo' : 'Nuevo artículo'}
              </h1>
              <p className="text-sm text-gray-500">
                {formData.status === 'draft' ? '📝 Borrador' : '✅ Publicado'}
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => handleSubmit('draft')}
                disabled={isLoading}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 text-sm sm:text-base"
              >
                Guardar borrador
              </button>
              <button
                type="button"
                onClick={() => handleSubmit('published')}
                disabled={isLoading}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 text-sm sm:text-base"
              >
                {isLoading ? 'Guardando...' : 'Publicar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        {/* Tabs móvil */}
        <div className="lg:hidden mb-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('content')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'content' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
              }`}
            >
              Contenido
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'seo' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
              }`}
            >
              SEO y Config
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className={`lg:col-span-2 space-y-6 ${activeTab !== 'content' ? 'hidden lg:block' : ''}`}>
            {/* Título */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Título del artículo"
                className={`w-full px-4 py-3 text-lg sm:text-xl border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors.title ? 'border-accent-500' : 'border-gray-300'
                }`}
              />
              {errors.title && <p className="mt-1 text-sm text-accent">{errors.title}</p>}
            </div>

            {/* Slug */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                URL (Slug) *
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-gray-500 text-sm">/{formData.lang}/blog/</span>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="url-del-articulo"
                  className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                    errors.slug ? 'border-accent-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.slug && <p className="mt-1 text-sm text-accent">{errors.slug}</p>}
            </div>

            {/* Extracto */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Extracto * <span className="font-normal text-gray-500">(máx. 160 caracteres)</span>
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                maxLength={160}
                placeholder="Breve descripción del artículo..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none ${
                  errors.excerpt ? 'border-accent-500' : 'border-gray-300'
                }`}
              />
              <div className="flex justify-between mt-1">
                {errors.excerpt && <p className="text-sm text-accent">{errors.excerpt}</p>}
                <span className="text-sm text-gray-500 ml-auto">
                  {formData.excerpt?.length || 0}/160
                </span>
              </div>
            </div>

            {/* Editor de contenido */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contenido *
              </label>
              <div className="prose-editor">
                <BlogEditor
                  value={formData.content || ''}
                  onChange={handleContentChange}
                />
              </div>
              {errors.content && <p className="mt-2 text-sm text-accent">{errors.content}</p>}
            </div>
          </div>

          {/* Sidebar */}
          <div className={`space-y-6 ${activeTab !== 'seo' ? 'hidden lg:block' : ''}`}>
            {/* Imagen destacada */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Imagen destacada
              </label>
              <input
                type="url"
                name="featured_image"
                value={formData.featured_image}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-3 text-sm"
              />
              {formData.featured_image && (
                <img
                  src={formData.featured_image}
                  alt="Preview"
                  className="w-full h-32 sm:h-40 object-cover rounded-lg"
                />
              )}
            </div>

            {/* Categoría */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Categoría
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {BLOG_CATEGORIES.map(cat => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name.es}
                  </option>
                ))}
              </select>
            </div>

            {/* Idioma */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Idioma
              </label>
              <select
                name="lang"
                value={formData.lang}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="es">🇪🇸 Español</option>
                <option value="en">🇬🇧 English</option>
                <option value="de">🇩🇪 Deutsch</option>
                <option value="fr">🇫🇷 Français</option>
              </select>
            </div>

            {/* Tags */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Etiquetas
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Añadir etiqueta..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  +
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags?.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-blue-600 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">SEO</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta título <span className="text-gray-400">(máx. 60)</span>
                  </label>
                  <input
                    type="text"
                    name="meta_title"
                    value={formData.meta_title}
                    onChange={handleChange}
                    placeholder={formData.title || 'Título para Google'}
                    maxLength={60}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                  <span className="text-xs text-gray-500">
                    {formData.meta_title?.length || 0}/60
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta descripción <span className="text-gray-400">(máx. 160)</span>
                  </label>
                  <textarea
                    name="meta_description"
                    value={formData.meta_description}
                    onChange={handleChange}
                    placeholder={formData.excerpt || 'Descripción para Google'}
                    maxLength={160}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                  />
                  <span className="text-xs text-gray-500">
                    {formData.meta_description?.length || 0}/160
                  </span>
                </div>
              </div>

              {/* Preview de Google */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-2">Vista previa en Google:</p>
                <div className="space-y-1">
                  <p className="text-blue-700 text-sm sm:text-base truncate hover:underline cursor-pointer">
                    {formData.meta_title || formData.title || 'Título del artículo'}
                  </p>
                  <p className="text-green-700 text-xs truncate">
                    www.health4spain.com/es/blog/{formData.slug || 'url-del-articulo'}
                  </p>
                  <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
                    {formData.meta_description || formData.excerpt || 'Descripción del artículo...'}
                  </p>
                </div>
              </div>
            </div>

            {/* Autor */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Autor
              </label>
              <input
                type="text"
                name="author_name"
                value={formData.author_name}
                onChange={handleChange}
                placeholder="Nombre del autor"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
