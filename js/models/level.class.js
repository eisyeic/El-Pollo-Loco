class Level {
  enemies;
  clouds;
  backgroundObjects;
  startImage;
  level_end_x = 2260;

  constructor(enemies, clouds, backgroundObjects, startImage) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.startImage = startImage;
  }
}
