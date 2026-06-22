// Game database — formula converts cm/360° to in-game sensitivity value
// Formula: inGameSens = (cm360 * yaw * dpi) / (360 * 2.54)
// Rearranged from: cm360 = (360 * 2.54) / (dpi * inGameSens * yaw)

export const GAMES = [
  {
    id: 'cs2',
    name: 'CS2',
    color: '#e8642a',
    emoji: '🔫',
    yaw: 0.022,
    detail: (s) => `Raw input ON · m_yaw 0.022`,
    notes: 'Sensibilité unifiée (zoom identique)',
  },
  {
    id: 'valorant',
    name: 'Valorant',
    color: '#ff4757',
    emoji: '🔴',
    yaw: 0.07,
    detail: (s) => `Scoped mult. 1.0`,
    notes: 'Désactive le lissage dans les paramètres',
  },
  {
    id: 'apex',
    name: 'Apex Legends',
    color: '#c8a951',
    emoji: '🟡',
    yaw: 0.022,
    adsMultiplier: 1.0,
    detail: (s) => `ADS mult. 1.0 · FOV 110`,
    notes: 'Active "Response Curve" sur Linear',
  },
  {
    id: 'overwatch2',
    name: 'Overwatch 2',
    color: '#f5a623',
    emoji: '🟠',
    yaw: 0.0066,
    detail: (s) => `Relative sensitivity`,
    notes: 'Active "Raw Input" dans Accessibilité',
  },
  {
    id: 'fortnite',
    name: 'Fortnite',
    color: '#00b4ff',
    emoji: '🔵',
    // Fortnite uses % sens, normalized differently
    // cm360 = (360 * 2.54) / (dpi * sens * 0.5588)
    yaw: 0.5588,
    detail: (s) => `X et Y identiques · Build mode`,
    notes: 'Mets le même pourcentage pour X et Y',
  },
  {
    id: 'r6',
    name: 'Rainbow Six Siege',
    color: '#4fc3f7',
    emoji: '🪖',
    yaw: 0.00572957795,
    detail: (s) => `Horizontal DPI sens`,
    notes: 'Règle Vertical identiquement',
  },
  {
    id: 'cod_warzone',
    name: 'Warzone',
    color: '#8bc34a',
    emoji: '💚',
    // CoD: cm360 = (36000) / (dpi * sens * 0.3429)
    yaw: 0.3429 / 100,
    detail: (s) => `Relative · Monitor distance 0%`,
    notes: 'Mets le Aim Response sur "Standard"',
  },
  {
    id: 'pubg',
    name: 'PUBG',
    color: '#f9a825',
    emoji: '🪖',
    // PUBG: cm360 = (36000) / (dpi * sens * 2.1)
    yaw: 2.1 / 100,
    detail: (s) => `General sens`,
    notes: 'Raw input activé dans les options avancées',
  },
  {
    id: 'tf2',
    name: 'Team Fortress 2',
    color: '#b71c1c',
    emoji: '🔧',
    yaw: 0.022,
    detail: (s) => `m_yaw 0.022 (Source engine)`,
    notes: 'Identique à CS — même moteur',
  },
  {
    id: 'splitgate',
    name: 'Splitgate',
    color: '#7e57c2',
    emoji: '🌀',
    yaw: 0.07,
    detail: (s) => `Unreal engine sens`,
    notes: '',
  },
];

/**
 * Convert cm/360° to in-game sensitivity for a specific game
 * @param {number} cm360 - Sensitivity in cm/360°
 * @param {number} dpi - Mouse DPI
 * @param {object} game - Game object from GAMES array
 * @returns {number} In-game sensitivity value
 */
export function convertToGame(cm360, dpi, game) {
  // cm360 = (360 * 2.54) / (dpi * sens * yaw)
  // => sens = (360 * 2.54) / (dpi * cm360 * yaw)
  const sens = (360 * 2.54) / (dpi * cm360 * game.yaw);
  return Math.round(sens * 1000) / 1000;
}

/**
 * Convert cm/360° to all games
 * @param {number} cm360
 * @param {number} dpi
 * @returns {Array} Array of { game, value }
 */
export function convertAll(cm360, dpi) {
  return GAMES.map(game => ({
    game,
    value: convertToGame(cm360, dpi, game),
  }));
}
