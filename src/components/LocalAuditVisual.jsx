const ACCENT = '#0f8a5f';

const findings = [
  { sev: 'critical', color: '#d93f3f', file: 'Dockerfile', line: 12, rule: 'Container runs as root', cwe: 'CWE-250' },
  { sev: 'medium',   color: '#d98a1f', file: 'nginx.conf', line: 4,  rule: 'server_tokens not disabled', cwe: 'CWE-200' },
  { sev: 'low',      color: '#1f6fb2', file: '.gitignore', line: 1,  rule: '.env not ignored', cwe: 'CWE-538' },
];

const tools = ['Config scanner', 'Secrets', 'JWT', 'Headers', 'Passwords'];

export default function LocalAuditVisual() {
  const score = 82;
  const r = 26;
  const circ = 2 * Math.PI * r;

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%', minHeight: 220,
      borderRadius: 12, overflow: 'hidden',
      background: 'linear-gradient(160deg, #ffffff 0%, #eefaf4 100%)',
      boxShadow: 'var(--shadow-md)',
      border: `1px solid ${ACCENT}29`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 18, padding: '28px 24px',
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true">
          <defs>
            <linearGradient id="la-shield" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#5ee0a8" />
              <stop offset="1" stopColor="#139a68" />
            </linearGradient>
          </defs>
          <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3z" fill="url(#la-shield)" />
          <polyline points="8.5,12 11,14.5 15.5,9.5" fill="none" stroke="#0b1f17"
            strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em',
            color: 'var(--ink)', lineHeight: 1.1,
          }}>
            Local<span style={{ color: ACCENT }}>Audit</span>
          </div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 8.5, letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'var(--ink-muted)',
          }}>
            100% in your browser
          </div>
        </div>
      </div>

      {/* Scan report window */}
      <div style={{
        width: '100%', borderRadius: 8, overflow: 'hidden',
        border: '1px solid var(--line)',
        background: '#fff',
      }}>
        <div style={{
          padding: '7px 12px', borderBottom: '1px solid var(--line)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ width:7,height:7,borderRadius:'50%',background:'#ff5f57',display:'inline-block' }}/>
          <span style={{ width:7,height:7,borderRadius:'50%',background:'#febc2e',display:'inline-block' }}/>
          <span style={{ width:7,height:7,borderRadius:'50%',background:'#28c840',display:'inline-block' }}/>
          <div style={{
            marginLeft: 8, flex: 1, height: 14, borderRadius: 3,
            background: 'var(--bg)',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 8,
            color: 'var(--ink-muted)', display: 'flex', alignItems: 'center',
            paddingLeft: 8,
          }}>
            localaudit.dev
          </div>
        </div>

        <div style={{ padding: '12px 14px', display: 'flex', gap: 14, alignItems: 'center' }}>
          {/* Score gauge */}
          <div style={{ position: 'relative', width: 64, height: 64, flexShrink: 0 }}>
            <svg viewBox="0 0 64 64" width="64" height="64" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="32" cy="32" r={r} fill="none" stroke={`${ACCENT}1f`} strokeWidth="6" />
              <circle cx="32" cy="32" r={r} fill="none" stroke={ACCENT} strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={circ * (1 - score / 100)} />
            </svg>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'JetBrains Mono, monospace',
            }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: 7, color: 'var(--ink-muted)' }}>/100</span>
            </div>
          </div>

          {/* Findings */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {findings.map(f => (
              <div key={f.rule} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontFamily: 'JetBrains Mono, monospace', fontSize: 8.5,
                minWidth: 0,
              }}>
                <span style={{
                  flexShrink: 0, padding: '1px 5px', borderRadius: 3,
                  fontSize: 7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                  color: f.color, background: `${f.color}14`, border: `1px solid ${f.color}33`,
                }}>
                  {f.sev}
                </span>
                <span style={{
                  color: 'var(--ink-soft)', whiteSpace: 'nowrap',
                  overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {f.file}:{f.line} · {f.rule}
                </span>
                <span style={{ marginLeft: 'auto', flexShrink: 0, color: 'var(--ink-muted)', fontSize: 7.5 }}>
                  {f.cwe}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tool chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6 }}>
        {tools.map(t => (
          <span key={t} style={{
            padding: '4px 9px', borderRadius: 999,
            fontFamily: 'JetBrains Mono, monospace', fontSize: 8.5, fontWeight: 600,
            color: ACCENT, background: `${ACCENT}0d`, border: `1px solid ${ACCENT}28`,
          }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
