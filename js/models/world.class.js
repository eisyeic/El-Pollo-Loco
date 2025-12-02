class World {
  gameState = "start"; // 'start' oder 'playing'
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
  throwCooldown = 300;
  screenlayer = false;
  gameOverSoundsPlayed = false;
  soundVolume = 0.1;

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.hurtSound = new Audio("audio/charakter-hurt.mp3");
    this.backgroundMusic = new Audio("audio/backgroundmusic.mp3");
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.3;
    this.draw();
    this.setWorld();
    this.run();
  }

  playSound(audioPath) {
    if (soundEnabled) {
      let sound = new Audio(audioPath);
      sound.volume = this.soundVolume;
      sound.play();
    }
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      if (this.gameState === "playing") {
        this.checkCollisions();
        this.checkThrowObjects();
        this.checkBottleCollisions();
        this.takeABottle();
        this.collectCoins();
        this.checkEndbossDefeated();
      }
    }, 1000 / 60);
  }

  checkEndbossDefeated() {
    let endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
    if (
      endboss &&
      endboss.energy <= 0 &&
      endboss.deathAnimationPlayed &&
      this.gameState === "playing"
    ) {
      clearAllIntervals();
      this.backgroundMusic.pause();
      this.gameState = "youWon";
    }
  }

  collectCoins() {
    for (let i = this.level.coins.length - 1; i >= 0; i--) {
      let coin = this.level.coins[i];
      if (this.character.isColliding(coin)) {
        this.level.coins.splice(i, 1);
        this.collectedCoins++;
        let percentage = (this.collectedCoins / this.totalCoins) * 100;
        this.coinsBar.setPercentage(percentage);
        this.playSound("audio/coins-sound.mp3");
      }
    }
  }

  checkBottleCollisions() {
    for (let i = this.throwableObject.length - 1; i >= 0; i--) {
      let bottle = this.throwableObject[i];

      for (let j = this.level.enemies.length - 1; j >= 0; j--) {
        let enemy = this.level.enemies[j];

        if (bottle.isColliding(enemy) && !enemy.isKilled) {
          this.throwableObject.splice(i, 1);

          if (enemy instanceof Endboss) {
            enemy.hit();
            this.playSound("audio/chicken-hurt.mp3");
            this.endbossBar.setPercentage(enemy.energy);
          } else {
            enemy.killEnemy();
            this.playSound("audio/chicken-hurt.mp3");
            setTimeout(() => {
              let index = this.level.enemies.indexOf(enemy);
              if (index > -1) {
                this.level.enemies.splice(index, 1);
              }
            }, 1000);
          }
          break;
        }
      }
    }
  }

  checkThrowObjects() {
    let currentTime = Date.now();
    if (
      this.keyboard.STRG &&
      currentTime - this.lastThrowTime > this.throwCooldown &&
      this.collectedBottles > 0
    ) {
      let bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 50,
        this.character.otherDirection
      );
      this.throwableObject.push(bottle);
      this.collectedBottles--;
      let percentage = (this.collectedBottles / this.totalBottles) * 100;
      this.bottleBar.setPercentage(percentage);
      this.lastThrowTime = currentTime;
      this.playSound("audio/throw.mp3");
    }
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy, index) => {
      if (this.character.isColliding(enemy)) {
        if (
          this.character.isAboveGround() &&
          this.character.speedY < 0 &&
          (enemy instanceof Chicken || enemy instanceof ChickenBaby) &&
          !enemy.isKilled
        ) {
          enemy.killEnemy();
          this.playSound("audio/chicken-hurt.mp3");
          this.character.speedY = 15;
          setTimeout(() => {
            let index = this.level.enemies.indexOf(enemy);
            if (index > -1 && !(enemy instanceof Endboss)) {
              this.level.enemies.splice(index, 1);
            }
          }, 1000);
        } else if (!enemy.isKilled) {
          this.character.hit();
          if (this.hurtSound.paused && soundEnabled) {
            this.hurtSound.volume = soundEnabled ? this.soundVolume : 0;
            this.hurtSound.play();
          }
          this.statusBar.setPercentage(this.character.energy);
        }
      }
    });
  }

  takeABottle() {
    for (let i = this.level.bottle.length - 1; i >= 0; i--) {
      let bottle = this.level.bottle[i];
      if (this.character.isColliding(bottle)) {
        this.level.bottle.splice(i, 1);
        this.collectedBottles++;
        let percentage = (this.collectedBottles / this.totalBottles) * 100;
        this.bottleBar.setPercentage(percentage);
        this.playSound("audio/bottle.mp3");
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.gameState === "start") {
      this.showStartScreen();
    } else if (this.gameState === "playing") {
      this.drawGame();
    } else if (this.gameState === "gameOver") {
      this.showGameOverScreen();
    } else if (this.gameState === "youWon") {
      this.showYouWonScreen();
    }

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  showYouWonScreen() {
    this.drawGame();
    this.addObjectsToMap(this.level.winImages);
    this.showCoinsResults();
    this.showRestartText();

    if (!this.winSoundPlayed) {
      this.backgroundMusic.pause();
      this.playSound("audio/win.mp3");
      this.winSoundPlayed = true;
    }

    if (this.keyboard.SPACE) {
      this.restartGame();
    }
    if (this.keyboard.STRG) {
      this.goToHome();
    }
  }

  goToHome() {
    this.restartGame();
    this.backgroundMusic.pause();
    this.gameState = "start";
  }

  showCoinsResults() {
    this.ctx.fillStyle = "white";
    this.ctx.font = "bold 36px Arial";
    const coinsText = `Coins: ${this.collectedCoins}/${this.totalCoins}`;
    const coinsTextWidth = this.ctx.measureText(coinsText).width;
    this.ctx.fillText(coinsText, (this.canvas.width - coinsTextWidth) / 2, 160);
  }

  showRestartText() {
    this.ctx.fillStyle = "white";
    this.ctx.font = "24px Arial";
    const restartText = "Press SPACE to Restart or STRG to Home";
    const restartTextWidth = this.ctx.measureText(restartText).width;
    this.ctx.fillText(
      restartText,
      (this.canvas.width - restartTextWidth) / 2,
      450
    );
  }

  showStartScreen() {
    this.addObjectsToMap(this.level.startImage);

    this.ctx.fillStyle = "white";
    this.ctx.font = "24px Arial";

    const isMobile = window.innerWidth <= 720 || window.innerHeight <= 720;
    const startText = isMobile ? "Press Jump to Start" : "Press SPACE to Start";

    const textWidth = this.ctx.measureText(startText).width;
    const x = (this.canvas.width - textWidth) / 2;

    this.ctx.fillText(startText, x, 450);

    if (this.keyboard.SPACE) {
      this.gameState = "playing";
      this.backgroundMusic.play();
    }
  }

  drawGame() {
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
    this.addToMap(this.statusBar);
    this.addToMap(this.endbossBar);
    this.addToMap(this.coinsBar);
    this.addToMap(this.bottleBar);
  }

  showGameOverScreen() {
    this.drawGame();

    this.level.endImages[0].startGameOverSequence();
    this.addObjectsToMap(this.level.endImages);

    this.ctx.fillStyle = "white";
    this.ctx.font = "24px Arial";
    this.ctx.fillText(
      "Press SPACE to Restart or STRG to Home",
      this.canvas.width / 4,
      450
    );

    if (!this.gameOverSoundsPlayed) {
      this.backgroundMusic.pause();
      this.playSound("audio/game-over-kid-voice.mp3");
      this.playSound("audio/game-over-song.mp3");
      this.gameOverSoundsPlayed = true;
    }

    if (this.keyboard.SPACE) {
      this.restartGame();
    }
    if (this.keyboard.STRG) {
      this.goToHome();
    }
  }

  restartGame() {
    clearAllIntervals();
    initLevel1();
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
    this.gameState = "playing";
    this.gameOverSoundsPlayed = false;
    this.winSoundPlayed = false;
    this.backgroundMusic.play();
    this.run();
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}

function enterFullscreen(
  canvasContainer,
  gameTools,
  fullscreenStartIcon,
  fullscreenEndIcon
) {
  canvasContainer.requestFullscreen();
  gameTools.classList.add("fullscreen-overlay");
  fullscreenStartIcon.classList.add("d-none");
  fullscreenEndIcon.classList.remove("d-none");
}

function exitFullscreen(gameTools, fullscreenStartIcon, fullscreenEndIcon) {
  document.exitFullscreen();
  gameTools.classList.remove("fullscreen-overlay");
  fullscreenStartIcon.classList.remove("d-none");
  fullscreenEndIcon.classList.add("d-none");
}

function toggleFullscreen() {
  const canvasContainer = document.getElementById("canvas-screen");
  const gameTools = document.getElementById("game-tools-box");
  const fullscreenStartIcon = document.getElementById("fullscreen-start-icon");
  const fullscreenEndIcon = document.getElementById("fullscreen-end-icon");

  if (!document.fullscreenElement) {
    enterFullscreen(
      canvasContainer,
      gameTools,
      fullscreenStartIcon,
      fullscreenEndIcon
    );
  } else {
    exitFullscreen(gameTools, fullscreenStartIcon, fullscreenEndIcon);
  }
}
