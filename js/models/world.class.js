class World {
  gameState = "start"; // 'start' or 'playing'
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = -100;
  statusBar = new StatusBar();
  endbossBar = new EndbossBar();
  coinsBar = new CoinsBar();
  bottleBar = new BottleBar();
  throwableObject = [];
  collectedBottles = 0;
  collectedCoins = 0;
  totalCoins = 5;
  totalBottles = 7;
  lastThrowTime = 0;
  throwCooldown = 1000;
  screenlayer = false;
  gameOverSoundsPlayed = false;
  soundVolume = 0.1;
  screenManager;
  collisionManager;

  /**
   * Creates a new World instance and initializes the game
   * @param {HTMLCanvasElement} canvas - The game canvas element
   */
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.hurtSound = new Audio("audio/charakter-hurt.mp3");
    this.backgroundMusic = new Audio("audio/backgroundmusic.mp3");
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.3;
    this.screenManager = new ScreenManager(this);
    this.collisionManager = new CollisionManager(this);
    this.draw();
    this.setWorld();
    this.run();
  }

  /**
   * Plays a sound if sound is enabled
   * @param {string} audioPath - Path to audio file
   */
  playSound(audioPath) {
    if (soundEnabled) {
      let sound = new Audio(audioPath);
      sound.volume = this.soundVolume;
      sound.play();
    }
  }

  /**
   * Sets world reference in character
   */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Starts the main game loop
   */
  run() {
    setInterval(() => {
      if (this.gameState === "playing") {
        this.runGameLogic();
      }
    }, 1000 / 60);
  }

  /**
   * Runs main game logic
   */
  runGameLogic() {
    this.collisionManager.checkCollisions();
    this.checkThrowObjects();
    this.collisionManager.checkBottleCollisions();
    this.collisionManager.takeABottle();
    this.collisionManager.collectCoins();
    this.checkEndbossDefeated();
  }

  /**
   * Checks if endboss is defeated
   */
  checkEndbossDefeated() {
    let endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
    if (this.isEndbossDefeated(endboss)) {
      this.handleEndbossDefeat();
    }
  }

  /**
   * Checks if endboss is defeated
   * @param {Endboss} endboss - The endboss
   * @returns {boolean} True if defeated
   */
  isEndbossDefeated(endboss) {
    return (
      endboss &&
      endboss.energy <= 0 &&
      endboss.deathAnimationPlayed &&
      this.gameState === "playing"
    );
  }

  /**
   * Handles endboss defeat
   */
  handleEndbossDefeat() {
    clearAllIntervals();
    this.backgroundMusic.pause();
    this.gameState = "youWon";
  }

  /**
   * Checks and handles throwing objects
   */
  checkThrowObjects() {
    let currentTime = Date.now();
    if (this.canThrowBottle(currentTime)) {
      this.throwBottle(currentTime);
    }
  }

  /**
   * Checks if bottle can be thrown
   * @param {number} currentTime - Current time
   * @returns {boolean} True if throwing is possible
   */
  canThrowBottle(currentTime) {
    return (
      this.keyboard.STRG &&
      currentTime - this.lastThrowTime > this.throwCooldown &&
      this.collectedBottles > 0
    );
  }

/**
 * Throws a bottle and schedules ground bottle respawn
 * @param {number} currentTime - Current time
 */
throwBottle(currentTime) {
  let bottle = new ThrowableObject(
    this.character.x + 100,
    this.character.y + 50,
    this.character.otherDirection
  );
  this.throwableObject.push(bottle);
  this.updateBottleCount();
  
  // Schedule respawn of a bottle at original position
  if (this.collectedBottlePositions && this.collectedBottlePositions.length > 0) {
    let position = this.collectedBottlePositions.shift();
    this.scheduleBottleRespawn(position.x, position.y);
  }
  
  this.lastThrowTime = currentTime;
  this.character.lastMovement = Date.now();
  this.playSound("audio/throw.mp3");
}

/**
 * Schedules bottle respawn at ground position after 8 seconds
 * @param {number} originalX - Original X position
 * @param {number} originalY - Original Y position
 */
scheduleBottleRespawn(originalX, originalY) {
  setTimeout(() => {
    let newBottle = new Bottle();
    newBottle.x = originalX;
    newBottle.y = originalY;
    newBottle.originalX = originalX;
    newBottle.originalY = originalY;
    this.level.bottle.push(newBottle);
  }, 5000);
}


  /**
   * Updates bottle count after throwing
   */
  updateBottleCount() {
    this.collectedBottles--;
    let percentage = (this.collectedBottles / this.totalBottles) * 100;
    this.bottleBar.setPercentage(percentage);
  }

  /**
   * Main draw function that renders the game
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.gameState === "start") {
      this.screenManager.showStartScreen();
    } else if (this.gameState === "playing") {
      this.drawGame();
    } else if (this.gameState === "gameOver") {
      this.screenManager.showGameOverScreen();
    } else if (this.gameState === "youWon") {
      this.screenManager.showYouWonScreen();
    }

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  /**
   * Returns to home screen
   */
  goToHome() {
    this.restartGame();
    this.backgroundMusic.pause();
    this.gameState = "start";
  }

  /**
   * Draws the main game
   */
  drawGame() {
    this.drawWorldObjects();
    this.drawUI();
  }

  /**
   * Draws world objects with camera translation
   */
  drawWorldObjects() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.ctx.translate(-this.camera_x, 0);

    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObject);
    this.addObjectsToMap(this.level.bottle);
    this.addObjectsToMap(this.level.coins);
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Draws UI elements
   */
  drawUI() {
    this.addToMap(this.statusBar);
    this.addToMap(this.endbossBar);
    this.addToMap(this.coinsBar);
    this.addToMap(this.bottleBar);
  }

  /**
   * Restarts the game
   */
  restartGame() {
    this.resetGameState();
    this.initializeGameObjects();
    this.startGame();
  }

  /**
   * Resets game state
   */
  resetGameState() {
    clearAllIntervals();
    initLevel1();
    this.gameState = "playing";
    this.gameOverSoundsPlayed = false;
    this.winSoundPlayed = false;
  }

  /**
   * Initializes game objects
   */
  initializeGameObjects() {
    this.character = new Character();
    this.character.world = this;
    this.level = level1;
    this.camera_x = -100;
    this.statusBar = new StatusBar();
    this.endbossBar = new EndbossBar();
    this.coinsBar = new CoinsBar();
    this.bottleBar = new BottleBar();
    this.throwableObject = [];
    this.collectedBottles = 0;
    this.collectedCoins = 0;
    this.lastThrowTime = 0;
  }

  /**
   * Starts the game
   */
  startGame() {
    this.backgroundMusic.play();
    this.run();
  }

  /**
   * Adds multiple objects to the map
   * @param {Array} objects - Array of objects to add
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Adds a single object to the map
   * @param {Object} mo - Movable object to add
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Flips image horizontally
   * @param {Object} mo - Movable object to flip
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores image from flip
   * @param {Object} mo - Movable object to restore
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
