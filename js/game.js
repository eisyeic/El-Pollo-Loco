let canvas;
let world;
let keyboard = new Keyboard();

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas);
  initTouchBtns();
}

function initTouchBtns() {
  initBottleBtn();
  initJUmpBtn();
  initRightBtn();
  initLeftBtn();
}

function initBottleBtn() {
  const btnBottle = document.getElementById("btn-bottle");

  if (btnBottle) {
    btnBottle.addEventListener("touchstart", (e) => {
      e.preventDefault();
      keyboard.STRG = true;
    });
    btnBottle.addEventListener("touchend", (e) => {
      e.preventDefault();
      keyboard.STRG = false;
    });
  }
}

function initJUmpBtn() {
  const btnJump = document.getElementById("btn-jump");

  if (btnJump) {
    btnJump.addEventListener("touchstart", (e) => {
      e.preventDefault();
      keyboard.SPACE = true;
    });
    btnJump.addEventListener("touchend", (e) => {
      e.preventDefault();
      keyboard.SPACE = false;
    });
  }
}

function initRightBtn() {
  const btnRight = document.getElementById("btn-right");

  if (btnRight) {
    btnRight.addEventListener("touchstart", (e) => {
      e.preventDefault();
      keyboard.RIGHT = true;
    });
    btnRight.addEventListener("touchend", (e) => {
      e.preventDefault();
      keyboard.RIGHT = false;
    });
  }
}

function initLeftBtn() {
  const btnLeft = document.getElementById("btn-left");

  if (btnLeft) {
    btnLeft.addEventListener("touchstart", (e) => {
      e.preventDefault();
      keyboard.LEFT = true;
    });
    btnLeft.addEventListener("touchend", (e) => {
      e.preventDefault();
      keyboard.LEFT = false;
    });
  }
}

window.addEventListener("keydown", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = true;
  }
  if (e.keyCode == 37) {
    keyboard.LEFT = true;
  }
  if (e.keyCode == 38) {
    keyboard.UP = true;
  }
  if (e.keyCode == 40) {
    keyboard.DOWN = true;
  }
  if (e.keyCode == 32) {
    keyboard.SPACE = true;
  }
  if (e.keyCode == 17) {
    keyboard.STRG = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = false;
  }
  if (e.keyCode == 37) {
    keyboard.LEFT = false;
  }
  if (e.keyCode == 38) {
    keyboard.UP = false;
  }
  if (e.keyCode == 40) {
    keyboard.DOWN = false;
  }
  if (e.keyCode == 32) {
    keyboard.SPACE = false;
  }
  if (e.keyCode == 17) {
    keyboard.STRG = false;
  }
});

function clearAllIntervals() {
    for (let i = 1; i < 9999; i++) window.clearInterval(i);
  }