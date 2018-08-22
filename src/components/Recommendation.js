import DashedCircle from './DashedCircle';
import ImageObject from './ImageObject';

import { settings } from '../settings/datastructure';
import { animElements, matterSetup, imageObjects } from '../index';

// Identified Object (coaster in this case). This object is a composite of more.
export default class Recommendation {
  constructor(classification, cx, cy, recommendation) {
    this.cx = cx;
    this.cy = cy;
    this.type = 'Recommendation';
    this.classTag = recommendation.classTag;
    this.lineConnectionSettings = recommendation.lineConnectionSettings;
    this.parentId = classification.objectId * 10;

    // Adding the Object SpotlLight which should highlight the placed object.
    const theObject = new DashedCircle(this.cx, this.cy, 20, this.classTag);
    animElements.push(theObject);
    // If physics are enabled and attractors are wanted, this adds the object as an attractor for others.
    if (settings.productResources[this.classTag].attractsOthers !== undefined) {
      matterSetup.utils.addAttractor(theObject.object.body);
      // Add an attractor orbit (range between attractor and attracted).
      if (settings.productResources[this.classTag].attractionOrbit !== undefined) {
        const orbit = settings.productResources[this.classTag].attractionOrbit;
        matterSetup.utils.addAttractorOrbit(theObject.object.body.id, orbit - 100, orbit + 100);
      }
    }

    // If the object has an image description, we add it to the screen here.
    if (settings.productResources[this.classTag].image !== undefined) {
      const descriptionImageAlpha = 45 * (Math.PI / 180);
      const DIx = this.cx + Math.sin(descriptionImageAlpha) * 25;
      const DIy = this.cy + Math.cos(descriptionImageAlpha) * 25;
      imageObjects.push(new ImageObject(this.classTag, DIx, DIy, [0], this.parentId, ''));
    } else {
      // Add a complex description.
    }
  }
}
