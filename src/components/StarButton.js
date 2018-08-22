import { ctx, debouncedUpdateSC, simpleClassifiers } from '../index';
import { settings, fingerClassifierString } from '../settings/datastructure';

export default class StarButton {
  constructor(x, y, parentId, orderId) {
    this.x = x;
    this.y = y;
    this.parentId = parentId;
    this.pushed = false;
    this.image = settings.userInterfaceResources[90].image;
    this.orderId = orderId;
    this.type = 'StarButton';

    const newClassifier = [];
    newClassifier[0] = this.parentId;
    newClassifier[1] = {
      posX: this.x, posY: this.y, width: 40, height: 40, classifier: fingerClassifierString
    };
    newClassifier[2] = this.orderId;
    simpleClassifiers.push(newClassifier);
    debouncedUpdateSC();
  }

  draw() {
    if (this.pushed) {
      this.image = settings.userInterfaceResources[91].image;
    } else {
      this.image = settings.userInterfaceResources[90].image;
    }
    ctx.save();
    // const width = this.image.width;
    // const height = this.image.height;
    ctx.translate(this.x, this.y);
    ctx.globalCompositeOperation = 'source-over';
    // ctx.drawImage(this.image, this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
    ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height);
    ctx.restore();
  }
}
