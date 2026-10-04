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

  // Stay as floating glass pills over the sky; become a solid bar once the
  // journey has landed in the valley content.
  useEffect(() => {
    const onScroll = () => {
      const journey = document.getElementById('home');
      const landedAt = journey ? journey.offsetTop + journey.offsetHeight - 80 : 40;
      setScrolled(window.scrollY > landedAt);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <motion.nav
      className={`nav${scrolled ? ' scrolled' : ''}`}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="nav-inner">
        <a href="#home" className="nav-logo" aria-label="Back to top">
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
                <span>{String(i + 1).padStart(2, '0')}.</span>
                {l.label}
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.nav>
  );
}
