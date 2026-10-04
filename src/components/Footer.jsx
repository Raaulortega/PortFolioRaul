import { useState, useEffect } from 'react';
import LegalModal from './LegalModal';

const SECTION = { fontWeight: 700, color: 'var(--ink)', fontSize: '0.88rem', marginBottom: 8, marginTop: 20 };
const P       = { marginBottom: 12 };

function PrivacyContent() {
  return (
    <>
      <p style={P}>Last updated: April 2026</p>

      <p style={SECTION}>1. Data Controller</p>
      <p style={P}>Raúl Ortega Pérez — raulorteegaa@gmail.com</p>

      <p style={SECTION}>2. Data Collected</p>
      <p style={P}>
        This website collects only the data you voluntarily submit through the contact form:
        your name, email address, and the content of your message. No data is collected
        automatically beyond what is strictly necessary for the site to function.
      </p>

      <p style={SECTION}>3. Purpose of Processing</p>
      <p style={P}>
        Your data is used solely to respond to your enquiry. It is not shared with third
        parties, sold, or used for marketing purposes.
      </p>

      <p style={SECTION}>4. Legal Basis</p>
      <p style={P}>
        Processing is based on your consent, given by voluntarily submitting the contact form
        (Art. 6.1.a GDPR).
      </p>

      <p style={SECTION}>5. Data Retention</p>
      <p style={P}>
        Messages are retained only for as long as necessary to handle your enquiry and are
        then deleted.
      </p>

      <p style={SECTION}>6. Cookies</p>
      <p style={P}>
        This site uses only a single functional cookie (<code>cookie_consent</code>) stored
        in your browser's local storage to remember your cookie preference. No tracking,
        analytics, or advertising cookies are used.
      </p>

      <p style={SECTION}>7. Your Rights</p>
      <p style={P}>
        Under the GDPR and Spanish data protection law (LOPDGDD), you have the right to
        access, rectify, erase, and restrict the processing of your personal data.
        To exercise these rights, contact: <strong>raulorteegaa@gmail.com</strong>
      </p>

      <p style={SECTION}>8. Supervisory Authority</p>
      <p style={P}>
        You have the right to lodge a complaint with the Spanish Data Protection Authority
        (Agencia Española de Protección de Datos — aepd.es).
      </p>
    </>
  );
}

function LegalNoticeContent() {
  return (
    <>
      <p style={P}>
        In compliance with Law 34/2002 of 11 July on Information Society Services and
        Electronic Commerce (LSSI-CE), the following information is provided:
      </p>

      <p style={SECTION}>Owner</p>
      <p style={P}>Raúl Ortega Pérez</p>

      <p style={SECTION}>Contact</p>
      <p style={P}>raulorteegaa@gmail.com</p>

      <p style={SECTION}>Purpose of the Website</p>
      <p style={P}>
        This website is a personal portfolio whose purpose is to showcase the professional
        profile, projects, and skills of the owner. It does not carry out commercial
        activities or sell products or services directly.
      </p>

      <p style={SECTION}>Intellectual Property</p>
      <p style={P}>
        All content on this website — including texts, graphics, code, and design — is the
        exclusive property of Raúl Ortega Pérez and is protected by Spanish and European
        intellectual property law. Reproduction, distribution, or public communication of
        any part of this site without express written permission is prohibited.
      </p>

      <p style={SECTION}>Limitation of Liability</p>
      <p style={P}>
        The owner is not responsible for any damages arising from the use of this website
        or from temporary unavailability of the service.
      </p>

      <p style={SECTION}>Applicable Law and Jurisdiction</p>
      <p style={P}>
        This legal notice is governed by Spanish law. Any disputes shall be submitted to
        the courts of Almería, Spain.
      </p>
    </>
  );
}

function CookiesContent() {
  return (
    <>
      <p style={P}>Last updated: April 2026</p>

      <p style={SECTION}>What are cookies?</p>
      <p style={P}>
        Cookies are small text files stored in your browser when you visit a website.
        They are used to make sites work correctly or to provide information to the site owner.
      </p>

      <p style={SECTION}>Cookies used on this site</p>
      <p style={P}>
        This website uses only one cookie:
      </p>
      <div className="legal-box">
        <div style={{ color: 'var(--leaf)', marginBottom: 6 }}>cookie_consent</div>
        <div style={{ color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--ink)' }}>Type:</strong> Functional (essential)<br />
          <strong style={{ color: 'var(--ink)' }}>Purpose:</strong> Stores your cookie preference (accepted / rejected)<br />
          <strong style={{ color: 'var(--ink)' }}>Duration:</strong> Persistent (until manually cleared)<br />
          <strong style={{ color: 'var(--ink)' }}>Third party:</strong> No
        </div>
      </div>
      <p style={P}>
        No analytics, advertising, or tracking cookies of any kind are used.
      </p>

      <p style={SECTION}>How to manage cookies</p>
      <p style={P}>
        You can delete or block cookies at any time through your browser settings.
        Note that disabling cookies may affect the functionality of some websites.
        To reset your preference on this site, clear your browser's local storage.
      </p>
    </>
  );
}

export default function Footer() {
  const [modal, setModal] = useState(null); // 'privacy' | 'legal' | 'cookies'

  /* CookieBanner dispatches this event to open the privacy modal */
  useEffect(() => {
    const handler = () => setModal('privacy');
    document.addEventListener('open-privacy', handler);
    return () => document.removeEventListener('open-privacy', handler);
  }, []);

  const links = [
    { key: 'legal',   label: 'Legal Notice' },
    { key: 'privacy', label: 'Privacy Policy' },
    { key: 'cookies', label: 'Cookie Policy' },
  ];

  const titles = { legal: 'Legal Notice', privacy: 'Privacy Policy', cookies: 'Cookie Policy' };
  const contents = { legal: <LegalNoticeContent />, privacy: <PrivacyContent />, cookies: <CookiesContent /> };

  return (
    <>
      <footer className="footer">
        <div className="container">
          <p>
            Designed &amp; built by <span>Raúl Ortega Pérez</span> · {new Date().getFullYear()}
          </p>
          <p style={{ marginTop: 8, fontSize:'0.7rem' }}>
            Made with <span>React</span> + <span>Three.js</span> + <span>Framer Motion</span>
          </p>

          <div style={{
            marginTop: 18, display: 'flex', justifyContent: 'center',
            gap: 6, flexWrap: 'wrap',
          }}>
            {links.map((l, i) => (
              <span key={l.key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {i > 0 && <span className="footer-sep">·</span>}
                <button type="button" className="footer-link" onClick={() => setModal(l.key)}>
                  {l.label}
                </button>
              </span>
            ))}
          </div>
        </div>
      </footer>

      <LegalModal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal ? titles[modal] : ''}
      >
        {modal ? contents[modal] : null}
      </LegalModal>
    </>
  );
}
