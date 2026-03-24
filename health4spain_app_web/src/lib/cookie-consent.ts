/**
 * Cookie Consent - Gestión conforme a GDPR/UE
 * Almacenamiento y tipos para el consentimiento de cookies.
 */

export const COOKIE_CONSENT_KEY = 'cookie-consent';

export interface CookieConsentState {
  essential: boolean; // Siempre true, no configurable
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  version: number;
}

export const DEFAULT_CONSENT: Omit<CookieConsentState, 'timestamp'> = {
  essential: true,
  analytics: false,
  marketing: false,
  version: 1,
};

export function getStoredConsent(): CookieConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsentState;
    return parsed.version === 1 ? parsed : null;
  } catch {
    return null;
  }
}

export function hasConsent(): boolean {
  return getStoredConsent() !== null;
}

export function canUseAnalytics(): boolean {
  const c = getStoredConsent();
  return c?.analytics ?? false;
}

export function canUseMarketing(): boolean {
  const c = getStoredConsent();
  return c?.marketing ?? false;
}
