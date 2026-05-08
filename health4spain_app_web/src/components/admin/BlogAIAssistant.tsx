'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

type Mode = 'blog' | 'news';
type Lang = 'es' | 'en' | 'de' | 'fr' | 'pt';
type Category = 'guias' | 'tramites' | 'vida-espana' | 'noticias' | 'testimonios';

interface Proposal {
  title: string;
  angle: string;
  target_keywords: string[];
  why_it_works: string;
  suggested_category: string;
}

interface NewsItem {
  title: string;
  link: string;
  source: string;
  date: string | null;
  snippet: string | null;
}

interface DraftDoc {
  title: string;
  slug: string;
  excerpt: string;
  meta_title: string;
  meta_description: string;
  content_html: string;
  tags: string[];
  sources: Array<{ title?: string; url?: string }>;
  category: Category;
  language: Lang;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (slug: string) => void;
}

// El wizard fuerza siempre español como idioma origen. Las traducciones a
// los demás idiomas se generan después desde el editor del artículo con el
// botón "Traducir con IA". Esto garantiza una única fuente de verdad por
// grupo de traducción y evita que la IA cree el primer artículo en un
// idioma que luego haya que volver a traducir.

const CATEGORY_OPTIONS: Array<{ value: Category | ''; label: string }> = [
  { value: '', label: 'Auto (la decide la IA)' },
  { value: 'guias', label: 'Guías' },
  { value: 'tramites', label: 'Trámites' },
  { value: 'vida-espana', label: 'Vida en España' },
  { value: 'noticias', label: 'Noticias' },
  { value: 'testimonios', label: 'Testimonios' },
];

type Step = 1 | 2 | 3 | 4;

const PROGRESS_MESSAGES = [
  'Analizando el ángulo del artículo...',
  'Buscando fuentes y referencias actualizadas...',
  'Estructurando secciones...',
  'Redactando introducción y desarrollo...',
  'Optimizando SEO y enlaces internos...',
  'Casi listo, dando los últimos retoques...',
];

