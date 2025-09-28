window.SpaceIntruders = window.SpaceIntruders || {};
window.SpaceIntruders.levels = window.SpaceIntruders.levels || [];

const levelOne = {
  id: 'level-1',
  name: 'Formation Primer',
  description: '标准开局阵列，帮助玩家熟悉移动与射击节奏。',
  origin: { x: 70, y: 80 },
  spacing: { x: 44, y: 36 },
  grid: {
    rows: 5,
    cols: 11,
    layout: [
      ['scout', null, 'scout', null, 'scout', null, 'scout', null, 'scout', null, 'scout'],
      ['grunt', 'grunt', 'grunt', 'grunt', 'grunt', 'grunt', 'grunt', 'grunt', 'grunt', 'grunt', 'grunt'],
      [null, 'grunt', 'grunt', 'grunt', 'grunt', 'grunt', 'grunt', 'grunt', 'grunt', 'grunt', null],
      [null, null, 'tank', null, null, 'tank', null, null, 'tank', null, null],
      [null, null, null, null, null, 'boss', null, null, null, null, null]
    ]
  },
  pace: {
    baseStepInterval: 900,
    accelerationFactor: 0.94,
    horizontalStep: 18,
    verticalStep: 28,
    fireInterval: 1700,
    simultaneousFireCap: 2
  },
  player: {
    lives: 3,
    fireCooldown: 260
  }
};

window.SpaceIntruders.levels.push(levelOne);
