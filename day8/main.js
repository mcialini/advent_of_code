'use strict';
const { DefaultDict } = require('../utils'); 
const fs = require('fs');

const getInput = () => {
  let data = fs.readFileSync('input.txt').toString('utf8');
  data = data.split('\n').filter(Boolean)[0];
  return data.split(' ').map((n) => parseInt(n));
};

class Node {
  constructor() {
    this.children = [];
    this.meta = [];
    this.metaSum = 0;
    this.value = 0;
  }

  addChild(child) {
    this.children.push(child);
    this.metaSum += child.metaSum;
  }

  addMeta(meta) {
    this.meta.push(meta);
    this.metaSum += meta;
    if (this.children.length > 0) {
      // children use 1-based indexing
      const child = this.children[meta - 1];
      this.value += child ? child.value : 0;
    } else {
      this.value += meta;
    }
  }

  toString() {
    return JSON.stringify(this, null, 3);
  }
}

const composeSubtree = (input) => {
  // input = the full input as an array of numbers
  const numChildren = input.shift();
  const numMeta = input.shift();
  const root = new Node();

  // add the children
  for (let c = 0; c < numChildren; c++) {
    root.addChild(composeSubtree(input));
  }

  // add the meta
  for (let m = 0; m < numMeta; m++) {
    root.addMeta(input.shift());
  }

  return root;
};

const partOne = (input) => {
  const root = composeSubtree(input);
  return root.metaSum;
};

const partTwo = (input) => {
  const root = composeSubtree(input);
  return root.value;
};

console.log(partOne(getInput()));
console.log(partTwo(getInput()));
