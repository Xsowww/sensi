import { getTestRounds, estimateBestCm360, scaleToCm360 } from '../lib/sensitivity.js';

const TARGETS_PER_ROUND = 10;
const TARGET_RADIUS = 28;
const HIT_RADIUS = 38;

let canvas, ctx, animFrame;
let crossX, crossY;
let currentTarget = null;
let roundResults = [];
let currentRound = 0;
let rounds = [];
let hits = 0, shots = 0;
let roundHits = 0, roundShots = 0;
let errors = [];
let dpi = 800;
let state = 'idle'; // idle | running | between | done

export function renderTest(navigate) {
  const storedDpi = parseInt(sessionStorage.getItem('sensi_dpi') || '800');
  dpi = storedDpi;

  return /* html */`
    <div class="test-page">
      <div id="test-overlay" class="test-overlay">
        <div class="overlay-card" id="overlay-start">
          <div class="overlay-icon">🎯</div>
          <h2>Flick Shot</h2>
          <p>
            Des cibles vont apparaître aléatoirement sur l'écran.<br />
            Clique dessus aussi vite et précisément que possible.<br /><br />
            <strong>4 rounds · ${TARGETS_PER_ROUND} cibles chacun</strong> — l'algo ajuste la sensibilité entre chaque round.
          </p>
          <div class="overlay-tip">
            💡 Ta souris va être capturée par la fenêtre. Appuie sur <kbd>Échap</kbd> pour la libérer.
          </div>
          <button class="btn btn-primary btn-lg" id="btn-start-test">
            Commencer →
          </button>
          <button class="btn btn-ghost" id="btn-test-back">← Retour</button>
        </div>

        <div class="overlay-card hidden" id="overlay-between">
          <div class="overlay-icon" id="between-icon">📊</div>
          <h2 id="between-title">Round terminé !</h2>
          <p id="between-desc"></p>
          <div class="round-stats" id="round-stats"></div>
          <button class="btn btn-primary btn-lg" id="btn-next-round">
            Round suivant →
          </button>
        </div>

        <div class="overlay-card hidden" id="overlay-done">
          <div class="overlay-icon">🏁</div>
          <h2>Test terminé !</h2>
          <p>Analyse des résultats en cours…</p>
          <div class="spinner"></div>
        </div>
      </div>

      <canvas id="test-canvas"></canvas>

      <div class="test-hud">
        <div class="hud-pill" id="hud-round">Round 1/4</div>
        <div class="hud-pill" id="hud-hits">0/${TARGETS_PER_ROUND} hits</div>
        <div class="hud-pill accent" id="hud-sens">— cm/360°</div>
      </div>

      <div class="test-progress-bar">
        <div class="test-progress-fill" id="test-progress"></div>
      </div>
    </div>
  `;
}

export function bindTest(navigate) {
  canvas = document.getElementById('test-canvas');
  ctx = canvas.getContext('2d');

  resetState();

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  document.getElementById('btn-start-test')?.addEventListener('click', startTest);
  document.getElementById('btn-test-back')?.addEventListener('click', () => {
    cleanup();
    navigate('/setup');
  });

  document.addEventListener('pointerlockchange', onPointerLockChange);
  document.addEventListener('pointerlockerror', onPointerLockError);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('click', onCanvasClick);

  drawIdle();
}

function resetState() {
  state = 'idle';
  roundResults = [];
  currentRound = 0;
  hits = 0; shots = 0;
  roundHits = 0; roundShots = 0;
  errors = [];
  currentTarget = null;
  crossX = canvas ? canvas.width / 2 : 400;
  crossY = canvas ? canvas.height / 2 : 300;
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  crossX = canvas.width / 2;
  crossY = canvas.height / 2;

  const storedDpi = parseInt(sessionStorage.getItem('sensi_dpi') || '800');
  dpi = storedDpi;
  rounds = getTestRounds(dpi, canvas.width);
}

function cleanup() {
  cancelAnimationFrame(animFrame);
  window.removeEventListener('resize', resizeCanvas);
  document.removeEventListener('pointerlockchange', onPointerLockChange);
  document.removeEventListener('pointerlockerror', onPointerLockError);
  if (document.pointerLockElement) document.exitPointerLock();
}

// ── POINTER LOCK ──────────────────────────────────────────────────────────────

function startTest() {
  document.getElementById('overlay-start').classList.add('hidden');
  document.getElementById('test-overlay').classList.add('hidden');
  canvas.requestPointerLock();
}

