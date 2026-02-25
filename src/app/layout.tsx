import type { Metadata } from "next";
import { Roboto_Slab, Ubuntu } from "next/font/google";
import HtmlLang from "@/components/HtmlLang";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

// Roboto Slab para títulos
const robotoSlab = Roboto_Slab({ 
  subsets: ["latin", "latin-ext"],
  variable: '--font-heading',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

// Ubuntu para body
const ubuntu = Ubuntu({ 
  subsets: ["latin", "latin-ext"],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.health4spain.com'),
  title: {
    default: "Health4Spain - Tu Nueva Vida en España",
    template: "%s | Health4Spain"
  },
  description: "Conectamos residentes internacionales con profesionales españoles de confianza. Seguros, abogados, inmobiliarias, gestorías y más.",
  keywords: ["extranjeros españa", "residentes internacionales", "seguros extranjeros", "abogados", "inmobiliarias extranjeros", "servicios para extranjeros"],
  authors: [{ name: "Health4Spain" }],
  creator: "Health4Spain",
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Health4Spain",
    images: [
      {
        url: "/images/logo-horizontal.png",
        width: 1200,
        height: 630,
        alt: "Health4Spain",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/logo-horizontal.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${robotoSlab.variable} ${ubuntu.variable}`}>
      <head>
        <meta name="theme-color" content="#43beda" />
      </head>
      <body className="font-body antialiased">
        <GoogleAnalytics />
        <SpeedInsights />
        <HtmlLang />
        {children}
      </body>
    </html>
  );
}
