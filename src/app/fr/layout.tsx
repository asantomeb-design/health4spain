import { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import BackToTop from "@/components/BackToTop";
import CookieConsent from "@/components/CookieConsent";
import AIChatWidget from "@/components/AIChatWidget";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.health4spain.com';

export const metadata: Metadata = {
  alternates: {
    canonical: `${BASE}/fr`,
    languages: {
      'es': `${BASE}/es`,
      'en': `${BASE}/en`,
      'fr': `${BASE}/fr`,
      'de': `${BASE}/de`,
      'pt': `${BASE}/pt`,
      'x-default': `${BASE}/es`,
    },
  },
};

export default function LayoutFR({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer locale="fr" />
      <StickyCTA />
      <BackToTop />
      <CookieConsent lang="fr" />
      <AIChatWidget lang="fr" />
    </>
  );
}
