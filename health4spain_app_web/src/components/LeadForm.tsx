'use client';

import { useState, useEffect } from 'react';

interface LeadFormProps {
  servicio?: string;
  servicioSlug?: string;
  ciudad?: string;
  ciudadSlug?: string;
  idioma?: string;
  variant?: 'card' | 'inline' | 'modal';
  title?: string;
  subtitle?: string;
  showServiceField?: boolean;
  showCityField?: boolean;
  source?: string;
  campaign?: string;
}

const SERVICIOS = [
  { value: 'seguros', label: 'Seguro de Salud' },
  { value: 'abogados', label: 'Abogado' },
  { value: 'inmobiliarias', label: 'Agente Inmobiliario' },
  { value: 'gestorias', label: 'Gestoría' },
  { value: 'otro', label: 'Otro servicio' },
];

const URGENCIAS = [
  { value: 'esta_semana', label: 'Esta semana', hot: true },
  { value: 'este_mes', label: 'Este mes', hot: false },
  { value: 'sin_prisa', label: 'Sin prisa', hot: false },
];

const IDIOMAS = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
  { value: 'fr', label: 'Français' },
];

export default function LeadForm({
  servicio,
  servicioSlug,
  ciudad,
  ciudadSlug,
  idioma = 'es',
  variant = 'card',
  title,
  subtitle,
  showServiceField = true,
  showCityField = true,
  source,
  campaign,
}: LeadFormProps) {
  const [ciudades, setCiudades] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const fetchCiudades = async () => {
      try {
        const res = await fetch('/api/ciudades');
        if (res.ok) {
          const data = await res.json();
          setCiudades(data);
        }
      } catch (err) {
        console.error('Error fetching ciudades:', err);
      }
    };
    fetchCiudades();
  }, []);

  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    servicio: servicioSlug || '',
    ciudad: ciudadSlug || '',
    urgencia: '',
    idioma_preferido: idioma,
    mensaje: '',
    acepta_privacidad: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const leadData = {
      ...formData,
      landing_page: source || window.location.pathname,
      utm_source: new URLSearchParams(window.location.search).get('utm_source') || '',
      utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || '',
      utm_campaign: campaign || new URLSearchParams(window.location.search).get('utm_campaign') || '',
      dispositivo: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
      created_at: new Date().toISOString(),
    };

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });
      
      if (!response.ok) throw new Error('Error al enviar');
      
      setSubmitStatus('success');
      setFormData({
        nombre: '',
        telefono: '',
        email: '',
        servicio: servicioSlug || '',
        ciudad: ciudadSlug || '',
        urgencia: '',
        idioma_preferido: idioma,
        mensaje: '',
        acepta_privacidad: false,
      });
      setCurrentStep(1);
      
    } catch (error) {
      console.error('Error enviando lead:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultTitle = servicio ? `Solicita tu ${servicio}` : '¿Qué necesitas?';
  const defaultSubtitle = 'Te contactamos en menos de 24h';
  const displayTitle = title || defaultTitle;
  const displaySubtitle = subtitle || defaultSubtitle;

  const containerClasses = {
    card: 'bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl border-2 border-accent p-4 sm:p-6 lg:p-8',
    inline: 'bg-gray-50 p-4 sm:p-6 rounded-lg',
    modal: 'bg-white p-4 sm:p-6 lg:p-8',
  };

  // Estado de éxito
  if (submitStatus === 'success') {
    return (
      <div className={containerClasses[variant]}>
        <div className="text-center py-6 sm:py-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">¡Recibido!</h3>
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
            Te contactaremos en las próximas horas.
          </p>
          <div className="bg-accent/10 border border-accent/30 rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-gray-800 text-left">
            <strong>¿Qué pasa ahora?</strong><br />
            Un experto revisará tu caso y te llamará para confirmar tus necesidades.
          </div>
          <button
            onClick={() => setSubmitStatus('idle')}
            className="mt-4 sm:mt-6 text-accent hover:text-accent/80 font-medium text-sm sm:text-base"
          >
            Enviar otra consulta
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses[variant]} id="formulario">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">{displayTitle}</h3>
        <p className="text-gray-600 text-sm sm:text-base">{displaySubtitle}</p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-6 sm:mb-8">
        {[1, 2].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-colors ${
              currentStep >= step ? 'bg-accent text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step}
            </div>
            {step < 2 && (
              <div className={`w-8 sm:w-12 h-1 mx-1 transition-colors ${
                currentStep > step ? 'bg-accent' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* STEP 1 */}
        {currentStep === 1 && (
          <div className="space-y-4 sm:space-y-5">
            {/* Servicio */}
            {(showServiceField && !servicioSlug) && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  ¿Qué servicio necesitas? *
                </label>
                <select
                  name="servicio"
                  value={formData.servicio}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none"
                >
                  <option value="">Selecciona un servicio</option>
                  {SERVICIOS.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            )}

            {servicioSlug && (
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3 text-sm">
                <svg className="w-5 h-5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="font-medium text-gray-800">Servicio: {servicio}</span>
              </div>
            )}

            {/* Ciudad */}
            {(showCityField && !ciudadSlug) && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  ¿En qué ciudad? *
                </label>
                <select
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none"
                >
                  <option value="">Selecciona una ciudad</option>
                  {ciudades.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            )}

            {ciudadSlug && (
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3 text-sm">
                <svg className="w-5 h-5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span className="font-medium text-gray-800">Ciudad: {ciudad}</span>
              </div>
            )}

            {/* Urgencia */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                ¿Cuándo lo necesitas? *
              </label>
              <div className="grid grid-cols-1 gap-2">
                {URGENCIAS.map(u => (
                  <label 
                    key={u.value}
                    className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 border-2 rounded-lg cursor-pointer transition-all text-sm sm:text-base ${
                      formData.urgencia === u.value 
                        ? 'border-accent bg-accent/10' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="urgencia"
                      value={u.value}
                      checked={formData.urgencia === u.value}
                      onChange={handleChange}
                      className="w-4 h-4 text-accent"
                      required
                    />
                    <span className="text-gray-700">{u.label}</span>
                    {u.hot && (
                      <span className="ml-auto text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                        Prioritario
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              disabled={!formData.urgencia || (!servicioSlug && !formData.servicio) || (!ciudadSlug && !formData.ciudad)}
              className="w-full bg-accent text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold text-base sm:text-lg hover:bg-accent/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
            >
              Continuar →
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <div className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                Tu nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="¿Cómo te llamas?"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                Teléfono (WhatsApp) *
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
                placeholder="+34 600 000 000"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="tu@email.com"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                Idioma preferido
              </label>
              <select
                name="idioma_preferido"
                value={formData.idioma_preferido}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none"
              >
                {IDIOMAS.map(i => (
                  <option key={i.value} value={i.value}>{i.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                ¿Algo más? <span className="font-normal text-gray-400">(opcional)</span>
              </label>
              <textarea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                rows={2}
                placeholder="Cuéntanos más..."
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none resize-none"
              />
            </div>

            <label className="flex items-start gap-2 sm:gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="acepta_privacidad"
                checked={formData.acepta_privacidad}
                onChange={handleChange}
                required
                className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 text-accent rounded"
              />
              <span className="text-xs sm:text-sm text-gray-600">
                Acepto la{' '}
                <a href="/es/privacidad" className="text-accent hover:underline" target="_blank">
                  política de privacidad
                </a>
              </span>
            </label>

            <div className="flex gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all text-sm sm:text-base"
              >
                ←
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.acepta_privacidad}
                className="flex-1 bg-accent text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold text-base sm:text-lg hover:bg-accent/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="hidden sm:inline">Enviando...</span>
                  </>
                ) : (
                  'Enviar solicitud'
                )}
              </button>
            </div>

            {/* Trust badges - responsive */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-3 sm:pt-4 border-t border-gray-100 text-xs sm:text-sm text-gray-500">
              <span className="inline-flex items-center gap-1"><svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> Seguro</span>
              <span className="inline-flex items-center gap-1"><svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 24h</span>
              <span className="inline-flex items-center gap-1"><svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Gratis</span>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mt-4 p-3 sm:p-4 bg-accent-50 border border-accent-200 rounded-lg text-accent-700 text-xs sm:text-sm">
            <strong>Error al enviar.</strong> Inténtalo de nuevo.
          </div>
        )}
      </form>
    </div>
  );
}
