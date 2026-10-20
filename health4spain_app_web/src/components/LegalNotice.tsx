import type { Locale } from '@/lib/routes';

/**
 * Aviso legal (LSSI-CE, art. 10). Datos del titular en un único bloque.
 * Fuente: escritura nº 394/2026 (notaria Purificación Díaz Martínez, 04/03/2026)
 * y aviso legal publicado en coasemed.com.
 * REGISTRO_DATOS: añadir tomo, folio y hoja (nota de inscripción del RM de Murcia)
 * en cuanto se tengan; mientras esté vacío solo se muestra «Registro Mercantil de Murcia».
 */
export const TITULAR = {
  razonSocial: 'COASEMED, S.L.',
  cif: 'B-26891572',
  domicilio: 'Calle Emilio Castelar, 45 — 30740 San Pedro del Pinatar (Murcia), España',
  registro: 'Registro Mercantil de Murcia',
  registroDatos: '', // p. ej. 'Hoja MU-XXXXXX'
  email: 'legal@health4spain.com',
  telefono: '+34 614 404 562',
  web: 'www.health4spain.com',
};

type Section = { h: string; p: string[] };
type Copy = {
  title: string;
  lastUpdate: string;
  date: string;
  labels: { owner: string; cif: string; address: string; registry: string; email: string; phone: string; web: string };
  registered: string;
  sections: Section[];
};

