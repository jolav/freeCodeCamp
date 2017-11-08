/* global xxx */
'use strict';
{
  let player = '';
  let cpu = '';
  let filled = [];
  let free = [];

  const createEvents = () => {
    document.getElementById('X').addEventListener('click', start);
    document.getElementById('O').addEventListener('click', start);
    document.getElementById('continue').addEventListener('click', newGame);
    let actions = document.getElementsByClassName('action');
    actions = Array.from(actions);
    actions.forEach(function (element) {
      element.addEventListener('click', move);
    });
  };

  const start = (e) => {
    player = e.target.id;
    cpu = (player === 'X' ? 'O' : 'X');
    filled = ['', '', '', '', '', '', '', '', ''];
    free = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    document.getElementById;
    document.getElementById('menu').style.display = 'none';
    document.getElementById('board').style.display = 'block';
  };

  const gameEnds = (user) => {
    for (let i = 0; i < free.length; i++) { // disable boxs on board
      document.getElementById(free[i]).removeEventListener(
        'click', move);
    }
    document.getElementById('result').style.display = 'block';
    if (user === 'tie') {
      document.getElementById('aftermath').innerText = 'TIE !';
    }
    if (user === cpu) {
      document.getElementById('aftermath').innerText = 'You LOSE !';
    }
    if (user === player) {
      document.getElementById('aftermath').innerText = 'You WIN !';
    }
    document.getElementById('continue').addEventListener('click', newGame);
  };

  const move = (e) => {
    const option = e.target.id;
    filled[option] = player;
    document.getElementById(option).removeEventListener('click', move);
    document.getElementById(option).innerText = player;
    adjustBoards();
    if (win(player)) {
      gameEnds(player);
    } else if (free.length === 0) {
      gameEnds('tie');
    } else {
      cpuMoves();
      if (win(cpu)) {
        gameEnds(cpu);
      }
    }
  };

  const win = (user) => {
    if (filled[0] === user) {
      if (filled[1] === user) {
        if (filled[2] === user) return true;
      }
      if (filled[3] === user) {
        if (filled[6] === user) return true;
      }
      if (filled[4] === user) {
        if (filled[8] === user) return true;
      }
    }
    if (filled[1] === user && filled[4] === user && filled[7] === user) return true;
    if (filled[2] === user) {
      if (filled[4] === user) {
        if (filled[6] === user) return true;
      }
      if (filled[5] === user) {
        if (filled[8] === user) return true;
      }
    }
    if (filled[3] === user && filled[4] === user && filled[5] === user) return true;
    if (filled[6] === user && filled[7] === user && filled[8] === user) return true;
  };

  const cpuMoves = () => {
    const cpuBox = free[Math.floor((Math.random() * free.length))];
    filled[cpuBox] = cpu;
    document.getElementById(cpuBox).removeEventListener('click', move);
    document.getElementById(cpuBox).innerText = cpu;
    adjustBoards();
  };

  const adjustBoards = () => {
    let aux = [];
    for (let i = 0; i < free.length; i++) {
      if (filled[free[i]] === '') {
        aux.push(free[i]);
      }
    }
    free = aux.slice();
  };

  const newGame = () => {
    location.reload();
  };

  window.addEventListener('load', createEvents);
}
