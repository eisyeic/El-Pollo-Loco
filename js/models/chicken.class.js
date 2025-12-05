class Chicken extends MovableObject {
  y = 350;
  height = 75;
  width = 60;

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  /**
   * Creates a new Chicken instance with random positioning and speed
   */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);

    this.x = 400 + Math.random() * 1800;

    this.speed = 0.15 + Math.random() * 0.5;

    this.animate();
  }

  /**
   * Starts the chicken animation and movement loops
   */
  animate() {
    setInterval(() => {
      if (!this.isKilled) {
        this.moveLeft();
        this.otherDirection = false;
      }
    }, 1000 / 60);

    setInterval(() => {
      if (!this.isKilled) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 150);
  }
}
