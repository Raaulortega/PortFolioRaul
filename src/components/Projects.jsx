import { motion } from 'framer-motion';
import { ExternalLink, Github, Lock } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import CavexDiagram from './CavexDiagram';
import InnovatikVisual from './InnovatikVisual';

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
    accent: 'var(--accent-cyan)',
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
    accent: 'var(--accent-purple)',
    featured: true,
    visual: <InnovatikVisual />,
  },
];

// ─── Components ──────────────────────────────────────────────────────────────

function PrivateBadge() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 4,
      background: 'rgba(244,114,182,0.08)',
      border: '1px solid rgba(244,114,182,0.2)',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '0.68rem', color: '#f472b6',
    }}>
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

          {p.live && (
            <div className="project-links" style={{ marginTop: 20 }}>
              <a href={p.live} target="_blank" rel="noreferrer" className="project-link">
                <ExternalLink size={14} /> Live site
              </a>
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
                style={{ width: '100%', borderRadius: 10, objectFit: 'cover' }}
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
