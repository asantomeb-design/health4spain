'use client';

import Link from 'next/link';
import { useHubUser } from '@/hooks/useHubUser';
import type { HubCapability } from '@/lib/hub/permissions';

interface Card {
  href: string;
  title: string;
  desc: string;
  cap?: HubCapability;
}

const CARDS: Card[] = [
  { href: '/hub/leads', title: 'Leads', desc: 'Gestiona tus oportunidades y su seguimiento.', cap: 'leads.view.own' },
  { href: '/hub/comisiones', title: 'Mis comisiones', desc: 'Consulta tu acumulado, lo consolidándose y lo cobrado.', cap: 'comisiones.view.own' },
  { href: '/hub/liquidaciones', title: 'Liquidaciones', desc: 'Carga los CSV de las aseguradoras por periodo.', cap: 'liquidaciones.upload_csv' },
  { href: '/hub/asignacion', title: 'Asignación', desc: 'Asigna las líneas de comisión a cada closer.', cap: 'liquidaciones.assign' },
  { href: '/hub/config', title: 'Configuración', desc: 'Porcentajes de comisión, niveles CVR y regímenes.', cap: 'config.commissions' },
  { href: '/hub/usuarios', title: 'Usuarios', desc: 'Alta y baja de colaboradores y roles.', cap: 'users.manage' },
  { href: '/hub/auditoria', title: 'Auditoría', desc: 'Registro inmutable de acciones sensibles.', cap: 'audit.view' },
  { href: '/hub/integraciones', title: 'Integraciones', desc: 'Conexión con GoHighLevel, webhooks y sincronización.', cap: 'integrations.manage' },
];

export default function HubDashboard() {
  const { hubUser, can } = useHubUser();
  if (!hubUser) return null;

  const visible = CARDS.filter((c) => !c.cap || can(c.cap));

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">{hubUser.rol_label}</p>
        <h1 className="text-3xl font-bold tracking-tight">Hola, {hubUser.nombre.split(' ')[0]}</h1>
        <p className="text-gray-600 mt-2">Bienvenido al Hub de Colaboradores de Health4Spain.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visible.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group block border border-gray-200 rounded-xl p-6 hover:border-accent hover:shadow-sm transition"
          >
            <h2 className="text-lg font-bold mb-1 group-hover:text-accent transition-colors">{c.title}</h2>
            <p className="text-sm text-gray-600">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
