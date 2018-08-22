import randomAngleDeg from './randomAngleDeg';
import { cw, ch } from '../index';

export default function suggestRecommendationPosition(
  index,
  cx,
  cy,
  angle,
  mimimumLength = 200
) {
  let linelength = mimimumLength + Math.random() * 250;
  let alpha;
  if (angle === undefined) {
    switch (index) {
      case 0:
        alpha = randomAngleDeg(120, 150);
        break;
      case 1:
        alpha = randomAngleDeg(210, 240);
        break;
      case 2:
        alpha = randomAngleDeg(300, 330);
        break;
      default:
        alpha = randomAngleDeg(90, 360);
    }
  } else { alpha = angle; }
  let destx = cx + Math.sin(alpha) * linelength;
  let desty = cy + Math.cos(alpha) * linelength;

  do {
    if (destx < 10 || desty < 10 || destx > cw - 10 || desty > ch - 10) {
      linelength -= 1;
      destx = cx + Math.sin(alpha) * linelength;
      desty = cy + Math.cos(alpha) * linelength;
    }
  } while (destx < 10 || desty < 10 || destx > cw - 10 || desty > ch - 10);

  return { x: destx, y: desty };
}
