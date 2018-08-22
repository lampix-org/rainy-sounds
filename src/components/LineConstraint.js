import { matterSetup } from '../index';

// A line constraint used to link objects together.
export default class LineConstraint {
  constructor(bA, bB, offsetA, offsetB, constraintLength, color, parentId) {
    this.color = color;
    this.type = 'LineConstraint';
    this.parentId = parentId;

    this.options = {
      bodyA: bA,
      bodyB: bB,
      pointA: offsetA,
      pointB: offsetB,
      length: constraintLength,
      render: {
        strokeStyle: color,
        visible: true
      }
    };

    this.constraint = matterSetup.utils.createConstraint(this.options);
  }

  update() {
    if (this.animStep > 0) {
      this.animStep--;
    } else {
      this.complete = true;
    }
  }
}
