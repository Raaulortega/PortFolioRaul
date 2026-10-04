import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useReveal } from '../hooks/useReveal';

const skillGroups = [
  {
    title: 'Frontend',
    color: '#1f6fb2',
    skills: [
      { name: 'React / Next.js', level: 88 },
      { name: 'JavaScript / TypeScript', level: 85 },
      { name: 'CSS / Tailwind CSS', level: 82 },
      { name: 'HTML5 / Accessibility', level: 90 },
    ],
  },
  {
    title: 'Backend',
    color: '#2f7d46',
    skills: [
      { name: 'Java / Spring Boot', level: 95 },
      { name: 'Python / FastAPI', level: 90 },
      { name: 'Node.js / Express', level: 80 },
      { name: 'REST API Design', level: 85 },
    ],
  },
  {
    title: 'Tools & Infrastructure',
    color: '#a5630a',
    skills: [
      { name: 'Git / GitHub', level: 88 },
      { name: 'SQL / PostgreSQL', level: 75 },
      { name: 'Docker', level: 75 },
      { name: 'Firebase / MongoDB', level: 72 },
    ],
  },
  {
    title: 'Cybersecurity',
    color: '#c4472a',
    skills: [
      { name: 'Attack Mitigation & Hardening', level: 88 },
      { name: 'Penetration Testing', level: 82 },
      { name: 'OWASP / Vulnerability Analysis', level: 85 },
      { name: 'Network Security', level: 80 },
    ],
  },
];

const alsoFamiliar = ['Algorithms', 'Data Structures', 'Design Patterns', 'CI/CD', 'Agile', 'TDD',
  'Responsive Design', 'Web Performance', 'SEO Basics', 'Linux'];

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
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
        <span style={{ fontSize:'0.86rem', color:'var(--ink)', fontWeight:500 }}>
          {name}
        </span>
        <span style={{ fontSize:'0.76rem', color:'var(--ink-muted)', fontFamily:'var(--font-mono)' }}>
          {level}%
        </span>
      </div>
      <div ref={trackRef} className="skill-track">
        <div style={{
          height: '100%', borderRadius: 3,
          background: `linear-gradient(90deg, ${color}, ${color}aa)`,
          boxShadow: `0 2px 8px ${color}40`,
          width: `${w}%`,
          transition: `width 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
        }} />
      </div>
    </div>
  );
}

/* Each card observes itself — fires when that card enters the viewport */
function SkillCard({ group }) {
  const [ref, visible] = useReveal(0.3);

  return (
    <motion.div
      ref={ref}
      className="skill-card"
      initial={{ opacity:0, y:30 }}
      animate={visible ? { opacity:1, y:0 } : {}}
      transition={{ duration:0.6 }}
    >
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:26 }}>
        <div style={{
          width:10, height:10, borderRadius:'50%',
          background: group.color,
          boxShadow:`0 0 0 4px ${group.color}22`,
        }} />
        <span style={{
          fontFamily:'var(--font-mono)', fontSize:'0.78rem', fontWeight:500,
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
          delay={si * 0.1}
        />
      ))}
    </motion.div>
  );
}

export default function Skills() {
  const [headerRef, headerVisible] = useReveal(0.2);

  return (
    <section id="skills" className="section-alt">
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

        <div className="skills-grid">
          {skillGroups.map((group) => (
            <SkillCard key={group.title} group={group} />
          ))}
        </div>

        {/* Bottom pills */}
        <div style={{ marginTop:50, textAlign:'center' }}>
          <p style={{
            fontFamily:'var(--font-mono)', fontSize:'0.72rem',
            color:'var(--ink-muted)', textTransform:'uppercase',
            letterSpacing:'0.15em', marginBottom:20,
          }}>
            // also familiar with
          </p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:10, justifyContent:'center' }}>
            {alsoFamiliar.map(c => (
              <span key={c} className="pill">{c}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