const COPY: Record<Locale, Copy> = {
  es: {
    title: 'Aviso legal',
    lastUpdate: 'Última actualización',
    date: 'Octubre 2026',
    labels: { owner: 'Titular', cif: 'CIF', address: 'Domicilio social', registry: 'Inscripción', email: 'Correo electrónico', phone: 'Teléfono', web: 'Sitio web' },
    registered: 'Inscrita en el',
    sections: [
      { h: '1. Titular del sitio web', p: ['En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de que este sitio web y la marca comercial Health4Spain pertenecen a la sociedad identificada arriba.'] },
      { h: '2. Actividad', p: [
        'COASEMED, S.L. es una empresa de tecnología y marketing digital. A través de Health4Spain pone en contacto a personas extranjeras que viven o van a vivir en España con profesionales independientes: mediadores de seguros, abogados, inmobiliarias y gestorías.',
        'COASEMED, S.L. no es aseguradora ni mediadora de seguros, no presta asesoramiento jurídico, inmobiliario ni administrativo y no es un organismo oficial. Cada profesional presta sus servicios en su propio nombre y bajo su responsabilidad.',
      ] },
      { h: '3. Condiciones de uso', p: ['El acceso a este sitio web es libre e implica la aceptación de este aviso legal, de los Términos y Condiciones, de la Política de Privacidad y de la Política de Cookies. El usuario se compromete a hacer un uso lícito del sitio y de sus contenidos.'] },
      { h: '4. Propiedad intelectual e industrial', p: ['Los textos, imágenes, logotipos, marcas y diseño de este sitio pertenecen a COASEMED, S.L. o se usan con autorización. No se permite su reproducción, distribución o transformación sin autorización expresa.'] },
      { h: '5. Responsabilidad', p: ['La información de este sitio es general y no sustituye el asesoramiento de un profesional. COASEMED, S.L. no responde de los contenidos de sitios de terceros enlazados desde esta web ni de los servicios que presten los profesionales con los que se pone en contacto al usuario.'] },
      { h: '6. Legislación aplicable', p: ['Este aviso legal se rige por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales que correspondan conforme a la ley.'] },
    ],
  },
  en: {
    title: 'Legal notice',
    lastUpdate: 'Last updated',
    date: 'October 2026',
    labels: { owner: 'Owner', cif: 'Tax ID (CIF)', address: 'Registered office', registry: 'Registration', email: 'Email', phone: 'Phone', web: 'Website' },
    registered: 'Registered with the',
    sections: [
      { h: '1. Website owner', p: ['In compliance with Article 10 of Spanish Law 34/2002 on Information Society Services and Electronic Commerce (LSSI-CE), this website and the trade name Health4Spain belong to the company identified above.'] },
      { h: '2. Activity', p: [
        'COASEMED, S.L. is a technology and digital marketing company. Through Health4Spain it puts foreign nationals living in, or moving to, Spain in contact with independent professionals: insurance intermediaries, lawyers, estate agents and administrative agencies (gestorías).',
        'COASEMED, S.L. is not an insurer or an insurance intermediary, does not provide legal, real-estate or administrative advice, and is not a government body. Each professional provides their services in their own name and under their own responsibility.',
      ] },
      { h: '3. Terms of use', p: ['Access to this website is free and implies acceptance of this legal notice, the Terms and Conditions, the Privacy Policy and the Cookie Policy. Users agree to make lawful use of the website and its content.'] },
      { h: '4. Intellectual and industrial property', p: ['The texts, images, logos, trademarks and design of this website belong to COASEMED, S.L. or are used with permission. They may not be reproduced, distributed or modified without express authorisation.'] },
      { h: '5. Liability', p: ['The information on this website is general and does not replace professional advice. COASEMED, S.L. is not liable for the content of third-party websites linked from this site, nor for the services provided by the professionals the user is put in contact with.'] },
      { h: '6. Governing law', p: ['This legal notice is governed by Spanish law. Any dispute shall be submitted to the courts that have jurisdiction under the law.'] },
    ],
  },
  fr: {
    title: 'Mentions légales',
    lastUpdate: 'Dernière mise à jour',
    date: 'Octobre 2026',
    labels: { owner: 'Titulaire', cif: 'N° fiscal (CIF)', address: 'Siège social', registry: 'Immatriculation', email: 'E-mail', phone: 'Téléphone', web: 'Site web' },
    registered: 'Immatriculée au',
    sections: [
      { h: '1. Titulaire du site', p: ["Conformément à l'article 10 de la loi espagnole 34/2002 sur les services de la société de l'information et le commerce électronique (LSSI-CE), ce site et la marque commerciale Health4Spain appartiennent à la société identifiée ci-dessus."] },
      { h: '2. Activité', p: [
        "COASEMED, S.L. est une entreprise de technologie et de marketing digital. Via Health4Spain, elle met en relation des personnes étrangères qui vivent ou vont vivre en Espagne avec des professionnels indépendants : intermédiaires d'assurance, avocats, agences immobilières et gestorías.",
        "COASEMED, S.L. n'est ni un assureur ni un intermédiaire d'assurance, ne fournit pas de conseil juridique, immobilier ou administratif et n'est pas un organisme officiel. Chaque professionnel exerce en son propre nom et sous sa propre responsabilité.",
      ] },
      { h: "3. Conditions d'utilisation", p: ["L'accès à ce site est libre et implique l'acceptation des présentes mentions légales, des Conditions générales, de la Politique de confidentialité et de la Politique de cookies. L'utilisateur s'engage à faire un usage licite du site et de son contenu."] },
      { h: '4. Propriété intellectuelle et industrielle', p: ['Les textes, images, logos, marques et le design de ce site appartiennent à COASEMED, S.L. ou sont utilisés avec autorisation. Toute reproduction, diffusion ou modification sans autorisation expresse est interdite.'] },
      { h: '5. Responsabilité', p: ["Les informations de ce site sont générales et ne remplacent pas le conseil d'un professionnel. COASEMED, S.L. n'est pas responsable du contenu des sites tiers liés depuis ce site, ni des services fournis par les professionnels mis en relation avec l'utilisateur."] },
      { h: '6. Droit applicable', p: ['Les présentes mentions légales sont régies par le droit espagnol. Tout litige sera soumis aux juridictions compétentes conformément à la loi.'] },
    ],
  },
  de: {
    title: 'Impressum',
    lastUpdate: 'Letzte Aktualisierung',
    date: 'Oktober 2026',
    labels: { owner: 'Inhaber', cif: 'Steuernummer (CIF)', address: 'Sitz', registry: 'Eintragung', email: 'E-Mail', phone: 'Telefon', web: 'Website' },
    registered: 'Eingetragen im',
    sections: [
      { h: '1. Inhaber der Website', p: ['Gemäß Artikel 10 des spanischen Gesetzes 34/2002 über Dienste der Informationsgesellschaft und den elektronischen Geschäftsverkehr (LSSI-CE) gehören diese Website und die Handelsmarke Health4Spain der oben genannten Gesellschaft.'] },
      { h: '2. Tätigkeit', p: [
        'COASEMED, S.L. ist ein Technologie- und Digitalmarketing-Unternehmen. Über Health4Spain bringt es Ausländerinnen und Ausländer, die in Spanien leben oder dorthin ziehen, mit unabhängigen Fachleuten in Kontakt: Versicherungsvermittler, Rechtsanwälte, Immobilienmakler und Gestorías.',
        'COASEMED, S.L. ist weder Versicherer noch Versicherungsvermittler, erbringt keine rechtliche, immobilienbezogene oder administrative Beratung und ist keine Behörde. Jede Fachperson handelt im eigenen Namen und in eigener Verantwortung.',
      ] },
      { h: '3. Nutzungsbedingungen', p: ['Der Zugang zu dieser Website ist frei und setzt die Annahme dieses Impressums, der AGB, der Datenschutzerklärung und der Cookie-Richtlinie voraus. Die Nutzer verpflichten sich, die Website und ihre Inhalte rechtmäßig zu nutzen.'] },
      { h: '4. Geistiges und gewerbliches Eigentum', p: ['Texte, Bilder, Logos, Marken und Design dieser Website gehören COASEMED, S.L. oder werden mit Genehmigung verwendet. Vervielfältigung, Verbreitung oder Bearbeitung ohne ausdrückliche Genehmigung ist nicht gestattet.'] },
      { h: '5. Haftung', p: ['Die Informationen auf dieser Website sind allgemeiner Natur und ersetzen keine fachliche Beratung. COASEMED, S.L. haftet nicht für Inhalte verlinkter Websites Dritter und nicht für die Leistungen der Fachleute, mit denen Nutzer in Kontakt gebracht werden.'] },
      { h: '6. Anwendbares Recht', p: ['Dieses Impressum unterliegt spanischem Recht. Für Streitigkeiten sind die nach dem Gesetz zuständigen Gerichte zuständig.'] },
    ],
  },
  pt: {
    title: 'Aviso legal',
    lastUpdate: 'Última atualização',
    date: 'Outubro 2026',
    labels: { owner: 'Titular', cif: 'NIF (CIF)', address: 'Sede social', registry: 'Registo', email: 'E-mail', phone: 'Telefone', web: 'Website' },
    registered: 'Inscrita no',
    sections: [
      { h: '1. Titular do website', p: ['Em cumprimento do artigo 10.º da Lei espanhola 34/2002, de Serviços da Sociedade da Informação e de Comércio Eletrónico (LSSI-CE), este website e a marca comercial Health4Spain pertencem à sociedade identificada acima.'] },
      { h: '2. Atividade', p: [
        'A COASEMED, S.L. é uma empresa de tecnologia e marketing digital. Através da Health4Spain, põe em contacto pessoas estrangeiras que vivem ou vão viver em Espanha com profissionais independentes: mediadores de seguros, advogados, imobiliárias e gestorías.',
        'A COASEMED, S.L. não é seguradora nem mediadora de seguros, não presta aconselhamento jurídico, imobiliário ou administrativo e não é um organismo oficial. Cada profissional presta os seus serviços em nome próprio e sob a sua responsabilidade.',
      ] },
      { h: '3. Condições de utilização', p: ['O acesso a este website é livre e implica a aceitação deste aviso legal, dos Termos e Condições, da Política de Privacidade e da Política de Cookies. O utilizador compromete-se a fazer um uso lícito do website e dos seus conteúdos.'] },
      { h: '4. Propriedade intelectual e industrial', p: ['Os textos, imagens, logótipos, marcas e design deste website pertencem à COASEMED, S.L. ou são utilizados com autorização. Não é permitida a sua reprodução, distribuição ou transformação sem autorização expressa.'] },
      { h: '5. Responsabilidade', p: ['A informação deste website é geral e não substitui o aconselhamento de um profissional. A COASEMED, S.L. não se responsabiliza pelo conteúdo de websites de terceiros ligados a partir deste, nem pelos serviços prestados pelos profissionais com quem o utilizador é posto em contacto.'] },
      { h: '6. Lei aplicável', p: ['Este aviso legal rege-se pela lei espanhola. Qualquer litígio será submetido aos tribunais competentes nos termos da lei.'] },
    ],
  },
};

