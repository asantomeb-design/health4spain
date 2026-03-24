'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { ChatbotConfig } from '@/lib/types';

// Modelos de Chat Completions de OpenAI (generativos de texto para chat)
const AVAILABLE_MODELS = [
  { id: 'gpt-4o', label: 'GPT-4o (más capaz)' },
  { id: 'gpt-4o-mini', label: 'GPT-4o Mini (equilibrado)' },
  { id: 'gpt-4.1', label: 'GPT-4.1 (coding / web)' },
  { id: 'gpt-4.1-mini', label: 'GPT-4.1 Mini' },
  { id: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  { id: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (más rápido)' },
];

const KNOWLEDGE_TABLES = [
  { id: 'servicios_catalogo', label: 'Catálogo de Servicios' },
  { id: 'ciudades_contenido', label: 'Contenido de Ciudades' },
  { id: 'blog_posts', label: 'Posts del Blog' },
  { id: 'landing_pages', label: 'Landing Pages' },
];

const LANGUAGES = ['es', 'en', 'fr', 'de', 'pt'] as const;
const LANG_LABELS: Record<string, string> = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
};

const DEFAULT_CONFIG: Omit<ChatbotConfig, 'id' | 'created_at' | 'updated_at'> = {
  enabled: false,
  model: 'gpt-4o-mini',
  temperature: 0.7,
  max_tokens: 1024,
  top_p: 1.0,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
  system_prompt: `Eres el asistente virtual de Health4Spain, plataforma especializada en ayudar a extranjeros que quieren vivir, estudiar, trabajar o retirarse en España, con presencia en 19 ciudades de la Región de Murcia y la Provincia de Alicante. Tu conocimiento está basado en el libro oficial "Vivir en España desde Alicante y Murcia" (2026).

IDIOMAS
Responde SIEMPRE en el idioma en que te escriba el usuario, sin comentar el cambio.
Idiomas: Español | Inglés | Francés | Alemán | Portugués

LOS 4 SERVICIOS (orden de prioridad)
1. Seguros de Salud → Asisa, Aegon, Sanitas, DKV (en este orden)
2. Abogados → Extranjería, visados, residencia, reagrupación, inmobiliaria
3. Gestorías → NIE, empadronamiento, fiscal, autónomos, homologación
4. Inmobiliarias → Compra y alquiler para extranjeros

LOS 4 PERFILES
1. Jubilados/No Lucrativa → ~28.000€/año, seguro privado obligatorio. Ciudades top: Torrevieja, Orihuela, Benidorm, Mazarrón, San Javier
2. Trabajadores → Visado trabajo, autónomos, homologación títulos. Ciudades top: Murcia, Alicante, Cartagena, Elche
3. Estudiantes → Visado estudios, seguro obligatorio, cuenta bancaria. Ciudades top: Murcia, Alicante, Cartagena
4. Familias → Reagrupación, escuelas, residencia familiar. Ciudades top: Orihuela, Torrevieja, Murcia, Alicante, Dénia

CÓMO RESPONDER
- Tono cercano y claro, como un amigo experto
- Si mencionan una ciudad, enfoca la respuesta en esa ubicación
- Recomienda el servicio H4S adecuado para cada caso
- Menciona el libro como recurso gratuito cuando sea relevante
- Al detectar necesidad clara, invitar siempre al formulario: "¿Quieres que te conectemos? Rellena el formulario, te contactamos en <24h."
- Nunca dar asesoramiento legal o fiscal vinculante
- Si no tienes certeza, derivar siempre al especialista H4S`,
  agent_name: 'Asistente Health4Spain',
  agent_avatar: '🏥',
  primary_color: '#293f92',
  welcome_message: {
    es: '¡Hola! 👋 Soy el asistente virtual de Health4Spain. ¿En qué puedo ayudarte?',
    en: "Hello! 👋 I'm the Health4Spain virtual assistant. How can I help you?",
    fr: 'Bonjour! 👋 Je suis l\'assistant virtuel de Health4Spain. Comment puis-je vous aider?',
    de: 'Hallo! 👋 Ich bin der virtuelle Assistent von Health4Spain. Wie kann ich Ihnen helfen?',
    pt: 'Olá! 👋 Sou o assistente virtual da Health4Spain. Como posso ajudá-lo?',
  },
  suggested_questions: {
    es: ['¿Qué seguros de salud ofrecéis?', 'Necesito un abogado de extranjería', '¿En qué ciudades operáis?', '¿Cómo funciona el servicio?'],
    en: ['What health insurance do you offer?', 'I need an immigration lawyer', 'In which cities do you operate?', 'How does the service work?'],
    fr: ["Quelles assurances santé proposez-vous?", "J'ai besoin d'un avocat en immigration", "Dans quelles villes êtes-vous présents?", "Comment fonctionne le service?"],
    de: ['Welche Krankenversicherungen bieten Sie an?', 'Ich brauche einen Einwanderungsanwalt', 'In welchen Städten sind Sie tätig?', 'Wie funktioniert der Service?'],
    pt: ['Que seguros de saúde oferecem?', 'Preciso de um advogado de imigração', 'Em que cidades operam?', 'Como funciona o serviço?'],
  },
  knowledge_tables: ['servicios_catalogo', 'ciudades_contenido', 'blog_posts', 'landing_pages'],
  max_context_items: 10,
  max_history_messages: 10,
};

export default function ChatIAConfigPage() {
  const [config, setConfig] = useState<ChatbotConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'modelo' | 'prompts' | 'apariencia' | 'mensajes' | 'conocimiento'>('general');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const { data, error: err } = await supabase
        .from('chatbot_config')
        .select('*')
        .limit(1)
        .single();

      if (err && err.code === 'PGRST116') {
        const { data: newData, error: insertErr } = await supabase
          .from('chatbot_config')
          .insert(DEFAULT_CONFIG)
          .select()
          .single();
        if (insertErr) throw insertErr;
        setConfig(newData);
      } else if (err) {
        throw err;
      } else {
        setConfig(data);
      }
    } catch (e: any) {
      setError(e.message || 'Error cargando configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const { id, created_at, updated_at, ...updateData } = config;
      const { error: err } = await supabase
        .from('chatbot_config')
        .update(updateData)
        .eq('id', id);

      if (err) throw err;
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e.message || 'Error guardando configuración');
    } finally {
      setSaving(false);
    }
  };

  const updateField = useCallback(<K extends keyof ChatbotConfig>(field: K, value: ChatbotConfig[K]) => {
    setConfig(prev => prev ? { ...prev, [field]: value } : prev);
  }, []);

  const setEnabledAndPersist = useCallback(async (newEnabled: boolean) => {
    if (!config?.id) return;
    updateField('enabled', newEnabled);
    const { error } = await supabase
      .from('chatbot_config')
      .update({ enabled: newEnabled })
      .eq('id', config.id);
    if (error) {
      updateField('enabled', !newEnabled);
      setError(error.message);
    }
  }, [config?.id, updateField]);

  const updateWelcomeMessage = useCallback((lang: string, value: string) => {
    setConfig(prev => {
      if (!prev) return prev;
      return { ...prev, welcome_message: { ...prev.welcome_message, [lang]: value } };
    });
  }, []);

  const updateSuggestedQuestion = useCallback((lang: string, index: number, value: string) => {
    setConfig(prev => {
      if (!prev) return prev;
      const questions = [...(prev.suggested_questions[lang] || [])];
      questions[index] = value;
      return { ...prev, suggested_questions: { ...prev.suggested_questions, [lang]: questions } };
    });
  }, []);

  const addSuggestedQuestion = useCallback((lang: string) => {
    setConfig(prev => {
      if (!prev) return prev;
      const questions = [...(prev.suggested_questions[lang] || []), ''];
      return { ...prev, suggested_questions: { ...prev.suggested_questions, [lang]: questions } };
    });
  }, []);

  const removeSuggestedQuestion = useCallback((lang: string, index: number) => {
    setConfig(prev => {
      if (!prev) return prev;
      const questions = (prev.suggested_questions[lang] || []).filter((_, i) => i !== index);
      return { ...prev, suggested_questions: { ...prev.suggested_questions, [lang]: questions } };
    });
  }, []);

  const toggleKnowledgeTable = useCallback((tableId: string) => {
    setConfig(prev => {
      if (!prev) return prev;
      const tables = prev.knowledge_tables.includes(tableId)
        ? prev.knowledge_tables.filter(t => t !== tableId)
        : [...prev.knowledge_tables, tableId];
      return { ...prev, knowledge_tables: tables };
    });
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-4">Configurador Chat IA</h1>
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
          <p className="text-red-700">Error: No se pudo cargar la configuración. Asegúrate de haber ejecutado el SQL de la tabla <code>chatbot_config</code>.</p>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'general' as const, label: 'General' },
    { id: 'modelo' as const, label: 'Modelo IA' },
    { id: 'prompts' as const, label: 'Prompts' },
    { id: 'apariencia' as const, label: 'Apariencia' },
    { id: 'mensajes' as const, label: 'Mensajes' },
    { id: 'conocimiento' as const, label: 'Conocimiento' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-10 pb-8 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Configurador Chat IA</h1>
          <p className="text-lg text-gray-600">Configura el agente de IA que atenderá a los visitantes</p>
        </div>
        <div className="flex items-center gap-4">
          {saved && <span className="text-green-600 font-medium text-sm">Guardado correctamente</span>}
          {error && <span className="text-red-500 text-sm max-w-xs truncate">{error}</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-black text-white font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: General */}
      {activeTab === 'general' && (
        <div className="space-y-8 max-w-2xl">
          <div className="flex items-center justify-between p-6 bg-gray-50 border border-gray-200">
            <div>
              <h3 className="text-lg font-bold">Estado del Chat</h3>
              <p className="text-sm text-gray-600 mt-1">Activa o desactiva el chat en el sitio web</p>
            </div>
            <button
              onClick={() => setEnabledAndPersist(!config.enabled)}
              className={`relative w-14 h-7 rounded-full transition-colors overflow-hidden ${
                config.enabled ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform left-0.5 ${
                  config.enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="p-6 bg-gray-50 border border-gray-200">
            <h3 className="text-lg font-bold mb-4">Historial de Conversación</h3>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Máx. mensajes de historial enviados a la IA: <strong>{config.max_history_messages}</strong>
            </label>
            <input
              type="range"
              min={2}
              max={30}
              value={config.max_history_messages}
              onChange={e => updateField('max_history_messages', parseInt(e.target.value))}
              className="w-full accent-black"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>2</span>
              <span>30</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Modelo IA */}
      {activeTab === 'modelo' && (
        <div className="space-y-8 max-w-2xl">
          <div className="p-6 bg-gray-50 border border-gray-200">
            <h3 className="text-lg font-bold mb-4">Modelo OpenAI</h3>
            <select
              value={config.model}
              onChange={e => updateField('model', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 bg-white text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
            >
              {AVAILABLE_MODELS.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>

          {[
            { field: 'temperature' as const, label: 'Temperature', min: 0, max: 2, step: 0.1, desc: 'Controla la creatividad. 0 = determinístico, 2 = muy creativo.' },
            { field: 'max_tokens' as const, label: 'Max Tokens', min: 100, max: 4096, step: 100, desc: 'Límite de tokens por respuesta del agente.' },
            { field: 'top_p' as const, label: 'Top P', min: 0, max: 1, step: 0.05, desc: 'Nucleus sampling. 1.0 = sin restricción.' },
            { field: 'frequency_penalty' as const, label: 'Frequency Penalty', min: 0, max: 2, step: 0.1, desc: 'Penaliza repetición de tokens ya usados.' },
            { field: 'presence_penalty' as const, label: 'Presence Penalty', min: 0, max: 2, step: 0.1, desc: 'Incentiva hablar de temas nuevos.' },
          ].map(param => (
            <div key={param.field} className="p-6 bg-gray-50 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold uppercase tracking-wider">{param.label}</h3>
                <span className="text-lg font-mono font-bold">{config[param.field]}</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">{param.desc}</p>
              <input
                type="range"
                min={param.min}
                max={param.max}
                step={param.step}
                value={config[param.field]}
                onChange={e => updateField(param.field, parseFloat(e.target.value))}
                className="w-full accent-black"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{param.min}</span>
                <span>{param.max}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Prompts */}
      {activeTab === 'prompts' && (
        <div className="space-y-8 max-w-3xl">
          <div className="p-6 bg-gray-50 border border-gray-200">
            <h3 className="text-lg font-bold mb-2">System Prompt</h3>
            <p className="text-sm text-gray-600 mb-4">
              Este es el prompt de sistema que define la personalidad y comportamiento del agente. Se envía al inicio de cada conversación junto con el contexto de la base de datos.
            </p>
            <textarea
              value={config.system_prompt}
              onChange={e => updateField('system_prompt', e.target.value)}
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 bg-white text-sm font-mono focus:border-black focus:ring-1 focus:ring-black outline-none resize-y"
              placeholder="Eres un asistente virtual..."
            />
            <p className="text-xs text-gray-400 mt-2">
              Tip: El contexto de la base de datos (servicios, ciudades, blog, etc.) se añade automáticamente después de este prompt.
            </p>
          </div>
        </div>
      )}

      {/* Tab: Apariencia */}
      {activeTab === 'apariencia' && (
        <div className="space-y-8 max-w-2xl">
          <div className="p-6 bg-gray-50 border border-gray-200">
            <h3 className="text-lg font-bold mb-4">Nombre del Agente</h3>
            <input
              type="text"
              value={config.agent_name}
              onChange={e => updateField('agent_name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 bg-white text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
              placeholder="Asistente Health4Spain"
            />
          </div>

          <div className="p-6 bg-gray-50 border border-gray-200">
            <h3 className="text-lg font-bold mb-4">Avatar del Agente</h3>
            <p className="text-sm text-gray-600 mb-3">Emoji o texto corto que aparece como avatar</p>
            <input
              type="text"
              value={config.agent_avatar}
              onChange={e => updateField('agent_avatar', e.target.value)}
              className="w-32 px-4 py-3 border border-gray-300 bg-white text-2xl text-center focus:border-black focus:ring-1 focus:ring-black outline-none"
              maxLength={4}
            />
          </div>

          <div className="p-6 bg-gray-50 border border-gray-200">
            <h3 className="text-lg font-bold mb-4">Color Principal</h3>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={config.primary_color}
                onChange={e => updateField('primary_color', e.target.value)}
                className="w-16 h-12 border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={config.primary_color}
                onChange={e => updateField('primary_color', e.target.value)}
                className="w-32 px-4 py-3 border border-gray-300 bg-white text-sm font-mono focus:border-black focus:ring-1 focus:ring-black outline-none"
                placeholder="#293f92"
              />
            </div>
          </div>

          {/* Mini Preview */}
          <div className="p-6 bg-gray-50 border border-gray-200">
            <h3 className="text-lg font-bold mb-4">Vista Previa</h3>
            <div className="bg-white rounded-2xl shadow-lg w-80 overflow-hidden border border-gray-200 mx-auto">
              <div className="text-white p-4" style={{ backgroundColor: config.primary_color }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <span className="text-xl">{config.agent_avatar}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{config.agent_name}</h4>
                    <p className="text-xs text-white/80">Online</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50">
                <div className="bg-white rounded-lg p-3 shadow-sm mb-3">
                  <p className="text-sm text-gray-700">{config.welcome_message?.es || 'Mensaje de bienvenida...'}</p>
                </div>
                <div className="space-y-1.5">
                  {(config.suggested_questions?.es || []).slice(0, 3).map((q, i) => (
                    <div key={i} className="text-xs px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 truncate">
                      {q}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Mensajes */}
      {activeTab === 'mensajes' && (
        <div className="space-y-8 max-w-3xl">
          {/* Welcome Messages */}
          <div className="p-6 bg-gray-50 border border-gray-200">
            <h3 className="text-lg font-bold mb-4">Mensaje de Bienvenida</h3>
            <p className="text-sm text-gray-600 mb-4">El primer mensaje que ve el usuario al abrir el chat, por idioma.</p>
            <div className="space-y-3">
              {LANGUAGES.map(lang => (
                <div key={lang}>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    {LANG_LABELS[lang]}
                  </label>
                  <input
                    type="text"
                    value={config.welcome_message?.[lang] || ''}
                    onChange={e => updateWelcomeMessage(lang, e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 bg-white text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Questions */}
          <div className="p-6 bg-gray-50 border border-gray-200">
            <h3 className="text-lg font-bold mb-4">Preguntas Sugeridas</h3>
            <p className="text-sm text-gray-600 mb-4">Chips clickeables que aparecen debajo del mensaje de bienvenida.</p>
            {LANGUAGES.map(lang => (
              <div key={lang} className="mb-6 last:mb-0">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  {LANG_LABELS[lang]}
                </label>
                <div className="space-y-2">
                  {(config.suggested_questions?.[lang] || []).map((q, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={q}
                        onChange={e => updateSuggestedQuestion(lang, idx, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 bg-white text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
                      />
                      <button
                        onClick={() => removeSuggestedQuestion(lang, idx)}
                        className="px-3 py-2 text-red-500 hover:bg-red-50 border border-gray-300 text-sm"
                      >
                        X
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addSuggestedQuestion(lang)}
                    className="text-sm text-gray-500 hover:text-black border border-dashed border-gray-300 px-3 py-2 w-full"
                  >
                    + Añadir pregunta
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Conocimiento */}
      {activeTab === 'conocimiento' && (
        <div className="space-y-8 max-w-2xl">
          <div className="p-6 bg-gray-50 border border-gray-200">
            <h3 className="text-lg font-bold mb-2">Fuentes de Conocimiento</h3>
            <p className="text-sm text-gray-600 mb-4">
              Selecciona de qué tablas de la base de datos se nutre el agente para responder.
            </p>
            <div className="space-y-3">
              {KNOWLEDGE_TABLES.map(table => (
                <label key={table.id} className="flex items-center gap-3 p-3 bg-white border border-gray-200 cursor-pointer hover:border-gray-400 transition-colors">
                  <input
                    type="checkbox"
                    checked={config.knowledge_tables.includes(table.id)}
                    onChange={() => toggleKnowledgeTable(table.id)}
                    className="w-4 h-4 accent-black"
                  />
                  <span className="text-sm font-medium">{table.label}</span>
                  <span className="text-xs text-gray-400 ml-auto font-mono">{table.id}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-6 bg-gray-50 border border-gray-200">
            <h3 className="text-lg font-bold mb-2">Máx. Items de Contexto</h3>
            <p className="text-sm text-gray-600 mb-3">
              Cuántos registros de la BD se incluyen como contexto en cada consulta: <strong>{config.max_context_items}</strong>
            </p>
            <input
              type="range"
              min={3}
              max={30}
              value={config.max_context_items}
              onChange={e => updateField('max_context_items', parseInt(e.target.value))}
              className="w-full accent-black"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>3</span>
              <span>30</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
