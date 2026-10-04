import { motion } from 'framer-motion';
import { useReveal } from '../hooks/useReveal';

// The intro paragraph, stats, education and relocation paragraph appear as
// beats during the sky journey (JourneyBeats.jsx); this section continues the
// story after landing.

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

export default function About() {
  const [ref, visible] = useReveal();
  const [lowerRef, lowerVisible] = useReveal(0.15);

  return (
    <section id="about">
      <div className="container">
        <div className="about-grid" ref={ref}>
          {/* Left: story continues */}
          <motion.div
            className="about-lead"
            initial={{ opacity: 0, y: 30 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="section-tag">about me</div>
            <p>
              I also have advanced knowledge in <strong>cybersecurity</strong> — including
              attack mitigation, penetration testing, and secure software design — which means
              I don't just build things that work, I build things that are hard to break.
            </p>
          </motion.div>

          {/* Right: code window */}
          <motion.div
            className="code-window"
            initial={{ opacity: 0, y: 40, rotate: 1.5 }}
            animate={visible ? { opacity: 1, y: 0, rotate: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
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
                  key={line.num}
                  className="code-line"
                  initial={{ opacity: 0, x: -10 }}
                  animate={visible ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.35 + i * 0.06 }}
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

        <div className="about-lower" ref={lowerRef}>
          {/* Tech grid */}
          <motion.div
            className="about-skills-col"
            initial={{ opacity: 0, y: 30 }}
            animate={lowerVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <h3>// tech stack</h3>
            <div className="tech-grid">
              {techs.map((t, i) => (
                <motion.div
                  key={t.label}
                  className="tech-item"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={lowerVisible ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.15 + i * 0.04 }}
                >
                  <span className="tech-icon">{t.icon}</span>
                  {t.label}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
