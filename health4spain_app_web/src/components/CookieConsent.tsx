'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  COOKIE_CONSENT_KEY,
  CookieConsentState,
  DEFAULT_CONSENT,
  getStoredConsent,
} from '@/lib/cookie-consent';
import { loadMetaPixel } from '@/lib/meta-pixel';

declare global {
  interface Window {
    gtag: (
      command: 'consent',
      type: 'update',
      params: {
        ad_storage?: 'granted' | 'denied';
        ad_user_data?: 'granted' | 'denied';
        ad_personalization?: 'granted' | 'denied';
        analytics_storage?: 'granted' | 'denied';
      }
    ) => void;
  }
}

export const COOKIE_CONSENT_REOPEN_EVENT = 'cookie-consent-reopen';

const CONTENT = {
  es: {
    title: 'Configuración de cookies',
    description:
      'Utilizamos cookies para mejorar tu experiencia, analizar el tráfico y personalizar contenido. Puedes aceptar todas, rechazar las opcionales o personalizar tu elección.',
    policyLink: 'Política de cookies',
    acceptAll: 'Aceptar todas',
    rejectAll: 'Rechazar opcionales',
    customize: 'Personalizar',
    save: 'Guardar preferencias',
    back: 'Volver',
    essential: 'Esenciales',
    essentialDesc: 'Necesarias para el funcionamiento del sitio. No se pueden desactivar.',
    analytics: 'Análisis',
    analyticsDesc: 'Nos ayudan a entender cómo usas el sitio (ej. Google Analytics).',
    marketing: 'Marketing',
    marketingDesc: 'Para mostrar anuncios relevantes y medir campañas.',
  },
  en: {
    title: 'Cookie settings',
    description:
      'We use cookies to improve your experience, analyse traffic and personalise content. You can accept all, reject optional ones or customise your choice.',
    policyLink: 'Cookie policy',
    acceptAll: 'Accept all',
    rejectAll: 'Reject optional',
    customize: 'Customise',
    save: 'Save preferences',
    back: 'Back',
    essential: 'Essential',
    essentialDesc: 'Required for the site to function. Cannot be disabled.',
    analytics: 'Analytics',
    analyticsDesc: 'Help us understand how you use the site (e.g. Google Analytics).',
    marketing: 'Marketing',
    marketingDesc: 'To show relevant ads and measure campaigns.',
  },
  de: {
    title: 'Cookie-Einstellungen',
    description:
      'Wir verwenden Cookies zur Verbesserung Ihrer Erfahrung, zur Traffic-Analyse und zur Personalisierung von Inhalten. Sie können alle akzeptieren, optionale ablehnen oder Ihre Auswahl anpassen.',
    policyLink: 'Cookie-Richtlinie',
    acceptAll: 'Alle akzeptieren',
    rejectAll: 'Optionale ablehnen',
    customize: 'Anpassen',
    save: 'Einstellungen speichern',
    back: 'Zurück',
    essential: 'Notwendig',
    essentialDesc: 'Erforderlich für die Funktionalität der Website. Kann nicht deaktiviert werden.',
    analytics: 'Analysen',
    analyticsDesc: 'Helfen uns zu verstehen, wie Sie die Website nutzen (z.B. Google Analytics).',
    marketing: 'Marketing',
    marketingDesc: 'Um relevante Anzeigen anzuzeigen und Kampagnen zu messen.',
  },
  fr: {
    title: 'Paramètres des cookies',
    description:
      'Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le contenu. Vous pouvez tout accepter, refuser les optionnels ou personnaliser votre choix.',
    policyLink: 'Politique des cookies',
    acceptAll: 'Tout accepter',
    rejectAll: 'Refuser les optionnels',
    customize: 'Personnaliser',
    save: 'Enregistrer les préférences',
    back: 'Retour',
    essential: 'Essentielles',
    essentialDesc: "Nécessaires au fonctionnement du site. Ne peuvent pas être désactivées.",
    analytics: 'Analytiques',
    analyticsDesc: "Nous aident à comprendre comment vous utilisez le site (ex. Google Analytics).",
    marketing: 'Marketing',
    marketingDesc: 'Pour afficher des annonces pertinentes et mesurer les campagnes.',
  },
  pt: {
    title: 'Configurações de cookies',
    description:
      'Utilizamos cookies para melhorar a sua experiência, analisar o tráfego e personalizar o conteúdo. Pode aceitar todos, rejeitar os opcionais ou personalizar a sua escolha.',
    policyLink: 'Política de cookies',
    acceptAll: 'Aceitar todos',
    rejectAll: 'Rejeitar opcionais',
    customize: 'Personalizar',
    save: 'Guardar preferências',
    back: 'Voltar',
    essential: 'Essenciais',
    essentialDesc: 'Necessários para o funcionamento do site. Não podem ser desativados.',
    analytics: 'Análise',
    analyticsDesc: 'Ajudam-nos a compreender como utiliza o site (ex. Google Analytics).',
    marketing: 'Marketing',
    marketingDesc: 'Para mostrar anúncios relevantes e medir campanhas.',
  },
};

type Locale = keyof typeof CONTENT;

interface CookieConsentProps {
  lang?: string;
}

function saveConsent(state: Partial<CookieConsentState>) {
  const full: CookieConsentState = {
    ...DEFAULT_CONSENT,
    ...state,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(full));
  window.dispatchEvent(new CustomEvent('cookie-consent-updated'));
}

