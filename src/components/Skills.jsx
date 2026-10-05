import { motion } from 'framer-motion';
import { Monitor, Server, Wrench, ShieldCheck, Check } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

// Proficiency is shown as a tier instead of a percentage, so nothing reads as
// "half known". Within each group skills are listed strongest tier first.
const TIERS = {
  expert: 'Expert',
  advanced: 'Advanced',
  proficient: 'Proficient',
};
const TIER_ORDER = { expert: 0, advanced: 1, proficient: 2 };

// Stable sort: skills with the same tier keep their declared order.
const byTier = (skills) => [...skills].sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier]);

const skillGroups = [
  {
    title: 'Frontend',
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
    title: 'Backend',
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
    title: 'Tools & Infrastructure',
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
    title: 'Cybersecurity',
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

const alsoFamiliar = ['Algorithms', 'Data Structures', 'Design Patterns', 'CI/CD', 'Agile', 'TDD',
  'Responsive Design', 'Web Performance', 'SEO Basics', 'Linux'];

function TierBadge({ tier, color }) {
  return (
    <span className={`tier tier--${tier}`} style={{ '--tier-color': color }}>
      {tier === 'expert' && <span className="tier-spark" aria-hidden="true">✦</span>}
      {TIERS[tier]}
    </span>
  );
}

/* Each card observes itself — fires when that card enters the viewport */
function SkillCard({ group }) {
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
        <h3 className="skill-card-title">{group.title}</h3>
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
            <span className="skill-name">{skill.name}</span>
            <TierBadge tier={skill.tier} color={group.color} />
          </motion.li>
        ))}
      </ul>
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
          initial={{ opacity: 0, y: 30 }}
          animate={headerVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 60 }}
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
        <div style={{ marginTop: 50, textAlign: 'center' }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
            color: 'var(--ink-muted)', textTransform: 'uppercase',
            letterSpacing: '0.15em', marginBottom: 20,
          }}>
            // also familiar with
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {alsoFamiliar.map(c => (
              <span key={c} className="pill">{c}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
