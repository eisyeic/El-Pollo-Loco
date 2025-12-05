class Endboss extends MovableObject {
  y = 50;
  height = 400;
  width = 330;
  hadFirstContact = false;
  alertAnimationPlayed = false;
  energy = 100;
  speed = 2;
  deathAnimationPlayed = false;
  deathFrameIndex = 0;
  deathInterval = null;
  wasVisible = false;
  alertFrameCount = 0;
  isNearCharacter = false;
  offset = {
    top: 80,
    left: 50,
    right: 50,
    bottom: 10,
  };

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  /**
   * Creates a new Endboss instance and initializes animations
   */
  constructor() {
    super().loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 2500;
    this.animate();
  }

  /**
   * Handles when the endboss gets hit, reducing energy
   */
  hit() {
    this.energy -= 20;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Checks if the endboss is visible on screen
   * @returns {boolean} True if the endboss is visible
   */
  isVisible() {
    return (
      world &&
      world.camera_x &&
      this.x + this.width > -world.camera_x &&
      this.x < -world.camera_x + 720
    );
  }

  /**
   * Starts the endboss animation loop
   */
  animate() {
    setInterval(() => {
      let currentlyVisible = this.isVisible();
      this.isNearCharacter =
        world && world.character && Math.abs(this.x - world.character.x) < 100;

      if (this.energy <= 0) {
        this.bossEnergyZero();
      } else if (this.isHurt()) {
        this.bossEnergyHurt();
      } else if (
        world &&
        world.character &&
        world.character.x > 2000 &&
        currentlyVisible
      ) {
        this.bossAttack(currentlyVisible);
      }

      this.wasVisible = currentlyVisible;
    }, 150);
  }

  /**
   * Handles endboss death animation when energy reaches zero
   */
  bossEnergyZero() {
    if (!this.deathAnimationPlayed && !this.deathInterval) {
      this.deathFrameIndex = 0;
      this.loadImage(this.IMAGES_DEAD[0]);

      this.deathInterval = setInterval(() => {
        this.deathFrameIndex++;
        if (this.deathFrameIndex < this.IMAGES_DEAD.length) {
          this.loadImage(this.IMAGES_DEAD[this.deathFrameIndex]);
        } else {
          this.deathAnimationPlayed = true;
          clearInterval(this.deathInterval);
          if (world) {
            clearAllIntervals();
            world.gameState = "youWon";
          }
        }
      }, 150);
    }
  }

  /**
   * Handles endboss hurt animation
   */
  bossEnergyHurt() {
    this.playAnimation(this.IMAGES_HURT);
  }

  /**
   * Handles endboss attack behavior
   * @param {boolean} currentlyVisible - Whether the endboss is currently visible
   */
  bossAttack(currentlyVisible) {
    if (!this.wasVisible) {
      this.alertFrameCount = 0;
    }

    if (this.isNearCharacter) {
      this.speed = 8;
      this.playAnimation(this.IMAGES_ATTACK);
      this.moveLeft();
    } else if (this.alertFrameCount < this.IMAGES_ALERT.length * 2) {
      this.speed = 2;
      this.playAnimation(this.IMAGES_ALERT);
      this.alertFrameCount++;
    } else {
      this.speed = 2;
      this.playAnimation(this.IMAGES_WALKING);
      this.moveLeft();
    }
  }
}
