function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  setTimeout(() => {
    errorMessage.style.display = "none";
  }, 3000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

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