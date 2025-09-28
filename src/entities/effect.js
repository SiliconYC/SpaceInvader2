window.SpaceIntruders = window.SpaceIntruders || {};

(function registerEffect() {
  class Effect {
    constructor({ x, y, duration = 300, radius = 6, color = '#fcd34d' }) {
      this.position = { x, y };
      this.duration = duration;
      this.time = 0;
      this.radius = radius;
      this.color = color;
      this.active = true;
    }

    update(delta) {
      this.time += delta;
      if (this.time >= this.duration) {
        this.active = false;
      }
    }

    getProgress() {
      return Math.min(1, this.time / this.duration);
    }
  }

  window.SpaceIntruders.Effect = Effect;
})();
