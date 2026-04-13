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
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          style={{
            position: 'fixed', bottom: 24, left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3000,
            width: 'min(680px, calc(100vw - 32px))',
            background: 'rgba(13,13,20,0.96)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14,
            padding: '20px 24px',
            display: 'flex', alignItems: 'center',
            gap: 20, flexWrap: 'wrap',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,245,255,0.06)',
          }}
        >
          {/* Icon */}
          <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>🍪</span>

          {/* Text */}
          <p style={{
            flex: 1, minWidth: 200,
            fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.6, margin: 0,
          }}>
            This site uses only essential cookies to ensure basic functionality.
            No tracking or advertising cookies are used.{' '}
            <button
              onClick={() => document.dispatchEvent(new CustomEvent('open-privacy'))}
              style={{
                background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                color: 'var(--accent-cyan)', fontSize: 'inherit',
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
                background: 'transparent', border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem',
                fontFamily: 'JetBrains Mono, monospace',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
            >
              Reject
            </button>
            <button
              onClick={accept}
              style={{
                padding: '8px 18px', borderRadius: 7, cursor: 'pointer',
                background: 'var(--accent-cyan)', border: 'none',
                color: '#000', fontSize: '0.8rem', fontWeight: 700,
                fontFamily: 'JetBrains Mono, monospace',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#00d4e0'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--accent-cyan)'}
            >
              Accept
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