function onPointerLockChange() {
  if (document.pointerLockElement === canvas) {
    if (state === 'idle') {
      state = 'running';
      startRound(currentRound);
    }
  } else {
    if (state === 'running') {
      // Pointer lock lost mid-round — show overlay to re-engage
      state = 'idle';
      document.getElementById('test-overlay').classList.remove('hidden');
      document.getElementById('overlay-start').classList.remove('hidden');
      document.getElementById('overlay-start').querySelector('h2').textContent = 'Reprendre le test';
    }
  }
}

function onPointerLockError() {
  alert('Impossible de capturer la souris. Assure-toi d\'être en HTTPS ou localhost.');
}

// ── ROUND LOGIC ───────────────────────────────────────────────────────────────

function startRound(idx) {
  currentRound = idx;
  roundHits = 0;
  roundShots = 0;
  errors = [];

  const round = rounds[idx];
  updateHUD();
  spawnTarget();
  draw();
}

function spawnTarget() {
  const margin = TARGET_RADIUS + 20;
  currentTarget = {
    x: margin + Math.random() * (canvas.width - margin * 2),
    y: margin + Math.random() * (canvas.height - margin * 2),
    born: performance.now(),
  };
}

function onMouseMove(e) {
  if (state !== 'running') return;
  if (!document.pointerLockElement) return;

  const scale = rounds[currentRound]?.scale ?? 1;
  crossX = Math.max(0, Math.min(canvas.width, crossX + e.movementX * scale));
  crossY = Math.max(0, Math.min(canvas.height, crossY + e.movementY * scale));
}

function onCanvasClick(e) {
  if (state !== 'running') return;
  if (!currentTarget) return;
  if (!document.pointerLockElement) return;

  const dist = Math.hypot(crossX - currentTarget.x, crossY - currentTarget.y);
  const hit = dist <= HIT_RADIUS;
  const reactionTime = performance.now() - currentTarget.born;

  roundShots++;
  shots++;
  errors.push(dist);

  if (hit) {
    roundHits++;
    hits++;
    flashHit(currentTarget.x, currentTarget.y, true);
  } else {
    flashHit(currentTarget.x, currentTarget.y, false);
  }

  updateHUD();

  if (roundShots >= TARGETS_PER_ROUND) {
    finishRound();
    return;
  }
  spawnTarget();
}

function finishRound() {
  state = 'between';
  const round = rounds[currentRound];
  const accuracy = roundHits / TARGETS_PER_ROUND;
  const avgError = errors.reduce((a, b) => a + b, 0) / errors.length;
  const cm360 = scaleToCm360(round.scale, dpi, canvas.width);

  roundResults.push({
    scale: round.scale,
    cm360,
    accuracy,
    avgError,
    hits: roundHits,
    total: TARGETS_PER_ROUND,
  });

  if (currentRound < rounds.length - 1) {
    showBetweenRound(accuracy, avgError, cm360);
  } else {
    showDone();
  }
}

function showBetweenRound(accuracy, avgError, cm360) {
  document.exitPointerLock();
  document.getElementById('test-overlay').classList.remove('hidden');
  document.getElementById('overlay-between').classList.remove('hidden');

  const pct = Math.round(accuracy * 100);
  let icon = '😐';
  let desc = '';
  if (pct >= 80) { icon = '🔥'; desc = 'Excellent ! La sensibilité semble bien calibrée.'; }
  else if (pct >= 60) { icon = '👍'; desc = 'Pas mal. On continue à affiner.'; }
  else if (pct >= 40) { icon = '🤔'; desc = 'C\'est difficile à cette sensibilité — l\'algo va ajuster.'; }
  else { icon = '😅'; desc = 'Sensibilité peu adaptée — le prochain round sera différent.'; }

  document.getElementById('between-icon').textContent = icon;
  document.getElementById('between-title').textContent = `Round ${currentRound + 1} terminé !`;
  document.getElementById('between-desc').textContent = desc;
  document.getElementById('round-stats').innerHTML = `
    <div class="rs-item"><span class="rs-val">${pct}%</span><span class="rs-lbl">Précision</span></div>
    <div class="rs-item"><span class="rs-val">${Math.round(cm360)} cm/360°</span><span class="rs-lbl">Sensibilité testée</span></div>
    <div class="rs-item"><span class="rs-val">${roundHits}/${TARGETS_PER_ROUND}</span><span class="rs-lbl">Hits</span></div>
  `;

  const nextBtn = document.getElementById('btn-next-round');
  nextBtn.onclick = () => {
    document.getElementById('overlay-between').classList.add('hidden');
    document.getElementById('test-overlay').classList.add('hidden');
    state = 'running';
    currentRound++;
    roundHits = 0; roundShots = 0; errors = [];
    startRound(currentRound);
    canvas.requestPointerLock();
  };

  // Update progress bar
  const progress = ((currentRound + 1) / rounds.length) * 100;
  document.getElementById('test-progress').style.width = progress + '%';
}

