/* global  dungeon  rendererPlay lib*/

const app = (function () {
  'use strict';

  let logs = [`Adventure begins...
  Click over the map and use arrow keys to move 
  Pink = PLAYER
  Blue = WEAPONS
  Green = HEALTH
  Orange = FOES
  Yellow = BOSS
  `];
  const weapon = [
    [0, 'Dagger', '1d6+4'],
    [1, 'Sword', '2d6+6'],
    [2, '2H Sword', '3d6+8'],
    [3, 'Relic', '4d6+10'],
    [10, 'foe weapon', '3d6+0']
  ];

  const hero = {
    xp: 0,
    level: 1,
    hp: 100,
    wp: 0,
    bonus: '0d6+0',
    damage: function () {
      return (getDamage(weapon[hero.wp][2]) + getDamage(hero.bonus));
    }
  };

  const foe = {
    xp: 100,
    level: 1,
    hp: 50,
    wp: 4,
    damage: function () {
      return getDamage(weapon[this.wp][2]);
    }
  };

  const boss = {
    xp: 1000,
    level: 5,
    hp: 300,
    wp: 3,
    damage: function () {
      return getDamage(weapon[this.wp][2]);
    }
  };

  function init () {
    dungeon.createDungeon();
    // rendererBig.setMyCanvas()
    // rendererBig.drawMyCanvas(dungeon.map)
    rendererPlay.setMyCanvas();
    rendererPlay.drawMyCanvasCenteredOnHero(dungeon.map);
    addEvents();
    updateScore();
  }

  function getDamage (dice) {
    // console.log(dice)
    let damage = 0;
    dice = dice.split('d6+');
    for (let i = 0; i < dice[0]; i++) {
      damage += lib.getRandomNumber(1, 6);
    }
    damage += parseInt(dice[1]);
    return parseInt(damage);
  }

  function addEvents () {
    // console.log(hero.damage)
    document.getElementById('myCanvas').addEventListener('keydown', action);
    document.getElementById('myCanvas').focus();
  }

  function action (e) {
    const key = String.fromCharCode(e.keyCode);
    // console.log(key)
    let go, foeX, foeY;
    let newTile;
    if (key === '&' || key === 'W' || key === 'w') {
      // console.log(key, '... N')
      go = 1;
      newTile = dungeon.map[dungeon.center.x][dungeon.center.y - 1];
      foeX = dungeon.center.x;
      foeY = dungeon.center.y - 1;
    } else if (key === "'" || key === 'D' || key === 'd') {
      // console.log(key, '... E')
      go = 2;
      newTile = dungeon.map[dungeon.center.x + 1][dungeon.center.y];
      foeX = dungeon.center.x + 1;
      foeY = dungeon.center.y;
    } else if (key === '(' || key === 'X' || key === 'x') {
      // console.log(key, '... S')
      go = 3;
      newTile = dungeon.map[dungeon.center.x][dungeon.center.y + 1];
      foeX = dungeon.center.x;
      foeY = dungeon.center.y + 1;
    } else if (key === '%' || key === 'A' || key === 'a') {
      // console.log(key, '... W')
      go = 4;
      newTile = dungeon.map[dungeon.center.x - 1][dungeon.center.y];
      foeX = dungeon.center.x - 1;
      foeY = dungeon.center.y;
    }
    // console.log(newTile, go)
    switch (newTile) {
      case 0: // ROCK
      case 1: // WALL
        break;
      case 2: // WALKABLE
      case 4: // WEAPON
      case 5: // POTION
        move(go);
        updateScore();
        rendererPlay.drawMyCanvasCenteredOnHero(dungeon.map);
        break;
      case 3: // FOE
        fight(go, foeX, foeY, false);
        updateScore();
        rendererPlay.drawMyCanvasCenteredOnHero(dungeon.map);
        break;
      case 7: // BOSS
        // console.log('BOSSSSSS')
        fight(go, 0, 0, true);
        updateScore();
        rendererPlay.drawMyCanvasCenteredOnHero(dungeon.map);
        break;
      default:
    // console.log('ERROR')
    }
  }

  function move (go) {
    // console.log('MOVER ...', go)
    dungeon.map[dungeon.center.x][dungeon.center.y] = 2;
    if (go === 1) {
      dungeon.center.y--;
    } else if (go === 2) {
      dungeon.center.x++;
    } else if (go === 3) {
      dungeon.center.y++;
    } else if (go === 4) {
      dungeon.center.x--;
    }
    let newHeroPositionTile = dungeon.map[dungeon.center.x][dungeon.center
      .y];
    if (newHeroPositionTile === 4 || newHeroPositionTile === 5) {
      takeResource(newHeroPositionTile);
    }
    dungeon.map[dungeon.center.x][dungeon.center.y] = 6;
  }

  function takeResource (resourceType) {
    if (resourceType === 4) {
      const quality = lib.getRandomNumber(1, 100);
      switch (true) {
        case ( quality < 60):
          if (hero.wp < 0) {
            hero.wp = 0;
          } else {
            logs += 'You have a better weapon \n';
          }
          break;
        case ( quality < 85):
          if (hero.wp < 1) {
            hero.wp = 1;
            logs += 'You found a ' + weapon[1][1] + ' GOOD LUCK \n';
          } else {
            logs += 'You have a better weapon \n';
          }
          break;
        case ( quality < 98):
          if (hero.wp < 2) {
            hero.wp = 2;
            logs += 'You found a ' + weapon[2][1] + ' GOOD LUCK \n';
          } else {
            logs += 'You have a better weapon \n';
          }
          break;
        case ( quality < 101):
          if (hero.wp < 3) {
            hero.wp = 3;
            logs += 'You found a ' + weapon[3][1] + ' GOOD LUCK \n';
          } else {
            logs += 'You have a better weapon \n';
          }
          break;
      }
    } else if (resourceType === 5) {
      const curation = lib.getRandomNumber(1, 50);
      // console.log('CURA', curation)
      hero.hp += curation;
      logs += 'You healed ' + curation + ' Hit Points \n';
      if (hero.hp > 100) hero.hp = 100;
    }
    getXp(0);
  }

  function fight (go, foeX, foeY, isBoss) {
    // console.log('Malo en dir ...', go, ' y coordenadas ', foeX, foeY)
    // console.log(go, foeX, foeY, isBoss)
    let dealt, taken;
    if (!isBoss) {
      let aux = getMyFoe(foeX, foeY);
      let myFoe = dungeon.foes[aux];
      // console.log(myFoe)
      dealt = hero.damage();
      taken = foe.damage();
      logs += 'Hero strikes ' + weapon[hero.wp][2] + ' -> ' + dealt +
        ' HPs \n';
      logs += 'Foe strikes ' + weapon[myFoe.wp][2] + ' -> ' + taken +
        ' HPs \n';
      hero.hp -= taken;
      if (hero.hp <= 0) {
        looseGame();
      }
      myFoe.hp -= dealt;
      if (myFoe.hp <= 0) {
        // console.log('There are ', dungeon.foes.length, 'foes')
        dungeon.map[foeX][foeY] = 2;
        dungeon.foes.splice(aux, 1);
        // console.log(dungeon.foes.length)
        // console.log(getMyFoe(foeX, foeY))
        if (dungeon.foes.length === 0) {
          winGame();
        }
      }
      getXp(foe.hp);
    } else if (isBoss) {
      dealt = hero.damage();
      taken = boss.damage();
      logs += 'Hero strikes ' + weapon[hero.wp][2] + ' -> ' + dealt +
        ' HPs \n';
      logs += 'Foe strikes ' + weapon[boss.wp][2] + ' -> ' + taken +
        ' HPs \n';
      hero.hp -= taken;
      if (hero.hp <= 0) {
        looseGame();
      }
      boss.hp -= dealt;
      if (boss.hp <= 0) {
        winGame();
      }
    }
  }

  function getXp (plus) {
    const levelPreXp = Math.floor((hero.xp + 1000) / 1000);
    hero.xp += plus + lib.getRandomNumber(1, 100);
    const levelPostXp = Math.floor((hero.xp + 1000) / 1000);
    if (levelPostXp > levelPreXp) {
      hero.level++;
      hero.bonus = String(hero.level - 1) + 'd6+' + String(hero.level - 1);
    // console.log(hero.bonus)
    }
  }

  function getMyFoe (foeX, foeY) {
    let found = false;
    let cont = 0;
    while (!found) {
      if (dungeon.foes[cont].x === foeX && dungeon.foes[cont].y ===
        foeY) {
        return cont;
      }
      cont++;
      if (cont >= dungeon.foes.length) found = true;
    }
  }

  function updateScore () {
    document.getElementById('health').innerText = hero.hp;
    document.getElementById('level').innerText = hero.level + ' - ' +
    hero.bonus;
    document.getElementById('xp').innerText = hero.xp;
    document.getElementById('weapon').innerText = weapon[hero.wp][1];
    document.getElementById('logArea').value = logs;
    const logArea = document.getElementById('logArea');
    logArea.scrollTop = logArea.scrollHeight;
  // console.log(dungeon.center.x, dungeon.center.y)
  }

  function looseGame () {
    alert('YOU LOSE');
    location.reload();
  }

  function winGame () {
    alert('YOU WIN');
    location.reload();
  }

  return {
    init: init,
    foe: foe
  };
}());

window.addEventListener('load', app.init);
