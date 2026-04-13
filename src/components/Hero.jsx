import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin } from 'lucide-react';
import ParticleCanvas from './ParticleCanvas';
import { useTypewriter } from '../hooks/useTypewriter';

const codeLines = [
  { num: '1',  tokens: [{ c:'c-purple', t:'const ' }, { c:'c-cyan', t:'developer' }, { c:'c-white', t:' = {' }] },
  { num: '2',  tokens: [{ c:'c-gray', t:'  ' }, { c:'c-pink', t:'name' }, { c:'c-white', t:': ' }, { c:'c-green', t:'"Raúl Ortega Pérez",' }] },
  { num: '3',  tokens: [{ c:'c-gray', t:'  ' }, { c:'c-pink', t:'age' }, { c:'c-white', t:': ' }, { c:'c-orange', t:'22,' }] },
  { num: '4',  tokens: [{ c:'c-gray', t:'  ' }, { c:'c-pink', t:'degree' }, { c:'c-white', t:': ' }, { c:'c-green', t:'"Computer Engineering",' }] },
  { num: '5',  tokens: [{ c:'c-gray', t:'  ' }, { c:'c-pink', t:'university' }, { c:'c-white', t:': ' }, { c:'c-green', t:'"UAL · Almería",' }] },
  { num: '6',  tokens: [{ c:'c-gray', t:'  ' }, { c:'c-pink', t:'skills' }, { c:'c-white', t:': [' }, { c:'c-green', t:'"React"' }, { c:'c-white', t:', ' }, { c:'c-green', t:'"Node"' }, { c:'c-white', t:', ' }, { c:'c-green', t:'"...more"' }, { c:'c-white', t:'],' }] },
  { num: '7',  tokens: [{ c:'c-gray', t:'  ' }, { c:'c-pink', t:'available' }, { c:'c-white', t:': ' }, { c:'c-cyan', t:'true,' }] },
  { num: '8',  tokens: [{ c:'c-gray', t:'  ' }, { c:'c-pink', t:'passion' }, { c:'c-white', t:': ' }, { c:'c-green', t:'"Building things that matter"' }] },
  { num: '9',  tokens: [{ c:'c-white', t:'}' }] },
  { num: '10', tokens: [] },
  { num: '11', tokens: [{ c:'c-purple', t:'console' }, { c:'c-white', t:'.' }, { c:'c-yellow', t:'log' }, { c:'c-white', t:'(' }, { c:'c-green', t:'"Hello, World! 👋"' }, { c:'c-white', t:')' }] },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: 'easeOut' },
});

export default function Hero() {
  const title = useTypewriter(['Software Developer', 'Frontend Engineer', 'Full Stack Dev', 'Problem Solver'], 80, 2000);

  return (
    <section className="hero" id="home">
      <ParticleCanvas />

      {/* Radial glow blobs */}
      <div style={{
        position:'absolute', inset:0, zIndex:1, pointerEvents:'none',
        background: 'radial-gradient(ellipse 60% 60% at 20% 50%, rgba(0,245,255,0.05) 0%, transparent 70%)',
      }} />
      <div style={{
        position:'absolute', inset:0, zIndex:1, pointerEvents:'none',
        background: 'radial-gradient(ellipse 50% 50% at 80% 60%, rgba(139,92,246,0.06) 0%, transparent 70%)',
      }} />

      <div className="hero-content">
        <div className="hero-inner">
          {/* Left: text */}
          <div>
            <motion.div className="hero-eyebrow" {...fadeUp(0.2)}>
              <span className="dot" />
              Available for work · Open to relocation in Europe
            </motion.div>

            <motion.h1 className="hero-name" {...fadeUp(0.35)}>
              <span className="gradient-text">Raúl</span>
              <br />
              Ortega
            </motion.h1>

            <motion.div className="hero-role" {...fadeUp(0.45)}>
              <span className="mono" style={{ color:'var(--accent-cyan)' }}>&lt;</span>
              <span style={{ minWidth: 200 }}>{title}<span style={{
                display:'inline-block', width:2, height:'1em',
                background:'var(--accent-cyan)', marginLeft:2,
                animation:'blink 1s step-end infinite',
                verticalAlign:'text-bottom',
              }} /></span>
              <span className="mono" style={{ color:'var(--accent-cyan)' }}>/&gt;</span>
            </motion.div>

            <motion.p className="hero-desc" {...fadeUp(0.55)}>
              Computer Engineering graduate from{' '}
              <strong style={{ color:'var(--text-primary)' }}>UAL · Almería</strong>.
              I craft fast, scalable, and beautiful web experiences that users love.
            </motion.p>

            <motion.div className="hero-cta" {...fadeUp(0.65)}>
              <a href="#projects" className="btn-primary">
                View my work <ArrowRight size={16} />
              </a>
              <a href="#contact" className="btn-secondary">
                Get in touch
              </a>
            </motion.div>

            <motion.div
              style={{ display:'flex', gap:14, marginTop:32 }}
              {...fadeUp(0.75)}
            >
              {[
                { icon: <Github size={18} />, href: 'https://github.com/Raaulortega', label:'GitHub' },
                { icon: <Linkedin size={18} />, href: 'https://linkedin.com/in/RaaulOrteega', label:'LinkedIn' },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  title={s.label}
                  style={{
                    display:'flex', alignItems:'center', justifyContent:'center',
                    width:40, height:40, borderRadius:10,
                    border:'1px solid var(--border)', background:'var(--bg-card)',
                    color:'var(--text-secondary)', transition:'all 0.2s',
                    textDecoration:'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(0,245,255,0.3)';
                    e.currentTarget.style.color = 'var(--accent-cyan)';
                    e.currentTarget.style.background = 'rgba(0,245,255,0.06)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.background = 'var(--bg-card)';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right: code window */}
          <motion.div
            className="hero-code-window glass"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
            <div className="code-window-bar">
              <span className="dot-red" />
              <span className="dot-yellow" />
              <span className="dot-green" />
              <span className="filename">RaulOrtega.js</span>
            </div>
            <div className="code-window-body">
              {codeLines.map((line, i) => (
                <motion.div
                  key={i}
                  className="code-line"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.06 }}
                >
                  <span className="code-num">{line.num}</span>
                  <span>
                    {line.tokens.map((tok, j) => (
                      <span key={j} className={tok.c}>{tok.t}</span>
                    ))}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        style={{
          position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)',
          display:'flex', flexDirection:'column', alignItems:'center', gap:6,
          color:'var(--text-secondary)', zIndex:2,
        }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span style={{ fontSize:'0.65rem', fontFamily:'JetBrains Mono', letterSpacing:'0.1em', textTransform:'uppercase' }}>scroll</span>
        <div style={{ width:1, height:40, background:'linear-gradient(to bottom, var(--accent-cyan), transparent)' }} />
      </motion.div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </section>
  );
}
