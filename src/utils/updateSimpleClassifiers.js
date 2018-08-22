import lampixCore from '@lampix/core';
import * as index from '../index';
import settings from '../settings/datastructure';
import removeVoting from './removeVoting';
import voteToStar from './voteToStar';
import removeProduct from './removeProduct';
import removeGroup from './removeGroup';
import removeSimpleClassifier from './removeSimpleClassifier';

// We call this to update the Simple Classifiers on the screen.
// Works with the old method of updating all classifiers at once.
export default function updateSimpleClassifiers() {
  const allPoints = [];
  for (let x = 0; x < index.simpleClassifiers.length; x++) {
    allPoints.push(index.simpleClassifiers[x][1]);
  }
  lampixCore.registerSimpleClassifier(allPoints, (rectIndex, cTag) => {
    if (cTag === 1) {
      if (settings.appModules.lockProducts) {
        for (let x = index.animElements.length - 1; x >= 0; x--) {
          if (index.animElements[x].parentId === index.simpleClassifiers[rectIndex][0]) {
            index.animElements[x].isFrozen = false;
          }
        }
      }
      setTimeout(() => {
        const theID = index.simpleClassifiers[rectIndex][0];
        const ownId = index.simpleClassifiers[rectIndex][3];
        switch (index.simpleClassifiers[rectIndex][2]) {
          case 'closeAll':
            removeProduct(theID);
            removeSimpleClassifier(theID, 'all');
            break;
          case 'voteUp':
            removeVoting(theID);
            removeSimpleClassifier(theID, 'upAndDown');
            break;
          case 'voteDown':
            removeVoting(theID);
            removeSimpleClassifier(theID, 'upAndDown');
            break;
          case 'closeGroup':
            removeGroup(theID);
            removeSimpleClassifier(theID, 'all');
            break;
          case 'voteToStar':
            voteToStar(theID, ownId);
            break;
          default:
            break;
        }
        updateSimpleClassifiers();
      }, 300);
    } else {
      // Nothing happens here because we remove the button once it was clicked after 300ms.
    }
  });
}
