'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { ChatMessage, ChatbotPublicConfig } from '@/lib/types';

const MARTA_AVATAR = '/images/chat_ia.png';

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

export default function AIChatWidget({ lang = 'es' }: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [config, setConfig] = useState<ChatbotPublicConfig | null>(null);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/chat/config')
      .then(r => r.json())
      .then(data => {
        setConfig(data);
        setConfigLoaded(true);
      })
      .catch(() => setConfigLoaded(true));
  }, []);

  useEffect(() => {
    setSessionId(getSessionId());
    const stored = sessionStorage.getItem('ai-chat-history');
    if (stored) {
      try { setMessages(JSON.parse(stored)); } catch {}
    }
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
    setSessionId(newId);
    setMessages([]);
    setInput('');
  }, []);

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
  }, [messages, isStreaming, lang]);

  if (!configLoaded || !config?.enabled) return null;

  const primaryColor = config.primary_color || '#293f92';
  const welcomeMsg = config.welcome_message?.[lang] || config.welcome_message?.es || '';
  const suggestions = config.suggested_questions?.[lang] || config.suggested_questions?.es || [];

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
                <img src={MARTA_AVATAR} alt="Mar-IA" className="w-full h-full object-cover" />
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
                    {msg.role === 'assistant' ? renderMarkdown(msg.content) : msg.content}
                    {isStreaming && i === messages.length - 1 && msg.role === 'assistant' && (
                      <span className="inline-block w-1.5 h-4 ml-0.5 bg-gray-400 animate-pulse rounded-sm" />
                    )}
                  </div>
                </div>
              </div>
            ))}
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
          <img src={MARTA_AVATAR} alt="Chat con Mar-IA" className="w-full h-full object-cover" />
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
