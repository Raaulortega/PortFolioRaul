import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useReveal } from '../hooks/useReveal';

const skillGroups = [
  {
    title: 'Frontend',
    color: '#00f5ff',
    skills: [
      { name: 'React / Next.js', level: 88 },
      { name: 'JavaScript / TypeScript', level: 85 },
      { name: 'CSS / Tailwind CSS', level: 82 },
      { name: 'HTML5 / Accessibility', level: 90 },
    ],
  },
  {
    title: 'Backend',
    color: '#8b5cf6',
    skills: [
      { name: 'Java / Spring Boot', level: 95 },
      { name: 'Python / FastAPI', level: 90 },
      { name: 'Node.js / Express', level: 80 },
      { name: 'REST API Design', level: 85 },
    ],
  },
  {
    title: 'Tools & Infrastructure',
    color: '#00ff88',
    skills: [
      { name: 'Git / GitHub', level: 88 },
      { name: 'SQL / PostgreSQL', level: 75 },
      { name: 'Docker', level: 75 },
      { name: 'Firebase / MongoDB', level: 72 },
    ],
  },
  {
    title: 'Cybersecurity',
    color: '#f472b6',
    skills: [
      { name: 'Attack Mitigation & Hardening', level: 88 },
      { name: 'Penetration Testing', level: 82 },
      { name: 'OWASP / Vulnerability Analysis', level: 85 },
      { name: 'Network Security', level: 80 },
    ],
  },
];

function SkillBar({ name, level, color, delay }) {
  const [w, setW] = useState(0);
  const trackRef = useRef(null);

  useEffect(() => {
    let triggered = false;
    let obs;

    const trigger = () => {
      if (triggered) return;
      triggered = true;
      setTimeout(() => setW(level), delay * 1000);
    };

    // Wait 150ms so the browser paints width:0 before we observe
    const t = setTimeout(() => {
      obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { trigger(); obs.disconnect(); } },
        { threshold: 0, rootMargin: '0px' }
      );
      if (trackRef.current) obs.observe(trackRef.current);
    }, 150);

    return () => { clearTimeout(t); obs?.disconnect(); };
  }, [level, delay]);

  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:7 }}>
        <span style={{ fontSize:'0.85rem', color:'var(--text-primary)', fontFamily:'JetBrains Mono' }}>
          {name}
        </span>
        <span style={{ fontSize:'0.75rem', color:'var(--text-secondary)', fontFamily:'JetBrains Mono' }}>
          {level}%
        </span>
      </div>
      <div ref={trackRef} style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.07)' }}>
        <div style={{
          height: '100%', borderRadius: 3,
          background: `linear-gradient(90deg, ${color}, ${color}88)`,
          boxShadow: `0 0 8px ${color}55`,
          width: `${w}%`,
          transition: `width 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
        }} />
      </div>
    </div>
  );
}

/* Each card observes itself — fires when that card enters the viewport */
function SkillCard({ group, gi }) {
  const [ref, visible] = useReveal(0.3);

  return (
    <motion.div
      ref={ref}
      className="glass"
      style={{ padding:'28px 26px', borderRadius:16 }}
      initial={{ opacity:0, y:30 }}
      animate={visible ? { opacity:1, y:0 } : {}}
      transition={{ duration:0.6 }}
    >
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:26 }}>
        <div style={{
          width:8, height:8, borderRadius:'50%',
          background: group.color,
          boxShadow:`0 0 10px ${group.color}`,
        }} />
        <span style={{
          fontFamily:'JetBrains Mono', fontSize:'0.78rem',
          textTransform:'uppercase', letterSpacing:'0.12em',
          color: group.color,
        }}>
          {group.title}
        </span>
      </div>
      {group.skills.map((skill, si) => (
        <SkillBar
          key={skill.name}
          {...skill}
          color={group.color}
          visible={visible}
          delay={si * 0.1}
        />
      ))}
    </motion.div>
  );
}

export default function Skills() {
  const [headerRef, headerVisible] = useReveal(0.2);

  return (
    <section id="skills" style={{ background:'var(--bg-secondary)' }}>
      <div className="container">
        <motion.div
          ref={headerRef}
          initial={{ opacity:0, y:30 }}
          animate={headerVisible ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.7 }}
          style={{ marginBottom:60 }}
        >
          <div className="section-tag">expertise</div>
          <h2 className="section-title">
            Skills &amp;{' '}
            <span className="gradient-text">technologies</span>
          </h2>
          <p className="section-subtitle">
            A breakdown of the technologies I work with regularly and
            my proficiency in each area.
          </p>
        </motion.div>

        <div className="skills-grid" style={{
          display:'grid',
          gridTemplateColumns:'repeat(2, 1fr)',
          gap:24,
        }}>
          {skillGroups.map((group, gi) => (
            <SkillCard key={group.title} group={group} gi={gi} />
          ))}
        </div>

        {/* Bottom pills */}
        <div style={{ marginTop:50, textAlign:'center' }}>
          <p style={{
            fontFamily:'JetBrains Mono', fontSize:'0.72rem',
            color:'var(--text-secondary)', textTransform:'uppercase',
            letterSpacing:'0.15em', marginBottom:20,
          }}>
            // also familiar with
          </p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:10, justifyContent:'center' }}>
            {['Algorithms', 'Data Structures', 'Design Patterns', 'CI/CD', 'Agile', 'TDD',
              'Responsive Design', 'Web Performance', 'SEO Basics', 'Linux'].map(c => (
              <span key={c} style={{
                fontFamily:'JetBrains Mono', fontSize:'0.72rem',
                padding:'6px 14px', borderRadius:6,
                border:'1px solid var(--border)', color:'var(--text-secondary)',
                background:'var(--bg-card)', transition:'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(0,245,255,0.3)';
                e.currentTarget.style.color = 'var(--accent-cyan)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
