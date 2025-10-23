class Character extends MovableObject {
    
  x = 120;
  y = 180;
  height = 250;
  width = 150;

  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
  }
  jump() {}
}
