import SpotLight from './Spotlight';
import ImageObject from './ImageObject';
// import LineConstraint from './LineConstraint';
import CurvedLine from './CurvedLine';
import StraightLine from './StraightLine';
import Recommendation from './Recommendation';

import { settings } from '../settings/datastructure';
import { animElements, matterSetup, imageObjects, knownObjects, recommendations } from '../index';

import removeRecommendation from '../utils/removeRecommendation';
import suggestRecommendationPosition from '../utils/suggestRecommendationPosition';

// Identified Object (coaster in this case). This object is a composite of more.
export default class PlacedObject {
  constructor(classification, radius) {
    this.cx = classification.centerPoint.posX;
    this.cy = classification.centerPoint.posY;
    this.type = 'Object';
    this.objectId = classification.objectId;
    this.isFrozen = false;
    this.classTag = classification.classTag;
    this.classification = classification;

    // get the recommandations for this classification
    this.recs = settings.productResources[classification.classTag].recommendations;

    // Check to see if this product is a recommendation to any other products.
    // Add the classtags of the found products that have this one as a recommendation.
    let isRecommendation = false;
    this.recommendationSettings = null;
    const recommendationTo = [];
    Object.keys(settings.productResources).forEach((product) => {
      Object.keys(settings.productResources[product].recommendations).forEach((recommendation) => {
        if (settings.productResources[product].recommendations[recommendation].classTag === classification.classTag) {
          isRecommendation = true;
          this.recommendationSettings = settings.productResources[product].recommendations[recommendation];
          recommendationTo.push(product);
        }
      });
    });

    // Adding the Object SpotlLight which should highlight the placed object.
    const theObject = new SpotLight(this.cx, this.cy, radius, classification.objectId, classification.classTag);
    animElements.push(theObject);

    // If physics are enabled and attractors are wanted, this adds the object as an attractor for others.
    if (settings.productResources[classification.classTag].attractsOthers !== undefined) {
      matterSetup.utils.addAttractor(theObject.object.body);
      // Add an attractor orbit (range between attractor and attracted).
      if (settings.productResources[classification.classTag].attractionOrbit !== undefined) {
        const orbit = settings.productResources[classification.classTag].attractionOrbit;
        matterSetup.utils.addAttractorOrbit(theObject.object.body.id, orbit - 100, orbit + 100);
      }
    }

    // If the object has an image description, we add it to the screen here.
    if (settings.productResources[classification.classTag].image !== undefined) {
      const descriptionImageAlpha = 45 * (Math.PI / 180);
      const DIx = this.cx + Math.sin(descriptionImageAlpha) * (radius + 5);
      const DIy = this.cy + Math.cos(descriptionImageAlpha) * (radius + 5);
      imageObjects.push(new ImageObject(classification.classTag, DIx, DIy, [0], classification.objectId, ''));
    } else {
      // Add a complex description.
    }

    // If the object is a recommendation to another one, then check the screen for already
    // existing recommendations and remove them and then connect this object with lines to others.
    if (isRecommendation) {
      removeRecommendation(classification.classTag);
      if (this.recs[0].lineConnectionSettings !== undefined) {
        const lineSettings = this.recs[0].lineConnectionSettings;
        for (let j = 0; j < knownObjects.length; j++) {
          for (let k = 0; k < recommendationTo.length; k++) {
            if (knownObjects[j].classTag === recommendationTo[k]) {
              if (lineSettings.type === 'curved') {
                animElements.push(new CurvedLine(
                  this.cx, this.cy, knownObjects[j].cx, knownObjects[j].cy, lineSettings.color,
                  lineSettings.thickness, classification.objectId
                ));
              } else {
                animElements.push(new StraightLine(
                  this.cx, this.cy, knownObjects[j].cx, knownObjects[j].cy, lineSettings.color,
                  lineSettings.thickness, classification.objectId
                ));
              }
            }
          }
        }
      }
    }

    // If the object has recommendations we then check the screen for other products that are
    // recommendations and link them together. If no such products are found we then check the
    // list of Recommendation Objects and link them accordingly. If no suitable recommendation
    // is found either then we create a new one, add it to the screen and link it together.
    for (let e = 0; e < this.recs.length; e++) {
      const thisRecommendation = this.recs[e].classTag;
      let imageWidth;
      let imageHeight;
      let recommendationFound = false;

      // Check the list of products to see if they match the current recommendation.
      if (this.recs[e].lineConnectionSettings !== undefined) {
        const lineSettings = this.recs[e].lineConnectionSettings;
        for (let j = 0; j < knownObjects.length; j++) {
          if (thisRecommendation === knownObjects[j].classTag) {
            recommendationFound = true;
            if (lineSettings.type === 'curved') {
              animElements.push(new CurvedLine(
                this.cx, this.cy, knownObjects[j].cx, knownObjects[j].cy, lineSettings.color,
                lineSettings.thickness, classification.objectId
              ));
            } else {
              animElements.push(new StraightLine(
                this.cx, this.cy, knownObjects[j].cx, knownObjects[j].cy, lineSettings.color,
                lineSettings.thickness, classification.objectId
              ));
            }
          }
        }
      }

      if (!recommendationFound) {
        const foundrec = recommendations.find(rec => rec.classTag === thisRecommendation);
        if (foundrec !== undefined) {
          if (foundrec.lineConnectionSettings !== undefined) {
            const lineSettings = foundrec.lineConnectionSettings;
            if (lineSettings.type === 'curved') {
              animElements.push(new CurvedLine(
                this.cx, this.cy, foundrec.cx, foundrec.cy, lineSettings.color,
                lineSettings.thickness, classification.objectId
              ));
            } else {
              animElements.push(new StraightLine(
                this.cx, this.cy, foundrec.cx, foundrec.cy, lineSettings.color,
                lineSettings.thickness, classification.objectId
              ));
            }
          }
        } else {
          // Get the recommendation image width and height.
          if (thisRecommendation in settings.productResources) {
            const theRec = settings.productResources[thisRecommendation];
            if (theRec.image !== undefined) {
              imageWidth = theRec.image.width;
              imageHeight = theRec.image.height;
            } else if (theRec.compositeItem !== undefined) {
              // TODO: Check for special recommendation options.
              imageWidth = theRec.width;
              imageHeight = theRec.height;
            }
          }
          // Determine where the recommendation should be placed on the screen.
          const recommendationPosition = suggestRecommendationPosition(
            e, this.cx, this.cy, this.recs[e].angleToProduct,
            this.recs[e].minimumDistanceToProduct
          );
          const recX = recommendationPosition.x;
          const recY = recommendationPosition.y;
          // Create a new Recommendation object and link it up to the product.
          const newRec = new Recommendation(classification, recX, recY, this.recs[e]);
          recommendations.push(newRec);

          if (this.recs[e].lineConnectionSettings !== undefined) {
            const lineSettings = this.recs[e].lineConnectionSettings;
            if (lineSettings.type === 'curved') {
              animElements.push(new CurvedLine(
                this.cx, this.cy, newRec.cx, newRec.cy, lineSettings.color,
                lineSettings.thickness, classification.objectId
              ));
            } else {
              animElements.push(new StraightLine(
                this.cx, this.cy, newRec.cx, newRec.cy, lineSettings.color,
                lineSettings.thickness, classification.objectId
              ));
            }
          }

          if (this.recs[e].orbitDiameter !== undefined) {
            let customOrbit;
            if (imageWidth > imageHeight) {
              customOrbit = theObject.r + imageWidth / 2 + 30;
            } else {
              customOrbit = theObject.r + imageHeight / 2 + 30;
            }
            matterSetup.utils.addAttracted(newRec.dashedCircle.body, theObject.object.body.id, customOrbit);

            // const newConstraint = new LineConstraint(
            //   theObject.object.body,
            //   newRec.dashedCircle.body, { x: 0, y: 0 }, { x: 0, y: 0 }, 150, '#F3BF2E',
            //   classification.objectId
            // );
            // animElements.push(newConstraint);
          }
        }
      }
    }
  }
}
