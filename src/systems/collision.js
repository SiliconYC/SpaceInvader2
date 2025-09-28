window.SpaceIntruders = window.SpaceIntruders || {};

(function registerCollision() {
  const intersects = (a, b) =>
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;

  function resolveCollisions(scene, callbacks = {}) {
    const { onEnemyHit, onPlayerHit } = callbacks;

    scene.playerProjectiles.forEach((projectile) => {
      if (!projectile.active) {
        return;
      }
      const projectileBounds = projectile.getBounds();
      for (const enemy of scene.enemies) {
        if (!enemy.active) {
          continue;
        }
        const enemyBounds = enemy.getBounds();
        if (intersects(projectileBounds, enemyBounds)) {
          projectile.active = false;
          const wasDestroyed = enemy.takeDamage(projectile.damage);
          if (typeof onEnemyHit === 'function') {
            onEnemyHit(enemy, wasDestroyed);
          }
          break;
        }
      }
    });

    if (scene.player && scene.player.active) {
      const playerBounds = scene.player.getBounds();
      scene.enemyProjectiles.forEach((projectile) => {
        if (!projectile.active) {
          return;
        }
        const projectileBounds = projectile.getBounds();
        if (intersects(projectileBounds, playerBounds)) {
          projectile.active = false;
          const playerDown = scene.player.takeHit(projectile.damage);
          if (typeof onPlayerHit === 'function') {
            onPlayerHit(playerDown);
          }
        }
      });
    }
  }

  window.SpaceIntruders.resolveCollisions = resolveCollisions;
})();
