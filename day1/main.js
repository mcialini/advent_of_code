'use strict';
const fs = require('fs');

const getNumbers = () => {
  console.log('getting numbers...');
  const data = fs.readFileSync('input.txt').toString('utf8');
  return data.split('\n').map((num) => parseInt(num)).filter(Boolean);
};

const partOne = () => {
  return getNumbers().reduce((sum, n) => {
    return sum + n;
  }, 0);
};

const partTwo = () => {
  const seen = new Set([]);
  let sum = 0;
  const helper = () => {
    for (const number of getNumbers()) {
      sum += number;
      if (seen.has(sum)) return sum;
      else seen.add(sum);
    }
    return helper();
  }
  return helper();
};

console.log(partOne());
console.log(partTwo());
