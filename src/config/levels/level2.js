window.SpaceIntruders = window.SpaceIntruders || {};
window.SpaceIntruders.levels = window.SpaceIntruders.levels || [];

const levelTwo = {
  id: 'level-2',
  name: 'Encirclement',
  description: '更加紧凑的交错阵列，敌人移动更快且火力更密集。',
  origin: { x: 60, y: 70 },
  spacing: { x: 42, y: 32 },
  grid: {
    rows: 6,
    cols: 12,
    layout: [
      ['scout', null, 'scout', null, 'scout', null, 'scout', null, 'scout', null, 'scout', null],
      [null, 'scout', null, 'scout', null, 'scout', null, 'scout', null, 'scout', null, 'scout'],
      ['grunt', 'grunt', 'grunt', 'grunt', 'grunt', 'grunt', 'grunt', 'grunt', 'grunt', 'grunt', 'grunt', 'grunt'],
      ['grunt', null, 'tank', null, 'grunt', null, 'tank', null, 'grunt', null, 'tank', null],
      [null, 'tank', null, 'tank', null, 'boss', null, 'tank', null, 'tank', null, 'tank'],
      [null, null, null, null, null, 'boss', null, null, null, null, null, null]
    ]
  },
  pace: {
    baseStepInterval: 780,
    accelerationFactor: 0.92,
    horizontalStep: 20,
    verticalStep: 30,
    fireInterval: 1400,
    simultaneousFireCap: 3
  },
  player: {
    lives: 3,
    fireCooldown: 220
  }
};

window.SpaceIntruders.levels.push(levelTwo);
