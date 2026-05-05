'use client';

import { useState, useMemo } from 'react';
import { CITIES, LANGUAGES } from '@/lib/constants';
import type { PartnerCarteraPct, PartnerService } from '@/lib/types';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

const SERVICE_OPTIONS: { value: PartnerService; label: string }[] = [
  { value: 'abogados', label: 'Abogado de extranjería' },
  { value: 'gestorias', label: 'Gestoría / Asesoría fiscal' },
  { value: 'inmobiliarias', label: 'Inmobiliaria' },
  { value: 'seguros', label: 'Mediador / Agente de seguros' },
];

const CARTERA_OPTIONS: { value: PartnerCarteraPct; label: string }[] = [
  { value: 'menos_10', label: 'Menos del 10%' },
  { value: '10_30', label: 'Entre 10% y 30%' },
  { value: '30_60', label: 'Entre 30% y 60%' },
  { value: 'mas_60', label: 'Más del 60%' },
];

interface FormState {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  servicio: PartnerService | '';
  ciudad_principal: string;
  anos_ejerciendo: string;
  pct_cartera_extranjera: PartnerCarteraPct | '';
  idiomas: string[];
  about: string;
  privacy_accepted: boolean;
}

const INITIAL_STATE: FormState = {
  nombre: '',
  empresa: '',
  email: '',
  telefono: '',
  servicio: '',
  ciudad_principal: '',
  anos_ejerciendo: '',
  pct_cartera_extranjera: '',
  idiomas: ['es'],
  about: '',
  privacy_accepted: false,
};

export default function PartnersFormClient() {
  const [state, setState] = useState<FormState>(INITIAL_STATE);
  const [status, setStatus] = useState<SubmitState>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const ciudadesOpciones = useMemo(
    () => [...CITIES.map((c) => ({ value: c.slug, label: `${c.name} (${c.province})` }))],
    []
  );

  const handleChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setState((s) => ({ ...s, [key]: value }));
  };

  const toggleIdioma = (code: string) => {
    setState((s) => ({
      ...s,
      idiomas: s.idiomas.includes(code) ? s.idiomas.filter((c) => c !== code) : [...s.idiomas, code],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;
    setStatus('submitting');
    setErrorMsg(null);

    try {
      const payload = {
        nombre: state.nombre.trim(),
        empresa: state.empresa.trim(),
        email: state.email.trim(),
        telefono: state.telefono.trim(),
        servicio: state.servicio,
        ciudad_principal: state.ciudad_principal,
        anos_ejerciendo: state.anos_ejerciendo
          ? parseInt(state.anos_ejerciendo, 10)
          : undefined,
        pct_cartera_extranjera: state.pct_cartera_extranjera || undefined,
        idiomas: state.idiomas,
        about: state.about.trim() || undefined,
        privacy_accepted: state.privacy_accepted,
        landing_page: typeof window !== 'undefined' ? window.location.pathname : '/es/partners',
      };

      const res = await fetch('/api/partners/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || 'No se pudo enviar la solicitud.');
      }

      setStatus('success');
      // Redirect to honest confirmation page.
      setTimeout(() => {
        window.location.href = '/es/partners/gracias';
      }, 600);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Error desconocido.');
    }
  };

  const isSubmitting = status === 'submitting';
  const isSuccess = status === 'success';

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Nombre y apellidos" required>
          <input
            type="text"
            required
            value={state.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            placeholder="Juan García López"
            className={inputCls}
            autoComplete="name"
          />
        </Field>

        <Field label="Empresa o despacho" required>
          <input
            type="text"
            required
            value={state.empresa}
            onChange={(e) => handleChange('empresa', e.target.value)}
            placeholder="Bufete García S.L."
            className={inputCls}
            autoComplete="organization"
          />
        </Field>

        <Field label="Email profesional" required>
          <input
            type="email"
            required
            value={state.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="juan@bufetegarcia.es"
            className={inputCls}
            autoComplete="email"
          />
        </Field>

        <Field label="WhatsApp / Teléfono" required>
          <input
            type="tel"
            required
            value={state.telefono}
            onChange={(e) => handleChange('telefono', e.target.value)}
            placeholder="+34 666 123 456"
            className={inputCls}
            autoComplete="tel"
          />
        </Field>

        <Field label="Servicio que ofreces" required>
          <select
            required
            value={state.servicio}
            onChange={(e) => handleChange('servicio', e.target.value as PartnerService)}
            className={inputCls}
          >
            <option value="">— Selecciona —</option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Ciudad principal de operación" required>
          <select
            required
            value={state.ciudad_principal}
            onChange={(e) => handleChange('ciudad_principal', e.target.value)}
            className={inputCls}
          >
            <option value="">— Selecciona —</option>
            {ciudadesOpciones.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Años ejerciendo en esa ciudad">
          <input
            type="number"
            min={0}
            max={80}
            value={state.anos_ejerciendo}
            onChange={(e) => handleChange('anos_ejerciendo', e.target.value)}
            placeholder="8"
            className={inputCls}
          />
        </Field>

        <Field label="% cartera actual extranjera">
          <select
            value={state.pct_cartera_extranjera}
            onChange={(e) =>
              handleChange('pct_cartera_extranjera', e.target.value as PartnerCarteraPct | '')
            }
            className={inputCls}
          >
            <option value="">— Selecciona —</option>
            {CARTERA_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Idiomas que atiendes en consulta">
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => {
            const active = state.idiomas.includes(lang.code);
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => toggleIdioma(lang.code)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                  active
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
                }`}
                aria-pressed={active}
              >
                {lang.flag} {lang.name}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Cuéntanos brevemente sobre tu despacho">
        <textarea
          value={state.about}
          onChange={(e) => handleChange('about', e.target.value)}
          rows={4}
          placeholder="Años de experiencia, especialización, equipo, qué esperas resolver con H4S..."
          className={`${inputCls} resize-y min-h-[110px]`}
          maxLength={2000}
        />
      </Field>

      <label className="flex items-start gap-3 text-sm text-gray-600">
        <input
          type="checkbox"
          required
          checked={state.privacy_accepted}
          onChange={(e) => handleChange('privacy_accepted', e.target.checked)}
          className="mt-1 w-4 h-4 accent-black"
        />
        <span>
          Acepto la <a href="/es/privacidad" className="underline hover:text-black" target="_blank" rel="noopener">política de privacidad</a> y autorizo a Health4Spain a contactarme por email
          y WhatsApp para los pasos siguientes del proceso de selección.
        </span>
      </label>

      {errorMsg && (
        <div role="alert" className="border border-red-300 bg-red-50 text-red-800 text-sm rounded-md p-4">
          {errorMsg}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={isSubmitting || isSuccess}
          className="btn-minimal-lg disabled:opacity-50 disabled:cursor-not-allowed self-start"
        >
          {isSubmitting && 'Enviando…'}
          {!isSubmitting && !isSuccess && 'Solicitar acceso'}
          {isSuccess && 'Solicitud enviada ✓'}
        </button>
        <p className="text-sm text-gray-500 italic">
          Te llamamos en menos de 24 horas hábiles para validar encaje. Si todo encaja, te abrimos
          acceso al panel privado con tarifas detalladas para tu zona y calculadora ROI con tus números.
        </p>
      </div>
    </form>
  );
}

const inputCls =
  'w-full px-4 py-3 border border-gray-300 rounded-md text-base bg-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors';

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}
