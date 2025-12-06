let canvas;
let world;
let keyboard = new Keyboard();
let soundEnabled = localStorage.getItem('soundEnabled') !== 'false';

/**
 * Initializes the game
 */
function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas);
  initTouchBtns();
  updateSoundIcons();
  updateSoundVolumes();
}


/**
 * Initializes all touch buttons
 */
function initTouchBtns() {
  initBottleBtn();
  initJumpBtn();
  initRightBtn();
  initLeftBtn();
}

/**
 * Initializes the bottle throw button
 */
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

/**
 * Initializes the jump button
 */
function initJumpBtn() {
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

/**
 * Initializes the right movement button
 */
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

/**
 * Initializes the left movement button
 */
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

/**
 * Clears all active intervals
 */
function clearAllIntervals() {
  for (let i = 1; i < 9999; i++) window.clearInterval(i);
}

/**
 * Checks screen orientation and shows rotate overlay if needed
 */
function checkOrientation() {
  const isTouchDevice = 'ontouchstart' in window;
  const isPortrait = window.innerHeight > window.innerWidth;
  const rotateOverlay = document.getElementById("rotate-overlay");

  if (rotateOverlay) {
    if (isTouchDevice && isPortrait) {
      rotateOverlay.classList.remove("d-none");
    } else {
      rotateOverlay.classList.add("d-none");
    }
  }
}

/**
 * Opens or closes the info menu
 */
function openInfo() {
  document.getElementById("game-info-box").classList.toggle("d-none");
}

document.addEventListener("click", function (event) {
  const gameInfo = document.getElementById("game-info-box");
  const infoIcon = document.querySelector('img[onclick="openInfo()"]');

  if (!gameInfo.contains(event.target) && event.target !== infoIcon) {
    gameInfo.classList.add("d-none");
  }
});

/**
 * Toggles sound on/off
 */
function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem('soundEnabled', soundEnabled);
  updateSoundIcons();
  updateSoundVolumes();
}

/**
 * Updates sound icons based on sound status
 */
function updateSoundIcons() {
  const soundOnIcon = document.getElementById("sound-on-icon");
  const soundOffIcon = document.getElementById("sound-off-icon");
  
  if (soundEnabled) {
    soundOnIcon.classList.remove("d-none");
    soundOffIcon.classList.add("d-none");
  } else {
    soundOnIcon.classList.add("d-none");
    soundOffIcon.classList.remove("d-none");
  }
}

/**
 * Updates volume for all sounds
 */
function updateSoundVolumes() {
  if (world) {
    world.soundVolume = soundEnabled ? 0.1 : 0;
    world.backgroundMusic.volume = soundEnabled ? 0.3 : 0;
    world.hurtSound.volume = soundEnabled ? 0.1 : 0;
  }
}

window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);
window.addEventListener("load", checkOrientation);