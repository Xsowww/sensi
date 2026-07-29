import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import '@/index.css';
import App from '@/App';

const container = document.getElementById('root')!;
const app = (
  <StrictMode>
    {/* Hash routing keeps the build a set of static files with no server
        rewrites, so it works from a subdirectory and inside the single-file
        artifact. Swap for BrowserRouter, and prerender one HTML file per
        listing, when this goes on a real domain: see the README. */}
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);

if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
