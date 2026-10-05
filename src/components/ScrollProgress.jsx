import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const [pct, setPct] = useState(0);
  const spring = useSpring(0, { stiffness: 200, damping: 40 });

  useEffect(() => {
    const onScroll = () => {
      const el  = document.documentElement;
      const val = el.scrollTop / (el.scrollHeight - el.clientHeight);
      setPct(val);
      spring.set(val);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [spring]);

  return (
    <motion.div
      style={{
        position: 'fixed', top: 0, left: 0, zIndex: 2000,
        height: 2, originX: 0,
        background: 'linear-gradient(90deg, #4f9ee6, #4fae5f, #e8a33d)',
        scaleX: spring,
        boxShadow: '0 0 8px rgba(232,163,61,0.45)',
      }}
      className="scroll-progress-bar"
    />
  );
}
