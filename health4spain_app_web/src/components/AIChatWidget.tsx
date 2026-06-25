'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { CSSProperties } from 'react';
import type { ChatMessage, ChatbotPublicConfig } from '@/lib/types';

const CHAT_AVATAR = '/images/chat_ia_logo.jpg';

interface AIChatWidgetProps {
  lang?: string;
}

function renderMarkdown(text: string): JSX.Element[] {
  const lines = text.split('\n');
  const elements: JSX.Element[] = [];

  lines.forEach((line, lineIdx) => {
    if (lineIdx > 0) elements.push(<br key={`br-${lineIdx}`} />);

    const isBullet = /^[\-\*]\s+/.test(line.trim());
    const content = isBullet ? line.trim().replace(/^[\-\*]\s+/, '') : line;

    const parts: (string | JSX.Element)[] = [];
    let remaining = content;
    let partIdx = 0;

    while (remaining.length > 0) {
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);

      let firstMatch: { index: number; length: number; element: JSX.Element; type: string } | null = null;

      if (boldMatch?.index !== undefined) {
        firstMatch = {
          index: boldMatch.index,
          length: boldMatch[0].length,
          element: <strong key={`b-${lineIdx}-${partIdx}`} className="font-semibold">{boldMatch[1]}</strong>,
          type: 'bold',
        };
      }

      if (linkMatch?.index !== undefined) {
        if (!firstMatch || linkMatch.index < firstMatch.index) {
          firstMatch = {
            index: linkMatch.index,
            length: linkMatch[0].length,
            element: (
              <a key={`a-${lineIdx}-${partIdx}`} href={linkMatch[2]} className="underline font-medium hover:opacity-70" target={linkMatch[2].startsWith('http') ? '_blank' : undefined} rel={linkMatch[2].startsWith('http') ? 'noopener noreferrer' : undefined}>
                {linkMatch[1]}
              </a>
            ),
            type: 'link',
          };
        }
      }

      if (!firstMatch) {
        if (remaining) parts.push(remaining);
        break;
      }

      if (firstMatch.index > 0) {
        parts.push(remaining.slice(0, firstMatch.index));
      }
      parts.push(firstMatch.element);
      remaining = remaining.slice(firstMatch.index + firstMatch.length);
      partIdx++;
    }

    if (isBullet) {
      elements.push(
        <span key={`li-${lineIdx}`} className="flex gap-1.5 items-start">
          <span className="shrink-0 mt-0.5">•</span>
          <span>{parts}</span>
        </span>
      );
    } else {
      elements.push(<span key={`l-${lineIdx}`}>{parts}</span>);
    }
  });

  return elements;
}

function getSessionId(): string {
  const key = 'ai-chat-session-id';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

interface ParsedMessage {
  text: string;
  options: string[];
}

// Frases tipo "(responde con el número)" que sobran cuando hay botones
const CHOICE_HINT_RE = /\s*[(（]?\s*(responde con el número|reply with the number|answer with the number|répond(?:s|ez) avec le numéro|antworten? mit der nummer|responda com o número)[^)\n]*[)）]?\s*:?\s*$/gim;

function cleanLabel(s: string): string {
  return s.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
}

// Opciones numeradas en una sola línea: "¿Qué servicio? 1. Seguro  2. Abogado  3. Gestoría"
function parseInlineNumbered(line: string): ParsedMessage {
  const re = /(\d+)[.)]\s+/g;
  const marks: { num: number; at: number; end: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) marks.push({ num: Number(m[1]), at: m.index, end: re.lastIndex });

  const run: { num: number; at: number; end: number }[] = [];
  for (const it of marks) {
    if (run.length === 0) {
      if (it.num === 1) run.push(it);
    } else if (it.num === run[run.length - 1].num + 1) {
      run.push(it);
    }
  }
  if (run.length < 2) return { text: line, options: [] };

  const options: string[] = [];
  for (let i = 0; i < run.length; i++) {
    const from = run[i].end;
    const to = i + 1 < run.length ? run[i + 1].at : line.length;
    options.push(cleanLabel(line.slice(from, to)));
  }
  return { text: line.slice(0, run[0].at).trim(), options: options.filter(Boolean) };
}

