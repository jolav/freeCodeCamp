/* global xxx */
'use strict';
{
  let strict = 'off';
  let start = 'off';
  const pos = ['green', 'red', 'yellow', 'blue'];
  const colors = ['green', '#b20000', '#cccc00', 'blue'];
  const colors2 = ['chartreuse', '#ff0000', '#ffff00', 'cyan'];
  let cpu = []; // ['green', '#b20000', '#cccc00', 'blue']
  let cpuMoves = []; // [0, 1, 2, 3]
  let playerMoves = [];
  const audio1 = new Audio('/_assets/sounds/simon1.mp3');
  const audio2 = new Audio('/_assets/sounds/simon2.mp3');
  const audio3 = new Audio('/_assets/sounds/simon3.mp3');
  const audio4 = new Audio('/_assets/sounds/simon4.mp3');
  const audio = [audio1, audio2, audio3, audio4];

  const createEvents = () => {
    document.getElementById('strict').addEventListener('click', changeStatus);
    document.getElementById('start').addEventListener('click', changeStatus);
    document.getElementById('restart').addEventListener('click', reload);
  };

  const startRound = (restart) => {
    if (!restart) {
      addMovement();
    }
    animate(function (valor) {
      upBoard();
    });
  };

  const userResponse = (ev) => {
    turnOn(pos.indexOf(ev.target.id), 100);
    playerMoves.push(pos.indexOf(ev.target.id));
    document.getElementById('counter').textContent = playerMoves.length + 1;
    document.getElementById('round').textContent = cpuMoves.length;
    const success = playerMoves.every(function (element, index) {
      return element === cpuMoves[index];
    });
    if (!success) {
      playerMoves = [];
      downBoard();
      if (strict === 'off') {
        startRound(true);
      }
      if (strict === 'on') {
        location.reload();
      }
    }
    if (success && playerMoves.length === cpuMoves.length) {
      if (playerMoves.length >= 20) {
        alert('YOU WIN!');
        location.reload();
      }
      playerMoves = [];
      downBoard();
      document.getElementById('next').removeAttribute('hidden');
      document.getElementById('score').setAttribute('hidden', 'true');
      setTimeout(function () {
        document.getElementById('next').setAttribute('hidden', 'true');
        document.getElementById('score').removeAttribute('hidden');
        setTimeout(function () {
          startRound(false);
        }, 1000);
      }, 3000);
    }
  };

  const addMovement = () => {
    const rnd = colors[Math.floor((Math.random() * colors.length))];
    cpu.push(rnd);
    cpuMoves.push(colors.indexOf(rnd));
  };

  const animate = (cb) => {
    let i = 0;
    const interval = setInterval(function () {
      document.getElementById('counter').textContent = i + 1;
      document.getElementById('round').textContent = cpu.length;
      turnOn(colors.indexOf(cpu[i]), 500);
      i++;
      if (i >= cpu.length) {
        clearInterval(interval);
        cb('ANIMATION ENDS');
      }
    }, 1000);
  };

  const turnOn = (p, time) => {
    audio[p].play();
    document.getElementById(pos[p]).style.backgroundColor = colors2[p];
    setTimeout(function () {
      document.getElementById(pos[p]).style.backgroundColor = colors[p];
    }, time);
  };

  const upBoard = () => {
    document.getElementById('counter').textContent = playerMoves.length + 1;
    document.getElementById('round').textContent = cpuMoves.length;
    document.getElementsByClassName('board')[0].style.pointerEvents =
      'auto';
    const click = document.getElementsByClassName('action');
    for (let i = 0; i < click.length; i++) {
      click.item(i).addEventListener('click', userResponse);
    // console.log(click.item(i).id)
    }
  };

  const downBoard = () => {
    document.getElementsByClassName('board')[0].style.pointerEvents =
      'none';
  };

  const changeStatus = (ev) => {
    const target = ev.target.id;
    const x = document.getElementById(target);
    if (target === 'strict') {
      if (strict === 'off') {
        strict = 'on';
        x.style.borderLeft = '5px solid green';
        x.style.borderRight = '5px solid green';
      } else {
        strict = 'off';
        x.style.borderLeft = '5px solid red';
        x.style.borderRight = '5px solid red';
      }
    }
    if (target === 'start') {
      if (start === 'off') {
        start = 'on';
        x.style.borderLeft = '5px solid green';
        x.style.borderRight = '5px solid green';
        startRound(false);
      } else {
        start = 'off';
        x.style.borderLeft = '5px solid red';
        x.style.borderRight = '5px solid red';
        downBoard();
      }
    }
  };

  const reload = () => {
    location.reload();
  };

  window.addEventListener('load', createEvents);
}
