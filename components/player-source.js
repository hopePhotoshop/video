window.setQualityUrls = function(newUrls) {
  Object.keys(qualityUrls).forEach(key => delete qualityUrls[key]);
  Object.assign(qualityUrls, newUrls);
  loadSource(currentQuality);
};

function loadSource(quality) {
  currentQuality = quality;
  const url = qualityUrls[quality];

  if (!url) {
    showError(`Для выбранного качества (${quality}p) нет ссылки на видео.`);
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
        videoPlayer.currentTime = window.currentTime;
      }, { once: true });
    });
    hls.on(Hls.Events.ERROR, (event, data) => {
      if (data.type === 'networkError' || data.details === 'manifestLoadError') {
        showError('Не удалось загрузить видеофайл. Возможно, серия или качество недоступны.');
      }
    });
  } else if (videoPlayer.canPlayType("application/vnd.apple.mpegurl")) {
    videoPlayer.src = url;
    videoPlayer.addEventListener("loadedmetadata", () => {
      videoPlayer.currentTime = window.currentTime;
    }, { once: true });
  } else {
    showError("Ваш браузер не поддерживает HLS");
  }
}

loadSource(currentQuality);