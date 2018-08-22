// This function gets you the radius of an identified object within the Position Classifier area.
import calculateDistance from './calculateDistance';

export default function getRadiusOfObject(classifier) {
  let maxx = 0;
  const maxy = 0;
  let minx = 10000;
  let miny = 10000;
  const cx = classifier.centerPoint.posX;
  const cy = classifier.centerPoint.posY;
  let maxdist = 0.0;

  if (typeof (classifier.outline.points) !== 'undefined') {
    for (let j = 0; j < classifier.outline.points.length; j++) {
      const point = classifier.outline.points[j];
      const x = point.posX;
      const y = point.posY;
      if (x > maxx) maxx = x;
      if (y > maxy) maxx = y;
      if (x < minx) minx = x;
      if (y < miny) miny = y;
      const d = calculateDistance(cx, cy, x, y);
      if (d > maxdist) {
        maxdist = d;
      }
    }
  }
  return maxdist;
}
