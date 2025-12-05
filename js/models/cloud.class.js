class Cloud extends MovableObject {
  y = 20;
  width = 500;
  height = 150;
  speed = 0.15;
  static cloudIndex = 0;
  static cloudPositions = [300, 1300, 2100];

  /**
   * Creates a new Cloud instance with automatic positioning
   */
  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/1.png");

    this.x =
      Cloud.cloudPositions[Cloud.cloudIndex % Cloud.cloudPositions.length];
    Cloud.cloudIndex++;
    this.animate();
  }

  /**
   * Starts the cloud movement animation
   */
  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
  }
}
