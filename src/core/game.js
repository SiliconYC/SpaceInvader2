window.SpaceIntruders = window.SpaceIntruders || {};

(function registerGame() {
  const Scene = window.SpaceIntruders.Scene;
  const LevelFactory = window.SpaceIntruders.LevelFactory;
  const Player = window.SpaceIntruders.Player;
  const Renderer = window.SpaceIntruders.Renderer;
  const InputManager = window.SpaceIntruders.InputManager;
  const { loadEnemyDefinitions, loadLevelDefinitions } = window.SpaceIntruders.loader;
  const resolveCollisions = window.SpaceIntruders.resolveCollisions;

  class Game {
    constructor({ canvas, hud }) {
      this.canvas = canvas;
      this.hud = hud ?? {};
      this.renderer = new Renderer(canvas);
      this.input = new InputManager();
      this.scene = new Scene();
      this.scene.setBounds(canvas.width, canvas.height);

      this.enemyDefinitions = null;
      this.levelDefinitions = null;
      this.levelFactory = null;
      this.currentLevel = null;
      this.currentLevelIndex = 0;
      this.player = null;

      this.score = 0;
      this.state = 'loading';
      this.running = false;
      this.paused = false;
      this.lastTimestamp = 0;
      this.overlay = {};
      this.overlayBackup = null;
    }

    async init() {
      const [enemies, levels] = await Promise.all([
        loadEnemyDefinitions(),
        loadLevelDefinitions()
      ]);
      this.enemyDefinitions = enemies;
      this.levelDefinitions = levels;
      this.levelFactory = new LevelFactory(enemies);
      this.state = 'ready';
      this.overlay = { message: '按 Space 开始游戏' };
      this._updateHud();
    }

    start() {
      if (this.state === 'loading') {
        return;
      }
      this.running = true;
      this.paused = false;
      this.overlayBackup = null;
      this.currentLevelIndex = 0;
      this.score = 0;
      this._loadLevel(this.currentLevelIndex, true);
      this.lastTimestamp = performance.now();
      requestAnimationFrame((ts) => this._loop(ts));
    }

    pause(reason = '已暂停') {
      if (this.paused) {
        return;
      }
      this.paused = true;
      if (this.state === 'playing') {
        this.overlayBackup = this.overlay;
        this.overlay = { message: reason, subMessage: '关闭面板继续游戏' };
      }
    }

    resume() {
      if (!this.paused) {
        return;
      }
      this.paused = false;
      if (this.state === 'playing') {
        this.overlay = this.overlayBackup ?? {};
        this.overlayBackup = null;
      }
    }

    _loop(timestamp) {
      if (!this.running) {
        return;
      }
      const delta = timestamp - this.lastTimestamp;
      this.lastTimestamp = timestamp;

      if (!this.paused) {
        this._update(delta);
      }
      this._render();
      this.input.tick();
      requestAnimationFrame((ts) => this._loop(ts));
    }

    _update(delta) {
      switch (this.state) {
        case 'playing':
          this._updatePlaying(delta);
          break;
        case 'level-cleared':
        case 'game-over':
        case 'victory':
          this._updateIntermission(delta);
          break;
        case 'ready':
          if (this.input.wasJustPressed('Space')) {
            this.start();
          }
          break;
        default:
          break;
      }
    }

    _updatePlaying(delta) {
      if (!this.currentLevel) {
        return;
      }

      const context = {
        input: this.input,
        scene: this.scene,
        game: this
      };

      this.currentLevel.update(delta, context);
      this.scene.update(delta, context);

      resolveCollisions(this.scene, {
        onEnemyHit: (enemy, destroyed) => {
          if (destroyed) {
            this.score += enemy.getScoreValue();
            this.currentLevel.handleEnemyDestroyed(enemy);
            this._updateHud();
          }
        },
        onPlayerHit: (playerDown) => {
          if (playerDown) {
            this._handlePlayerDown();
          } else {
            this._updateHud();
          }
        }
      });

      if (this.currentLevel.isCleared()) {
        this.state = this.currentLevelIndex >= this.levelDefinitions.length - 1 ? 'victory' : 'level-cleared';
        this.overlay = this.state === 'victory'
          ? { message: '全部关卡完成!', subMessage: '按 Space 重新开始' }
          : { message: '关卡完成', subMessage: '按 Space 前往下一关' };
        this._updateHud();
      }
    }

    _updateIntermission() {
      if (this.input.wasJustPressed('Space')) {
        if (this.state === 'level-cleared') {
          this.currentLevelIndex += 1;
          this._loadLevel(this.currentLevelIndex, false);
          this.state = 'playing';
          this.overlay = {};
        } else if (this.state === 'victory' || this.state === 'game-over') {
          this.start();
        }
      }
    }

    _handlePlayerDown() {
      if (!this.player) {
        return;
      }
      if (this.player.lives <= 0) {
        this.state = 'game-over';
        this.overlay = { message: '游戏结束', subMessage: '按 Space 再试一次' };
        this._updateHud();
      }
    }

    _render() {
      this.renderer.render(this.scene, this.overlay);
    }

    _loadLevel(index, resetPlayer) {
      this.scene = new Scene();
      this.scene.setBounds(this.canvas.width, this.canvas.height);

      const levelConfig = this.levelDefinitions[index];
      if (!levelConfig) {
        console.warn('No level config found at index', index);
        this.state = 'victory';
        this.overlay = { message: '全部关卡完成!', subMessage: '按 Space 重新开始' };
        return;
      }

      const level = this.levelFactory.createLevel(levelConfig, this.scene);
      level.start();
      this.currentLevel = level;

      const defaults = level.getPlayerSettings();
      const previousLives = resetPlayer
        ? defaults.lives ?? 3
        : Math.max(this.player?.lives ?? defaults.lives ?? 3, 1);

      this.player = new Player({
        x: this.scene.bounds.width / 2,
        y: this.scene.bounds.height - 60,
        lives: previousLives,
        fireCooldown: defaults.fireCooldown ?? 260
      });

      this.scene.setPlayer(this.player);
      this.state = 'playing';
      this.overlay = {};
      this._updateHud();
    }

    _updateHud() {
      const { scoreEl, livesEl, levelEl } = this.hud;
      if (scoreEl) {
        scoreEl.textContent = `${this.score}`;
      }
      if (livesEl) {
        const lives = this.player?.lives ?? (this.levelDefinitions?.[0]?.player?.lives ?? 3);
        livesEl.textContent = `${lives}`;
      }
      if (levelEl) {
        const levelName = this.levelDefinitions?.[this.currentLevelIndex]?.name ?? '准备';
        levelEl.textContent = levelName;
      }
    }
  }

  window.SpaceIntruders.Game = Game;
})();
