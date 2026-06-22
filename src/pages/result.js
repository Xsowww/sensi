import { getProfile } from '../lib/sensitivity.js';
import { convertAll, GAMES } from '../lib/games.js';

export function renderResult(navigate) {
  const raw = sessionStorage.getItem('sensi_result');
  if (!raw) {
    navigate('/');
    return '<div></div>';
  }

  const data = JSON.parse(raw);
  const { cm360, dpi, rounds } = data;
  const profile = getProfile(cm360);
  const conversions = convertAll(cm360, dpi);

  const roundsHtml = rounds.map((r, i) => {
    const pct = Math.round(r.accuracy * 100);
    const barW = pct;
    const barColor = pct >= 70 ? '#00e5a0' : pct >= 50 ? '#ffb84f' : '#ff6b81';
    return `
      <div class="round-row">
        <div class="round-label">Round ${i + 1} <span class="round-cm">${Math.round(r.cm360)} cm/360°</span></div>
        <div class="round-bar-wrap">
          <div class="round-bar" style="width:${barW}%;background:${barColor}"></div>
        </div>
        <div class="round-pct" style="color:${barColor}">${pct}%</div>
      </div>
    `;
  }).join('');

  const gamesHtml = conversions.map(({ game, value }) => `
    <div class="game-item">
      <div class="game-icon-wrap" style="background:${game.color}22">
        <span>${game.emoji}</span>
      </div>
      <div class="game-info">
        <div class="game-name">${game.name}</div>
        <div class="game-detail">${game.detail(value)}</div>
      </div>
      <div class="game-value-wrap">
        <span class="game-value">${value}</span>
        <button class="copy-btn" data-value="${value}" data-game="${game.name}" title="Copier">⎘</button>
      </div>
    </div>
  `).join('');

  return /* html */`
    <div class="result-page">
      <div class="result-wrap">

        <div class="result-back">
          <button class="btn btn-ghost btn-sm" id="btn-result-back">← Refaire le test</button>
        </div>

        <div class="result-hero">
          <div class="result-hero-label">Ta sensibilité universelle</div>
          <div class="result-number">${cm360.toFixed(1)}</div>
          <div class="result-unit">cm / 360°</div>

          <div class="profile-badge">
            <span class="profile-icon">${profile.icon}</span>
            <div>
              <div class="profile-name">${profile.label}</div>
              <div class="profile-sub">${profile.sub}</div>
            </div>
          </div>
        </div>

        <div class="result-grid">

          <div class="result-section">
            <div class="rs-title">📊 Résultats par round</div>
            <div class="rounds-chart">
              ${roundsHtml}
            </div>
            <div class="rounds-note">
              L'algo a testé 4 niveaux de sensibilité et a calculé celle qui maximise ta précision.
            </div>
          </div>

          <div class="result-section">
            <div class="rs-title">🎮 Réglages par jeu</div>
            <div class="games-list">
              ${gamesHtml}
            </div>
            <div class="games-note">
              Basé sur ${dpi} DPI · ${cm360.toFixed(1)} cm/360°
            </div>
          </div>

        </div>

        <div class="result-cta">
          <div class="cta-text">
            <h3>La sensibilité évolue avec toi.</h3>
            <p>Refais le test régulièrement — après un changement de souris, de surface, ou si tu sens que quelque chose cloche.</p>
          </div>
          <button class="btn btn-primary" id="btn-retest">🔄 Refaire le test</button>
        </div>

      </div>

      <div id="copy-toast" class="copy-toast hidden">✓ Copié !</div>
    </div>
  `;
}

export function bindResult(navigate) {
  document.getElementById('btn-result-back')?.addEventListener('click', () => navigate('/setup'));
  document.getElementById('btn-retest')?.addEventListener('click', () => navigate('/setup'));

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.value;
      navigator.clipboard.writeText(val).catch(() => {});
      const toast = document.getElementById('copy-toast');
      toast.textContent = `✓ ${btn.dataset.game} : ${val} copié !`;
      toast.classList.remove('hidden');
      setTimeout(() => toast.classList.add('hidden'), 2000);
    });
  });
}
