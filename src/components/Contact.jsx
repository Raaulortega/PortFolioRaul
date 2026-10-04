import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Send } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

// ✏️  Paste your Formspree endpoint here after creating the form at formspree.io
const FORMSPREE_URL = 'https://formspree.io/f/xwvakbbk';

export default function Contact() {
  const [ref, visible] = useReveal();
  const [form, setForm] = useState({ name:'', email:'', message:'' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('sent');
        setForm({ name:'', email:'', message:'' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 4000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <section id="contact" className="section-sky">
      <div className="container" ref={ref}>
        <motion.div
          initial={{ opacity:0, y:30 }}
          animate={visible ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.7 }}
          style={{ marginBottom:60 }}
        >
          <div className="section-tag">contact</div>
          <h2 className="section-title">
            Let's{' '}
            <span className="gradient-text">work together</span>
          </h2>
          <p className="section-subtitle">
            I'm actively looking for new opportunities. Whether you have a project in mind
            or just want to say hello — my inbox is always open.
          </p>
        </motion.div>

        <div className="contact-grid">
          {/* Left */}
          <motion.div
            className="contact-info"
            initial={{ opacity:0, x:-30 }}
            animate={visible ? { opacity:1, x:0 } : {}}
            transition={{ delay:0.15, duration:0.7 }}
          >
            <div className="contact-links">
              {[
                {
                  icon: <Mail size={18}/>,
                  label: 'Email',
                  value: 'raulorteegaa@gmail.com',
                  href: 'mailto:raulorteegaa@gmail.com',
                },
                {
                  icon: <Github size={18}/>,
                  label: 'GitHub',
                  value: 'github.com/Raaulortega',
                  href: 'https://github.com/Raaulortega',
                },
                {
                  icon: <Linkedin size={18}/>,
                  label: 'LinkedIn',
                  value: 'linkedin.com/in/RaaulOrteega',
                  href: 'https://linkedin.com/in/RaaulOrteega',
                },
              ].map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="contact-link-item"
                >
                  <div className="icon-wrap">{item.icon}</div>
                  <div>
                    <div className="contact-link-label">{item.label}</div>
                    <div style={{ fontSize:'0.88rem' }}>{item.value}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Availability card */}
            <motion.div
              className="availability-card"
              initial={{ opacity:0, y:20 }}
              animate={visible ? { opacity:1, y:0 } : {}}
              transition={{ delay:0.4 }}
            >
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                <div className="status-dot" />
                <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.76rem', fontWeight:500, color:'var(--leaf)' }}>
                  Available for work
                </span>
              </div>
              <p style={{ fontSize:'0.88rem', color:'var(--ink-soft)', lineHeight:1.6 }}>
                Currently open to <strong style={{ color:'var(--ink)' }}>full-time</strong> and{' '}
                <strong style={{ color:'var(--ink)' }}>freelance</strong> opportunities.
              </p>
            </motion.div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity:0, x:30 }}
            animate={visible ? { opacity:1, x:0 } : {}}
            transition={{ delay:0.2, duration:0.7 }}
          >
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  id="name" name="name" type="text"
                  placeholder="Your name"
                  value={form.name} onChange={handleChange} required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email" name="email" type="email"
                  placeholder="your@email.com"
                  value={form.email} onChange={handleChange} required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message" name="message"
                  placeholder="Tell me about your project..."
                  value={form.message} onChange={handleChange} required
                />
              </div>
              <motion.button
                type="submit"
                className="btn-primary"
                style={{ alignSelf:'flex-start', border:'none' }}
                whileHover={{ scale:1.02 }}
                whileTap={{ scale:0.98 }}
              >
                {status === 'sending' && 'Sending…'}
              {status === 'sent'    && '✓ Message sent!'}
              {status === 'error'   && '✕ Something went wrong'}
              {status === 'idle'    && <><Send size={15} /> Send message</>}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
