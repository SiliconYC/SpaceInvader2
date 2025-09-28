window.SpaceIntruders = window.SpaceIntruders || {};

(function registerTank() {
  const EnemyBase = window.SpaceIntruders.EnemyBase;

  class TankEnemy extends EnemyBase {
    constructor(definition) {
      super('tank', definition);
      this.shieldPulse = Math.random() * Math.PI * 2;
    }

    update(delta, context) {
      super.update(delta, context);
      this.shieldPulse += delta * 0.003;
      const wobble = Math.sin(this.shieldPulse) * 2;
      this.applyOffset(0, wobble);
    }
  }

  window.SpaceIntruders.TankEnemy = TankEnemy;
})();
