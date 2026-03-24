interface TrustBarProps {
  lang?: string;
  variant?: 'light' | 'dark' | 'blue';
}

const CONTENT = {
  es: {
    items: [
      { icon: '⚡', value: '24h', label: 'Tiempo de respuesta' },
      { icon: '✓', value: '100%', label: 'Profesionales verificados' },
      { icon: '💰', value: '0€', label: 'Coste para ti' },
      { icon: '🌐', value: '4', label: 'Idiomas disponibles' },
    ]
  },
  en: {
    items: [
      { icon: '⚡', value: '24h', label: 'Response time' },
      { icon: '✓', value: '100%', label: 'Verified professionals' },
      { icon: '💰', value: '€0', label: 'Cost for you' },
      { icon: '🌐', value: '4', label: 'Languages available' },
    ]
  },
};

export default function TrustBar({ lang = 'es', variant = 'light' }: TrustBarProps) {
  const content = CONTENT[lang as keyof typeof CONTENT] || CONTENT.es;
  
  const bgClasses = {
    light: 'bg-gray-50 border-y border-gray-200',
    dark: 'bg-gray-900 text-white',
    blue: 'bg-blue-600 text-white',
  };

  const textClasses = {
    light: 'text-gray-900',
    dark: 'text-white',
    blue: 'text-white',
  };

  const subtextClasses = {
    light: 'text-gray-600',
    dark: 'text-gray-400',
    blue: 'text-blue-100',
  };

  return (
    <section className={`py-8 px-[5%] ${bgClasses[variant]}`}>
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {content.items.map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className={`text-2xl md:text-3xl font-bold ${textClasses[variant]}`}>
                {item.value}
              </div>
              <div className={`text-sm ${subtextClasses[variant]}`}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
