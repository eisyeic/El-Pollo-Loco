class Endboss extends MovableObject {
  y = 50;
  height = 400;
  width = 330;
  hadFirstContact = false;

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.x = 2500;
    this.animate();
  }

  animate() {
    let i = 0;
    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);

      if (
        world &&
        world.character &&
        world.character.x > 2000 &&
        !this.hadFirstContact
      ) {
        i = 0;
        this.hadFirstContact = true;
      }
    }, 150);
  }
}
