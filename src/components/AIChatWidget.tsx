'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { ChatMessage, ChatbotPublicConfig } from '@/lib/types';

interface AIChatWidgetProps {
  lang?: string;
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
          <div className="text-white p-4 shrink-0" style={{ backgroundColor: primaryColor }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
                  <span className="text-xl">{config.agent_avatar || '🏥'}</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm">{config.agent_name || 'Asistente'}</h4>
                  <p className="text-xs text-white/80 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50" style={{ minHeight: '200px', maxHeight: '50vh' }}>
            {/* Welcome message */}
            {messages.length === 0 && (
              <>
                <div className="flex gap-2 items-start">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm" style={{ backgroundColor: primaryColor + '15' }}>
                    {config.agent_avatar || '🏥'}
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm max-w-[85%]">
                    <p className="text-sm text-gray-700">{welcomeMsg}</p>
                  </div>
                </div>
                {/* Suggested questions */}
                {suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 ml-9">
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
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'items-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm" style={{ backgroundColor: primaryColor + '15' }}>
                    {config.agent_avatar || '🏥'}
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-2.5 max-w-[85%] ${
                    msg.role === 'user'
                      ? 'rounded-tr-sm text-white'
                      : 'rounded-tl-sm bg-white shadow-sm'
                  }`}
                  style={msg.role === 'user' ? { backgroundColor: primaryColor } : undefined}
                >
                  <p className={`text-sm whitespace-pre-wrap break-words ${msg.role === 'user' ? 'text-white' : 'text-gray-700'}`}>
                    {msg.content}
                    {isStreaming && i === messages.length - 1 && msg.role === 'assistant' && (
                      <span className="inline-block w-1.5 h-4 ml-0.5 bg-gray-400 animate-pulse rounded-sm" />
                    )}
                  </p>
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
        className="fixed right-2 sm:right-4 bottom-2 sm:bottom-4 z-50 w-12 h-12 sm:w-14 sm:h-14 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
        style={{ backgroundColor: primaryColor }}
        aria-label="Chat IA"
      >
        {isOpen ? (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Pulse animation */}
      {!isOpen && (
        <span
          className="fixed right-2 sm:right-4 bottom-2 sm:bottom-4 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full animate-ping opacity-20 pointer-events-none"
          style={{ backgroundColor: primaryColor }}
        />
      )}
    </>
  );
}
