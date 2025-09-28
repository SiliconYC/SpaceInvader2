window.SpaceIntruders = window.SpaceIntruders || {};

(function registerGrunt() {
  const EnemyBase = window.SpaceIntruders.EnemyBase;

  class GruntEnemy extends EnemyBase {
    constructor(definition) {
      super('grunt', definition);
    }
  }

  window.SpaceIntruders.GruntEnemy = GruntEnemy;
})();