function showDone() {
  document.exitPointerLock();
  document.getElementById('test-overlay').classList.remove('hidden');
  document.getElementById('overlay-done').classList.remove('hidden');
  document.getElementById('test-progress').style.width = '100%';

  state = 'done';

  // Small delay for dramatic effect, then navigate
  setTimeout(() => {
    const bestCm360 = estimateBestCm360(roundResults);
    sessionStorage.setItem('sensi_result', JSON.stringify({
      cm360: bestCm360,
      dpi,
      rounds: roundResults,
    }));
    cleanup();
    // Navigate is defined in the module's outer scope
    window._sensiNavigate?.('/result');
  }, 1800);
}

// ── DRAWING ───────────────────────────────────────────────────────────────────

let hitFlashes = [];

function flashHit(x, y, success) {
  hitFlashes.push({ x, y, success, born: performance.now(), duration: 400 });
}

function drawIdle() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  animFrame = requestAnimationFrame(drawIdle);
}

function draw() {
  if (state !== 'running') return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid();
  drawHitFlashes();
  if (currentTarget) drawTarget(currentTarget);
  drawCrosshair(crossX, crossY);

  animFrame = requestAnimationFrame(draw);
}

function drawGrid() {
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  ctx.lineWidth = 1;
  const step = 48;
  for (let x = 0; x < canvas.width; x += step) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += step) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }
}

function drawTarget(t) {
  const elapsed = performance.now() - t.born;
  const pulse = Math.sin(elapsed / 300) * 0.15 + 0.85;

  // Outer ring
  ctx.beginPath();
  ctx.arc(t.x, t.y, TARGET_RADIUS * pulse, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(139,127,255,0.9)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Fill
  ctx.beginPath();
  ctx.arc(t.x, t.y, TARGET_RADIUS * pulse, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(139,127,255,0.08)';
  ctx.fill();

  // Glow
  const grd = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, TARGET_RADIUS * 2);
  grd.addColorStop(0, 'rgba(139,127,255,0.12)');
  grd.addColorStop(1, 'rgba(139,127,255,0)');
  ctx.beginPath();
  ctx.arc(t.x, t.y, TARGET_RADIUS * 2, 0, Math.PI * 2);
  ctx.fillStyle = grd;
  ctx.fill();

  // Center dot
  ctx.beginPath();
  ctx.arc(t.x, t.y, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#8b7fff';
  ctx.fill();
}

function drawCrosshair(x, y) {
  const size = 10;
  const gap = 4;
  ctx.strokeStyle = 'rgba(255,255,255,0.95)';
  ctx.lineWidth = 1.5;

  // Lines
  ctx.beginPath();
  ctx.moveTo(x - size - gap, y); ctx.lineTo(x - gap, y);
  ctx.moveTo(x + gap, y); ctx.lineTo(x + size + gap, y);
  ctx.moveTo(x, y - size - gap); ctx.lineTo(x, y - gap);
  ctx.moveTo(x, y + gap); ctx.lineTo(x, y + size + gap);
  ctx.stroke();

  // Center dot
  ctx.beginPath();
  ctx.arc(x, y, 2, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.fill();
}

function drawHitFlashes() {
  const now = performance.now();
  hitFlashes = hitFlashes.filter(f => now - f.born < f.duration);

  for (const f of hitFlashes) {
    const progress = (now - f.born) / f.duration;
    const r = TARGET_RADIUS * (1 + progress * 1.5);
    const alpha = (1 - progress) * 0.8;
    const color = f.success ? `rgba(0,229,160,${alpha})` : `rgba(255,107,129,${alpha})`;
    ctx.beginPath();
    ctx.arc(f.x, f.y, r, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function updateHUD() {
  const round = rounds[currentRound];
  const cm360 = round ? Math.round(scaleToCm360(round.scale, dpi, canvas.width)) : 0;
  document.getElementById('hud-round').textContent = `Round ${currentRound + 1}/${rounds.length}`;
  document.getElementById('hud-hits').textContent = `${roundHits}/${TARGETS_PER_ROUND} hits`;
  document.getElementById('hud-sens').textContent = `${cm360} cm/360°`;
}
