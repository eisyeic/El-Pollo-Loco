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
  isActivated = false;
  lastSpeedChange = 0;
  lastJump = 0;
  isJumping = false;
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
    this.y = 50;
    this.lastSpeedChange = Date.now();
    this.lastJump = Date.now();
    this.animate();
  }

  hit() {
    this.energy -= 10;
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
      this.checkActivation();
      
      if (this.energy <= 0) {
        this.bossEnergyZero();
      } else if (this.isHurt()) {
        this.bossEnergyHurt();
      } else if (this.isActivated) {
        this.aggressiveAttack();
      }
    }, 150);
    
    this.applyGravity();
  }

  checkActivation() {
    if (!this.isActivated && world && world.character && world.character.x > 2000) {
      this.isActivated = true;
      this.speed = 12;
    }
  }

  aggressiveAttack() {
    this.changeSpeedRandomly();
    this.attemptJump();
    this.playAnimationWithReset(this.IMAGES_WALKING, "walking");
    this.moveLeft();
  }

  changeSpeedRandomly() {
    let now = Date.now();
    if (now - this.lastSpeedChange > 2000) {
      this.speed = Math.random() > 0.5 ? 15 : 8;
      this.lastSpeedChange = now;
    }
  }

  attemptJump() {
    let now = Date.now();
    if (now - this.lastJump > 3000 && !this.isAboveGround() && Math.random() > 0.7) {
      this.speedY = 25;
      this.lastJump = now;
    }
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
    this.moveLeft();
  }



  isAboveGround() {
    return this.y < 50;
  }

  playAnimationWithReset(images, animationType) {
    if (this.lastAnimationType !== animationType) {
      this.currentImage = 0;
      this.lastAnimationType = animationType;
    }
    this.playAnimation(images);
  }
}
