window.SpaceIntruders = window.SpaceIntruders || {};

(function registerPlayer() {
  const Projectile = window.SpaceIntruders.Projectile;

  class Player {
    constructor({ x, y, lives = 3, fireCooldown = 280 }) {
      this.position = { x, y };
      this.size = { width: 36, height: 24 };
      this.speed = 320;
      this.lives = lives;
      this.fireCooldown = fireCooldown;
      this.fireTimer = 0;
      this.active = true;
      this.invulnerableTimer = 0;
      this.blinkInterval = 120;
      this.blinkTimer = 0;
    }

    update(delta, context) {
      const input = context.input;
      const bounds = context.scene.bounds;
      const deltaSeconds = delta / 1000;

      const axis = input.getHorizontalAxis();
      this.position.x += axis * this.speed * deltaSeconds;

      const halfWidth = this.size.width / 2;
      if (this.position.x < halfWidth) {
        this.position.x = halfWidth;
      }
      if (this.position.x > bounds.width - halfWidth) {
        this.position.x = bounds.width - halfWidth;
      }

      if (this.fireTimer > 0) {
        this.fireTimer -= delta;
      }

      if (input.isFirePressed()) {
        this.tryFire(context.scene);
      }

      if (this.invulnerableTimer > 0) {
        this.invulnerableTimer -= delta;
        this.blinkTimer += delta;
        if (this.invulnerableTimer <= 0) {
          this.invulnerableTimer = 0;
          this.blinkTimer = 0;
        }
      }
    }

    tryFire(scene) {
      if (this.fireTimer > 0) {
        return;
      }

      const projectile = new Projectile({
        x: this.position.x,
        y: this.position.y - this.size.height / 2,
        velocityY: -460,
        faction: 'player',
        color: '#fff388',
        width: 4,
        height: 16
      });

      scene.addProjectile(projectile);
      this.fireTimer = this.fireCooldown;
    }

    takeHit() {
      if (this.invulnerableTimer > 0) {
        return false;
      }
      this.lives -= 1;
      this.invulnerableTimer = 1500;
      this.blinkTimer = 0;
      if (this.lives <= 0) {
        this.active = false;
        return true;
      }
      return false;
    }

    isBlinkVisible() {
      if (this.invulnerableTimer <= 0) {
        return true;
      }
      return Math.floor(this.blinkTimer / this.blinkInterval) % 2 === 0;
    }

    getBounds() {
      return {
        x: this.position.x - this.size.width / 2,
        y: this.position.y - this.size.height / 2,
        width: this.size.width,
        height: this.size.height
      };
    }
  }

  window.SpaceIntruders.Player = Player;
})();
