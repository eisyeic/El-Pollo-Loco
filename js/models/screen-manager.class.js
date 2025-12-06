/**
 * Screen Manager class for handling all screen-related operations
 */
class ScreenManager {
  /**
   * Creates a new ScreenManager instance
   * @param {World} world - Reference to the world instance
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * Shows the victory screen
   */
  showYouWonScreen() {
    this.world.drawGame();
    this.world.addObjectsToMap(this.world.level.winImages);
    this.showCoinsResults();
    this.showRestartText();
    this.handleWinSound();
    this.handleWinInput();
  }

  /**
   * Handles win sound playback
   */
  handleWinSound() {
    if (!this.world.winSoundPlayed) {
      this.world.backgroundMusic.pause();
      this.world.playSound("audio/win.mp3");
      this.world.winSoundPlayed = true;
    }
  }

  /**
   * Handles input on win screen
   */
  handleWinInput() {
    if (this.world.keyboard.SPACE) {
      this.world.restartGame();
    }
    if (this.world.keyboard.STRG) {
      this.world.goToHome();
    }
  }

  /**
   * Shows coin collection results
   */
  showCoinsResults() {
    this.world.ctx.fillStyle = "white";
    this.world.ctx.font = "bold 36px Arial";
    const coinsText = `Coins: ${this.world.collectedCoins}/${this.world.totalCoins}`;
    const coinsTextWidth = this.world.ctx.measureText(coinsText).width;
    this.world.ctx.fillText(coinsText, (this.world.canvas.width - coinsTextWidth) / 2, 160);
  }

  /**
   * Shows restart instructions
   */
  showRestartText() {
    this.world.ctx.fillStyle = "white";
    this.world.ctx.font = "24px Arial";
    const restartText = "Press SPACE to Restart or STRG to Home";
    const restartTextWidth = this.world.ctx.measureText(restartText).width;
    this.world.ctx.fillText(
      restartText,
      (this.world.canvas.width - restartTextWidth) / 2,
      450
    );
  }

  /**
   * Shows the start screen
   */
  showStartScreen() {
    this.world.addObjectsToMap(this.world.level.startImage);
    this.drawStartText();
    this.handleStartInput();
  }

  /**
   * Draws start screen text
   */
  drawStartText() {
  this.world.ctx.fillStyle = "white";
  this.world.ctx.font = "24px Arial";

  const isTouchDevice = 'ontouchstart' in window;
  const startText = isTouchDevice ? "Press Jump to Start" : "Press SPACE to Start";

  const textWidth = this.world.ctx.measureText(startText).width;
  const x = (this.world.canvas.width - textWidth) / 2;

  this.world.ctx.fillText(startText, x, 450);
}


  /**
   * Handles input on start screen
   */
 handleStartInput() {
  if (this.world.keyboard.SPACE) {
    this.world.gameState = "playing";
    try {
      this.world.backgroundMusic.play();
    } catch (error) {
      console.log("Audio play failed:", error);
    }
  }
}

  /**
   * Shows the game over screen
   */
  showGameOverScreen() {
    this.world.drawGame();
    this.drawGameOverElements();
    this.handleGameOverSound();
    this.handleGameOverInput();
  }

  /**
   * Draws game over screen elements
   */
  drawGameOverElements() {
    this.world.level.endImages[0].startGameOverSequence();
    this.world.addObjectsToMap(this.world.level.endImages);

    this.world.ctx.fillStyle = "white";
    this.world.ctx.font = "24px Arial";
    this.world.ctx.fillText(
      "Press SPACE to Restart or STRG to Home",
      this.world.canvas.width / 4,
      450
    );
  }

  /**
   * Handles game over sound playback
   */
  handleGameOverSound() {
    if (!this.world.gameOverSoundsPlayed) {
      this.world.backgroundMusic.pause();
      this.world.playSound("audio/game-over-kid-voice.mp3");
      this.world.playSound("audio/game-over-song.mp3");
      this.world.gameOverSoundsPlayed = true;
    }
  }

  /**
   * Handles input on game over screen
   */
  handleGameOverInput() {
    if (this.world.keyboard.SPACE) {
      this.world.restartGame();
    }
    if (this.world.keyboard.STRG) {
      this.world.goToHome();
    }
  }
}