// Injects the server-rendered app into dist/index.html so crawlers that
// don't run JavaScript (Bing, LinkedIn, AI search bots) still see the full
// page content. The client mounts with createRoot, which replaces this
// markup on load, so the static HTML only has to match the content.
import { readFile, rm, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const htmlPath = path.join(root, 'dist', 'index.html');
const ssrDir = path.join(root, 'dist-ssr');

const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);
const appHtml = render();

const template = await readFile(htmlPath, 'utf8');
const marker = '<div id="root"></div>';
if (!template.includes(marker)) {
  throw new Error(`prerender: ${marker} not found in dist/index.html`);
}

await writeFile(htmlPath, template.replace(marker, () => `<div id="root">${appHtml}</div>`));
await rm(ssrDir, { recursive: true, force: true });

console.log(`prerender: injected ${(appHtml.length / 1024).toFixed(1)} kB of HTML into dist/index.html`);
