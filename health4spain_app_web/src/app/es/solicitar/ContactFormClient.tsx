'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PAISES_CON_CODIGO, CODIGOS_PARA_OTRO, PAISES } from '@/lib/constants';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/routes';

interface FormData {
  servicio: string;
  ciudad_interes: string;
  nombre: string;
  email: string;
  codigo_pais: string;
  telefono: string;
  pais_origen: string;
  ciudad_origen: string;
  fecha_nacimiento: string;
  presupuesto: string;
  urgencia: string;
  mensaje: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  landing_page: string;
}

type RequestDict = ReturnType<typeof getDictionary>['request'];

interface StepProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: string) => void;
  errors: Partial<Record<keyof FormData, string>>;
  ciudades?: { id: string; label: string }[];
  onAutoAdvance?: () => void;
  t: RequestDict;
}

const SERVICIO_IDS = ['seguros', 'abogados', 'inmobiliarias', 'gestorias'] as const;
const SERVICIO_ICONS: Record<string, string> = { seguros: '🏥', abogados: '⚖️', inmobiliarias: '🏠', gestorias: '📋' };
const SERVICIO_DESCRIPTIONS: Record<string, Record<string, string>> = {
  es: { seguros: 'Cobertura médica privada', abogados: 'Extranjería, visados, arraigo', inmobiliarias: 'Compraventa y alquiler', gestorias: 'Trámites y documentación' },
  en: { seguros: 'Private health coverage', abogados: 'Immigration, visas, residency', inmobiliarias: 'Buying and renting', gestorias: 'Paperwork and documentation' },
  fr: { seguros: 'Couverture médicale privée', abogados: 'Immigration, visas, résidence', inmobiliarias: 'Achat et location', gestorias: 'Formalités et documentation' },
  de: { seguros: 'Private Krankenversicherung', abogados: 'Einwanderung, Visa, Aufenthalt', inmobiliarias: 'Kauf und Miete', gestorias: 'Formalitäten und Dokumentation' },
  pt: { seguros: 'Cobertura médica privada', abogados: 'Imigração, vistos, residência', inmobiliarias: 'Compra e aluguer', gestorias: 'Trâmites e documentação' },
};

const PRESUPUESTO_SCORES: Record<string, number> = {
  'menos-5000': 10, '5000-15000': 20, '15000-30000': 35, 'mas-30000': 50, 'no-seguro': 15,
};

const URGENCIA_SCORES: Record<string, number> = {
  'esta-semana': 30, 'este-mes': 20, 'proximo-trimestre': 10, 'solo-informacion': 5,
};

function Step1({ formData, updateFormData, errors, onAutoAdvance, t, locale }: StepProps & { locale?: Locale }) {
  const handleServicioClick = (servicioId: string) => {
    updateFormData('servicio', servicioId);
    if (onAutoAdvance) {
      setTimeout(() => { onAutoAdvance(); }, 300);
    }
  };

  const descs = SERVICIO_DESCRIPTIONS[locale || 'es'] || SERVICIO_DESCRIPTIONS['es'];

  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-extrabold mb-1 text-[#111827]">{t.step1Title}</h2>
        <p className="text-sm md:text-base text-[#6b7280]">{t.step1Subtitle}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {SERVICIO_IDS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => handleServicioClick(id)}
            className={`p-4 md:p-5 border-2 rounded-xl text-center transition-all duration-200 cursor-pointer ${
              formData.servicio === id
                ? 'border-[#1a56db] bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] shadow-[0_4px_12px_rgba(26,86,219,0.15)]'
                : 'border-gray-200 bg-white hover:border-[#1a56db] hover:bg-[#eff6ff]'
            }`}
          >
            <div className="text-3xl md:text-4xl mb-2">{SERVICIO_ICONS[id]}</div>
            <div className="font-bold text-sm md:text-base text-[#111827]">{t.servicios[id]}</div>
            <div className="text-[0.72rem] md:text-xs text-[#6b7280] mt-1 leading-tight">{descs[id] || ''}</div>
          </button>
        ))}
      </div>
      {errors.servicio && <p className="text-accent text-center mt-1 text-sm">{errors.servicio}</p>}
    </div>
  );
}

