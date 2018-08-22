import { ctx } from '../index';
import calculateDistance from '../utils/calculateDistance';
import angleOnCircle from '../utils/angleOnCircle';

export default class CurvedLine {
  constructor(xa, ya, xb, yb, color, thickness, parentId, targetId) {
    this.xa = xa;
    this.ya = ya;
    this.xb = xb;
    this.yb = yb;
    this.color = color;
    this.thickness = thickness;
    this.type = 'CurvedLine';
    this.parentId = parentId;
    this.targetId = targetId;
    this.complete = false;

    this.animSteps = 50;
    this.animStep = this.animSteps;

    // c is the centerpoint between a and b
    const xc = (xa + xb) / 2.0;
    const yc = (ya + yb) / 2.0;

    this.xc = xc;
    this.yc = yc;

    this.r = calculateDistance(xa, ya, xb, yb) * 1.3;

    // if the points are on the same horizontal line, their perpendicular has an infinite slope
    // so we handle that situation differently
    if (Math.abs(yb - ya) < 0.001) {
      this.xd = xc;
      this.yd = yc + Math.sqrt(this.r ** 2) - ((this.xc - this.xa) ** 2);
    } else {
      // mp is the slope of the perpendicular line to the line connecting a and b
      const mp = (xa - xb) / (yb - ya);

      // the line equation of the line going through c with the slope mp is y = mp * x + q
      // q is this
      const q = yc - mp * xc;

      // now we have to finde a circle with the following attributes:
      //  - radius r is a given constant
      //  - the centerpoing is on the above line
      //  - the circle goes through point a (or b or both, but a is enough)

      const A = 1.0 + (mp ** 2);
      const B = 2.0 * (mp * (q - ya) - xa);
      const C = (xa ** 2) + ((ya - q) ** 2) - (this.r ** 2);

      // now we need to solve A*x^2 + B*x + C = 0
      // to get the x coordinate
      // the solutions are: -B +- Math.sqrt(Math.pow(B, 2) - 4 * A * C)) / 2 * A

      let sgn = 1.0;
      if (Math.random() > 0.5) sgn = -1.0;

      // d is the center of the circle
      this.xd = (sgn * (Math.sqrt((B ** 2) - 4 * A * C)) - B) / (2 * A);
      this.yd = mp * this.xd + q;
    }

    // calculate the start and the stop angles
    this.startangle = angleOnCircle(this.xd, this.yd, this.xa, this.ya);
    this.stopangle = angleOnCircle(this.xd, this.yd, this.xb, this.yb);

    // if (isNaN(this.startangle) || isNaN(this.stopangle)) {
    //   console.log(`A, B, C are ${A} ${B} ${C}`);
    //   console.log(`center at ${this.xd} ${this.yd}`);
    //   console.log(`a at ${this.xa} ${this.ya}`);
    //   console.log(`b at ${this.xb} ${this.yb}`);
    // }
  }

  update() {
    if (this.animStep > 0) {
      this.animStep--;
    } else {
      this.complete = true;
    }
  }

  draw() {
    // if the start angle is "after" the stop angle, we reverse them
    // "after" means the distance in radian from start to stop is bigger than from stop to start

    let startang = this.startangle;
    let stopang = this.stopangle;

    let dif = stopang - startang;

    let callReverseOrder = false;

    if (dif > Math.PI || (dif < 0 && dif > -Math.PI)) { callReverseOrder = true; }

    if (dif > Math.PI) { dif -= 2 * Math.PI; }
    if (dif < -Math.PI) { dif += 2 * Math.PI; }

    if (this.animStep > 0) { stopang = startang + (1.0 - (this.animStep / this.animSteps)) * dif; }

    if (callReverseOrder) {
      const tmp = startang;
      startang = stopang;
      stopang = tmp;
    }

    ctx.beginPath();
    ctx.lineWidth = this.thickness;
    ctx.globalCompositeOperation = 'destination-over';
    ctx.arc(this.xd, this.yd, this.r, startang, stopang);
    ctx.strokeStyle = this.color;
    ctx.stroke();
  }
}
