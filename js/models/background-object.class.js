class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;

  /**
   * Creates a new BackgroundObject instance
   * @param {string} imagePath - Path to the background image
   * @param {number} x - X coordinate position
   * @param {number} y - Y coordinate position (will be adjusted to ground level)
   */
  constructor(imagePath, x, y) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
