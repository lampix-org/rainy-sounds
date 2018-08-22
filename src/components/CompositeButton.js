import { ctx, debouncedUpdateSC, simpleClassifiers, globalButtonID, matterSetup } from '../index';
import { settings, fingerClassifierString } from '../settings/datastructure';

// A complex Button object which may contain a text and the button png + the button click animation.
export default class CompositeButton {
  constructor(classTag, x, y, rotationPoints, parentId) {
    if (classTag in settings.productResources &&
      settings.productResources[classTag].compositeItem === true) {
      for (let d = 0; d < settings.productResources[classTag].components.length; d++) {
        switch (settings.productResources[classTag].components[d].type) {
          case 'textComponent':
            this.textComponent = settings.productResources[classTag].components[d];
            break;
          case 'buttonComponent':
            this.buttonComponent = settings.productResources[classTag].components[d];
            break;
          default:
            break;
        }
      }
    } else {
      // TODO: Throw an error here or something.
    }
    this.x = x;
    this.y = y;
    this.moving = false;
    this.rotationPoints = rotationPoints;
    this.currentPoint = 0;
    this.type = 'CompositeButton';
    this.parentId = parentId;
    this.classTag = classTag;
    this.isFrozen = true;
    this.width = settings.productResources[classTag].width;
    this.height = settings.productResources[classTag].height;
    this.functionality = null;

    const options = {
      // This is needed in order for the bodies to NOT rotate around their axis when they get hit / moved.
      // inertia: Infinity,
      frictionAir: 0.8,
      render: {
        fillStyle: '#000000'
      }
    };
    this.object = matterSetup.utils.createRectangle(x, y, this.width, this.height, options);

    if (this.buttonComponent !== undefined) {
      if (this.buttonComponent.animated !== undefined) {
        this.animationType = this.buttonComponent.animated;
        this.complete = false;
        this.animSteps = this.buttonComponent.animationDuration;
        this.animStep = this.animSteps;
      }
      this.buttonID = globalButtonID;
      globalButtonID++;
      this.functionality = this.buttonComponent.functionality;
      const newClassifier = [];
      newClassifier[0] = this.parentId;
      newClassifier[1] = {
        posX: this.x + 5, posY: this.y - 20, width: 40, height: 40, classifier: fingerClassifierString
      };
      newClassifier[2] = this.functionality;
      newClassifier[3] = this.buttonID;
      simpleClassifiers.push(newClassifier);
      debouncedUpdateSC();
    }
  }

  update() {
    if (this.animStep > 0 && this.animStep < this.animSteps) {
      this.animStep--;
    } else if (this.animStep === 0) {
      this.complete = true;
    }
    // Checking if the object is still moving and if it stopped then we reset the classifier position.
    if (Math.round(this.object.body.position.x) !== Math.round(this.x) ||
        Math.round(this.object.body.position.y) !== Math.round(this.y)) {
      this.x = this.object.body.position.x;
      this.y = this.object.body.position.y;
      this.moving = true;
    } else if (this.moving) {
      this.moving = false;
      for (let x = 0; x < simpleClassifiers.length; x++) {
        if (simpleClassifiers[x][3] === this.buttonID) {
          simpleClassifiers[x][1].posX = this.x + 5;
          simpleClassifiers[x][1].posY = this.y - 20;
          debouncedUpdateSC();
        }
      }
    }
  }

  draw() {
    // draw the target for this firework with a pulsing circle
    ctx.font = this.textComponent.font;
    ctx.fillStyle = this.textComponent.color;
    ctx.fillText(this.textComponent.text, this.x - 50, this.y + 5);
    ctx.beginPath();
    ctx.arc(this.x + 25, this.y, this.buttonComponent.circle, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.buttonComponent.color;
    ctx.stroke();
    ctx.globalAlpha = 1.0;
  }
}
