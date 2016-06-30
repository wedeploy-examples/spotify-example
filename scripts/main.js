// Sliders

var slider = document.getElementById('song-progress');

noUiSlider.create(slider, {
  start: [ 20 ],
  range: {
    min: [ 0 ],
    max: [ 100 ]
  }
});

var slider = document.getElementById('song-volume');

noUiSlider.create(slider, {
  start: [ 90 ],
  range: {
    min: [ 0 ],
    max: [ 100 ]
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

var playBtn = document.querySelector('.play');

playBtn.addEventListener('click', function() {
  if (audio.paused) {
    play();
  } else {
    pause();
  }
});

function play() {
  audio.play();

  playBtn.classList.add('ion-ios-pause');
  playBtn.classList.remove('ion-ios-play');
}

function pause() {
  audio.pause();

  playBtn.classList.add('ion-ios-play');
  playBtn.classList.remove('ion-ios-pause');
}

// Click Track

for (var i = 0; i < tracks.length; i++) {
  (function(j) {
    tracks[j].addEventListener('dblclick', function() {
      playTrack(j);
    });
  })(i);
}

function playTrack(index) {
  trackIndex = index;

  audio.pause();
  audio.src = tracks[trackIndex].dataset.url;

  play();
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

audio.addEventListener('durationchange', function(e) {
  duration.innerHTML = formatTime(e.target.duration);
});

// Current Time

var currentTime = document.querySelector('.current-time');

setInterval(function() {
  currentTime.innerHTML = formatTime(audio.currentTime);
}, 1000);

// Format Time

function formatTime(seconds) {
  seconds = Math.floor(seconds);

  minutes = Math.floor(seconds / 60);
  minutes = (minutes >= 10) ? minutes : '0' + minutes;

  seconds = Math.floor(seconds % 60);
  seconds = (seconds >= 10) ? seconds : '0' + seconds;

  return minutes + ':' + seconds;
}