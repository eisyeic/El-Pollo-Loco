class Character extends MovableObject {
  y = 80;
  height = 250;
  width = 150;
  speed = 10;
  deathSoundPlayed = false;
  jumpStarted = false;
  jumpStartIndex = 0;
  jumpLandIndex = 0;
  isLanding = false;

  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  IMAGES_LONG_IDLE = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
  ];

  world;
  offset = {
    top: 120,
    left: 30,
    right: 30,
    bottom: 10,
  };

  /**
   * Creates a new Character instance and initializes animations
   */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.lastMovement = Date.now();
    this.applyGravity();
    this.animate();
  }

  /**
   * Starts character animations
   */
  animate() {
    this.startMovementLoop();
    this.startAnimationLoop();
  }

  /**
   * Starts the movement loop
   */
  startMovementLoop() {
    setInterval(() => {
      this.handleMovement();
      this.updateCamera();
    }, 1000 / 60);
  }

  /**
   * Handles character movement
   */
  handleMovement() {
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      this.lastMovement = Date.now();
    }

    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      this.lastMovement = Date.now();
    }

    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
      this.lastMovement = Date.now();
    }
  }

  /**
   * Updates camera position
   */
  updateCamera() {
    this.world.camera_x = Math.max(-this.x + 100, -2160);
  }

  /**
   * Starts the animation loop
   */
  startAnimationLoop() {
    setInterval(() => {
      this.handleAnimations();
    }, 100);
  }

  /**
   * Handles all character animations
   */
  handleAnimations() {
    if (this.isDead()) {
      this.handleDeathAnimation();
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.isAboveGround()) {
      this.handleJumpAnimation();
    } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
    } else if (this.isIdle()) {
      this.handleIdleAnimation();
    }
  }

  /**
   * Handles jump animation with proper phases
   */
  /**
   * Handles jump animation with proper phases
   */
  handleJumpAnimation() {
    this.playAnimation(this.IMAGES_JUMPING);
  }

  /**
   * Resets jump animation variables when grounded
   */
  resetJumpAnimationIfGrounded() {
    if (!this.isAboveGround()) {
      this.jumpStarted = false;
      this.jumpStartIndex = 0;
      this.jumpLandIndex = 0;
      this.isLanding = false;
    }
  }

  /**
   * Handles idle animation
   */
  handleIdleAnimation() {
    if (Date.now() - this.lastMovement > 5000) {
      this.playAnimation(this.IMAGES_LONG_IDLE);
    } else {
      this.playAnimation(this.IMAGES_IDLE);
    }
  }

  /**
   * Handles death animation
   */
  handleDeathAnimation() {
    this.playAnimation(this.IMAGES_DEAD);
    if (!this.deathSoundPlayed) {
      this.world.playSound("audio/dead.mp3");
      this.deathSoundPlayed = true;
    }
    setTimeout(() => {
      clearAllIntervals();
      this.world.gameState = "gameOver";
    }, 1000);
  }

  /**
   * Makes the character jump
   */
  jump() {
    this.speedY = 30;
    this.lastMovement = Date.now();
    this.world.playSound("audio/jump.mp3");
  }
}
