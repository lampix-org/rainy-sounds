import { ctx, matterSetup } from '../index';
import { settings } from '../settings/datastructure';

export default class SpotLight {
  constructor(x, y, r, parentId, classTag) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.opacity = 0.0;
    this.type = 'SpotLight';
    this.parentId = parentId;
    this.classTag = classTag;
    this.isFrozen = true;
    this.visible = true;
    const self = this;

    // Timeout for Bar App Spotlight.
    setTimeout(() => { self.visible = false; }, 90000);

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
    // this.object.setNoGraphics();
  }

  update() {
    if (this.opacity <= 1) {
      this.opacity += 0.05;
    }
  }

  draw() {
    ctx.globalAlpha = this.opacity;
    // draw the target for this firework with a pulsing circle
    if (this.visible) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgb(50, 50, 50)';
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgb(0, 0, 0)';
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  }
}
