const COMMON_DPIS = [400, 800, 1000, 1200, 1600, 3200];

export function renderSetup(navigate) {
  return /* html */`
    <div class="setup-page page-centered">
      <div class="setup-card">
        <div class="setup-header">
          <div class="setup-step-badge">Étape 1 / 2</div>
          <h2>Configure ton setup</h2>
          <p>On a besoin de ton DPI pour calculer ta vraie sensibilité en cm/360°.</p>
        </div>

        <div class="form-group">
          <label class="form-label">DPI de ta souris</label>
          <div class="dpi-presets">
            ${COMMON_DPIS.map(d => `
              <button class="dpi-preset" data-dpi="${d}">${d}</button>
            `).join('')}
          </div>
          <div class="dpi-input-wrap">
            <input
              type="number"
              id="dpi-input"
              class="form-input"
              placeholder="ex: 800"
              min="100"
              max="25600"
              value=""
            />
            <span class="input-unit">DPI</span>
          </div>
          <p class="form-hint">
            💡 Retrouve ton DPI dans le logiciel de ta souris (Razer Synapse, G Hub, SteelSeries GG…) ou sur le site du fabricant.
          </p>
        </div>

        <div class="form-group">
          <label class="form-label">Exercices à passer</label>
          <div class="exercise-picks">
            <label class="ex-pick active" data-ex="flick">
              <input type="checkbox" checked name="ex" value="flick" />
              <div class="ex-pick-icon">🎯</div>
              <div class="ex-pick-info">
                <div class="ex-pick-name">Flick Shot</div>
                <div class="ex-pick-sub">Snap vers des cibles soudaines</div>
              </div>
              <div class="ex-pick-check">✓</div>
            </label>
            <label class="ex-pick active" data-ex="tracking">
              <input type="checkbox" checked name="ex" value="tracking" />
              <div class="ex-pick-icon">🔄</div>
              <div class="ex-pick-info">
                <div class="ex-pick-name">Tracking</div>
                <div class="ex-pick-sub">Suivre une cible en mouvement</div>
              </div>
              <div class="ex-pick-check">✓</div>
            </label>
          </div>
        </div>

        <div class="setup-tips">
          <div class="tip-title">⚙️ Avant de commencer</div>
          <ul class="tip-list">
            <li>Désactive l'accélération de souris dans les paramètres Windows/macOS</li>
            <li>Reste en plein écran ou dans une grande fenêtre navigateur</li>
            <li>Utilise une surface propre et plane</li>
          </ul>
        </div>

        <div class="setup-actions">
          <button class="btn btn-ghost" id="setup-back">← Retour</button>
          <button class="btn btn-primary btn-lg" id="setup-next" disabled>
            Lancer le test →
          </button>
        </div>

        <div id="dpi-error" class="form-error hidden">
          Entre un DPI entre 100 et 25600.
        </div>
      </div>
    </div>
  `;
}

export function bindSetup(navigate) {
  const input = document.getElementById('dpi-input');
  const nextBtn = document.getElementById('setup-next');
  const errorEl = document.getElementById('dpi-error');

  // DPI preset buttons
  document.querySelectorAll('.dpi-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.dpi-preset').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      input.value = btn.dataset.dpi;
      validate();
    });
  });

  // Exercise toggles
  document.querySelectorAll('.ex-pick').forEach(label => {
    label.addEventListener('click', (e) => {
      if (e.target.tagName === 'INPUT') return;
      const cb = label.querySelector('input');
      cb.checked = !cb.checked;
      label.classList.toggle('active', cb.checked);
    });
  });

  function validate() {
    const val = parseInt(input.value);
    const valid = val >= 100 && val <= 25600 && !isNaN(val);
    nextBtn.disabled = !valid;
    errorEl.classList.toggle('hidden', valid || !input.value);
    return valid;
  }

  input.addEventListener('input', () => {
    document.querySelectorAll('.dpi-preset').forEach(b => b.classList.remove('active'));
    validate();
  });

  nextBtn.addEventListener('click', () => {
    if (!validate()) return;
    const dpi = parseInt(input.value);
    const exercises = [...document.querySelectorAll('.ex-pick input:checked')].map(c => c.value);
    if (!exercises.length) exercises.push('flick');
    sessionStorage.setItem('sensi_dpi', dpi);
    sessionStorage.setItem('sensi_exercises', JSON.stringify(exercises));
    navigate('/test');
  });

  document.getElementById('setup-back')?.addEventListener('click', () => navigate('/'));
}
