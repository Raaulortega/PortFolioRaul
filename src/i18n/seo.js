// Per-language <head> tags: title, description, canonical, hreflang, Open
// Graph and JSON-LD. scripts/prerender.mjs injects buildHead(lang) into each
// prerendered page, so this is the single source for the site's SEO metadata.
const SITE = 'https://iamraul.pro';
const IMAGE = `${SITE}/og-image-2026.png`;

export const PAGE_URL = {
  en: `${SITE}/`,
  es: `${SITE}/es`,
};

const META = {
  en: {
    ogLocale: 'en_GB',
    title: 'Raúl Ortega Pérez — Full Stack Software Developer',
    description:
      'Full Stack Software Developer and Computer Engineering graduate (UAL, Spain). React, Node.js, Java, Python and cybersecurity. Open to work across Europe.',
    ogDescription:
      'Computer Engineering graduate from Spain. Full Stack Developer: React, Node.js, Java, Python and cybersecurity. Open to work and relocation across Europe.',
    imageAlt: 'Raúl Ortega Pérez — Full Stack Software Developer portfolio',
    jobTitle: 'Full Stack Software Developer',
    personDescription:
      'Full Stack Software Developer and Computer Engineering graduate from the University of Almería (Spain). React, Node.js, Java, Python and cybersecurity. Open to work and relocation across Europe.',
    degree: "Bachelor's Degree in Computer Engineering",
    university: 'University of Almería',
  },
  es: {
    ogLocale: 'es_ES',
    title: 'Raúl Ortega Pérez — Desarrollador Full Stack',
    description:
      'Desarrollador Full Stack e Ingeniero Informático por la Universidad de Almería. React, Node.js, Java, Python y ciberseguridad. Disponible para trabajar.',
    ogDescription:
      'Ingeniero Informático por la Universidad de Almería. Desarrollador Full Stack: React, Node.js, Java, Python y ciberseguridad. Disponible en España y Europa.',
    imageAlt: 'Raúl Ortega Pérez — portfolio de desarrollador Full Stack',
    jobTitle: 'Desarrollador de Software Full Stack',
    personDescription:
      'Desarrollador de software Full Stack e Ingeniero Informático por la Universidad de Almería (España). React, Node.js, Java, Python y ciberseguridad. Disponible para trabajar en España, en remoto o con reubicación en Europa.',
    degree: 'Grado en Ingeniería Informática',
    university: 'Universidad de Almería',
  },
};

const KNOWS_ABOUT = [
  'Software Development', 'Full Stack Development', 'Web Development',
  'React', 'JavaScript', 'TypeScript', 'Node.js', 'Express',
  'Java', 'Spring Boot', 'Python', 'FastAPI',
  'Three.js', 'Docker', 'Microservices', 'REST APIs', 'WebSockets',
  'SQL', 'PostgreSQL', 'MongoDB', 'Git',
  'Cybersecurity', 'Penetration Testing', 'OWASP', 'Application Security',
];

const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function jsonLd(lang, m) {
  const url = PAGE_URL[lang];
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${url}#profile`,
        url,
        name: m.title,
        inLanguage: lang,
        dateModified: new Date().toISOString().slice(0, 10),
        isPartOf: { '@id': `${SITE}/#website` },
        mainEntity: { '@id': `${SITE}/#person` },
      },
      {
        '@type': 'Person',
        '@id': `${SITE}/#person`,
        name: 'Raúl Ortega Pérez',
        alternateName: 'Raúl Ortega',
        url,
        image: IMAGE,
        jobTitle: m.jobTitle,
        description: m.personDescription,
        email: 'mailto:raulorteegaa@gmail.com',
        knowsLanguage: ['es', 'en'],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Almería',
          addressRegion: 'Andalucía',
          addressCountry: 'ES',
        },
        alumniOf: {
          '@type': 'CollegeOrUniversity',
          name: m.university,
          alternateName: 'UAL',
          url: 'https://www.ual.es',
        },
        hasCredential: {
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'degree',
          name: m.degree,
          recognizedBy: { '@type': 'CollegeOrUniversity', name: m.university },
        },
        knowsAbout: KNOWS_ABOUT,
        sameAs: ['https://github.com/Raaulortega', 'https://linkedin.com/in/RaaulOrteega'],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        url: `${SITE}/`,
        name: 'Raúl Ortega Pérez',
        inLanguage: ['en', 'es'],
        publisher: { '@id': `${SITE}/#person` },
      },
    ],
  };
  // "<" is escaped so the JSON can never close the <script> element early.
  return JSON.stringify(graph, null, 2).replace(/</g, '\\u003c');
}

export function buildHead(lang) {
  const m = META[lang];
  const url = PAGE_URL[lang];
  const altLocale = META[lang === 'en' ? 'es' : 'en'].ogLocale;
  return `<title>${attr(m.title)}</title>
    <meta name="description" content="${attr(m.description)}" />
    <meta name="author" content="Raúl Ortega Pérez" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${url}" />
    <link rel="alternate" hreflang="en" href="${PAGE_URL.en}" />
    <link rel="alternate" hreflang="es" href="${PAGE_URL.es}" />
    <link rel="alternate" hreflang="x-default" href="${PAGE_URL.en}" />
    <meta property="og:type" content="profile" />
    <meta property="og:url" content="${url}" />
    <meta property="og:site_name" content="Raúl Ortega Pérez" />
    <meta property="og:title" content="${attr(m.title)}" />
    <meta property="og:description" content="${attr(m.ogDescription)}" />
    <meta property="og:image" content="${IMAGE}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${attr(m.imageAlt)}" />
    <meta property="og:locale" content="${m.ogLocale}" />
    <meta property="og:locale:alternate" content="${altLocale}" />
    <meta property="profile:first_name" content="Raúl" />
    <meta property="profile:last_name" content="Ortega Pérez" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${attr(m.title)}" />
    <meta name="twitter:description" content="${attr(m.ogDescription)}" />
    <meta name="twitter:image" content="${IMAGE}" />
    <script type="application/ld+json">
${jsonLd(lang, m)}
    </script>`;
}
