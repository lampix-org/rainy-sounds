import { ctx } from '../index';

export default class PulsatingCircle {
  constructor(x, y, color, parentId) {
    this.x = x;
    this.y = y;
    this.targetRadius = 0;
    this.color = color;
    this.type = 'PulsatingCircle';
    this.parentId = parentId;
  }

  update() {
    if (this.targetRadius < 8) {
      this.targetRadius += 0.3;
    } else {
      this.targetRadius = 1;
    }
  }

  draw() {
    ctx.beginPath();
    // draw the target for this firework with a pulsing circle
    ctx.arc(this.x, this.y, this.targetRadius, 0, Math.PI * 2);
    ctx.strokeStyle = this.color; // 'hsl(50, 100%, 100%)';
    ctx.stroke();
  }
}
