import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from '@/App';

/** Used by prerender.mjs. Only "/" is baked: the hash routes are client-side. */
export function render(url = '/') {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
}
