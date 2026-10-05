import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function LegalModal({ open, onClose, title, children }) {
  /* Close on Escape */
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 4000,
              background: 'rgba(27,42,34,0.35)',
              backdropFilter: 'blur(6px)',
            }}
          />

          {/* Panel */}
          <div style={{
            position: 'fixed', zIndex: 4001,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(680px, calc(100vw - 32px))',
          }}>
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              maxHeight: '80vh',
              background: 'rgba(255,253,248,0.99)',
              border: '1px solid var(--line)',
              borderRadius: 16,
              display: 'flex', flexDirection: 'column',
              boxShadow: 'var(--shadow-lg)', color: 'var(--ink)',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 24px 18px',
              borderBottom: '1px solid var(--line)',
              flexShrink: 0,
            }}>
              <div>
                <div style={{
                  fontFamily: 'JetBrains Mono', fontSize: '0.7rem',
                  color: 'var(--leaf)', letterSpacing: '0.15em',
                  textTransform: 'uppercase', marginBottom: 4,
                }}>
                  Legal
                </div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{title}</h2>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'var(--bg)', border: '1px solid var(--line)',
                  color: 'var(--ink-soft)', borderRadius: 8,
                  width: 34, height: 34, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s', flexShrink: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--ink)'; e.currentTarget.style.background = 'var(--leaf-soft)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--ink-soft)'; e.currentTarget.style.background = 'var(--bg)'; }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable content */}
            <div style={{
              padding: '22px 24px 28px',
              overflowY: 'auto',
              fontSize: '0.88rem', color: 'var(--ink-soft)',
              lineHeight: 1.75,
            }}>
              {children}
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
