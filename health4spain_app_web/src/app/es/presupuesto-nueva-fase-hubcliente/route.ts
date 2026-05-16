import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

const HTML = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">
<meta name="googlebot" content="noindex, nofollow">
<meta name="theme-color" content="#1F3864">
<title>Propuesta econ&oacute;mica &middot; H4S Hub Colaboradores &middot; Z7 Media</title>
<style>
:root{
  --h4s-cyan:#00BFE0;--h4s-cyan-soft:#E0F7FB;
  --h4s-blue:#1F90D0;--h4s-blue-soft:#DCEEF8;
  --h4s-navy:#1F3864;--h4s-navy-dark:#0F1F40;
  --brand:#1F3864;--brand-dark:#0F1F40;--brand-light:#EEF1FB;--brand-soft:#D6DCF5;
  --accent:#C9A227;--accent-soft:#FBF1D5;--accent-dark:#8B6914;
  --green:#16A34A;--green-soft:#DCFCE7;--green-bd:#86EFAC;
  --blue:#2563EB;--blue-soft:#DBEAFE;
  --amber:#D97706;--amber-soft:#FEF3C7;
  --red:#DC2626;--red-soft:#FEE2E2;
  --bg:#F4F6FB;--white:#FFF;--border:#D8DEEE;
  --text:#1A2240;--text2:#4A5568;--text3:#718096;
  --r:14px;--r-sm:10px;--r-lg:20px;
  --shadow:0 2px 10px rgba(31,56,100,.10);
  --shadow-lg:0 8px 28px rgba(31,56,100,.18);
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:var(--bg);color:var(--text);
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;
  font-size:15px;line-height:1.55;-webkit-font-smoothing:antialiased}
.doc{max-width:980px;margin:0 auto;padding:0 20px 80px}

/* HERO */
.hero{background:linear-gradient(135deg,var(--h4s-navy-dark) 0%,var(--h4s-navy) 50%,var(--h4s-blue) 100%);
  color:white;padding:48px 32px 56px;border-radius:0 0 var(--r-lg) var(--r-lg);
  box-shadow:var(--shadow-lg);margin-bottom:40px;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;right:-80px;top:-80px;width:300px;height:300px;
  border-radius:50%;background:rgba(255,255,255,.04)}
.hero::after{content:'';position:absolute;left:-40px;bottom:-60px;width:180px;height:180px;
  border-radius:50%;background:rgba(0,191,224,.08)}
.hero-inner{position:relative;z-index:1}
.hero-eyebrow{font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;
  color:var(--h4s-cyan);margin-bottom:10px;opacity:.95}
.hero-title{font-size:38px;font-weight:800;letter-spacing:-.5px;margin-bottom:14px;line-height:1.1}
.hero-sub{font-size:17px;opacity:.85;max-width:680px;line-height:1.5}
.hero-meta{margin-top:28px;display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px}
.hero-meta-item{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);
  border-radius:var(--r-sm);padding:12px 14px;backdrop-filter:blur(8px)}
.hero-meta-lbl{font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;
  color:rgba(255,255,255,.55);margin-bottom:3px}
.hero-meta-val{font-size:15px;font-weight:700;color:white}

/* SECTIONS */
.sec{margin-bottom:40px}
.sec-num{display:inline-block;font-size:11px;font-weight:800;color:var(--accent);
  letter-spacing:.15em;text-transform:uppercase;margin-bottom:8px}
.sec-title{font-size:24px;font-weight:800;color:var(--brand);letter-spacing:-.3px;
  margin-bottom:8px;line-height:1.2}
.sec-desc{font-size:15px;color:var(--text2);max-width:760px;margin-bottom:22px;line-height:1.6}

/* CARDS */
.card{background:white;border:1px solid var(--border);border-radius:var(--r);
  box-shadow:var(--shadow);overflow:hidden}
.card-pad{padding:22px 24px}
.card-head{padding:18px 24px;border-bottom:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.card-title{font-size:14px;font-weight:800;color:var(--brand);text-transform:uppercase;letter-spacing:.06em}

/* TILES */
.tile-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-bottom:18px}
.tile{background:white;border:1px solid var(--border);border-radius:var(--r);padding:18px 20px;
  position:relative;overflow:hidden;transition:transform .15s, box-shadow .15s}
.tile:hover{transform:translateY(-2px);box-shadow:var(--shadow-lg)}
.tile-ic{width:42px;height:42px;border-radius:11px;display:flex;align-items:center;
  justify-content:center;font-size:22px;margin-bottom:12px;flex-shrink:0}
.tile-ic.t-brand{background:var(--brand-light);color:var(--brand)}
.tile-ic.t-acc{background:var(--accent-soft);color:var(--accent-dark)}
.tile-ic.t-green{background:var(--green-soft);color:var(--green)}
.tile-ic.t-cyan{background:var(--h4s-cyan-soft);color:var(--h4s-blue)}
.tile-name{font-size:14px;font-weight:700;color:var(--text);margin-bottom:3px;letter-spacing:-.1px}
.tile-sub{font-size:13px;color:var(--text3);line-height:1.45}
.tile-val{font-size:26px;font-weight:800;color:var(--brand);margin:6px 0 2px;line-height:1}

/* TABLE */
.tbl{width:100%;border-collapse:collapse;background:white;border-radius:var(--r);overflow:hidden;
  border:1px solid var(--border);box-shadow:var(--shadow)}
