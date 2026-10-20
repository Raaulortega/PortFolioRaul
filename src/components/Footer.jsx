import { useState, useEffect } from 'react';
import LegalModal from './LegalModal';
import { useCopy, useLang } from '../i18n/lang';

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

function PrivacyContentEs() {
  return (
    <>
      <p style={P}>Última actualización: octubre de 2026</p>

      <p style={SECTION}>1. Responsable del tratamiento</p>
      <p style={P}>Raúl Ortega Pérez — raulorteegaa@gmail.com</p>

      <p style={SECTION}>2. Datos recogidos</p>
      <p style={P}>
        Esta web solo recoge los datos que envías voluntariamente a través del formulario de
        contacto: tu nombre, tu correo electrónico y el contenido de tu mensaje. No se recoge
        automáticamente ningún dato más allá de lo estrictamente necesario para que la web funcione.
      </p>

      <p style={SECTION}>3. Finalidad del tratamiento</p>
      <p style={P}>
        Tus datos se usan únicamente para responder a tu consulta. No se ceden a terceros, no se
        venden y no se usan con fines comerciales.
      </p>

      <p style={SECTION}>4. Base legal</p>
      <p style={P}>
        El tratamiento se basa en tu consentimiento, que das al enviar voluntariamente el
        formulario de contacto (art. 6.1.a RGPD).
      </p>

      <p style={SECTION}>5. Conservación de los datos</p>
      <p style={P}>
        Los mensajes se conservan solo el tiempo necesario para atender tu consulta y después se eliminan.
      </p>

      <p style={SECTION}>6. Cookies</p>
      <p style={P}>
        Esta web usa una única cookie funcional (<code>cookie_consent</code>), guardada en el
        almacenamiento local de tu navegador para recordar tu preferencia de cookies. No se usan
        cookies de análisis, publicidad ni seguimiento.
      </p>

      <p style={SECTION}>7. Tus derechos</p>
      <p style={P}>
        Según el RGPD y la Ley Orgánica de Protección de Datos (LOPDGDD), tienes derecho a acceder,
        rectificar, suprimir y limitar el tratamiento de tus datos personales. Para ejercerlos,
        escribe a: <strong>raulorteegaa@gmail.com</strong>
      </p>

      <p style={SECTION}>8. Autoridad de control</p>
      <p style={P}>
        Puedes presentar una reclamación ante la Agencia Española de Protección de Datos (aepd.es).
      </p>
    </>
  );
}

function LegalNoticeContentEs() {
  return (
    <>
      <p style={P}>
        En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la
        Información y de Comercio Electrónico (LSSI-CE), se facilita la siguiente información:
      </p>

      <p style={SECTION}>Titular</p>
      <p style={P}>Raúl Ortega Pérez</p>

      <p style={SECTION}>Contacto</p>
      <p style={P}>raulorteegaa@gmail.com</p>

      <p style={SECTION}>Finalidad de la web</p>
      <p style={P}>
        Esta web es un portfolio personal cuya finalidad es mostrar el perfil profesional, los
        proyectos y las habilidades de su titular. No realiza actividades comerciales ni vende
        productos o servicios directamente.
      </p>

      <p style={SECTION}>Propiedad intelectual</p>
      <p style={P}>
        Todo el contenido de esta web — textos, gráficos, código y diseño — es propiedad exclusiva
        de Raúl Ortega Pérez y está protegido por la legislación española y europea de propiedad
        intelectual. Queda prohibida la reproducción, distribución o comunicación pública de
        cualquier parte de esta web sin autorización expresa y por escrito.
      </p>

      <p style={SECTION}>Limitación de responsabilidad</p>
      <p style={P}>
        El titular no se hace responsable de los daños derivados del uso de esta web ni de su
        falta de disponibilidad temporal.
      </p>

      <p style={SECTION}>Legislación aplicable y jurisdicción</p>
      <p style={P}>
        Este aviso legal se rige por la legislación española. Cualquier controversia se someterá a
        los juzgados y tribunales de Almería (España).
      </p>
    </>
  );
}

function CookiesContentEs() {
  return (
    <>
      <p style={P}>Última actualización: octubre de 2026</p>

      <p style={SECTION}>¿Qué son las cookies?</p>
      <p style={P}>
        Las cookies son pequeños archivos de texto que se guardan en tu navegador al visitar una
        web. Sirven para que la web funcione correctamente o para dar información a su titular.
      </p>

      <p style={SECTION}>Cookies que usa esta web</p>
      <p style={P}>
        Esta web usa una sola cookie:
      </p>
      <div className="legal-box">
        <div style={{ color: 'var(--leaf)', marginBottom: 6 }}>cookie_consent</div>
        <div style={{ color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--ink)' }}>Tipo:</strong> Funcional (esencial)<br />
          <strong style={{ color: 'var(--ink)' }}>Finalidad:</strong> Guarda tu preferencia de cookies (aceptadas / rechazadas)<br />
          <strong style={{ color: 'var(--ink)' }}>Duración:</strong> Persistente (hasta que la borres)<br />
          <strong style={{ color: 'var(--ink)' }}>De terceros:</strong> No
        </div>
      </div>
      <p style={P}>
        No se usa ninguna cookie de análisis, publicidad o seguimiento.
      </p>

      <p style={SECTION}>Cómo gestionar las cookies</p>
      <p style={P}>
        Puedes borrar o bloquear las cookies cuando quieras desde la configuración de tu navegador.
        Ten en cuenta que desactivarlas puede afectar al funcionamiento de algunas webs. Para
        restablecer tu preferencia en esta web, borra el almacenamiento local del navegador.
      </p>
    </>
  );
}

const COPY = {
  en: {
    titles: { legal: 'Legal Notice', privacy: 'Privacy Policy', cookies: 'Cookie Policy' },
    builtBy: 'Designed & built by',
    madeWith: 'Made with',
  },
  es: {
    titles: { legal: 'Aviso legal', privacy: 'Política de privacidad', cookies: 'Política de cookies' },
    builtBy: 'Diseñado y desarrollado por',
    madeWith: 'Hecho con',
  },
};

const CONTENTS = {
  en: { legal: <LegalNoticeContent />, privacy: <PrivacyContent />, cookies: <CookiesContent /> },
  es: { legal: <LegalNoticeContentEs />, privacy: <PrivacyContentEs />, cookies: <CookiesContentEs /> },
};

export default function Footer() {
  const { titles, builtBy, madeWith } = useCopy(COPY);
  const contents = CONTENTS[useLang()];
  const [modal, setModal] = useState(null); // 'privacy' | 'legal' | 'cookies'

  /* CookieBanner dispatches this event to open the privacy modal */
  useEffect(() => {
    const handler = () => setModal('privacy');
    document.addEventListener('open-privacy', handler);
    return () => document.removeEventListener('open-privacy', handler);
  }, []);

  const links = ['legal', 'privacy', 'cookies'].map((key) => ({ key, label: titles[key] }));

  return (
    <>
      <footer className="footer">
        <div className="container">
          <p>
            {builtBy} <span>Raúl Ortega Pérez</span> · {new Date().getFullYear()}
          </p>
          <p style={{ marginTop: 8, fontSize:'0.7rem' }}>
            {madeWith} <span>React</span> + <span>Three.js</span> + <span>Framer Motion</span>
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
