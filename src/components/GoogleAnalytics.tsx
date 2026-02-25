'use client';

import Script from 'next/script';
import { useState, useEffect } from 'react';
import { canUseAnalytics } from '@/lib/cookie-consent';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function GoogleAnalytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(canUseAnalytics());

    const handler = () => setAllowed(canUseAnalytics());
    window.addEventListener('cookie-consent-updated', handler);
    return () => window.removeEventListener('cookie-consent-updated', handler);
  }, []);

  if (!GA_ID || !allowed) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  );
}
