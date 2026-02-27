'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { ChatMessageLog, ChatRating } from '@/lib/types';

const LANG_LABELS: Record<string, string> = {
  es: 'ES', en: 'EN', fr: 'FR', de: 'DE', pt: 'PT',
};

const RATING_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  correcta: { label: 'Correcta', bg: 'bg-green-100', text: 'text-green-800' },
  mejorable: { label: 'Mejorable', bg: 'bg-yellow-100', text: 'text-yellow-800' },
  erronea: { label: 'Errónea', bg: 'bg-red-100', text: 'text-red-800' },
};

const PAGE_SIZE = 20;

interface Stats {
  total: number;
  rated: number;
  correcta: number;
  mejorable: number;
  erronea: number;
  byLang: Record<string, number>;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

export default function ChatHistoryPage() {
  const [messages, setMessages] = useState<ChatMessageLog[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterRating, setFilterRating] = useState<string>('all');
  const [filterLang, setFilterLang] = useState<string>('all');
  const [ratingLoading, setRatingLoading] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    const { data: all } = await supabase
      .from('chat_messages')
      .select('rating, lang, created_at');

    if (!all) return;

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const byLang: Record<string, number> = {};
    let correcta = 0, mejorable = 0, erronea = 0, rated = 0;
    let today = 0, thisWeek = 0, thisMonth = 0;

    all.forEach(m => {
      byLang[m.lang] = (byLang[m.lang] || 0) + 1;
      if (m.rating) {
        rated++;
        if (m.rating === 'correcta') correcta++;
        if (m.rating === 'mejorable') mejorable++;
        if (m.rating === 'erronea') erronea++;
      }
      const d = new Date(m.created_at);
      if (d >= startOfDay) today++;
      if (d >= startOfWeek) thisWeek++;
      if (d >= startOfMonth) thisMonth++;
    });

    setStats({ total: all.length, rated, correcta, mejorable, erronea, byLang, today, thisWeek, thisMonth });
  }, []);

  const fetchMessages = useCallback(async () => {
    let query = supabase
      .from('chat_messages')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (filterRating === 'sin_calificar') {
      query = query.is('rating', null);
    } else if (filterRating !== 'all') {
      query = query.eq('rating', filterRating);
    }

    if (filterLang !== 'all') {
      query = query.eq('lang', filterLang);
    }

    const { data, count, error } = await query;
    if (error) {
      console.error('Error fetching chat messages:', error);
      return;
    }

    setMessages(data || []);
    setTotalCount(count || 0);
  }, [page, filterRating, filterLang]);

  useEffect(() => {
    Promise.all([fetchStats(), fetchMessages()]).finally(() => setLoading(false));
  }, [fetchStats, fetchMessages]);

  useEffect(() => {
    setPage(0);
  }, [filterRating, filterLang]);

  const handleRate = async (id: string, rating: ChatRating) => {
    setRatingLoading(id);
    try {
      const res = await fetch('/api/chat/rate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, rating }),
      });
      if (res.ok) {
        setMessages(prev => prev.map(m =>
          m.id === id ? { ...m, rating, rated_at: new Date().toISOString() } : m
        ));
        fetchStats();
      }
    } catch (e) {
      console.error('Error rating message:', e);
    } finally {
      setRatingLoading(null);
    }
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>)}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  const pctCorrect = stats && stats.rated > 0 ? Math.round((stats.correcta / stats.rated) * 100) : 0;
  const pctMejorable = stats && stats.rated > 0 ? Math.round((stats.mejorable / stats.rated) * 100) : 0;
  const pctError = stats && stats.rated > 0 ? Math.round((stats.erronea / stats.rated) * 100) : 0;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-10 pb-8 border-b border-gray-200">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Chat History</h1>
        <p className="text-lg text-gray-600">Historial de conversaciones del chatbot IA y calificaciones</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="border-t-3 border-accent pt-6">
          <p className="text-xs uppercase tracking-widest text-gray-600 mb-2">Total Conversaciones</p>
          <p className="text-4xl font-bold">{stats?.total || 0}</p>
          <p className="text-xs text-gray-400 mt-1">Hoy: {stats?.today || 0} | Semana: {stats?.thisWeek || 0} | Mes: {stats?.thisMonth || 0}</p>
        </div>
        <div className="border-t-3 border-green-500 pt-6">
          <p className="text-xs uppercase tracking-widest text-gray-600 mb-2">% Correctas</p>
          <p className="text-4xl font-bold text-green-600">{pctCorrect}%</p>
          <p className="text-xs text-gray-400 mt-1">{stats?.correcta || 0} de {stats?.rated || 0} calificadas</p>
        </div>
        <div className="border-t-3 border-yellow-500 pt-6">
          <p className="text-xs uppercase tracking-widest text-gray-600 mb-2">% Mejorables</p>
          <p className="text-4xl font-bold text-yellow-600">{pctMejorable}%</p>
          <p className="text-xs text-gray-400 mt-1">{stats?.mejorable || 0} de {stats?.rated || 0} calificadas</p>
        </div>
        <div className="border-t-3 border-red-500 pt-6">
          <p className="text-xs uppercase tracking-widest text-gray-600 mb-2">% Erróneas</p>
          <p className="text-4xl font-bold text-red-600">{pctError}%</p>
          <p className="text-xs text-gray-400 mt-1">{stats?.erronea || 0} de {stats?.rated || 0} calificadas</p>
        </div>
      </div>

      {/* Language Stats */}
      {stats && Object.keys(stats.byLang).length > 0 && (
        <div className="mb-8 p-6 bg-gray-50 border border-gray-200">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-600 mb-4">Mensajes por Idioma</h3>
          <div className="flex gap-6 flex-wrap">
            {Object.entries(stats.byLang)
              .sort(([, a], [, b]) => b - a)
              .map(([lang, count]) => (
                <div key={lang} className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase bg-gray-200 px-2 py-1 rounded">{LANG_LABELS[lang] || lang}</span>
                  <span className="text-lg font-bold">{count}</span>
                  <span className="text-xs text-gray-400">({stats.total > 0 ? Math.round((count / stats.total) * 100) : 0}%)</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Calificación</label>
          <select
            value={filterRating}
            onChange={e => setFilterRating(e.target.value)}
            className="px-3 py-2 border border-gray-300 bg-white text-sm focus:border-black outline-none"
          >
            <option value="all">Todas</option>
            <option value="sin_calificar">Sin calificar</option>
            <option value="correcta">Correcta</option>
            <option value="mejorable">Mejorable</option>
            <option value="erronea">Errónea</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Idioma</label>
          <select
            value={filterLang}
            onChange={e => setFilterLang(e.target.value)}
            className="px-3 py-2 border border-gray-300 bg-white text-sm focus:border-black outline-none"
          >
            <option value="all">Todos</option>
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="pt">Português</option>
          </select>
        </div>
        <div className="flex items-end">
          <p className="text-sm text-gray-500">{totalCount} resultado{totalCount !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest">Idioma</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest">Pregunta</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest">Respuesta IA</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest">Modelo</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest">Calificación</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(msg => (
                <tr key={msg.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(msg.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                    <br />
                    {new Date(msg.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold uppercase bg-gray-100 px-2 py-1 rounded">{LANG_LABELS[msg.lang] || msg.lang}</span>
                  </td>
                  <td className="px-4 py-3 text-sm max-w-xs">
                    <button
                      onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                      className="text-left hover:text-black transition-colors"
                    >
                      {expandedId === msg.id
                        ? <span className="whitespace-pre-wrap">{msg.user_message}</span>
                        : <span className="line-clamp-2">{msg.user_message}</span>
                      }
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm max-w-sm">
                    <button
                      onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                      className="text-left text-gray-600 hover:text-black transition-colors"
                    >
                      {expandedId === msg.id
                        ? <span className="whitespace-pre-wrap">{msg.assistant_message}</span>
                        : <span className="line-clamp-2">{msg.assistant_message}</span>
                      }
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{msg.model || '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {ratingLoading === msg.id ? (
                      <span className="text-xs text-gray-400">Guardando...</span>
                    ) : msg.rating ? (
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded font-medium ${RATING_CONFIG[msg.rating].bg} ${RATING_CONFIG[msg.rating].text}`}>
                          {RATING_CONFIG[msg.rating].label}
                        </span>
                        <button
                          onClick={() => handleRate(msg.id, msg.rating === 'correcta' ? 'mejorable' : msg.rating === 'mejorable' ? 'erronea' : 'correcta')}
                          className="text-xs text-gray-400 hover:text-gray-600"
                          title="Cambiar calificación"
                        >
                          &#8635;
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleRate(msg.id, 'correcta')}
                          className="text-xs px-2 py-1 rounded border border-green-300 text-green-700 hover:bg-green-50 transition-colors"
                          title="Correcta"
                        >
                          &#10003;
                        </button>
                        <button
                          onClick={() => handleRate(msg.id, 'mejorable')}
                          className="text-xs px-2 py-1 rounded border border-yellow-300 text-yellow-700 hover:bg-yellow-50 transition-colors"
                          title="Mejorable"
                        >
                          ~
                        </button>
                        <button
                          onClick={() => handleRate(msg.id, 'erronea')}
                          className="text-xs px-2 py-1 rounded border border-red-300 text-red-700 hover:bg-red-50 transition-colors"
                          title="Errónea"
                        >
                          &#10007;
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {messages.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    No hay conversaciones{filterRating !== 'all' || filterLang !== 'all' ? ' con estos filtros' : ' todavía'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Página {page + 1} de {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1.5 text-sm border border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1.5 text-sm border border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
