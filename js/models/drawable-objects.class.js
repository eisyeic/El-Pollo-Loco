class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 120;
  y = 250;
  height = 150;
  width = 100;

  /**
   *
   * @param {Array} arr - ['img/image1.png', 'img/image2.png', ...]
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  draw(ctx) {
    try {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    } catch (e) {
      console.log('Error loading image', e);
      console.log('Could not load image', this.img.src);
    }
  }

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  drawFrame(ctx) {
    if (this instanceof Character || this instanceof Chicken) {
      ctx.beginPath();
      ctx.lineWidth = "5";
      ctx.strokeStyle = "blue";
      ctx.rect(
        this.x + this.offset.left,
        this.y + this.offset.top,
        this.width - this.offset.left - this.offset.right,
        this.height - this.offset.top - this.offset.bottom
      );
      ctx.stroke();
    }
  }
}
