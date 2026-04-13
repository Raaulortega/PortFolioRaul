import { useEffect, useRef } from 'react';

export default function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let W, H;
    const COLS = [];
    const FONT_SIZE = 14;
    const CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ{}[]<>/\\|=+-*&^%$#@!?;:';

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      const colCount = Math.floor(W / FONT_SIZE);
      COLS.length = 0;
      for (let i = 0; i < colCount; i++) {
        COLS.push({ y: Math.random() * H, speed: 0.5 + Math.random() * 1.5 });
      }
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
      ctx.fillStyle = 'rgba(5,5,8,0.07)';
      ctx.fillRect(0, 0, W, H);
      ctx.font = `${FONT_SIZE}px JetBrains Mono, monospace`;

      COLS.forEach((col, i) => {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * FONT_SIZE;
        // Head — bright cyan
        ctx.fillStyle = '#00f5ff';
        ctx.globalAlpha = 0.9;
        ctx.fillText(char, x, col.y);
        // Trail — dim green
        ctx.fillStyle = '#00ff88';
        ctx.globalAlpha = 0.18;
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, col.y - FONT_SIZE * 2);
        ctx.globalAlpha = 1;

        col.y += FONT_SIZE * col.speed;
        if (col.y > H + FONT_SIZE * 10) col.y = -FONT_SIZE * Math.random() * 20;
      });

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-canvas"
      style={{ opacity: 0.12 }}
    />
  );
}
