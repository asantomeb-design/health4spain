'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

interface AiConfig {
  id: string;
  enabled: boolean;
  model_proposals: string;
  model_writer: string;
  model_translator: string;
  model_image: string;
  temperature_proposals: number;
  temperature_writer: number;
  temperature_translator: number;
  target_word_count: number;
  image_size: string;
  image_style: string;
  news_country: string;
  news_language: string;
  news_timeframe: string;
  editorial_guidelines: string;
  proposals_system_prompt: string;
  writer_system_prompt: string;
  translator_system_prompt: string;
  updated_at: string;
}

const TIMEFRAMES = [
  { value: 'qdr:d', label: 'Últimas 24 horas' },
  { value: 'qdr:w', label: 'Última semana' },
  { value: 'qdr:m', label: 'Último mes' },
];

const IMAGE_SIZES = [
  { value: 'auto', label: 'Automático (recomendado para gpt-image)' },
  { value: '1536x1024', label: '1536×1024 horizontal (gpt-image)' },
  { value: '1024x1536', label: '1024×1536 vertical (gpt-image)' },
  { value: '1024x1024', label: '1024×1024 cuadrado' },
  { value: '1792x1024', label: '1792×1024 horizontal (solo DALL·E 3)' },
  { value: '1024x1792', label: '1024×1792 vertical (solo DALL·E 3)' },
];

