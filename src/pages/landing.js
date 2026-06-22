export function renderLanding(navigate) {
  return /* html */`
    <div class="landing">

      <div class="hero">
        <div class="hero-bg"></div>
        <div class="orb orb1"></div>
        <div class="orb orb2"></div>

        <div class="hero-pill">
          <div class="live-dot"></div>
          Bêta ouverte — gratuit
        </div>

        <h1>
          Trouve ta sensibilité<br />
          <span class="gradient-text">une fois pour toutes.</span>
        </h1>

        <p class="hero-sub">
          3 minutes de test, un algorithme qui calibre ta précision,
          et les réglages exacts pour chaque jeu.
        </p>

        <div class="hero-cta">
          <button class="btn btn-primary btn-lg" id="cta-start">
            🎯 Lancer le test
          </button>
          <a href="#how" class="btn btn-ghost btn-lg">
            Comment ça marche
          </a>
        </div>

        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-val">~3 min</div>
            <div class="stat-lbl">Durée du test</div>
          </div>
          <div class="stat-card">
            <div class="stat-val">10+</div>
            <div class="stat-lbl">Jeux supportés</div>
          </div>
          <div class="stat-card">
            <div class="stat-val">cm/360°</div>
            <div class="stat-lbl">Standard universel</div>
          </div>
          <div class="stat-card">
            <div class="stat-val">100%</div>
            <div class="stat-lbl">Dans le navigateur</div>
          </div>
        </div>
      </div>

      <div class="section" id="how">
        <div class="tag">Comment ça marche</div>
        <h2>Trois étapes,<br />zéro galère.</h2>
        <p class="section-sub">Plus besoin de tâtonner pendant des heures.</p>

        <div class="steps">
          <div class="step-card">
            <div class="step-num">01</div>
            <div class="step-icon icon-purple">🖱️</div>
            <h3>Entre ton DPI</h3>
            <p>La seule information dont on a besoin. Retrouvable dans le logiciel de ta souris ou sur le site du fabricant.</p>
          </div>
          <div class="step-card">
            <div class="step-num">02</div>
            <div class="step-icon icon-green">🎯</div>
            <h3>Passe les exercices</h3>
            <p>Flick shots, tracking, micro-ajustements. L'algo teste 4 niveaux de sensibilité et mesure ta précision à chaque fois.</p>
          </div>
          <div class="step-card">
            <div class="step-num">03</div>
            <div class="step-icon icon-orange">⚡</div>
            <h3>Récupère tes réglages</h3>
            <p>Ta cm/360° idéale, convertie automatiquement pour chaque jeu avec tous les détails nécessaires.</p>
          </div>
        </div>
      </div>

      <div class="section section-dark">
        <div class="tag">Pourquoi cm/360° ?</div>
        <h2>Le standard universel<br />que les pros utilisent.</h2>
        <p class="section-sub">
          Peu importe ton DPI ou le jeu, cette unité te suit partout.
        </p>

        <div class="info-grid">
          <div class="info-card">
            <div class="info-icon">🔄</div>
            <h4>Indépendant du DPI</h4>
            <p>Change de souris ou de DPI sans perdre ta sensibilité. Le cm/360° reste identique.</p>
          </div>
          <div class="info-card">
            <div class="info-icon">🎮</div>
            <h4>Cross-game</h4>
            <p>Un seul chiffre, converti précisément pour CS2, Valorant, Apex, Fortnite et plus.</p>
          </div>
          <div class="info-card">
            <div class="info-icon">📏</div>
            <h4>Physique & concret</h4>
            <p>Combien de centimètres de mouvement pour faire un tour complet. C'est mesurable, reproductible.</p>
          </div>
        </div>
      </div>

      <div class="section cta-section">
        <h2>Prêt à trouver<br />ta sensibilité idéale ?</h2>
        <p class="section-sub">Gratuit, sans inscription, 3 minutes top chrono.</p>
        <button class="btn btn-primary btn-lg" id="cta-bottom">
          🎯 Commencer le test
        </button>
      </div>

    </div>
  `;
}

export function bindLanding(navigate) {
  document.getElementById('cta-start')?.addEventListener('click', () => navigate('/setup'));
  document.getElementById('cta-bottom')?.addEventListener('click', () => navigate('/setup'));
}
