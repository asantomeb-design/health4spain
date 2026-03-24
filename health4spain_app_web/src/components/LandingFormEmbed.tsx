'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PAISES_CON_CODIGO, CODIGOS_PARA_OTRO, PAISES } from '@/lib/constants';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';

interface LandingFormEmbedProps {
  servicioSlug: string;
  ciudadSlug: string;
  servicioNombre: string;
  ciudadNombre: string;
  locale?: Locale;
}

interface FormData {
  nombre: string;
  email: string;
  codigo_pais: string;
  telefono: string;
  pais_origen: string;
  fecha_nacimiento: string;
  presupuesto: string;
  urgencia: string;
  mensaje: string;
}

const PRESUPUESTO_IDS = ['menos-5000', '5000-15000', '15000-30000', 'mas-30000', 'no-seguro'];
const URGENCIA_IDS = ['esta-semana', 'este-mes', 'proximo-trimestre', 'solo-informacion'];

export default function LandingFormEmbed({ 
  servicioSlug, 
  ciudadSlug,
  servicioNombre,
  ciudadNombre,
  locale = 'es'
}: LandingFormEmbedProps) {
  const router = useRouter();
  const t = getDictionary(locale).request;
  const tLanding = getDictionary(locale).landingUI;
  const [currentStep, setCurrentStep] = useState(1); // Paso 1: datos personales, Paso 2: presupuesto/urgencia
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    codigo_pais: '',
    telefono: '',
    pais_origen: '',
    fecha_nacimiento: '',
    presupuesto: '',
    urgencia: '',
    mensaje: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (step === 1) {
      if (!formData.nombre.trim()) newErrors.nombre = t.errorNombre;
      if (!formData.email.trim()) newErrors.email = t.errorEmail;
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = t.errorEmailInvalido;
      }
      if (!formData.fecha_nacimiento) newErrors.fecha_nacimiento = t.errorFechaNacimiento;
      if (!formData.codigo_pais) newErrors.codigo_pais = t.errorCodigoPais;
      if (!formData.telefono.trim()) newErrors.telefono = t.errorTelefono;
      if (!formData.pais_origen) newErrors.pais_origen = t.errorPais;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const payload = {
        servicio: servicioSlug,
        ciudad: ciudadSlug,
        ...formData,
        landing_page: typeof window !== 'undefined' ? window.location.href : '',
        utm_source: '',
        utm_medium: '',
        utm_campaign: '',
      };

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Redirigir a página de gracias después de un breve delay
        setTimeout(() => {
          const requestPath = locale === 'es' ? 'solicitar' : locale === 'en' ? 'request' : locale === 'fr' ? 'demande' : locale === 'de' ? 'anfrage' : 'solicitar';
          router.push(`/${locale}/${requestPath}?success=true`);
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="bg-white border-t-3 border-accent p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-50 rounded-full mb-4">
          <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold mb-2">{tLanding.formSuccessTitle}</h3>
        <p className="text-gray-600">{tLanding.formSuccessMsg}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border-t-3 border-accent p-6 md:p-8">
      {/* Header con contexto */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl md:text-2xl font-bold">{tLanding.sidebarTitle}</h3>
          <a 
            href={`/${locale}/${locale === 'es' ? 'solicitar' : locale === 'en' ? 'request' : locale === 'fr' ? 'demande' : locale === 'de' ? 'anfrage' : 'solicitar'}?servicio=${servicioSlug}&ciudad=${ciudadSlug}`}
            className="text-xs text-gray-500 hover:text-accent transition-colors"
          >
            {tLanding.formChange}
          </a>
        </div>
        <div className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-md">
          <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium text-gray-700">
            {servicioNombre} {tLanding.in} {ciudadNombre}
          </span>
        </div>
      </div>

      <form onSubmit={currentStep === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNextStep(); }}>
        {/* Paso 1: Datos personales */}
        {currentStep === 1 && (
          <div className="space-y-3">
            <div>
              <label className="form-label-minimal">{t.labelNombre}</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => updateFormData('nombre', e.target.value)}
                placeholder={t.placeholderNombre}
                className={`form-input-minimal ${errors.nombre ? 'border-accent' : ''}`}
              />
              {errors.nombre && <p className="text-accent text-sm mt-1">{errors.nombre}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="form-label-minimal">{t.labelEmail}</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder={t.placeholderEmail}
                  className={`form-input-minimal ${errors.email ? 'border-accent' : ''}`}
                />
                {errors.email && <p className="text-accent text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="form-label-minimal">{t.labelFechaNacimiento}</label>
                <input
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={(e) => updateFormData('fecha_nacimiento', e.target.value)}
                  className={`form-input-minimal ${errors.fecha_nacimiento ? 'border-accent' : ''}`}
                />
                {errors.fecha_nacimiento && <p className="text-accent text-sm mt-1">{errors.fecha_nacimiento}</p>}
              </div>
            </div>

            <div>
              <label className="form-label-minimal">{t.labelPaisOrigen}</label>
              <select
                value={formData.pais_origen}
                onChange={(e) => {
                  const pais = e.target.value;
                  updateFormData('pais_origen', pais);
                  if (pais && pais !== 'Otro') {
                    const found = PAISES_CON_CODIGO.find(p => p.pais === pais);
                    if (found) updateFormData('codigo_pais', found.codigo);
                  } else if (pais === 'Otro') {
                    updateFormData('codigo_pais', '');
                  }
                }}
                className={`form-input-minimal ${errors.pais_origen ? 'border-accent' : ''}`}
              >
                <option value="">{t.placeholderPais}</option>
                {PAISES.map((pais) => (
                  <option key={pais} value={pais}>
                    {pais}
                  </option>
                ))}
              </select>
              {errors.pais_origen && <p className="text-accent text-sm mt-1">{errors.pais_origen}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-3">
              <div className="min-w-[120px]">
                <label className="form-label-minimal">{t.labelCodigoPais}</label>
                {formData.pais_origen && formData.pais_origen !== 'Otro' ? (
                  <div className="form-input-minimal bg-gray-50 text-gray-700">
                    {PAISES_CON_CODIGO.find(p => p.pais === formData.pais_origen)?.codigo || formData.codigo_pais}
                  </div>
                ) : (
                  <select
                    value={formData.codigo_pais}
                    onChange={(e) => updateFormData('codigo_pais', e.target.value)}
                    className={`form-input-minimal ${errors.codigo_pais ? 'border-accent' : ''}`}
                  >
                    <option value="">{t.placeholderCodigo}</option>
                    {CODIGOS_PARA_OTRO.map(({ codigo, pais }) => (
                      <option key={codigo} value={codigo}>{codigo} {pais}</option>
                    ))}
                  </select>
                )}
                {errors.codigo_pais && <p className="text-accent text-sm mt-1">{errors.codigo_pais}</p>}
              </div>
              <div>
                <label className="form-label-minimal">{t.labelTelefono}</label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => updateFormData('telefono', e.target.value.replace(/\D/g, ''))}
                  placeholder={t.placeholderTelefono}
                  className={`form-input-minimal ${errors.telefono ? 'border-accent' : ''}`}
                />
                {errors.telefono && <p className="text-accent text-sm mt-1">{errors.telefono}</p>}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 bg-[#293f92] text-white font-bold hover:bg-[#1e2d6b] transition-colors rounded-sm"
            >
              {tLanding.formContinue}
            </button>
          </div>
        )}

        {/* Paso 2: Presupuesto y urgencia */}
        {currentStep === 2 && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-sm text-gray-600 hover:text-accent mb-2 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {tLanding.formBack}
            </button>

            <div>
              <label className="block text-xs font-bold text-[#1a56db] uppercase tracking-wider mb-2">{t.labelPresupuesto}</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {PRESUPUESTO_IDS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => updateFormData('presupuesto', id)}
                    className={`p-2.5 md:p-3 border-2 rounded-xl text-center transition-all duration-200 cursor-pointer ${
                      formData.presupuesto === id
                        ? 'border-[#1a56db] bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] shadow-[0_4px_12px_rgba(26,86,219,0.15)]'
                        : 'border-gray-200 bg-white hover:border-[#1a56db] hover:bg-[#eff6ff]'
                    }`}
                  >
                    <span className={`text-xs md:text-sm block ${formData.presupuesto === id ? 'font-bold text-[#111827]' : 'font-semibold text-[#374151]'}`}>{t.presupuestos[id as keyof typeof t.presupuestos]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1a56db] uppercase tracking-wider mb-2">{t.labelUrgencia}</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {URGENCIA_IDS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => updateFormData('urgencia', id)}
                    className={`p-2.5 md:p-3 border-2 rounded-xl text-center transition-all duration-200 cursor-pointer ${
                      formData.urgencia === id
                        ? 'border-[#1a56db] bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] shadow-[0_4px_12px_rgba(26,86,219,0.15)]'
                        : 'border-gray-200 bg-white hover:border-[#1a56db] hover:bg-[#eff6ff]'
                    }`}
                  >
                    <span className={`text-xs md:text-sm block ${formData.urgencia === id ? 'font-bold text-[#111827]' : 'font-semibold text-[#374151]'}`}>{t.urgencias[id as keyof typeof t.urgencias]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label-minimal">
                {t.labelMensaje} <span className="text-gray-400">{t.labelMensajeOpcional}</span>
              </label>
              <textarea
                value={formData.mensaje}
                onChange={(e) => updateFormData('mensaje', e.target.value)}
                placeholder={t.placeholderMensaje}
                className="form-input-minimal min-h-[80px] mt-1.5"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 bg-[#293f92] text-white font-bold hover:bg-[#1e2d6b] transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t.enviando : t.enviarSolicitud}
            </button>

            {submitStatus === 'error' && (
              <p className="text-accent text-sm text-center">
                {t.errorEnvio}
              </p>
            )}
          </div>
        )}

        {/* Trust badges */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap justify-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {tLanding.noCommitment}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {tLanding.response24h}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {tLanding.formDataProtected}
          </span>
        </div>
      </form>
    </div>
  );
}
