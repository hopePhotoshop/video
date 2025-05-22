const releaseId = 9600;

let episodes = [];
let currentEpisodeIndex = 0;

async function fetchEpisodes() {
  const res = await fetch(`https://api.anilibria.tv/v3/title?id=${releaseId}`);
  const data = await res.json();
  console.log(data);

  if (!data.player || typeof data.player.list !== "object") {
    alert("Ошибка загрузки серий. Проверьте ID релиза или структуру ответа API.");
    return;
  }

episodes = Object.values(data.player.list).map((ep) => ({
  title: `Серия ${ep.episode}`,
  qualityUrls: {
    ...(ep.hls.sd && {
      '480': ep.hls.sd.startsWith('http')
        ? ep.hls.sd
        : ep.hls.sd.startsWith('//')
          ? 'https:' + ep.hls.sd
          : ep.hls.sd.startsWith('/videos/')
            ? 'https://cache.libria.fun' + ep.hls.sd
            : ep.hls.sd
    }),
    ...(ep.hls.hd && {
      '720': ep.hls.hd.startsWith('http')
        ? ep.hls.hd
        : ep.hls.hd.startsWith('//')
          ? 'https:' + ep.hls.hd
          : ep.hls.hd.startsWith('/videos/')
            ? 'https://cache.libria.fun' + ep.hls.hd
            : ep.hls.hd
    }),
    ...(ep.hls.fhd && {
      '1080': ep.hls.fhd.startsWith('http')
        ? ep.hls.fhd
        : ep.hls.fhd.startsWith('//')
          ? 'https:' + ep.hls.fhd
          : ep.hls.fhd.startsWith('/videos/')
            ? 'https://cache.libria.fun' + ep.hls.fhd
            : ep.hls.fhd
    }),
  }
})).filter(ep => Object.keys(ep.qualityUrls).length > 0);

  renderPlaylist();
  loadEpisode(0);
}

function renderPlaylist() {
  const container = document.getElementById('playlist');
  if (!container) return;
  container.innerHTML = '';
  episodes.forEach((ep, idx) => {
    const btn = document.createElement('button');
    btn.textContent = ep.title;
    btn.className = 'playlist-episode' + (idx === currentEpisodeIndex ? ' active' : '');
    btn.onclick = () => loadEpisode(idx);
    container.appendChild(btn);
  });
}

function loadEpisode(index) {
  if (index < 0 || index >= episodes.length) return;
  currentEpisodeIndex = index;

  if (window.currentTime !== undefined) {
    window.currentTime = 0;
  }

  if (window.setQualityUrls) {
    window.setQualityUrls(episodes[index].qualityUrls);
  }
  renderPlaylist();
  const episodeTitle = document.getElementById('episodeTitle');
  if (episodeTitle) episodeTitle.textContent = episodes[index].title;
}

function setupEpisodeButtons() {
  document.getElementById('nextEpisode')?.addEventListener('click', () => {
    loadEpisode(currentEpisodeIndex + 1);
  });
  document.getElementById('prevEpisode')?.addEventListener('click', () => {
    loadEpisode(currentEpisodeIndex - 1);
  });
}

function renderDropdownEpisodes() {
  const list = document.getElementById('episodeDropdownList');
  if (!list) return;
  list.innerHTML = '';
  episodes.forEach((ep, idx) => {
    const btn = document.createElement('button');
    btn.textContent = `Серия ${idx + 1}`;
    btn.className = idx === currentEpisodeIndex ? 'active' : '';
    btn.onclick = () => {
      loadEpisode(idx);
      list.style.display = 'none';
    };
    list.appendChild(btn);
  });
}

function setupEpisodeDropdown() {
  const btn = document.getElementById('episodeDropdownBtn');
  const list = document.getElementById('episodeDropdownList');
  if (btn && list) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      renderDropdownEpisodes();
      list.style.display = list.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', (e) => {
      if (!btn.contains(e.target) && !list.contains(e.target)) {
        list.style.display = 'none';
      }
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setupEpisodeButtons();
    setupEpisodeDropdown();
    fetchEpisodes();
  });
} else {
  setupEpisodeButtons();
  setupEpisodeDropdown();
  fetchEpisodes();
}