import { animElements } from '../index';

export default function removeChronometerCircle(theID) {
  for (let k = animElements.length - 1; k >= 0; k--) {
    const animEl = animElements[k];
    if (animEl.type === 'ChronometerCircle' && animEl.parentId === theID) {
      animElements.splice(k, 1);
      return;
    }
  }
}
