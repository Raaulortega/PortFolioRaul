// Content "beats" shown while the camera falls from the sky to the valley.
// Every beat shares the same card-less style and is driven by journey progress
// (0..1). Timings live in BEATS so the whole sequence can be tuned in one place.
import { motion, useTransform } from 'framer-motion';
import { ArrowRight, Github, Linkedin } from 'lucide-react';
import { useTypewriter } from '../hooks/useTypewriter';

/** [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd] in journey progress. */
const BEATS = {
  hero:      { band: [0, 0, 0.06, 0.09] },
  intro:     { band: [0.1, 0.12, 0.22, 0.245], reveal: [0.12, 0.205] },
  stats:     { band: [0.26, 0.275, 0.355, 0.38], reveal: [0.275, 0.335] },
  education: { band: [0.395, 0.41, 0.47, 0.49] },
  craft:     { band: [0.505, 0.52, 0.6, 0.625], reveal: [0.52, 0.585] },
  europe:    { band: [0.64, 0.655, 0.75, 0.775], reveal: [0.655, 0.725] },
  // 0.775 → 1: nothing on screen, the valley reveal gets the stage.
};

const ROLES = ['Software Developer', 'Frontend Engineer', 'Full Stack Dev', 'Problem Solver'];

const SOCIALS = [
  { icon: <Github size={18} />, href: 'https://github.com/Raaulortega', label: 'GitHub' },
  { icon: <Linkedin size={18} />, href: 'https://linkedin.com/in/RaaulOrteega', label: 'LinkedIn' },
];

const STATS = [
  { number: '22', label: 'Years old' },
  { number: '4+', label: 'Projects built' },
  { number: '∞', label: 'Curiosity level' },
  { number: '100%', label: 'Committed' },
];

const INTRO_SEGMENTS = [
  { text: 'Hey! I\'m ' },
  { text: 'Raúl Ortega Pérez', strong: true },
  { text: ', a 22-year-old ' },
  { text: 'Computer Engineering graduate', strong: true },
  { text: ' from the ' },
  { text: 'University of Almería (UAL), Spain', strong: true },
  { text: '. I\'m passionate about turning complex problems into elegant, user-friendly software.' },
];

const CRAFT_SEGMENTS = [
  { text: 'I love building ' },
  { text: 'full-stack web applications', strong: true },
  { text: ' — from crafting pixel-perfect UIs to designing efficient backend architectures. My goal is always clean, maintainable code that scales.' },
];

const EUROPE_SEGMENTS = [
  { text: 'I\'m actively ' },
  { text: 'open to opportunities across Europe', strong: true },
  { text: ', including Denmark, Sweden, Norway, Germany and the Netherlands — both on-site and remote.' },
];

/** Splits text segments into word tokens; whitespace tokens get index -1. */
function tokenize(segments) {
  let index = 0;
  const tokens = segments.flatMap((seg) =>
    seg.text.split(/(\s+)/).filter(Boolean).map((w) => ({
      w,
      strong: !!seg.strong,
      index: w.trim() ? index++ : -1,
    })),
  );
  return { tokens, count: index };
}

const INTRO_TOKENS = tokenize(INTRO_SEGMENTS);
const CRAFT_TOKENS = tokenize(CRAFT_SEGMENTS);
const EUROPE_TOKENS = tokenize(EUROPE_SEGMENTS);

/** Fade + drift wrapper shared by every beat. */
function Beat({ progress, band, className = '', children }) {
  const opacity = useTransform(progress, band, [band[0] === band[1] ? 1 : 0, 1, 1, 0]);
  const y = useTransform(progress, band, [50, 0, 0, -50]);
  const pointerEvents = useTransform(opacity, (o) => (o > 0.15 ? 'auto' : 'none'));
  return (
    <motion.div className={`hud-card hud-beat ${className}`} style={{ opacity, y, pointerEvents }}>
      {children}
    </motion.div>
  );
}

function RevealWord({ progress, start, end, word, strong }) {
  const opacity = useTransform(progress, [start, end], [0.16, 1]);
  const y = useTransform(progress, [start, end], [8, 0]);
  return (
    <motion.span className={strong ? 'flow-word flow-word--strong' : 'flow-word'} style={{ opacity, y }}>
      {word}
    </motion.span>
  );
}

