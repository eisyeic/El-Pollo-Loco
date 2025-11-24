class Cloud extends MovableObject {
  y = 20;
  width = 500;
  height = 150;
  speed = 0.15;
  static cloudIndex = 0;
  static cloudPositions = [300, 1300, 2100];

  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/1.png");

    this.x = Cloud.cloudPositions[Cloud.cloudIndex % Cloud.cloudPositions.length];
    Cloud.cloudIndex++;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
  }
}
