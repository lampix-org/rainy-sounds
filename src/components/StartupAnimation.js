import * as index from '../index';
import images from '../settings/datastructure';

export default class StartupAnimation {
  constructor() {
    this.image = images.Logo_Chanel;
    this.x = index.cw / 2;
    this.y = index.ch / 2;
    this.currentDrawCount = 0;
    this.blur = 0.002;
    this.drawlimit = 100;
  }

  update() {
    if (this.currentDrawCount <= this.drawlimit) {
      this.blur = this.blur + 0.02;
      this.currentDrawCount++;
    } else {
      index.animElements = [];
      index.init();
    }
  }

  draw() {
    index.ctx.save();
    // const width = this.image.width;
    // const height = this.image.height;
    index.ctx.globalAlpha = this.blur;
    index.ctx.translate(this.image.width / 2, this.image.height / 2);
    index.ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height);
    index.ctx.restore();
  }
}
