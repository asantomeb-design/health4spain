'use client';

import { useState } from 'react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  lang?: string;
}

const CONTENT = {
  es: {
    greeting: '¡Hola! 👋',
    question: '¿En qué podemos ayudarte?',
    placeholder: 'O escribe tu mensaje...',
    button: 'Enviar por WhatsApp',
    online: 'Online ahora',
    responseTime: 'Respondemos en minutos',
    quickMessages: [
      { iconType: 'shield', text: 'Necesito información sobre seguros de salud' },
      { iconType: 'scale', text: 'Quiero consultar con un abogado' },
      { iconType: 'home', text: 'Busco ayuda para encontrar vivienda' },
      { iconType: 'clipboard', text: 'Necesito ayuda con trámites y papeleos' },
      { iconType: 'chat', text: 'Tengo otra consulta' },
    ],
  },
  en: {
    greeting: 'Hello! 👋',
    question: 'How can we help you?',
    placeholder: 'Or type your message...',
    button: 'Send via WhatsApp',
    online: 'Online now',
    responseTime: 'We reply in minutes',
    quickMessages: [
      { iconType: 'shield', text: 'I need information about health insurance' },
      { iconType: 'scale', text: 'I want to consult with an immigration lawyer' },
      { iconType: 'home', text: "I'm looking for help finding accommodation" },
      { iconType: 'clipboard', text: 'I need help with paperwork and procedures' },
      { iconType: 'chat', text: 'I have another question' },
    ],
  },
  de: {
    greeting: 'Hallo! 👋',
    question: 'Wie können wir Ihnen helfen?',
    placeholder: 'Oder schreiben Sie Ihre Nachricht...',
    button: 'Per WhatsApp senden',
    online: 'Jetzt online',
    responseTime: 'Wir antworten in Minuten',
    quickMessages: [
      { iconType: 'shield', text: 'Ich brauche Informationen über Krankenversicherung' },
      { iconType: 'scale', text: 'Ich möchte einen Einwanderungsanwalt konsultieren' },
      { iconType: 'home', text: 'Ich suche Hilfe bei der Wohnungssuche' },
      { iconType: 'clipboard', text: 'Ich brauche Hilfe mit Papierkram' },
      { iconType: 'chat', text: 'Ich habe eine andere Frage' },
    ],
  },
  fr: {
    greeting: 'Bonjour! 👋',
    question: 'Comment pouvons-nous vous aider?',
    placeholder: 'Ou écrivez votre message...',
    button: 'Envoyer par WhatsApp',
    online: 'En ligne maintenant',
    responseTime: 'Nous répondons en quelques minutes',
    quickMessages: [
      { iconType: 'shield', text: "J'ai besoin d'informations sur l'assurance santé" },
      { iconType: 'scale', text: "Je veux consulter un avocat en immigration" },
      { iconType: 'home', text: "Je cherche de l'aide pour trouver un logement" },
      { iconType: 'clipboard', text: "J'ai besoin d'aide avec les démarches administratives" },
      { iconType: 'chat', text: "J'ai une autre question" },
    ],
  },
};

export default function WhatsAppButton({ 
  phoneNumber = '34600000000',
  lang = 'es'
}: WhatsAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  
  const content = CONTENT[lang as keyof typeof CONTENT] || CONTENT.es;

  const handleSelectQuickMessage = (message: string) => {
    setSelectedMessage(message);
    setCustomMessage(''); // Limpiar mensaje personalizado si selecciona uno rápido
  };

  const handleSend = () => {
    // Usar mensaje seleccionado o personalizado
    const finalMessage = selectedMessage || customMessage;
    
    if (!finalMessage.trim()) return;
    
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(finalMessage)}`;
    window.open(url, '_blank');
    
    // Reset estado
    setIsOpen(false);
    setSelectedMessage(null);
    setCustomMessage('');
  };

  const canSend = selectedMessage || customMessage.trim();

  return (
    <>
      {/* Chat Popup */}
      <div 
        className={`fixed right-2 sm:right-4 bottom-20 z-50 transition-all duration-300 ${
          isOpen 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl w-[calc(100vw-16px)] sm:w-[340px] max-w-[340px] overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-[#293f92] text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl sm:text-2xl">🏥</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base">Health4Spain</h4>
                  <p className="text-xs sm:text-sm text-white/90 flex items-center gap-1">
                    <span className="w-2 h-2 bg-white/80 rounded-full animate-pulse"></span>
                    {content.online}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-[#1e2d6b] rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 bg-gray-50 max-h-[60vh] overflow-y-auto">
            {/* Message bubble */}
            <div className="bg-white rounded-lg p-3 shadow-sm mb-4">
              <p className="text-base sm:text-lg mb-1">{content.greeting}</p>
              <p className="text-gray-600 text-sm">{content.question}</p>
            </div>

            {/* Quick messages */}
            <div className="space-y-2 mb-4">
              {content.quickMessages.map((msg, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectQuickMessage(msg.text)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border-2 transition-all text-sm ${
                    selectedMessage === msg.text
                      ? 'border-[#293f92] bg-accent/10 text-[#293f92]'
                      : 'border-gray-200 bg-white hover:border-[#293f92]/50 hover:bg-accent/5'
                  }`}
                >
                  <span className="mr-2 w-5 h-5 inline-flex shrink-0 text-[#293f92]">
                    {msg.iconType === 'shield' && <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                    {msg.iconType === 'scale' && <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>}
                    {msg.iconType === 'home' && <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
                    {msg.iconType === 'clipboard' && <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                    {msg.iconType === 'chat' && <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>}
                  </span>
                  {msg.text}
                </button>
              ))}
            </div>

            {/* Custom message input */}
            <div className="relative">
              <input
                type="text"
                value={customMessage}
                onChange={(e) => {
                  setCustomMessage(e.target.value);
                  setSelectedMessage(null); // Limpiar selección si escribe
                }}
                placeholder={content.placeholder}
                className="w-full px-4 py-3 pr-12 rounded-full border border-gray-200 focus:border-[#293f92] focus:ring-2 focus:ring-[#293f92]/20 outline-none text-sm"
                onKeyPress={(e) => e.key === 'Enter' && canSend && handleSend()}
              />
            </div>
          </div>

          {/* Footer - Send button */}
          <div className="p-4 bg-white border-t border-gray-100">
            <button
              onClick={handleSend}
              disabled={!canSend}
              className={`w-full py-3 px-4 rounded-full font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all ${
                canSend
                  ? 'bg-[#293f92] text-white hover:bg-[#1e2d6b] shadow-md hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9z" />
              </svg>
              {content.button}
            </button>
            <p className="text-center text-xs text-gray-500 mt-2">{content.responseTime}</p>
          </div>
        </div>
      </div>

      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed right-2 sm:right-4 bottom-2 sm:bottom-4 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-[#293f92] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#1e2d6b] transition-all hover:scale-110 ${
          isOpen ? 'rotate-0' : ''
        }`}
        aria-label="WhatsApp Chat"
      >
        {isOpen ? (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        )}
      </button>

      {/* Pulse animation */}
      {!isOpen && (
        <span className="fixed right-2 sm:right-4 bottom-2 sm:bottom-4 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-[#293f92] rounded-full animate-ping opacity-20 pointer-events-none"></span>
      )}
    </>
  );
}
