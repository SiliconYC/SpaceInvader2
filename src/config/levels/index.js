window.SpaceIntruders = window.SpaceIntruders || {};
window.SpaceIntruders.levels = window.SpaceIntruders.levels || [];

window.SpaceIntruders.getLevels = function getLevels() {
  return window.SpaceIntruders.levels.map((level) => ({ ...level }));
};
