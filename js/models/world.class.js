class World {
  gameState = "start"; // 'start' oder 'playing'
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = -100;
  statusBar = new StatusBar();
  throwableObject = [];
  collectedBottles = 0;
  lastThrowTime = 0;
  throwCooldown = 300;
  screenlayer = false;

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
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
      }
    }, 1000 / 60);
  }

  checkBottleCollisions() {
    for (let i = this.throwableObject.length - 1; i >= 0; i--) {
      let bottle = this.throwableObject[i];

      for (let j = this.level.enemies.length - 1; j >= 0; j--) {
        let enemy = this.level.enemies[j];

        if (bottle.isColliding(enemy) && !enemy.isKilled) {
          this.throwableObject.splice(i, 1);
          enemy.killEnemy();

          setTimeout(() => {
            let index = this.level.enemies.indexOf(enemy);
            if (index > -1) {
              this.level.enemies.splice(index, 1);
            }
          }, 1000);

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
      this.lastThrowTime = currentTime;
    }
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
    });
  }

  takeABottle() {
    for (let i = this.level.bottle.length - 1; i >= 0; i--) {
      let bottle = this.level.bottle[i];
      if (this.character.isColliding(bottle)) {
        this.level.bottle.splice(i, 1);
        this.collectedBottles++;
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
    }

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

showStartScreen() {
  this.addObjectsToMap(this.level.startImage);

  this.ctx.fillStyle = "white";
  this.ctx.font = "24px Arial";
  
  const isMobile = window.innerWidth <= 720 || window.innerHeight <= 720;
  const startText = isMobile ? "Press to Jump" : "Press SPACE to Start";
  
  const textWidth = this.ctx.measureText(startText).width;
  const x = (this.canvas.width - textWidth) / 2;
  
  this.ctx.fillText(startText, x, 450);

  if (this.keyboard.SPACE) {
    this.gameState = "playing";
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
  }

  showGameOverScreen() {
    this.drawGame();

    this.level.endImages[0].startGameOverSequence();
    this.addObjectsToMap(this.level.endImages);

    this.ctx.fillStyle = "white";
    this.ctx.font = "24px Arial";
    this.ctx.fillText("Press SPACE to Restart", this.canvas.width / 3, 450);

    if (this.keyboard.SPACE) {
      this.restartGame();
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
    this.throwableObject = [];
    this.collectedBottles = 0; // Inventar zurücksetzen
    this.lastThrowTime = 0;
    this.gameState = "playing";
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

    mo.drawFrame(this.ctx);

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
