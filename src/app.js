import { renderLanding, bindLanding } from './pages/landing.js';
import { renderSetup, bindSetup } from './pages/setup.js';
import { renderTest, bindTest } from './pages/test.js';
import { renderResult, bindResult } from './pages/result.js';

const routes = {
  '/':       { render: renderLanding, bind: bindLanding },
  '/setup':  { render: renderSetup,   bind: bindSetup   },
  '/test':   { render: renderTest,    bind: bindTest    },
  '/result': { render: renderResult,  bind: bindResult  },
};

const app = document.getElementById('app');
const nav = document.getElementById('nav');

function navigate(path) {
  window.history.pushState({}, '', path);
  render(path);
}

// Expose globally for test page timeout callback
window._sensiNavigate = navigate;

function render(path) {
  const route = routes[path] || routes['/'];

  // Show/hide nav
  const hideNav = path === '/test';
  nav.classList.toggle('hidden', hideNav);
  document.body.classList.toggle('no-scroll', path === '/test');

  app.innerHTML = route.render(navigate);
  route.bind(navigate);

  window.scrollTo(0, 0);
}

// Handle browser back/forward
window.addEventListener('popstate', () => {
  render(window.location.pathname);
});

// Initial render
render(window.location.pathname === '/' || !routes[window.location.pathname]
  ? '/'
  : window.location.pathname
);
