class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  energy = 100;
  lastHit = 0;
  isMoving = false;

  /**
   * Applies gravity to the object
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * Checks if the object is above ground
   * @returns {boolean} True if above ground
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 180;
    }
  }

  /**
   * Checks collision with another object
   * @param {MovableObject} mo - The other object
   * @returns {boolean} True if collision detected
   */
  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
  }

  /**
   * Reduces object energy when hit
   */
  hit() {
    this.energy -= 0.8;
    if (this.energy < 20) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Checks if the object is dead
   * @returns {boolean} True if dead
   */
  isDead() {
    return this.energy <= 0;
  }

  /**
   * Checks if the object is hurt
   * @returns {boolean} True if hurt
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  /**
   * Moves the object to the right
   */
  moveRight() {
    this.x += this.speed;
    this.isMoving = true;
  }

  /**
   * Moves the object to the left
   */
  moveLeft() {
    this.x -= this.speed;
    this.isMoving = true;
  }

  /**
   * Makes the object jump
   */
  jump() {
    this.speedY = 30;
    this.isMoving = true;
  }

  /**
   * Checks if the object is idle
   * @returns {boolean} True if idle
   */
  isIdle() {
    let wasIdle = !this.isMoving;
    this.isMoving = false;
    return wasIdle;
  }

  /**
   * Plays an animation
   * @param {string[]} images - Array of image paths
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }
  /**
   * Kills the enemy
   */
  killEnemy() {
    this.isKilled = true;

    if (this.IMAGES_DEAD && this.IMAGES_DEAD.length > 0) {
      this.img = this.imageCache[this.IMAGES_DEAD[0]];
    }
  }
}
