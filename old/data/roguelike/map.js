/* global app */

const lib = (function () {
  'use strict';
  function initArray (cols, rows, value) {
    let array = [];
    for (let i = 0; i < cols; i++) {
      array[i] = [];
      for (let j = 0; j < rows; j++) {
        array[i][j] = value;
      }
    }
    return array;
  }

  function getRandomNumber (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  return {
    initArray: initArray,
    getRandomNumber: getRandomNumber
  };
}());

const dungeon = {
  cols: 50,
  rows: 40,
  map: [],
  center: {},
  maxRooms: 25,
  rooms: [],
  minSizeRoom: 3,
  maxSizeRoom: 10,
  minLenCorridor: 6,
  maxLenCorridor: 20,
  enemyDensity: 20, // less is higher
  randomWall: {},
  nextFeature: {},
  newRoom: {},
  foes: [],
  heroPos: {},
  createDungeon: function (cols, rows) {
    'use strict';
    this.createSize();
    this.createRooms();
    this.populate();
    this.getFoes();
  },
  createSize: function () {
    'use strict';
    this.map = lib.initArray(this.cols, this.rows, 0);
  },
  createRooms: function () {
    'use strict';
    this.createSingleRoomInCenter();
    this.putWalls(0);

    // for (const i = 0; i < this.maxRooms; i++) {
    while (this.rooms.length < this.maxRooms) {
      this.pickRandomWallFromAnyRoom();
      this.pickRandomFeature();
      this.convertFeatureToRoom();
      if (this.checkIsRoomForFeature()) {
        this.addFeature();
        this.putAllWalls();
      } else {
        this.map[this.randomWall.x][this.randomWall.y] = 1;
      }
    }
  },
  createSingleRoomInCenter: function () {
    'use strict';
    const width = lib.getRandomNumber(this.minSizeRoom, this.maxSizeRoom);
    const height = lib.getRandomNumber(this.minSizeRoom, this.maxSizeRoom);
    const x = Math.floor((this.cols - width) / 2);
    const y = Math.floor((this.rows - height) / 2);
    for (let i = x - 1; i < x + width - 1; i++) {
      for (let j = y - 1; j < y + height - 1; j++) {
        this.map[i][j] = 2;
      }
    }
    this.rooms.push({});
    this.rooms[0].x = x - 1;
    this.rooms[0].y = y - 1;
    this.rooms[0].width = width;
    this.rooms[0].height = height;
    this.rooms[0].foes = Math.floor(this.rooms[0].width * this.rooms[0].height /
      this.enemyDensity) + Math.floor(Math.random() * 2);
  // console.log(this.rooms[0])
  },
  pickRandomWallFromAnyRoom: function () {
    'use strict';
    let x, y;
    let found = false;
    let cont = 0;
    while (!found && cont < 500) {
      x = lib.getRandomNumber(1, this.cols - 1);
      y = lib.getRandomNumber(1, this.rows - 1);
      if (this.map[x][y] === 1) {
        if (this.isNotCorner(x, y)) {
          // console.log('BOTIN', x, y)
          this.map[x][y] = 2;
          found = true;
        }
      }
      cont++;
    }
    this.randomWall.x = x;
    this.randomWall.y = y;
  },
  pickRandomFeature: function () {
    'use strict';
    const type = lib.getRandomNumber(0, 100);
    this.nextFeature.x = this.randomWall.x;
    this.nextFeature.y = this.randomWall.y;
    this.nextFeature.dir = this.getFeatureDirection(this.randomWall.x,
      this.randomWall.y);
    switch (true) {
      case ( type < 50):
        // console.log(type, 'corridor')
        if (this.nextFeature.dir === 1 || this.nextFeature.dir === 3) {
          this.nextFeature.width = 1;
          this.nextFeature.height = lib.getRandomNumber(this.minLenCorridor,
            this.maxLenCorridor);
        } else if (this.nextFeature.dir === 2 || this.nextFeature.dir ===
          4) {
          this.nextFeature.width = lib.getRandomNumber(this.minLenCorridor,
            this.maxLenCorridor);
          this.nextFeature.height = 1;
        }
        break;
      case ( type >= 50):
        // console.log(type, 'room')
        this.nextFeature.width = lib.getRandomNumber(this.minSizeRoom, this
          .maxSizeRoom);
        this.nextFeature.height = lib.getRandomNumber(this.minSizeRoom, this
          .maxSizeRoom);
        break;
    }
  },
  convertFeatureToRoom: function () {
    'use strict';
    // console.log('New Feature', this.nextFeature)
    if (this.nextFeature.dir === 1) {
      this.newRoom.x = this.nextFeature.x;
      this.newRoom.y = this.nextFeature.y - this.nextFeature.height;
    } else if (this.nextFeature.dir === 2) {
      this.newRoom.x = this.nextFeature.x + 1;
      this.newRoom.y = this.nextFeature.y;
    } else if (this.nextFeature.dir === 3) {
      this.newRoom.x = this.nextFeature.x;
      this.newRoom.y = this.nextFeature.y + 1;
    } else if (this.nextFeature.dir === 4) {
      this.newRoom.x = this.nextFeature.x - this.nextFeature.width;
      this.newRoom.y = this.nextFeature.y;
    }
    this.newRoom.width = this.nextFeature.width;
    this.newRoom.height = this.nextFeature.height;
    this.newRoom.foes = Math.floor(this.nextFeature.width * this.nextFeature.height / this.enemyDensity) + Math.floor(Math.random() * 2);
  },
  checkIsRoomForFeature: function () {
    'use strict';
    // console.log('New Room', this.newRoom)
    let isRoom = true;
    for (let i = this.newRoom.x; i < this.newRoom.x + this.newRoom.width; i++) {
      for (let j = this.newRoom.y; j < this.newRoom.y + this.newRoom.height; j++) {
        if (i < 0 || i >= this.cols || j < 0 || j >= this.rows) { // Protection
          isRoom = false;
        } else if (this.map[i][j] === 2) {
          isRoom = false;
        }
      }
    }
    // console.log(isRoom)
    return isRoom;
  },
  addFeature: function () {
    'use strict';
    // console.log('GO ON !')
    for (let i = this.newRoom.x; i < this.newRoom.x + this.newRoom.width; i++) {
      for (let j = this.newRoom.y; j < this.newRoom.y + this.newRoom.height; j++) {
        this.map[i][j] = 2;
      }
    }
    this.rooms.push(this.newRoom);
    this.newRoom = {};
  // console.log(this.rooms[this.rooms.length - 1].width)
  },
  populate: function () {
    'use strict';
    // console.log('Rooms', this.rooms.length)
    let x, y;
    for (let i = 0; i < this.rooms.length; i++) {
      const room = this.rooms[i];
      let units = room.foes;
      // console.log('Room', i, this.rooms[i])
      while (units > 0) { // FOES
        x = lib.getRandomNumber(room.x, room.x + room.width - 1);
        y = lib.getRandomNumber(room.y, room.y + room.height - 1);
        if (this.map[x][y] === 2) {
          this.map[x][y] = 3;
          units--;
        }
      }
      units = room.foes;
      while (units > 1) { // WEAPONS
        x = lib.getRandomNumber(room.x, room.x + room.width - 1);
        y = lib.getRandomNumber(room.y, room.y + room.height - 1);
        if (this.map[x][y] === 2) {
          this.map[x][y] = 4;
          units--;
        }
      }
      units = room.foes;
      while (units > 1) { // POTIONS
        x = lib.getRandomNumber(room.x, room.x + room.width - 1);
        y = lib.getRandomNumber(room.y, room.y + room.height - 1);
        if (this.map[x][y] === 2) {
          this.map[x][y] = 5;
          units--;
        }
      }
    }
    // HERO{
    let hero = false;
    while (!hero) {
      x = lib.getRandomNumber(1, this.cols - 1);
      y = lib.getRandomNumber(1, this.rows - 1);
      if (this.map[x][y] === 2) {
        this.map[x][y] = 6;
        // console.log('HERO', x, y)
        this.center.x = x;
        this.center.y = y;
        this.heroPos.x = x;
        this.heroPos.y = y;
        hero = true;
      }
    }
    // BOSS
    let boss = false;
    while (!boss) {
      x = lib.getRandomNumber(1, this.cols - 1);
      y = lib.getRandomNumber(1, this.rows - 1);
      if (this.map[x][y] === 2) {
        this.map[x][y] = 7;
        // console.log('BOSS', x, y)
        boss = true;
      }
    }
  },

  getFoes: function () {
    let cont = 0;
    for (let x = 0; x < dungeon.cols; x++) {
      for (let y = 0; y < dungeon.rows; y++) {
        if (dungeon.map[x][y] === 3) {
          const myFoe = Object.create(app.foe);
          myFoe.x = x;
          myFoe.y = y;
          this.foes.push(myFoe);
        }
      }
    }
  // console.log(this.foes)
  },

  putWalls: function (roomNumber) {
    'use strict';
    const x = this.rooms[roomNumber].x;
    const y = this.rooms[roomNumber].y;
    const width = this.rooms[roomNumber].width;
    const height = this.rooms[roomNumber].height;
    // console.log(x, y, roomWidth, roomHeight)
    for (let i = x - 1; i < x + 1 + width; i++) {
      for (let j = y - 1; j < y + 1 + height; j++) {
        if (this.map[i][j] === 0) {
          // console.log(i, j)
          this.map[i][j] = 1;
        }
      }
    }
  },
  putAllWalls: function () {
    'use strict';
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        // console.log(x, y)
        if (this.map[x][y] === 0) {
          if (y > 0 && this.map[x][y - 1] === 2) { // NORTH
            this.map[x][y] = 1;
          } else if (x < this.cols - 1 && this.map[x + 1][y] === 2) { // EAST
            this.map[x][y] = 1;
          } else if (y < this.rows - 1 && this.map[x][y + 1] === 2) { // SOUTH
            this.map[x][y] = 1;
          } else if (x > 0 && this.map[x - 1][y] === 2) { // WEST
            this.map[x][y] = 1;
          }
        }
      }
    }
  },
  isNotCorner: function (x, y) {
    'use strict';
    // console.log(x, y)
    if (x < 1 || x >= this.cols - 1 || y < 1 || y >= this.rows - 1) { // Protec
      return false;
    } else if (this.map[x - 1][y] === 2) {
      return true;
    } else if (this.map[x + 1][y] === 2) {
      return true;
    } else if (this.map[x][y - 1] === 2) {
      return true;
    } else if (this.map[x][y + 1] === 2) {
      return true;
    } else return false;
  },
  getFeatureDirection: function (x, y) {
    'use strict';
    let aux = lib.getRandomNumber(1, 4);
    let cont = 0;
    let ok = false;
    while (!ok && cont < 10) {
      if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) { // Protection
        // console.log()
      } else if (this.map[x][y + 1] === 2 && aux === 1) { // NORTH
        ok = true;
      } else if (this.map[x - 1][y] === 2 && aux === 2) { // EAST
        ok = true;
      } else if (this.map[x][y - 1] === 2 && aux === 3) { // SOUTH
        ok = true;
      } else if (this.map[x + 1][y] === 2 && aux === 4) { // WEST
        ok = true;
      } else {
        cont++;
        aux = lib.getRandomNumber(1, 4);
      }
    }
    return aux;
  }
};

