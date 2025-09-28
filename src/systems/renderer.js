window.SpaceIntruders = window.SpaceIntruders || {};

(function registerRenderer() {
  class Renderer {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.width = canvas.width;
      this.height = canvas.height;
      this.pixelCache = new Map();
      this._generateStarfield();
    }

    setSize(width, height) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.width = width;
      this.height = height;
      this._generateStarfield();
    }

    _generateStarfield() {
      const starCount = 120;
      this.stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        brightness: 0.3 + Math.random() * 0.7,
        size: Math.random() * 1.2 + 0.4
      }));
    }

    clear() {
      this.ctx.fillStyle = '#05050c';
      this.ctx.fillRect(0, 0, this.width, this.height);
    }

    render(scene, overlay = {}) {
      this.clear();
      this._drawStarfield();

      if (scene.player && scene.player.active && scene.player.isBlinkVisible()) {
        this._drawPlayer(scene.player);
      }

      scene.enemies.forEach((enemy) => {
        if (enemy.active) {
          this._drawEnemy(enemy);
        }
      });

      scene.playerProjectiles.forEach((projectile) => {
        if (projectile.active) {
          this._drawProjectile(projectile);
        }
      });

      scene.enemyProjectiles.forEach((projectile) => {
        if (projectile.active) {
          this._drawProjectile(projectile);
        }
      });

      scene.effects.forEach((effect) => {
        if (effect.active) {
          this._drawEffect(effect);
        }
      });

      if (overlay.message) {
        this._drawCenteredMessage(overlay.message, overlay.subMessage);
      }
    }

    _drawStarfield() {
      const ctx = this.ctx;
      ctx.save();
      this.stars.forEach((star) => {
        ctx.globalAlpha = star.brightness;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(star.x, star.y, star.size, star.size);
      });
      ctx.restore();
    }

    _drawPlayer(player) {
      const ctx = this.ctx;
      const { x, y } = player.position;
      const { width, height } = player.size;
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.moveTo(0, -height / 2);
      ctx.lineTo(-width / 2, height / 2);
      ctx.lineTo(0, height / 4);
      ctx.lineTo(width / 2, height / 2);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#bbf7d0';
      ctx.fillRect(-4, -height / 4, 8, height / 3);
      ctx.restore();
    }

    _drawEnemy(enemy) {
      const profile = enemy.definition.renderProfile;
      if (!profile) {
        this._drawEnemyFallback(enemy);
        return;
      }
      if (profile.type === 'pixel') {
        this._drawPixelMatrix(enemy, profile);
        return;
      }
      this._drawEnemyFallback(enemy);
    }

    _drawEnemyFallback(enemy) {
      const ctx = this.ctx;
      ctx.save();
      ctx.fillStyle = '#f87171';
      const bounds = enemy.getBounds();
      ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
      ctx.restore();
    }

    _drawPixelMatrix(enemy, profile) {
      const ctx = this.ctx;
      const { rows, cellSize, palette } = profile;
      const bounds = enemy.getBounds();
      const startX = bounds.x;
      const startY = bounds.y;
      rows.forEach((row, rowIndex) => {
        for (let col = 0; col < row.length; col += 1) {
          const key = row[col];
          if (key === '0' || key === ' ') {
            continue;
          }
          ctx.fillStyle = palette[key] ?? '#ffffff';
          const x = startX + col * cellSize;
          const y = startY + rowIndex * cellSize;
          ctx.fillRect(x, y, cellSize, cellSize);
        }
      });
    }

    _drawProjectile(projectile) {
      const ctx = this.ctx;
      const bounds = projectile.getBounds();
      ctx.save();
      ctx.fillStyle = projectile.color ?? '#fde68a';
      ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
      ctx.restore();
    }

    _drawEffect(effect) {
      const ctx = this.ctx;
      const progress = effect.getProgress();
      const radius = effect.radius * (0.5 + progress);
      ctx.save();
      ctx.globalAlpha = 1 - progress;
      ctx.beginPath();
      ctx.fillStyle = effect.color;
      ctx.arc(effect.position.x, effect.position.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    _drawCenteredMessage(message, subMessage) {
      const ctx = this.ctx;
      ctx.save();
      ctx.fillStyle = 'rgba(5, 5, 12, 0.65)';
      ctx.fillRect(this.width * 0.15, this.height * 0.4, this.width * 0.7, this.height * 0.2);
      ctx.fillStyle = '#f8fafc';
      ctx.font = '32px "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(message, this.width / 2, this.height / 2);
      if (subMessage) {
        ctx.font = '18px "Segoe UI", sans-serif';
        ctx.fillText(subMessage, this.width / 2, this.height / 2 + 36);
      }
      ctx.restore();
    }
  }

  window.SpaceIntruders.Renderer = Renderer;
})();
