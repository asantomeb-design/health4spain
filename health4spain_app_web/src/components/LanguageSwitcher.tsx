'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export default function LanguageSwitcher() {
  const pathname = usePathname();
  
  // Get current locale from pathname
  const currentLocale = pathname.split('/')[1] || 'es';
  
  // Function to get new path with different locale
  const getLocalizedPath = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(es|en|de|fr)/, '');
    return `/${newLocale}${pathWithoutLocale || ''}`;
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
