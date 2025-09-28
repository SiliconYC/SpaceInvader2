window.SpaceIntruders = window.SpaceIntruders || {};

(function registerProjectile() {
  class Projectile {
    constructor({ x, y, velocityY, faction, color, width = 4, height = 12, damage = 1 }) {
      this.position = { x, y };
      this.velocityY = velocityY;
      this.faction = faction;
      this.color = color;
      this.width = width;
      this.height = height;
      this.damage = damage;
      this.active = true;
    }

    update(delta, context) {
      const deltaSeconds = delta / 1000;
      this.position.y += this.velocityY * deltaSeconds;

      const bounds = context.scene?.bounds;
      if (!bounds) {
        return;
      }

      if (this.position.y < -this.height || this.position.y > bounds.height + this.height) {
        this.active = false;
      }
    }

    getBounds() {
      return {
        x: this.position.x - this.width / 2,
        y: this.position.y - this.height / 2,
        width: this.width,
        height: this.height
      };
    }
  }

  window.SpaceIntruders.Projectile = Projectile;
})();