const m = [
  '/_assets/images/rogue/wall.png',
  '/_assets/images/rogue/brick.png',
  '/_assets/images/rogue/floor.png',
  '/_assets/images/rogue/skeleton.gif',
  '/_assets/images/rogue/chest.png',
  '/_assets/images/rogue/food.png',
  'https://freecodecamp.codetabs.com/_assets/images/rogue/down.gif',
  '/_assets/images/rogue/dragon.png'
];

const rendererPlay = (function () {
  'use strict';
  // console.log('Drawing Map...')
  let canvas;
  let ctx;
  const cols = 13;
  const rows = 11;
  const ppp = 40;
  let center = dungeon.center;
  let posX = cols - Math.floor(cols / 2); // 7
  let posY = rows - Math.floor((rows / 2)); // 6
  let back = new Image();

  function setMyCanvas () {
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = cols * ppp;
    canvas.height = rows * ppp;
  }

  function drawMyCanvasCenteredOnHero (map) {
    // console.log('center =>', center.x, center.y)
    // console.log(' x =>', center.x - posX, center.x + posX)
    // console.log(' y =>', center.y - posY, center.y + posY)
    let x, y,tile;
    for (x = center.x - posX; x < center.x + posX; x++) {
      // console.log('COLUMN', x)
      if (x >= 0 && x < dungeon.cols) {
        for (y = center.y - posY; y < center.y + posY; y++) {
          tile = map[x][y];
          let i = x - center.x - posX + cols;
          let j = y - center.y - posY + rows;
          if (tile === undefined || x > dungeon.cols - 1 || y >
            dungeon.rows - 1) { // y is out of the borders
            ctx.fillStyle = 'black';
            back.src = m[0];
          } else {
            if (tile === 0) {
              ctx.fillStyle = 'teal'; // earth
              back.src = m[0];
            } else if (tile === 1) {
              ctx.fillStyle = 'darkgrey'; // wall
              back.src = m[1];
            } else if (tile === 2) {
              ctx.fillStyle = 'bisque'; // walkable floor
              back.src = m[2];
            } else if (tile === 3) {
              ctx.fillStyle = 'coral'; // foe
              back.src = m[3];
            } else if (tile === 4) {
              ctx.fillStyle = 'skyblue'; // weapon
              back.src = m[4];
            } else if (tile === 5) {
              ctx.fillStyle = 'darkseagreen'; // potions
              back.src = m[5];
            } else if (tile === 6) {
              ctx.fillStyle = 'magenta'; // hero
              back.src = m[6];
            } else if (tile === 7) {
              ctx.fillStyle = 'gold'; // FINAL BOSS
              back.src = m[7];
            }
          }
          // ctx.drawImage(back, (i * ppp) , (j * ppp), 40, 40)
          ctx.fillRect((i * ppp) + 1, (j * ppp) + 1, ppp - 1, ppp - 1);
        }
      } else { // draw all column that is out of borders
        for (y = center.y - posY; y < center.y + posY; y++) {
          ctx.fillStyle = 'black'; // no exists
          let i2 = x - center.x - posX + cols;
          let j2 = y - center.y - posY + rows;
          ctx.fillRect((i2 * ppp) + 1, (j2 * ppp) + 1, ppp - 1, ppp - 1);
        // back.src = m[0]
        // ctx.drawImage(back, (i2 * ppp) , (j2 * ppp), 40, 40)
        }
      }
    }
  }
  return {
    setMyCanvas: setMyCanvas,
    drawMyCanvasCenteredOnHero: drawMyCanvasCenteredOnHero
  };
}());

