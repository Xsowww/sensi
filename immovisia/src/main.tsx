import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import '@/index.css';
import App from '@/App';

const container = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// The production build ships prerendered markup, so hydrate it rather than
// throwing it away. `npm run dev` serves an empty root and mounts normally.
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
