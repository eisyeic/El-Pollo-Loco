/**
 * Enters fullscreen mode
 * @param {HTMLElement} canvasContainer - Canvas container element
 * @param {HTMLElement} gameTools - Game tools element
 * @param {HTMLElement} fullscreenStartIcon - Fullscreen start icon
 * @param {HTMLElement} fullscreenEndIcon - Fullscreen end icon
 */
function enterFullscreen(
  canvasContainer,
  gameTools,
  fullscreenStartIcon,
  fullscreenEndIcon
) {
  canvasContainer.requestFullscreen();
  gameTools.classList.add("fullscreen-overlay");
  fullscreenStartIcon.classList.add("d-none");
  fullscreenEndIcon.classList.remove("d-none");
}

/**
 * Exits fullscreen mode
 * @param {HTMLElement} gameTools - Game tools element
 * @param {HTMLElement} fullscreenStartIcon - Fullscreen start icon
 * @param {HTMLElement} fullscreenEndIcon - Fullscreen end icon
 */
function exitFullscreen(gameTools, fullscreenStartIcon, fullscreenEndIcon) {
  document.exitFullscreen();
  gameTools.classList.remove("fullscreen-overlay");
  fullscreenStartIcon.classList.remove("d-none");
  fullscreenEndIcon.classList.add("d-none");
}

/**
 * Toggles between fullscreen and windowed mode
 */
function toggleFullscreen() {
  const canvasContainer = document.getElementById("canvas-screen");
  const gameTools = document.getElementById("game-tools-box");
  const fullscreenStartIcon = document.getElementById("fullscreen-start-icon");
  const fullscreenEndIcon = document.getElementById("fullscreen-end-icon");

  if (!document.fullscreenElement) {
    enterFullscreen(
      canvasContainer,
      gameTools,
      fullscreenStartIcon,
      fullscreenEndIcon
    );
  } else {
    exitFullscreen(gameTools, fullscreenStartIcon, fullscreenEndIcon);
  }
}