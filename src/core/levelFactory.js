window.SpaceIntruders = window.SpaceIntruders || {};

(function registerLevelFactory() {
  const Level = window.SpaceIntruders.Level;
  const GruntEnemy = window.SpaceIntruders.GruntEnemy;
  const ScoutEnemy = window.SpaceIntruders.ScoutEnemy;
  const TankEnemy = window.SpaceIntruders.TankEnemy;
  const BossEnemy = window.SpaceIntruders.BossEnemy;

  const ENEMY_CLASS_MAP = {
    grunt: GruntEnemy,
    scout: ScoutEnemy,
    tank: TankEnemy,
    boss: BossEnemy
  };

  class LevelFactory {
    constructor(enemyDefinitions) {
      this.enemyDefinitions = enemyDefinitions;
    }

    createLevel(config, scene) {
      const level = new Level(
        config,
        this.enemyDefinitions,
        (typeId, definition) => this.createEnemy(typeId, definition)
      );
      level.attachScene(scene);
      return level;
    }

    createEnemy(typeId, definition) {
      const EnemyClass = ENEMY_CLASS_MAP[typeId];
      if (!EnemyClass) {
        console.warn(`Falling back to grunt enemy class for unknown type: ${typeId}`);
        return new GruntEnemy(definition ?? this.enemyDefinitions.grunt);
      }
      return new EnemyClass(definition);
    }
  }

  window.SpaceIntruders.LevelFactory = LevelFactory;
})();
