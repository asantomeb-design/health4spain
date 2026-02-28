'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LOGO_PATHS } from '@/lib/constants';
import { ROUTES, switchLocalePath, type Locale } from '@/lib/routes';
import { getDictionary } from '@/lib/dictionaries';

const LANGUAGES = [
  { code: 'es' as Locale, label: 'ES', flag: '🇪🇸' },
  { code: 'en' as Locale, label: 'EN', flag: '🇬🇧' },
  { code: 'de' as Locale, label: 'DE', flag: '🇩🇪' },
  { code: 'fr' as Locale, label: 'FR', flag: '🇫🇷' },
  { code: 'pt' as Locale, label: 'PT', flag: '🇵🇹' },
];

const SOCIAL_LINKS = [
  { name: 'LinkedIn', href: 'https://linkedin.com/company/health4spain' },
  { name: 'Facebook', href: 'https://facebook.com/health4spain' },
  { name: 'Instagram', href: 'https://instagram.com/health4spain' },
  { name: 'Twitter', href: 'https://twitter.com/health4spain' },
];

function getNavLinks(locale: Locale) {
  const t = getDictionary(locale);
  const r = ROUTES[locale];
  return [
    { href: `/${locale}`, label: t.nav.home, exact: true },
    { href: `/${locale}/${r.destinations}`, label: t.nav.destinations },
    { href: `/${locale}/${r.services}`, label: t.nav.services },
    { href: `/${locale}/${r.about}`, label: t.nav.about },
    { href: `/${locale}/${r.blog}`, label: t.nav.blog },
  ];
}

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const currentLang = (pathname.split('/')[1] || 'es') as Locale;
  const t = getDictionary(currentLang);
  const navLinks = getNavLinks(currentLang);

  const switchLanguage = (langCode: Locale) => {
    return switchLocalePath(pathname, currentLang, langCode);
  };

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  useEffect(() => { setIsMenuOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between min-h-[250px] py-2">
            <Link href={`/${currentLang}`} className="flex items-center">
              <Image src={LOGO_PATHS.siglas} alt="H4S - Health4Spain" height={250} width={600} className="h-[250px] w-auto" priority fetchPriority="high" />
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className={`text-sm font-medium transition-colors hover:text-[#3bbdda] ${isActive(link.href, link.exact) ? 'text-[#293f92]' : 'text-gray-700'}`}>
                  {link.label}
                </Link>
              ))}
              
              <div className="flex items-center gap-1 border-l border-gray-300 pl-6">
                {LANGUAGES.map((lang) => (
                  <Link key={lang.code} href={switchLanguage(lang.code)} className={`px-2 py-1 rounded text-xs font-medium transition-colors ${currentLang === lang.code ? 'bg-[#293f92] text-white' : 'text-gray-600 hover:bg-gray-100'}`} title={lang.label}>
                    {lang.flag}
                  </Link>
                ))}
              </div>
              
              <Link href={`/${currentLang}/${ROUTES[currentLang].contact}`} className="bg-[#293f92] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#3bbdda] transition-all shadow-md hover:shadow-lg">
                {t.nav.contact}
              </Link>
            </nav>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-700 hover:text-[#3bbdda] transition-colors" aria-label="Menu">
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="h-[250px]" />

      {isMenuOpen && (
        <div className="fixed inset-0 z-[999] md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute top-0 bottom-0 right-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <Image src={LOGO_PATHS.siglas} alt="H4S" height={200} width={480} className="h-[200px] w-auto" />
              <button onClick={() => setIsMenuOpen(false)} className="p-2 text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <nav className="p-6 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className={`block px-4 py-3 rounded-lg text-base font-medium transition-all ${isActive(link.href, link.exact) ? 'bg-gray-100 text-[#293f92]' : 'text-gray-700 hover:bg-gray-50 hover:text-[#3bbdda]'}`}>
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="px-6 pb-6">
              <Link href={`/${currentLang}/${ROUTES[currentLang].contact}`} className="block w-full bg-[#293f92] text-white text-center px-6 py-4 rounded-lg font-semibold text-base hover:bg-[#3bbdda] transition-colors shadow-md">
                {t.nav.contact}
              </Link>
            </div>

            <div className="px-6 pb-6 border-t border-gray-200 pt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">{t.nav.language}</p>
              <div className="grid grid-cols-5 gap-2">
                {LANGUAGES.map((lang) => (
                  <Link key={lang.code} href={switchLanguage(lang.code)} className={`flex flex-col items-center gap-1 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${currentLang === lang.code ? 'bg-[#293f92] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-xs">{lang.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="px-6 pb-8 border-t border-gray-200 pt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">{t.nav.followUs}</p>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="flex-1 text-center px-3 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-[#3bbdda] hover:text-white transition-colors">
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
