import { renderToString } from 'react-dom/server';
import App from '@/App';

/** Used by prerender.mjs at build time to bake static HTML into dist/index.html. */
export function render() {
  return renderToString(<App />);
}
