class StartImage extends DrawableObject {
  /**
   * Creates a new StartImage instance
   * @param {string} imagePath - Path to the start screen image
   */
  constructor(imagePath) {
    super();
    this.loadImage(imagePath);
    this.x = 0;
    this.y = 0;
    this.width = 720;
    this.height = 480;
  }
}
