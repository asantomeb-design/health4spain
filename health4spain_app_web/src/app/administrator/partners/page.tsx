'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { CITIES } from '@/lib/constants';
import {
  PARTNER_PLAN_LABELS,
  PARTNER_TIER_LABELS,
  PARTNER_SERVICE_LABELS,
  buildPartnerAccessUrl,
} from '@/lib/partners';
import type {
  PartnerLead,
  PartnerLeadStage,
  PartnerCualificacionTipo,
} from '@/lib/types';

const STAGE_LABELS: Record<PartnerLeadStage, string> = {
  solicitud_recibida: 'Solicitud recibida',
  en_revision: 'En revisión',
  llamada_agendada: 'Llamada agendada',
  cualificado: 'Cualificado',
  rechazado: 'Rechazado',
  contrato_solicitado: 'Contrato solicitado',
  contratado: 'Contratado',
  baja: 'Baja',
};

const STAGE_COLORS: Record<PartnerLeadStage, string> = {
  solicitud_recibida: 'bg-blue-100 text-blue-800',
  en_revision: 'bg-yellow-100 text-yellow-800',
  llamada_agendada: 'bg-amber-100 text-amber-800',
  cualificado: 'bg-purple-100 text-purple-800',
  rechazado: 'bg-red-100 text-red-800',
  contrato_solicitado: 'bg-cyan-100 text-cyan-800',
  contratado: 'bg-green-100 text-green-800',
  baja: 'bg-gray-100 text-gray-800',
};

const PER_PAGE = 20;

