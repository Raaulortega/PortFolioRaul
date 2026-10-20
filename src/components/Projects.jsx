import { motion } from 'framer-motion';
import { ExternalLink, Github, Lock } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import CavexDiagram from './CavexDiagram';
import InnovatikVisual from './InnovatikVisual';
import LocalAuditVisual from './LocalAuditVisual';

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
  },
];

// ─── Components ──────────────────────────────────────────────────────────────

function PrivateBadge() {
  return (
    <span className="private-badge">
      <Lock size={10} /> Private — NDA
    </span>
  );
}

function FeaturedCard({ p, visible, i }) {
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
                  <ExternalLink size={14} /> Live site
                </a>
              )}
              {p.repo && (
                <a href={p.repo} target="_blank" rel="noreferrer" className="project-link">
                  <Github size={14} /> Source code
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
              <ExternalLink size={14} /> Live demo
            </a>
          )}
          {p.repo && p.repo !== '#' && (
            <a href={p.repo} target="_blank" rel="noreferrer" className="project-link">
              <Github size={14} /> Source code
            </a>
          )}
          {(!p.live || p.live === '#') && (!p.repo || p.repo === '#') && (
            <span className="project-link" style={{ cursor: 'default', opacity: 0.45 }}>
              <Lock size={14} /> Coming soon
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

export default function Projects() {
  const [ref, visible] = useReveal();

  return (
    <section id="projects">
      <div className="container" ref={ref}>
        <motion.div
          className="projects-header"
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="section-tag">featured work</div>
          <h2 className="section-title">
            Things I've{' '}
            <span className="gradient-text">built</span>
          </h2>
          <p className="section-subtitle">
            A selection of projects that showcase my skills in building modern,
            scalable web applications and systems end-to-end.
          </p>
        </motion.div>

        <div className="projects-grid">
          {projects.map((p, i) =>
            p.featured
              ? <FeaturedCard key={p.num} p={p} visible={visible} i={i} />
              : <RegularCard  key={p.num} p={p} visible={visible} i={i} />
          )}
        </div>
      </div>
    </section>
  );
}
