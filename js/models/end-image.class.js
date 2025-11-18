class EndImage extends DrawableObject {
  constructor(imagePath1, imagePath2) {
    super();
    this.imagePath1 = imagePath1;
    this.imagePath2 = imagePath2;
    this.loadImage(imagePath1);
    this.x = 0;
    this.y = 0;
    this.width = 720;
    this.height = 480;
    this.sequenceStarted = false;
  }

  startGameOverSequence() {
    if (!this.sequenceStarted) {
      this.sequenceStarted = true;
      setTimeout(() => {
        this.loadImage(this.imagePath2);
      }, 3000);
    }
  }
}
