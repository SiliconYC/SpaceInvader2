window.SpaceIntruders = window.SpaceIntruders || {};

const enemyTypes = {
  grunt: {
    id: 'grunt',
    displayName: 'Grunt Invader',
    hitPoints: 1,
    speedModifier: 1,
    fireCooldown: 2000,
    projectileSpeed: 260,
    projectileColor: '#ffcc66',
    scoreValue: 30,
    renderProfile: {
      type: 'pixel',
      cellSize: 4,
      palette: {
        '1': '#7df9ff',
        '2': '#3aaed8'
      },
      rows: [
        '00111100',
        '01111110',
        '11100111',
        '11111111',
        '10111101',
        '00100100'
      ]
    }
  },
  scout: {
    id: 'scout',
    displayName: 'Scout Skimmer',
    hitPoints: 1,
    speedModifier: 1.25,
    fireCooldown: 2600,
    projectileSpeed: 300,
    projectileColor: '#ffffff',
    scoreValue: 40,
    renderProfile: {
      type: 'pixel',
      cellSize: 4,
      palette: {
        '1': '#ff7f50',
        '2': '#ffaf87'
      },
      rows: [
        '00011000',
        '00111100',
        '01111110',
        '11111111',
        '01101010',
        '00111100'
      ]
    }
  },
  tank: {
    id: 'tank',
    displayName: 'Tank Bruiser',
    hitPoints: 3,
    speedModifier: 0.7,
    fireCooldown: 2400,
    projectileSpeed: 220,
    projectileColor: '#f87171',
    scoreValue: 80,
    renderProfile: {
      type: 'pixel',
      cellSize: 4,
      palette: {
        '1': '#34d399',
        '2': '#059669'
      },
      rows: [
        '00111100',
        '01111110',
        '11100111',
        '11111111',
        '11111111',
        '01111110'
      ]
    }
  },
  boss: {
    id: 'boss',
    displayName: 'Overseer',
    hitPoints: 5,
    speedModifier: 0.5,
    fireCooldown: 1800,
    projectileSpeed: 260,
    projectileColor: '#c084fc',
    scoreValue: 150,
    renderProfile: {
      type: 'pixel',
      cellSize: 5,
      palette: {
        '1': '#f472b6',
        '2': '#db2777',
        '3': '#be123c'
      },
      rows: [
        '0001111000',
        '0013333100',
        '0131212130',
        '1331221331',
        '1333333331',
        '0133223310',
        '0013113100'
      ]
    }
  }
};

window.SpaceIntruders.enemyTypes = enemyTypes;
