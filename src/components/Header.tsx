'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { LOGO_PATHS } from '@/lib/constants';

const LANGUAGES = [
  { code: 'es', label: 'ES', flag: '🇪🇸' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'de', label: 'DE', flag: '🇩🇪' },
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
];

const NAV_ITEMS = {
  es: [
    { href: '/es', label: 'Inicio' },
    { href: '/es/servicios', label: 'Servicios' },
    { href: '/es/destinos', label: 'Destinos' },
    { href: '/es/blog', label: 'Blog' },
    { href: '/es/sobre-nosotros', label: 'Nosotros' },
  ],
  en: [
    { href: '/en', label: 'Home' },
    { href: '/en/services', label: 'Services' },
    { href: '/en/destinations', label: 'Destinations' },
    { href: '/en/blog', label: 'Blog' },
    { href: '/en/about', label: 'About' },
  ],
};

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Detectar idioma actual
  const currentLang = pathname.startsWith('/en') ? 'en' : 
                      pathname.startsWith('/de') ? 'de' : 
                      pathname.startsWith('/fr') ? 'fr' : 'es';
  
  const navItems = NAV_ITEMS[currentLang as keyof typeof NAV_ITEMS] || NAV_ITEMS.es;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const switchLanguage = (langCode: string) => {
    // Reemplazar el código de idioma en la URL actual
    const newPath = pathname.replace(/^\/(es|en|de|fr)/, `/${langCode}`);
    return newPath || `/${langCode}`;
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-[5%]">
        <div className="flex items-center justify-between min-h-[225px] py-2">
          {/* LOGO */}
          <Link href={`/${currentLang}`} className="flex items-center gap-2">
            <Image
              src={LOGO_PATHS.siglas}
              alt="H4S - Health4Spain"
              height={225}
              width={450}
              className="h-[225px] w-auto"
              priority
              fetchPriority="high"
            />
          </Link>

          {/* NAV DESKTOP */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-[#3bbdda] ${
                  pathname === item.href
                    ? 'text-[#293f92]'
                    : 'text-gray-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#3bbdda] transition-colors"
              >
                {LANGUAGES.find(l => l.code === currentLang)?.flag}
                <span className="hidden sm:inline ml-1">{currentLang.toUpperCase()}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isLangMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsLangMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-20 min-w-[120px]">
                    {LANGUAGES.map((lang) => (
                      <Link
                        key={lang.code}
                        href={switchLanguage(lang.code)}
                        onClick={() => setIsLangMenuOpen(false)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                          currentLang === lang.code ? 'text-[#293f92] bg-blue-50' : 'text-gray-700'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* CTA Button */}
            <Link
              href={`/${currentLang}/contacto`}
              className="hidden sm:inline-flex items-center gap-2 bg-[#293f92] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#3bbdda] transition-all shadow-md hover:shadow-lg"
            >
              {currentLang === 'es' ? 'Contacto' : 'Contact'}
              <span>→</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-[#3bbdda]"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div 
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-[400px] border-t border-gray-100' : 'max-h-0'
        }`}
      >
        <nav className="bg-white px-[5%] py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-blue-50 text-[#293f92]'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-[#3bbdda]'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={`/${currentLang}/contacto`}
            className="block mt-4 bg-[#293f92] text-white text-center px-4 py-3 rounded-lg font-semibold hover:bg-[#3bbdda] transition-colors"
          >
            {currentLang === 'es' ? 'Contacto' : 'Contact'}
          </Link>
        </nav>
      </div>
    </header>
  );
}
