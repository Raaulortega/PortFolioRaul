import { motion } from 'framer-motion';
import { ExternalLink, Github, Lock } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import CavexDiagram from './CavexDiagram';
import InnovatikVisual from './InnovatikVisual';
import LocalAuditVisual from './LocalAuditVisual';
import { useCopy, useLang } from '../i18n/lang';

// ─── Data ────────────────────────────────────────────────────────────────────

const projects = [
  {
    num: '01',
    title: 'CAVEX_V2 — Calar Alto Observatory',
    shortTitle: 'CAVEX_V2',
    desc: `Renovation of the atmospheric extinction monitoring system at Calar Alto Observatory (Almería).
The previous system lacked maintainability and modern integration support, so the observatory
commissioned a full rebuild around a microservices architecture.

I designed and developed cavex_imager — the core camera control service — responsible for
operating a QHY600 astronomical camera via the INDIGO bus, executing single and scheduled
image sequences, streaming real-time telemetry over WebSocket at 1–2 Hz, and coordinating
storage of FITS scientific images. The service includes a priority-based lease system for safe
concurrent access and structured JSON logging for production observability.`,
    tags: ['Python 3.11', 'FastAPI', 'Docker', 'INDIGO Astronomy', 'WebSockets', 'Microservices', 'FITS'],
    isPrivate: true,
    accent: '#1f6fb2',
    featured: true,
    visual: <CavexDiagram />,
    // Replace visual with the line below once you have a screenshot:
    // image: '/projects/cavex-screenshot.png',
    es: {
      title: 'CAVEX_V2 — Observatorio de Calar Alto',
      desc: `Renovación del sistema de monitorización de extinción atmosférica del Observatorio de Calar Alto (Almería). El sistema anterior era difícil de mantener y no admitía integraciones modernas, así que el observatorio encargó reconstruirlo por completo sobre una arquitectura de microservicios.

Diseñé y desarrollé cavex_imager — el servicio central de control de la cámara —, que opera una cámara astronómica QHY600 a través del bus INDIGO, ejecuta secuencias de imágenes únicas y programadas, emite telemetría en tiempo real por WebSocket a 1–2 Hz y coordina el almacenamiento de imágenes científicas FITS. El servicio incluye un sistema de reservas por prioridad para un acceso concurrente seguro y logs JSON estructurados para la observabilidad en producción.`,
      tags: ['Python 3.11', 'FastAPI', 'Docker', 'INDIGO Astronomy', 'WebSockets', 'Microservicios', 'FITS'],
    },
  },
  {
    num: '02',
    title: 'Innovatik',
    shortTitle: 'Innovatik',
    desc: `Business website designed and built from scratch, offering two core service lines: custom web development for companies looking to scale, and AI-powered automation to reduce costs and optimise operations.

Fully designed and developed end-to-end — from UI/UX concept to production deployment — with a conversion-focused layout, smooth interactions, and a fully responsive design across all devices.`,
    tags: ['SvelteKit', 'UI/UX Design', 'Responsive Design', 'AI Automation', 'Web Development'],
    live: 'https://www.innovatik.pro/',
    accent: '#6a4cc0',
    featured: true,
    visual: <InnovatikVisual />,
    es: {
      desc: `Web corporativa diseñada y desarrollada desde cero para dos líneas de servicio: desarrollo web a medida para empresas que quieren crecer y automatización con IA para reducir costes y optimizar procesos.

Diseñada y desarrollada de principio a fin — desde el concepto UI/UX hasta el despliegue en producción — con una maquetación orientada a la conversión, interacciones fluidas y un diseño totalmente responsive en todos los dispositivos.`,
      tags: ['SvelteKit', 'Diseño UI/UX', 'Diseño responsive', 'Automatización con IA', 'Desarrollo web'],
    },
  },
  {
    num: '03',
    title: 'LocalAudit — Browser-Based Security Toolkit',
    shortTitle: 'LocalAudit',
    desc: `Free cybersecurity toolkit for developers that runs 100% in the browser, with no backend. Files, secrets and tokens never leave the user's machine — a security tool that uploads your configs would create the very risk it is meant to prevent. Available in English and Spanish, no sign-up, and it even works offline once loaded.

It audits Dockerfile, docker-compose, nginx, .env, package.json and vercel.json against 77 rules mapped to CWE and OWASP, giving a 0–100 score, line-level findings and ready-to-copy fixes, with SARIF 2.1.0 export for GitHub code scanning. It also includes a secrets scanner with redaction, a JWT inspector with weak-secret detection, an HTTP security headers generator and a password-cracking lab. The site itself ships a strict CSP, HSTS preload and no third-party tracking, and is covered by 67 Vitest tests plus end-to-end checks.`,
    tags: ['TypeScript', 'Application Security', 'CWE / OWASP', 'SARIF', 'Vitest', 'Privacy by Design', 'i18n', 'Vercel'],
    live: 'https://localaudit.dev/',
    repo: 'https://github.com/Raaulortega/Audit',
    accent: '#0f8a5f',
    featured: true,
    visual: <LocalAuditVisual />,
    es: {
      title: 'LocalAudit — Herramientas de seguridad en el navegador',
      desc: `Caja de herramientas de ciberseguridad gratuita para desarrolladores que funciona 100 % en el navegador, sin backend. Los ficheros, secretos y tokens nunca salen del ordenador del usuario: una herramienta de seguridad que sube tus configuraciones crearía justo el riesgo que pretende evitar. Está en inglés y español, no pide registro y funciona incluso sin conexión una vez cargada.

Audita Dockerfile, docker-compose, nginx, .env, package.json y vercel.json con 77 reglas mapeadas a CWE y OWASP, y da una puntuación de 0 a 100, hallazgos por línea y parches listos para copiar, con exportación SARIF 2.1.0 para GitHub code scanning. Incluye además un escáner de secretos que los oculta, un inspector JWT que detecta secretos débiles, un generador de cabeceras de seguridad HTTP y un laboratorio de contraseñas. La propia web usa una CSP estricta, HSTS con preload y nada de rastreo de terceros, y está cubierta por 67 tests con Vitest y pruebas end-to-end.`,
      tags: ['TypeScript', 'Seguridad de aplicaciones', 'CWE / OWASP', 'SARIF', 'Vitest', 'Privacidad por diseño', 'i18n', 'Vercel'],
    },
  },
  {
    num: '04',
    title: 'This Portfolio — 3D Scroll Journey',
    shortTitle: 'Portfolio',
    desc: `The site you are on right now. Instead of a classic landing page, the visitor scrolls down from above the clouds into a sunlit valley, and each stage of the descent reveals a part of my story — who I am, what I do and where I want to work.

The 3D world is built with Three.js and React Three Fiber: a procedurally generated low-poly landscape with custom noise, volumetric-looking clouds and a scroll-driven camera path, lazy-loaded so the rest of the page stays fast. The sections around it use Framer Motion for reveal animations, and the whole site ships with a strict Content-Security-Policy, Open Graph previews, structured data and a sitemap for SEO.`,
    tags: ['React 19', 'Three.js', 'React Three Fiber', 'Framer Motion', 'Vite', 'WebGL', 'SEO', 'Vercel'],
    live: 'https://iamraul.pro/',
    repo: 'https://github.com/Raaulortega/PortFolioRaul',
    accent: '#2f7d46',
    featured: true,
    image: '/og-image-2026.png',
    es: {
      title: 'Este portfolio — Viaje 3D con scroll',
      desc: `La web en la que estás ahora mismo. En lugar de una landing clásica, el visitante desciende con el scroll desde encima de las nubes hasta un valle soleado, y cada tramo del descenso cuenta una parte de mi historia: quién soy, a qué me dedico y dónde quiero trabajar.

El mundo 3D está hecho con Three.js y React Three Fiber: un paisaje low-poly generado proceduralmente con ruido propio, nubes con aspecto volumétrico y una cámara guiada por el scroll, cargado de forma diferida para que el resto de la página siga siendo rápida. Las secciones de alrededor usan Framer Motion para las animaciones, y toda la web incluye una Content-Security-Policy estricta, previsualizaciones Open Graph, datos estructurados, sitemap y versión en inglés y español.`,
      live: 'https://iamraul.pro/es',
    },
  },
];

