import { ctx, debouncedUpdateSC, simpleClassifiers, globalButtonID, matterSetup } from '../index';
import { settings, fingerClassifierString, images } from '../settings/datastructure';

// Just a normal image object.
export default class ImageObject {
  constructor(classTag, x, y, rotationPoints, parentId) {
    if (classTag in settings.productResources) {
      this.image = images[settings.productResources[classTag].image];
    } else {
      // TODO: Add dummy image or graphics here.
    }
    this.x = x;
    this.y = y;
    this.moving = false;
    this.rotationPoints = rotationPoints;
    this.currentPoint = 0;
    this.type = 'ImageObject';
    this.parentId = parentId;
    this.classTag = classTag;
    this.isFrozen = true;
    this.width = this.image.width;
    this.height = this.image.height;
    this.buttonID = 0;
    this.functionality = null;
    if (settings.appModules.physics) {
      const options = {
        x,
        y,
        w: this.width,
        h: this.height,
        matterOptions: {
          // This is needed in order for the bodies to NOT rotate around their axis when they get hit / moved.
          // inertia: Infinity,
          frictionAir: 0.8,
          render: {
            strokeStyle: '#ffffff',
            sprite: {
              texture: this.image
            }
          }
        }
      };
      this.object = matterSetup.utils.createRectangle(options);
    }

    // Used for a growing constraint, TODO.
    this.complete = false;
    this.animSteps = 50;
    this.animStep = this.animSteps;

    if (settings.productResources[this.classTag].isButton != null) {
      this.buttonID = globalButtonID;
      globalButtonID++;
      this.functionality = settings.productResources[this.classTag].functionality;
      const newClassifier = [];
      newClassifier[0] = this.parentId;
      newClassifier[1] = {
        posX: this.x - 20, posY: this.y - 20, width: 40, height: 40, classifier: fingerClassifierString
      };
      newClassifier[2] = this.functionality;
      newClassifier[3] = this.buttonID;
      simpleClassifiers.push(newClassifier);
      debouncedUpdateSC();
    } else if (settings.productResources[this.classTag].isButtonWithText != null) {
      this.buttonID = globalButtonID;
      globalButtonID++;
      this.functionality = settings.productResources[this.classTag].functionality;
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
    if (this.animStep > 0) {
      this.animStep--;
    } else {
      this.complete = true;
    }
    if (settings.appModules.physics) {
      // Checking if the object is still moving and if it stopped then we reset the classifier position.
      if (Math.round(this.object.body.position.x) !== Math.round(this.x) ||
          Math.round(this.object.body.position.y) !== Math.round(this.y)) {
        this.x = this.object.body.position.x;
        this.y = this.object.body.position.y;
        this.moving = true;
      } else if (this.moving) {
        this.moving = false;
        if (settings.productResources[this.classTag].isButton != null) {
          for (let x = 0; x < simpleClassifiers.length; x++) {
            if (simpleClassifiers[x][3] === this.buttonID) {
              simpleClassifiers[x][1].posX = this.x - 20;
              simpleClassifiers[x][1].posY = this.y - 20;
              debouncedUpdateSC();
              break;
            }
          }
        } else if (settings.productResources[this.classTag].isButtonWithText != null) {
          for (let x = 0; x < simpleClassifiers.length; x++) {
            if (simpleClassifiers[x][3] === this.buttonID) {
              simpleClassifiers[x][1].posX = this.x + 5;
              simpleClassifiers[x][1].posY = this.y - 20;
              debouncedUpdateSC();
              break;
            }
          }
        }
      }
    }
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
