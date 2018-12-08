'use strict';
const { DefaultDict } = require('../utils'); 
const fs = require('fs');

const getInput = () => {
  const data = fs.readFileSync('input.txt').toString('utf8');
  return data.split('\n').filter(Boolean);
};

const partOne = (input) => {
  // step -> [all letters it's blocked by]
  const regex = /Step (.+) must be finished before step (.+) can begin./;
  const stepPrereqs = new DefaultDict(Set);
  const stepUnblocks = new DefaultDict(Set);;
  for (const instruction of input) {
    const [_, prereq, step] = instruction.match(regex);
    stepPrereqs[step].add(prereq);
    stepUnblocks[prereq].add(step);
  }
  const allSteps = Array.from(new Set([...Object.keys(stepPrereqs), ...Object.keys(stepUnblocks)])).sort();

  const completedSteps = [];
  let i = 0;
  while (allSteps.length) {
    // console.log(JSON.stringify(completedSteps));
    const step = allSteps[i];
    if (stepPrereqs[step].size === 0) {
      completedSteps.push(step);
      allSteps.splice(i, 1);
      for (const unblockedStep of stepUnblocks[step]) {
        stepPrereqs[unblockedStep].delete(step);
      }
      i = 0;
    } else {
      i++;
    }
  }
  return completedSteps.join('');
};

const partTwo = (input) => {
  const workTime = (letter) => {
    // A.charCodeAt(0) = 65, but should equal 61.
    // so just subtract 4 from charCodeAt
    return letter.charCodeAt(0) - 4;
  }

  const regex = /Step (.+) must be finished before step (.+) can begin./;
  const stepPrereqs = new DefaultDict(Set);
  const stepUnblocks = new DefaultDict(Set);;
  for (const instruction of input) {
    const [_, prereq, step] = instruction.match(regex);
    stepPrereqs[step].add(prereq);
    stepUnblocks[prereq].add(step);
  }

  const pendingSteps = new Array(5).fill(null);
  const workers = new Array(5).fill(0);
  let incompleteSteps = Array.from(new Set([...Object.keys(stepPrereqs), ...Object.keys(stepUnblocks)])).sort();
  let timeElapsed = 0;

  while (incompleteSteps.length > 0 || workers.find(Boolean)) {
    // Check on what workers are now free
    // Update the list of steps that are now complete
    for (let w = 0; w < workers.length; w++) {
      if (workers[w] <= timeElapsed) {
        workers[w] = 0;
        const step = pendingSteps[w];
        if (!step) continue;
        pendingSteps[w] = null;
        for (const unblockedStep of stepUnblocks[step]) {
          stepPrereqs[unblockedStep].delete(step);
        }
      }
    }

    // Try and assign any open steps
    for (let i = 0; i < incompleteSteps.length; i++) {
      const step = incompleteSteps[i];
      if (!step) continue;
      if (stepPrereqs[step].size > 0) continue;

      for (let w = 0; w < workers.length; w++) {
        if (workers[w] <= timeElapsed) {
          // Assign the worker
          workers[w] = timeElapsed + workTime(step);
          // Add it to the worker's pending step slot
          pendingSteps[w] = step;
          // Remove it from incomplete steps
          delete incompleteSteps[i];
          // console.log(pendingSteps.map((step) => step || '.').join(''));
          break;
        }
      }
    }

    incompleteSteps = incompleteSteps.filter(Boolean);
    if (incompleteSteps.length || pendingSteps.filter(Boolean).length) timeElapsed = Math.max(Math.min(...workers), timeElapsed + 1);
  }
  return timeElapsed;
};

console.log(partOne(getInput()));
console.log(partTwo(getInput()));
