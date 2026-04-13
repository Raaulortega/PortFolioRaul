import { useEffect, useRef } from 'react';

export default function InnovatikVisual() {
  const canvasRef = useRef(null);

  /* Animated neural-network dots */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const nodes = Array.from({ length: 28 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
    }));

    let frame;
    function draw() {
      ctx.clearRect(0, 0, W, H);

      /* edges */
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 90) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(139,92,246,${0.18 * (1 - d / 90)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      /* nodes */
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(139,92,246,0.55)';
        ctx.fill();

        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });

      frame = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(frame);
  }, []);

  const services = [
    {
      color: '#8b5cf6',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2"/>
          <polyline points="8,21 12,17 16,21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
          <polyline points="7,8 10,11 7,14"/>
          <line x1="13" y1="14" x2="17" y2="14"/>
        </svg>
      ),
      title: 'Web Development',
      sub: 'Custom · Scalable · Fast',
    },
    {
      color: '#c084fc',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <circle cx="4"  cy="6"  r="2"/>
          <circle cx="20" cy="6"  r="2"/>
          <circle cx="4"  cy="18" r="2"/>
          <circle cx="20" cy="18" r="2"/>
          <line x1="6"  y1="6.5"  x2="10" y2="10.5"/>
          <line x1="18" y1="6.5"  x2="14" y2="10.5"/>
          <line x1="6"  y1="17.5" x2="10" y2="13.5"/>
          <line x1="18" y1="17.5" x2="14" y2="13.5"/>
        </svg>
      ),
      title: 'AI Automation',
      sub: 'Reduce costs · Scale ops',
    },
  ];

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%', minHeight: 220,
      borderRadius: 12, overflow: 'hidden',
      background: 'rgba(5,5,10,0.95)',
      border: '1px solid rgba(139,92,246,0.12)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 20, padding: '28px 24px',
    }}>
      {/* animated network background */}
      <canvas ref={canvasRef} style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
      }} />

      {/* Brand name */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, #8b5cf6, #c084fc)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: 4,
        }}>
          innovatik
        </div>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 8.5, letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.2)',
        }}>
          innovatik.pro
        </div>
      </div>

      {/* Service cards */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', gap: 12, width: '100%',
      }}>
        {services.map(s => (
          <div key={s.title} style={{
            flex: 1, padding: '14px 12px', borderRadius: 10,
            background: `${s.color}0d`,
            border: `1px solid ${s.color}28`,
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <div style={{ color: s.color }}>{s.icon}</div>
            <div>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10, fontWeight: 700, color: s.color, marginBottom: 3,
              }}>
                {s.title}
              </div>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 8.5, color: 'rgba(255,255,255,0.28)', lineHeight: 1.4,
              }}>
                {s.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Browser bar decoration */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', borderRadius: 8, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(255,255,255,0.03)',
      }}>
        <div style={{
          padding: '7px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ width:7,height:7,borderRadius:'50%',background:'#ff5f5744',display:'inline-block' }}/>
          <span style={{ width:7,height:7,borderRadius:'50%',background:'#febc2e44',display:'inline-block' }}/>
          <span style={{ width:7,height:7,borderRadius:'50%',background:'#28c84044',display:'inline-block' }}/>
          <div style={{
            marginLeft: 8, flex: 1, height: 14, borderRadius: 3,
            background: 'rgba(255,255,255,0.05)',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 8,
            color: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center',
            paddingLeft: 8,
          }}>
            www.innovatik.pro
          </div>
        </div>
        <div style={{ padding: '10px 12px', display: 'flex', gap: 6 }}>
          {[70, 45, 55, 40].map((w, i) => (
            <div key={i} style={{
              height: 7, width: w, borderRadius: 3,
              background: `rgba(139,92,246,${0.08 + i * 0.03})`,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}
