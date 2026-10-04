import { useEffect, useRef, useState } from 'react';

/* Simulated live camera-capture dashboard — no private internals exposed */
export default function CavexDiagram() {
  const canvasRef = useRef(null);
  const [tick, setTick]   = useState(0);
  const [expPct, setExpPct] = useState(0);
  const [capturing, setCapturing] = useState(true);

  /* ── Star-field canvas ── */
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

    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.4 + 0.2, a: Math.random() * 0.8 + 0.1,
      flicker: Math.random() * Math.PI * 2,
    }));
    // a few "bright" stars
    const bright = Array.from({ length: 5 }, () => ({
      x: Math.random() * W, y: Math.random() * H, r: 2.5,
    }));

    let frame, t = 0;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      stars.forEach(s => {
        const a = s.a * (0.5 + 0.5 * Math.sin(t * 0.03 + s.flicker));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fill();
      });
      bright.forEach(s => {
        // cross flare
        ctx.strokeStyle = 'rgba(245,196,107,0.25)';
        ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(s.x - 6, s.y); ctx.lineTo(s.x + 6, s.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(s.x, s.y - 6); ctx.lineTo(s.x, s.y + 6); ctx.stroke();
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,236,200,0.95)';
        ctx.fill();
      });
      t++;
      frame = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(frame);
  }, []);

  /* ── Simulated exposure progress ── */
  useEffect(() => {
    const id = setInterval(() => {
      setTick(t => t + 1);
      setExpPct(p => {
        if (p >= 100) { setCapturing(false); setTimeout(() => { setCapturing(true); setExpPct(0); }, 900); return 100; }
        return p + 2.5;
      });
    }, 120);
    return () => clearInterval(id);
  }, []);

  const temp   = (-18 + Math.sin(tick * 0.05) * 0.3).toFixed(1);
  const dataRate = (14.2 + Math.sin(tick * 0.08) * 0.4).toFixed(1);

  const telemetry = [
    { label: 'STATUS',    value: capturing ? 'CAPTURING' : 'READING OUT', color: capturing ? '#8fdcaa' : '#ffb27a' },
    { label: 'SENSOR T',  value: `${temp} °C`,   color: '#9cc9ff' },
    { label: 'DATA RATE', value: `${dataRate} MB/s`, color: '#d7b4ff' },
    { label: 'PROTOCOL',  value: 'WebSocket',    color: '#c3cbe0' },
  ];

  return (
    <div style={{
      position: 'relative', width: '100%', borderRadius: 12, overflow: 'hidden',
      background: 'linear-gradient(160deg, #1d2a4a 0%, #2b3a63 55%, #4a3f6b 100%)',
      boxShadow: 'var(--shadow-md)',
      border: '1px solid rgba(255,255,255,0.14)',
      display: 'flex', flexDirection: 'column', gap: 14,
      padding: '18px 18px 16px',
    }}>
      {/* Stars */}
      <canvas ref={canvasRef} style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none', opacity: 0.7,
      }} />

      {/* ── Top bar ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: '0.2em',
          textTransform: 'uppercase', color: 'rgba(245,196,107,0.5)' }}>
          Astronomical Imager
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5,
          fontFamily: 'JetBrains Mono', fontSize: 8.5, color: '#8fdcaa' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#8fdcaa',
            boxShadow: '0 0 6px #8fdcaa', display: 'inline-block',
            animation: 'pulse 2s ease infinite' }} />
          ONLINE
        </span>
      </div>

      {/* ── Main: telescope aperture + telemetry ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', gap: 14, alignItems: 'center',
      }}>
        {/* Circular telescope view */}
        <div style={{ flexShrink: 0, position: 'relative', width: 110, height: 110 }}>
          {/* Outer ring */}
          <svg viewBox="0 0 110 110" width="110" height="110"
            style={{ position: 'absolute', inset: 0 }}>
            <circle cx="55" cy="55" r="52" fill="none"
              stroke="rgba(245,196,107,0.15)" strokeWidth="1"/>
            {/* Crosshair */}
            <line x1="55" y1="3"  x2="55" y2="24"  stroke="rgba(245,196,107,0.3)" strokeWidth="0.8"/>
            <line x1="55" y1="86" x2="55" y2="107" stroke="rgba(245,196,107,0.3)" strokeWidth="0.8"/>
            <line x1="3"  y1="55" x2="24"  y2="55" stroke="rgba(245,196,107,0.3)" strokeWidth="0.8"/>
            <line x1="86" y1="55" x2="107" y2="55" stroke="rgba(245,196,107,0.3)" strokeWidth="0.8"/>
            {/* Tick marks */}
            {[0,45,90,135,180,225,270,315].map(deg => {
              const r = Math.PI * deg / 180;
              return <line key={deg}
                x1={55 + 49*Math.cos(r)} y1={55 + 49*Math.sin(r)}
                x2={55 + 44*Math.cos(r)} y2={55 + 44*Math.sin(r)}
                stroke="rgba(245,196,107,0.2)" strokeWidth="0.8"/>;
            })}
            {/* Scanning arc */}
            <circle cx="55" cy="55" r="38" fill="none"
              stroke="rgba(245,196,107,0.06)" strokeWidth="10"/>
            {/* Exposure arc */}
            <circle cx="55" cy="55" r="38"
              fill="none"
              stroke="#f5c46b"
              strokeWidth="2.5"
              strokeDasharray={`${2 * Math.PI * 38 * expPct / 100} ${2 * Math.PI * 38}`}
              strokeLinecap="round"
              transform="rotate(-90 55 55)"
              style={{ filter: 'drop-shadow(0 0 4px rgba(245,196,107,0.6))' }}/>
            {/* Center dot */}
            <circle cx="55" cy="55" r="3.5"
              fill="rgba(245,196,107,0.8)"
              style={{ filter: 'drop-shadow(0 0 4px #f5c46b)' }}/>
            {/* Small corner brackets */}
            {[[14,14],[96,14],[14,96],[96,96]].map(([cx,cy],i) => {
              const sx = cx < 55 ? 1 : -1, sy = cy < 55 ? 1 : -1;
              return <g key={i}>
                <line x1={cx} y1={cy} x2={cx + sx*7} y2={cy} stroke="rgba(245,196,107,0.4)" strokeWidth="1.2"/>
                <line x1={cx} y1={cy} x2={cx} y2={cy + sy*7} stroke="rgba(245,196,107,0.4)" strokeWidth="1.2"/>
              </g>;
            })}
          </svg>
          {/* Exposure % */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 700,
              color: capturing ? '#f5c46b' : '#ffb27a',
              textShadow: '0 0 8px currentColor' }}>
              {capturing ? `${Math.round(expPct)}%` : '✓'}
            </span>
          </div>
        </div>

        {/* Telemetry list */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {telemetry.map(t => (
            <div key={t.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 8,
                color: 'rgba(255,255,255,0.62)', letterSpacing: '0.1em' }}>
                {t.label}
              </span>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9,
                fontWeight: 600, color: t.color }}>
                {t.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Exposure bar ── */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 8,
            color: 'rgba(255,255,255,0.62)', letterSpacing: '0.1em' }}>
            EXPOSURE PROGRESS
          </span>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#f5c46b' }}>
            {Math.round(expPct)}%
          </span>
        </div>
        <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.16)' }}>
          <div style={{
            height: '100%', borderRadius: 2, transition: 'width 0.12s linear',
            width: `${expPct}%`,
            background: 'linear-gradient(90deg, #f5c46b, #e8735a)',
            boxShadow: '0 0 6px rgba(245,196,107,0.5)',
          }} />
        </div>
      </div>

      {/* ── Bottom label ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        fontFamily: 'JetBrains Mono', fontSize: 8, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
      }}>
        Calar Alto Observatory · Almería, Spain
      </div>
    </div>
  );
}
