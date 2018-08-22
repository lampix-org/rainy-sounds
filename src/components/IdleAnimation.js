import { screensaverCtx, cw, ch } from '../index';

const { range } = require('../utils/range');

export default class IdleAnimation {
  constructor() {
    this.type = 'IdleAnimation';
    this.numberOfLines = 300;
    this.lines = [];
    this.counter = 0;
    this.zStep = 0.01;
    this.centerX = cw / 2;
    this.centerY = ch / 2;
    this.rand = Math.random;

    [...(range(0, this.numberOfLines))].forEach(() => {
      const line = {};
      this.resetLine(line);
      this.lines.push(line);
    });
  }

  draw() {
    screensaverCtx.fillRect(0, 0, cw, ch);
    this.lines.forEach((line, index) => {
      line.z -= this.zStep;
      const x = line.x / line.z;
      const y = line.y / line.z;
      if (line.newX !== 0) {
        screensaverCtx.beginPath();
        screensaverCtx.strokeStyle = `hsl(${(this.counter * index * 3) % 205}, 100%, 50%)`;
        screensaverCtx.lineWidth = 4;
        screensaverCtx.moveTo(x + this.centerX, y + this.centerY);
        screensaverCtx.lineTo(line.newX + this.centerX, line.newY + this.centerY);
        screensaverCtx.stroke();
      }
      line.newX = x;
      line.newY = y;

      if (line.z < this.zStep || line.newX > cw || line.newY > ch) {
        this.resetLine(line);
      }
    });
    this.counter += 0.0085;
  }

  resetLine(line) {
    line.x = (this.rand() * cw - (cw / 2));
    line.y = (this.rand() * ch - (ch / 2));
    line.z = 1;
    line.newX = 0;
    line.newY = 0;
  }
}
