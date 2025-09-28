window.SpaceIntruders = window.SpaceIntruders || {};

(function registerScene() {
  class Scene {
    constructor() {
      this.player = null;
      this.enemies = [];
      this.playerProjectiles = [];
      this.enemyProjectiles = [];
      this.effects = [];
      this.bounds = { width: 800, height: 640 };
    }

    setBounds(width, height) {
      this.bounds.width = width;
      this.bounds.height = height;
    }

    setPlayer(player) {
      this.player = player;
    }

    addEnemy(enemy) {
      this.enemies.push(enemy);
    }

    removeEnemy(enemy) {
      enemy.active = false;
    }

    addProjectile(projectile) {
      if (projectile.faction === 'player') {
        this.playerProjectiles.push(projectile);
      } else {
        this.enemyProjectiles.push(projectile);
      }
    }

    addEffect(effect) {
      this.effects.push(effect);
    }

    update(delta, context) {
      if (this.player) {
        this.player.update(delta, context);
      }

      this.enemies.forEach((enemy) => {
        if (enemy.active) {
          enemy.update(delta, context);
        }
      });

      this.playerProjectiles.forEach((projectile) => {
        if (projectile.active) {
          projectile.update(delta, context);
        }
      });

      this.enemyProjectiles.forEach((projectile) => {
        if (projectile.active) {
          projectile.update(delta, context);
        }
      });

      this.effects.forEach((effect) => {
        if (effect.active) {
          effect.update(delta, context);
        }
      });

      this._sweep();
    }

    _sweep() {
      this.enemies = this.enemies.filter((enemy) => enemy.active);
      this.playerProjectiles = this.playerProjectiles.filter((projectile) => projectile.active);
      this.enemyProjectiles = this.enemyProjectiles.filter((projectile) => projectile.active);
      this.effects = this.effects.filter((effect) => effect.active);
    }
  }

  window.SpaceIntruders.Scene = Scene;
})();
