'use strict';
const fs = require('fs');

const getInput = () => {
  const data = fs.readFileSync('input.txt').toString('utf8');
  return data.split('\n').filter(Boolean);
};

const partOne = () => {
  const total = getInput().reduce((final, str) => {
    const counts = {};
    for (var i in str) {
      counts[str[i]] = counts[str[i]] ? counts[str[i]] + 1 : 1;
    }
    const adds = { two: 0, three: 0 };
    for (var v of Object.values(counts)) {
      if (v === 2) adds.two = 1;
      if (v === 3) adds.three = 1;
      if (adds.two && adds.three) break;
    }
    final.two += adds.two;
    final.three += adds.three;
    return final;
  }, { two: 0, three: 0 });
  return total.two * total.three;
};

const partTwo = () => {
  const getMatchingChars = (a, b) => {
    let match = '';
    for (var i in a) {
      if (a[i] === b[i]) {
        match += a[i];
      }
    }
    return match;
  };
  const strings = getInput();
  for (const string1 of strings) {
    for (const string2 of strings) {
      const match = getMatchingChars(string1, string2);
      if (match.length === string1.length - 1) { // assumes all strings have same length
        return match;
      }
    }
  }
};

console.log(partOne());
console.log(partTwo());
