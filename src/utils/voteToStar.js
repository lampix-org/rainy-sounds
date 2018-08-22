import animElements from '../index';

// This is used to modify the amount of stars given to this capsule.
export default function voteToStar(parentId, ownId) {
  for (let x = 0; x < animElements.length; x++) {
    if (animElements[x].type === 'StarButton' && animElements[x].parentId === parentId) {
      for (let y = x; y < x + 6; y++) {
        if (animElements[y].orderId <= ownId) {
          animElements[y].pushed = true;
        } else {
          animElements[y].pushed = false;
        }
      }
      return;
    }
  }
}
