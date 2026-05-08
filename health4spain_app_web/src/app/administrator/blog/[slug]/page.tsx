'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';
import MediaManager from '@/components/admin/MediaManager';
import { useAuth } from '@/hooks/useAuth';

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

// Helpers para <input type="datetime-local">
const toLocalInput = (iso?: string | null): string => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const fromLocalInput = (val: string): string | null => {
  if (!val) return null;
  const d = new Date(val);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
};

const formatDateTime = (iso?: string | null): string => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const categories = [
  { value: 'guias', label: 'Guías' },
  { value: 'tramites', label: 'Trámites' },
  { value: 'vida-espana', label: 'Vida en España' },
  { value: 'noticias', label: 'Noticias' },
  { value: 'testimonios', label: 'Testimonios' },
];

function BlogEditorInner({ slug }: { slug: string }) {
  const isNew = slug === 'new';
  const searchParams = useSearchParams();
  const langFilter = (searchParams.get('lang') || 'es').trim() || 'es';

  const [post, setPost] = useState<BlogPost>(emptyPost);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [showMediaManager, setShowMediaManager] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<'featured' | 'content'>('featured');
  const [showTranslateModal, setShowTranslateModal] = useState(false);
  const [coverAiLoading, setCoverAiLoading] = useState(false);
  const [coverAiError, setCoverAiError] = useState<string | null>(null);
  const [coverAiPromptExtra, setCoverAiPromptExtra] = useState('');
  const editorRef = useRef<any>(null);
  const router = useRouter();
  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    if (!isNew) {
      fetchPost();
    } else {
      const now = new Date().toISOString();
      setPost(prev => ({
        ...prev,
        created_at: now,
        published_at: now,
      }));
    }
  }, [isNew, slug, langFilter]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('lang', langFilter)
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

  const generateFeaturedWithAI = async () => {
    if (!post.title.trim()) {
      alert('Necesitas un título para generar la portada con IA');
      return;
    }
    setCoverAiLoading(true);
    setCoverAiError(null);
    try {
      const res = await fetchWithAuth('/api/admin/blog/ai/generate-cover', {
        method: 'POST',
        body: JSON.stringify({
          title: post.title,
          excerpt: post.excerpt || undefined,
          prompt_extra: coverAiPromptExtra.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'No se pudo generar la imagen');
      }
      setPost((prev) => ({ ...prev, featured_image: json.data.url }));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error desconocido';
      setCoverAiError(msg);
    } finally {
      setCoverAiLoading(false);
    }
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
      const nowIso = new Date().toISOString();
      const finalStatus = publish ? 'published' : post.status;

      const postData: BlogPost = {
        ...post,
        featured_image: post.featured_image.trim(),
        tags,
        status: finalStatus,
        meta_title: post.meta_title || post.title,
        meta_description: post.meta_description || post.excerpt,
        updated_at: nowIso,
        created_at: post.created_at || nowIso,
        published_at:
          post.published_at ||
          (finalStatus === 'published' ? nowIso : undefined),
      };

      if (isNew) {
        const { error } = await supabase.from('blog_posts').insert(postData);
        if (error) throw error;
      } else {
        if (!post.id) {
          alert('Error interno: el post no tiene id. Recarga la página desde el listado (Editar).');
          return;
        }
        const { error } = await supabase.from('blog_posts').update(postData).eq('id', post.id);
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
          {!isNew && post.lang === 'es' && (
            <button
              onClick={() => setShowTranslateModal(true)}
              className="px-4 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition inline-flex items-center gap-1.5"
              title="Generar traducciones automáticas con IA a partir de la versión en español"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              Traducir con IA
            </button>
          )}
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

      {showTranslateModal && post.id && (
        <TranslateModal
          sourcePostId={post.id}
          sourceLang={post.lang as 'es' | 'en' | 'de' | 'fr' | 'pt'}
          fetchWithAuth={fetchWithAuth}
          onClose={() => setShowTranslateModal(false)}
        />
      )}

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

          {/* Fechas */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Fechas</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Fecha de creación</label>
                <input
                  type="datetime-local"
                  value={toLocalInput(post.created_at)}
                  onChange={(e) => setPost(prev => ({ ...prev, created_at: fromLocalInput(e.target.value) || undefined }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[accent] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Fecha de publicación</label>
                <input
                  type="datetime-local"
                  value={toLocalInput(post.published_at)}
                  onChange={(e) => setPost(prev => ({ ...prev, published_at: fromLocalInput(e.target.value) || undefined }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[accent] focus:border-transparent outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Puede ser anterior (retro-datar) o posterior (programar) a la fecha de creación.
                </p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Última modificación</label>
                <div className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
                  {formatDateTime(post.updated_at)}
                </div>
                <p className="text-xs text-gray-400 mt-1">Se actualiza automáticamente al guardar.</p>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <label className="block text-sm font-medium text-gray-700 mb-2">Imagen destacada</label>
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
                    title="Elegir desde biblioteca"
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
                type="button"
                onClick={() => openMediaManager('featured')}
                className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-[accent] hover:text-[accent] transition"
              >
                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Biblioteca / subir imagen</span>
              </button>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              <p className="text-xs text-gray-500">
                Portada con IA (misma configuración que en &quot;Crear con IA&quot;; se guarda en el bucket <code className="text-[11px] bg-gray-100 px-1 rounded">blog-images/ai-covers/</code>).
              </p>
              <input
                type="text"
                value={coverAiPromptExtra}
                onChange={(e) => setCoverAiPromptExtra(e.target.value)}
                placeholder='Indicación opcional (ej. "luz natural, ambiente oficina")'
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[accent] focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={generateFeaturedWithAI}
                disabled={coverAiLoading || !post.title.trim()}
                className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-accent text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {coverAiLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generando portada…
                  </>
                ) : (
                  <>
                    <span aria-hidden>✨</span>
                    Generar portada con IA
                  </>
                )}
              </button>
              {post.featured_image && (
                <button
                  type="button"
                  onClick={generateFeaturedWithAI}
                  disabled={coverAiLoading || !post.title.trim()}
                  className="w-full px-3 py-2 text-sm text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-50 disabled:opacity-50"
                >
                  {coverAiLoading ? 'Generando…' : 'Regenerar portada con IA'}
                </button>
              )}
              {coverAiError && (
                <p className="text-xs text-red-600 whitespace-pre-wrap">{coverAiError}</p>
              )}
            </div>
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

export default function BlogEditorPage({ params }: { params: { slug: string } }) {
  return (
    <Suspense
      fallback={
        <div className="p-8 max-w-6xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="h-12 bg-gray-200 rounded" />
            <div className="h-96 bg-gray-200 rounded" />
          </div>
        </div>
      }
    >
      <BlogEditorInner slug={params.slug} />
    </Suspense>
  );
}

// ============================================================
// Modal de traducción IA
// ============================================================

const ALL_LANGS: Array<{ value: 'es' | 'en' | 'de' | 'fr' | 'pt'; label: string }> = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'pt', label: 'Português' },
];

interface TranslateModalProps {
  sourcePostId: string;
  sourceLang: 'es' | 'en' | 'de' | 'fr' | 'pt';
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
  onClose: () => void;
}

interface TranslateResult {
  created: Array<{ id: string; slug: string; lang: string; admin_url: string }>;
  errors: Array<{ lang: string; error: string }>;
}

function TranslateModal({ sourcePostId, sourceLang, fetchWithAuth, onClose }: TranslateModalProps) {
  const targetCandidates = ALL_LANGS.filter((l) => l.value !== sourceLang);
  const [selected, setSelected] = useState<Array<'es' | 'en' | 'de' | 'fr' | 'pt'>>(
    targetCandidates.map((l) => l.value)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TranslateResult | null>(null);

  const toggle = (lang: 'es' | 'en' | 'de' | 'fr' | 'pt') => {
    setSelected((prev) => (prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]));
  };

  const run = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth('/api/admin/blog/ai/translate', {
        method: 'POST',
        body: JSON.stringify({
          source_post_id: sourcePostId,
          target_languages: selected,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Error al traducir');
      }
      setResult(json.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold">Traducir con IA</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {!result && (
            <>
              <p className="text-sm text-gray-600">
                Se generarán nuevos posts en los idiomas seleccionados como <strong>borradores</strong>.
                Las traducciones se adaptan culturalmente y se regeneran las metas SEO para cada mercado.
              </p>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Idiomas destino</p>
                <div className="grid grid-cols-2 gap-2">
                  {targetCandidates.map((l) => (
                    <label
                      key={l.value}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                        selected.includes(l.value) ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected.includes(l.value)}
                        onChange={() => toggle(l.value)}
                        className="w-4 h-4"
                      />
                      <span className="font-medium">{l.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-sm text-gray-600">Traduciendo a {selected.length} idiomas...</p>
                  <p className="text-xs text-gray-400 mt-1">Esto puede tardar 1-3 minutos.</p>
                </div>
              )}
            </>
          )}

          {result && (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="font-medium text-green-800">
                  ✓ {result.created.length} traducciones creadas como borrador
                </p>
              </div>
              {result.created.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Borradores creados</p>
                  <ul className="space-y-2">
                    {result.created.map((c) => (
                      <li key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">
                          <strong className="uppercase mr-2">{c.lang}</strong> /{c.slug}
                        </span>
                        <a
                          href={c.admin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-accent hover:underline"
                        >
                          Editar →
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.errors.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-red-700 mb-2">Errores</p>
                  <ul className="space-y-1 text-sm text-red-600">
                    {result.errors.map((e, i) => (
                      <li key={i}>
                        <strong className="uppercase">{e.lang}</strong>: {e.error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        <div className="border-t px-6 py-4 flex justify-end gap-2">
          {!result && (
            <>
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={run}
                disabled={loading || selected.length === 0}
                className="px-5 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 disabled:opacity-50"
              >
                {loading ? 'Traduciendo...' : `Traducir a ${selected.length} idioma${selected.length === 1 ? '' : 's'}`}
              </button>
            </>
          )}
          {result && (
            <button
              onClick={onClose}
              className="px-5 py-2 bg-accent text-white rounded-lg hover:bg-accent-600"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
