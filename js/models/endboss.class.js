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
  currentAnimationType = null;
  lastAnimationType = null;
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

  hit() {
    this.energy -= 20;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isVisible() {
    return (
      world &&
      world.camera_x &&
      this.x + this.width > -world.camera_x &&
      this.x < -world.camera_x + 720
    );
  }

  animate() {
    setInterval(() => {
      let currentlyVisible = this.isVisible();
      this.isNearCharacter =
        world && world.character && Math.abs(this.x - world.character.x) < 150;

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

  bossEnergyZero() {
    if (!this.deathAnimationPlayed && !this.deathInterval) {
      this.currentAnimationType = "death";
      this.currentImage = 0;
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

  bossEnergyHurt() {
    this.playAnimationWithReset(this.IMAGES_HURT, "hurt");
  }

  bossAttack(currentlyVisible) {
    this.resetAlertCountIfNeeded();
    let distance = this.getDistanceToCharacter();
    this.handleBossAttackBehavior(distance);
  }

  /**
   * Resets alert frame count if boss wasn't visible before
   */
  resetAlertCountIfNeeded() {
    if (!this.wasVisible) {
      this.alertFrameCount = 0;
    }
  }

  /**
   * Gets distance between boss and character
   * @returns {number} Distance to character
   */
  getDistanceToCharacter() {
    return Math.abs(this.x - world.character.x);
  }

  /**
   * Handles boss behavior based on distance to character
   * @param {number} distance - Distance to character
   */
  handleBossAttackBehavior(distance) {
    if (distance < 150) {
      this.performCloseAttack();
    } else if (this.alertFrameCount < this.IMAGES_ALERT.length * 2) {
      this.performAlertBehavior();
    } else {
      this.performChaseBehavior();
    }
  }

  /**
   * Performs close range attack
   */
  performCloseAttack() {
    this.speed = 2;
    this.playAnimationWithReset(this.IMAGES_ATTACK, "attack");
    this.moveLeft();
  }

  /**
   * Performs alert behavior
   */
  performAlertBehavior() {
    this.speed = 0;
    this.playAnimationWithReset(this.IMAGES_ALERT, "alert");
    this.alertFrameCount++;
  }

  /**
   * Performs chase behavior
   */
  performChaseBehavior() {
    this.speed = 4;
    this.playAnimationWithReset(this.IMAGES_WALKING, "walking");
    this.moveLeft();
  }

  playAnimationWithReset(images, animationType) {
    if (this.lastAnimationType !== animationType) {
      this.currentImage = 0;
      this.lastAnimationType = animationType;
    }
    this.playAnimation(images);
  }
}
