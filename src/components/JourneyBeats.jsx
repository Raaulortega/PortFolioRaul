// Content "beats" shown while the camera falls from the sky to the valley.
// Every beat shares the same card-less style and is driven by journey progress
// (0..1). Timings live in BEATS so the whole sequence can be tuned in one place.
import { motion, useTransform } from 'framer-motion';
import { ArrowRight, Github, Linkedin } from 'lucide-react';
import { useTypewriter } from '../hooks/useTypewriter';
import { useCopy, useLang } from '../i18n/lang';

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

const SOCIALS = [
  { icon: <Github size={18} />, href: 'https://github.com/Raaulortega', label: 'GitHub' },
  { icon: <Linkedin size={18} />, href: 'https://linkedin.com/in/RaaulOrteega', label: 'LinkedIn' },
];

const COPY = {
  en: {
    roles: ['Junior Software Developer', 'Full Stack Developer', 'Frontend Engineer', 'Problem Solver'],
    eyebrow: 'Available for work · Open to relocation in Europe',
    heroDesc: ['Junior Full Stack Developer and Computer Engineering graduate from ', '. I craft fast, scalable, and beautiful web experiences that users love.'],
    viewWork: 'View my work',
    getInTouch: 'Get in touch',
    aboutTag: 'about me',
    aboutTitle: ['Who I am & ', 'what I do'],
    stats: [
      { number: '22', label: 'Years old' },
      { number: '4+', label: 'Projects built' },
      { number: '∞', label: 'Curiosity level' },
      { number: '100%', label: 'Committed' },
    ],
    degreeBadge: "Bachelor's Degree",
    degreeTitle: 'Computer Engineering',
    intro: [
      { text: 'Hey! I\'m ' },
      { text: 'Raúl Ortega Pérez', strong: true },
      { text: ', a 22-year-old ' },
      { text: 'Computer Engineering graduate', strong: true },
      { text: ' from the ' },
      { text: 'University of Almería (UAL), Spain', strong: true },
      { text: '. I\'m passionate about turning complex problems into elegant, user-friendly software.' },
    ],
    craft: [
      { text: 'I love building ' },
      { text: 'full-stack web applications', strong: true },
      { text: ' — from crafting pixel-perfect UIs to designing efficient backend architectures. My goal is always clean, maintainable code that scales.' },
    ],
    europe: [
      { text: 'I\'m actively ' },
      { text: 'open to opportunities across Europe', strong: true },
      { text: ', including Denmark, Sweden, Norway, Germany and the Netherlands — both on-site and remote.' },
    ],
  },
  es: {
    roles: ['Desarrollador Software Junior', 'Desarrollador Full Stack', 'Ingeniero Frontend', 'Resolutor de problemas'],
    eyebrow: 'Disponible para trabajar · Abierto a reubicarme en Europa',
    heroDesc: ['Desarrollador Full Stack junior e Ingeniero Informático por la ', '. Creo experiencias web rápidas, escalables y cuidadas que a los usuarios les encantan.'],
    viewWork: 'Ver mis proyectos',
    getInTouch: 'Contactar',
    aboutTag: 'sobre mí',
    aboutTitle: ['Quién soy y ', 'a qué me dedico'],
    stats: [
      { number: '22', label: 'Años' },
      { number: '4+', label: 'Proyectos creados' },
      { number: '∞', label: 'Nivel de curiosidad' },
      { number: '100%', label: 'Compromiso' },
    ],
    degreeBadge: 'Grado universitario',
    degreeTitle: 'Ingeniería Informática',
    intro: [
      { text: '¡Hola! Soy ' },
      { text: 'Raúl Ortega Pérez', strong: true },
      { text: ', tengo 22 años y soy ' },
      { text: 'Ingeniero Informático', strong: true },
      { text: ' por la ' },
      { text: 'Universidad de Almería (UAL)', strong: true },
      { text: '. Me apasiona convertir problemas complejos en software elegante y fácil de usar.' },
    ],
    craft: [
      { text: 'Me encanta crear ' },
      { text: 'aplicaciones web full stack', strong: true },
      { text: ' — desde interfaces cuidadas al píxel hasta arquitecturas backend eficientes. Mi objetivo es siempre un código limpio, mantenible y que escale.' },
    ],
    europe: [
      { text: 'Estoy ' },
      { text: 'abierto a oportunidades en España y en toda Europa', strong: true },
      { text: ', incluidos Dinamarca, Suecia, Noruega, Alemania y Países Bajos — tanto presencial como en remoto.' },
    ],
  },
};

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

// Word tokens per language, computed once so scrolling never re-tokenizes.
const TOKENS = Object.fromEntries(
  Object.entries(COPY).map(([lang, c]) => [lang, {
    intro: tokenize(c.intro),
    craft: tokenize(c.craft),
    europe: tokenize(c.europe),
  }]),
);

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
  const t = useCopy(COPY);
  const title = useTypewriter(t.roles, 80, 2000);
  return (
    <Beat progress={progress} band={BEATS.hero.band} className="hud-beat--hero">
      <motion.div
        className="hero-eyebrow"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <span className="dot" />
        {t.eyebrow}
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
        {t.heroDesc[0]}<strong>UAL · Almería</strong>{t.heroDesc[1]}
      </motion.p>

      <motion.div
        className="hero-actions"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.65 }}
      >
        <a href="#projects" className="btn-primary">
          {t.viewWork} <ArrowRight size={16} />
        </a>
        <a href="#contact" className="btn-secondary">{t.getInTouch}</a>
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
  const t = useCopy(COPY);
  const tokens = TOKENS[useLang()];
  return (
    <Beat progress={progress} band={BEATS.intro.band}>
      <div className="section-tag hud-beat-tag">{t.aboutTag}</div>
      <h2 className="hud-title">
        {t.aboutTitle[0]}<span className="gradient-text">{t.aboutTitle[1]}</span>
      </h2>
      <RevealText progress={progress} data={tokens.intro} range={BEATS.intro.reveal} className="hud-flow-text hud-flow-text--sm" />
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
  const { stats } = useCopy(COPY);
  const [from, to] = BEATS.stats.reveal;
  const step = (to - from) / stats.length;
  return (
    <Beat progress={progress} band={BEATS.stats.band} className="hud-beat--wide">
      <div className="beat-stats">
        {stats.map((s, i) => (
          <StatItem key={s.number} progress={progress} start={from + step * i} stat={s} />
        ))}
      </div>
    </Beat>
  );
}

function EducationBeat({ progress }) {
  const t = useCopy(COPY);
  return (
    <Beat progress={progress} band={BEATS.education.band}>
      <div className="beat-edu-badge">{t.degreeBadge}</div>
      <h2 className="beat-edu-title">{t.degreeTitle}</h2>
      <p className="beat-edu-meta">
        Universidad de Almería (UAL) · <span style={{ whiteSpace: 'nowrap' }}>2022 – 2026</span>
      </p>
    </Beat>
  );
}

function CraftBeat({ progress }) {
  const tokens = TOKENS[useLang()];
  return (
    <Beat progress={progress} band={BEATS.craft.band}>
      <RevealText progress={progress} data={tokens.craft} range={BEATS.craft.reveal} className="hud-flow-text" />
    </Beat>
  );
}

function EuropeBeat({ progress }) {
  const tokens = TOKENS[useLang()];
  return (
    <Beat progress={progress} band={BEATS.europe.band}>
      <RevealText progress={progress} data={tokens.europe} range={BEATS.europe.reveal} className="hud-flow-text" />
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
