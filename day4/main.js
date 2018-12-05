'use strict';
const fs = require('fs');

// time: O(2n), space: O(n)
const getEntries = () => {
  const data = fs.readFileSync('input.txt').toString('utf8');
  return data.split('\n').filter(Boolean);
};

const getSortedLines = () => {
  let lines = getEntries();
  lines.sort();
  return lines;
};

const partOne = () => {
  const lines = getSortedLines();
  const minuteRe = /\[.+:(\d\d)\]/;
  const beginShiftRe = /Guard #(\d+) begins shift/;
  const wakesUpRe = /wakes up/;
  const fallsAsleepRe = /falls asleep/;

  const minutes = [];
  let curGuard;
  let firstMinuteAsleep;
  for (const line of lines) {
    const beginShiftMatch = line.match(beginShiftRe);
    if (beginShiftMatch) {
      curGuard = beginShiftMatch[1];
      continue;
    }

    const fallsAsleepMatch = line.match(fallsAsleepRe);
    if (fallsAsleepMatch) {
      firstMinuteAsleep = parseInt(line.match(minuteRe)[1]);
      continue;
    }

    const wakesUpMatch = line.match(wakesUpRe);
    if (wakesUpMatch) {
      const firstMinuteAwake = parseInt(line.match(minuteRe)[1]);
      for (let i = firstMinuteAsleep; i < firstMinuteAwake; i++) {
        let guardsAsleepThisMinute = minutes[i];
        if (!guardsAsleepThisMinute) {
          minutes[i] = {
            [curGuard]: 1
          }
        } else if (!guardsAsleepThisMinute[curGuard]) {
          guardsAsleepThisMinute[curGuard] = 1;
        } else {
          guardsAsleepThisMinute[curGuard]++;
        }
      }
    }
  }

  // guardId -> { minute, total times sleeping that minute }
  let guardMostFrequentMinuteAsleep = {};

  // guardId -> total minutes asleep
  let guardTotalMinutesAsleep = {};

  for (let m = 0; m < minutes.length; m++) {
    const guardsAsleepThisMinute = minutes[m];
    if (!guardsAsleepThisMinute) continue;

    Object.keys(guardsAsleepThisMinute).forEach((guard) => {
      const totalForGuardThisMinute = guardsAsleepThisMinute[guard];
      const currentMaxForGuard = guardMostFrequentMinuteAsleep[guard];
      if (!currentMaxForGuard || currentMaxForGuard.total < totalForGuardThisMinute) {
        guardMostFrequentMinuteAsleep[guard] = {
          minute: m,
          total: totalForGuardThisMinute
        }
      }

      guardTotalMinutesAsleep[guard] = guardTotalMinutesAsleep[guard] + totalForGuardThisMinute || totalForGuardThisMinute;
    });
  }
  const sleepiestGuard = Object.keys(guardTotalMinutesAsleep).reduce((max, guard) => {
    const total = guardTotalMinutesAsleep[guard]
    if (total > max.total) {
      max = { total, guard };
    } 
    return max;
  }, { total: 0, guard: null }).guard;

  return sleepiestGuard * guardMostFrequentMinuteAsleep[sleepiestGuard].minute;
};

const partTwo = () => {
  const lines = getSortedLines();
  const minuteRe = /\[.+:(\d\d)\]/;
  const beginShiftRe = /Guard #(\d+) begins shift/;
  const wakesUpRe = /wakes up/;
  const fallsAsleepRe = /falls asleep/;

  const minutes = [];
  let curGuard;
  let firstMinuteAsleep;
  for (const line of lines) {
    const beginShiftMatch = line.match(beginShiftRe);
    if (beginShiftMatch) {
      curGuard = beginShiftMatch[1];
      continue;
    }

    const fallsAsleepMatch = line.match(fallsAsleepRe);
    if (fallsAsleepMatch) {
      const minute = parseInt(line.match(minuteRe)[1]);
      firstMinuteAsleep = minute;
      continue;
    }

    const wakesUpMatch = line.match(wakesUpRe);
    if (wakesUpMatch) {
      const firstMinuteAwake = parseInt(line.match(minuteRe)[1]);
      for (let i = firstMinuteAsleep; i < firstMinuteAwake; i++) {
        let guardsAsleepThisMinute = minutes[i];
        if (!guardsAsleepThisMinute) {
          minutes[i] = {
            [curGuard]: 1
          }
        } else if (!guardsAsleepThisMinute[curGuard]) {
          guardsAsleepThisMinute[curGuard] = 1;
        } else {
          guardsAsleepThisMinute[curGuard]++;
        }
      }
    }
  }

  let sleepiestGuard;
  let sleepiestMinute;
  let sleepiestMinuteCount;
  for (let m = 0; m < minutes.length; m++) {
    Object.keys(minutes[m]).forEach((guard) => {
      if (!sleepiestGuard || sleepiestMinuteCount < minutes[m][guard]) {
        sleepiestGuard = guard;
        sleepiestMinute = m;
        sleepiestMinuteCount = minutes[m][guard];
      }
    });
  }

  return sleepiestGuard * sleepiestMinute;
};

console.log(partOne());
console.log(partTwo());
