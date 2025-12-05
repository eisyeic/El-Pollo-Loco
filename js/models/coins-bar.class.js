class CoinsBar extends DrawableObject {
  IMAGES = [
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png",
  ];

  percentage = 0;

  /**
   * Creates a new CoinsBar instance
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 270;
    this.y = 0;
    this.width = 200;
    this.height = 50;
    this.setPercentage(0);
  }

  /**
   * Sets the percentage value and updates the displayed image
   * @param {number} percentage - The percentage value (0-100)
   */
  setPercentage(percentage) {
    this.percentage = percentage; // => 0 ... 5
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }
  /**
   * Resolves the image index based on the current percentage
   * @returns {number} The index of the image to display (0-5)
   */
  resolveImageIndex() {
    if (this.percentage >= 100) return 5;
    if (this.percentage >= 80) return 4;
    if (this.percentage >= 60) return 3;
    if (this.percentage >= 40) return 2;
    if (this.percentage > 0) return 1;
    return 0;
  }
}
