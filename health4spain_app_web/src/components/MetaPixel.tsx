'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  isMetaPixelConfigured,
  loadMetaPixel,
  trackMetaPageView,
} from '@/lib/meta-pixel';
import { canUseMarketing } from '@/lib/cookie-consent';

export default function MetaPixel() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isMetaPixelConfigured() || pathname.startsWith('/administrator')) return;

    const syncPixel = () => {
      if (canUseMarketing()) {
        loadMetaPixel();
      }
    };

    syncPixel();
    window.addEventListener('cookie-consent-updated', syncPixel);
    return () => window.removeEventListener('cookie-consent-updated', syncPixel);
  }, [pathname]);

  useEffect(() => {
    if (!isMetaPixelConfigured() || pathname.startsWith('/administrator')) return;
    if (canUseMarketing()) {
      trackMetaPageView();
    }
  }, [pathname]);

  if (!isMetaPixelConfigured() || pathname.startsWith('/administrator')) {
    return null;
  }

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: 'none' }}
        src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  );
}
