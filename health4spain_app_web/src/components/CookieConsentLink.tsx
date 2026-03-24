'use client';

import { COOKIE_CONSENT_REOPEN_EVENT } from './CookieConsent';

const LABELS: Record<string, string> = {
  es: 'Modificar consentimiento de cookies',
  en: 'Modify cookie consent',
  de: 'Cookie-Einwilligung ändern',
  fr: 'Modifier le consentement aux cookies',
  pt: 'Modificar consentimento de cookies',
};

interface CookieConsentLinkProps {
  lang?: string;
}

export default function CookieConsentLink({ lang = 'es' }: CookieConsentLinkProps) {
  const label = LABELS[lang] ?? LABELS.es;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_REOPEN_EVENT));
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-base text-gray-300 hover:text-white hover:pl-2 transition-all text-left"
      aria-label={label}
    >
      {label}
    </button>
  );
}
