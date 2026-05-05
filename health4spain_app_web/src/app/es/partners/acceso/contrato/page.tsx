import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Solicitud de contrato registrada · Health4Spain Partners',
  description: 'Hemos registrado tu solicitud de contrato Founding. El equipo H4S preparará el pack legal y te lo enviará en menos de 48 horas hábiles.',
  robots: { index: false, follow: false },
};

export default function PartnersContratoConfirmadoPage() {
  return (
    <section className="section">
      <div className="container-narrow text-center max-w-2xl">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/15 flex items-center justify-center text-accent text-3xl font-bold">
          ✓
        </div>
        <p className="text-xs uppercase tracking-widest font-bold text-accent mb-3">
          Solicitud registrada
        </p>
        <h1 className="mb-6">Tu solicitud de contrato Founding está en marcha</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
          Hemos guardado tu selección (plan, verticales y condiciones Founding) en tu ficha. El
          equipo Health4Spain preparará el pack legal con tus datos auto-rellenados y te lo enviará
          para firma manual en menos de <strong className="text-black">48 horas hábiles</strong>.
        </p>

        <div className="bg-white border-t-3 border-accent p-6 md:p-8 text-left mb-10 shadow-sm">
          <p className="text-xs uppercase tracking-widest font-bold text-accent mb-4">
            Próximos pasos
          </p>
          <ol className="space-y-4 text-sm md:text-base">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <span>
                <strong className="text-black">Preparamos el pack legal</strong> a tu medida:
                contrato marco + anexo Founding + mandato SEPA con los datos de tu empresa.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <span>
                <strong className="text-black">Te llamamos para repasar</strong> letra pequeña,
                resolver dudas y confirmar la fecha de arranque.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <span>
                <strong className="text-black">Firma + setup técnico</strong>: URL dedicada, panel
                privado y bot Mar-IA en tu idioma. Operativo en 14-21 días.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
                4
              </span>
              <span>
                <strong className="text-black">Primer lead operativo</strong> entregado en tu
                agenda con briefing completo del cliente.
              </span>
            </li>
          </ol>
        </div>

        <p className="text-sm text-gray-500 mb-2">
          ¿Necesitas modificar tu selección? Vuelve al panel y reenvía la solicitud.
        </p>
        <Link href="/es/partners" className="btn-minimal">
          Volver a la página de partners
        </Link>
      </div>
    </section>
  );
}
