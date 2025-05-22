playPauseBtn.addEventListener("click", togglePlayPause);
videoPlayer.addEventListener("click", togglePlayPause);
startIcon.addEventListener("click", togglePlayPause);

videoPlayer.addEventListener("ended", () => {
  playPauseIcon.className = "mdi mdi-play";
  startIcon.style.display = "flex";
  stopProgressUpdate();
});

progressBar.addEventListener("input", () => {
  videoPlayer.currentTime = (progressBar.value / 100) * videoPlayer.duration;
});

volumeSlider.addEventListener("input", () => {
  videoPlayer.volume = volumeSlider.value / 100;
  updateVolumeIcon(videoPlayer.volume);
});

volumeIcon.addEventListener("click", () => {
  videoPlayer.muted = !videoPlayer.muted;
  updateVolumeIcon(videoPlayer.muted ? 0 : videoPlayer.volume);
  volumeSlider.value = videoPlayer.muted ? 0 : videoPlayer.volume * 100;
});

videoPlayer.addEventListener("loadedmetadata", () => {
  totalTimeDisplay.textContent = formatTime(videoPlayer.duration);
});

videoPlayer.addEventListener("timeupdate", () => {
  currentTimeDisplay.textContent = formatTime(videoPlayer.currentTime);
});

progressBar.addEventListener('mousemove', function (e) {
  const rect = progressBar.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  const duration = videoPlayer.duration || 0;
  const time = Math.max(0, Math.min(duration, duration * percent));
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, '0');
  progressTooltip.textContent = `${minutes}:${seconds}`;
  progressTooltip.style.display = 'block';

  const wrapperRect = progressBar.parentElement.getBoundingClientRect();
  const tooltipX = e.clientX - wrapperRect.left;
  progressTooltip.style.left = `${tooltipX}px`;
  progressTooltip.style.top = `-32px`;
  progressTooltip.style.transform = 'translate(-50%, 0)';
  progressTooltip.style.position = 'absolute';
});
progressBar.addEventListener('mouseleave', function () {
  progressTooltip.style.display = 'none';
});

fullScreenBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    videoContainer.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

if ('pictureInPictureEnabled' in document) {
  pipButton.style.display = 'flex';
  pipButton.addEventListener('click', async () => {
    try {
      if (videoPlayer !== document.pictureInPictureElement) {
        await videoPlayer.requestPictureInPicture();
      } else {
        await document.exitPictureInPicture();
      }
    } catch {
      showError("Ошибка режима 'Картинка в картинке'");
    }
  });
} else {
  pipButton.style.display = 'none';
}

// Настройки
settingsButton.addEventListener("click", (e) => {
  e.stopPropagation();
  settingsOptions.style.display = settingsOptions.style.display === "flex" ? "none" : "flex";
  showMainMenu();
});
document.addEventListener("click", (e) => {
  if (!settingsButton.contains(e.target) && !settingsOptions.contains(e.target)) {
    settingsOptions.style.display = "none";
  }
});
document.getElementById('qualityMenuButton').addEventListener("click", (e) => {
  e.stopPropagation();
  showSubMenu(qualityMenu);
});
document.getElementById('speedMenuButton').addEventListener("click", (e) => {
  e.stopPropagation();
  showSubMenu(speedMenu);
});
backButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.stopPropagation();
    showMainMenu();
  });
});
qualityButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const selectedQuality = this.getAttribute("data-quality");
    loadSource(selectedQuality);
    settingsOptions.style.display = "none";
  });
});
speedButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const selectedSpeed = parseFloat(this.getAttribute("data-speed"));
    videoPlayer.playbackRate = selectedSpeed;
    settingsOptions.style.display = "none";
  });
});
document.addEventListener("keydown", (e) => {
  switch (e.code) {
    case "Space":
      e.preventDefault();
      togglePlayPause();
      break;
    case "ArrowRight":
      videoPlayer.currentTime = Math.min(videoPlayer.currentTime + 5, videoPlayer.duration);
      break;
    case "ArrowLeft":
      videoPlayer.currentTime = Math.max(videoPlayer.currentTime - 5, 0);
      break;
    case "ArrowUp":
      videoPlayer.volume = Math.min(videoPlayer.volume + 0.05, 1);
      volumeSlider.value = videoPlayer.volume;
      updateVolumeIcon(videoPlayer.volume);
      break;
    case "ArrowDown":
      videoPlayer.volume = Math.max(videoPlayer.volume - 0.05, 0);
      volumeSlider.value = videoPlayer.volume;
      updateVolumeIcon(videoPlayer.volume);
      break;
  }
});