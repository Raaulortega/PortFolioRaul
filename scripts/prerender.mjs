// Writes one prerendered page per language: dist/index.html (English) and
// dist/es/index.html (Spanish). Each gets its own <html lang>, SEO head from
// src/i18n/seo.js and the server-rendered app, so crawlers that don't run
// JavaScript (Bing, LinkedIn, AI search bots) still see the full content.
// The client mounts with createRoot, which replaces the markup on load.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const { LANGS, buildHead, render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);

const template = await readFile(path.join(dist, 'index.html'), 'utf8');

function replaceOnce(html, pattern, value, what) {
  if (!pattern.test(html)) throw new Error(`prerender: ${what} not found in dist/index.html`);
  // Function replacement so "$" in the content is never read as a pattern.
  return html.replace(pattern, () => value);
}

for (const lang of LANGS) {
  let html = template;
  html = replaceOnce(html, /<html lang="[^"]*">/, `<html lang="${lang}">`, '<html lang>');
  html = replaceOnce(html, /<!--seo:start-->[\s\S]*?<!--seo:end-->/, buildHead(lang), 'SEO marker');
  html = replaceOnce(html, /<div id="root"><\/div>/, `<div id="root">${render(lang)}</div>`, 'root element');

  const outDir = lang === 'en' ? dist : path.join(dist, lang);
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, 'index.html'), html);
  console.log(`prerender: ${path.relative(root, path.join(outDir, 'index.html'))} (${(html.length / 1024).toFixed(1)} kB)`);
}

await rm(ssrDir, { recursive: true, force: true });