const rendererBig = (function () {
  'use strict';
  // console.log('Drawing Map...')
  let canvas;
  let ctx;
  const cols = dungeon.cols;
  const rows = dungeon.rows;
  const ppp = dungeon.ppp;

  function setMyCanvas () {
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = cols * ppp;
    canvas.height = rows * ppp;
  }

  function drawMyCanvas (map) {
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        let tile = map[x][y];
        if (tile === 0) {
          ctx.fillStyle = 'teal'; // earth
        } else if (tile === 1) {
          ctx.fillStyle = 'darkgrey'; // wall
        } else if (tile === 2) {
          ctx.fillStyle = 'bisque'; // walkable floor
        } else if (tile === 3) {
          ctx.fillStyle = 'coral'; // foe
        } else if (tile === 4) {
          ctx.fillStyle = 'skyblue'; // weapon
        } else if (tile === 5) {
          ctx.fillStyle = 'darkseagreen'; // potions
        } else if (tile === 6) {
          ctx.fillStyle = 'magenta'; // hero
        } else if (tile === 7) {
          ctx.fillStyle = 'gold'; // FINAL BOSS
        }
        ctx.fillRect((x * ppp) + 1, (y * ppp) + 1, ppp - 1, ppp - 1);
      }
    }
  }
  return {
    setMyCanvas: setMyCanvas,
    drawMyCanvas: drawMyCanvas
  };
}());
