'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';
import MediaManager from '@/components/admin/MediaManager';

// Importar TinyMCE dinámicamente para evitar SSR
const Editor = dynamic(() => import('@tinymce/tinymce-react').then(mod => mod.Editor as unknown as React.ComponentType<any>), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 rounded-lg animate-pulse"></div>,
});

interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category: string;
  tags: string[];
  meta_title: string;
  meta_description: string;
  status: string;
  lang: string;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
}

const emptyPost: BlogPost = {
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  featured_image: '',
  category: 'guias',
  tags: [],
  meta_title: '',
  meta_description: '',
  status: 'draft',
  lang: 'es',
};

const categories = [
  { value: 'guias', label: 'Guías' },
  { value: 'tramites', label: 'Trámites' },
  { value: 'vida-espana', label: 'Vida en España' },
  { value: 'noticias', label: 'Noticias' },
  { value: 'testimonios', label: 'Testimonios' },
];

export default function BlogEditorPage({ params }: { params: { slug: string } }) {
  const isNew = params.slug === 'new';
  
  const [post, setPost] = useState<BlogPost>(emptyPost);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [showMediaManager, setShowMediaManager] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<'featured' | 'content'>('featured');
  const editorRef = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isNew) {
      fetchPost();
    }
  }, [isNew, params.slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', params.slug)
        .single();

      if (error) throw error;
      
      setPost(data);
      setTagsInput(data.tags?.join(', ') || '');
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('Post no encontrado');
      router.push('/administrator/blog');
    } finally {
      setLoading(false);
    }
  };

  const openMediaManager = (target: 'featured' | 'content') => {
    setMediaTarget(target);
    setShowMediaManager(true);
  };

  const handleMediaSelect = (url: string) => {
    if (mediaTarget === 'featured') {
      setPost(prev => ({ ...prev, featured_image: url }));
    } else if (mediaTarget === 'content' && editorRef.current) {
      // Insertar imagen en el editor TinyMCE
      editorRef.current.insertContent(`<img src="${url}" alt="" style="max-width: 100%; height: auto;" />`);
    }
    setShowMediaManager(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setPost(prev => ({
      ...prev,
      title,
      slug: isNew ? generateSlug(title) : prev.slug,
      meta_title: prev.meta_title || title,
    }));
  };

  const handleSave = async (publish = false) => {
    // Validación
    if (!post.title.trim()) {
      alert('El título es requerido');
      return;
    }
    if (!post.slug.trim()) {
      alert('El slug es requerido');
      return;
    }

    setSaving(true);
    try {
      const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
      const postData = {
        ...post,
        tags,
        status: publish ? 'published' : post.status,
        meta_title: post.meta_title || post.title,
        meta_description: post.meta_description || post.excerpt,
        updated_at: new Date().toISOString(),
        ...(publish && post.status !== 'published' ? { published_at: new Date().toISOString() } : {}),
      };

      if (isNew) {
        postData.created_at = new Date().toISOString();
        const { error } = await supabase.from('blog_posts').insert(postData);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('slug', params.slug);
        if (error) throw error;
      }

      alert(publish ? 'Post publicado' : 'Post guardado');
      router.push('/administrator/blog');
    } catch (error: any) {
      console.error('Error saving:', error);
      alert(error.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">
            {isNew ? 'Nuevo Post' : 'Editar Post'}
          </h1>
          <p className="text-gray-500 mt-1">
            {isNew ? 'Crea un nuevo artículo' : `Editando: ${post.title}`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push('/administrator/blog')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-4 py-2 border border-[accent] text-[accent] rounded-lg hover:bg-accent/10 transition disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar Borrador'}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 transition disabled:opacity-50"
          >
            {saving ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
            <input
              type="text"
              value={post.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-[accent] focus:border-transparent outline-none"
              placeholder="Título del artículo..."
            />
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-gray-500">Slug:</span>
              <input
                type="text"
                value={post.slug}
                onChange={(e) => setPost(prev => ({ ...prev, slug: e.target.value }))}
                className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-[accent] outline-none"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <label className="block text-sm font-medium text-gray-700 mb-2">Extracto</label>
            <textarea
              value={post.excerpt}
              onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[accent] focus:border-transparent outline-none resize-none"
              placeholder="Breve descripción del artículo..."
            />
          </div>

          {/* Content Editor */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Contenido</label>
              <button
                onClick={() => openMediaManager('content')}
                className="flex items-center gap-1 text-sm text-[accent] hover:underline"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Insertar imagen
              </button>
            </div>
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
              value={post.content}
              onInit={(evt: any, editor: any) => editorRef.current = editor}
              onEditorChange={(content: any) => setPost(prev => ({ ...prev, content }))}
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | image link | help',
                content_style: `
                  body { 
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
                    font-size: 16px; 
                    line-height: 1.6;
                    max-width: 100%;
                  }
                  img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 8px;
                  }
                `,
                image_advtab: true,
                automatic_uploads: false,
                file_picker_types: 'image',
                // Abrir nuestro MediaManager al hacer clic en insertar imagen de TinyMCE
                file_picker_callback: (callback: any, value: any, meta: any) => {
                  if (meta.filetype === 'image') {
                    // Abrimos nuestro gestor de medios
                    setMediaTarget('content');
                    setShowMediaManager(true);
                    // Guardamos el callback para usarlo cuando se seleccione una imagen
                    (window as any).__tinymceCallback = callback;
                  }
                },
              }}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              value={post.status}
              onChange={(e) => setPost(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[accent] focus:border-transparent outline-none"
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
              <option value="archived">Archivado</option>
            </select>
          </div>

          {/* Category */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
            <select
              value={post.category}
              onChange={(e) => setPost(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[accent] focus:border-transparent outline-none"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Featured Image */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <label className="block text-sm font-medium text-gray-700 mb-2">Imagen Destacada</label>
            {post.featured_image ? (
              <div className="relative">
                <img
                  src={post.featured_image}
                  alt="Featured"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => openMediaManager('featured')}
                    className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100"
                    title="Cambiar imagen"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setPost(prev => ({ ...prev, featured_image: '' }))}
                    className="p-1.5 bg-accent-500 text-white rounded-full shadow hover:bg-accent"
                    title="Quitar imagen"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => openMediaManager('featured')}
                className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-[accent] hover:text-[accent] transition"
              >
                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Seleccionar imagen</span>
              </button>
            )}
          </div>

          {/* Tags */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <label className="block text-sm font-medium text-gray-700 mb-2">Etiquetas</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[accent] focus:border-transparent outline-none"
              placeholder="tag1, tag2, tag3..."
            />
            <p className="text-xs text-gray-400 mt-1">Separadas por comas</p>
          </div>

          {/* SEO */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-700 mb-4">SEO</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Meta Título</label>
                <input
                  type="text"
                  value={post.meta_title}
                  onChange={(e) => setPost(prev => ({ ...prev, meta_title: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[accent] focus:border-transparent outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">{post.meta_title.length}/60 caracteres</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Meta Descripción</label>
                <textarea
                  value={post.meta_description}
                  onChange={(e) => setPost(prev => ({ ...prev, meta_description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[accent] focus:border-transparent outline-none resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">{post.meta_description.length}/160 caracteres</p>
              </div>
            </div>
          </div>

          {/* Preview Link */}
          {!isNew && (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <a
                href={`/es/blog/${post.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Ver en el sitio
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Media Manager Modal */}
      <MediaManager
        isOpen={showMediaManager}
        onClose={() => setShowMediaManager(false)}
        onSelect={handleMediaSelect}
        bucket="blog-images"
      />
    </div>
  );
}
