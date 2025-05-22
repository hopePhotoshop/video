function togglePlayPause() {
  if (videoPlayer.paused) {
    videoPlayer.play().then(() => {
      playPauseIcon.className = "mdi mdi-pause";
      startIcon.style.display = "none";
      startProgressUpdate();
    }).catch(() => {
      showError("Ошибка воспроизведения");
    });
  } else {
    videoPlayer.pause();
    playPauseIcon.className = "mdi mdi-play";
    startIcon.style.display = "flex";
    stopProgressUpdate();
  }
}

function hideControls() {
  if (document.fullscreenElement) {
    controls.style.opacity = '0';
    controls.style.pointerEvents = 'none';
  }
}

function showControls() {
  controls.style.opacity = '1';
  controls.style.pointerEvents = 'auto';
  resetHideControlsTimeout();
}

function showMainMenu() {
  mainMenu.style.display = "flex";
  qualityMenu.style.display = "none";
  speedMenu.style.display = "none";
}

function showSubMenu(menu) {
  mainMenu.style.display = "none";
  menu.style.display = "flex";
}

function resetHideControlsTimeout() {
  clearTimeout(hideControlsTimeout);
  hideControlsTimeout = setTimeout(hideControls, 3000);
}

document.addEventListener('mousemove', showControls);
document.addEventListener('touchstart', showControls);

videoPlayer.addEventListener('fullscreenchange', () => {
  if (document.fullscreenElement) {
    resetHideControlsTimeout();
  } else {
    showControls();
  }
});
showControls();