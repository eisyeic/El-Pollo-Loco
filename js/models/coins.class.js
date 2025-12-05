class Coins extends MovableObject {
  width = 100;
  height = 100;
  static coinsIndex = 0;
  static coinsPositions = [600, 1000, 1400, 1800, 2200];

  Coins_Ground = [
    "img/8_coin/coin_1.png",
    "img/8_coin/coin_2.png",
  ];

  /**
   * Creates a new Coins instance with automatic positioning and random height
   */
  constructor() {
    super().loadImage(
      this.Coins_Ground[Coins.coinsIndex % this.Coins_Ground.length]
    );
    this.x =
      Coins.coinsPositions[
        Coins.coinsIndex % Coins.coinsPositions.length
      ];
    Coins.coinsIndex++;
     this.y = 50 + Math.random() * 130;
  }
}
