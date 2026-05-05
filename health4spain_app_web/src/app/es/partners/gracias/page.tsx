import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Solicitud recibida · Health4Spain Partners',
  description: 'Hemos recibido tu solicitud para unirte a la red de partners H4S. Te llamamos en menos de 24 horas hábiles.',
  robots: { index: false, follow: false },
};

export default function PartnersGraciasPage() {
  return (
    <section className="section">
      <div className="container-narrow text-center max-w-2xl">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/15 flex items-center justify-center text-accent text-3xl font-bold">
          ✓
        </div>
        <p className="text-xs uppercase tracking-widest font-bold text-accent mb-3">
          Solicitud recibida
        </p>
        <h1 className="mb-6">Hemos recibido tu solicitud</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
          Un closer del equipo Health4Spain revisará tu perfil y te llamará en menos de
          <strong className="text-black"> 24 horas hábiles</strong> para una llamada breve de
          validación. Si encajas, te abrimos acceso al panel privado con tarifas detalladas para
          tu zona y calculadora ROI con tus números.
        </p>

        <div className="bg-white border-t-3 border-accent p-6 md:p-8 text-left mb-10 shadow-sm">
          <p className="text-xs uppercase tracking-widest font-bold text-accent mb-4">
            Qué pasa ahora
          </p>
          <ol className="space-y-4 text-sm md:text-base">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <span>
                <strong className="text-black">Revisamos tu perfil</strong> contra la disponibilidad
                de plaza en tu zona y los criterios mínimos H4S.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <span>
                <strong className="text-black">Te llamamos en 24 h hábiles</strong> al WhatsApp o
                teléfono que nos has facilitado para una llamada de cualificación de 20 minutos.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <span>
                Si encaja, te enviamos un <strong className="text-black">enlace personal</strong> al
                panel privado con tarifas para tu zona y calculadora ROI.
              </span>
            </li>
          </ol>
        </div>

        <p className="text-sm text-gray-500 mb-2">¿Has llegado por error o quieres revisar algo?</p>
        <Link href="/es/partners" className="btn-minimal">
          Volver a la información de partners
        </Link>
      </div>
    </section>
  );
}
