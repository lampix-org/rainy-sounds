import { animElements } from '../index';

export default function removeSpotLight(id) {
  for (let i = animElements.length - 1; i >= 0; i--) {
    const ae = animElements[i];

    if (ae.type === 'SpotLight') {
      if (ae.parentId === id) {
        animElements.splice(i, 1);
      }
    }
  }
}
