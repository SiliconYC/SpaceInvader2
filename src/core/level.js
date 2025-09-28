window.SpaceIntruders = window.SpaceIntruders || {};

(function registerLevel() {
  const Projectile = window.SpaceIntruders.Projectile;
  const Effect = window.SpaceIntruders.Effect;

  class Level {
    constructor(config, enemyDefinitions, createEnemy) {
      this.config = config;
      this.enemyDefinitions = enemyDefinitions;
      this.createEnemy = createEnemy;
      this.scene = null;
      this.formation = {
        offsetX: 0,
        offsetY: 0,
        direction: 1,
        timer: config.pace.baseStepInterval,
        interval: config.pace.baseStepInterval,
        minInterval: 220
      };
      this.fireTimer = config.pace.fireInterval;
      this.remainingEnemies = 0;
      this.active = false;
    }

    attachScene(scene) {
      this.scene = scene;
    }

    start() {
      if (!this.scene) {
        throw new Error('Scene must be attached before starting the level.');
      }
      this._spawnEnemies();
      this.active = true;
      this.formation.offsetX = 0;
      this.formation.offsetY = 0;
      this.formation.interval = this.config.pace.baseStepInterval;
      this.formation.timer = this.config.pace.baseStepInterval;
    }

    getPlayerSettings() {
      return this.config.player;
    }

    update(delta) {
      if (!this.active) {
        return;
      }

      this._updateFormation(delta);
      this._handleEnemyFire(delta);

      if (this.remainingEnemies <= 0) {
        this.active = false;
      }
    }

    handleEnemyDestroyed(enemy) {
      this.remainingEnemies -= 1;
      this.scene.addEffect(new Effect({
        x: enemy.position.x,
        y: enemy.position.y,
        color: '#fbbf24',
        radius: 12,
        duration: 260
      }));
    }

    isCleared() {
      return this.remainingEnemies <= 0;
    }

    _spawnEnemies() {
      const { layout, rows, cols } = this.config.grid;
      const { origin, spacing } = this.config;
      this.scene.enemies = [];
      this.remainingEnemies = 0;

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const typeId = layout[row]?.[col] ?? null;
          if (!typeId) {
            continue;
          }
          const definition = this.enemyDefinitions[typeId];
          if (!definition) {
            console.warn(`Unknown enemy type: ${typeId}`);
            continue;
          }
          const enemy = this.createEnemy(typeId, definition);
          enemy.setGridPosition(col, row);
          const baseX = origin.x + col * spacing.x;
          const baseY = origin.y + row * spacing.y;
          enemy.basePosition = { x: baseX, y: baseY };
          enemy.setFormationPosition(baseX, baseY);
          this.scene.addEnemy(enemy);
          this.remainingEnemies += 1;
        }
      }
    }

    _updateFormation(delta) {
      this.formation.timer -= delta;
      if (this.formation.timer > 0) {
        this._applyFormation();
        return;
      }

      this.formation.timer = this.formation.interval;
      const candidateOffsetX = this.formation.offsetX + this.config.pace.horizontalStep * this.formation.direction;
      const bounds = this._getProjectedBounds(candidateOffsetX, this.formation.offsetY);
      const margin = 40;

      if (bounds.left < margin || bounds.right > (this.scene.bounds.width - margin)) {
        this.formation.direction *= -1;
        this.formation.offsetY += this.config.pace.verticalStep;
        this.formation.interval = Math.max(
          this.formation.minInterval,
          this.formation.interval * this.config.pace.accelerationFactor
        );
      } else {
        this.formation.offsetX = candidateOffsetX;
      }

      this._applyFormation();
    }

    _getProjectedBounds(offsetX, offsetY) {
      let minX = Number.POSITIVE_INFINITY;
      let maxX = Number.NEGATIVE_INFINITY;
      this.scene.enemies.forEach((enemy) => {
        if (!enemy.active) {
          return;
        }
        const baseX = (enemy.basePosition?.x ?? enemy.position.x);
        const baseY = (enemy.basePosition?.y ?? enemy.position.y);
        const x = baseX + offsetX;
        const y = baseY + offsetY;
        const { width } = enemy.size;
        minX = Math.min(minX, x - width / 2);
        maxX = Math.max(maxX, x + width / 2);
        if (y > this.scene.bounds.height - 120) {
          this.formation.interval = Math.max(this.formation.minInterval, this.formation.interval * 0.9);
        }
      });

      if (!Number.isFinite(minX) || !Number.isFinite(maxX)) {
        minX = 0;
        maxX = 0;
      }

      return { left: minX, right: maxX };
    }

    _applyFormation() {
      this.scene.enemies.forEach((enemy) => {
        if (!enemy.active) {
          return;
        }
        const baseX = enemy.basePosition?.x ?? enemy.position.x;
        const baseY = enemy.basePosition?.y ?? enemy.position.y;
        enemy.setFormationPosition(
          baseX + this.formation.offsetX,
          baseY + this.formation.offsetY
        );
      });
    }

    _handleEnemyFire(delta) {
      this.fireTimer -= delta;
      if (this.fireTimer > 0) {
        return;
      }

      const cap = this.config.pace.simultaneousFireCap ?? 2;
      if (this.scene.enemyProjectiles.length >= cap) {
        this.fireTimer = this.config.pace.fireInterval * 0.5;
        return;
      }

      const shooter = this._selectShooter();
      if (shooter) {
        this._fireProjectile(shooter);
        shooter.resetCooldown();
      }

      this.fireTimer = this.config.pace.fireInterval;
    }

    _selectShooter() {
      const columns = new Map();
      this.scene.enemies.forEach((enemy) => {
        if (!enemy.active) {
          return;
        }
        const existing = columns.get(enemy.gridPosition.col);
        if (!existing || existing.gridPosition.row < enemy.gridPosition.row) {
          columns.set(enemy.gridPosition.col, enemy);
        }
      });

      const frontLine = Array.from(columns.values());
      if (frontLine.length === 0) {
        return null;
      }

      return frontLine[Math.floor(Math.random() * frontLine.length)];
    }

    _fireProjectile(enemy) {
      const { projectileSpeed, projectileColor } = enemy.definition;
      const projectile = new Projectile({
        x: enemy.position.x,
        y: enemy.position.y + enemy.size.height / 2,
        velocityY: projectileSpeed,
        faction: 'enemy',
        color: projectileColor ?? '#fca5a5',
        width: 5,
        height: 18,
        damage: 1
      });

      this.scene.addProjectile(projectile);
    }
  }

  window.SpaceIntruders.Level = Level;
})();
