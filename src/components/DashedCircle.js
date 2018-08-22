import { ctx, matterSetup } from '../index';
import { settings } from '../settings/datastructure';

export default class DashedCircle {
  constructor(x, y, r, classTag) {
    this.type = 'DashedCircle';
    this.classTag = classTag;
    this.complete = false;

    this.currentPercent = 0;
    this.endPercent = 85;
    this.circ = Math.PI * 2;
    this.quart = (5 * Math.PI) / 6;

    this.x = x;
    this.y = y;
    this.r = r || 20;
    this.alpha = 1;

    if (settings.appModules.physics) {
      const options = {
        x,
        y,
        r,
        matterOptions: {
          isStatic: true
          // plugin: {
          //   attractors: [
          //     matterSetup.utils.attractSomeToOne
          //   ]
          // }
        }
      };
      this.object = matterSetup.utils.createCircular(options);
    }
  }

  update() {
    if (this.currentPercent < this.endPercent) {
      this.currentPercent++;
    } else {
      this.complete = true;
    }
  }

  draw() {
    // draw
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'black';
    // ctx.lineDashOffset = 2;
    ctx.arc(this.x, this.y, this.r, -(this.quart), ((this.circ) * (this.currentPercent / 100)) - this.quart, false);
    ctx.fill();
    ctx.stroke();
  }
}
