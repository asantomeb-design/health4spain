'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { switchLocalePath, type Locale } from '@/lib/routes';

const languages: { code: Locale; name: string; flag: string }[] = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

const BLOG_ARTICLE_RE = /^\/(es|en|de|fr|pt)\/blog\/([^/]+)\/?$/;

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const [blogTranslations, setBlogTranslations] = useState<Partial<Record<Locale, string>> | null>(null);

  const currentLocale = (pathname.split('/')[1] || 'es') as Locale;

  useEffect(() => {
    const match = pathname.match(BLOG_ARTICLE_RE);
    if (!match) {
      setBlogTranslations(null);
      return;
    }
    const [, lang, slug] = match;
    let cancelled = false;
    fetch(`/api/blog/translations?slug=${encodeURIComponent(slug)}&lang=${lang}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (cancelled || !json?.success) return;
        setBlogTranslations(json.data || null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const getLocalizedPath = (newLocale: Locale) => {
    const blogMatch = pathname.match(BLOG_ARTICLE_RE);
    if (blogMatch) {
      const targetSlug = blogTranslations?.[newLocale];
      if (targetSlug) return `/${newLocale}/blog/${targetSlug}`;
      return `/${newLocale}/blog`;
    }
    return switchLocalePath(pathname, currentLocale, newLocale);
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:border-accent transition-colors">
        <span className="text-xl">{languages.find(lang => lang.code === currentLocale)?.flag}</span>
        <span className="hidden md:inline uppercase text-sm font-semibold">{currentLocale}</span>
        <span className="text-sm">▼</span>
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        {languages.map((lang) => (
          <Link
            key={lang.code}
            href={getLocalizedPath(lang.code)}
            className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 no-underline transition-colors ${
              currentLocale === lang.code ? 'bg-gray-100' : ''
            }`}
          >
            <span className="text-xl">{lang.flag}</span>
            <span className="text-gray-700 font-medium">{lang.name}</span>
            {currentLocale === lang.code && (
              <span className="ml-auto text-accent">✓</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
