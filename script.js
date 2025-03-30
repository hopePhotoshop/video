document.addEventListener("DOMContentLoaded", function () {
  const videoPlayer = document.getElementById('videoPlayer');
  const startIcon = document.getElementById('startIcon');
  const playPauseBtn = document.getElementById('playPause');
  const playPauseIcon = document.getElementById('playPauseIcon');
  const progressBar = document.getElementById('progressBar');
  const volumeIcon = document.getElementById("volumeIcon");
  const volumeSlider = document.getElementById('volumeSlider');
  const fullScreenBtn = document.getElementById('fullScreen');
  const settingsButton = document.getElementById('settingsButton');
  const settingsOptions = document.getElementById('settingsOptions');
  const mainMenu = document.getElementById('mainMenu');
  const qualityMenu = document.getElementById('qualityMenu');
  const speedMenu = document.getElementById('speedMenu');
  const qualityButtons = qualityMenu?.querySelectorAll('[data-quality]');
  const speedButtons = speedMenu?.querySelectorAll('[data-speed]');
  const backButtons = document.querySelectorAll('.back-button');
  const errorMessage = document.getElementById('errorMessage');
  const videoContainer = document.querySelector('.video-player-container');
  const progressTooltip = document.getElementById("progressTooltip");
  const currentTimeDisplay = document.getElementById('currentTime');
  const totalTimeDisplay = document.getElementById('totalTime');
  const pipButton = document.getElementById('pipButton');
  const controls = document.querySelector('.controls');
  let hls;
  let hideControlsTimeout;

 
  const qualityUrls = {
    '480': 'https://cache.libria.fun/videos/media/ts/9600/1/480/fee3de6f86af9ed0c52a8604b39c5329.m3u8',
    '720': 'https://cache.libria.fun/videos/media/ts/9600/1/720/70c1078491b5d9ada9d72f4b558d36ef.m3u8',
    '1080': 'https://cache.libria.fun/videos/media/ts/9600/1/1080/5dfc6533a7d9072b55429627aa3945c9.m3u8',
  };

  let currentQuality = "720"; 
  let currentTime = 0;
  let isUpdatingProgress = false;

  
  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    setTimeout(() => {
      errorMessage.style.display = "none";
    }, 3000);
  }

  function loadSource(quality) {
    currentTime = videoPlayer.currentTime;
    currentQuality = quality;
    const url = qualityUrls[quality];

    if (!url) {
      showError(`URL для качества ${quality} не найден.`);
      return;
    }

    if (hls) {
      hls.destroy();
      hls = null;
    }

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(videoPlayer);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoPlayer.addEventListener("loadedmetadata", () => {
          videoPlayer.currentTime = currentTime;
        }, { once: true });
      });
    } else if (videoPlayer.canPlayType("application/vnd.apple.mpegurl")) {
      videoPlayer.src = url;
      videoPlayer.addEventListener("loadedmetadata", () => {
        videoPlayer.currentTime = currentTime;
      }, { once: true });
    } else {
      showError("Ваш браузер не поддерживает HLS");
    }
  }

  loadSource(currentQuality);

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

  // обновление иконки громкости
  function updateVolumeIcon(volume) {
    if (volume === 0) {
      volumeIcon.className = "mdi mdi-volume-off";
    } else if (volume <= 0.3) {
      volumeIcon.className = "mdi mdi-volume-low";
    } else if (volume <= 0.7) {
      volumeIcon.className = "mdi mdi-volume-medium";
    } else {
      volumeIcon.className = "mdi mdi-volume-high";
    }
  }

  // формат времени
  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  // Обновление прогресса полосы воспроизведения
  function updateProgress() {
    if (videoPlayer.duration) {
      progressBar.value = (videoPlayer.currentTime / videoPlayer.duration) * 100;
    }
    if (isUpdatingProgress) {
      requestAnimationFrame(updateProgress);
    }
  }

  function updateBuffered() {
    const buffered = videoPlayer.buffered;
    if (buffered.length) {
      const bufferedEnd = buffered.end(buffered.length - 1); // Конец буферизации
      const duration = videoPlayer.duration;
      const bufferedWidth = (bufferedEnd / duration) * 100; // Процент буферизации
      progressBar.style.setProperty('--buffered-width', `${bufferedWidth}%`);
    }
  }
  
  // обновление буферизации
  videoPlayer.addEventListener('progress', updateBuffered);

  function startProgressUpdate() {
    if (!isUpdatingProgress) {
      isUpdatingProgress = true;
      updateProgress();
    }
  }

  function stopProgressUpdate() {
    isUpdatingProgress = false;
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

  // таймер
  function resetHideControlsTimeout() {
    clearTimeout(hideControlsTimeout);
    hideControlsTimeout = setTimeout(hideControls, 3000); 
  }

  // главное меню
  function showMainMenu() {
    mainMenu.style.display = "flex"; 
    qualityMenu.style.display = "none"; 
    speedMenu.style.display = "none"; 
  }

  // Подменю
  function showSubMenu(menu) {
    mainMenu.style.display = "none"; 
    menu.style.display = "flex"; 
  }

  document.addEventListener('mousemove', () => {
    showControls();
  });

  document.addEventListener('touchstart', () => {
    showControls();
  });

  videoPlayer.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      resetHideControlsTimeout();
    } else {
      showControls(); 
    }
  });

  showControls();

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
    videoPlayer.volume = volumeSlider.value;
    updateVolumeIcon(videoPlayer.volume);
  });

  volumeIcon.addEventListener("click", () => {
    videoPlayer.muted = !videoPlayer.muted;
    updateVolumeIcon(videoPlayer.muted ? 0 : videoPlayer.volume);
    volumeSlider.value = videoPlayer.muted ? 0 : videoPlayer.volume;
  });

  videoPlayer.addEventListener("loadedmetadata", () => {
    totalTimeDisplay.textContent = formatTime(videoPlayer.duration);
  });

  videoPlayer.addEventListener("timeupdate", () => {
    currentTimeDisplay.textContent = formatTime(videoPlayer.currentTime);
  });

  progressBar.addEventListener("mousemove", (e) => {
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = offsetX / rect.width;
    const videoTime = videoPlayer.duration * percentage;

    progressTooltip.textContent = formatTime(videoTime);
    progressTooltip.style.left = `${offsetX}px`;
    progressTooltip.style.top = `${rect.top - 30}px`;
    progressTooltip.style.display = "block";
  });

  progressBar.addEventListener("mouseleave", () => {
    progressTooltip.style.display = "none";
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

  // Кнопка Настроек
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
});