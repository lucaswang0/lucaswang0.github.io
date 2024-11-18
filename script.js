let playlists = {};
let currentPlaylist;
let playlist = [];
let currentSongIndex = 0;
let audioPlayer;
let nowPlaying;
let progressControl;
let volumeControl;
let repeatControl;
let singlePlayControl;

document.addEventListener("DOMContentLoaded", function() {
    audioPlayer = document.getElementById('audioPlayer');
    nowPlaying = document.getElementById('nowPlaying');
    progressControl = document.getElementById('progressControl');
    volumeControl = document.getElementById('volumeControl');
    repeatControl = document.getElementById('repeatControl');
    singlePlayControl = document.getElementById('singlePlayControl');

    document.getElementById('prevButton').addEventListener('click', prevSong);
    document.getElementById('playButton').addEventListener('click', playSong);
    document.getElementById('pauseButton').addEventListener('click', pauseSong);
    document.getElementById('nextButton').addEventListener('click', nextSong);

    volumeControl.addEventListener('input', changeVolume);
    progressControl.addEventListener('input', changeProgress);
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', handleEnd);

//    loadPlaylistFiles(['audio/周华健_滚石精选集.json' , 'audio/周杰伦.json' ,'audio/轻音乐.json']);
    loadPlaylistFiles([ './audio/phigros.json', './audio/周华健_滚石精选集.json', './audio/周杰伦.json', './audio/轻音乐.json', './audio/phigros丨伴随欢快的节奏，舞动手指.json']);
});

function loadPlaylistFiles(urls) {
    let loadedFiles = 0;
    urls.forEach(url => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const playlistName = url.split('/').pop().split('.')[0];
                playlists[playlistName] = data;
                loadedFiles++;
                if (loadedFiles === urls.length) {
                    setupPlaylists();
                    currentPlaylist = Object.keys(playlists)[0];
                    playlist = playlists[currentPlaylist];
                    setupPlaylist();
                    loadSong(playlist[currentSongIndex]);
                }
            });
    });
}

function setupPlaylists() {
    const playlistFilesElement = document.getElementById('playlistFiles');
    playlistFilesElement.innerHTML = '';
    for (let list in playlists) {
        const li = document.createElement('li');
        li.textContent = list;
        li.addEventListener('click', () => {
            currentPlaylist = list;
            playlist = playlists[currentPlaylist];
            currentSongIndex = 0;
            setupPlaylist();
            loadSong(playlist[currentSongIndex]);
        });
        playlistFilesElement.appendChild(li);
    }
}

function setupPlaylist() {
    const playlistElement = document.getElementById('playlist');
    playlistElement.innerHTML = '';
    playlist.forEach((track, index) => {
        const li = document.createElement('li');
        li.textContent = track.split('/').pop();
        li.setAttribute('data-index', index);
        li.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(track);
        });
        playlistElement.appendChild(li);
    });
}

function loadSong(url) {
    audioPlayer.src = url;
    audioPlayer.play();
    setNowPlaying(url);
    updatePlaylistHighlight();
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    loadSong(playlist[currentSongIndex]);
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    loadSong(playlist[currentSongIndex]);
}

function playSong() {
    if (audioPlayer.paused) {
        audioPlayer.play();
    }
}

function pauseSong() {
    if (!audioPlayer.paused) {
        audioPlayer.pause();
    }
}

function handleEnd() {
    if (singlePlayControl.checked) {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    } else if (repeatControl.checked) {
        nextSong();
    } else if (currentSongIndex < playlist.length - 1) {
        nextSong();
    }
}

function changeVolume() {
    audioPlayer.volume = volumeControl.value;
}

function changeProgress() {
    const duration = audioPlayer.duration;
    const currentTime = duration * progressControl.value;
    audioPlayer.currentTime = currentTime;
}

function updateProgress() {
    const progress = audioPlayer.currentTime / audioPlayer.duration;
    progressControl.value = progress;
}

function setNowPlaying(trackName) {
    nowPlaying.textContent = '正在播放: ' + trackName.split('/').pop();
}

function updatePlaylistHighlight() {
    const playlistItems = document.querySelectorAll('#playlist li');
    playlistItems.forEach(item => item.classList.remove('playing'));
    const currentTrack = document.querySelector(`#playlist li[data-index="${currentSongIndex}"]`);
    if (currentTrack) {
        currentTrack.classList.add('playing');
    }
}

