'use strict';

const fs = require('fs');

const str = (x, y) => `${x},${y}`;
const pos = (p) => p.split(',').map((p1) => parseInt(p1));

let paths = {};
let carts = {};

const createPaths = (filename) => {
  let data = fs.readFileSync(filename).toString('utf8');
  data = data.split('\n').filter(Boolean);
  carts = {};
  paths = {};
  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[y].length; x++) {
      const char = data[y][x];
      if (char === ' ') continue;
      if (char === '<') {
        paths[str(x, y)] = '-';
        carts[str(x, y)] = new Cart({ x, y, direction: 'LEFT' });
      } else if (char === '>') {
        paths[str(x, y)] = '-';
        carts[str(x, y)] = new Cart({ x, y, direction: 'RIGHT' });
      } else if (char === '^') {
        paths[str(x, y)] = '|';
        carts[str(x, y)] = new Cart({ x, y, direction: 'UP' });
      } else if (char === 'v') {
        paths[str(x, y)] = '|';
        carts[str(x, y)] = new Cart({ x, y, direction: 'DOWN' });
      } else {
        paths[str(x, y)] = char;
      }
    }
  }
};

const TURN_ORDER = ['LEFT', 'STRAIGHT', 'RIGHT'];

const moveDirection = {
  LEFT: ({ x, y }) => ({ x: x - 1, y }),
  RIGHT: ({ x, y }) => ({ x: x + 1, y }),
  UP: ({ x, y }) => ({ x, y: y - 1 }),
  DOWN: ({ x, y }) => ({ x, y: y + 1 }),
}

const takePathFromDirection = {
  '|': {
    UP: 'UP',
    DOWN: 'DOWN'
  },
  '-': {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT'
  },
  '/': {
    LEFT: 'DOWN',
    RIGHT: 'UP',
    UP: 'RIGHT',
    DOWN: 'LEFT'
  },
  '\\': {
    LEFT: 'UP',
    RIGHT: 'DOWN',
    UP: 'LEFT',
    DOWN: 'RIGHT'
  }
}

class Cart {
  constructor({ x, y, direction }) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.nextTurnIndex = 0;
  }

  move() {
    delete carts[str(this.x, this.y)];
    const { x: newX, y: newY } = moveDirection[this.direction]({ x: this.x, y: this.y });
    this.x = newX;
    this.y = newY;

    const nextPathType = paths[str(this.x, this.y)];
    if (!nextPathType) {
      throw new Error('No road.');
    }
    if (nextPathType === 'X') {
      throw new Error('Found a crash');
    }

    if (carts[str(this.x, this.y)]) {
      return 'X';
    }

    // it's a valid road segment with no cart on it
    // process the move 
    if (nextPathType === '+') {
      const turn = TURN_ORDER[this.nextTurnIndex];
      const s = {
        DOWN: {
          LEFT: 'RIGHT',
          RIGHT: 'LEFT',
          STRAIGHT: 'DOWN'
        },
        UP: {
          LEFT: 'LEFT',
          RIGHT: 'RIGHT',
          STRAIGHT: 'UP'
        },
        LEFT: {
          LEFT: 'DOWN',
          RIGHT: 'UP',
          STRAIGHT: 'LEFT'
        },
        RIGHT: {
          LEFT: 'UP',
          RIGHT: 'DOWN',
          STRAIGHT: 'RIGHT'
        }
      }
      this.direction = s[this.direction][turn];
      this.nextTurnIndex = (this.nextTurnIndex + 1) % TURN_ORDER.length;
    } else {
      this.direction = takePathFromDirection[nextPathType][this.direction];
    }
    carts[str(this.x, this.y)] = this;

    return nextPathType;
  }
}

const getSortedCartPositions = () => {
  return Object.keys(carts).sort((p1, p2) => {
    const [x1, y1] = p1.split(',').map((p) => parseInt(p));
    const [x2, y2] = p2.split(',').map((p) => parseInt(p));
    if (parseInt(y1) < parseInt(y2)) return -1;
    if (parseInt(y1) > parseInt(y2)) return 1;
    if (parseInt(x1) < parseInt(x2)) return -1;
    if (parseInt(x1) > parseInt(x2)) return 1;
    return 0;
  });
};

const partOne = (filename) => {
  console.log('-'.repeat(50));
  console.log('PART ONE');
  createPaths(filename);
  while (true) {
    const sortedCartPositions = getSortedCartPositions();
    for (const pos of sortedCartPositions) {
      const cart = carts[pos];
      const moveResult = cart.move();
      if (moveResult === 'X') {
        return str(cart.x, cart.y);
      }
    }
  }
};

const partTwo = (filename) => {
  console.log('-'.repeat(50));
  console.log('PART TWO');
  createPaths(filename);
  while (true) {
    const sortedCartPositions = getSortedCartPositions();
    if (sortedCartPositions.length === 1) {
      return str(...pos(sortedCartPositions[0]));
    }
    for (const pos of sortedCartPositions) {
      const cart = carts[pos];
      if (!cart) continue;
      const moveResult = cart.move();
      if (moveResult === 'X') {
        console.log(`crash: ${cart.x}, ${cart.y}`);
        delete carts[str(cart.x, cart.y)];
      }
    }
  }
};



console.log(`ANSWER: ${partOne('input.txt')}`);
console.log(`ANSWER: ${partTwo('input.txt')}`);
