/**
 * Core sensitivity math for the browser-based test.
 *
 * The test uses Pointer Lock API. `movementX/Y` is in CSS pixels.
 * At standard OS pointer speed (no acceleration), moving the mouse 1 inch
 * at N DPI produces approximately N CSS pixels of movementX on a 1x display.
 *
 * Canvas fills the viewport. We define 360° = full canvas width.
 * => cm/360° = (canvasWidth * 2.54) / (scale * dpi)
 *
 * where `scale` is our sensitivity multiplier (canvas px per mouse px).
 */

/**
 * Convert our internal test scale to cm/360°
 * @param {number} scale - Internal multiplier (canvas px / mouse px)
 * @param {number} dpi - User's mouse DPI
 * @param {number} canvasWidth - Canvas width in CSS pixels
 * @returns {number} cm/360°
 */
export function scaleToCm360(scale, dpi, canvasWidth) {
  return (canvasWidth * 2.54) / (scale * dpi);
}

/**
 * Convert cm/360° back to our internal scale
 */
export function cm360ToScale(cm360, dpi, canvasWidth) {
  return (canvasWidth * 2.54) / (cm360 * dpi);
}

/**
 * Profile classifier based on cm/360°
 */
export function getProfile(cm360) {
  if (cm360 < 18)  return { label: 'Hyper-rapide', sub: 'Réactions ultra-vives, précision fine plus difficile.', icon: '⚡' };
  if (cm360 < 28)  return { label: 'Aggressif', sub: 'Profil compétitif rapide — favorise les rotations et les prises d\'angle.', icon: '🔥' };
  if (cm360 < 42)  return { label: 'Polyvalent', sub: 'Le sweet spot pour la plupart des FPS compétitifs.', icon: '🎯' };
  if (cm360 < 60)  return { label: 'Contrôlé', sub: 'Précision maximale sur les longues distances.', icon: '🔬' };
  return { label: 'Lowsens', sub: 'Très faible sensibilité — nécessite un grand mousepad.', icon: '🐢' };
}

/**
 * Test round configuration
 * Returns 4 scales to test, ordered: low, mid-low, mid-high, high
 * Starting ranges bracket typical competitive players (20–60 cm/360°)
 */
export function getTestRounds(dpi, canvasWidth) {
  // Target cm/360° values to test: 60, 40, 28, 18
  const targets = [60, 40, 28, 18];
  return targets.map(cm => ({
    cm360: cm,
    scale: cm360ToScale(cm, dpi, canvasWidth),
  }));
}

/**
 * Analyze round results and find the best performing sensitivity,
 * then refine within a narrower window.
 *
 * @param {Array} rounds - [{scale, cm360, accuracy, avgError, hits, total}]
 * @returns {number} Best estimated cm/360°
 */
export function estimateBestCm360(rounds) {
  if (!rounds.length) return 35;

  // Score = accuracy weighted, but penalize extreme errors
  const scored = rounds.map(r => ({
    ...r,
    score: r.accuracy - (r.avgError / 100) * 0.3,
  }));

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];

  // If two consecutive rounds bracket the best, interpolate
  const bestIdx = rounds.findIndex(r => r.cm360 === best.cm360);
  const prev = rounds[bestIdx - 1];
  const next = rounds[bestIdx + 1];

  if (prev && next) {
    const wPrev = prev.score / (prev.score + best.score + (next?.score ?? 0));
    const wBest = best.score / (prev.score + best.score + (next?.score ?? 0));
    const wNext = next ? next.score / (prev.score + best.score + next.score) : 0;
    return prev.cm360 * wPrev + best.cm360 * wBest + (next?.cm360 ?? best.cm360) * wNext;
  }

  return best.cm360;
}
