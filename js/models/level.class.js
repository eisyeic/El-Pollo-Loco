class Level {
  enemies;
  clouds;
  backgroundObjects;
  startImage;
  endImages;
  level_end_x = 2260;

  constructor(enemies, clouds, backgroundObjects, startImage, endImages) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.startImage = startImage;
    this.endImages = endImages;
  }
}
