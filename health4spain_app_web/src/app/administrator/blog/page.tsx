'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import BlogAIAssistant from '@/components/admin/BlogAIAssistant';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  status: string;
  views: number;
  lang: string;
  translation_group_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

const statusLabels: Record<string, string> = {
  draft: 'Borrador',
  published: 'Publicado',
  archived: 'Archivado',
};

const statusColors: Record<string, string> = {
  draft: 'bg-yellow-100 text-yellow-800',
  published: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-800',
};

const categoryLabels: Record<string, string> = {
  guias: 'Guías',
  tramites: 'Trámites',
  'vida-espana': 'Vida en España',
  noticias: 'Noticias',
  testimonios: 'Testimonios',
};

const langLabels: Record<string, { flag: string; label: string }> = {
  es: { flag: '🇪🇸', label: 'ES' },
  en: { flag: '🇬🇧', label: 'EN' },
  de: { flag: '🇩🇪', label: 'DE' },
  fr: { flag: '🇫🇷', label: 'FR' },
  pt: { flag: '🇵🇹', label: 'PT' },
};

type SortKey = 'title' | 'category' | 'status' | 'views' | 'lang' | 'created_at' | 'published_at';
type SortDirection = 'asc' | 'desc';

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLang, setFilterLang] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [filterStatus, filterCategory, filterLang]);

  // Mapa { translation_group_id -> { lang -> {slug, status} } } para mostrar
  // qué idiomas existen ya para cada artículo.
  const groupsMap = posts.reduce((acc, post) => {
    if (!post.translation_group_id) return acc;
    if (!acc[post.translation_group_id]) acc[post.translation_group_id] = {};
    acc[post.translation_group_id][post.lang] = { slug: post.slug, status: post.status };
    return acc;
  }, {} as Record<string, Record<string, { slug: string; status: string }>>);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      // Para texto arrancamos en asc (A→Z); para números y fechas en desc (más reciente/alto primero)
      const textKeys: SortKey[] = ['title', 'category', 'status'];
      setSortDirection(textKeys.includes(key) ? 'asc' : 'desc');
    }
  };

  const SortIndicator = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) {
      return <span className="ml-1 text-gray-300">↕</span>;
    }
    return (
      <span className="ml-1 text-gray-700">
        {sortDirection === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('blog_posts')
        .select('id, slug, title, excerpt, category, status, views, lang, translation_group_id, published_at, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (filterStatus) query = query.eq('status', filterStatus);
      if (filterCategory) query = query.eq('category', filterCategory);
      if (filterLang) query = query.eq('lang', filterLang);

      const { data, error } = await query;

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (slug: string) => {
    if (!confirm('¿Eliminar este post? Esta acción no se puede deshacer.')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('slug', slug);

      if (error) throw error;

      setPosts(posts.filter(p => p.slug !== slug));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error al eliminar el post');
    }
  };

  const filteredPosts = posts
    .filter(post => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        post.title.toLowerCase().includes(term) ||
        post.slug.toLowerCase().includes(term)
      );
    })
    .slice()
    .sort((a, b) => {
      const dir = sortDirection === 'asc' ? 1 : -1;

      const getValue = (post: BlogPost): string | number => {
        switch (sortKey) {
          case 'title':
            return post.title?.toLowerCase() || '';
          case 'category':
            return (categoryLabels[post.category] || post.category || '').toLowerCase();
          case 'status':
            return (statusLabels[post.status] || post.status || '').toLowerCase();
          case 'views':
            return post.views || 0;
          case 'lang':
            return post.lang || '';
          case 'created_at':
            return post.created_at ? new Date(post.created_at).getTime() : 0;
          case 'published_at':
            return post.published_at ? new Date(post.published_at).getTime() : 0;
          default:
            return '';
        }
      };

      const va = getValue(a);
      const vb = getValue(b);

      if (typeof va === 'number' && typeof vb === 'number') {
        return (va - vb) * dir;
      }
      return String(va).localeCompare(String(vb), 'es', { sensitivity: 'base' }) * dir;
    });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Blog</h1>
          <p className="text-gray-500 mt-1">Gestiona los artículos del blog</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/administrator/blog/ai-config"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition"
            title="Configurar el asistente IA"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Config IA
          </Link>
          <button
            onClick={() => setShowAIAssistant(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-accent text-white rounded-lg hover:opacity-90 transition shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Crear con IA
          </button>
          <Link
            href="/administrator/blog/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Post
          </Link>
        </div>
      </div>

      <BlogAIAssistant
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        onSaved={() => fetchPosts()}
      />

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Buscar por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[accent] focus:border-transparent outline-none col-span-2 md:col-span-1"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[accent] focus:border-transparent outline-none"
          >
            <option value="">Todos los estados</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[accent] focus:border-transparent outline-none"
          >
            <option value="">Todas las categorías</option>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <select
            value={filterLang}
            onChange={(e) => setFilterLang(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[accent] focus:border-transparent outline-none"
          >
            <option value="">Todos los idiomas</option>
            {Object.entries(langLabels).map(([value, { flag, label }]) => (
              <option key={value} value={value}>{flag} {label}</option>
            ))}
          </select>
          <button
            onClick={() => { setFilterStatus(''); setFilterCategory(''); setFilterLang(''); setSearchTerm(''); }}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <button
                    onClick={() => handleSort('title')}
                    className="flex items-center hover:text-gray-900 uppercase"
                  >
                    Título
                    <SortIndicator columnKey="title" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <button
                    onClick={() => handleSort('category')}
                    className="flex items-center hover:text-gray-900 uppercase"
                  >
                    Categoría
                    <SortIndicator columnKey="category" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center hover:text-gray-900 uppercase"
                  >
                    Estado
                    <SortIndicator columnKey="status" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <button
                    onClick={() => handleSort('lang')}
                    className="flex items-center hover:text-gray-900 uppercase"
                    title="Idioma del artículo y traducciones disponibles"
                  >
                    Idioma
                    <SortIndicator columnKey="lang" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <button
                    onClick={() => handleSort('views')}
                    className="flex items-center hover:text-gray-900 uppercase"
                  >
                    Vistas
                    <SortIndicator columnKey="views" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <button
                    onClick={() => handleSort('created_at')}
                    className="flex items-center hover:text-gray-900 uppercase"
                  >
                    Creado
                    <SortIndicator columnKey="created_at" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <button
                    onClick={() => handleSort('published_at')}
                    className="flex items-center hover:text-gray-900 uppercase"
                  >
                    Publicado
                    <SortIndicator columnKey="published_at" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center">
                    <div className="w-6 h-6 border-2 border-[accent] border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                    No hay posts todavía
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => {
                  const groupSiblings = post.translation_group_id
                    ? groupsMap[post.translation_group_id] || {}
                    : {};
                  const otherLangs = Object.keys(groupSiblings).filter((l) => l !== post.lang);
                  return (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{post.title}</p>
                        <p className="text-xs text-gray-400">/{post.slug}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {categoryLabels[post.category] || post.category}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[post.status] || 'bg-gray-100'}`}>
                        {statusLabels[post.status] || post.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="inline-flex items-center gap-1 text-xs font-semibold text-gray-800"
                          title={`Idioma: ${langLabels[post.lang]?.label || post.lang}`}
                        >
                          <span>{langLabels[post.lang]?.flag || '🏳️'}</span>
                          <span>{langLabels[post.lang]?.label || post.lang.toUpperCase()}</span>
                        </span>
                        {otherLangs.length > 0 && (
                          <span
                            className="inline-flex items-center gap-0.5 text-[11px] text-gray-500"
                            title={`Traducciones existentes: ${otherLangs.map((l) => langLabels[l]?.label || l).join(', ')}`}
                          >
                            <span className="text-gray-300">+</span>
                            {otherLangs.map((l) => (
                              <span key={l}>{langLabels[l]?.flag || ''}</span>
                            ))}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {post.views || 0}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {post.created_at
                        ? new Date(post.created_at).toLocaleDateString('es-ES')
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString('es-ES')
                        : <span className="text-gray-400 italic">sin publicar</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/administrator/blog/${post.slug}?lang=${encodeURIComponent(post.lang)}`}
                          className="text-accent hover:text-accent-600 text-sm font-medium"
                        >
                          Editar
                        </Link>
                        <span className="text-gray-300">|</span>
                        <Link
                          href={`/${post.lang}/blog/${post.slug}`}
                          target="_blank"
                          className="text-gray-500 hover:text-gray-700 text-sm"
                        >
                          Ver
                        </Link>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => deletePost(post.slug)}
                          className="text-accent-500 hover:text-accent-600 text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
