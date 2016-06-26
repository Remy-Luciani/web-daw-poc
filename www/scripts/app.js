navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

var audioContext = new (window.AudioContext || webkitAudioContext)();
var scConnectButton = document.querySelector('.sc-connect');
var record = document.querySelector('#record-button');
var stop = document.querySelector('#stop-button');

if (!navigator.getUserMedia) {
  throw new Error('getUserMedia is not supported.')
}

// Media recording

var mediaConfig = {
  audio: true
};

var mediaSuccess = function(stream) {
  var source = audioContext.createMediaStreamSource(stream);
  var recordedChunks = [];
  var mediaRecorder = new MediaRecorder(stream);

  record.addEventListener('click', function() {
    mediaRecorder.start();
    record.style.background = "red";
    record.style.color = "white";
  });

  stop.addEventListener('click', function() {
    mediaRecorder.stop();
    record.style.background = "";
    record.style.color = "";
  });

  mediaRecorder.addEventListener('dataavailable', function(event) {
    recordedChunks.push(event.data);
  });

  mediaRecorder.addEventListener('stop', function(event) {
      var blob = new Blob(recordedChunks, {
        type: 'audio/ogg'
      });
      recordedChunks = [];
      var url = window.URL.createObjectURL(blob);
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';
      a.href = url;
      a.download = 'test.ogg';
      a.click();
      window.URL.revokeObjectURL(url);
  });
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
