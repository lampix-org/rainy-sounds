import { debouncedUpdateSC, knownObjects, recommendations } from '../index';

import Recommendation from '../components/Recommendation';

import removeLines from './removeLines';
import removeSpotLight from './removeSpotLight';
import removeImages from './removeImages';
import removeButtons from './removeButtons';

export default function removeProduct(objectIdToSplice) {
  for (let z = knownObjects.length - 1; z >= 0; z--) {
    if (knownObjects[z].objectId === objectIdToSplice) {
      if (knownObjects[z].isFrozen) { return; }

      if (knownObjects[z].isRecommendation) {
        const findndSimilarObjects = knownObjects.find(similarObject => similarObject.classTag
          === knownObjects[z].classTag);
        if (findndSimilarObjects.length === 1) {
          const newRec = new Recommendation(
            findndSimilarObjects[0].classification, findndSimilarObjects[0].cx,
            findndSimilarObjects[0].cy, findndSimilarObjects[0].recommendationSettings
          );
          recommendations.push(newRec);
        }
      } else {
        removeLines(knownObjects[z].theObject.x, knownObjects[z].theObject.y);
      }
      removeSpotLight(objectIdToSplice);
      removeImages(objectIdToSplice);
      removeButtons(objectIdToSplice);
      debouncedUpdateSC();
      knownObjects.splice(z, 1);
      return;
    }
  }
}