export default function AdminPartnersPage() {
  const { fetchWithAuth, isLoading: authLoading } = useAuth();

  const [leads, setLeads] = useState<PartnerLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filterStage, setFilterStage] = useState<PartnerLeadStage | ''>('');
  const [filterServicio, setFilterServicio] = useState('');
  const [filterCiudad, setFilterCiudad] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selected, setSelected] = useState<PartnerLead | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [actionErr, setActionErr] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('per_page', String(PER_PAGE));
      if (filterStage) params.set('stage', filterStage);
      if (filterServicio) params.set('servicio', filterServicio);
      if (filterCiudad) params.set('ciudad', filterCiudad);
      if (search.trim()) params.set('search', search.trim());

      const res = await fetchWithAuth(`/api/partners/leads?${params}`);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || 'Error obteniendo partner_leads');
      }
      setLeads(json.data || []);
      setTotalPages(json.total_pages || 1);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth, page, filterStage, filterServicio, filterCiudad, search]);

  useEffect(() => {
    if (authLoading) return;
    fetchLeads();
  }, [authLoading, fetchLeads]);

  const callQualifyApi = async (
    body: Record<string, unknown>,
    successMsg: string
  ): Promise<{ access_url?: string | null; access_token?: string | null } | null> => {
    setActionMsg(null);
    setActionErr(null);
    try {
      const res = await fetchWithAuth('/api/partners/qualify', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || 'Error al ejecutar la acción');
      }
      setActionMsg(successMsg);
      // Refrescar listado y selección
      await fetchLeads();
      if (selected && body.id === selected.id) {
        const refreshed = (json.data || {}) as PartnerLead;
        setSelected({ ...selected, ...refreshed });
      }
      return json.data || null;
    } catch (err) {
      console.error(err);
      setActionErr(err instanceof Error ? err.message : 'Error desconocido');
      return null;
    }
  };

  const handleQualify = async (lead: PartnerLead, tipo: PartnerCualificacionTipo) => {
    const notas = prompt(
      `Notas de cualificación (${tipo}) — opcional:\n\nEj. "Encaje claro, va con todo. Founding asegurado."`
    );
    if (notas === null) return; // cancel
    const result = await callQualifyApi(
      { id: lead.id, action: 'qualify', cualificacion_tipo: tipo, cualificacion_notas: notas || undefined },
      `Partner cualificado (Tipo ${tipo}). Token generado.`
    );
    if (result?.access_url) {
      try {
        await navigator.clipboard.writeText(result.access_url);
        setActionMsg(
          `Cualificado y enlace de acceso copiado al portapapeles. Pégalo en WhatsApp/email del partner.`
        );
      } catch {
        // Fallback silencioso si no hay permiso de clipboard
      }
    }
  };

  const handleReject = async (lead: PartnerLead) => {
    const notas = prompt(
      `Motivo del rechazo — opcional pero recomendable:\n\nEj. "Sin años suficientes en zona, % cartera extranjera muy bajo."`
    );
    if (notas === null) return;
    if (!window.confirm(`¿Marcar a ${lead.nombre} (${lead.empresa}) como RECHAZADO?`)) return;
    await callQualifyApi(
      { id: lead.id, action: 'reject', cualificacion_notas: notas || undefined },
      'Partner marcado como rechazado. Token invalidado.'
    );
  };

  const handleRegenerate = async (lead: PartnerLead) => {
    if (!window.confirm('¿Regenerar el token de acceso? El enlace anterior dejará de funcionar.')) {
      return;
    }
    const result = await callQualifyApi(
      { id: lead.id, action: 'regenerate_token' },
      'Token regenerado.'
    );
    if (result?.access_url) {
      try {
        await navigator.clipboard.writeText(result.access_url);
        setActionMsg('Nuevo enlace copiado al portapapeles.');
      } catch {
        // ignore
      }
    }
  };

  const handleSetStage = async (lead: PartnerLead, stage: PartnerLeadStage) => {
    if (lead.stage === stage) return;
    await callQualifyApi(
      { id: lead.id, action: 'set_stage', stage },
      `Stage actualizado a "${STAGE_LABELS[stage]}".`
    );
  };

  const copyAccessUrl = async (lead: PartnerLead) => {
    if (!lead.access_token) return;
    const url = buildPartnerAccessUrl(lead.access_token);
    try {
      await navigator.clipboard.writeText(url);
      setActionMsg('Enlace de acceso copiado al portapapeles.');
    } catch {
      setActionErr('No se ha podido copiar al portapapeles.');
    }
  };

  return (
    <div className="p-8 md:p-12">
      <header className="mb-10 flex items-end justify-between gap-6 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-600 mb-2">
            Health4Spain · Admin
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Partners · candidatos</h1>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Solicitudes recibidas desde la landing pública. Cualifica → genera token → copia enlace
            → envíalo por WhatsApp/email al partner.
          </p>
        </div>
        <button
          type="button"
          onClick={() => fetchLeads()}
          className="btn-minimal text-sm"
          disabled={loading}
        >
          {loading ? 'Cargando…' : '↻ Refrescar'}
        </button>
      </header>

      {(actionMsg || actionErr) && (
        <div
          className={`mb-6 rounded-md p-4 text-sm ${
            actionErr
              ? 'bg-red-50 border border-red-200 text-red-800'
              : 'bg-green-50 border border-green-200 text-green-800'
          }`}
          role="status"
          onClick={() => {
            setActionMsg(null);
            setActionErr(null);
          }}
        >
          {actionErr || actionMsg}
        </div>
      )}

      {/* Filtros */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setPage(1);
              fetchLeads();
            }
          }}
          placeholder="Buscar por nombre, empresa, email…"
          className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-accent"
        />
        <select
          value={filterStage}
          onChange={(e) => {
            setPage(1);
            setFilterStage(e.target.value as PartnerLeadStage | '');
          }}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-accent"
        >
          <option value="">Todos los estados</option>
          {Object.entries(STAGE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <select
          value={filterServicio}
          onChange={(e) => {
            setPage(1);
            setFilterServicio(e.target.value);
          }}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-accent"
        >
          <option value="">Todos los servicios</option>
          <option value="abogados">Abogados</option>
          <option value="gestorias">Gestoría</option>
          <option value="inmobiliarias">Inmobiliarias</option>
          <option value="seguros">Seguros</option>
        </select>
        <select
          value={filterCiudad}
          onChange={(e) => {
            setPage(1);
            setFilterCiudad(e.target.value);
          }}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-accent"
        >
          <option value="">Todas las ciudades</option>
          {CITIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name} ({c.province})
            </option>
          ))}
        </select>
      </section>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-md p-4 text-sm">
          {error}
        </div>
      )}

      {/* Tabla */}
      <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-widest text-gray-600">
            <tr>
              <th className="text-left px-4 py-3">Solicitud</th>
              <th className="text-left px-4 py-3">Profesional</th>
              <th className="text-left px-4 py-3">Servicio · Ciudad</th>
              <th className="text-left px-4 py-3">Estado</th>
              <th className="text-left px-4 py-3">Token</th>
              <th className="text-right px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leads.map((lead) => {
              const created = new Date(lead.created_at);
              const tokenVigente =
                Boolean(lead.access_token) &&
                Boolean(lead.access_token_expires_at) &&
                new Date(lead.access_token_expires_at!).getTime() > Date.now();
              return (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 align-top">
                    <p className="font-medium">
                      {created.toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {created.toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <p className="font-medium">{lead.nombre}</p>
                    <p className="text-xs text-gray-500">{lead.empresa}</p>
                    <p className="text-xs text-gray-500">{lead.email}</p>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <p className="font-medium">
                      {PARTNER_SERVICE_LABELS[lead.servicio] || lead.servicio}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {lead.ciudad_principal.replace(/-/g, ' ')}
                      {!lead.ciudad_es_estrategica && (
                        <span className="ml-1 text-amber-600">· no estratégica</span>
                      )}
                    </p>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                        STAGE_COLORS[lead.stage]
                      }`}
                    >
                      {STAGE_LABELS[lead.stage]}
                    </span>
                    {lead.cualificacion_tipo && (
                      <p className="text-xs text-gray-500 mt-1">
                        Tipo {lead.cualificacion_tipo}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top text-xs">
                    {tokenVigente ? (
                      <span className="text-green-700 font-bold">✓ Vigente</span>
                    ) : lead.access_token ? (
                      <span className="text-gray-400">Caducado</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top text-right">
                    <button
                      type="button"
                      onClick={() => setSelected(lead)}
                      className="text-xs px-3 py-1 border border-gray-300 rounded hover:border-accent hover:text-accent"
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              );
            })}
            {!loading && leads.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-500 italic">
                  No hay solicitudes que coincidan con los filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="mt-6 flex items-center justify-between text-sm">
        <p className="text-gray-500">
          Página {page} de {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-30"
          >
            ← Anterior
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-30"
          >
            Siguiente →
          </button>
        </div>
      </div>

      {/* Modal de detalle */}
      {selected && (
        <DetailModal
          lead={selected}
          onClose={() => setSelected(null)}
          onQualify={handleQualify}
          onReject={handleReject}
          onRegenerate={handleRegenerate}
          onSetStage={handleSetStage}
          onCopyUrl={copyAccessUrl}
        />
      )}
    </div>
  );
}

// =============================================
// Detail Modal
// =============================================
function DetailModal({
  lead,
  onClose,
  onQualify,
  onReject,
  onRegenerate,
  onSetStage,
  onCopyUrl,
}: {
  lead: PartnerLead;
  onClose: () => void;
  onQualify: (l: PartnerLead, tipo: PartnerCualificacionTipo) => void;
  onReject: (l: PartnerLead) => void;
  onRegenerate: (l: PartnerLead) => void;
  onSetStage: (l: PartnerLead, stage: PartnerLeadStage) => void;
  onCopyUrl: (l: PartnerLead) => void;
}) {
  const tokenVigente =
    Boolean(lead.access_token) &&
    Boolean(lead.access_token_expires_at) &&
    new Date(lead.access_token_expires_at!).getTime() > Date.now();
  const accessUrl = lead.access_token ? buildPartnerAccessUrl(lead.access_token) : null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-md max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-start mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Detalle</p>
            <h2 className="text-2xl font-bold">{lead.nombre}</h2>
            <p className="text-sm text-gray-600">{lead.empresa}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-black text-2xl leading-none"
            aria-label="Cerrar"
          >
            ×
          </button>
        </header>

        <section className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <Info k="Email" v={lead.email} />
          <Info k="Teléfono" v={lead.telefono} />
          <Info k="Servicio" v={PARTNER_SERVICE_LABELS[lead.servicio] || lead.servicio} />
          <Info
            k="Ciudad"
            v={`${lead.ciudad_principal.replace(/-/g, ' ')} ${
              lead.ciudad_es_estrategica ? '· estratégica' : '· no estratégica'
            }`}
          />
          <Info k="Años ejerciendo" v={lead.anos_ejerciendo?.toString() || '—'} />
          <Info
            k="% cartera extranjera"
            v={
              lead.pct_cartera_extranjera
                ? lead.pct_cartera_extranjera.replace('_', '–').replace('mas-', '+').replace('menos-', '<')
                : '—'
            }
          />
          <Info k="Idiomas" v={lead.idiomas?.join(', ') || '—'} />
          <Info k="Stage" v={STAGE_LABELS[lead.stage]} />
        </section>

        {lead.about && (
          <section className="mb-6">
            <p className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-2">
              Sobre el despacho
            </p>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md whitespace-pre-wrap">
              {lead.about}
            </p>
          </section>
        )}

        {lead.cualificacion_tipo && (
          <section className="mb-6 bg-purple-50 border border-purple-200 rounded-md p-4 text-sm">
            <p className="font-bold mb-1">
              Cualificado · Tipo {lead.cualificacion_tipo}
              {lead.cualificado_por_email && ` · por ${lead.cualificado_por_email}`}
              {lead.cualificado_at && ` · ${new Date(lead.cualificado_at).toLocaleString('es-ES')}`}
            </p>
            {lead.cualificacion_notas && (
              <p className="text-gray-700 whitespace-pre-wrap mt-2">{lead.cualificacion_notas}</p>
            )}
          </section>
        )}

        {/* Token de acceso */}
        <section className="mb-6 bg-gray-50 border border-gray-200 rounded-md p-4">
          <p className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-2">
            Enlace de acceso al panel privado
          </p>
          {tokenVigente && accessUrl ? (
            <>
              <p className="text-xs text-gray-500 break-all bg-white p-2 rounded border border-gray-200 mb-2 font-mono">
                {accessUrl}
              </p>
              <p className="text-xs text-gray-500">
                Caduca:{' '}
                {lead.access_token_expires_at
                  ? new Date(lead.access_token_expires_at).toLocaleString('es-ES')
                  : '—'}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => onCopyUrl(lead)}
                  className="text-xs px-3 py-1 bg-black text-white rounded hover:opacity-80"
                >
                  📋 Copiar enlace
                </button>
                <button
                  type="button"
                  onClick={() => onRegenerate(lead)}
                  className="text-xs px-3 py-1 border border-gray-300 rounded hover:border-gray-500"
                >
                  ↻ Regenerar
                </button>
              </div>
            </>
          ) : (
            <p className="text-xs text-gray-500 italic">
              {lead.access_token
                ? 'El token ha caducado. Cualifica de nuevo o regenera el token.'
                : 'Aún no se ha generado token. Cualifica al partner para crear el enlace.'}
            </p>
          )}
        </section>

        {/* Selección de contrato */}
        {lead.contract_requested_at && (
          <section className="mb-6 bg-cyan-50 border border-cyan-200 rounded-md p-4 text-sm">
            <p className="font-bold mb-2">
              Contrato solicitado · {new Date(lead.contract_requested_at).toLocaleString('es-ES')}
            </p>
            <ul className="space-y-1">
              {lead.contract_plan && (
                <li>
                  <strong>Plan:</strong> {PARTNER_PLAN_LABELS[lead.contract_plan]}
                </li>
              )}
              {lead.contract_tier && (
                <li>
                  <strong>Tier:</strong> {PARTNER_TIER_LABELS[lead.contract_tier]}
                </li>
              )}
              {lead.contract_verticales && lead.contract_verticales.length > 0 && (
                <li>
                  <strong>Verticales:</strong> {lead.contract_verticales.join(' · ')}
                </li>
              )}
              {lead.contract_zonas_adicionales && lead.contract_zonas_adicionales.length > 0 && (
                <li>
                  <strong>Zonas adicionales:</strong> {lead.contract_zonas_adicionales.join(' · ')}
                </li>
              )}
              <li>
                <strong>Founding:</strong> {lead.contract_founding ? 'Sí' : 'No'}
              </li>
              {lead.contract_notes && (
                <li>
                  <strong>Notas:</strong>{' '}
                  <span className="whitespace-pre-wrap">{lead.contract_notes}</span>
                </li>
              )}
            </ul>
          </section>
        )}

        {/* Acciones */}
        <section className="border-t border-gray-200 pt-6">
          <p className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-4">
            Acciones
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <button
              type="button"
              onClick={() => onQualify(lead, 'A')}
              className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-bold hover:opacity-90"
            >
              ✓ Cualificar Tipo A (firma)
            </button>
            <button
              type="button"
              onClick={() => onQualify(lead, 'B')}
              className="px-4 py-2 bg-amber-500 text-white rounded-md text-sm font-bold hover:opacity-90"
            >
              ◐ Cualificar Tipo B (dudoso)
            </button>
            <button
              type="button"
              onClick={() => onQualify(lead, 'C')}
              className="px-4 py-2 bg-gray-500 text-white rounded-md text-sm font-bold hover:opacity-90"
            >
              ○ Cualificar Tipo C (no encaja)
            </button>
            <button
              type="button"
              onClick={() => onReject(lead)}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-bold hover:opacity-90"
            >
              ✕ Rechazar
            </button>
          </div>

          <p className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-2">
            Cambiar stage manualmente
          </p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(STAGE_LABELS) as PartnerLeadStage[]).map((stage) => (
              <button
                key={stage}
                type="button"
                onClick={() => onSetStage(lead, stage)}
                disabled={lead.stage === stage}
                className={`text-xs px-3 py-1 rounded-full border ${
                  lead.stage === stage
                    ? 'bg-black text-white border-black opacity-50 cursor-not-allowed'
                    : 'bg-white border-gray-300 hover:border-gray-500'
                }`}
              >
                {STAGE_LABELS[stage]}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Info({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-gray-500">{k}</p>
      <p className="font-medium break-words">{v}</p>
    </div>
  );
}
