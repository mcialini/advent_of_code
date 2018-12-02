'use strict';
const fs = require('fs');

// time: O(2n), space: O(n)
const getNumbers = () => {
  const data = fs.readFileSync('input.txt').toString('utf8');
  return data.split('\n').map((num) => parseInt(num)).filter(Boolean);
};

/*
Starting with a frequency of zero, what is the resulting frequency after all of the changes in frequency have been applied?

time: O(n)
space: O(1)
*/
const partOne = () => {
  return getNumbers().reduce((sum, n) => {
    return sum + n;
  }, 0);
};

/*
What is the first frequency your device reaches twice?

time: O(n)
space: O(2n)
*/
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