export default function BlogAIAssistant({ isOpen, onClose, onSaved }: Props) {
  const router = useRouter();
  const { fetchWithAuth } = useAuth();

  const [step, setStep] = useState<Step>(1);
  const [mode, setMode] = useState<Mode>('blog');
  const [language, setLanguage] = useState<Lang>('es');
  const [category, setCategory] = useState<Category | ''>('');
  const [extraContext, setExtraContext] = useState('');
  const [newsQuery, setNewsQuery] = useState('');

  const [loading, setLoading] = useState(false);
  const [progressIdx, setProgressIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [newsHeadlines, setNewsHeadlines] = useState<NewsItem[]>([]);
  const [selectedProposalIdx, setSelectedProposalIdx] = useState<number | null>(null);

  const [draft, setDraft] = useState<DraftDoc | null>(null);
  const [coverUrl, setCoverUrl] = useState<string>('');
  const [coverPromptExtra, setCoverPromptExtra] = useState('');

  // Reset al abrir
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setMode('blog');
      setLanguage('es');
      setCategory('');
      setExtraContext('');
      setNewsQuery('');
      setError(null);
      setProposals([]);
      setNewsHeadlines([]);
      setSelectedProposalIdx(null);
      setDraft(null);
      setCoverUrl('');
      setCoverPromptExtra('');
      setLoading(false);
    }
  }, [isOpen]);

  // Rotación de mensajes de progreso durante loading prolongado
  useEffect(() => {
    if (!loading) {
      setProgressIdx(0);
      return;
    }
    const id = setInterval(() => {
      setProgressIdx((i) => (i + 1) % PROGRESS_MESSAGES.length);
    }, 4500);
    return () => clearInterval(id);
  }, [loading]);

  const selectedProposal = useMemo(
    () => (selectedProposalIdx !== null ? proposals[selectedProposalIdx] : null),
    [proposals, selectedProposalIdx]
  );

  const fetchProposals = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth('/api/admin/blog/ai/suggest-titles', {
        method: 'POST',
        body: JSON.stringify({
          mode,
          language,
          category: category || null,
          extra_context: extraContext.trim() || undefined,
          news_query: mode === 'news' ? newsQuery.trim() || undefined : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Error obteniendo propuestas');
      }
      setProposals(json.data.proposals || []);
      setNewsHeadlines(json.data.news_headlines || []);
      setStep(2);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const writeArticle = async () => {
    if (!selectedProposal) return;
    setLoading(true);
    setError(null);
    setStep(3);
    try {
      const finalCategory = (selectedProposal.suggested_category as Category) || (category as Category) || 'guias';
      const res = await fetchWithAuth('/api/admin/blog/ai/write', {
        method: 'POST',
        body: JSON.stringify({
          title: selectedProposal.title,
          angle: selectedProposal.angle,
          language,
          category: finalCategory,
          target_keywords: selectedProposal.target_keywords,
          extra_context: extraContext.trim() || undefined,
          source_hints:
            mode === 'news'
              ? newsHeadlines.slice(0, 6).map((n) => ({
                  title: n.title,
                  url: n.link,
                  snippet: n.snippet || undefined,
                }))
              : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Error redactando el artículo');
      }
      setDraft({ ...json.data, category: finalCategory, language });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      setError(msg);
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const generateCover = async () => {
    if (!draft) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth('/api/admin/blog/ai/generate-cover', {
        method: 'POST',
        body: JSON.stringify({
          title: draft.title,
          excerpt: draft.excerpt,
          prompt_extra: coverPromptExtra.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Error generando portada');
      }
      setCoverUrl(json.data.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = async () => {
    if (!draft) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth('/api/admin/blog/ai/save-draft', {
        method: 'POST',
        body: JSON.stringify({
          title: draft.title,
          slug: draft.slug,
          excerpt: draft.excerpt,
          content_html: draft.content_html,
          meta_title: draft.meta_title,
          meta_description: draft.meta_description,
          featured_image: coverUrl || undefined,
          category: draft.category,
          language,
          tags: draft.tags,
          sources: draft.sources,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Error guardando borrador');
      }
      onSaved?.(json.data.slug);
      onClose();
      router.push(json.data.admin_url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-xl font-serif font-bold text-gray-900">Asistente IA del Blog</h2>
            <p className="text-xs text-gray-500 mt-1">
              Paso {step} de 4 · {step === 1 ? 'Tipo de contenido' : step === 2 ? 'Propuesta de título' : step === 3 ? 'Redacción y portada' : 'Confirmación'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* PASO 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">¿Qué quieres crear?</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setMode('blog')}
                    className={`p-6 rounded-xl border-2 text-left transition ${
                      mode === 'blog'
                        ? 'border-accent bg-accent/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">📝</div>
                    <div className="font-semibold">Artículo de blog</div>
                    <p className="text-xs text-gray-500 mt-1">
                      Guía, trámite, comparativa o tema evergreen. La IA propondrá títulos
                      complementarios al blog actual.
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('news')}
                    className={`p-6 rounded-xl border-2 text-left transition ${
                      mode === 'news'
                        ? 'border-accent bg-accent/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">📰</div>
                    <div className="font-semibold">Noticia</div>
                    <p className="text-xs text-gray-500 mt-1">
                      Buscamos titulares recientes y la IA propone ángulos editoriales
                      basados en lo que está pasando ahora.
                    </p>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="rounded-lg border border-purple-200 bg-purple-50/60 px-3 py-2 text-sm text-purple-900 flex items-center gap-2">
                  <span>🇪🇸</span>
                  <span>
                    <strong>Idioma origen: español.</strong> Una vez guardado el borrador, podrás abrirlo y traducirlo a otros idiomas con el botón <em>Traducir con IA</em>.
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoría sugerida</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category | '')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {mode === 'news' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Búsqueda de noticias <span className="text-gray-400 font-normal">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={newsQuery}
                    onChange={(e) => setNewsQuery(e.target.value)}
                    placeholder='Ej: "visa nómada digital España", "seguros expatriados"'
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Si lo dejas vacío, buscaremos noticias generales para extranjeros viviendo en España.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pista para la IA <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <textarea
                  value={extraContext}
                  onChange={(e) => setExtraContext(e.target.value)}
                  rows={3}
                  placeholder="Ej: enfocado en jubilados británicos, evitar tema fiscal, mencionar Costa Blanca..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* PASO 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Elige una propuesta. Verás el ángulo, las palabras clave y por qué encaja en
                vuestra estrategia editorial.
              </p>
              <div className="space-y-3">
                {proposals.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedProposalIdx(idx)}
                    className={`w-full p-5 rounded-xl border-2 text-left transition ${
                      selectedProposalIdx === idx
                        ? 'border-accent bg-accent/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-1 w-5 h-5 rounded-full flex-shrink-0 border-2 ${
                          selectedProposalIdx === idx ? 'border-accent bg-accent' : 'border-gray-300'
                        }`}
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{p.title}</div>
                        <p className="text-sm text-gray-600 mt-2">{p.angle}</p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {p.target_keywords.map((kw, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                              {kw}
                            </span>
                          ))}
                        </div>
                        {p.why_it_works && (
                          <p className="text-xs text-gray-500 mt-2 italic">💡 {p.why_it_works}</p>
                        )}
                        {p.suggested_category && (
                          <p className="text-xs text-gray-400 mt-1">
                            Categoría sugerida: <strong>{p.suggested_category}</strong>
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {mode === 'news' && newsHeadlines.length > 0 && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    Ver titulares de noticias usados ({newsHeadlines.length})
                  </summary>
                  <ul className="mt-2 space-y-1.5 text-xs text-gray-600 pl-4">
                    {newsHeadlines.map((n, i) => (
                      <li key={i}>
                        <a href={n.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {n.title}
                        </a>
                        <span className="text-gray-400"> — {n.source} {n.date && `· ${n.date}`}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          )}

          {/* PASO 3 */}
          {step === 3 && (
            <div className="space-y-6">
              {!draft && loading && (
                <LoadingPanel message={PROGRESS_MESSAGES[progressIdx]} />
              )}

              {draft && (
                <>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Título</p>
                    <h3 className="text-lg font-bold text-gray-900">{draft.title}</h3>
                    <p className="text-xs text-gray-500 mt-2">/{draft.slug}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <Stat label="Palabras (aprox)" value={countWords(draft.content_html).toString()} />
                    <Stat label="Tags" value={draft.tags.length.toString()} />
                    <Stat label="Fuentes" value={draft.sources.length.toString()} />
                  </div>

                  <details className="bg-white border rounded-xl">
                    <summary className="cursor-pointer px-4 py-3 font-medium text-sm">Vista previa del artículo</summary>
                    <div
                      className="prose prose-sm max-w-none px-4 pb-4"
                      dangerouslySetInnerHTML={{ __html: draft.content_html }}
                    />
                  </details>

                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-3">Imagen de portada</h4>
                    {coverUrl ? (
                      <div className="space-y-3">
                        <img src={coverUrl} alt="Portada generada" className="w-full rounded-xl border" />
                        <input
                          type="text"
                          value={coverPromptExtra}
                          onChange={(e) => setCoverPromptExtra(e.target.value)}
                          placeholder="Indicación adicional para regenerar (opcional)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none"
                        />
                        <button
                          type="button"
                          onClick={generateCover}
                          disabled={loading}
                          className="text-sm text-accent hover:underline disabled:opacity-50"
                        >
                          🔄 Regenerar portada
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={coverPromptExtra}
                          onChange={(e) => setCoverPromptExtra(e.target.value)}
                          placeholder='Indicación opcional. Ej: "ambientación mediterránea, paleta cálida"'
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none"
                        />
                        <button
                          type="button"
                          onClick={generateCover}
                          disabled={loading}
                          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 disabled:opacity-50"
                        >
                          {loading ? 'Generando...' : '✨ Generar portada con IA'}
                        </button>
                        <p className="text-xs text-gray-400">
                          También puedes saltarte este paso y elegir la portada después desde el editor.
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer / Acciones */}
        <div className="border-t px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (step === 1) onClose();
              else setStep((s) => Math.max(1, s - 1) as Step);
            }}
            disabled={loading}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
          >
            {step === 1 ? 'Cancelar' : 'Atrás'}
          </button>

          <div className="flex gap-2">
            {step === 1 && (
              <button
                type="button"
                onClick={fetchProposals}
                disabled={loading}
                className="px-5 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 disabled:opacity-50 inline-flex items-center gap-2"
              >
                {loading ? 'Generando propuestas...' : 'Proponer 3 títulos →'}
              </button>
            )}
            {step === 2 && (
              <>
                <button
                  type="button"
                  onClick={fetchProposals}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  🔄 Regenerar
                </button>
                <button
                  type="button"
                  onClick={writeArticle}
                  disabled={loading || selectedProposalIdx === null}
                  className="px-5 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 disabled:opacity-50"
                >
                  Escribir artículo →
                </button>
              </>
            )}
            {step === 3 && draft && (
              <button
                type="button"
                onClick={saveDraft}
                disabled={loading}
                className="px-5 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar borrador'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingPanel({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-14 h-14 border-4 border-accent border-t-transparent rounded-full animate-spin mb-6" />
      <p className="text-base font-medium text-gray-700">{message}</p>
      <p className="text-xs text-gray-400 mt-2">
        Esto puede tardar entre 30 segundos y 2 minutos según la longitud del artículo.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 text-center">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
}

function countWords(html: string): number {
  if (!html) return 0;
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!text) return 0;
  return text.split(' ').length;
}
