/* Immo'visia homepage behaviour.
   Scroll state is read with IntersectionObserver only: no scroll listeners,
   so nothing runs per frame. */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- sticky nav state ---------- */

  var nav = document.getElementById('nav');
  var sentinel = document.getElementById('top-sentinel');

  if (nav && sentinel && 'IntersectionObserver' in window) {
    new IntersectionObserver(
      function (entries) {
        nav.classList.toggle('is-stuck', !entries[0].isIntersecting);
      },
      { threshold: 0 }
    ).observe(sentinel);
  }

  /* ---------- scroll reveal ---------- */

  var revealables = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealables.forEach(function (el) {
      el.classList.add('is-in');
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealables.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---------- mobile menu ---------- */

  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');
  var toggleIco = document.getElementById('nav-toggle-ico');

  function setMenu(open) {
    if (!toggle || !links) return;
    links.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    if (toggleIco) {
      toggleIco.firstElementChild.setAttribute('href', open ? '#i-x' : '#i-list');
    }
  }

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    links.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });

    window.matchMedia('(min-width: 881px)').addEventListener('change', function (event) {
      if (event.matches) setMenu(false);
    });
  }

  /* ---------- contact form ---------- */

  var form = document.getElementById('contact-form');
  var done = document.getElementById('form-done');
  var submit = document.getElementById('f-submit');

  var rules = {
    'f-name': function (value) {
      if (value.trim().length < 2) return 'Indiquez votre nom.';
      return '';
    },
    'f-email': function (value) {
      if (!value.trim()) return 'Indiquez votre email.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())) {
        return 'Cet email ne semble pas valide.';
      }
      return '';
    },
    'f-message': function (value) {
      if (value.trim().length < 10) return 'Décrivez votre projet en quelques mots.';
      return '';
    }
  };

  function showError(id, message) {
    var input = document.getElementById(id);
    var box = document.getElementById(id.replace('f-', 'e-'));
    if (!input || !box) return;

    if (message) {
      input.setAttribute('aria-invalid', 'true');
      box.querySelector('span').textContent = message;
      box.hidden = false;
    } else {
      input.removeAttribute('aria-invalid');
      box.hidden = true;
    }
  }

  function validate(id) {
    var input = document.getElementById(id);
    if (!input) return true;
    var message = rules[id](input.value);
    showError(id, message);
    return !message;
  }

  if (form) {
    Object.keys(rules).forEach(function (id) {
      var input = document.getElementById(id);
      if (!input) return;
      // Only re-validate on blur once the field has been touched, so the form
      // does not shout at someone still filling it in.
      input.addEventListener('blur', function () {
        if (input.value.trim()) validate(id);
      });
      input.addEventListener('input', function () {
        if (input.getAttribute('aria-invalid') === 'true') validate(id);
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      // map before every: every() short-circuits, which would leave every field
      // after the first invalid one silently unflagged.
      var checks = Object.keys(rules).map(function (id) {
        return validate(id);
      });
      var ok = checks.every(Boolean);

      if (!ok) {
        var firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      submit.disabled = true;
      submit.textContent = 'Envoi en cours';

      // TODO: POST the payload to the agency's mail endpoint or CRM.
      // Nothing is sent yet; this only drives the success state.
      window.setTimeout(function () {
        form.hidden = true;
        if (done) done.hidden = false;
      }, 700);
    });
  }

  /* ---------- footer year ---------- */

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
