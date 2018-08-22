import { ctx } from '../index';

export default class StraightLine {
  constructor(xa, ya, xb, yb, color, thickness, parentId, targetId) {
    this.xa = xa;
    this.ya = ya;
    this.xb = xb;
    this.yb = yb;
    this.color = color;
    this.thickness = thickness;
    this.type = 'StraightLine';
    this.parentId = parentId;
    this.targetId = targetId;
    this.complete = false;

    this.animSteps = 51;
    this.animStep = 1;

    this.waypoints = [];
    const pt0 = { x: this.xa, y: this.ya };
    const pt1 = { x: this.xb, y: this.yb };
    const dx = pt1.x - pt0.x;
    const dy = pt1.y - pt0.y;
    for (let j = 0; j < this.animSteps; j++) {
      const x = pt0.x + dx * j / this.animSteps;
      const y = pt0.y + dy * j / this.animSteps;
      this.waypoints.push({ x, y });
    }
  }

  update() {
    if (this.animStep < 50) {
      this.animStep++;
    } else {
      this.complete = true;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.lineWidth = this.thickness;
    ctx.globalCompositeOperation = 'destination-over';
    ctx.strokeStyle = this.color;

    ctx.moveTo(this.waypoints[0].x, this.waypoints[0].y);
    ctx.lineTo(this.waypoints[this.animStep].x, this.waypoints[this.animStep].y);
    ctx.stroke();
  }
}
