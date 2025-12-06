/**
 * Collision Manager class for handling all collision-related operations
 */
class CollisionManager {
  /**
   * Creates a new CollisionManager instance
   * @param {World} world - Reference to the world instance
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * Checks and collects coins
   */
  collectCoins() {
    for (let i = this.world.level.coins.length - 1; i >= 0; i--) {
      let coin = this.world.level.coins[i];
      if (this.world.character.isColliding(coin)) {
        this.handleCoinCollection(i);
      }
    }
  }

  /**
   * Handles coin collection
   * @param {number} coinIndex - Index of the coin
   */
  handleCoinCollection(coinIndex) {
    this.world.level.coins.splice(coinIndex, 1);
    this.world.collectedCoins++;
    let percentage = (this.world.collectedCoins / this.world.totalCoins) * 100;
    this.world.coinsBar.setPercentage(percentage);
    this.world.playSound("audio/coins-sound.mp3");
  }

  /**
   * Checks collisions between bottles and enemies
   */
  checkBottleCollisions() {
    for (let i = this.world.throwableObject.length - 1; i >= 0; i--) {
      let bottle = this.world.throwableObject[i];
      this.checkBottleEnemyCollisions(bottle, i);
    }
  }

  /**
   * Checks bottle collisions with all enemies
   * @param {ThrowableObject} bottle - The bottle
   * @param {number} bottleIndex - Index of the bottle
   */
  checkBottleEnemyCollisions(bottle, bottleIndex) {
    for (let j = this.world.level.enemies.length - 1; j >= 0; j--) {
      let enemy = this.world.level.enemies[j];
      if (bottle.isColliding(enemy) && !enemy.isKilled) {
        this.handleBottleHit(bottleIndex, enemy);
        break;
      }
    }
  }

  /**
   * Handles bottle hit on enemy
   * @param {number} bottleIndex - Index of the bottle
   * @param {Object} enemy - The hit enemy
   */
  handleBottleHit(bottleIndex, enemy) {
    this.world.throwableObject.splice(bottleIndex, 1);

    if (enemy instanceof Endboss) {
      this.handleEndbossHit(enemy);
    } else {
      this.handleEnemyKill(enemy);
    }
  }

  /**
   * Handles hit on endboss
   * @param {Endboss} endboss - The endboss
   */
  handleEndbossHit(endboss) {
    endboss.hit();
    this.world.playSound("audio/chicken-hurt.mp3");
    this.world.endbossBar.setPercentage(endboss.energy);
  }

  /**
   * Handles killing of normal enemy
   * @param {Object} enemy - The enemy
   */
  handleEnemyKill(enemy) {
    enemy.killEnemy();
    this.world.playSound("audio/chicken-hurt.mp3");
    setTimeout(() => {
      let index = this.world.level.enemies.indexOf(enemy);
      if (index > -1) {
        this.world.level.enemies.splice(index, 1);
      }
    }, 1000);
  }

  /**
   * Checks collisions between character and enemies
   */
  checkCollisions() {
    this.world.level.enemies.forEach((enemy) => {
      if (this.world.character.isColliding(enemy)) {
        this.handleCharacterEnemyCollision(enemy);
      }
    });
  }

  /**
   * Handles collision between character and enemy
   * @param {Object} enemy - The enemy
   */
  handleCharacterEnemyCollision(enemy) {
    if (this.canJumpOnEnemy(enemy)) {
      this.handleJumpOnEnemy(enemy);
    } else if (!enemy.isKilled) {
      this.handleCharacterHurt();
    }
  }

  /**
   * Checks if character can jump on enemy
   * @param {Object} enemy - The enemy
   * @returns {boolean} True if jumping is possible
   */
  canJumpOnEnemy(enemy) {
    return (
      this.world.character.isAboveGround() &&
      this.world.character.speedY < 0 &&
      (enemy instanceof Chicken || enemy instanceof ChickenBaby) &&
      !enemy.isKilled
    );
  }

  /**
   * Handles jumping on enemy
   * @param {Object} enemy - The enemy
   */
  handleJumpOnEnemy(enemy) {
    enemy.killEnemy();
    this.world.playSound("audio/chicken-hurt.mp3");
    this.world.character.speedY = 15;
    setTimeout(() => {
      let index = this.world.level.enemies.indexOf(enemy);
      if (index > -1 && !(enemy instanceof Endboss)) {
        this.world.level.enemies.splice(index, 1);
      }
    }, 1000);
  }

  /**
   * Handles character getting hurt
   */
  handleCharacterHurt() {
    this.world.character.hit();
    if (this.world.hurtSound.paused && soundEnabled) {
      this.world.hurtSound.volume = soundEnabled ? this.world.soundVolume : 0;
      this.world.hurtSound.play();
    }
    this.world.statusBar.setPercentage(this.world.character.energy);
  }

  /**
   * Checks and collects bottles
   */
  takeABottle() {
    for (let i = this.world.level.bottle.length - 1; i >= 0; i--) {
      let bottle = this.world.level.bottle[i];
      if (this.world.character.isColliding(bottle)) {
        this.handleBottleCollection(i);
      }
    }
  }

  /**
   * Handles bottle collection and tracks position for respawn
   * @param {number} bottleIndex - Index of the bottle
   */
  handleBottleCollection(bottleIndex) {
    let bottle = this.world.level.bottle[bottleIndex];
    let originalPosition = this.getBottleOriginalPosition(bottle);

    this.removeBottleFromLevel(bottleIndex);
    this.updateBottleCount();
    this.storeBottlePosition(originalPosition);
  }

  /**
   * Gets the original position of a bottle
   * @param {Bottle} bottle - The bottle object
   * @returns {Object} Original position {x, y}
   */
  getBottleOriginalPosition(bottle) {
    return {
      x: bottle.originalX || bottle.x,
      y: bottle.originalY || bottle.y,
    };
  }

  /**
   * Removes bottle from level and plays sound
   * @param {number} bottleIndex - Index of the bottle
   */
  removeBottleFromLevel(bottleIndex) {
    this.world.level.bottle.splice(bottleIndex, 1);
    this.world.playSound("audio/bottle.mp3");
  }

  /**
   * Updates bottle count and progress bar
   */
  updateBottleCount() {
    this.world.collectedBottles++;
    let percentage =
      (this.world.collectedBottles / this.world.totalBottles) * 100;
    this.world.bottleBar.setPercentage(percentage);
  }

  /**
   * Stores bottle position for respawn
   * @param {Object} position - Position {x, y}
   */
  storeBottlePosition(position) {
    if (!this.world.collectedBottlePositions) {
      this.world.collectedBottlePositions = [];
    }
    this.world.collectedBottlePositions.push(position);
  }
}
