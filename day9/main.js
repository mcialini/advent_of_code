'use strict';
const fs = require('fs');

class Marble {
  constructor({ value, prev, next }) {
    this.value = value;
    this.prev = prev;
    this.next = next;
  }
}

const getInput = () => {
  let data = fs.readFileSync('input.txt').toString('utf8');
  return data.split('\n').filter(Boolean)[0];
};

const partOne = (input) => {
  const regex = /(\d+) players; last marble is worth (\d+) points/;
  const [,numPlayers, numMarbles] = input.match(regex);

  const playerScores = {};
  const firstMarble = new Marble({ value: 0 });
  let currentMarble = firstMarble;
  firstMarble.prev = firstMarble;
  firstMarble.next = firstMarble;

  for (let m = 1; m <= numMarbles; m++) {
    if (m % 23 === 0) {
      for (let i = 0; i < 7; i++) {
        currentMarble = currentMarble.prev;
      }
      const currentPlayer = m % numPlayers;
      const currentScore = playerScores[currentPlayer];
      playerScores[currentPlayer] = (currentScore || 0) + m + currentMarble.value;

      const prev = currentMarble.prev;
      const next = currentMarble.next;
      prev.next = next;
      currentMarble = next;
    } else {
      const newMarble = new Marble({ value: m });
      const prev = currentMarble.next;
      const next = currentMarble.next.next;
      prev.next = newMarble;
      next.prev = newMarble;
      newMarble.prev = prev;
      newMarble.next = next;
      currentMarble = newMarble;
    }
  }
  return Math.max(...Object.values(playerScores));
}

const partTwo = (input) => {
  const regex = /(\d+) players; last marble is worth (\d+) points/;
  let [,numPlayers, numMarbles] = input.match(regex);
  return partOne(`${numPlayers} players; last marble is worth ${numMarbles * 100} points`);
};

console.log(partOne(getInput()));
console.log(partTwo(getInput()));