.tbl th{font-size:11px;font-weight:800;color:var(--text3);text-transform:uppercase;
  letter-spacing:.06em;padding:14px 16px;text-align:left;border-bottom:2px solid var(--border);
  background:var(--bg)}
.tbl td{padding:16px;border-bottom:1px solid var(--border);font-size:14px;vertical-align:top}
.tbl tr:last-child td{border-bottom:none}
.tbl-num{width:46px;font-weight:800;color:var(--accent);font-size:18px}
.tbl-strong{font-weight:700;color:var(--text)}
.tbl-muted{color:var(--text3);font-size:13px;margin-top:4px}
.tbl-price{font-weight:800;color:var(--brand);font-size:17px;text-align:right;white-space:nowrap}
.tbl-row-total{background:linear-gradient(135deg,var(--brand-light),white);
  border-top:2px solid var(--brand)}
.tbl-row-total td{padding:18px 16px}
.tbl-row-total .tbl-price{font-size:22px;color:var(--accent-dark)}

/* BANNER */
.banner{background:linear-gradient(135deg,var(--accent-soft),#FFF8E1);
  border-left:4px solid var(--accent);padding:18px 22px;border-radius:var(--r-sm);
  margin-bottom:18px}
.banner-info{background:linear-gradient(135deg,var(--brand-light),white);
  border-left:4px solid var(--brand)}
.banner-warn{background:linear-gradient(135deg,var(--amber-soft),#FFFBEB);
  border-left:4px solid var(--amber)}
.banner-title{font-size:13px;font-weight:800;color:var(--accent-dark);text-transform:uppercase;
  letter-spacing:.06em;margin-bottom:6px}
.banner-info .banner-title{color:var(--brand)}
.banner-warn .banner-title{color:#7C4A03}
.banner-text{font-size:14px;color:var(--text2);line-height:1.55}

/* PRICE BIG */
.price-hero{background:linear-gradient(135deg,var(--h4s-navy) 0%,var(--brand) 60%,var(--h4s-blue) 100%);
  color:white;border-radius:var(--r-lg);padding:36px 32px;text-align:center;margin-bottom:18px;
  box-shadow:var(--shadow-lg);position:relative;overflow:hidden}
.price-hero::before{content:'';position:absolute;right:-60px;top:-60px;width:200px;height:200px;
  border-radius:50%;background:rgba(255,255,255,.05)}
.price-hero-lbl{font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;
  color:var(--h4s-cyan);margin-bottom:8px;position:relative}
.price-hero-val{font-size:64px;font-weight:800;letter-spacing:-2px;line-height:1;
  margin-bottom:8px;position:relative}
.price-hero-val span{font-size:34px;color:var(--h4s-cyan);margin-left:6px;vertical-align:top}
.price-hero-sub{font-size:14px;opacity:.85;position:relative}

/* COMPARE */
.compare-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px}
.compare-card{background:white;border:1.5px solid var(--border);border-radius:var(--r);padding:20px 22px}
.compare-card.bad{border-color:var(--red-soft);background:linear-gradient(180deg,#FEF6F6,white)}
.compare-card.good{border-color:var(--green-bd);background:linear-gradient(180deg,#F0FDF4,white)}
.compare-tag{display:inline-block;font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;
  padding:4px 10px;border-radius:6px;margin-bottom:10px}
.compare-card.bad .compare-tag{background:var(--red-soft);color:var(--red)}
.compare-card.good .compare-tag{background:var(--green-soft);color:var(--green)}
.compare-title{font-size:18px;font-weight:800;margin-bottom:6px;letter-spacing:-.2px}
.compare-card.bad .compare-title{color:var(--red)}
.compare-card.good .compare-title{color:var(--green)}
.compare-num{font-size:32px;font-weight:800;line-height:1;margin-bottom:6px}
.compare-card.bad .compare-num{color:var(--red)}
.compare-card.good .compare-num{color:var(--green)}
.compare-text{font-size:13px;color:var(--text2);line-height:1.5}

/* LIST */
.bullets{list-style:none;display:flex;flex-direction:column;gap:10px}
.bullets li{display:flex;gap:12px;align-items:flex-start;font-size:14px;color:var(--text2);line-height:1.5}
.bullets li::before{content:'';flex-shrink:0;width:6px;height:6px;border-radius:50%;
  background:var(--accent);margin-top:9px}
.bullets-x li::before{background:var(--red)}
.bullets-v li::before{background:var(--green)}

/* PILL */
.pill{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;
  padding:4px 10px;border-radius:20px;background:var(--brand-light);color:var(--brand);
  letter-spacing:.04em}
.pill-acc{background:var(--accent-soft);color:var(--accent-dark)}
.pill-green{background:var(--green-soft);color:var(--green)}
.pill-amber{background:var(--amber-soft);color:#7C4A03}

/* TIMELINE */
.timeline{display:flex;flex-direction:column;gap:0;position:relative;padding-left:34px}
.timeline::before{content:'';position:absolute;left:14px;top:8px;bottom:8px;width:2px;background:var(--brand-soft)}
.tl-item{position:relative;padding-bottom:18px}
.tl-item:last-child{padding-bottom:0}
.tl-dot{position:absolute;left:-28px;top:4px;width:30px;height:30px;border-radius:50%;
  background:var(--brand);color:white;display:flex;align-items:center;justify-content:center;
  font-size:12px;font-weight:800;box-shadow:0 0 0 4px var(--bg)}
.tl-week{font-size:11px;font-weight:800;color:var(--accent);text-transform:uppercase;letter-spacing:.08em}
.tl-title{font-size:15px;font-weight:700;color:var(--text);margin:2px 0 4px;letter-spacing:-.1px}
.tl-desc{font-size:13px;color:var(--text3);line-height:1.5}

/* FOOTER */
.foot{background:linear-gradient(135deg,var(--h4s-navy-dark),var(--h4s-navy));
  color:white;padding:36px 32px;border-radius:var(--r-lg);margin-top:48px;
  text-align:center;box-shadow:var(--shadow-lg)}
.foot-title{font-size:18px;font-weight:800;margin-bottom:8px;letter-spacing:-.2px}
.foot-text{font-size:14px;opacity:.75;margin-bottom:20px;max-width:580px;margin-left:auto;margin-right:auto;line-height:1.5}
.foot-meta{display:flex;justify-content:center;gap:20px;flex-wrap:wrap;font-size:11px;
  color:rgba(255,255,255,.45);letter-spacing:.05em;text-transform:uppercase;font-weight:600}
.foot-meta span{display:flex;align-items:center;gap:6px}
.foot-conf{display:inline-block;margin-bottom:14px;font-size:10px;font-weight:800;
  padding:4px 12px;border-radius:20px;background:rgba(201,162,39,.2);color:var(--accent);
  letter-spacing:.12em;text-transform:uppercase;border:1px solid rgba(201,162,39,.3)}

@media(max-width:720px){
  .hero{padding:36px 22px 42px}
  .hero-title{font-size:28px}
  .hero-sub{font-size:15px}
  .price-hero-val{font-size:48px}
  .price-hero-val span{font-size:26px}
  .compare-grid{grid-template-columns:1fr}
  .sec-title{font-size:20px}
  .card-pad{padding:18px 18px}
  .tbl th,.tbl td{padding:12px 10px;font-size:13px}
  .tbl-price{font-size:14px}
  .tbl-row-total .tbl-price{font-size:18px}
  .doc{padding:0 14px 60px}
}

@media print{
  body{background:white}
  .hero,.price-hero,.foot{background:var(--brand)!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .tile,.card,.tbl{box-shadow:none;break-inside:avoid}
  .sec{break-inside:avoid}
}
</style>
</head>
<body>
<div class="doc">

<!-- HERO -->
<section class="hero">
  <div class="hero-inner">
    <div class="hero-eyebrow">Propuesta econ&oacute;mica &middot; Confidencial</div>
    <h1 class="hero-title">Hub Colaboradores &middot; Implementaci&oacute;n web completa</h1>
    <p class="hero-sub">
      Construcci&oacute;n del cuadro de mandos interno H4S sobre la infraestructura web ya entregada,
      con integraci&oacute;n bidireccional con GoHighLevel, motor CVR, liquidaciones n+1 / n+2
      y los 5 m&oacute;dulos de producto (ASISA, LBS, Partners, Comunicaciones, Energ&iacute;a).
    </p>
    <div class="hero-meta">
      <div class="hero-meta-item">
        <div class="hero-meta-lbl">Para</div>
        <div class="hero-meta-val">Adolfo &middot; H4S / COASEMED</div>
      </div>
      <div class="hero-meta-item">
        <div class="hero-meta-lbl">De</div>
        <div class="hero-meta-val">Z7 Media</div>
      </div>
      <div class="hero-meta-item">
        <div class="hero-meta-lbl">Versi&oacute;n</div>
        <div class="hero-meta-val">v1.0 &middot; Mayo 2026</div>
      </div>
      <div class="hero-meta-item">
        <div class="hero-meta-lbl">Validez</div>
        <div class="hero-meta-val">30 d&iacute;as</div>
      </div>
    </div>
  </div>
</section>

<!-- 01 RESUMEN EJECUTIVO -->
<section class="sec">
  <div class="sec-num">01 &middot; Resumen ejecutivo</div>
  <h2 class="sec-title">El Hub que ten&eacute;is en los blueprints, entregado en 4&ndash;6 semanas</h2>
  <p class="sec-desc">
    Hemos revisado los 6 documentos del proyecto (definici&oacute;n m&oacute;dulo, blueprint web,
    visi&oacute;n de flujos, privilegios por rol y mockup HTML v17). Es un plan s&oacute;lido y bien
    estructurado. Lo asumimos &iacute;ntegro como alcance, ajustando &uacute;nicamente el
    <strong>calendario y el modelo de pago</strong> a una entrega &aacute;gil moderna,
    aprovechando la base que ya hemos dejado operativa en la web p&uacute;blica.
  </p>

  <div class="tile-grid">
    <div class="tile">
      <div class="tile-ic t-acc">&euro;</div>
      <div class="tile-name">Inversi&oacute;n total</div>
      <div class="tile-val">3.500 &euro;</div>
      <div class="tile-sub">Precio cerrado a 4 hitos. IVA no incluido.</div>
    </div>
    <div class="tile">
      <div class="tile-ic t-cyan">&#9201;</div>
      <div class="tile-name">Plazo de entrega</div>
      <div class="tile-val">4&ndash;6 sem.</div>
      <div class="tile-sub">Frente a las 16 semanas que estimaba el blueprint.</div>
    </div>
    <div class="tile">
      <div class="tile-ic t-brand">&#9776;</div>
      <div class="tile-name">Hitos de pago</div>
      <div class="tile-val">4</div>
      <div class="tile-sub">Cada hito = entregable funcional verificable.</div>
    </div>
    <div class="tile">
      <div class="tile-ic t-green">&#10003;</div>
      <div class="tile-name">Mantenimiento</div>
      <div class="tile-val">100 &euro;/mes</div>
      <div class="tile-sub">Desde el mes 2 post go-live. Cancelable.</div>
    </div>
  </div>

  <div class="banner banner-info">
    <div class="banner-title">Por qu&eacute; este precio y este plazo</div>
    <p class="banner-text">
      Reutilizamos al m&aacute;ximo la infraestructura que ya hab&eacute;is pagado en la Fase 1 web:
      stack Next.js + Supabase, autenticaci&oacute;n, hosting Vercel, sistema de leads, conexi&oacute;n
      GHL b&aacute;sica, layouts y dise&ntilde;o corporativo. Esto reduce horas reales sin recortar
      alcance. La integraci&oacute;n profunda con GHL, el motor CVR y las liquidaciones se construyen
      sobre esa base, no de cero.
    </p>
  </div>
</section>

<!-- 02 ALCANCE -->
<section class="sec">
  <div class="sec-num">02 &middot; Alcance del Hub</div>
  <h2 class="sec-title">Qu&eacute; vais a recibir</h2>
  <p class="sec-desc">
    Todo lo descrito en el documento <em>H4S_Hub_Blueprint_Web_Javi.pdf</em> y en los 6 flujos
    end-to-end del documento <em>Vision_Flujos_Conjunta.pdf</em>. Ning&uacute;n recorte de funcionalidad.
  </p>

  <div class="card" style="margin-bottom:14px">
    <div class="card-head">
      <div class="card-title">A &middot; Frontend SPA por rol</div>
      <span class="pill">11 vistas internas</span>
    </div>
    <div class="card-pad">
      <ul class="bullets bullets-v">
        <li><strong>Login + sesi&oacute;n JWT</strong> con cookie HTTP-only, expiraci&oacute;n 8h, 2FA TOTP obligatorio para Admin y Supervisor.</li>
        <li><strong>Render por rol (RBAC)</strong>: 4 roles con vistas y acciones diferenciadas (Admin / Supervisor / T&eacute;cnico / Closer).</li>
        <li><strong>Mis Leads</strong> con filtros stage / producto / antig&uuml;edad, paginaci&oacute;n, tabla con badges fuente (web vs Meta).</li>
        <li><strong>Mi CVR</strong> con gauge animado, hist&oacute;rico 90 d&iacute;as, comparativa equipo y recomendaciones por reglas.</li>
        <li><strong>Mis Comisiones</strong> con desglose mensual por producto, distinci&oacute;n n+1 / n+2 y estado de liquidaci&oacute;n.</li>
        <li><strong>Mi Equipo</strong> (supervisor) con CVR de cada closer y aprobaci&oacute;n de liquidaciones.</li>
        <li><strong>5 m&oacute;dulos de producto</strong>: ASISA (con ramos y CVR ring), LBS, Partners, Comunicaciones, Energ&iacute;a.</li>
        <li><strong>Configuraci&oacute;n admin</strong>: usuarios, % comisiones, niveles CVR, reparto de figura, tareas.</li>
        <li><strong>Integraciones / Logs</strong> (admin / t&eacute;cnico) con audit log y estado de sincronizaci&oacute;n GHL.</li>
        <li><strong>Mi cuenta</strong>: cambio de contrase&ntilde;a y configuraci&oacute;n personal.</li>
      </ul>
    </div>
  </div>

  <div class="card" style="margin-bottom:14px">
    <div class="card-head">
      <div class="card-title">B &middot; Backend + integraci&oacute;n GHL</div>
      <span class="pill pill-acc">8 endpoints + 8 webhooks</span>
    </div>
    <div class="card-pad">
      <ul class="bullets bullets-v">
        <li><strong>Proxy autenticado</strong> a la API REST v2 de GoHighLevel con bearer token en backend (nunca expuesto al frontend).</li>
        <li><strong>Cache 5min</strong> por listados, sin cache para detalle, invalidaci&oacute;n por webhook.</li>
        <li><strong>Rate limit</strong> 100 req/min con cola y respuesta 429 controlada al frontend.</li>
        <li><strong>Lectura</strong>: opportunities, contacts, pipelines, users, custom-fields.</li>
        <li><strong>Escritura</strong>: PATCH stage, POST notas / tags / call logs, trigger workflows.</li>
        <li><strong>Receptor de webhooks</strong> con verificaci&oacute;n HMAC SHA-256 + idempotencia (tabla processed_events).</li>
        <li><strong>Sync nocturno</strong> de seguridad: cron 04:00 que reconcilia drift Hub vs GHL.</li>
        <li><strong>Retry exponencial</strong> 1s/5s/30s + cola persistente para escrituras s&iacute;ncronas.</li>
        <li><strong>Manejo de errores</strong> tipificado: 401, 403, 404, 409, 429, 5xx con UX espec&iacute;fica.</li>
      </ul>
    </div>
  </div>

  <div class="card" style="margin-bottom:14px">
    <div class="card-head">
      <div class="card-title">C &middot; Motor CVR + Liquidaciones</div>
      <span class="pill pill-green">L&oacute;gica de negocio propietaria</span>
    </div>
    <div class="card-pad">
      <ul class="bullets bullets-v">
        <li><strong>Cron diario 03:00 Madrid</strong> con c&aacute;lculo CVR rolling 30d para todos los closers activos.</li>
        <li><strong>5 niveles configurables</strong>: &Eacute;lite (+1%), &Oacute;ptimo (+0.5%), Objetivo (+0.25%), M&iacute;nimo (0%), Riesgo.</li>
        <li><strong>Snapshots hist&oacute;ricos</strong> en BBDD para gr&aacute;ficos sin recalcular.</li>
        <li><strong>Notificaciones por email</strong> al cambiar de nivel (closer + supervisor + digest a admin).</li>
        <li><strong>Re-evaluaci&oacute;n autom&aacute;tica</strong> de items en liquidaci&oacute;n abierta cuando cambia el nivel.</li>
        <li><strong>C&aacute;lculo comisi&oacute;n por cierre</strong>: prima &times; %_compa&ntilde;&iacute;a &times; reparto (30% interno / 40% externo) + bonus CVR.</li>
        <li><strong>R&eacute;gimen autom&aacute;tico</strong> n+1 (LBS, Comunicaciones, Energ&iacute;a) o n+2 (ASISA, Partners) seg&uacute;n producto.</li>
        <li><strong>Cron mensual d&iacute;a 1</strong> que cierra liquidaciones del mes anterior y notifica a supervisor + admin.</li>
        <li><strong>Workflow 6 estados</strong>: pendiente &rarr; pendiente_aprobacion &rarr; aprobada &rarr; elegible &rarr; liquidada (+ rechazada).</li>
        <li><strong>Export CSV</strong> para BackOffice (closer, IBAN, total neto, periodo).</li>
        <li><strong>Justificante PDF</strong> descargable por el closer al recibir el pago.</li>
      </ul>
    </div>
  </div>

  <div class="card">
    <div class="card-head">
      <div class="card-title">D &middot; Seguridad, GDPR y operativa</div>
      <span class="pill pill-amber">Producci&oacute;n endurecida</span>
    </div>
    <div class="card-pad">
      <ul class="bullets bullets-v">
        <li><strong>2FA TOTP obligatorio</strong> Admin / Supervisor antes del go-live.</li>
        <li><strong>RBAC con middleware central</strong> que valida rol en cada endpoint sensible.</li>
        <li><strong>Audit log GDPR-compliant</strong>: tabla con cada acci&oacute;n sensible (login, cierre venta, alta usuario, override liquidaci&oacute;n).</li>
        <li><strong>UI consulta audit</strong> para Admin / T&eacute;cnico con filtros y export.</li>
        <li><strong>Endpoint /admin/gdpr/forget</strong>: borra lead en Hub y propaga a GHL.</li>
        <li><strong>Backups encriptados</strong> AES-256 con retenci&oacute;n 90 d&iacute;as (gestionados por Supabase).</li>
        <li><strong>TLS 1.3</strong> obligatorio en todos los endpoints.</li>
        <li><strong>Rotaci&oacute;n de secretos</strong>: webhook secret cada 6 meses, JWT secret cada 12 meses.</li>
        <li><strong>Mobile responsive</strong> completo (desktop + tablet + m&oacute;vil).</li>
      </ul>
    </div>
  </div>
</section>

<!-- 03 HITOS Y PRECIO -->
<section class="sec">
  <div class="sec-num">03 &middot; Plan de entrega y pago</div>
  <h2 class="sec-title">4 hitos verificables &middot; pago contra entrega</h2>
  <p class="sec-desc">
    Cada hito es un entregable funcional que pod&eacute;is probar en producci&oacute;n antes de
    pagar el siguiente. No hay pagos por adelantado por trabajo no entregado.
  </p>

  <table class="tbl">
    <thead>
      <tr>
        <th style="width:46px">#</th>
        <th>Hito</th>
        <th style="text-align:right;width:120px">Importe</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="tbl-num">H1</td>
        <td>
          <div class="tbl-strong">Fundaci&oacute;n + GHL connector</div>
          <div class="tbl-muted">
            Esquema BBDD (5 tablas + configs) &middot; Auth multi-rol con RBAC y middleware &middot;
            Esqueleto SPA con sidebar por rol &middot; Cliente HTTP a GHL con cache + rate limit
            &middot; Webhook receptor con HMAC + idempotencia &middot; Vista &laquo;Mis Leads&raquo;
            funcional leyendo de GHL real.
          </div>
        </td>
        <td class="tbl-price">1.000 &euro;</td>
      </tr>
      <tr>
        <td class="tbl-num">H2</td>
        <td>
          <div class="tbl-strong">Operativa Closer end-to-end</div>
          <div class="tbl-muted">
            Modal cerrar venta con propagaci&oacute;n s&iacute;ncrona a GHL (PATCH stage + custom
            fields) &middot; Bot&oacute;n &laquo;Llamar&raquo; con outcome y registro de actividad
            &middot; Cambio de stage drag-drop o bot&oacute;n &middot; Retry exponencial y cola
            persistente &middot; Sync nocturno reconciliador. El closer puede trabajar todo
            su pipeline sin tocar GHL.
          </div>
        </td>
        <td class="tbl-price">1.000 &euro;</td>
      </tr>
      <tr>
        <td class="tbl-num">H3</td>
        <td>
          <div class="tbl-strong">CVR + Liquidaciones + 5 m&oacute;dulos producto</div>
          <div class="tbl-muted">
            Cron CVR diario con snapshots y clasificaci&oacute;n &middot; UI &laquo;Mi CVR&raquo;
            con gauge e hist&oacute;rico &middot; C&aacute;lculo comisi&oacute;n por cierre n+1 / n+2
            &middot; Cron mensual cierre liquidaciones &middot; UI &laquo;Mis Comisiones&raquo;
            (closer) y &laquo;Aprobar liquidaciones&raquo; (supervisor) con workflow 6 estados
            &middot; M&oacute;dulos ASISA, LBS, Partners, Comunicaciones, Energ&iacute;a con sus
            calculadoras y selectores &middot; Configurador admin (% comisiones, niveles CVR,
            reparto figura, usuarios) &middot; Export CSV BackOffice.
          </div>
        </td>
        <td class="tbl-price">1.000 &euro;</td>
      </tr>
      <tr>
        <td class="tbl-num">H4</td>
        <td>
          <div class="tbl-strong">Hardening + Go-live</div>
          <div class="tbl-muted">
            2FA TOTP Admin / Supervisor &middot; Audit log con UI consulta &middot; Endpoint GDPR
            /forget &middot; Mobile responsive completo &middot; Polish UX final &middot; Migraci&oacute;n
            de datos reales (mapping ghl_user_id &harr; hub_user_id) &middot; QA con datos reales
            &middot; Documentaci&oacute;n de operaci&oacute;n &middot; Entrega y formaci&oacute;n al equipo.
          </div>
        </td>
        <td class="tbl-price">500 &euro;</td>
      </tr>
      <tr class="tbl-row-total">
        <td></td>
        <td class="tbl-strong" style="font-size:15px">Total Hub Colaboradores &middot; precio cerrado</td>
        <td class="tbl-price">3.500 &euro;</td>
      </tr>
    </tbody>
  </table>

  <div class="banner" style="margin-top:18px">
    <div class="banner-title">C&oacute;mo se factura</div>
    <p class="banner-text">
      Cada hito se factura al ser <strong>aceptado por vosotros</strong> tras una demo en producci&oacute;n.
      Si en H1 viendo el resultado decid&iacute;s no continuar, pag&aacute;is solo H1 (1.000 &euro;) y
      cerramos. No hay penalizaci&oacute;n por cancelar.
    </p>
  </div>
</section>

<!-- 04 CALENDARIO -->
<section class="sec">
  <div class="sec-num">04 &middot; Calendario realista</div>
  <h2 class="sec-title">4&ndash;6 semanas en lugar de 16</h2>
  <p class="sec-desc">
    El blueprint planteaba 8 sprints de 2 semanas (modelo agencia tradicional con equipo de
    3&ndash;4 personas). Con stack moderno, base ya construida y herramientas IA-assisted,
    nuestra estimaci&oacute;n honesta es la mitad o menos.
  </p>

  <div class="compare-grid">
    <div class="compare-card bad">
      <span class="compare-tag">Modelo blueprint</span>
      <div class="compare-num">16 semanas</div>
      <div class="compare-title">Plan tradicional</div>
      <div class="compare-text">
        8 sprints de 2 semanas. Equipo de 3&ndash;4 personas trabajando en paralelo. Asume
        construcci&oacute;n desde cero, sin stack reaprovechable. Es el modelo que asume cualquier
        agencia conservadora. <strong>4 meses de calendario.</strong>
      </div>
    </div>
    <div class="compare-card good">
      <span class="compare-tag">Modelo Z7 Media</span>
      <div class="compare-num">4&ndash;6 semanas</div>
      <div class="compare-title">Entrega &aacute;gil moderna</div>
      <div class="compare-text">
        Stack Next.js + Supabase ya operativo de Fase 1. Reutilizaci&oacute;n de auth, hosting,
        i18n, integraci&oacute;n GHL b&aacute;sica, dise&ntilde;o corporativo. Trabajo en sprints
        cortos con IA-assistance. <strong>1 mes y poco de calendario.</strong>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-head">
      <div class="card-title">Roadmap previsto (escenario nominal)</div>
      <span class="pill">Sujeto a entregas Claudia</span>
    </div>
    <div class="card-pad">
      <div class="timeline">
        <div class="tl-item">
          <div class="tl-dot">1</div>
          <div class="tl-week">Semana 1</div>
          <div class="tl-title">H1 &middot; Fundaci&oacute;n + GHL connector</div>
          <div class="tl-desc">
            BBDD, auth multi-rol, esqueleto SPA, cliente GHL con cache, webhook receptor,
            primera vista &laquo;Mis Leads&raquo;. Demo final de semana.
          </div>
        </div>
        <div class="tl-item">
          <div class="tl-dot">2</div>
          <div class="tl-week">Semana 2&ndash;3</div>
          <div class="tl-title">H2 &middot; Operativa Closer end-to-end</div>
          <div class="tl-desc">
            Cerrar venta con sync GHL, llamar, cambiar stages, retry y cola persistente,
            sync nocturno. Closer puede trabajar todo su pipeline.
          </div>
        </div>
        <div class="tl-item">
          <div class="tl-dot">3</div>
          <div class="tl-week">Semana 3&ndash;5</div>
          <div class="tl-title">H3 &middot; CVR + Liquidaciones + 5 m&oacute;dulos producto</div>
          <div class="tl-desc">
            El sprint m&aacute;s denso: motor CVR, c&aacute;lculo comisiones, workflow estados,
            UI closer y supervisor, los 5 m&oacute;dulos de producto, configurador admin.
          </div>
        </div>
        <div class="tl-item">
          <div class="tl-dot">4</div>
          <div class="tl-week">Semana 5&ndash;6</div>
          <div class="tl-title">H4 &middot; Hardening + Go-live</div>
          <div class="tl-desc">
            2FA, audit log, GDPR, mobile, polish, migraci&oacute;n datos reales, QA y
            entrega formal con formaci&oacute;n al equipo.
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="banner banner-warn" style="margin-top:18px">
    <div class="banner-title">Cl&aacute;usula de no-bloqueo</div>
    <p class="banner-text">
      El calendario depende de que las entregas de Claudia (token GHL, IDs de pipeline / stages /
      custom fields, sandbox, webhook secret, hist&oacute;rico 90d de leads) lleguen a tiempo.
      Si una dependencia bloqueante se atrasa <strong>m&aacute;s de 14 d&iacute;as</strong>,
      cerramos el hito en curso, facturamos a tanto alzado y reanudamos cuando est&eacute; lista.
      Esto evita penalizar a ninguna parte.
    </p>
  </div>
</section>

<!-- 05 INVERSION -->
<section class="sec">
  <div class="sec-num">05 &middot; Inversi&oacute;n total</div>
  <div class="price-hero">
    <div class="price-hero-lbl">Hub Colaboradores &middot; Implementaci&oacute;n completa</div>
    <div class="price-hero-val">3.500<span>&euro;</span></div>
    <div class="price-hero-sub">Precio cerrado &middot; 4 hitos &middot; IVA no incluido</div>
  </div>

  <div class="tile-grid">
    <div class="tile">
      <div class="tile-ic t-acc">M</div>
      <div class="tile-name">Mantenimiento mensual</div>
      <div class="tile-val">100 &euro;/mes</div>
      <div class="tile-sub">
        Desde el mes 2 post go-live. Incluye soporte t&eacute;cnico,
        bugfixes, ajustes menores, monitorizaci&oacute;n y actualizaci&oacute;n de dependencias.
        Cancelable con 30 d&iacute;as de aviso.
      </div>
    </div>
    <div class="tile">
      <div class="tile-ic t-brand">+</div>
      <div class="tile-name">Cambios fuera de scope</div>
      <div class="tile-val">250 &euro;</div>
      <div class="tile-sub">
        Por cada cambio mayor en f&oacute;rmulas / productos / niveles solicitado tras
        cerrar el alcance del hito. Se cotiza expl&iacute;citamente antes de ejecutarlo.
      </div>
    </div>
    <div class="tile">
      <div class="tile-ic t-cyan">P</div>
      <div class="tile-name">Producto adicional</div>
      <div class="tile-val">400 &euro;</div>
      <div class="tile-sub">
        Si tras el go-live a&ntilde;ad&iacute;s un sexto producto (Hipotecas, Mascotas, etc.)
        no contemplado en el alcance original.
      </div>
    </div>
    <div class="tile">
      <div class="tile-ic t-green">D</div>
      <div class="tile-name">Migraci&oacute;n datos extra</div>
      <div class="tile-val">200&ndash;400 &euro;</div>
      <div class="tile-sub">
        Si hay que importar hist&oacute;ricos no contemplados (por ejemplo, liquidaciones
        ya pagadas en a&ntilde;os anteriores). Cotizable seg&uacute;n volumen.
      </div>
    </div>
  </div>
</section>

<!-- 06 INCLUYE / NO INCLUYE -->
<section class="sec">
  <div class="sec-num">06 &middot; Alcance contractual</div>
  <h2 class="sec-title">Qu&eacute; incluye y qu&eacute; no incluye este precio</h2>

  <div class="compare-grid">
    <div class="compare-card good">
      <span class="compare-tag">Incluido</span>
      <div class="compare-title">S&iacute; entregamos</div>
      <ul class="bullets bullets-v" style="margin-top:14px">
        <li>Frontend SPA completo con 11 vistas internas y 4 roles diferenciados.</li>
        <li>Backend Next.js + Supabase con todos los endpoints listados en el blueprint.</li>
        <li>Integraci&oacute;n bidireccional con GHL (lectura, escritura, webhooks).</li>
        <li>Motor CVR con cron diario, snapshots y notificaciones.</li>
        <li>Motor de liquidaciones n+1 / n+2 con workflow 6 estados.</li>
        <li>Los 5 m&oacute;dulos de producto del mockup v17.</li>
        <li>2FA, audit log, GDPR y mobile responsive.</li>
        <li>Hosting en infra ya pagada (Vercel + Supabase del proyecto actual).</li>
        <li>Documentaci&oacute;n t&eacute;cnica y de operaci&oacute;n.</li>
        <li>Formaci&oacute;n al equipo (sesi&oacute;n de 1h v&iacute;a videollamada).</li>
      </ul>
    </div>
    <div class="compare-card bad">
      <span class="compare-tag">No incluido</span>
      <div class="compare-title">Lo que es responsabilidad de Claudia / H4S</div>
      <ul class="bullets bullets-x" style="margin-top:14px">
        <li>Configuraci&oacute;n de GHL (pipelines, workflows, custom fields, tags).</li>
        <li>Generaci&oacute;n del token GHL y webhook secret.</li>
        <li>Mapeo de ghl_user_id &harr; email closer en CSV.</li>
        <li>Sandbox separado de producci&oacute;n para tests.</li>
        <li>Definici&oacute;n de f&oacute;rmulas de comisi&oacute;n por compa&ntilde;&iacute;a (Adolfo).</li>
        <li>Validaci&oacute;n de niveles CVR y umbrales (Adolfo).</li>
        <li>Comunicaciones con cliente (SMS / email v&iacute;a workflows GHL).</li>
        <li>Reconciliaci&oacute;n manual con extractos de compa&ntilde;&iacute;as.</li>
        <li>Procesamiento de pagos bancarios al closer (BackOffice).</li>
        <li>Costes de licencias GHL, Supabase Pro o cualquier servicio externo.</li>
      </ul>
    </div>
  </div>
</section>

<!-- 07 POR QUE NOSOTROS -->
<section class="sec">
  <div class="sec-num">07 &middot; Por qu&eacute; con Z7 Media</div>
  <h2 class="sec-title">El argumento que importa</h2>
  <p class="sec-desc">
    No competimos en precio bajo: competimos en velocidad de entrega y en aprovechar la base
    que ya hemos construido juntos. Cualquier presupuesto a esto en agencia tradicional ronda
    los 18.000 &euro; / 35.000 &euro; y 4 meses de calendario.
  </p>

  <div class="tile-grid">
    <div class="tile">
      <div class="tile-ic t-brand">&#9733;</div>
      <div class="tile-name">Conocemos vuestro stack</div>
      <div class="tile-sub" style="margin-top:8px">
        Hemos construido la web p&uacute;blica, el blog con IA, el formulario de Partners y el
        panel admin. No hay curva de aprendizaje: empezamos a producir desde el d&iacute;a 1.
      </div>
    </div>
    <div class="tile">
      <div class="tile-ic t-acc">&#9889;</div>
      <div class="tile-name">Velocidad real</div>
      <div class="tile-sub" style="margin-top:8px">
        IA-assisted development con Cursor + stack moderno multiplica la productividad x3
        sobre desarrollo cl&aacute;sico. Os ahorramos 3 meses de calendario sin recortar calidad.
      </div>
    </div>
    <div class="tile">
      <div class="tile-ic t-cyan">&#128274;</div>
      <div class="tile-name">Precio cerrado, sin sorpresas</div>
      <div class="tile-sub" style="margin-top:8px">
        3.500 &euro; cerrados frente a contratos por horas que se desbordan. Si tardamos m&aacute;s
        de lo previsto, asumimos el coste nosotros, no vosotros.
      </div>
    </div>
    <div class="tile">
      <div class="tile-ic t-green">&#128279;</div>
      <div class="tile-name">Continuidad garantizada</div>
      <div class="tile-sub" style="margin-top:8px">
        Mantenimiento mensual a 100 &euro;/mes con SLA. No os quedamos hu&eacute;rfanos
        post-entrega. Mismo equipo, misma persona de contacto.
      </div>
    </div>
  </div>
</section>

<!-- 08 TERMINOS -->
<section class="sec">
  <div class="sec-num">08 &middot; T&eacute;rminos y condiciones</div>
  <h2 class="sec-title">Letra peque&ntilde;a, sin trampa</h2>

  <div class="card">
    <div class="card-pad">
      <ul class="bullets">
        <li><strong>Validez de la oferta:</strong> 30 d&iacute;as desde la fecha de emisi&oacute;n.</li>
        <li><strong>IVA:</strong> no incluido. Se aplicar&aacute; el 21% espa&ntilde;ol vigente en cada factura.</li>
        <li><strong>Forma de pago:</strong> transferencia bancaria a 7 d&iacute;as desde aceptaci&oacute;n del hito.</li>
        <li><strong>Propiedad intelectual:</strong> el c&oacute;digo entregado es propiedad de COASEMED S.L. / Health4Spain.</li>
        <li><strong>Confidencialidad:</strong> NDA mutuo aplicable a todo el c&oacute;digo, datos y documentaci&oacute;n.</li>
        <li><strong>Cl&aacute;usula de no-bloqueo:</strong> si una dependencia externa (Claudia, Adolfo, BackOffice) se atrasa &gt;14 d&iacute;as, el hito en curso se factura y reanudamos cuando est&eacute; resuelta.</li>
        <li><strong>Cambios de scope:</strong> cualquier modificaci&oacute;n del alcance original tras aceptar este presupuesto se cotiza por separado antes de ejecutarse.</li>
        <li><strong>Garant&iacute;a:</strong> 30 d&iacute;as de bugfixes gratuitos post go-live (incluidos en H4).</li>
        <li><strong>Hosting / infraestructura:</strong> el c&oacute;digo se despliega en la infra ya pagada (Vercel + Supabase del proyecto). Coste de upgrades a planes superiores corre por cuenta de COASEMED.</li>
        <li><strong>Soporte post go-live:</strong> a partir del mes 2, mediante el contrato de mantenimiento. Mes 1 va incluido en H4.</li>
      </ul>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer class="foot">
  <span class="foot-conf">Confidencial &middot; Uso interno COASEMED / Z7</span>
  <div class="foot-title">Aceptaci&oacute;n del presupuesto</div>
  <p class="foot-text">
    Para aceptar este presupuesto basta con responder al email original con &laquo;OK propuesta v1.0&raquo;.
    Tras la aceptaci&oacute;n, programamos el kick-off t&eacute;cnico Javi + Claudia + Adolfo
    para alinear stages, custom fields y entregables del Sprint 1.
  </p>
  <div class="foot-meta">
    <span>Z7 Media</span>
    <span>&middot;</span>
    <span>Health4Spain &middot; COASEMED S.L.</span>
    <span>&middot;</span>
    <span>Mayo 2026 &middot; v1.0</span>
  </div>
</footer>

</div>
</body>
</html>`;

export async function GET() {
  return new NextResponse(HTML, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
      'Cache-Control': 'private, max-age=0, must-revalidate',
    },
  });
}
