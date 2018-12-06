'use strict';
const fs = require('fs');

const getPolymer = () => {
  const data = fs.readFileSync('input.txt').toString('utf8');
  return data.split('\n').filter(Boolean)[0];
};

const partOne = (input) => {
  let polymer = input.split('');
  let i = 0;
  while (i < polymer.length - 1) {
    const thisOne = polymer[i];
    const nextOne = polymer[i + 1];
    if (thisOne !== nextOne && thisOne.toLowerCase() === nextOne.toLowerCase()) {
      // reacting pair
      polymer.splice(i, 2);
      i--;
      if (i < 0) i = 0;
    } else {
      i++;
    }
  }
  return polymer.length;
};

const partTwo = (input) => {
  const letters = new Set([]);
  for (const letter of input) {
    letters.add(letter.toLowerCase());
  }
  let min = input.length;
  for (const letter of letters) {
    let re = new RegExp(`[${letter}${letter.toUpperCase()}]`, 'g');
    let tempPolymer = input.replace(re, '');
    const length = partOne(tempPolymer);
    min = Math.min(min, length);
  }
  return min;
};

console.log(partOne(getPolymer()));
console.log(partTwo(getPolymer()));
