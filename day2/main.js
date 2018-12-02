'use strict';
const fs = require('fs');

const getInput = () => {
  const data = fs.readFileSync('input.txt').toString('utf8');
  return data.split('\n').filter(Boolean);
};

/*
To make sure you didn't miss any, you scan the likely candidate boxes again, counting the number that have an ID containing exactly two of any letter and then separately counting those with exactly three of any letter. You can multiply those two counts together to get a rudimentary checksum and compare it to what your device predicts.

time: O(n*m), where n is the number of strings and m is the length of the string
space: O(n*c)
*/
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

/*
The boxes will have IDs which differ by exactly one character at the same position in both strings. What letters are common between the two correct box IDs? 

time: O(n^2)
space: O(n)
*/
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
