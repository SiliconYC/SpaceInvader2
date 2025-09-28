window.SpaceIntruders = window.SpaceIntruders || {};

(function bootstrap() {
  const canvas = document.getElementById('game-canvas');
  const hud = {
    scoreEl: document.querySelector('[data-hud="score"]'),
    livesEl: document.querySelector('[data-hud="lives"]'),
    levelEl: document.querySelector('[data-hud="level"]')
  };

  const Game = window.SpaceIntruders.Game;
  const game = new Game({ canvas, hud });

  (async () => {
    await game.init();
    game.start();
  })();

  const overlay = document.getElementById('doc-overlay');
  const toggleButton = document.getElementById('doc-toggle');
  const closeButton = document.getElementById('doc-close');
  const backdrop = overlay.querySelector('[data-action="close-doc"]');

  const openDoc = () => {
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    game.pause('查看设计文档');
  };

  const closeDoc = () => {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    game.resume();
  };

  toggleButton.addEventListener('click', () => {
    if (overlay.classList.contains('is-open')) {
      closeDoc();
    } else {
      openDoc();
    }
  });

  closeButton.addEventListener('click', closeDoc);
  backdrop.addEventListener('click', closeDoc);

  window.addEventListener('keydown', (event) => {
    if (event.code === 'Escape' && overlay.classList.contains('is-open')) {
      closeDoc();
    }
  });

  window.SpaceIntruders.gameInstance = game;
})();