export const LEGAL_META: Record<Locale, { title: string; desc: string }> = {
  es: { title: 'Aviso legal | Health4Spain', desc: 'Datos del titular de Health4Spain: COASEMED, S.L., CIF, domicilio social e inscripción registral.' },
  en: { title: 'Legal notice | Health4Spain', desc: 'Owner details for Health4Spain: COASEMED, S.L., tax ID, registered office and registration.' },
  fr: { title: 'Mentions légales | Health4Spain', desc: 'Informations sur le titulaire de Health4Spain : COASEMED, S.L., CIF, siège social et immatriculation.' },
  de: { title: 'Impressum | Health4Spain', desc: 'Angaben zum Inhaber von Health4Spain: COASEMED, S.L., Steuernummer, Sitz und Eintragung.' },
  pt: { title: 'Aviso legal | Health4Spain', desc: 'Dados do titular da Health4Spain: COASEMED, S.L., NIF, sede social e registo.' },
};

export const LEGAL_LINK_LABEL: Record<Locale, string> = {
  es: 'Aviso legal',
  en: 'Legal notice',
  fr: 'Mentions légales',
  de: 'Impressum',
  pt: 'Aviso legal',
};

export default function LegalNotice({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const registro = `${c.registered} ${TITULAR.registro}${TITULAR.registroDatos ? ` · ${TITULAR.registroDatos}` : ''}`;
  const rows: [string, React.ReactNode][] = [
    [c.labels.owner, <strong key="o">{TITULAR.razonSocial}</strong>],
    [c.labels.cif, TITULAR.cif],
    [c.labels.address, TITULAR.domicilio],
    [c.labels.registry, registro],
    [c.labels.email, <a key="e" href={`mailto:${TITULAR.email}`} className="text-accent hover:underline">{TITULAR.email}</a>],
    [c.labels.phone, <a key="t" href={`tel:${TITULAR.telefono.replace(/\s/g, '')}`} className="text-accent hover:underline">{TITULAR.telefono}</a>],
    [c.labels.web, TITULAR.web],
  ];

  return (
    <div className="section">
      <div className="container-narrow">
        <h1 className="mb-12">{c.title}</h1>
        <p className="text-gray-600 mb-12">
          <strong>{c.lastUpdate}:</strong> {c.date}
        </p>

        <dl className="grid sm:grid-cols-[12rem_1fr] gap-x-6 gap-y-3 mb-16 text-gray-700">
          {rows.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="font-semibold text-gray-900">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>

        <div className="space-y-12">
          {c.sections.map((s) => (
            <section key={s.h}>
              <h2 className="text-2xl mb-4">{s.h}</h2>
              {s.p.map((p, i) => (
                <p key={i} className="text-gray-700 leading-relaxed mb-4">{p}</p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
