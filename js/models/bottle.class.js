class Bottle extends MovableObject {
  width = 80;
  height = 80;
  static bottleIndex = 0;
  static bottlePositions = [300, 700, 1100, 1500, 1900, 2100, 2300];
  /** @type {number} Original X position for respawning */
  originalX;
  /** @type {number} Original Y position for respawning */
  originalY;

  Bottle_Ground = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  /**
   * Creates a new Bottle instance with automatic positioning and respawn capability
   */
  constructor() {
    super().loadImage(
      this.Bottle_Ground[Bottle.bottleIndex % this.Bottle_Ground.length]
    );
    this.x = Bottle.bottlePositions[Bottle.bottleIndex % Bottle.bottlePositions.length];
    this.originalX = this.x;
    this.originalY = 350;
    this.y = this.originalY;
    Bottle.bottleIndex++;
  }
}
