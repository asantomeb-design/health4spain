'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useHubUser } from '@/hooks/useHubUser';
import type { HubCapability } from '@/lib/hub/permissions';

interface NavItem {
  href: string;
  label: string;
  cap?: HubCapability;
  exact?: boolean;
}

const NAV: NavItem[] = [
  { href: '/hub', label: 'Inicio', exact: true },
  { href: '/hub/leads', label: 'Leads', cap: 'leads.view.own' },
  { href: '/hub/comisiones', label: 'Mis comisiones', cap: 'comisiones.view.own' },
  { href: '/hub/liquidaciones', label: 'Liquidaciones', cap: 'liquidaciones.upload_csv' },
  { href: '/hub/asignacion', label: 'Asignación', cap: 'liquidaciones.assign' },
  { href: '/hub/config', label: 'Configuración', cap: 'config.commissions' },
  { href: '/hub/usuarios', label: 'Usuarios', cap: 'users.manage' },
  { href: '/hub/auditoria', label: 'Auditoría', cap: 'audit.view' },
  { href: '/hub/integraciones', label: 'Integraciones', cap: 'integrations.manage' },
];

function HubSidebar() {
  const pathname = usePathname();
  const { hubUser, can, signOut } = useHubUser();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const visible = NAV.filter((i) => !i.cap || can(i.cap));

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
      <div className="p-8 border-b border-gray-200">
        <Link href="/hub" className="block">
          <h1 className="text-2xl font-bold tracking-tight">Health4Spain</h1>
          <p className="text-xs uppercase tracking-widest text-gray-600 mt-2">Hub Colaboradores</p>
        </Link>
      </div>

      <nav className="flex-1 p-6 overflow-y-auto">
        <ul className="space-y-1">
          {visible.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 transition-opacity ${
                    active ? 'opacity-100 border-l-3 border-accent font-bold' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-6 border-t border-gray-200">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-widest text-gray-600 mb-1">{hubUser?.rol_label}</p>
          <p className="text-sm font-medium truncate">{hubUser?.nombre}</p>
          <p className="text-xs text-gray-500 truncate">{hubUser?.email}</p>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 w-full py-2 hover:opacity-50 transition-opacity"
        >
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}

function HubGate({ children }: { children: React.ReactNode }) {
  const { hubUser, isLoading } = useHubUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !hubUser) router.push('/hub/login');
  }, [hubUser, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#c7956d] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando Hub…</p>
        </div>
      </div>
    );
  }

  if (!hubUser) return null;

  return (
    <div className="min-h-screen bg-white flex">
      <HubSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

export default function HubLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/hub/login') return <>{children}</>;
  return <HubGate>{children}</HubGate>;
}
