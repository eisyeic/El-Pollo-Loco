let level1;

/**
 * Initializes level 1 with all game objects
 */
function initLevel1() {
  level1 = new Level(
    [
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new ChickenBaby(),
      new ChickenBaby(),
      new ChickenBaby(),
      new Endboss(),
    ],
    [new Cloud(), new Cloud(), new Cloud()],
    [
      new BackgroundObject("img/5_background/layers/air.png", -720),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -720),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/2.png",
        -720
      ),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -720),

      new BackgroundObject("img/5_background/layers/air.png", 0),
      new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),

      new BackgroundObject("img/5_background/layers/air.png", 720),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 720),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 720),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 720),

      new BackgroundObject("img/5_background/layers/air.png", 720 * 2),
      new BackgroundObject(
        "img/5_background/layers/3_third_layer/1.png",
        720 * 2
      ),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/1.png",
        720 * 2
      ),
      new BackgroundObject(
        "img/5_background/layers/1_first_layer/1.png",
        720 * 2
      ),

      new BackgroundObject("img/5_background/layers/air.png", 720 * 3),
      new BackgroundObject(
        "img/5_background/layers/3_third_layer/2.png",
        720 * 3
      ),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/2.png",
        720 * 3
      ),
      new BackgroundObject(
        "img/5_background/layers/1_first_layer/2.png",
        720 * 3
      ),
    ],
    [new StartImage("img/9_intro_outro_screens/start/startscreen_1.png")],
    [
      new EndImage(
        "img/You won, you lost/You lost.png",
        "img/You won, you lost/Game Over.png"
      ),
    ],
    [new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle()],
    [new Coins(), new Coins(), new Coins(), new Coins(), new Coins()],
    [
      new EndImage(
        "img/You won, you lost/You won A.png",
        "img/You won, you lost/You Won A.png"
      ),
    ]
  );
}


// Initialize level on load
initLevel1();
