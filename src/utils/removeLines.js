import { animElements, matterSetup } from '../index';

export default function removeLines(x, y) {
  for (let i = animElements.length - 1; i >= 0; i--) {
    const ae = animElements[i];
    if (ae.type === 'CurvedLine') {
      if ((ae.xa === x && ae.ya === y) || (ae.xb === x && ae.yb === y)) {
        if (ae.constraint !== undefined) { matterSetup.utils.deleteConstraint(ae.constraint); }
        animElements.splice(i, 1);
      }
    }
  }
}
