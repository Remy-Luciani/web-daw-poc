navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

var audioContext = new (window.AudioContext || webkitAudioContext)();
var audio = document.querySelector('audio');
var scConnectButton = document.querySelector('.sc-connect');

if (!navigator.getUserMedia) {
  throw new Error('getUserMedia is not supported.')
}

// Media recording

var mediaConfig = {
  audio: true,
  video: false
};

var mediaSuccess = function(stream) {
  audio.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
  audio.onloadedmetadata = function(e) {
    audio.play();
    audio.muted = 'true';
  };
  var source = audioContext.createMediaStreamSource(stream);
  source.connect(audioContext.destination);
};

var mediaError = function(err) {
  throw new Error(err.message);
};

navigator.getUserMedia(mediaConfig, mediaSuccess, mediaError);

// Soundcloud Authentication

var connectToSoundlcoud = function(event) {
  event.preventDefault();
  SC.connect().then(function() {
    return SC.get('/me');
  }).then(function(me) {
    alert('Hello, ' + me.username);
  });
}

scConnectButton.addEventListener('click', connectToSoundlcoud);
