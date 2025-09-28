window.SpaceIntruders = window.SpaceIntruders || {};

(function registerEnemyBase() {
  class EnemyBase {
    constructor(typeId, definition) {
      this.typeId = typeId;
      this.definition = definition;
      this.gridPosition = { col: 0, row: 0 };
      this.formationPosition = { x: 0, y: 0 };
      this.position = { x: 0, y: 0 };
      this.size = this._computeSize(definition.renderProfile);
      this.hitPoints = definition.hitPoints;
      this.active = true;
      this.cooldown = this._randomizeCooldown();
    }

    _computeSize(profile) {
      if (profile?.type === 'pixel') {
        const widthCells = profile.rows[0]?.length ?? 6;
        const heightCells = profile.rows.length ?? 6;
        const unit = profile.cellSize ?? 4;
        return { width: widthCells * unit, height: heightCells * unit };
      }
      return { width: 32, height: 24 };
    }

    _randomizeCooldown() {
      const base = this.definition.fireCooldown;
      const variance = base * 0.4;
      return base + (Math.random() * variance - variance / 2);
    }

    setGridPosition(col, row) {
      this.gridPosition.col = col;
      this.gridPosition.row = row;
    }

    setFormationPosition(x, y) {
      this.formationPosition.x = x;
      this.formationPosition.y = y;
      this.position.x = x;
      this.position.y = y;
    }

    applyOffset(dx = 0, dy = 0) {
      this.position.x = this.formationPosition.x + dx;
      this.position.y = this.formationPosition.y + dy;
    }

    update(delta) {
      this.cooldown -= delta;
      if (this.cooldown < 0) {
        this.cooldown = 0;
      }
    }

    canFire() {
      return this.cooldown <= 0 && this.active;
    }

    resetCooldown(multiplier = 1) {
      this.cooldown = (this.definition.fireCooldown ?? 2000) * multiplier;
    }

    takeDamage(amount = 1) {
      if (!this.active) {
        return false;
      }
      this.hitPoints -= amount;
      if (this.hitPoints <= 0) {
        this.hitPoints = 0;
        this.active = false;
        return true;
      }
      return false;
    }

    getBounds() {
      return {
        x: this.position.x - this.size.width / 2,
        y: this.position.y - this.size.height / 2,
        width: this.size.width,
        height: this.size.height
      };
    }

    getScoreValue() {
      return this.definition.scoreValue ?? 50;
    }
  }

  window.SpaceIntruders.EnemyBase = EnemyBase;
})();
