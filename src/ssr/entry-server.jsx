import { renderToString } from 'react-dom/server';
import App from '../App.jsx';
import { LANGS } from '../i18n/lang.js';
import { buildHead } from '../i18n/seo.js';

export { LANGS, buildHead };

export function render(lang) {
  return renderToString(<App lang={lang} />);
}
