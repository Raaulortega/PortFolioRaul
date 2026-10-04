import { Component, useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Github, Linkedin } from 'lucide-react';
import { useTypewriter } from '../hooks/useTypewriter';
import { getQuality, journey } from '../scene/world';

const ROLES = ['Software Developer', 'Frontend Engineer', 'Full Stack Dev', 'Problem Solver'];

const STATS = [
  { number: '22', label: 'Years old' },
  { number: '4+', label: 'Projects built' },
  { number: '∞', label: 'Curiosity level' },
  { number: '100%', label: 'Committed' },
];

const SOCIALS = [
  { icon: <Github size={18} />, href: 'https://github.com/Raaulortega', label: 'GitHub' },
  { icon: <Linkedin size={18} />, href: 'https://linkedin.com/in/RaaulOrteega', label: 'LinkedIn' },
];

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

/** Falls back to the static sky if anything inside the WebGL tree throws. */
class SceneBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error) {
    this.props.onError?.(error);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Scroll-linked visibility for a HUD card. `band` is [fadeInStart, fadeInEnd,
 * fadeOutStart, fadeOutEnd] in journey progress.
 */
function useBand(progress, band) {
  const opacity = useTransform(progress, band, [0, 1, 1, 0]);
  const y = useTransform(progress, band, [60, 0, 0, -60]);
  const scale = useTransform(progress, band, [0.96, 1, 1, 0.98]);
  const pointerEvents = useTransform(opacity, (o) => (o > 0.15 ? 'auto' : 'none'));
  return { opacity, y, scale, pointerEvents };
}

function HeroCard({ progress }) {
  const title = useTypewriter(ROLES, 80, 2000);
  const opacity = useTransform(progress, [0, 0.09, 0.16], [1, 1, 0]);
  const y = useTransform(progress, [0, 0.16], [0, -80]);
  const pointerEvents = useTransform(opacity, (o) => (o > 0.15 ? 'auto' : 'none'));

  return (
    <motion.div className="hud-card hud-card--hero glass-hud" style={{ opacity, y, pointerEvents }}>
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
    </motion.div>
  );
}

function AboutIntroCard({ progress }) {
  const style = useBand(progress, [0.2, 0.26, 0.37, 0.43]);
  return (
    <motion.div className="hud-card hud-card--left glass-hud" style={style}>
      <div className="section-tag">about me</div>
      <h2 className="hud-title">
        Who I am &amp; <span className="gradient-text">what I do</span>
      </h2>
      <p className="hud-text">
        Hey! I'm <strong>Raúl Ortega Pérez</strong>, a 22-year-old <strong>Computer Engineering
        graduate</strong> from the <strong>University of Almería (UAL), Spain</strong>. I'm
        passionate about turning complex problems into elegant, user-friendly software.
      </p>
      <div className="hud-stats">
        {STATS.map((s) => (
          <div key={s.label} className="hud-stat">
            <div className="hud-stat-number">{s.number}</div>
            <div className="hud-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Relocation paragraph, split into segments so it can be revealed word by word.
const FLOW_SEGMENTS = [
  { text: 'I love building ' },
  { text: 'full-stack web applications', strong: true },
  { text: ' — from crafting pixel-perfect UIs to designing efficient backend architectures. My goal is always clean, maintainable code that scales. I\'m actively ' },
  { text: 'open to opportunities across Europe', strong: true },
  { text: ', including Denmark, Sweden, Norway, Germany and the Netherlands — both on-site and remote.' },
];

const FLOW_WORDS = (() => {
  let index = 0;
  return FLOW_SEGMENTS.flatMap((seg) =>
    seg.text.split(/(\s+)/).filter(Boolean).map((w) => ({
      w,
      strong: !!seg.strong,
      index: w.trim() ? index++ : -1, // -1 marks whitespace
    })),
  );
})();
const FLOW_WORD_COUNT = FLOW_WORDS.filter((t) => t.index >= 0).length;
const FLOW_REVEAL = [0.48, 0.6]; // journey progress over which words light up

function FlowWord({ progress, index, count, word, strong }) {
  const start = FLOW_REVEAL[0] + ((FLOW_REVEAL[1] - FLOW_REVEAL[0]) * index) / count;
  const end = start + 0.025;
  const opacity = useTransform(progress, [start, end], [0.16, 1]);
  const y = useTransform(progress, [start, end], [8, 0]);
  return (
    <motion.span className={strong ? 'flow-word flow-word--strong' : 'flow-word'} style={{ opacity, y }}>
      {word}
    </motion.span>
  );
}

/** Card-less statement that reads itself in as the camera falls through the clouds. */
function FlowStatement({ progress }) {
  const opacity = useTransform(progress, [0.45, 0.48, 0.64, 0.69], [0, 1, 1, 0]);
  const y = useTransform(progress, [0.45, 0.69], [40, -40]);
  const pointerEvents = useTransform(opacity, (o) => (o > 0.15 ? 'auto' : 'none'));

  return (
    <motion.div className="hud-card hud-flow" style={{ opacity, y, pointerEvents }}>
      <p className="hud-flow-text">
        {FLOW_WORDS.map((t, i) => (t.index < 0 ? t.w : (
          <FlowWord key={i} progress={progress} index={t.index} count={FLOW_WORD_COUNT} word={t.w} strong={t.strong} />
        )))}
      </p>
    </motion.div>
  );
}

/** Decorative altimeter. Owns its own state so scrolling never re-renders the canvas. */
function AltitudeRail({ progress }) {
  const [altitude, setAltitude] = useState(5200);
  const railScale = useTransform(progress, [0, 1], [0, 1]);
  useMotionValueEvent(progress, 'change', (v) => {
    setAltitude(Math.round((5200 - v * 4820) / 10) * 10);
  });
  return (
    <div className="journey-rail" aria-hidden="true">
      <span className="journey-rail-label mono">ALT</span>
      <div className="journey-rail-track">
        <motion.div className="journey-rail-fill" style={{ scaleY: railScale }} />
      </div>
      <span className="journey-rail-value mono">{altitude.toLocaleString('en-US')} m</span>
    </div>
  );
}

function Loader({ progress, done }) {
  return (
    <motion.div
      className="journey-loader"
      initial={{ opacity: 1 }}
      animate={{ opacity: done ? 0 : 1 }}
      transition={{ duration: 0.8, delay: done ? 0.2 : 0 }}
      style={{ pointerEvents: done ? 'none' : 'auto' }}
      aria-hidden={done}
    >
      <div className="journey-loader-inner">
        <div className="journey-loader-logo mono">&lt;<span>ROP</span>/&gt;</div>
        <div className="journey-loader-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
          <div className="journey-loader-bar" style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
        <div className="journey-loader-pct mono">{Math.round(progress)}%</div>
      </div>
    </motion.div>
  );
}

export default function SkyJourney() {
  const sectionRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const [quality] = useState(getQuality);
  const [webgl] = useState(() => typeof window !== 'undefined' && supportsWebGL());
  const [failed, setFailed] = useState(false);
  const [Experience, setExperience] = useState(null);
  const [ready, setReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [active, setActive] = useState(true);

  const use3D = webgl && !failed;
  const loaderDone = !use3D || ready;

  const { scrollYProgress: rawProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  // Mirror into a plain motion value: transforms derived from it run on the main
  // thread in lockstep with the camera, instead of framer's accelerated
  // ScrollTimeline path which can drift from the WebGL render loop.
  const scrollYProgress = useMotionValue(0);

  // Feed scroll progress to the render loop without re-rendering React.
  useMotionValueEvent(rawProgress, 'change', (v) => {
    scrollYProgress.set(v);
    journey.target = v;
  });

  useEffect(() => {
    const v = rawProgress.get();
    scrollYProgress.set(v);
    journey.target = v;
    journey.current = v;
  }, [rawProgress, scrollYProgress]);

  // Load the three.js chunk only when WebGL is available.
  useEffect(() => {
    if (!use3D) return undefined;
    let cancelled = false;
    import('../scene/Experience')
      .then((mod) => { if (!cancelled) setExperience(() => mod.default); })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [use3D]);

  // Loader progress: creep while the chunk downloads and the scene builds.
  useEffect(() => {
    if (loaderDone) return undefined;
    const id = setInterval(() => {
      setLoadProgress((p) => {
        const ceiling = Experience ? 94 : 65;
        return p + (ceiling - p) * 0.08;
      });
    }, 60);
    return () => clearInterval(id);
  }, [Experience, loaderDone]);

  // Pause rendering while the journey is off-screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Gentle pointer parallax for the camera.
  useEffect(() => {
    const onMove = (e) => {
      journey.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      journey.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  const handleReady = useCallback(() => {
    setLoadProgress(100);
    setReady(true);
  }, []);
  const handleError = useCallback(() => setFailed(true), []);

  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.04], [1, 0]);
  const landingOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);

  return (
    <section id="home" ref={sectionRef} className="journey" aria-label="Introduction">
      <div className="journey-stage">
        <div className="journey-fallback" aria-hidden="true" />
        {use3D && Experience && (
          <SceneBoundary onError={handleError}>
            <div className="journey-canvas">
              <Experience
                quality={quality}
                reducedMotion={reducedMotion}
                active={active}
                onReady={handleReady}
              />
            </div>
          </SceneBoundary>
        )}

        <div className="journey-hud">
          <HeroCard progress={scrollYProgress} />
          <AboutIntroCard progress={scrollYProgress} />
          <FlowStatement progress={scrollYProgress} />
        </div>

        <AltitudeRail progress={scrollYProgress} />

        <motion.button
          type="button"
          className="scroll-indicator"
          style={{ opacity: indicatorOpacity }}
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="scroll-indicator-mouse"><span /></span>
          <span className="mono">Scroll to explore</span>
        </motion.button>

        <motion.div className="journey-landing" style={{ opacity: landingOpacity }} aria-hidden="true" />

        {use3D && <Loader progress={loadProgress} done={loaderDone} />}
      </div>
    </section>
  );
}