function Step2({ formData, updateFormData, errors, ciudades = [], onAutoAdvance, t }: StepProps) {
  const handleCiudadClick = (ciudadId: string) => {
    updateFormData('ciudad_interes', ciudadId);
    if (onAutoAdvance) {
      setTimeout(() => { onAutoAdvance(); }, 300);
    }
  };

  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-extrabold mb-1 text-[#111827]">{t.step2Title}</h2>
        <p className="text-sm md:text-base text-[#6b7280]">{t.step2Subtitle}</p>
      </div>
      <div className="flex flex-wrap gap-2 max-h-[50vh] overflow-y-auto pr-2">
        {ciudades.map((ciudad) => (
          <button
            key={ciudad.id}
            type="button"
            onClick={() => handleCiudadClick(ciudad.id)}
            className={`px-3.5 py-2 border-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              formData.ciudad_interes === ciudad.id
                ? 'border-[#1a56db] bg-[#1a56db] text-white'
                : 'border-gray-200 bg-white text-[#374151] hover:border-[#1a56db] hover:text-[#1a56db]'
            }`}
          >
            <span>📍</span>
            <span>{ciudad.label}</span>
          </button>
        ))}
      </div>
      {errors.ciudad_interes && <p className="text-accent text-center mt-1 text-sm">{errors.ciudad_interes}</p>}
    </div>
  );
}

function Step3({ formData, updateFormData, errors, t }: StepProps) {
  const handlePaisChange = (pais: string) => {
    updateFormData('pais_origen', pais);
    if (pais && pais !== 'Otro') {
      const found = PAISES_CON_CODIGO.find(p => p.pais === pais);
      if (found) updateFormData('codigo_pais', found.codigo);
    } else if (pais === 'Otro') {
      updateFormData('codigo_pais', '');
    }
  };

  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-extrabold mb-1 text-[#111827]">{t.step3Title}</h2>
        <p className="text-sm md:text-base text-[#6b7280]">{t.step3Subtitle}</p>
      </div>
      <div className="space-y-3">
        <div>
          <label className="form-label-minimal">{t.labelNombre}</label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => updateFormData('nombre', e.target.value)}
            className={`form-input-minimal ${errors.nombre ? 'border-accent' : ''}`}
            placeholder={t.placeholderNombre}
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
              className={`form-input-minimal ${errors.email ? 'border-accent' : ''}`}
              placeholder={t.placeholderEmail}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="form-label-minimal">{t.labelPaisOrigen}</label>
            <select
              value={formData.pais_origen}
              onChange={(e) => handlePaisChange(e.target.value)}
              className={`form-input-minimal ${errors.pais_origen ? 'border-accent' : ''}`}
            >
              <option value="">{t.placeholderPais}</option>
              {PAISES.map((pais) => (
                <option key={pais} value={pais}>{pais}</option>
              ))}
            </select>
            {errors.pais_origen && <p className="text-accent text-sm mt-1">{errors.pais_origen}</p>}
          </div>
          <div>
            <label className="form-label-minimal">{t.labelCiudadOrigen}</label>
            <input
              type="text"
              value={formData.ciudad_origen}
              onChange={(e) => updateFormData('ciudad_origen', e.target.value)}
              className="form-input-minimal"
              placeholder={t.placeholderCiudadOrigen}
            />
          </div>
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
              className={`form-input-minimal ${errors.telefono ? 'border-accent' : ''}`}
              placeholder={t.placeholderTelefono}
            />
            {errors.telefono && <p className="text-accent text-sm mt-1">{errors.telefono}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Step4({ formData, updateFormData, errors, t }: StepProps) {
  const presupuestoIds = Object.keys(t.presupuestos) as Array<keyof typeof t.presupuestos>;
  const urgenciaIds = Object.keys(t.urgencias) as Array<keyof typeof t.urgencias>;

  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-extrabold mb-1 text-[#111827]">{t.step4Title}</h2>
        <p className="text-sm md:text-base text-[#6b7280]">{t.step4Subtitle}</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#1a56db] uppercase tracking-wider mb-2">{t.labelPresupuesto}</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {presupuestoIds.map((id) => (
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
                <span className={`text-xs md:text-sm block ${formData.presupuesto === id ? 'font-bold text-[#111827]' : 'font-semibold text-[#374151]'}`}>{t.presupuestos[id]}</span>
              </button>
            ))}
          </div>
          {errors.presupuesto && <p className="text-accent text-xs mt-1">{errors.presupuesto}</p>}
        </div>
        <div>
          <label className="block text-xs font-bold text-[#1a56db] uppercase tracking-wider mb-2">{t.labelUrgencia}</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {urgenciaIds.map((id) => (
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
                <span className={`text-xs md:text-sm block ${formData.urgencia === id ? 'font-bold text-[#111827]' : 'font-semibold text-[#374151]'}`}>{t.urgencias[id]}</span>
              </button>
            ))}
          </div>
          {errors.urgencia && <p className="text-accent text-xs mt-1">{errors.urgencia}</p>}
        </div>
        <div>
          <label className="form-label-minimal">
            {t.labelMensaje} <span className="text-gray-400">{t.labelMensajeOpcional}</span>
          </label>
          <textarea
            value={formData.mensaje}
            onChange={(e) => updateFormData('mensaje', e.target.value)}
            className="form-input-minimal min-h-[80px] mt-1.5"
            placeholder={t.placeholderMensaje}
          />
        </div>
      </div>
    </div>
  );
}

