'use strict';
const fs = require('fs');

const getInput = () => {
  const data = fs.readFileSync('input.txt').toString('utf8');
  return data.split('\n')
    .filter(Boolean)
    .map((coor) => coor.split(', ')
      .map((d) => parseInt(d))
    );
};

const stringify = (c) => c.join(',');

const manhattanDistance = (c1, c2) => {
  return Math.abs(c1[0] - c2[0]) + Math.abs(c1[1] - c2[1]);
};

const getDistanceMap = (input) => {
  let [minX, minY] = input[0];
  let [maxX, maxY] = input[0];
  for (const [x, y] of input.slice(1)) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }

  const distanceMap = {};
  for (let i = minX; i <= maxX; i++) {
    distanceMap[i] = {};
    for (let j = minY; j <= maxY; j++) {
      distanceMap[i][j] = {};
      for (const coor of input) {
        distanceMap[i][j][stringify(coor)] = manhattanDistance(coor, [i, j]);
      }
    }
  }
  return { minX, minY, maxX, maxY, distanceMap };
};

const displayGrid = () => {
  const letters = {
    '1,1': 'A',
    '1,6': 'B',
    '8,3': 'C',
    '3,4': 'D',
    '5,5': 'E',
    '8,9': 'F'
  };
  let grid = [...Array(maxY + 1)].map(e => Array(maxX + 1).fill('.'));
  for (const x of Object.keys(distanceMap)) {
    for (const y of Object.keys(distanceMap[x])) {
      let closestCoor;
      let minDistance = Infinity;
      for (const coor of Object.keys(distanceMap[x][y])) {
        const curDistance = distanceMap[x][y][coor];
        if (curDistance < minDistance) {
          closestCoor = coor;
          minDistance = distanceMap[x][y][coor];
        }
      }
      const equidistantCoors = Object.keys(distanceMap[x][y])
        .filter((k) => distanceMap[x][y][k] === minDistance);
      if (equidistantCoors.length === 1) {
        // if you're the closest one to a spot on the edge of the partial grid
        // your area is infinite
        if (x == minX || x == maxX || y == minY || y == maxY) {
          areaMap[closestCoor] = Infinity;
        } else if (stringify([x, y]) === closestCoor) {
          continue;
        } else if (areaMap[closestCoor]) {
          areaMap[closestCoor]++;
          grid[parseInt(y)][parseInt(x)] = letters[closestCoor];
        }
      }
    }
  }
};

const displayGrid2 = ({ minX, minY, maxX, maxY, points }) => {
  let grid = [...Array(maxY + 1)].map(e => Array(maxX + 1).fill('.'));
  for (const point of points) {
    const [x, y] = point.split(',');
    grid[parseInt(y)][parseInt(x)] = '#';
  }
  return grid;
};

const partOne = (input) => {
  const { minX, minY, maxX, maxY, distanceMap } = getDistanceMap(input);

  const areaMap = {};
  for (const coor of input) {
    areaMap[stringify(coor)] = 1;
  }

  for (const x of Object.keys(distanceMap)) {
    for (const y of Object.keys(distanceMap[x])) {
      let closestCoor;
      let minDistance = Infinity;
      for (const coor of Object.keys(distanceMap[x][y])) {
        const curDistance = distanceMap[x][y][coor];
        if (curDistance < minDistance) {
          closestCoor = coor;
          minDistance = distanceMap[x][y][coor];
        }
      }
      const equidistantCoors = Object.keys(distanceMap[x][y])
        .filter((k) => distanceMap[x][y][k] === minDistance);
      if (equidistantCoors.length === 1) {
        // if you're the closest one to a spot on the edge of the partial grid
        // your area is infinite
        if (x == minX || x == maxX || y == minY || y == maxY) {
          areaMap[closestCoor] = Infinity;
        } else if (stringify([x, y]) === closestCoor) {
          continue;
        } else if (areaMap[closestCoor]) {
          areaMap[closestCoor]++;
        }
      }
    }
  }

  return Object.keys(areaMap).reduce((maxArea, coor) => {
    const area = areaMap[coor];
    if (area > maxArea && area !== Infinity) {
      maxArea = area;
    }
    return maxArea;
  }, 0);
};

const partTwo = (input) => {
  const { minX, minY, maxX, maxY, distanceMap } = getDistanceMap(input);
  const maxTotal = 10000;
  const region = [];
  for (const x of Object.keys(distanceMap)) {
    for (const y of Object.keys(distanceMap[x])) {
      const total = Object.values(distanceMap[x][y]).reduce((sum, v) => sum + v, 0);
      if (total < maxTotal) region.push(stringify([x, y]));
    }
  }
  // console.log(displayGrid2({ minX, minY, maxX, maxY, points: region }));
  return region.length;
};


console.log(partOne(getInput()));
console.log(partTwo(getInput()));
