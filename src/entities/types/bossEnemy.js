window.SpaceIntruders = window.SpaceIntruders || {};

(function registerBoss() {
  const EnemyBase = window.SpaceIntruders.EnemyBase;

  class BossEnemy extends EnemyBase {
    constructor(definition) {
      super('boss', definition);
      this.rotation = Math.random() * Math.PI * 2;
    }

    update(delta, context) {
      super.update(delta, context);
      this.rotation += delta * 0.0015;
      const offsetY = Math.sin(this.rotation) * 6;
      const offsetX = Math.cos(this.rotation * 0.5) * 4;
      this.applyOffset(offsetX, offsetY);
    }
  }

  window.SpaceIntruders.BossEnemy = BossEnemy;
})();
