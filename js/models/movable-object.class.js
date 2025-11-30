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

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      // ThrowableObject should always fall
      return true;
    } else {
      return this.y < 180;
    }
  }

  // Charakter.isColliding(chicken)
  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
  }

  hit() {
    this.energy -= 0.5;
    if (this.energy < 0) {
      this.energy = 0;
    } else this.lastHit = new Date().getTime();
  }

  isDead() {
    return this.energy == 0;
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit; // Differenz in ms
    timepassed = timepassed / 1000; // Differenz in s
    return timepassed < 1;
  }

  moveRight() {
    this.x += this.speed;
    this.isMoving = true;
  }

  moveLeft() {
    this.x -= this.speed;
    this.isMoving = true;
  }

  jump() {
    this.speedY = 30;
    this.isMoving = true;
  }

  isIdle() {
    let wasIdle = !this.isMoving;
    this.isMoving = false;
    return wasIdle;
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }
  killEnemy() {
    this.isKilled = true;

    if (this.IMAGES_DEAD && this.IMAGES_DEAD.length > 0) {
      this.img = this.imageCache[this.IMAGES_DEAD[0]];
    }
  }
}