export default function BlogAIConfigPage() {
  const { fetchWithAuth } = useAuth();
  const [config, setConfig] = useState<AiConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    void load();
  }, []);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth('/api/admin/blog/ai/config');
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Error cargando configuración');
      setConfig(json.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    if (!config) return;
    setSaving(true);
    setError(null);
    try {
      const { id, updated_at, ...payload } = config;
      void id;
      void updated_at;
      const res = await fetchWithAuth('/api/admin/blog/ai/config', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Error guardando');
      setConfig(json.data);
      setSavedAt(new Date().toLocaleTimeString('es-ES'));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setSaving(false);
    }
  };

  const update = <K extends keyof AiConfig>(key: K, value: AiConfig[K]) => {
    setConfig((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-72" />
          <div className="h-64 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          {error || 'No se ha podido cargar la configuración. ¿Has ejecutado supabase/15-ai-blog-config.sql?'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href="/administrator/blog"
            className="text-xs text-gray-500 hover:text-gray-700 inline-flex items-center gap-1 mb-2"
          >
            ← Volver al blog
          </Link>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Configuración del asistente IA</h1>
          <p className="text-gray-500 mt-1 text-sm">Modelos, prompts y guía editorial. Última actualización: {new Date(config.updated_at).toLocaleString('es-ES')}</p>
        </div>
        <div className="flex items-center gap-3">
          {savedAt && <span className="text-xs text-green-600">Guardado a las {savedAt}</span>}
          <button
            onClick={save}
            disabled={saving}
            className="px-5 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
      )}

      {/* Estado */}
      <Section title="Estado">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => update('enabled', e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">Asistente activado</span>
        </label>
      </Section>

      {/* Modelos */}
      <Section title="Modelos OpenAI">
        <Grid>
          <Field label="Modelo para propuestas (rápido)" hint="Genera 3 títulos. Usa un modelo barato/rápido.">
            <input
              type="text"
              value={config.model_proposals}
              onChange={(e) => update('model_proposals', e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Modelo redactor (calidad)" hint="Modelo flagship con razonamiento. Ej: gpt-5.5">
            <input
              type="text"
              value={config.model_writer}
              onChange={(e) => update('model_writer', e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Modelo traductor" hint="Suele coincidir con el redactor.">
            <input
              type="text"
              value={config.model_translator}
              onChange={(e) => update('model_translator', e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Modelo de imagen" hint="Ej: gpt-image-2">
            <input
              type="text"
              value={config.model_image}
              onChange={(e) => update('model_image', e.target.value)}
              className="input"
            />
          </Field>
        </Grid>

        <Grid>
          <Field label={`Temperatura propuestas (${config.temperature_proposals})`}>
            <input
              type="range"
              min={0}
              max={2}
              step={0.1}
              value={config.temperature_proposals}
              onChange={(e) => update('temperature_proposals', parseFloat(e.target.value))}
              className="w-full"
            />
          </Field>
          <Field label={`Temperatura redactor (${config.temperature_writer})`}>
            <input
              type="range"
              min={0}
              max={2}
              step={0.1}
              value={config.temperature_writer}
              onChange={(e) => update('temperature_writer', parseFloat(e.target.value))}
              className="w-full"
            />
          </Field>
          <Field label={`Temperatura traductor (${config.temperature_translator})`}>
            <input
              type="range"
              min={0}
              max={2}
              step={0.1}
              value={config.temperature_translator}
              onChange={(e) => update('temperature_translator', parseFloat(e.target.value))}
              className="w-full"
            />
          </Field>
          <Field label="Longitud objetivo (palabras)">
            <input
              type="number"
              min={600}
              max={4000}
              value={config.target_word_count}
              onChange={(e) => update('target_word_count', parseInt(e.target.value, 10) || 1700)}
              className="input"
            />
          </Field>
        </Grid>
      </Section>

      {/* Imagen */}
      <Section title="Portadas (gpt-image-2)">
        <Grid>
          <Field
            label="Tamaño de imagen"
            hint="gpt-image / gpt-image-2 solo admiten auto, 1024², 1536×1024 y 1024×1536. Si eliges 1792×1024 con ese modelo, el servidor lo adaptará automáticamente."
          >
            <select
              value={config.image_size}
              onChange={(e) => update('image_size', e.target.value)}
              className="input"
            >
              {IMAGE_SIZES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Estilo visual base" hint="Se concatena al prompt de la imagen.">
            <textarea
              rows={3}
              value={config.image_style}
              onChange={(e) => update('image_style', e.target.value)}
              className="input"
            />
          </Field>
        </Grid>
      </Section>

      {/* Noticias */}
      <Section title="Búsqueda de noticias (SerpAPI Google News)">
        <Grid>
          <Field label="País (código ISO)">
            <input
              type="text"
              maxLength={2}
              value={config.news_country}
              onChange={(e) => update('news_country', e.target.value.toLowerCase())}
              className="input"
            />
          </Field>
          <Field label="Idioma (hl)">
            <input
              type="text"
              maxLength={2}
              value={config.news_language}
              onChange={(e) => update('news_language', e.target.value.toLowerCase())}
              className="input"
            />
          </Field>
          <Field label="Ventana temporal">
            <select
              value={config.news_timeframe}
              onChange={(e) => update('news_timeframe', e.target.value)}
              className="input"
            >
              {TIMEFRAMES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </Field>
        </Grid>
      </Section>

      {/* Guía editorial */}
      <Section title="Guía de estilo editorial" hint="Se inyecta en TODOS los prompts de la IA.">
        <textarea
          rows={18}
          value={config.editorial_guidelines}
          onChange={(e) => update('editorial_guidelines', e.target.value)}
          className="input font-mono text-xs"
        />
      </Section>

      {/* Prompts */}
      <Section title="Prompt de sistema — Propuestas de títulos">
        <textarea
          rows={10}
          value={config.proposals_system_prompt}
          onChange={(e) => update('proposals_system_prompt', e.target.value)}
          className="input font-mono text-xs"
        />
      </Section>

      <Section title="Prompt de sistema — Redactor">
        <textarea
          rows={14}
          value={config.writer_system_prompt}
          onChange={(e) => update('writer_system_prompt', e.target.value)}
          className="input font-mono text-xs"
        />
      </Section>

      <Section title="Prompt de sistema — Traductor">
        <textarea
          rows={10}
          value={config.translator_system_prompt}
          onChange={(e) => update('translator_system_prompt', e.target.value)}
          className="input font-mono text-xs"
        />
        <p className="text-xs text-gray-400 mt-1">
          Las variables <code>{'{source_lang}'}</code> y <code>{'{target_lang}'}</code> se sustituyen automáticamente.
        </p>
      </Section>

      <div className="flex justify-end pt-2 pb-12">
        <button
          onClick={save}
          disabled={saving}
          className="px-6 py-2.5 bg-accent text-white rounded-lg hover:bg-accent-600 disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.15s;
        }
        :global(.input:focus) {
          box-shadow: 0 0 0 2px rgba(41, 63, 146, 0.2);
          border-color: rgba(41, 63, 146, 0.5);
        }
      `}</style>
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-xl border p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">{title}</h2>
      {hint && <p className="text-xs text-gray-500 mb-4">{hint}</p>}
      <div className={hint ? '' : 'mt-3'}>{children}</div>
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">{children}</div>;
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}
