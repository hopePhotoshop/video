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
const progressBarWrapper = document.querySelector('.progress-bar-wrapper');

let hls;
let hideControlsTimeout;
let hideProgressTimeout;
let isUpdatingProgress = false;
let currentQuality = "720";
window.currentTime = 0;

const qualityUrls = {
  '480': 'https://cache.libria.fun/videos/media/ts/9600/1/480/fee3de6f86af9ed0c52a8604b39c5329.m3u8',
  '720': 'https://cache.libria.fun/videos/media/ts/9600/1/720/70c1078491b5d9ada9d72f4b558d36ef.m3u8',
  '1080': 'https://cache.libria.fun/videos/media/ts/9600/1/1080/5dfc6533a7d9072b55429627aa3945c9.m3u8',
};