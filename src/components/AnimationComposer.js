export default class AnimationComposer {
  constructor(elements, parentId, classTag) {
    // elements is a list of animation elements in the order we want them to be animated
    this.type = 'AnimationComposer';
    this.elements = elements.reverse();
    this.parentId = parentId;
    this.classTag = classTag;
    this.currentElementIndex = 0;
  }

  update() {
    if (typeof this.elements[this.currentElementIndex] === 'undefined') {
      return;
    }
    if (!this.elements[this.currentElementIndex].complete) {
      this.elements[this.currentElementIndex].update();
    } else if (this.currentElementIndex < this.elements.length - 1) {
      this.currentElementIndex++;
    }
  }

  draw() {
    this.elements.forEach((element) => {
      element.draw();
    });
  }
}
