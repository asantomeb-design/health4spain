'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  PARTNER_PRICES,
  PARTNER_VOLUMES_BASE,
  PARTNER_CPL_EXTRA,
  PARTNER_PLAN_LABELS,
  PARTNER_TIER_LABELS,
  PARTNER_SERVICE_LABELS,
  PARTNER_SERVICE_ICONS,
  PARTNER_SERVICES,
  PARTNER_FOUNDING_DISCOUNT,
  PARTNER_FOUNDING_DURATION_MONTHS,
  PARTNER_PROGRESSION_MONTHS,
  computeMultiVertical,
  computeRoi,
  formatEuros,
} from '@/lib/partners';
import type {
  PartnerAccessPublicData,
  PartnerPlan,
  PartnerService,
  PartnerTier,
} from '@/lib/types';

type ViewState = 'loading' | 'invalid' | 'ready';

const PROFILE_DEFAULTS: Record<PartnerService, { ticket: number; recurrence: number }> = {
  seguros:       { ticket: 500,  recurrence: 1.2 },
  abogados:      { ticket: 800,  recurrence: 1.1 },
  gestorias:     { ticket: 200,  recurrence: 4.0 },
  inmobiliarias: { ticket: 2500, recurrence: 1.0 },
};

export default function PartnerAccessClient() {
  const searchParams = useSearchParams();
  const token = (searchParams.get('token') || '').trim();

  const [view, setView] = useState<ViewState>('loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [data, setData] = useState<PartnerAccessPublicData | null>(null);

  // Estado de la calculadora y selección
  const [tier, setTier] = useState<PartnerTier>('B');
  const [plan, setPlan] = useState<PartnerPlan>('ACTIVA');
  const [verticales, setVerticales] = useState<PartnerService[]>([]);
  const [founding, setFounding] = useState<boolean>(true);

  // Inputs ROI
  const [leadsPerMonth, setLeadsPerMonth] = useState<number>(25);
  const [closeRate, setCloseRate] = useState<number>(0.2);
  const [ticket, setTicket] = useState<number>(2500);
  const [recurrence, setRecurrence] = useState<number>(1.0);

  // Estado de envío "Solicitar contrato Founding"
  const [contractStatus, setContractStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [contractError, setContractError] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>('');

  // ============================================
  // Validación del token contra el backend
  // ============================================
  useEffect(() => {
    let cancelled = false;
    if (!token) {
      setView('invalid');
      setErrorMsg('Falta el enlace de acceso. Revisa el correo/WhatsApp que te enviamos.');
      return () => {
        cancelled = true;
      };
    }
    (async () => {
      try {
        const res = await fetch(`/api/partners/access/${encodeURIComponent(token)}`, {
          method: 'GET',
          cache: 'no-store',
        });
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok || !json?.success) {
          setView('invalid');
          setErrorMsg(json?.error || 'Enlace inválido o caducado.');
          return;
        }
        const d = json.data as PartnerAccessPublicData;
        setData(d);
        setTier(d.tier_sugerido);
        setFounding(Boolean(d.founding_disponible));
        // Pre-seleccionamos la vertical principal con la del formulario
        if (d.servicio) {
          setVerticales([d.servicio]);
        }
        // Pre-set defaults de ticket y recurrencia según servicio
        const def = PROFILE_DEFAULTS[d.servicio] || PROFILE_DEFAULTS.inmobiliarias;
        setTicket(def.ticket);
        setRecurrence(def.recurrence);
        // Si ya había una selección previa de contrato, hidratar
        if (d.contract_plan) setPlan(d.contract_plan);
        if (d.contract_verticales && d.contract_verticales.length > 0) {
          const valid = d.contract_verticales.filter((v): v is PartnerService =>
            (PARTNER_SERVICES as readonly string[]).includes(v)
          );
          if (valid.length > 0) setVerticales(valid);
        }
        setView('ready');
      } catch (err) {
        if (cancelled) return;
        console.error(err);
        setView('invalid');
        setErrorMsg('No hemos podido validar tu enlace. Intenta de nuevo o contacta con el equipo.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  // ============================================
  // Cálculos derivados
  // ============================================
  const roi = useMemo(
    () =>
      computeRoi({
        tier,
        plan,
        leadsPerMonth,
        closeRate,
        ticketAverage: ticket,
        recurrence,
        founding,
      }),
    [tier, plan, leadsPerMonth, closeRate, ticket, recurrence, founding]
  );

  const multiVertical = useMemo(
    () => computeMultiVertical(tier, plan, verticales, founding),
    [tier, plan, verticales, founding]
  );

  const basePrice = PARTNER_PRICES[tier][plan];
  const monthlyEffective = founding
    ? Math.round(basePrice * (1 - PARTNER_FOUNDING_DISCOUNT))
    : basePrice;

  // ============================================
  // Acciones
  // ============================================
  const toggleVertical = (svc: PartnerService) => {
    setVerticales((prev) => {
      const has = prev.includes(svc);
      if (has) return prev.filter((s) => s !== svc);
      if (prev.length >= 4) return prev;
      return [...prev, svc];
    });
  };

  const moveVerticalUp = (svc: PartnerService) => {
    setVerticales((prev) => {
      const idx = prev.indexOf(svc);
      if (idx <= 0) return prev;
      const out = [...prev];
      [out[idx - 1], out[idx]] = [out[idx], out[idx - 1]];
      return out;
    });
  };

  const handleRequestContract = async () => {
    if (contractStatus === 'sending') return;
    if (verticales.length === 0) {
      setContractError('Selecciona al menos una vertical.');
      return;
    }
    setContractStatus('sending');
    setContractError(null);

    try {
      const res = await fetch('/api/partners/contract-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          plan,
          verticales,
          zonas_adicionales: [],
          founding,
          notes: notes.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || 'No se pudo enviar la solicitud.');
      }
      setContractStatus('done');
      setTimeout(() => {
        window.location.href = '/es/partners/acceso/contrato';
      }, 600);
    } catch (err) {
      console.error(err);
      setContractStatus('error');
      setContractError(err instanceof Error ? err.message : 'Error desconocido.');
    }
  };

  // ============================================
  // Render
  // ============================================
  if (view === 'loading') {
    return (
      <section className="section">
        <div className="container-narrow text-center">
          <p className="text-gray-500">Validando acceso…</p>
        </div>
      </section>
    );
  }

  if (view === 'invalid' || !data) {
    return (
      <section className="section">
        <div className="container-narrow max-w-2xl text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-3xl font-bold">
            ✕
          </div>
          <h1 className="mb-4">Enlace no válido</h1>
          <p className="text-gray-600 mb-8">
            {errorMsg ||
              'El enlace de acceso es incorrecto o ha caducado. Contacta con el equipo H4S y te enviaremos uno nuevo.'}
          </p>
          <Link href="/es/partners" className="btn-minimal">
            Volver a la página de partners
          </Link>
        </div>
      </section>
    );
  }

  // === Vista válida (data presente) ===
  return (
    <>
      {/* HEADER */}
      <section className="bg-black text-white">
        <div className="container-narrow py-12 md:py-16">
          <span className="inline-block text-xs uppercase tracking-widest font-bold text-accent border border-accent/40 bg-accent/10 px-3 py-1 rounded-full mb-4">
            ✓ Sesión validada · Acceso completo
          </span>
          <h1 className="text-white mb-3">
            Hola {data.first_name || 'partner'}, este es tu acceso privado
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-3xl leading-relaxed">
            Hemos pre-validado tu perfil. Tienes desbloqueadas las{' '}
            <strong className="text-white">tarifas detalladas para tu zona</strong>, la{' '}
            <strong className="text-white">calculadora ROI</strong> con tus números y la opción de
            solicitar contrato Founding.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-widest">
            <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1">
              <span className="text-gray-400">Empresa:</span>{' '}
              <span className="text-white font-bold">{data.empresa}</span>
            </span>
            <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1">
              <span className="text-gray-400">Servicio:</span>{' '}
              <span className="text-white font-bold">
                {PARTNER_SERVICE_ICONS[data.servicio]} {PARTNER_SERVICE_LABELS[data.servicio]}
              </span>
            </span>
            <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1">
              <span className="text-gray-400">Ciudad:</span>{' '}
              <span className="text-white font-bold capitalize">
                {data.ciudad_principal.replace(/-/g, ' ')}
              </span>
            </span>
            <span className="bg-accent/20 border border-accent/40 text-accent rounded-full px-3 py-1 font-bold">
              {PARTNER_TIER_LABELS[data.tier_sugerido]}
            </span>
          </div>
        </div>
      </section>

      {/* TARIFAS PARA TU ZONA */}
      <section className="section">
        <div className="container-narrow">
          <p className="text-xs uppercase tracking-widest font-bold text-accent mb-3">
            01 · Tarifas para tu zona
          </p>
          <h2 className="mb-4">Tu tier es {tier} · {PARTNER_TIER_LABELS[tier].split('·')[1].trim()}</h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            Estos son los precios mensuales por plan. Las plazas en planes Activa, Crece y Escala
            son <strong>compartidas</strong> · pueden coexistir varios partners en la misma zona.
            La <strong>exclusividad geográfica</strong> solo aplica al plan Lidera (acceso por
            trayectoria, mínimo 21 meses + KPIs).
          </p>

          {founding && (
            <div className="mb-6 p-5 rounded-md text-white" style={{ background: 'var(--color-accent)' }}>
              <p className="font-bold">
                🎯 Descuento Founding aplicable · {Math.round(PARTNER_FOUNDING_DISCOUNT * 100)}% off
                durante {PARTNER_FOUNDING_DURATION_MONTHS} meses
              </p>
              <p className="text-sm text-white/90 mt-1">
                Bloqueo de precio de por vida + setup gratuito + perks adicionales. Las cifras de la
                tabla incluyen ya el descuento.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(['ACTIVA', 'CRECE', 'ESCALA', 'LIDERA'] as PartnerPlan[]).map((p) => {
              const base = PARTNER_PRICES[tier][p];
              const fee = founding ? Math.round(base * (1 - PARTNER_FOUNDING_DISCOUNT)) : base;
              const isElite = p === 'LIDERA';
              const isContractable = p === 'ACTIVA';
              const months = PARTNER_PROGRESSION_MONTHS[p];
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => isContractable && setPlan(p)}
                  className={`text-left p-5 border-t-3 bg-white transition-shadow hover:shadow-md ${
                    isElite
                      ? 'border-black ring-1 ring-black'
                      : plan === p
                      ? 'border-accent ring-2 ring-accent/30'
                      : 'border-accent'
                  } ${isContractable ? 'cursor-pointer' : 'opacity-90 cursor-default'}`}
                  aria-pressed={plan === p}
                >
                  <p className="text-xs uppercase tracking-widest font-bold text-accent mb-2">
                    {p === 'ACTIVA'
                      ? 'Plan de entrada'
                      : p === 'LIDERA'
                      ? 'Por trayectoria · 21 m+'
                      : `Tras ${months} meses`}
                  </p>
                  <h3 className="text-xl font-bold mb-2">{PARTNER_PLAN_LABELS[p]}</h3>
                  <div className="text-3xl font-bold">
                    {formatEuros(fee)}
                    <span className="text-xs text-gray-500 font-normal">/mes</span>
                  </div>
                  {founding && fee !== base && (
                    <p className="text-xs text-gray-500 line-through mt-1">{formatEuros(base)} base</p>
                  )}
                  <p className="text-sm text-gray-600 mt-3">
                    {p === 'LIDERA'
                      ? 'Leads ilimitados'
                      : `${PARTNER_VOLUMES_BASE[p]} leads/mes incluidos`}
                  </p>
                  <p className="text-xs text-accent font-bold mt-1">
                    {PARTNER_CPL_EXTRA[p] > 0
                      ? `+${PARTNER_CPL_EXTRA[p]}€/lead extra`
                      : 'Sin recargo por exceso'}
                  </p>
                  <p className="mt-4 text-xs uppercase tracking-widest font-bold">
                    {p === 'LIDERA' ? (
                      <span className="text-black">Exclusividad de zona</span>
                    ) : (
                      <span className="text-gray-500">Zona compartida</span>
                    )}
                  </p>
                  {!isContractable && (
                    <p className="mt-2 text-xs text-gray-500 italic">
                      Se desbloquea por trayectoria
                    </p>
                  )}
                  {isContractable && plan === p && (
                    <p className="mt-2 text-xs text-accent font-bold">✓ Plan seleccionado</p>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selector de tier alternativo (por si el closer pide cambiarlo en la llamada) */}
          <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-md text-sm flex flex-wrap items-center gap-3">
            <span className="font-bold text-gray-700">Simular otro tier:</span>
            {(['A', 'B', 'C'] as PartnerTier[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTier(t)}
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                  tier === t
                    ? 'bg-black text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-500'
                }`}
              >
                Tier {t}
              </button>
            ))}
            <span className="text-xs text-gray-500 italic">
              Tu tier confirmado por el closer es {data.tier_sugerido}
            </span>
          </div>
        </div>
      </section>

      {/* CALCULADORA ROI */}
      <section className="section section-alt">
        <div className="container-narrow">
          <p className="text-xs uppercase tracking-widest font-bold text-accent mb-3">
            02 · Calculadora ROI
          </p>
          <h2 className="mb-4">Tus números con H4S</h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            Introduce tus parámetros reales y comprueba el retorno mensual y anual con cualquier
            plan H4S. Cifras estimadas, no compromisos contractuales.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inputs */}
            <div className="bg-white border-t-3 border-accent p-6">
              <h3 className="text-lg font-bold mb-5">📝 Tus datos</h3>

              <RangeField
                label="Leads/mes que esperas trabajar"
                value={leadsPerMonth}
                min={5}
                max={100}
                step={1}
                display={`${leadsPerMonth}`}
                onChange={setLeadsPerMonth}
              />

              <RangeField
                label="Tasa de cierre estimada"
                value={Math.round(closeRate * 100)}
                min={5}
                max={50}
                step={1}
                display={`${Math.round(closeRate * 100)}%`}
                help="% de leads que se convierten en cliente"
                onChange={(v) => setCloseRate(v / 100)}
              />

              <RangeField
                label="Ticket medio por operación"
                value={ticket}
                min={100}
                max={15000}
                step={100}
                display={formatEuros(ticket)}
                onChange={setTicket}
              />

              <RangeField
                label="Recurrencia anual del cliente"
                value={Number(recurrence.toFixed(1))}
                min={1}
                max={5}
                step={0.1}
                display={`${recurrence.toFixed(1)}x`}
                help="Cuántas veces al año el mismo cliente vuelve"
                onChange={setRecurrence}
              />
            </div>

            {/* Outputs */}
            <div className="bg-black text-white border-t-3 border-accent p-6 rounded-md">
              <h3 className="text-lg font-bold mb-5 text-accent">📈 Tu retorno con plan {PARTNER_PLAN_LABELS[plan]}</h3>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <KpiCard
                  bg="rgba(10,124,78,0.25)"
                  border="rgba(95,217,152,0.35)"
                  value={formatEuros(roi.revenueMonth)}
                  small="/mes"
                  label="Revenue/mes"
                />
                <KpiCard
                  bg="rgba(59,189,218,0.18)"
                  border="rgba(59,189,218,0.4)"
                  value={formatEuros(roi.monthlyFee + roi.cplMonth)}
                  small="/mes"
                  label="Coste H4S"
                />
                <KpiCard
                  bg="rgba(232,148,58,0.18)"
                  border="rgba(232,148,58,0.4)"
                  value={`${roi.roi.toFixed(1)}x`}
                  small="retorno"
                  label="ROI"
                />
              </div>

              <dl className="space-y-2 text-sm">
                <Row k="Operaciones cerradas/mes" v={roi.opsPerMonth.toFixed(1)} />
                <Row k="Revenue bruto/mes" v={formatEuros(roi.revenueMonth)} />
                <Row k="Revenue anual (con recurrencia)" v={formatEuros(roi.revenueYear)} />
                <Row k="Cuota H4S anual" v={formatEuros(roi.monthlyFee * 12)} />
                <Row
                  k="CPL extra (si excede leads base)"
                  v={roi.cplMonth > 0 ? `${formatEuros(roi.cplMonth)}/mes` : '0€'}
                />
                <Row
                  k="Margen neto anual"
                  v={formatEuros(roi.netYear)}
                  highlight
                />
                <Row
                  k="Payback (meses)"
                  v={roi.paybackMonths > 0 ? roi.paybackMonths.toFixed(1) : '< 1'}
                />
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* CONFIGURA TU CONTRATACIÓN */}
      <section className="section" id="contratar">
        <div className="container-narrow">
          <p className="text-xs uppercase tracking-widest font-bold text-accent mb-3">
            03 · Configura tu contratación
          </p>
          <h2 className="mb-4">Verticales que ofreces</h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            Selecciona las verticales que prestas en tu despacho. La primera = vertical principal
            (100% de cuota). Cada vertical adicional aplica un descuento progresivo (0% / 10% / 30%
            / 40% estándar; +5pp si Founding). Puedes reordenarlas con el botón ↑.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {PARTNER_SERVICES.map((svc) => {
              const idx = verticales.indexOf(svc);
              const active = idx >= 0;
              const positionLabel = ['Principal', '2ª', '3ª', '4ª'][idx];
              return (
                <button
                  key={svc}
                  type="button"
                  onClick={() => toggleVertical(svc)}
                  className={`p-4 border text-left transition-colors ${
                    active
                      ? 'bg-black text-white border-black'
                      : 'bg-white border-gray-300 hover:border-accent'
                  }`}
                >
                  <span className="text-2xl block mb-1">{PARTNER_SERVICE_ICONS[svc]}</span>
                  <span className="text-sm font-bold block">
                    {PARTNER_SERVICE_LABELS[svc].split(' / ')[0]}
                  </span>
                  {active && (
                    <span className="text-xs uppercase tracking-widest text-accent font-bold mt-2 block">
                      {positionLabel}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Reordenar verticales */}
          {verticales.length > 1 && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
              <p className="text-xs uppercase tracking-widest font-bold text-gray-700 mb-3">
                Orden de prelación (la 1ª es la principal)
              </p>
              <ol className="space-y-2">
                {verticales.map((svc, i) => (
                  <li
                    key={svc}
                    className="flex items-center justify-between bg-white border border-gray-200 rounded-md px-4 py-2 text-sm"
                  >
                    <span>
                      <strong className="text-accent mr-2">#{i + 1}</strong>
                      {PARTNER_SERVICE_ICONS[svc]} {PARTNER_SERVICE_LABELS[svc]}
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => moveVerticalUp(svc)}
                        disabled={i === 0}
                        className="text-xs px-2 py-1 border border-gray-300 rounded disabled:opacity-30 hover:border-gray-500"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleVertical(svc)}
                        className="text-xs px-2 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50"
                      >
                        Quitar
                      </button>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Resumen de cuota total */}
          {multiVertical.items.length > 0 && (
            <div className="bg-white border-t-3 border-accent p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">Resumen de cuota mensual</h3>
              <ul className="divide-y divide-gray-200">
                {multiVertical.items.map((it) => (
                  <li key={it.servicio} className="flex items-center justify-between py-3 text-sm">
                    <span>
                      {PARTNER_SERVICE_ICONS[it.servicio as PartnerService]}{' '}
                      <strong>
                        {PARTNER_SERVICE_LABELS[it.servicio as PartnerService] || it.servicio}
                      </strong>{' '}
                      <span className="text-gray-500 ml-2">
                        ({['Principal', '2ª', '3ª', '4ª'][it.position - 1]} · {Math.round(it.discount * 100)}% dto.)
                      </span>
                    </span>
                    <span className="font-bold">{formatEuros(it.price)}/mes</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between pt-4 mt-2 border-t-2 border-gray-200">
                <span className="text-base font-bold uppercase tracking-widest text-gray-700">
                  Total mensual
                </span>
                <span className="text-2xl font-bold text-accent">
                  {formatEuros(multiVertical.total)}/mes
                </span>
              </div>
              {founding && (
                <p className="text-xs text-gray-500 italic mt-3">
                  Con bonificación Founding aplicada · cuota base sin descuento adicional sobre
                  vertical principal: {formatEuros(monthlyEffective)}/mes
                </p>
              )}
            </div>
          )}

          {/* Notas opcionales para el closer */}
          <div className="mb-6">
            <label className="block">
              <span className="block text-xs uppercase tracking-widest font-bold text-gray-700 mb-2">
                Notas para el closer (opcional)
              </span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                maxLength={2000}
                placeholder="Cualquier matiz que quieras señalar antes de la firma: necesidades especiales, dudas concretas, fechas..."
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-base bg-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors resize-y"
              />
            </label>
          </div>

          {/* CTA */}
          <div className="bg-black text-white p-6 md:p-8 rounded-md text-center">
            <h3 className="text-xl md:text-2xl font-bold mb-3 text-accent">
              ¿Listo para solicitar contrato Founding?
            </h3>
            <p className="text-gray-300 text-sm md:text-base mb-6 max-w-2xl mx-auto leading-relaxed">
              Al pulsar el botón guardamos tu selección (plan, verticales, condiciones Founding) en
              tu ficha. El equipo H4S preparará el pack legal con tus datos auto-rellenados y te lo
              enviará para firma manual en menos de 48 horas hábiles.
            </p>

            {contractError && (
              <p className="text-sm text-red-300 mb-4" role="alert">
                {contractError}
              </p>
            )}

            <button
              type="button"
              onClick={handleRequestContract}
              disabled={
                contractStatus === 'sending' ||
                contractStatus === 'done' ||
                verticales.length === 0
              }
              className="inline-block bg-accent text-black font-bold px-8 py-4 rounded-md hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {contractStatus === 'sending' && 'Enviando solicitud…'}
              {contractStatus === 'idle' && 'Solicitar contrato Founding'}
              {contractStatus === 'error' && 'Reintentar solicitud'}
              {contractStatus === 'done' && 'Solicitud enviada ✓'}
            </button>

            {data.contract_requested_at && (
              <p className="mt-4 text-xs text-gray-400 italic">
                Ya enviaste una solicitud el{' '}
                {new Date(data.contract_requested_at).toLocaleString('es-ES')}. Si necesitas
                modificar la selección, vuelve a pulsar el botón con tus nuevos datos.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

// =====================================================
// Subcomponentes UI
// =====================================================

function RangeField({
  label,
  value,
  min,
  max,
  step,
  display,
  help,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  help?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-xs uppercase tracking-widest font-bold text-gray-700">{label}</span>
        <span className="text-base font-bold text-accent tabular-nums">{display}</span>
      </div>
      {help && <p className="text-xs text-gray-500 italic mb-2">{help}</p>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-accent"
      />
    </div>
  );
}

function KpiCard({
  bg,
  border,
  value,
  small,
  label,
}: {
  bg: string;
  border: string;
  value: string;
  small: string;
  label: string;
}) {
  return (
    <div
      className="rounded-md p-3 text-center"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      <div className="text-lg md:text-xl font-bold leading-tight">
        {value}
        <span className="block text-[10px] text-white/60 font-normal">{small}</span>
      </div>
      <div className="text-[10px] uppercase tracking-widest text-white/70 mt-1 font-bold">
        {label}
      </div>
    </div>
  );
}

function Row({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between py-2 ${
        highlight ? 'border-t border-white/20 mt-2 pt-3' : 'border-b border-dashed border-white/10'
      }`}
    >
      <dt className="text-white/85 text-xs md:text-sm">{k}</dt>
      <dd
        className={`tabular-nums font-bold ${highlight ? 'text-accent text-base' : 'text-white text-sm'}`}
      >
        {v}
      </dd>
    </div>
  );
}
