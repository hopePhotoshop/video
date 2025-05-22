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
    const bufferedEnd = buffered.end(buffered.length - 1);
    const duration = videoPlayer.duration;
    const bufferedWidth = (bufferedEnd / duration) * 100;
    progressBar.style.setProperty('--buffered-width', `${bufferedWidth}%`);
  }
}

function startProgressUpdate() {
  if (!isUpdatingProgress) {
    isUpdatingProgress = true;
    updateProgress();
  }
}

function stopProgressUpdate() {
  isUpdatingProgress = false;
}

function showProgressBar() {
  progressBarWrapper.classList.remove('hide-progress');
  clearTimeout(hideProgressTimeout);
  hideProgressTimeout = setTimeout(() => {
    progressBarWrapper.classList.add('hide-progress');
  }, 2000);
}

['mousemove', 'touchstart'].forEach(event => {
  document.addEventListener(event, showProgressBar);
});
hideProgressTimeout = setTimeout(() => {
  progressBarWrapper.classList.add('hide-progress');
}, 2000);

videoPlayer.addEventListener('progress', updateBuffered);