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

