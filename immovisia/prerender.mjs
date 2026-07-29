/* Renders the app to static HTML after the client build, so the page is
   readable without JavaScript and crawlers get real markup. Restores the
   behaviour the static site had before the React migration. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, 'dist');

const { render } = await import(path.join(root, 'dist-ssr/entry-server.js'));
const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

const marker = '<div id="root"></div>';
if (!html.includes(marker)) {
  throw new Error('prerender: root marker not found in dist/index.html');
}

const out = html.replace(marker, `<div id="root">${render()}</div>`);
fs.writeFileSync(path.join(dist, 'index.html'), out);
fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true });

console.log(`prerendered dist/index.html (${(out.length / 1024).toFixed(1)} kB)`);
