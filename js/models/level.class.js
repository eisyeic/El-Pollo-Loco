class Level {
  enemies;
  clouds;
  backgroundObjects;
  startImage;
  endImages;
  level_end_x = 2260;
  bottle;
  coins;

  constructor(
    enemies,
    clouds,
    backgroundObjects,
    startImage,
    endImages,
    bottle,
    coins
  ) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.startImage = startImage;
    this.endImages = endImages;
    this.bottle = bottle;
    this.coins = coins;
  }
}
