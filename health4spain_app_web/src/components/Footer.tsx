import Link from 'next/link';
import Image from 'next/image';
import { getServicios } from '@/lib/services';
import { LOGO_PATHS } from '@/lib/constants';
import { ROUTES, type Locale } from '@/lib/routes';
import { getDictionary } from '@/lib/dictionaries';
import CookieConsentLink from './CookieConsentLink';

const socialLinks = [
  { 
    name: 'LinkedIn', 
    href: 'https://linkedin.com/company/health4spain',
    icon: (<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>)
  },
  { 
    name: 'Facebook', 
    href: 'https://facebook.com/health4spain',
    icon: (<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>)
  },
  { 
    name: 'Instagram', 
    href: 'https://instagram.com/health4spain',
    icon: (<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>)
  },
  { 
    name: 'Twitter', 
    href: 'https://twitter.com/health4spain',
    icon: (<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>)
  },
];

interface FooterProps {
  locale?: Locale;
}

export default async function Footer({ locale = 'es' }: FooterProps) {
  const servicios = await getServicios();
  const t = getDictionary(locale);
  const r = ROUTES[locale];

  const destinos = [
    { href: `/${locale}/${r.destinations}/torrevieja`, label: 'Torrevieja' },
    { href: `/${locale}/${r.destinations}/alicante`, label: 'Alicante' },
    { href: `/${locale}/${r.destinations}/lorca`, label: 'Lorca' },
    { href: `/${locale}/${r.destinations}/murcia`, label: 'Murcia' },
  ];

  const empresa = [
    { href: `/${locale}/${r.about}`, label: t.footer.aboutUs },
    { href: `/${locale}/${r.blog}`, label: t.nav.blog },
    { href: `/${locale}/${r.contact}`, label: t.nav.contact },
  ];

  const legal = [
    { href: `/${locale}/${r.privacy}`, label: t.footer.privacy },
    { href: `/${locale}/${r.terms}`, label: t.footer.terms },
    { href: `/${locale}/${r.cookies}`, label: t.footer.cookies },
  ];
  
  return (
    <footer className="stats-minimal">
      <div className="container-base">
        <div className="grid md:grid-cols-5 gap-12 md:gap-16 pb-16 border-b border-gray-800">
          <div className="md:col-span-2">
            <Link href={`/${locale}`} className="inline-block mb-6">
              <Image src={LOGO_PATHS.horizontal} alt="Health 4 Spain" height={65} width={260} className="h-14 md:h-16 w-auto" />
            </Link>
            <p className="text-gray-400 mb-8 text-lg leading-relaxed">{t.footer.description}</p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-gray-300">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <a href="mailto:info@health4spain.com" className="hover:text-white transition-colors">info@health4spain.com</a>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <a href="tel:+34900123456" className="hover:text-white transition-colors">+34 900 123 456</a>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Lun - Vie: 9:00 - 18:00</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold mb-4 uppercase tracking-widest text-gray-400">{t.footer.followUs}</h4>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-white transition-colors hover:scale-110 transform" aria-label={social.name}>
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-6 uppercase tracking-widest text-gray-400">{t.footer.services}</h4>
            <ul className="space-y-3">
              {servicios.map((servicio) => (
                <li key={servicio.slug}>
                  <Link href={`/${locale}/${r.services}/${servicio.slug}`} className="text-base text-gray-300 hover:text-white hover:pl-2 transition-all">
                    {servicio.nombre_plural || servicio.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-6 uppercase tracking-widest text-gray-400">{t.footer.mainDestinations}</h4>
            <ul className="space-y-3">
              {destinos.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-base text-gray-300 hover:text-white hover:pl-2 transition-all">{link.label}</Link>
                </li>
              ))}
              <li>
                <Link href={`/${locale}/${r.destinations}`} className="text-base text-accent hover:text-accent-400 font-semibold">
                  {t.footer.viewAllDestinations} →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-6 uppercase tracking-widest text-gray-400">{t.footer.company}</h4>
            <ul className="space-y-3 mb-8">
              {empresa.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-base text-gray-300 hover:text-white hover:pl-2 transition-all">{link.label}</Link>
                </li>
              ))}
            </ul>
            
            <h4 className="text-sm font-bold mb-6 uppercase tracking-widest text-gray-400">{t.footer.legal}</h4>
            <ul className="space-y-3">
              {legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-base text-gray-300 hover:text-white hover:pl-2 transition-all">{link.label}</Link>
                </li>
              ))}
              <li>
                <CookieConsentLink lang={locale} />
              </li>
            </ul>
          </div>
        </div>

        <div className="py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="stat-label text-center md:text-left">
            © {new Date().getFullYear()} Health4Spain. {t.footer.rights}
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span>🇪🇸 {t.footer.madeIn}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
