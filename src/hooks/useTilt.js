import { useRef } from 'react';

export function useTilt(max = 8) {
  const ref = useRef(null);

  function onMouseMove(e) {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width  - 0.5;   // -0.5 … 0.5
    const y = (e.clientY - top)  / height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * max}deg) rotateX(${-y * max}deg) translateY(-4px)`;
    el.style.transition = 'transform 0.08s ease';
  }

  function onMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) translateY(0)';
    el.style.transition = 'transform 0.5s ease';
  }

  return { ref, onMouseMove, onMouseLeave };
}
