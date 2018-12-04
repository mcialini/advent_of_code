'use strict';
const fs = require('fs');

// time: O(2n), space: O(n)
const getClaims = () => {
  const data = fs.readFileSync('input.txt').toString('utf8');
  return data.split('\n').filter(Boolean);
};

const partOne = () => {
  const claimedInches = {};
  const claims = getClaims();
  let overlaps = 0;
  const re = /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/;
  for (const claim of claims) {
    let [claimId, x, y, w, h] = claim.match(re).slice(1).map(Number);
    for (var xx = x; xx < x + w; xx++) {
      for (var yy = y; yy < y + h; yy++) {
        if (!claimedInches[xx]) {
          claimedInches[xx] = { [yy]: 1 };
        } else if (!claimedInches[xx][yy]) {
          claimedInches[xx][yy] = 1;
        } else if (claimedInches[xx][yy] == 1) {
          claimedInches[xx][yy] = 2;
          overlaps++;
        }
      }
    }
  }
  return overlaps;
};

const partTwo = () => {
  const claimedInches = {};
  const claims = getClaims();
  console.time('part2');
  const re = /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/;
  for (const claim of claims) {
    let [claimId, x, y, w, h] = claim.match(re).slice(1).map(Number);
    for (var xx = x; xx < x + w; xx++) {
      for (var yy = y; yy < y + h; yy++) {
        if (!claimedInches[xx]) {
          claimedInches[xx] = { [yy]: 1 };
        } else if (!claimedInches[xx][yy]) {
          claimedInches[xx][yy] = 1;
        } else if (claimedInches[xx][yy] == 1) {
          claimedInches[xx][yy] = 2;
        }
      }
    }
  }
  for (const claim of claims) {
    let [claimId, x, y, w, h] = claim.match(re).slice(1).map(Number);
    let hits = w * h;
    for (var xx = x; xx < x + w; xx++) {
      for (var yy = y; yy < y + h; yy++) {
        if (claimedInches[xx][yy] == 1) {
          hits--;
        }
      }
    }
    if (hits === 0) return claimId;
  }
  throw new Error('none');
};

console.log(partOne());
console.log(partTwo());