/** Paragraph whose words light up one after another across `range`. */
function RevealText({ progress, data, range, className }) {
  const span = range[1] - range[0];
  return (
    <p className={className}>
      {data.tokens.map((t, i) => {
        if (t.index < 0) return t.w;
        const start = range[0] + (span * t.index) / data.count;
        return (
          <RevealWord key={i} progress={progress} start={start} end={start + 0.02} word={t.w} strong={t.strong} />
        );
      })}
    </p>
  );
}

function HeroBeat({ progress }) {
  const title = useTypewriter(ROLES, 80, 2000);
  return (
    <Beat progress={progress} band={BEATS.hero.band} className="hud-beat--hero">
      <motion.div
        className="hero-eyebrow"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <span className="dot" />
        Available for work · Open to relocation in Europe
      </motion.div>

      <motion.h1
        className="hero-name"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <span className="gradient-text">Raúl</span> Ortega
      </motion.h1>

      <motion.div
        className="hero-role"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.45 }}
      >
        <span className="mono hero-role-bracket">&lt;</span>
        <span className="hero-role-text">{title}<span className="caret" /></span>
        <span className="mono hero-role-bracket">/&gt;</span>
      </motion.div>

      <motion.p
        className="hero-desc"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.55 }}
      >
        Computer Engineering graduate from <strong>UAL · Almería</strong>.
        I craft fast, scalable, and beautiful web experiences that users love.
      </motion.p>

      <motion.div
        className="hero-actions"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.65 }}
      >
        <a href="#projects" className="btn-primary">
          View my work <ArrowRight size={16} />
        </a>
        <a href="#contact" className="btn-secondary">Get in touch</a>
        <div className="hero-socials">
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" title={s.label} aria-label={s.label} className="icon-button">
              {s.icon}
            </a>
          ))}
        </div>
      </motion.div>
    </Beat>
  );
}

function IntroBeat({ progress }) {
  return (
    <Beat progress={progress} band={BEATS.intro.band}>
      <div className="section-tag hud-beat-tag">about me</div>
      <h2 className="hud-title">
        Who I am &amp; <span className="gradient-text">what I do</span>
      </h2>
      <RevealText progress={progress} data={INTRO_TOKENS} range={BEATS.intro.reveal} className="hud-flow-text hud-flow-text--sm" />
    </Beat>
  );
}

function StatItem({ progress, start, stat }) {
  const opacity = useTransform(progress, [start, start + 0.02], [0, 1]);
  const scale = useTransform(progress, [start, start + 0.02], [0.7, 1]);
  const y = useTransform(progress, [start, start + 0.02], [24, 0]);
  return (
    <motion.div className="beat-stat" style={{ opacity, scale, y }}>
      <div className="beat-stat-number">{stat.number}</div>
      <div className="beat-stat-label">{stat.label}</div>
    </motion.div>
  );
}

function StatsBeat({ progress }) {
  const [from, to] = BEATS.stats.reveal;
  const step = (to - from) / STATS.length;
  return (
    <Beat progress={progress} band={BEATS.stats.band} className="hud-beat--wide">
      <div className="beat-stats">
        {STATS.map((s, i) => (
          <StatItem key={s.label} progress={progress} start={from + step * i} stat={s} />
        ))}
      </div>
    </Beat>
  );
}

function EducationBeat({ progress }) {
  return (
    <Beat progress={progress} band={BEATS.education.band}>
      <div className="beat-edu-badge">Bachelor's Degree</div>
      <h2 className="beat-edu-title">Computer Engineering</h2>
      <p className="beat-edu-meta">
        Universidad de Almería (UAL) · <span style={{ whiteSpace: 'nowrap' }}>2022 – 2026</span>
      </p>
    </Beat>
  );
}

function CraftBeat({ progress }) {
  return (
    <Beat progress={progress} band={BEATS.craft.band}>
      <RevealText progress={progress} data={CRAFT_TOKENS} range={BEATS.craft.reveal} className="hud-flow-text" />
    </Beat>
  );
}

function EuropeBeat({ progress }) {
  return (
    <Beat progress={progress} band={BEATS.europe.band}>
      <RevealText progress={progress} data={EUROPE_TOKENS} range={BEATS.europe.reveal} className="hud-flow-text" />
    </Beat>
  );
}

export default function JourneyBeats({ progress }) {
  return (
    <>
      <HeroBeat progress={progress} />
      <IntroBeat progress={progress} />
      <StatsBeat progress={progress} />
      <EducationBeat progress={progress} />
      <CraftBeat progress={progress} />
      <EuropeBeat progress={progress} />
    </>
  );
}
