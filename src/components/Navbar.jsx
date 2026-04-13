import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const links = [
  { href: '#about', label: 'about' },
  { href: '#skills', label: 'skills' },
  { href: '#projects', label: 'projects' },
  { href: '#contact', label: 'contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      className={`nav${scrolled ? ' scrolled' : ''}`}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="nav-inner">
        <a href="#" className="nav-logo">
          &lt;<span>ROP</span>/&gt;
        </a>
        <ul className="nav-links">
          {links.map((l, i) => (
            <motion.li
              key={l.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
            >
              <a href={l.href}>
                <span style={{ color: 'var(--accent-cyan)', marginRight: 4 }}>
                  {String(i + 1).padStart(2, '0')}.
                </span>
                {l.label}
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.nav>
  );
}
