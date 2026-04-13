import { motion } from 'framer-motion';
import { useReveal } from '../hooks/useReveal';

const techs = [
  { icon: '⚛️', label: 'React' },
  { icon: '🟨', label: 'JavaScript' },
  { icon: '🔷', label: 'TypeScript' },
  { icon: '🟢', label: 'Node.js' },
  { icon: '🐍', label: 'Python' },
  { icon: '☕', label: 'Java' },
  { icon: '🎨', label: 'CSS / Tailwind' },
  { icon: '🗄️', label: 'SQL' },
  { icon: '🐙', label: 'Git' },
  { icon: '🐳', label: 'Docker' },
  { icon: '🔥', label: 'Firebase' },
  { icon: '🌐', label: 'REST APIs' },
];

const stats = [
  { number: '22', label: 'Years old' },
  { number: '4+', label: 'Projects built' },
  { number: '∞', label: 'Curiosity level' },
  { number: '100%', label: 'Committed' },
];

export default function About() {
  const [ref, visible] = useReveal();

  return (
    <section id="about" style={{ background:'var(--bg-secondary)' }}>
      <div className="container" ref={ref}>
        <motion.div
          initial={{ opacity:0, y:30 }}
          animate={visible ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.7 }}
        >
          <div className="section-tag">about me</div>
          <h2 className="section-title">
            Who I am &amp;{' '}
            <span className="gradient-text">what I do</span>
          </h2>
        </motion.div>

        <div className="about-grid" style={{ marginTop:60 }}>
          {/* Left: text + stats */}
          <motion.div
            className="about-text"
            initial={{ opacity:0, x:-30 }}
            animate={visible ? { opacity:1, x:0 } : {}}
            transition={{ duration:0.7, delay:0.15 }}
          >
            <p>
              Hey! I'm <strong>Raúl Ortega Pérez</strong>, a 22-year-old <strong>Computer Engineering
              graduate</strong> from the <strong>University of Almería (UAL), Spain</strong>. I'm
              passionate about turning complex problems into elegant, user-friendly software.
            </p>
            <p>
              I love building <strong>full-stack web applications</strong> — from crafting pixel-perfect
              UIs to designing efficient backend architectures. My goal is always clean,
              maintainable code that scales. I'm actively <strong>open to opportunities across
              Europe</strong>, including Denmark, Sweden, Norway, Germany and the Netherlands —
              both on-site and remote.
            </p>
            <p>
              I also have advanced knowledge in <strong>cybersecurity</strong> — including
              attack mitigation, penetration testing, and secure software design — which means
              I don't just build things that work, I build things that are hard to break.
            </p>

            <div className="about-stats">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  className="stat-card glass"
                  initial={{ opacity:0, y:20 }}
                  animate={visible ? { opacity:1, y:0 } : {}}
                  transition={{ delay: 0.3 + i*0.08, duration:0.5 }}
                  style={{ borderRadius:12 }}
                >
                  <div className="stat-number gradient-text">{s.number}</div>
                  <div className="stat-label">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: tech grid */}
          <motion.div
            className="about-skills-col"
            initial={{ opacity:0, x:30 }}
            animate={visible ? { opacity:1, x:0 } : {}}
            transition={{ duration:0.7, delay:0.2 }}
          >
            <h3>// tech stack</h3>
            <div className="tech-grid">
              {techs.map((t, i) => (
                <motion.div
                  key={t.label}
                  className="tech-item"
                  initial={{ opacity:0, scale:0.8 }}
                  animate={visible ? { opacity:1, scale:1 } : {}}
                  transition={{ delay: 0.3 + i*0.05 }}
                >
                  <span className="tech-icon">{t.icon}</span>
                  {t.label}
                </motion.div>
              ))}
            </div>

            {/* Education card */}
            <motion.div
              className="glass"
              style={{ marginTop:20, padding:'20px 22px', borderRadius:14 }}
              initial={{ opacity:0, y:20 }}
              animate={visible ? { opacity:1, y:0 } : {}}
              transition={{ delay:0.6 }}
            >
              <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
                <div style={{
                  width:44, height:44, borderRadius:10, flexShrink:0,
                  background:'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'1.3rem',
                }}>🎓</div>
                <div>
                  <p style={{ fontWeight:700, fontSize:'0.95rem', color:'var(--text-primary)', marginBottom:4 }}>
                    Computer Engineering
                  </p>
                  <p style={{ fontSize:'0.82rem', color:'var(--text-secondary)' }}>
                    Universidad de Almería (UAL) · 2022 – 2026
                  </p>
                  <div style={{
                    marginTop:8, display:'inline-block',
                    padding:'3px 10px', borderRadius:4,
                    background:'rgba(0,255,136,0.08)',
                    border:'1px solid rgba(0,255,136,0.2)',
                    fontSize:'0.72rem', fontFamily:'JetBrains Mono',
                    color:'var(--accent-green)',
                  }}>
                    Bachelor's Degree
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
