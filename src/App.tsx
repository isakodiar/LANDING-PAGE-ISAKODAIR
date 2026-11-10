import { useEffect, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowUpRight, Check, Moon, Sun } from 'lucide-react';
import { getService, services, whatsappUrl, type Service, type ServiceId } from './data';
import { sonyMusicProjects } from './sonyMusicPortfolio';

type Theme = 'light' | 'dark';
type Screen = { kind: 'home' } | { kind: 'service'; id: ServiceId } | { kind: 'quote'; id?: ServiceId; merchandiseKind?: MerchKind } | { kind: 'musicQuote' };
type MerchKind = 'custom' | 'quaids';

function themePreference(): Theme {
  try {
    const saved = localStorage.getItem('isak-theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch { /* Browsers can block localStorage. */ }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function parseScreen(): Screen {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const [part, id] = hash.split('/');
  if (part === 'servicio' && getService(id)) return { kind: 'service', id: id as ServiceId };
  if (part === 'propuesta-musical') return { kind: 'musicQuote' };
  if (part === 'cotizar') {
    const params = new URLSearchParams(id ?? '');
    const service = params.get('servicio');
    const kind = params.get('tipo');
    return {
      kind: 'quote',
      id: getService(service)?.id,
      merchandiseKind: kind === 'custom' || kind === 'quaids' ? kind : undefined,
    };
  }
  return { kind: 'home' };
}

function screenUrl(screen: Screen): string {
  if (screen.kind === 'home') return '#/';
  if (screen.kind === 'musicQuote') return '#/propuesta-musical';
  if (screen.kind === 'service') return `#/servicio/${screen.id}`;
  const params = new URLSearchParams();
  if (screen.id) params.set('servicio', screen.id);
  if (screen.merchandiseKind) params.set('tipo', screen.merchandiseKind);
  return `#/cotizar/${params.toString()}`;
}

function App() {
  const [theme, setTheme] = useState<Theme>(themePreference);
  const [screen, setScreen] = useState<Screen>(parseScreen);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0a0a0b' : '#f9f8f6');
    try { localStorage.setItem('isak-theme', theme); } catch { /* Not essential */ }
  }, [theme]);

  useEffect(() => {
    const sync = () => setScreen(parseScreen());
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  function navigate(next: Screen) {
    const url = screenUrl(next);
    if (window.location.hash === url) setScreen(next);
    else window.location.hash = url;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  const themeToggle = () => setTheme((current) => current === 'light' ? 'dark' : 'light');
  const selected = screen.kind === 'service' || screen.kind === 'quote' ? getService(screen.id) : undefined;

  return (
    <div className="site-shell">
      <header className="header container">
        <button className="brand" onClick={() => navigate({ kind: 'home' })} aria-label="Volver al inicio">ISAK ODAIR</button>
        <button className="theme-toggle" onClick={themeToggle} aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'} title={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}>
          {theme === 'light' ? <Moon size={16} aria-hidden /> : <Sun size={16} aria-hidden />}
          <span>{theme === 'light' ? 'DARK' : 'LIGHT'}</span>
        </button>
      </header>
      <main className="container">
        {screen.kind === 'home' && <Home navigate={navigate} />}
        {screen.kind === 'service' && selected && <ServicePage service={selected} navigate={navigate} />}
        {screen.kind === 'quote' && <QuotePage selected={selected} merchandiseKind={screen.merchandiseKind} navigate={navigate} />}
        {screen.kind === 'musicQuote' && <MusicQuotePage navigate={navigate} />}
      </main>
      <footer className="site-footer container">
        <span>© {new Date().getFullYear()} ISAK ODAIR</span>
        <span>CREATIVE SERVICES · MX</span>
      </footer>
    </div>
  );
}

function Action({ children, onClick, secondary = false }: { children: React.ReactNode; onClick: () => void; secondary?: boolean }) {
  return <button type="button" className={`action ${secondary ? 'action--secondary' : ''}`} onClick={onClick}>{children}<ArrowUpRight size={22} strokeWidth={2.4} aria-hidden /></button>;
}

function Home({ navigate }: { navigate: (screen: Screen) => void }) {
  return <div className="home">
    <section className="home-hero" aria-labelledby="home-title">
      <p className="eyebrow">INDEPENDENT CREATIVE · MX</p>
      <h1 id="home-title">TU IDEA.<br />HECHA<br /><em>REALIDAD.</em></h1>
      <h2>ESTRATEGIA, DISEÑO Y PRODUCCIÓN</h2>
      <p>Encuentra el servicio ideal y cuéntame qué proyecto quieres crear.</p>
    </section>
    <Action onClick={() => navigate({ kind: 'quote' })}>COTIZAR MI PROYECTO</Action>
    <section className="services" aria-labelledby="services-title">
      <div className="section-heading"><h2 id="services-title">ELIGE UN SERVICIO</h2><span>01 — 05</span></div>
      <div className="services-list">
        {services.map((service) => <button type="button" key={service.id} className="service-card" onClick={() => navigate({ kind: 'service', id: service.id })}>
          <span className="service-card__copy"><strong>{service.title}</strong><small>{service.short}</small></span>
          <ArrowUpRight size={24} strokeWidth={2.1} aria-hidden />
        </button>)}
      </div>
    </section>
    <SonyMusicProof navigate={navigate} />
    <section className="footer-question">
      <h2>¿UN PROYECTO QUE COMBINA SERVICIOS?</h2>
      <p>Podemos definir el alcance directamente por WhatsApp.</p>
      <Action onClick={() => navigate({ kind: 'quote' })}>HABLEMOS DE TU PROYECTO</Action>
    </section>
  </div>;
}


function SonyMusicProof({ navigate }: { navigate: (screen: Screen) => void }) {
  return <section className="sony-proof" aria-labelledby="sony-proof-title">
    <div className="sony-proof__hero">
      <div className="sony-proof__top">
        <span>PROYECTOS SELECCIONADOS</span>
        <span>THE HEAT / MUSIC</span>
      </div>
      <p className="sony-proof__eyebrow">ESTRATEGIA VISUAL · EDICIÓN AUDIOVISUAL</p>
      <h2 id="sony-proof-title">EL LANZAMIENTO<br />TAMBIÉN <em>SE VE.</em></h2>
      <p>Contenido audiovisual pensado para acompañar la identidad de cada artista y darle forma visual a sus lanzamientos.</p>
    </div>
    <div className="sony-proof__brandbar">
      <span>EXPERIENCIA EN PROYECTOS MUSICALES</span>
      <strong>SONY MUSIC</strong>
    </div>
    <div className="sony-proof__body">
      <div className="sony-proof__intro">
        <div>
          <p className="sony-proof__section-label">DETRÁS DE CADA RELEASE</p>
          <h3>PIEZAS QUE<br />CONECTAN CON<br />LA MÚSICA.</h3>
        </div>
        <p>Una selección de trabajos de video vertical desarrollados para proyectos musicales, desde piezas promocionales hasta contenido de prelanzamiento.</p>
      </div>
      <div className="sony-proof__grid">
        {sonyMusicProjects.map((project, index) => <article className="sony-project" key={project.title}>
          <div className="sony-project__media">
            <img src={project.image} alt={`Fotograma de ${project.title}, proyecto de ${project.artist}`} loading="lazy" />
            <span className="sony-project__index">0{index + 1}</span>
            <span className="sony-project__play" aria-hidden="true">▶</span>
          </div>
          <div className="sony-project__copy">
            <span>{project.artist}</span>
            <strong>{project.title}</strong>
            <small>{project.category}</small>
          </div>
        </article>)}
      </div>
      <div className="sony-proof__bottom">
        <p><strong>FORMATO VERTICAL · 9:16</strong><span>Edición y contenido para campañas musicales</span></p>
        <Action onClick={() => navigate({ kind: 'quote' })}>HABLEMOS DE TU PROYECTO</Action>
      </div>
    </div>
  </section>;
}

function ServicePage({ service, navigate }: { service: Service; navigate: (screen: Screen) => void }) {
  const [merchKind, setMerchKind] = useState<MerchKind>('custom');
  // Reset selections when navigating to another service.
  useEffect(() => setMerchKind('custom'), [service.id]);
  const beginQuote = (kind: MerchKind = merchKind) => navigate({ kind: 'quote', id: service.id, merchandiseKind: service.id === 'merchandise' ? kind : undefined });
  return <div className="detail">
    <button className="back-link" onClick={() => navigate({ kind: 'home' })}><ArrowLeft size={16} aria-hidden /> VOLVER A SERVICIOS</button>
    <p className="section-code">{service.number} / {service.title}</p>
    <section className="detail-hero" aria-labelledby="detail-title">
      <h1 id="detail-title"><span>{service.heroLines[0]}</span><em>{service.heroLines[1]}</em></h1>
      <h2>{service.eyebrow}</h2>
      <p>{service.description}</p>
    </section>
    <div className="chips" aria-label="Tipos de servicio">
      {service.categories.map((name) => <span className="chip" key={name}>{name}</span>)}
    </div>
    {service.id === 'merchandise' && <fieldset className="merch-choices">
      <legend>¿QUÉ TIPO DE MERCH NECESITAS?</legend>
      <div className="choice-grid">
        <button type="button" className={`choice ${merchKind === 'custom' ? 'choice--active' : ''}`} onClick={() => setMerchKind('custom')} aria-pressed={merchKind === 'custom'}>
          <strong>PARA MI MARCA</strong><span>Cotizar producción</span>{merchKind === 'custom' && <Check size={15} aria-hidden />}
        </button>
        <button type="button" className={`choice ${merchKind === 'quaids' ? 'choice--active' : ''}`} onClick={() => setMerchKind('quaids')} aria-pressed={merchKind === 'quaids'}>
          <strong>PRODUCTOS QUAIDS</strong><span>Consultar disponibilidad</span>{merchKind === 'quaids' && <Check size={15} aria-hidden />}
        </button>
      </div>
    </fieldset>}
    <Action onClick={() => beginQuote()}>{service.id === 'merchandise' && merchKind === 'quaids' ? 'CONSULTAR QUAIDS' : service.action}</Action>
    <section className="projects" aria-labelledby="projects-title">
      <h2 id="projects-title">TRABAJOS SELECCIONADOS</h2>
      <p>Una muestra rápida. Puedes contactar sin revisar la galería.</p>
      <div className="gallery">
        {service.examples.map((label, i) => <div className="project-placeholder" key={label} aria-label={`${label}: imágenes próximamente`}>
          <span className="project-number">0{i + 1}</span>
          <div><strong>{label}</strong><small>Imagen o video por agregar</small></div>
        </div>)}
      </div>
      <Action onClick={() => beginQuote()}>{service.id === 'merchandise' && merchKind === 'quaids' ? 'CONSULTAR PRODUCTOS QUAIDS' : 'SOLICITAR COTIZACIÓN'}</Action>
      <p className="endnote">{service.footer}</p>
    </section>
  </div>;
}

function QuotePage({ selected, merchandiseKind, navigate }: { selected?: Service; merchandiseKind?: MerchKind; navigate: (screen: Screen) => void }) {
  const [serviceId, setServiceId] = useState<string>(selected?.id ?? 'unsure');
  const [kind, setKind] = useState<MerchKind>(merchandiseKind ?? 'custom');
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [when, setWhen] = useState('Este mes');
  const [budget, setBudget] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { setServiceId(selected?.id ?? 'unsure'); setKind(merchandiseKind ?? 'custom'); }, [selected?.id, merchandiseKind]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || !goal.trim()) { setError('Por favor, escribe tu nombre y cuéntame brevemente qué necesitas.'); return; }
    if (name.trim().length > 100 || goal.trim().length > 1300 || budget.trim().length > 120) { setError('El texto es demasiado largo. Resume tu solicitud para continuar.'); return; }
    setError('');
    const chosen = getService(serviceId);
    const label = chosen?.title ?? 'Aún no lo sé / Varios servicios';
    const serviceLabel = chosen?.id === 'merchandise' ? `${label} — ${kind === 'quaids' ? 'Productos propios QUAIDS' : 'Merch personalizado para mi marca'}` : label;
    const url = whatsappUrl({ name, goal, service: serviceLabel, when, budget });
    // The click is a direct user action; no automatic messages or data uploads.
    window.location.assign(url);
  }

  return <div className="quote">
    <button className="back-link" onClick={() => selected ? navigate({ kind: 'service', id: selected.id }) : navigate({ kind: 'home' })}><ArrowLeft size={16} aria-hidden /> VOLVER {selected ? 'AL SERVICIO' : 'AL INICIO'}</button>
    <h1>HABLEMOS DE<br /><em>TU PROYECTO.</em></h1>
    <p className="quote-intro">Unos detalles y continuamos por WhatsApp.</p>
    <form onSubmit={handleSubmit} noValidate>
      <label className="form-label form-service-label" htmlFor="service-select">SERVICIO</label>
      <select id="service-select" className="form-input form-select" value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
        <option value="unsure">Aún no lo sé / Varios servicios</option>
        {services.map((service) => <option value={service.id} key={service.id}>{service.title}</option>)}
      </select>
      {serviceId === 'merchandise' && <fieldset className="merch-choices merch-choices--form">
        <legend>¿QUÉ TIPO DE MERCH NECESITAS?</legend>
        <div className="choice-grid">
          <button type="button" className={`choice ${kind === 'custom' ? 'choice--active' : ''}`} aria-pressed={kind === 'custom'} onClick={() => setKind('custom')}><strong>PARA MI MARCA</strong><span>Personalizado</span></button>
          <button type="button" className={`choice ${kind === 'quaids' ? 'choice--active' : ''}`} aria-pressed={kind === 'quaids'} onClick={() => setKind('quaids')}><strong>PRODUCTOS QUAIDS</strong><span>Comprar / consultar</span></button>
        </div>
      </fieldset>}
      <label className="form-label" htmlFor="client-name">01 / ¿CÓMO TE LLAMAS? <span>*</span></label>
      <input id="client-name" className="form-input" type="text" autoComplete="name" value={name} maxLength={100} placeholder="Tu nombre" onChange={(e) => setName(e.target.value)} required />
      <label className="form-label" htmlFor="client-goal">02 / CUÉNTAME TU IDEA <span>*</span></label>
      <textarea id="client-goal" className="form-input form-textarea" placeholder="¿Qué proyecto quieres crear?" value={goal} maxLength={1300} onChange={(e) => setGoal(e.target.value)} required rows={4} />
      <fieldset className="timing"><legend className="form-label">03 / ¿CUÁNDO QUIERES COMENZAR?</legend><div className="timing-grid">
        {['Este mes', 'Próximamente', 'No lo sé'].map((option) => <label className={`timing-choice ${when === option ? 'timing-choice--active' : ''}`} key={option}>
          <input type="radio" name="when" value={option} checked={when === option} onChange={() => setWhen(option)} />{option.toUpperCase()}
        </label>)}
      </div></fieldset>
      <label className="form-label" htmlFor="client-budget">04 / PRESUPUESTO (OPCIONAL)</label>
      <input id="client-budget" className="form-input" type="text" inputMode="text" value={budget} maxLength={120} placeholder="Rango aproximado o por definir" onChange={(e) => setBudget(e.target.value)} />
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="action action-submit" type="submit">CONTINUAR POR WHATSAPP <ArrowUpRight size={22} strokeWidth={2.4} aria-hidden /></button>
      <p className="privacy-note">Se abrirá WhatsApp con tu solicitud redactada para que puedas revisarla antes de enviarla. No se envía automáticamente.</p>
    </form>
  </div>;
}


type MusicTier = 'essential' | 'creative' | 'professional';
function MusicQuotePage({ navigate }: { navigate: (screen: Screen) => void }) {
  const [tier, setTier] = useState<MusicTier>('creative');
  const [quantity, setQuantity] = useState<12 | 16>(12);
  const tiers = {
    essential: { name: 'EDICIÓN ESENCIAL', unit: 300, detail: 'Cortes limpios, ritmo, música, formato vertical y ajustes básicos de imagen.', includes: ['Edición de material proporcionado', 'Duración final de 15–30 segundos', '1 ronda de ajustes por video', 'Exportación 9:16 lista para TikTok'] },
    creative: { name: 'EDICIÓN CREATIVA', unit: 700, detail: 'Edición con criterio creativo para convertir el material del grupo en piezas más atractivas y profesionales.', includes: ['Selección de momentos y construcción de hook', 'Ritmo, música y diseño sonoro', 'Subtítulos y tratamiento de color básico', 'Propuestas creativas para cada entrega', '1 ronda de ajustes por video'] },
    professional: { name: 'EDICIÓN PROFESIONAL', unit: 1200, detail: 'Mayor elaboración narrativa y visual para piezas prioritarias o lanzamientos especiales.', includes: ['Todo lo incluido en Edición Creativa', 'Edición narrativa y tratamiento visual avanzado', 'Diseño de textos y recursos gráficos personalizados', '2 rondas de ajustes por video'] },
  } as const;
  const chosen = tiers[tier];
  const subtotal = chosen.unit * quantity;
  const tax = Math.round(subtotal * 0.16);
  const total = subtotal + tax;
  const money = (n: number) => n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
  function contact() {
    const msg = [
      '¡Hola, Isak! Revisé la propuesta de edición TikTok para nuestro grupo musical.',
      '',
      'Paquete: ' + chosen.name,
      'Volumen: ' + quantity + ' videos por ciclo de 4 semanas',
      'Precio por video (sin IVA): ' + money(chosen.unit),
      'Subtotal: ' + money(subtotal),
      'IVA (16%): ' + money(tax),
      'Total: ' + money(total),
      '',
      'Me gustaría revisar los siguientes pasos y compartir referencias del grupo.'
    ].join('\n');
    window.location.assign('https://wa.me/524494685875?text=' + encodeURIComponent(msg));
  }
  return <div className="music-quote">
    <button className="back-link" onClick={() => navigate({ kind: 'home' })}><ArrowLeft size={16} aria-hidden /> VOLVER A ISAK ODAIR</button>
    <p className="section-code">THE HEAT / PROPUESTA 001</p>
    <section className="music-hero">
      <p className="eyebrow">EDICIÓN AUDIOVISUAL · TIKTOK</p>
      <h1>SU MÚSICA.<br /><em>EN MOVIMIENTO.</em></h1>
      <p>Contenido corto con intención creativa, ritmo e identidad profesional para conectar con nuevas audiencias.</p>
      <div className="music-meta"><span>15–30 SEGUNDOS</span><span>FORMATO 9:16</span><span>MATERIAL PROPORCIONADO</span></div>
    </section>
    <section className="music-section">
      <div className="section-heading"><h2>ELIGE EL ALCANCE</h2><span>01 — 03</span></div>
      <p className="music-muted">Tres niveles de edición según la elaboración creativa que necesiten sus videos.</p>
      <div className="music-tiers">
        {(['essential','creative','professional'] as MusicTier[]).map((key) => <button key={key} type="button" className={`music-tier ${tier === key ? 'music-tier--active' : ''}`} onClick={() => setTier(key)} aria-pressed={tier === key}>
          <span className="music-tier-top"><strong>{tiers[key].name}</strong>{tier === key && <Check size={17} aria-hidden />}</span>
          <span className="music-tier-price">{money(tiers[key].unit)} <small>/ VIDEO + IVA</small></span>
          <span className="music-tier-detail">{tiers[key].detail}</span>
        </button>)}
      </div>
      <div className="music-includes">
        <h3>QUÉ INCLUYE {chosen.name}</h3>
        <ul>{chosen.includes.map((item) => <li key={item}><Check size={15} aria-hidden />{item}</li>)}</ul>
      </div>
    </section>
    <section className="music-section music-volume">
      <div className="section-heading"><h2>VOLUMEN MENSUAL</h2><span>02 — 03</span></div>
      <p className="music-muted">Selecciona el ritmo de publicación para un ciclo de cuatro semanas.</p>
      <div className="music-quantity">
        <button type="button" className={quantity === 12 ? 'selected' : ''} onClick={() => setQuantity(12)}><strong>12 VIDEOS</strong><small>3 por semana</small></button>
        <button type="button" className={quantity === 16 ? 'selected' : ''} onClick={() => setQuantity(16)}><strong>16 VIDEOS</strong><small>4 por semana</small></button>
      </div>
      <div className="music-total">
        <div className="music-total-row"><span>{chosen.name} · {quantity} piezas</span><strong>{money(subtotal)}</strong></div>
        <div className="music-total-row"><span>IVA (16%)</span><strong>{money(tax)}</strong></div>
        <div className="music-total-final"><span>INVERSIÓN TOTAL / 4 SEMANAS</span><strong>{money(total)} <small>MXN</small></strong></div>
        <p>Precios expresados en MXN. El IVA se desglosa por separado.</p>
      </div>
      <button className="action action-submit" type="button" onClick={contact}>CONTINUAR POR WHATSAPP <ArrowUpRight size={22} aria-hidden /></button>
    </section>
    <section className="music-section">
      <div className="section-heading"><h2>FORMA DE TRABAJO</h2><span>03 — 03</span></div>
      <div className="music-process">
        <p><b>01 / MATERIAL</b><span>El grupo comparte videos originales, referencias y fechas importantes.</span></p>
        <p><b>02 / DIRECCIÓN CREATIVA</b><span>THE HEAT propone enfoques de edición respetando la identidad e imagen profesional del grupo.</span></p>
        <p><b>03 / EDICIÓN Y REVISIÓN</b><span>Se entrega una primera versión para comentarios dentro de las rondas incluidas.</span></p>
        <p><b>04 / ENTREGA</b><span>Videos verticales listos para publicar en TikTok.</span></p>
      </div>
      <div className="music-terms"><h3>CONSIDERACIONES</h3><ul>
        <li>La propuesta considera exclusivamente edición; grabación, traslados y producción en sitio no están incluidos.</li>
        <li>El grupo proporciona los archivos originales en calidad suficiente y confirma derechos de uso de música e imagen.</li>
        <li>El volumen corresponde a un ciclo de cuatro semanas; piezas adicionales se cotizan al precio unitario seleccionado.</li>
        <li>Animación avanzada, efectos complejos, búsqueda de material externo y cambios de concepto posteriores a la aprobación se cotizan por separado.</li>
        <li>La fecha de inicio y el calendario de entregas se acuerdan al aprobar la propuesta y recibir el material.</li>
      </ul></div>
    </section>
    <div className="music-close"><p>CONTENIDO CON IDENTIDAD.<br /><em>EDICIÓN CON INTENCIÓN.</em></p><button className="action" onClick={contact}>HABLEMOS DEL PROYECTO <ArrowUpRight size={22} aria-hidden /></button></div>
    <p className="music-validity">Propuesta orientativa sujeta a confirmación de estilo, complejidad del material y volumen definitivo. Vigencia: 15 días naturales desde su presentación.</p>
  </div>;
}

export default App;