const COPY = {
  en: {
    tag: 'featured work',
    title: ["Things I've ", 'built'],
    subtitle: 'A selection of projects that showcase my skills in building modern, scalable web applications and systems end-to-end.',
    private: 'Private — NDA',
    liveSite: 'Live site',
    liveDemo: 'Live demo',
    source: 'Source code',
    comingSoon: 'Coming soon',
  },
  es: {
    tag: 'proyectos destacados',
    title: ['Cosas que he ', 'construido'],
    subtitle: 'Una selección de proyectos que muestran cómo diseño y construyo aplicaciones web y sistemas modernos y escalables de principio a fin.',
    private: 'Privado — NDA',
    liveSite: 'Ver web',
    liveDemo: 'Ver demo',
    source: 'Código fuente',
    comingSoon: 'Próximamente',
  },
};

// ─── Components ──────────────────────────────────────────────────────────────

function PrivateBadge() {
  const t = useCopy(COPY);
  return (
    <span className="private-badge">
      <Lock size={10} /> {t.private}
    </span>
  );
}

function FeaturedCard({ p, visible, i }) {
  const t = useCopy(COPY);
  return (
    <motion.div
      className="project-card"
      style={{ gridColumn: '1 / -1' }}
      initial={{ opacity: 0, y: 40 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.1 + i * 0.1, duration: 0.6 }}
    >
      <div className="project-card-accent" />
      <div className="featured-card-inner">
        {/* Left: text */}
        <div className="featured-card-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div className="project-number" style={{ margin: 0 }}>// {p.num}</div>
            {p.isPrivate && <PrivateBadge />}
          </div>

          <h3 className="project-title" style={{ fontSize: '1.4rem', marginBottom: 12 }}>
            {p.title}
          </h3>

          {/* Multi-paragraph description */}
          {p.desc.trim().split('\n\n').map((para, idx) => (
            <p key={idx} className="project-desc" style={{ marginBottom: idx < 1 ? 12 : 0 }}>
              {para.trim()}
            </p>
          ))}

          <div className="project-tags" style={{ marginTop: 20 }}>
            {p.tags.map(t => (
              <span
                key={t}
                className="tag"
                style={{
                  background: `${p.accent}11`,
                  color: p.accent,
                  borderColor: `${p.accent}28`,
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {(p.live || p.repo) && (
            <div className="project-links" style={{ marginTop: 20 }}>
              {p.live && (
                <a href={p.live} target="_blank" rel="noreferrer" className="project-link">
                  <ExternalLink size={14} /> {t.liveSite}
                </a>
              )}
              {p.repo && (
                <a href={p.repo} target="_blank" rel="noreferrer" className="project-link">
                  <Github size={14} /> {t.source}
                </a>
              )}
            </div>
          )}
        </div>

        {/* Right: visual / image */}
        <div className="featured-card-visual">
          {p.image
            ? (
              <img
                src={p.image}
                alt={p.shortTitle}
                loading="lazy"
                style={{
                  width: '100%', borderRadius: 12, objectFit: 'cover',
                  boxShadow: 'var(--shadow-md)',
                  border: `1px solid ${p.accent}29`,
                }}
              />
            )
            : p.visual
          }
        </div>
      </div>
    </motion.div>
  );
}

function RegularCard({ p, visible, i }) {
  const t = useCopy(COPY);
  return (
    <motion.div
      className="project-card"
      initial={{ opacity: 0, y: 40 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.1 + i * 0.1, duration: 0.6 }}
    >
      <div className="project-card-accent" />
      <div className="project-card-inner">
        <div className="project-number">// {p.num}</div>
        <h3 className="project-title">{p.title}</h3>
        <p className="project-desc">{p.desc}</p>
        <div className="project-tags">
          {p.tags.map(t => (
            <span
              key={t}
              className="tag"
              style={{
                background: `${p.accent}11`,
                color: p.accent,
                borderColor: `${p.accent}28`,
              }}
            >
              {t}
            </span>
          ))}
        </div>
        <div className="project-links">
          {p.live && p.live !== '#' && (
            <a href={p.live} target="_blank" rel="noreferrer" className="project-link">
              <ExternalLink size={14} /> {t.liveDemo}
            </a>
          )}
          {p.repo && p.repo !== '#' && (
            <a href={p.repo} target="_blank" rel="noreferrer" className="project-link">
              <Github size={14} /> {t.source}
            </a>
          )}
          {(!p.live || p.live === '#') && (!p.repo || p.repo === '#') && (
            <span className="project-link" style={{ cursor: 'default', opacity: 0.45 }}>
              <Lock size={14} /> {t.comingSoon}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

export default function Projects() {
  const lang = useLang();
  const t = useCopy(COPY);
  const [ref, visible] = useReveal();
  // Each project lists its Spanish overrides (title, desc, tags, links) under `es`.
  const localized = projects.map(p => (p[lang] ? { ...p, ...p[lang] } : p));

  return (
    <section id="projects">
      <div className="container" ref={ref}>
        <motion.div
          className="projects-header"
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="section-tag">{t.tag}</div>
          <h2 className="section-title">
            {t.title[0]}
            <span className="gradient-text">{t.title[1]}</span>
          </h2>
          <p className="section-subtitle">{t.subtitle}</p>
        </motion.div>

        <div className="projects-grid">
          {localized.map((p, i) =>
            p.featured
              ? <FeaturedCard key={p.num} p={p} visible={visible} i={i} />
              : <RegularCard  key={p.num} p={p} visible={visible} i={i} />
          )}
        </div>
      </div>
    </section>
  );
}
