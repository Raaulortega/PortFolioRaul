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
              background: 'rgba(0,0,0,0.7)',
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
              background: 'rgba(10,10,16,0.98)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              display: 'flex', flexDirection: 'column',
              boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 24px 18px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              flexShrink: 0,
            }}>
              <div>
                <div style={{
                  fontFamily: 'JetBrains Mono', fontSize: '0.7rem',
                  color: 'var(--accent-cyan)', letterSpacing: '0.15em',
                  textTransform: 'uppercase', marginBottom: 4,
                }}>
                  Legal
                </div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{title}</h2>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                  color: 'var(--text-secondary)', borderRadius: 8,
                  width: 34, height: 34, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s', flexShrink: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable content */}
            <div style={{
              padding: '22px 24px 28px',
              overflowY: 'auto',
              fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)',
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
