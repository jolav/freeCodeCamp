/* */

const app = (function () {
  'use strict';
  /* code here */

  let active = 'none';
  let audio = [];
  let options = ['Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X', 'C'];

  function init () {
    console.log('Init Drum Machine');
    document.getElementById('drum').addEventListener('click', loadView);
    document.getElementById('piano').addEventListener('click', loadView);
    window.addEventListener('keypress', pressKey);
  }

  function loadView (e) {
    active = e.target.id;
    let drum = document.getElementsByClassName('drum')[0];
    let piano = document.getElementsByClassName('piano')[0];
    let container = document.getElementsByClassName('container')[0];
    if (active === 'drum') {
      drum.style.display = 'flex';
      piano.style.display = 'none';
      document.getElementById('drum').style.backgroundColor = 'burlywood';
      document.getElementById('piano').style.backgroundColor = 'inherit';
      container.style.background = 'url(/_assets2/img/drum.png) center no-repeat';
      container.style.backgroundSize = 'contain';
      loadDrumAudios();
    } else if (active === 'piano') {
      drum.style.display = 'none';
      piano.style.display = 'flex';
      document.getElementById('drum').style.backgroundColor = 'inherit';
      document.getElementById('piano').style.backgroundColor = 'burlywood';
      container.style.background = 'url(/_assets2/img/piano.png) center no-repeat';
      container.style.backgroundSize = 'contain';
      loadPianoAudios();
    }
  }

  function pressKey (e) {
    let valor = options.indexOf(e.key.toUpperCase());
    let pos = valor;
    if (active === 'piano') {
      pos = valor + 9;
    }
    if (valor !== -1) {
      document.getElementById(pos).addEventListener('transitionend',
        function () {
          document.getElementById(pos).classList.remove('pressed');
        });
      document.getElementById(pos).classList.add('pressed');
      audio[valor].play();
    }
  }

  function loadDrumAudios () {
    const pathToAudios = '/_assets2/sounds/drum/';
    const Q = new Audio(pathToAudios + 'clap.mp3');
    const W = new Audio(pathToAudios + 'hihat.mp3');
    const E = new Audio(pathToAudios + 'kick.mp3');
    const A = new Audio(pathToAudios + 'openhat.mp3');
    const S = new Audio(pathToAudios + 'boom.mp3');
    const D = new Audio(pathToAudios + 'ride.mp3');
    const Z = new Audio(pathToAudios + 'snare.mp3');
    const X = new Audio(pathToAudios + 'tom.mp3');
    const C = new Audio(pathToAudios + 'tink.mp3');
    audio = [Q, W, E, A, S, D, Z, X, C];
  }

  function loadPianoAudios () {
    const pathToAudios = '/_assets2/sounds/piano/';
    const Q = new Audio(pathToAudios + 'Chord_1.mp3');
    const W = new Audio(pathToAudios + 'Chord_2.mp3');
    const E = new Audio(pathToAudios + 'Chord_3.mp3');
    const A = new Audio(pathToAudios + 'Heater-1.mp3');
    const S = new Audio(pathToAudios + 'Heater-2.mp3');
    const D = new Audio(pathToAudios + 'Heater-3.mp3');
    const Z = new Audio(pathToAudios + 'Heater-4_1.mp3');
    const X = new Audio(pathToAudios + 'Heater-6.mp3');
    const C = new Audio(pathToAudios + 'Give_us_a_light.mp3');
    audio = [Q, W, E, A, S, D, Z, X, C];
  }

  return {
    init: init
  };
}());

window.addEventListener('load', app.init);
