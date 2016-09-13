// Authentication

var auth = WeDeploy.auth('auth.spotify.wedeploy.io');

if (!auth.currentUser) {
  document.location.href = '/login';
}

// Logout

var logout = document.querySelector('.logout');

logout.addEventListener('submit', function(e) {
  e.preventDefault();

  auth.signOut().then(function() {
    document.location.href = '/login';
  });
});

// Sliders

var volume = document.getElementById('song-volume');

noUiSlider.create(volume, {
  animate: false,
  start: [ 1 ],
  range: {
    min: [ 0 ],
    max: [ 1 ]
  }
});

volume.noUiSlider.on('update', function(values) {
  if (audio) {
    audio.volume = values[0];
  }
});

// Tooltips

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

// Viewport Heights

$(window).on('resize load', function(){
  var totalHeight = $(window).height();

  var headerHeight = $('.header').outerHeight();
  var footerHeight = $('.current-track').outerHeight();
  var playlistHeight = $('.playlist').outerHeight();
  var nowPlaying = $('.playing').outerHeight();

  var navHeight = totalHeight - (headerHeight + footerHeight + playlistHeight + nowPlaying);
  var artistHeight = totalHeight - (headerHeight + footerHeight);

  $('.navigation').css('height', navHeight);
  $('.artist').css('height', artistHeight);
  $('.social').css('height', artistHeight);
});

// Collapse Toggles

$('.navigation__list__header').on( 'click' , function() {
  $(this).toggleClass( 'active' );
});


// Media Queries

$(window).on('resize load', function(){
  if ($(window).width() <= 768) {
    $('.collapse').removeClass('in');
    $('.navigation').css('height' , 'auto');
    $('.artist').css('height' , 'auto');
  }
});

$(window).on('resize load', function(){
  if ($(window).width() > 768){
    $('.collapse').addClass('in');
  }
});

// Tracks

var tracks = document.querySelectorAll('[data-url]');

// Audio

var trackIndex = 0;

var audio = document.querySelector('audio');

audio.src = tracks[trackIndex].dataset.url;
audio.load();

// Play / Pause

var mainPlay = document.querySelector('.main-play');
var playBtn = document.querySelector('.play');

mainPlay.addEventListener('click', togglePlay);
playBtn.addEventListener('click', togglePlay);

function togglePlay() {
  if (audio.paused) {
    play();
  } else {
    pause();
  }
}

function play() {
  audio.play();

  mainPlay.textContent = 'Pause';

  playBtn.classList.add('ion-ios-pause');
  playBtn.classList.remove('ion-ios-play');
}

function pause() {
  audio.pause();

  mainPlay.textContent = 'Play';

  playBtn.classList.add('ion-ios-play');
  playBtn.classList.remove('ion-ios-pause');
}

// Click Track

var playingSongName = document.querySelector('.playing__song__name');
var playingArtImage = document.querySelector('.playing__art img');

for (var i = 0; i < tracks.length; i++) {
  (function(j) {
    tracks[j].addEventListener('click', function(e) {
      playTrack(e.target, j);
      updateTrackMetadata(e.target);
    });
  })(i);
}

function playTrack(target, index) {
  trackIndex = index;

  audio.pause();
  audio.src = tracks[trackIndex].dataset.url;

  play();
}

function updateTrackMetadata(target) {
  var trackTitle = target.querySelector('.title').innerHTML;
  var trackImage = target.querySelector('.track__art img');

  playingSongName.innerHTML = trackTitle;

  if (trackImage) {
    playingArtImage.src = trackImage.src;
  }
}

// Skip Tracks

var backward = document.querySelector('.backward');
var forward = document.querySelector('.forward');

backward.addEventListener('click', function() {
  if (trackIndex === 0) {
    trackIndex = tracks.length;
  }

  trackIndex--;

  audio.pause();
  audio.src = tracks[trackIndex].dataset.url;

  play();
});

forward.addEventListener('click', function() {
  if (trackIndex === tracks.length -1) {
    trackIndex = 0;
  }

  trackIndex++;

  audio.pause();
  audio.src = tracks[trackIndex].dataset.url;

  play();
});

// Duration

var duration = document.querySelector('.duration');

var progress = document.querySelector('#song-progress');

audio.addEventListener('durationchange', function(e) {
  if (progress.noUiSlider) {
    progress.noUiSlider.destroy();
  }

  noUiSlider.create(progress, {
    animate: false,
    start: [ 0 ],
    range: {
      min: [ 0 ],
      max: [ e.target.duration ]
    }
  });

  progress.noUiSlider.on('start', function(e) {
    audio.removeEventListener('timeupdate', update);
  });

  progress.noUiSlider.on('end', function(e) {
    audio.addEventListener('timeupdate', update);
  });

  progress.noUiSlider.on('slide', function(e) {
    currentTime.innerHTML = formatTime(e);
  });

  progress.noUiSlider.on('change', function(e) {
    audio.currentTime = e;
  });

  duration.innerHTML = formatTime(e.target.duration);
});

// Current Time

var currentTime = document.querySelector('.current-time');

audio.addEventListener('timeupdate', update);

function update() {
  currentTime.innerHTML = formatTime(audio.currentTime);
  progress.noUiSlider.set(audio.currentTime);
}

// Format Time

function formatTime(seconds) {
  seconds = Math.floor(seconds);

  minutes = Math.floor(seconds / 60);
  minutes = (minutes >= 10) ? minutes : '0' + minutes;

  seconds = Math.floor(seconds % 60);
  seconds = (seconds >= 10) ? seconds : '0' + seconds;

  return minutes + ':' + seconds;
}