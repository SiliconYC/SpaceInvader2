window.SpaceIntruders = window.SpaceIntruders || {};

(function registerScout() {
  const EnemyBase = window.SpaceIntruders.EnemyBase;

  class ScoutEnemy extends EnemyBase {
    constructor(definition) {
      super('scout', definition);
      this.waveTimer = Math.random() * Math.PI * 2;
      this.amplitude = 8;
    }

    update(delta, context) {
      super.update(delta, context);
      this.waveTimer += delta * 0.0045;
      const offset = Math.sin(this.waveTimer + this.gridPosition.col * 0.35) * this.amplitude;
      this.applyOffset(0, offset);
    }
  }

  window.SpaceIntruders.ScoutEnemy = ScoutEnemy;
})();
