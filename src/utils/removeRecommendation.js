import { recommendations, animElements } from '../index';
import removeLines from './removeLines';
import removeImages from './removeImages';

export default function removeRecommendation(classTag) {
  for (let i = recommendations.length - 1; i >= 0; i--) {
    const ae = recommendations[i];
    let id = -1;

    if (ae.classTag === classTag) {
      for (let x = animElements.length - 1; x >= 0; x--) {
        if (animElements[x].type === 'DashedCircle' && animElements[x].classTag === classTag) {
          id = ae.parentId;
          animElements.splice(x, 1);
          break;
        }
      }
      removeLines(recommendations[i].cx, recommendations[i].cy);
      removeImages(id);

      recommendations.splice(i, 1);
      return;
    }
  }
}
