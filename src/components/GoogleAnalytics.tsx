'use client';

import { GoogleAnalytics as GAScript } from '@next/third-parties/google';
import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      {/* 
        Google Consent Mode v2 - Configuración Inicial
        Se carga ANTES que el script de GA para establecer el estado por defecto a 'denied'.
        Esto permite a Google recibir pings sin cookies (modelado) hasta que el usuario acepte.
      */}
      <Script id="google-consent-mode" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          
          // Establecer valores predeterminados a 'denied'
          gtag('consent', 'default', {
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'analytics_storage': 'denied',
            'wait_for_update': 500
          });
          
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            anonymize_ip: true
          });
        `}
      </Script>

      {/* Carga del script oficial de GA4 optimizado por Next.js */}
      <GAScript gaId={GA_ID} />
    </>
  );
}
