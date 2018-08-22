import { buttons, matterSetup } from '../index';

export default function removeVoting(objectIdToSplice) {
  for (let i = buttons.length - 1; i >= 0; i--) {
    const btn = buttons[i];
    if (!btn) {
      continue;
    }
    if (btn.parentId === objectIdToSplice) {
      if (btn.object !== undefined) { matterSetup.utils.deleteBody(btn.object); }
      buttons.splice(i, 1);
    } else {
      continue;
    }
  }
}
