import { simpleClassifiers } from '../index';

export default function removeSimpleClassifier(theID, removeType) {
  switch (removeType) {
    case 'all':
      for (let y = simpleClassifiers.length - 1; y >= 0; y--) {
        if (simpleClassifiers[y][0] === theID) {
          simpleClassifiers.splice(y, 1);
        }
      }
      break;
    case 'upAndDown':
      for (let y = simpleClassifiers.length - 1; y >= 0; y--) {
        if (simpleClassifiers[y][0] === theID && (simpleClassifiers[y][2] ===
          'voteUp' || simpleClassifiers[y][2] === 'voteDown')) {
          simpleClassifiers.splice(y, 1);
        }
      }
      break;
    default:
      break;
  }
}
