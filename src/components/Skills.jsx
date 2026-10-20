import { motion } from 'framer-motion';
import { Monitor, Server, Wrench, ShieldCheck, Check } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import { useCopy } from '../i18n/lang';

// Proficiency is shown as a tier instead of a percentage, so nothing reads as
// "half known". Within each group skills are listed strongest tier first.
const COPY = {
  en: {
    tiers: { expert: 'Expert', advanced: 'Advanced', proficient: 'Proficient' },
    groups: {
      frontend: 'Frontend',
      backend: 'Backend',
      tools: 'Tools & Infrastructure',
      security: 'Cybersecurity',
    },
    tag: 'expertise',
    title: ['Skills & ', 'technologies'],
    subtitle: 'A breakdown of the technologies I work with regularly and my proficiency in each area.',
    alsoFamiliar: '// also familiar with',
    familiar: ['Algorithms', 'Data Structures', 'Design Patterns', 'CI/CD', 'Agile', 'TDD',
      'Responsive Design', 'Web Performance', 'SEO Basics', 'Linux'],
    skillNames: {},
  },
  es: {
    tiers: { expert: 'Experto', advanced: 'Avanzado', proficient: 'Competente' },
    groups: {
      frontend: 'Frontend',
      backend: 'Backend',
      tools: 'Herramientas e infraestructura',
      security: 'Ciberseguridad',
    },
    tag: 'experiencia',
    title: ['Habilidades y ', 'tecnologías'],
    subtitle: 'Las tecnologías con las que trabajo habitualmente y mi nivel en cada área.',
    alsoFamiliar: '// también trabajo con',
    familiar: ['Algoritmos', 'Estructuras de datos', 'Patrones de diseño', 'CI/CD', 'Agile', 'TDD',
      'Diseño responsive', 'Rendimiento web', 'SEO básico', 'Linux'],
    // Only names that are phrases need translating; technology names stay as they are.
    skillNames: {
      'HTML5 / Accessibility': 'HTML5 / Accesibilidad',
      'REST API Design': 'Diseño de APIs REST',
      'Attack Mitigation & Hardening': 'Mitigación de ataques y hardening',
      'Penetration Testing': 'Pruebas de penetración',
      'OWASP / Vulnerability Analysis': 'OWASP / Análisis de vulnerabilidades',
      'Network Security': 'Seguridad de redes',
    },
  },
};
const TIER_ORDER = { expert: 0, advanced: 1, proficient: 2 };

// Stable sort: skills with the same tier keep their declared order.
const byTier = (skills) => [...skills].sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier]);

const skillGroups = [
  {
    id: 'frontend',
    color: '#1f6fb2',
    icon: Monitor,
    skills: [
      { name: 'React / Next.js', tier: 'expert' },
      { name: 'JavaScript / TypeScript', tier: 'advanced' },
      { name: 'CSS / Tailwind CSS', tier: 'proficient' },
      { name: 'HTML5 / Accessibility', tier: 'expert' },
    ],
  },
  {
    id: 'backend',
    color: '#2f7d46',
    icon: Server,
    skills: [
      { name: 'Java / Spring Boot', tier: 'expert' },
      { name: 'Python / FastAPI', tier: 'expert' },
      { name: 'Node.js / Express', tier: 'expert' },
      { name: 'REST API Design', tier: 'advanced' },
    ],
  },
  {
    id: 'tools',
    color: '#a5630a',
    icon: Wrench,
    skills: [
      { name: 'Git / GitHub', tier: 'advanced' },
      { name: 'SQL / PostgreSQL', tier: 'advanced' },
      { name: 'Docker', tier: 'proficient' },
      { name: 'Firebase / MongoDB', tier: 'proficient' },
    ],
  },
  {
    id: 'security',
    color: '#c4472a',
    icon: ShieldCheck,
    skills: [
      { name: 'Attack Mitigation & Hardening', tier: 'advanced' },
      { name: 'Penetration Testing', tier: 'advanced' },
      { name: 'OWASP / Vulnerability Analysis', tier: 'advanced' },
      { name: 'Network Security', tier: 'proficient' },
    ],
  },
];

function TierBadge({ tier, color }) {
  const { tiers } = useCopy(COPY);
  return (
    <span className={`tier tier--${tier}`} style={{ '--tier-color': color }}>
      {tier === 'expert' && <span className="tier-spark" aria-hidden="true">✦</span>}
      {tiers[tier]}
    </span>
  );
}

/* Each card observes itself — fires when that card enters the viewport */
function SkillCard({ group }) {
  const { groups, skillNames } = useCopy(COPY);
  const [ref, visible] = useReveal(0.3);
  const Icon = group.icon;

  return (
    <motion.div
      ref={ref}
      className="skill-card"
      style={{ '--group-color': group.color }}
      initial={{ opacity: 0, y: 30 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <div className="skill-card-head">
        <div className="skill-card-icon"><Icon size={20} /></div>
        <h3 className="skill-card-title">{groups[group.id]}</h3>
      </div>

      <ul className="skill-list">
        {byTier(group.skills).map((skill, si) => (
          <motion.li
            key={skill.name}
            className="skill-row"
            initial={{ opacity: 0, x: -12 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15 + si * 0.08, duration: 0.45 }}
          >
            <span className="skill-check" aria-hidden="true"><Check size={13} strokeWidth={3} /></span>
            <span className="skill-name">{skillNames[skill.name] ?? skill.name}</span>
            <TierBadge tier={skill.tier} color={group.color} />
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function Skills() {
  const t = useCopy(COPY);
  const [headerRef, headerVisible] = useReveal(0.2);

  return (
    <section id="skills" className="section-alt">
      <div className="container">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 60 }}
        >
          <div className="section-tag">{t.tag}</div>
          <h2 className="section-title">
            {t.title[0]}
            <span className="gradient-text">{t.title[1]}</span>
          </h2>
          <p className="section-subtitle">{t.subtitle}</p>
        </motion.div>

        <div className="skills-grid">
          {skillGroups.map((group) => (
            <SkillCard key={group.id} group={group} />
          ))}
        </div>

        {/* Bottom pills */}
        <div style={{ marginTop: 50, textAlign: 'center' }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
            color: 'var(--ink-muted)', textTransform: 'uppercase',
            letterSpacing: '0.15em', marginBottom: 20,
          }}>
            {t.alsoFamiliar}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {t.familiar.map(c => (
              <span key={c} className="pill">{c}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