export default function CookieConsent({ lang = 'es' }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const content =
    (CONTENT[lang as Locale] ?? CONTENT.es) as (typeof CONTENT)['es'];

  // Función para actualizar el estado de consentimiento en Google Analytics (Consent Mode v2)
  const updateGoogleConsent = (consent: Partial<CookieConsentState>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: consent.analytics ? 'granted' : 'denied',
        ad_storage: consent.marketing ? 'granted' : 'denied',
        ad_user_data: consent.marketing ? 'granted' : 'denied',
        ad_personalization: consent.marketing ? 'granted' : 'denied',
      });
    }
    if (consent.marketing) {
      loadMetaPixel();
    }
  };

  const checkAndShow = useCallback(() => {
    // Siempre mostrar si no hay consentimiento guardado
    const consentRaw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consentRaw) {
      setIsVisible(true);
      return;
    }
    try {
      const consent = JSON.parse(consentRaw);
      setIsVisible(false);
      // Restaurar el estado de consentimiento en Google al cargar
      updateGoogleConsent(consent);
    } catch {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    checkAndShow();
  }, [checkAndShow]);

  useEffect(() => {
    const handler = () => {
      setIsVisible(true);
      setIsExpanded(false);
    };
    window.addEventListener(COOKIE_CONSENT_REOPEN_EVENT, handler);
    return () => window.removeEventListener(COOKIE_CONSENT_REOPEN_EVENT, handler);
  }, []);

  const handleAcceptAll = () => {
    const consent = { analytics: true, marketing: true };
    saveConsent(consent);
    updateGoogleConsent(consent);
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const consent = { analytics: false, marketing: false };
    saveConsent(consent);
    updateGoogleConsent(consent);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    const consent = { analytics, marketing };
    saveConsent(consent);
    updateGoogleConsent(consent);
    setIsVisible(false);
  };

  const handleCustomize = () => {
    const stored = getStoredConsent();
    if (stored) {
      setAnalytics(stored.analytics);
      setMarketing(stored.marketing);
    }
    setIsExpanded(true);
  };

  const handleBack = () => {
    setIsExpanded(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
    >
      {/* Overlay para enfocar la atención en el banner - no clickeable para cerrar (GDPR) */}
      <div
        className="absolute inset-0 bg-black/20"
        aria-hidden="true"
      />
      <div className="relative mx-auto w-full max-w-2xl rounded-xl border border-gray-200 bg-white shadow-2xl">
        <div className="p-6 md:p-8">
          <h2
            id="cookie-consent-title"
            className="text-xl font-bold text-gray-900 mb-2"
          >
            {content.title}
          </h2>
          <p
            id="cookie-consent-desc"
            className="text-gray-600 text-sm mb-6 leading-relaxed"
          >
            {content.description}{' '}
            <Link
              href={`/${lang}/cookies`}
              className="text-[#293f92] hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              {content.policyLink}
            </Link>
          </p>

          {!isExpanded ? (
            <>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={handleRejectAll}
                  className="flex-1 px-5 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
                  aria-label={content.rejectAll}
                >
                  {content.rejectAll}
                </button>
                <button
                  type="button"
                  onClick={handleCustomize}
                  className="flex-1 px-5 py-3 text-sm font-semibold text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-300"
                  aria-label={content.customize}
                >
                  {content.customize}
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="flex-1 px-5 py-3 text-sm font-semibold text-white bg-[#293f92] rounded-lg hover:bg-[#1e2e6b] transition-colors"
                  aria-label={content.acceptAll}
                >
                  {content.acceptAll}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {[
                  {
                    id: 'essential',
                    label: content.essential,
                    desc: content.essentialDesc,
                    checked: true,
                    disabled: true,
                  },
                  {
                    id: 'analytics',
                    label: content.analytics,
                    desc: content.analyticsDesc,
                    checked: analytics,
                    disabled: false,
                    onChange: setAnalytics,
                  },
                  {
                    id: 'marketing',
                    label: content.marketing,
                    desc: content.marketingDesc,
                    checked: marketing,
                    disabled: false,
                    onChange: setMarketing,
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 border border-gray-100"
                  >
                    <input
                      type="checkbox"
                      id={`cookie-${item.id}`}
                      checked={item.checked}
                      disabled={item.disabled}
                      onChange={(e) =>
                        item.onChange?.(e.target.checked)
                      }
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-[#293f92] focus:ring-[#293f92] disabled:opacity-60 disabled:cursor-not-allowed"
                      aria-describedby={`${item.id}-desc`}
                    />
                    <label
                      htmlFor={`cookie-${item.id}`}
                      className={`flex-1 text-sm ${item.disabled ? 'cursor-not-allowed text-gray-500' : 'cursor-pointer'}`}
                    >
                      <span className="font-medium text-gray-900">
                        {item.label}
                      </span>
                      <p
                        id={`${item.id}-desc`}
                        className="text-gray-600 mt-0.5"
                      >
                        {item.desc}
                      </p>
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label={content.back}
                >
                  {content.back}
                </button>
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="flex-1 px-5 py-3 text-sm font-semibold text-white bg-[#293f92] rounded-lg hover:bg-[#1e2e6b] transition-colors"
                  aria-label={content.save}
                >
                  {content.save}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
