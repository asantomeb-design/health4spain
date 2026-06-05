// =============================================
// HEALTH4SPAIN · HUB · Permisos por rol (RBAC)
// =============================================
// Matriz de acceso jerárquico (Blueprint §04 + Definición del módulo §permisos).
// Fuente de verdad de QUÉ puede hacer cada rol. La autorización fina de las
// APIs /api/hub/* se apoya en estos helpers; la UI los usa para render por rol.
//
//   admin       · Adolfo  · control total
//   supervisor  · Ana     · su equipo (closers a su cargo)
//   tecnico     · Claudia · integraciones GHL / logs
//   closer      · Tamara… · solo lo suyo

import type { HubRole } from '@/lib/types';

export const HUB_ROLES: readonly HubRole[] = [
  'admin',
  'supervisor',
  'tecnico',
  'closer',
] as const;

export const HUB_ROLE_LABELS: Record<HubRole, string> = {
  admin: 'Administrador',
  supervisor: 'Supervisor',
  tecnico: 'Técnico',
  closer: 'Closer',
};

// Capacidades atómicas del Hub. Cada pantalla/acción comprueba una de estas.
export type HubCapability =
  | 'hub.access' //                 entrar al Hub
  | 'leads.view.own' //             ver sus propios leads
  | 'leads.view.team' //            ver leads del equipo
  | 'leads.view.all' //             ver todos los leads
  | 'leads.operate' //              llamar, cambiar stage, cerrar
  | 'cvr.view.own'
  | 'cvr.view.team'
  | 'cvr.view.all'
  | 'comisiones.view.own'
  | 'comisiones.view.team'
  | 'comisiones.view.all'
  | 'liquidaciones.upload_csv' //   cargar CSV de aseguradora
  | 'liquidaciones.assign' //       asignar líneas a closers
  | 'liquidaciones.approve' //      aprobar liquidaciones (supervisor)
  | 'liquidaciones.reconcile' //    reconciliar con compañías (admin)
  | 'liquidaciones.export' //       export contable
  | 'config.commissions' //         editar % comisiones, niveles, terna
  | 'users.manage' //               alta/baja usuarios
  | 'audit.view' //                 ver audit log
  | 'integrations.manage'; //       config GHL / pipelines / webhooks

// Matriz rol → capacidades.
const ROLE_CAPABILITIES: Record<HubRole, HubCapability[]> = {
  admin: [
    'hub.access',
    'leads.view.all',
    'leads.operate',
    'cvr.view.all',
    'comisiones.view.all',
    'liquidaciones.upload_csv',
    'liquidaciones.assign',
    'liquidaciones.approve',
    'liquidaciones.reconcile',
    'liquidaciones.export',
    'config.commissions',
    'users.manage',
    'audit.view',
    'integrations.manage',
  ],
  supervisor: [
    'hub.access',
    'leads.view.team',
    'leads.operate',
    'cvr.view.team',
    'comisiones.view.team',
    'liquidaciones.upload_csv',
    'liquidaciones.assign',
    'liquidaciones.approve',
    'liquidaciones.export',
    'audit.view',
  ],
  tecnico: [
    'hub.access',
    'audit.view',
    'integrations.manage',
  ],
  closer: [
    'hub.access',
    'leads.view.own',
    'leads.operate',
    'cvr.view.own',
    'comisiones.view.own',
  ],
};

/** ¿El rol tiene la capacidad indicada? */
export function can(rol: HubRole | null | undefined, capability: HubCapability): boolean {
  if (!rol) return false;
  return ROLE_CAPABILITIES[rol]?.includes(capability) ?? false;
}

/** Lista de capacidades de un rol (para depurar o pintar en UI). */
export function capabilitiesOf(rol: HubRole): HubCapability[] {
  return ROLE_CAPABILITIES[rol] ?? [];
}

/** Alcance de visibilidad sobre datos de otros usuarios. */
export type HubScope = 'own' | 'team' | 'all' | 'none';

export function leadsScope(rol: HubRole | null | undefined): HubScope {
  if (!rol) return 'none';
  if (can(rol, 'leads.view.all')) return 'all';
  if (can(rol, 'leads.view.team')) return 'team';
  if (can(rol, 'leads.view.own')) return 'own';
  return 'none';
}

export function comisionesScope(rol: HubRole | null | undefined): HubScope {
  if (!rol) return 'none';
  if (can(rol, 'comisiones.view.all')) return 'all';
  if (can(rol, 'comisiones.view.team')) return 'team';
  if (can(rol, 'comisiones.view.own')) return 'own';
  return 'none';
}