interface ContactFormClientProps {
  ciudades: { id: string; label: string }[];
  locale?: Locale;
}

export default function ContactFormClient({ ciudades, locale = 'es' }: ContactFormClientProps) {
  const t = getDictionary(locale).request;
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  
  // Determinar el flujo: si viene con servicio preseleccionado, primero pedimos ciudad
  const [flowType, setFlowType] = useState<'default' | 'from-service' | 'from-city'>('default');

  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    codigo_pais: '',
    telefono: '',
    pais_origen: '',
    ciudad_origen: '',
    fecha_nacimiento: '',
    servicio: '',
    ciudad_interes: '',
    presupuesto: '',
    urgencia: '',
    mensaje: '',
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    landing_page: '',
  });

  useEffect(() => {
    let servicio = searchParams.get('servicio') || '';
    let ciudad = searchParams.get('ciudad') || '';
    const utm_source = searchParams.get('utm_source') || '';
    const utm_medium = searchParams.get('utm_medium') || '';
    const utm_campaign = searchParams.get('utm_campaign') || '';

    // Si servicio viene como "abogados-elche" (slug combinado), extraer servicio y ciudad
    const SERVICIOS_IDS = ['seguros', 'abogados', 'inmobiliarias', 'gestorias'];
    if (servicio && servicio.includes('-') && !ciudad) {
      const parts = servicio.split('-');
      const posibleServicio = parts[0];
      if (SERVICIOS_IDS.includes(posibleServicio)) {
        servicio = posibleServicio;
        ciudad = parts.slice(1).join('-'); // "elche" o "las-palmas" etc
      }
    }

    setFormData((prev) => ({
      ...prev,
      servicio: servicio || prev.servicio,
      ciudad_interes: ciudad || prev.ciudad_interes,
      utm_source,
      utm_medium,
      utm_campaign,
      landing_page: typeof window !== 'undefined' ? window.location.href : '',
    }));

    // Determinar el tipo de flujo
    if (servicio && ciudad) {
      // Ambos preseleccionados: saltar a paso 3 (datos personales)
      setCurrentStep(3);
      setFlowType('default');
    } else if (servicio) {
      // Viene desde página de servicio: primero elegir ciudad
      setFlowType('from-service');
      setCurrentStep(1);
    } else if (ciudad) {
      // Viene desde página de ciudad: primero elegir servicio
      setFlowType('from-city');
      setCurrentStep(1);
    } else {
      // Sin preselección: flujo normal (servicio → ciudad → datos)
      setFlowType('default');
      setCurrentStep(1);
    }
  }, [searchParams]);

  useEffect(() => {
    document.body.classList.add('form-active');
    return () => document.body.classList.remove('form-active');
  }, []);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validatePersonalData = (newErrors: Partial<Record<keyof FormData, string>>) => {
    if (!formData.nombre.trim()) newErrors.nombre = t.errorNombre;
    if (!formData.email.trim()) newErrors.email = t.errorEmail;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t.errorEmailInvalido;
    if (!formData.fecha_nacimiento) newErrors.fecha_nacimiento = t.errorFechaNacimiento;
    if (!formData.codigo_pais) newErrors.codigo_pais = t.errorCodigoPais;
    if (!formData.telefono.trim()) newErrors.telefono = t.errorTelefono;
    if (!formData.pais_origen) newErrors.pais_origen = t.errorPais;
  };

  const validateBudget = (newErrors: Partial<Record<keyof FormData, string>>) => {
    if (!formData.presupuesto) newErrors.presupuesto = t.errorPresupuesto;
    if (!formData.urgencia) newErrors.urgencia = t.errorUrgencia;
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (flowType === 'from-service') {
      if (step === 1 && !formData.ciudad_interes) newErrors.ciudad_interes = t.errorCiudad;
      if (step === 2) validatePersonalData(newErrors);
      if (step === 3) validateBudget(newErrors);
    } else if (flowType === 'from-city') {
      if (step === 1 && !formData.servicio) newErrors.servicio = t.errorServicio;
      if (step === 2) validatePersonalData(newErrors);
      if (step === 3) validateBudget(newErrors);
    } else {
      if (step === 1 && !formData.servicio) newErrors.servicio = t.errorServicio;
      if (step === 2 && !formData.ciudad_interes) newErrors.ciudad_interes = t.errorCiudad;
      if (step === 3) validatePersonalData(newErrors);
      if (step === 4) validateBudget(newErrors);
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    const maxSteps = flowType === 'default' ? 4 : 3;
    if (validateStep(currentStep)) setCurrentStep((prev) => Math.min(prev + 1, maxSteps));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const calculateScore = (): number => {
    let score = 50;
    score += PRESUPUESTO_SCORES[formData.presupuesto] ?? 0;
    score += URGENCIA_SCORES[formData.urgencia] ?? 0;
    if (['seguros', 'abogados', 'inmobiliarias'].includes(formData.servicio)) score += 10;
    if (formData.ciudad_interes && formData.ciudad_interes !== 'otra') score += 5;
    if (formData.mensaje && formData.mensaje.length > 50) score += 5;
    return Math.min(100, score);
  };

  const handleSubmit = async () => {
    const lastStep = flowType === 'default' ? 4 : 3;
    if (!validateStep(lastStep)) return;
    setIsSubmitting(true);
    try {
      const score = calculateScore();
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          codigo_pais: formData.codigo_pais,
          telefono: formData.telefono,
          pais_origen: formData.pais_origen,
          ciudad_origen: formData.ciudad_origen,
          fecha_nacimiento: formData.fecha_nacimiento || undefined,
          servicio: formData.servicio,
          ciudad: formData.ciudad_interes,
          presupuesto: formData.presupuesto,
          urgencia: formData.urgencia,
          mensaje: formData.mensaje,
          landing_page: formData.landing_page,
          utm_source: formData.utm_source,
          utm_medium: formData.utm_medium,
          utm_campaign: formData.utm_campaign,
          score,
          idioma_preferido: locale,
        }),
      });
      if (response.ok) setIsSuccess(true);
      else {
        const data = await response.json();
        alert(data.error || t.errorEnvio);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(t.errorConexion);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="py-4 md:py-10 bg-gray-50">
        <div className="container-narrow text-center w-full">
          <div className="max-w-xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 text-accent mb-8">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.successTitle}</h1>
            <p className="text-xl text-gray-600 mb-10 max-w-lg mx-auto">
              {t.successMessage}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-10 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1"><svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> {t.successRespuesta}</span>
              <span className="inline-flex items-center gap-1"><svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> {t.successDatos}</span>
            </div>
            <Link href={`/${locale}`} className="btn-minimal-lg">
              {t.volverInicio}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalSteps = flowType === 'default' ? 4 : 3;
  
  // Función para auto-avanzar al siguiente paso
  const autoAdvanceToNextStep = () => {
    const maxSteps = totalSteps;
    if (currentStep < maxSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };
  
  // Función para renderizar el paso correcto según el flujo
  const renderStep = () => {
    const common = { formData, updateFormData, errors, t };
    if (flowType === 'from-service') {
      switch (currentStep) {
        case 1: return <Step2 {...common} ciudades={ciudades} onAutoAdvance={autoAdvanceToNextStep} />;
        case 2: return <Step3 {...common} />;
        case 3: return <Step4 {...common} />;
        default: return null;
      }
    } else if (flowType === 'from-city') {
      switch (currentStep) {
        case 1: return <Step1 {...common} locale={locale} onAutoAdvance={autoAdvanceToNextStep} />;
        case 2: return <Step3 {...common} />;
        case 3: return <Step4 {...common} />;
        default: return null;
      }
    } else {
      switch (currentStep) {
        case 1: return <Step1 {...common} locale={locale} onAutoAdvance={autoAdvanceToNextStep} />;
        case 2: return <Step2 {...common} ciudades={ciudades} onAutoAdvance={autoAdvanceToNextStep} />;
        case 3: return <Step3 {...common} />;
        case 4: return <Step4 {...common} />;
        default: return null;
      }
    }
  };

  return (
    <div className="py-4 md:py-10">
      <div className="container-narrow">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#1a56db]">
              {(() => {
                if (flowType === 'from-service' && currentStep === 1) {
                  return `${t.eligeCiudadPaso} ${currentStep} / ${totalSteps}`;
                } else if (flowType === 'from-city' && currentStep === 1) {
                  return `${t.eligeServicioPaso} ${currentStep} / ${totalSteps}`;
                } else {
                  return `${t.paso} ${currentStep} / ${totalSteps}`;
                }
              })()}
            </span>
            <div className="flex gap-1.5">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-8 h-1.5 rounded-full transition-all duration-300 ${
                    i < currentStep ? 'bg-[#1a56db]' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1a56db] transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 md:p-6 rounded-xl">
          {/* Banner de información preseleccionada - ahora EDITABLE */}
          {(formData.servicio || formData.ciudad_interes) && currentStep > 1 && (
            <div className="mb-4 p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800 font-medium mb-2">{t.buscas}</p>
              <div className="flex flex-wrap gap-2">
                {formData.servicio && (
                  <button
                    type="button"
                    onClick={() => {
                      // Ir al paso de selección de servicio
                      if (flowType === 'from-city' || flowType === 'default') {
                        setCurrentStep(1);
                      } else if (flowType === 'from-service') {
                        // Cambiar el flujo a default y volver al paso 1 (servicio)
                        setFlowType('default');
                        setCurrentStep(1);
                      }
                    }}
                    className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-full text-xs border border-blue-300 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                  >
                    <span className="text-blue-600">✓</span>
                    <span className="font-medium">
                      {t.servicios[formData.servicio as keyof typeof t.servicios] ?? formData.servicio}
                    </span>
                    <span className="text-xs text-gray-400 group-hover:text-blue-600">✏️</span>
                  </button>
                )}
                {formData.ciudad_interes && (
                  <button
                    type="button"
                    onClick={() => {
                      // Ir al paso de selección de ciudad
                      if (flowType === 'from-service' || flowType === 'default') {
                        const ciudadStep = flowType === 'from-service' ? 1 : 2;
                        setCurrentStep(ciudadStep);
                      } else if (flowType === 'from-city') {
                        // Cambiar el flujo a default y volver al paso 2 (ciudad)
                        setFlowType('default');
                        setCurrentStep(2);
                      }
                    }}
                    className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-full text-xs border border-[#293f92]/30 hover:border-[#293f92] hover:bg-accent/5 transition-all group"
                  >
                    <svg className="w-4 h-4 text-[#293f92] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span className="font-medium">
                      {ciudades.find(c => c.id === formData.ciudad_interes)?.label}
                    </span>
                    <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#293f92] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">{t.hazClicCambiar} <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></p>
            </div>
          )}
          
          {renderStep()}

          <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`btn-ghost-minimal ${currentStep === 1 ? 'invisible' : ''}`}
            >
              {t.anterior}
            </button>
            {currentStep < totalSteps ? (
              <button type="button" onClick={nextStep} className="btn-minimal">
                {t.siguiente}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-minimal"
              >
                {isSubmitting ? t.enviando : t.enviarSolicitud}
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-600 flex items-center justify-center gap-1"><svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> {t.datosProtegidos}</p>
        </div>
      </div>
    </div>
  );
}
