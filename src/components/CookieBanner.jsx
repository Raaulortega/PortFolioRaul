import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cookie_consent');
    if (!saved) setTimeout(() => setVisible(true), 1200);
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem('cookie_consent', 'rejected');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 3000,
          width: 'min(680px, calc(100vw - 32px))',
        }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          style={{
            background: 'rgba(255,253,248,0.97)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--line)',
            borderRadius: 14,
            padding: '20px 24px',
            display: 'flex', alignItems: 'center',
            gap: 20, flexWrap: 'wrap',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Icon */}
          <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>🍪</span>

          {/* Text */}
          <p style={{
            flex: 1, minWidth: 200,
            fontSize: '0.82rem', color: 'var(--ink-soft)',
            lineHeight: 1.6, margin: 0,
          }}>
            This site uses only essential cookies to ensure basic functionality.
            No tracking or advertising cookies are used.{' '}
            <button
              onClick={() => document.dispatchEvent(new CustomEvent('open-privacy'))}
              style={{
                background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                color: 'var(--leaf)', fontSize: 'inherit',
                fontFamily: 'inherit', textDecoration: 'underline',
              }}
            >
              Privacy Policy
            </button>
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
            <button
              onClick={reject}
              style={{
                padding: '8px 18px', borderRadius: 7, cursor: 'pointer',
                background: 'transparent', border: '1px solid var(--line-strong)',
                color: 'var(--ink-soft)', fontSize: '0.8rem',
                fontFamily: 'JetBrains Mono, monospace',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--ink-muted)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--line-strong)'}
            >
              Reject
            </button>
            <button
              onClick={accept}
              style={{
                padding: '8px 18px', borderRadius: 7, cursor: 'pointer',
                background: 'var(--leaf)', border: 'none',
                color: '#fff', fontSize: '0.8rem', fontWeight: 700,
                fontFamily: 'JetBrains Mono, monospace',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#286c3c'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--leaf)'}
            >
              Accept
            </button>
          </div>
        </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
