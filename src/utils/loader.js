window.SpaceIntruders = window.SpaceIntruders || {};

window.SpaceIntruders.loader = (function loaderModule() {
  const clone = (data) => JSON.parse(JSON.stringify(data));

  function loadEnemyDefinitions() {
    return Promise.resolve(clone(window.SpaceIntruders.enemyTypes));
  }

  function loadLevelDefinitions() {
    const levels = window.SpaceIntruders.getLevels
      ? window.SpaceIntruders.getLevels()
      : (window.SpaceIntruders.levels || []);
    return Promise.resolve(clone(levels));
  }

  return {
    loadEnemyDefinitions,
    loadLevelDefinitions
  };
})();