// Detecta las opciones (numeradas o con viñetas) que Mar-IA pone al final del mensaje
// y las separa del texto, para pintarlas como botones pulsables.
function extractOptions(content: string): ParsedMessage {
  const lines = content.replace(/\s+$/, '').split('\n');

  // 1) Bloque final de líneas-opción (una opción por línea)
  let end = lines.length;
  while (end > 0 && lines[end - 1].trim() === '') end--;
  let start = end;
  const opts: string[] = [];
  while (start > 0) {
    const m = lines[start - 1].trim().match(/^(?:\d+[.)]|[-•*])\s+(.+)$/);
    if (m) { opts.unshift(cleanLabel(m[1])); start--; } else break;
  }
  if (opts.length >= 2) {
    const text = lines.slice(0, start).join('\n').replace(CHOICE_HINT_RE, '').trim();
    return { text, options: opts };
  }

  // 2) Opciones en la última línea con texto (formato en línea)
  const lastIdx = end - 1;
  if (lastIdx >= 0) {
    const inline = parseInlineNumbered(lines[lastIdx]);
    if (inline.options.length >= 2) {
      const before = lines.slice(0, lastIdx).join('\n');
      const text = `${before}\n${inline.text}`.replace(CHOICE_HINT_RE, '').trim();
      return { text, options: inline.options };
    }
  }

  return { text: content.replace(CHOICE_HINT_RE, '').trim(), options: [] };
}

// Heurística etiqueta -> icono de línea (consistente en todos los dispositivos)
function inferIcon(label: string): string {
  const s = label.toLowerCase();
  if (/(asesor|persona|humano|advisor|human|agent|berater|conseiller|llam|call|whatsapp|teléfono|telefono|phone)/.test(s)) return 'chat';
  if (/(cita|agend|appointment|rendez|termin|reserva|hueco|hora)/.test(s)) return 'cal';
  if (/(seguro|insurance|médic|medic|health|salud|assurance|krankenvers)/.test(s)) return 'med';
  if (/(abogad|lawyer|trámite|tramite|gestor|legal|visa|visad|avocat|anwalt|recht|arraigo|reagrup)/.test(s)) return 'file';
  if (/(vivienda|inmobil|casa|home|housing|wohnung|logement|imóvel|imovel|aluga)/.test(s)) return 'home';
  if (/(info|información|informacion|information)/.test(s)) return 'info';
  if (/(español|english|deutsch|français|francais|português|portugues|idioma|language|langue|sprache)/.test(s)) return 'globe';
  if (/(españa|espana|spain|latino|país|pais|country|otro|other|estudiante|student|trabaj|autónomo|autonomo|nómada|nomada|jubil)/.test(s)) return 'pin';
  if (/(ya estoy|ahora|now|already|jetzt|maintenant)/.test(s)) return 'check';
  if (/(mes|month|trimestre|próxim|proxim|monat|mois)/.test(s)) return 'cal';
  if (/(explor|looking|solo|just|nur)/.test(s)) return 'search';
  return 'arrow';
}

function OptIcon({ name }: { name: string }) {
  switch (name) {
    case 'globe':
      return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c3.5 3 3.5 15 0 18M12 3c-3.5 3 -3.5 15 0 18" /></svg>;
    case 'pin':
      return <svg viewBox="0 0 24 24"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" /><circle cx="12" cy="10" r="2.4" /></svg>;
    case 'med':
      return <svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" /><path d="M12 8.5v7M8.5 12h7" /></svg>;
    case 'file':
      return <svg viewBox="0 0 24 24"><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4" /><path d="M9 13h6M9 16.5h6" /></svg>;
    case 'home':
      return <svg viewBox="0 0 24 24"><path d="M4 11l8-7 8 7" /><path d="M6 10v9h12v-9" /></svg>;
    case 'info':
      return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 11.5v4.5" /><path d="M12 8h.01" /></svg>;
    case 'chat':
      return <svg viewBox="0 0 24 24"><path d="M5 5h14v10H9l-4 4z" /></svg>;
    case 'check':
      return <svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-11" /></svg>;
    case 'cal':
      return <svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 9h16M8 3v4M16 3v4" /></svg>;
    case 'search':
      return <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" /><path d="M20 20l-4-4" /></svg>;
    default:
      return <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
  }
}

