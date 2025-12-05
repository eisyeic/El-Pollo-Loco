class Level {
  enemies;
  clouds;
  backgroundObjects;
  startImage;
  endImages;
  winImages;
  level_end_x = 2600;
  bottle;
  coins;

  /**
   * Creates a new Level instance with all game objects
   * @param {Array} enemies - Array of enemy objects
   * @param {Array} clouds - Array of cloud objects
   * @param {Array} backgroundObjects - Array of background objects
   * @param {Object} startImage - Start screen image object
   * @param {Array} endImages - Array of end screen images
   * @param {Array} bottle - Array of bottle objects
   * @param {Array} coins - Array of coin objects
   * @param {Array} winImages - Array of win screen images
   */
  constructor(
    enemies,
    clouds,
    backgroundObjects,
    startImage,
    endImages,
    bottle,
    coins,
    winImages
  ) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.startImage = startImage;
    this.endImages = endImages;
    this.bottle = bottle;
    this.coins = coins;
    this.winImages = winImages;
  }
}

