class EndImage extends DrawableObject {
  /**
   * Creates a new EndImage instance
   * @param {string} imagePath1 - Path to the first image
   * @param {string} imagePath2 - Path to the second image
   */
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

  /**
   * Starts the game over sequence by switching to the second image after delay
   */
  startGameOverSequence() {
    if (!this.sequenceStarted) {
      this.sequenceStarted = true;
      setTimeout(() => {
        this.loadImage(this.imagePath2);
      }, 3000);
    }
  }
}
