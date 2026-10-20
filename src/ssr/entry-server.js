import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import App from '../App.jsx';
import { LANGS } from '../i18n/lang.js';
import { buildHead } from '../i18n/seo.js';

// Build-time entry for scripts/prerender.mjs. Plain .js (no JSX) because it
// exports helpers, not components.
export { LANGS, buildHead };

export function render(lang) {
  return renderToString(createElement(App, { lang }));
}
