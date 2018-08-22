import { ctx } from '../index';

export default class ChronometerCircle {
  constructor(x, y, r, color, parentId) {
    this.x = x;
    this.y = y;

    this.endPercent = 100;
    this.currentPercent = 0;
    this.angle = this.currentPercent * (Math.PI / 180);
    this.radius = r;
    this.color = color;
    this.type = 'ChronometerCircle';
    this.parentId = parentId;
    this.drawCount = 0;
    this.drawCountLimit = 500;
  }

  update() {
    this.currentPercent = this.currentPercent + 3;
    this.angle = this.currentPercent * (Math.PI / 180);
    this.drawCount++;
  }

  draw() {
    if (this.drawCount >= this.drawCountLimit) {
      return;
    }
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.arc(this.x, this.y, this.radius, this.angle, this.angle + ((5 * Math.PI) / 3));
    ctx.strokeStyle = this.color;
    ctx.stroke();
  }
}