export default function AIChatWidget({ lang = 'es' }: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [config, setConfig] = useState<ChatbotPublicConfig | null>(null);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [activeLang, setActiveLang] = useState(lang);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchConfig = useCallback(() => {
    fetch('/api/chat/config', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        setConfig(data);
        setConfigLoaded(true);
      })
      .catch(() => setConfigLoaded(true));
  }, []);

  useEffect(() => {
    fetchConfig();
    const interval = setInterval(fetchConfig, 5000);
    return () => clearInterval(interval);
  }, [fetchConfig]);

  useEffect(() => {
    setSessionId(getSessionId());
    const stored = sessionStorage.getItem('ai-chat-history');
    if (stored) {
      try { setMessages(JSON.parse(stored)); } catch {}
    }
    const storedLang = sessionStorage.getItem('ai-chat-lang');
    if (storedLang) setActiveLang(storedLang);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('ai-chat-history', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const resetChat = useCallback(() => {
    const newId = crypto.randomUUID();
    sessionStorage.setItem('ai-chat-session-id', newId);
    sessionStorage.removeItem('ai-chat-history');
    sessionStorage.removeItem('ai-chat-lang');
    setSessionId(newId);
    setMessages([]);
    setInput('');
    setActiveLang(lang);
  }, [lang]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return;

    const userMessage: ChatMessage = { role: 'user', content: text.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsStreaming(true);

    const assistantMessage: ChatMessage = { role: 'assistant', content: '' };
    setMessages(prev => [...prev, assistantMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: updatedMessages.slice(-20),
          lang,
          current_lang: activeLang,
          session_id: sessionId,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Error en la respuesta');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No stream reader');

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);

          if (data === '[DONE]') break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.lang && parsed.lang !== activeLang) {
              setActiveLang(parsed.lang);
              sessionStorage.setItem('ai-chat-lang', parsed.lang);
            }
            if (parsed.content) {
              accumulated += parsed.content;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'assistant', content: accumulated };
                return updated;
              });
            }
            if (parsed.error) throw new Error(parsed.error);
          } catch {}
        }
      }
    } catch (error: any) {
      setMessages(prev => {
        const updated = [...prev];
        const errorMsg = lang === 'es'
          ? 'Lo siento, ha ocurrido un error. Inténtalo de nuevo.'
          : 'Sorry, an error occurred. Please try again.';
        updated[updated.length - 1] = { role: 'assistant', content: errorMsg };
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  }, [messages, isStreaming, lang, activeLang]);

  if (!configLoaded || !config?.enabled) return null;

  const primaryColor = config.primary_color || '#293f92';
  const welcomeMsg = config.welcome_message?.[lang] || config.welcome_message?.es || '';
  const suggestions = config.suggested_questions?.[lang] || config.suggested_questions?.es || [];

  const lastMessage = messages[messages.length - 1];
  const lastOptions = !isStreaming && lastMessage?.role === 'assistant'
    ? extractOptions(lastMessage.content).options
    : [];

  return (
    <>
      {/* Chat Panel */}
      <div
        className={`fixed right-2 sm:right-4 bottom-20 z-50 transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl w-[calc(100vw-16px)] sm:w-[380px] max-w-[380px] overflow-hidden border border-gray-200 flex flex-col" style={{ maxHeight: '75vh' }}>
          {/* Header */}
          <div className="text-white shrink-0 relative pt-6 pb-5 px-4" style={{ backgroundColor: primaryColor }}>
            <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
              {messages.length > 0 && (
                <button
                  onClick={resetChat}
                  className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                  title={lang === 'es' ? 'Nuevo chat' : lang === 'fr' ? 'Nouveau chat' : lang === 'de' ? 'Neuer Chat' : lang === 'pt' ? 'Novo chat' : 'New chat'}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-3 border-white/50 shadow-xl shrink-0 flex-shrink-0">
                <img src={CHAT_AVATAR} alt="Mar-IA" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-lg">{config?.agent_name || 'Mar-IA'}</h4>
                <p className="text-sm text-white/90 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full shrink-0"></span>
                  {lang === 'es' ? 'Asistente virtual' : lang === 'fr' ? 'Assistante virtuelle' : lang === 'de' ? 'Virtuelle Assistentin' : lang === 'pt' ? 'Assistente virtual' : 'Virtual assistant'}
                </p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50" style={{ minHeight: '200px', maxHeight: '50vh' }}>
            {/* Welcome message */}
            {messages.length === 0 && (
              <>
                <div className="bg-white rounded-2xl px-4 py-2.5 shadow-sm">
                  <p className="text-sm text-gray-700">{welcomeMsg}</p>
                </div>
                {suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(q)}
                        className="text-xs px-3 py-1.5 rounded-full border transition-colors bg-white hover:border-gray-400 text-gray-600"
                        style={{ borderColor: primaryColor + '40' }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Chat messages */}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`rounded-2xl px-4 py-2.5 max-w-[85%] ${
                    msg.role === 'user'
                      ? 'rounded-tr-sm text-white'
                      : 'rounded-tl-sm bg-white shadow-sm'
                  }`}
                  style={msg.role === 'user' ? { backgroundColor: primaryColor } : undefined}
                >
                  <div className={`text-sm break-words ${msg.role === 'user' ? 'text-white whitespace-pre-wrap' : 'text-gray-700 flex flex-col gap-0.5'}`}>
                    {msg.role === 'assistant'
                      ? renderMarkdown(
                          isStreaming && i === messages.length - 1
                            ? msg.content
                            : extractOptions(msg.content).text
                        )
                      : msg.content}
                    {isStreaming && i === messages.length - 1 && msg.role === 'assistant' && (
                      <span className="inline-block w-1.5 h-4 ml-0.5 bg-gray-400 animate-pulse rounded-sm" />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Botones pulsables (tap-only) de la última respuesta */}
            {lastOptions.length > 0 && (
              <div className="maria-opts" style={{ '--mc': primaryColor } as CSSProperties}>
                {lastOptions.map((label, i) => (
                  <button
                    key={`${label}-${i}`}
                    onClick={() => sendMessage(label)}
                    className="maria-chip"
                  >
                    <OptIcon name={inferIcon(label)} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-gray-100 bg-white shrink-0">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
                placeholder={lang === 'es' ? 'Escribe tu mensaje...' : lang === 'fr' ? 'Écrivez votre message...' : lang === 'de' ? 'Schreiben Sie Ihre Nachricht...' : lang === 'pt' ? 'Escreva sua mensagem...' : 'Type your message...'}
                className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 text-sm focus:border-gray-400 focus:ring-1 focus:ring-gray-300 outline-none"
                disabled={isStreaming}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isStreaming}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all shrink-0 disabled:opacity-40"
                style={{ backgroundColor: primaryColor }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-2 sm:right-4 bottom-2 sm:bottom-4 z-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-lg transition-all hover:scale-110 overflow-hidden border-3"
        style={{ borderColor: primaryColor }}
        aria-label="Chat con Mar-IA"
      >
        {isOpen ? (
          <div className="w-full h-full flex items-center justify-center text-white" style={{ backgroundColor: primaryColor }}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        ) : (
          <img src={CHAT_AVATAR} alt="Chat con Mar-IA" className="w-full h-full object-cover" />
        )}
      </button>

      {/* Pulse animation */}
      {!isOpen && (
        <span
          className="fixed right-2 sm:right-4 bottom-2 sm:bottom-4 z-40 w-14 h-14 sm:w-16 sm:h-16 rounded-full animate-ping opacity-20 pointer-events-none"
          style={{ backgroundColor: primaryColor }}
        />
      )}
    </>
  );
}
