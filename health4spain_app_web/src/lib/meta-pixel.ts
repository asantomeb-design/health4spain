import { canUseMarketing } from '@/lib/cookie-consent';

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

let initialized = false;

export function isMetaPixelConfigured(): boolean {
  return Boolean(META_PIXEL_ID);
}

export function loadMetaPixel(): void {
  if (typeof window === 'undefined' || !META_PIXEL_ID || initialized || !canUseMarketing()) {
    return;
  }

  if (!window.fbq) {
    /* eslint-disable @typescript-eslint/no-implied-eval */
    (function injectMetaPixel(f: Window, b: Document) {
      if (f.fbq) return;
      const n = function (...args: unknown[]) {
        const fn = n as typeof n & {
          callMethod?: (...a: unknown[]) => void;
          queue: unknown[][];
        };
        if (fn.callMethod) {
          fn.callMethod(...args);
        } else {
          fn.queue.push(args);
        }
      };
      const fbq = n as typeof window.fbq & {
        callMethod?: (...a: unknown[]) => void;
        queue: unknown[][];
        loaded?: boolean;
        version?: string;
        push?: typeof window.fbq;
      };
      fbq.queue = [];
      f.fbq = fbq;
      if (!f._fbq) f._fbq = fbq;
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = '2.0';
      const t = b.createElement('script');
      t.async = true;
      t.src = 'https://connect.facebook.net/en_US/fbevents.js';
      const s = b.getElementsByTagName('script')[0];
      s?.parentNode?.insertBefore(t, s);
    })(window, document);
    /* eslint-enable @typescript-eslint/no-implied-eval */
  }

  window.fbq?.('init', META_PIXEL_ID);
  window.fbq?.('track', 'PageView');
  initialized = true;
}

export function trackMetaPageView(): void {
  if (typeof window !== 'undefined' && initialized && window.fbq) {
    window.fbq('track', 'PageView');
  }
}

export function trackMetaEvent(
  event: string,
  params?: Record<string, unknown>
): void {
  if (typeof window !== 'undefined' && window.fbq && canUseMarketing()) {
    window.fbq('track', event, params);
  }
}
