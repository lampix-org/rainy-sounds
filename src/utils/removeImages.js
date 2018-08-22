import { imageObjects, matterSetup } from '../index';

export default function removeImages(id) {
  for (let i = imageObjects.length - 1; i >= 0; i--) {
    const io = imageObjects[i];

    if (io.type === 'ImageObject') {
      if (io.parentId === id) {
        if (io.object !== undefined) { matterSetup.utils.deleteBody(io.object); }
        imageObjects.splice(i, 1);
      }
    }
  }
}
