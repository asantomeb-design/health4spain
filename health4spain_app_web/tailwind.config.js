/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Títulos: Roboto Slab
        heading: ['var(--font-heading)', 'Roboto Slab', 'Georgia', 'serif'],
        // Body: Ubuntu
        body: ['var(--font-body)', 'Ubuntu', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        // Colores principales Health4Spain
        primary: {
          DEFAULT: '#43beda',
          50: '#eefbfd',
          100: '#d5f4f9',
          200: '#b0eaf4',
          300: '#79dbec',
          400: '#43beda', // Principal
          500: '#1ea7c7',
          600: '#1985a7',
          700: '#1b6c89',
          800: '#1e5970',
          900: '#1d4a5f',
        },
        secondary: {
          DEFAULT: '#2b3e92',
          50: '#eef1ff',
          100: '#e0e5ff',
          200: '#c7cefe',
          300: '#a5acfc',
          400: '#8281f7',
          500: '#6a5eef',
          600: '#5b41e3',
          700: '#4d34c8',
          800: '#3f2da2',
          900: '#2b3e92', // Secundario
        },
        // Grises personalizados
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        // Acento (reemplaza rojo): azul claro
        accent: {
          DEFAULT: '#3bbdda',
          50: '#ecfbfe',
          100: '#d5f5fa',
          200: '#b0eaf4',
          400: '#4dc9e3',
          500: '#3bbdda',
          600: '#2dacc7',
          700: '#1e9cb8',
        },
        // Semánticos
        success: '#10b981',
        warning: '#f59e0b',
        error: '#3bbdda',
        info: '#3b82f6',
      },
      spacing: {
        // Espaciado de secciones (reducido según feedback)
        'section': '4rem',      // 64px (antes 80px)
        'section-sm': '2.5rem', // 40px (antes 48px)
        'section-lg': '5rem',   // 80px (antes 100px)
      },
      maxWidth: {
        'container': '1280px',
        'content': '1120px',
        'narrow': '768px',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'cta': '0 10px 40px -10px rgba(67, 190, 218, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
