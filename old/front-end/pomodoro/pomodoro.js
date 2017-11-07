'use strict';
{
  const sound = new Audio('/_assets/sounds/wakeup.mp3');
  let state = 'off';
  let mode = 'session';
  let timer;

  const createEvents = () => {
    let events = document.getElementsByClassName('action');
    events = Array.from(events);
    // controls = Object.values(controls)
    events.forEach(function (element) {
      element.addEventListener('click', action);
    });
  };

  const action = (e) => {
    const option = e.target.id;
    console.log(option);
    if (option === '7') {
      location.reload();
      return;
    }
    if (state === 'off') {
      switch (option) {
        case '1':
          configTime(option, -1);
          break;
        case '2':
          configTime(option, +1);
          break;
        case '3':
          configTime(option, -1);
          break;
        case '4':
          configTime(option, +1);
          break;
        case '5':
        case '6':
          start();
          break;
      }
    } else if (state === 'on') {
      start();
    }
  };

  const updateClock = () => {
    let now = document.getElementById('clock').innerText.split(':');
    let mins = parseInt(now[0]);
    let secs = parseInt(now[1]);
    if (secs === 0) {
      mins--;
      secs = 59;
    } else if (secs <= 10) {
      secs--;
      secs = '0' + secs;
    } else {
      secs--;
    }
    if (mins < 10) {
      mins = '0' + mins;
    }
    now = mins + ':' + secs;
    document.getElementById('clock').innerText = now;
    checkModeChange(now);
  };

  const checkModeChange = (now) => {
    if (now === '00:00') {
      sound.play();
      let aux;
      if (mode === 'session') {
        mode = 'break';
        aux = document.getElementById('breakMins').innerText;
        aux = aux + ':00';
        document.getElementById('clock').innerText = aux;
        document.getElementById('clock').style.color = 'lightgreen';
      } else {
        mode = 'session';
        aux = document.getElementById('sessionMins').innerText;
        aux = aux + ':00';
        document.getElementById('clock').innerText = aux;
        document.getElementById('clock').style.color = '#ddd';
      }
    }
  };

  const start = () => {
    if (state === 'off') {
      state = 'on';
      document.getElementById('5').style.display = 'none';
      document.getElementById('6').style.display = 'block';
      timer = setInterval(updateClock, 1000);
    } else {
      state = 'off';
      document.getElementById('5').style.display = 'block';
      document.getElementById('6').style.display = 'none';
      clearInterval(timer);
    }
  };

  const configTime = (option, how) => {
    let where = '';
    if (option === '1' || option === '2') {
      where = 'breakMins';
    } else if (option === '3' || option === '4') {
      where = 'sessionMins';
    }
    const old = document.getElementById(where).innerText;
    let result = parseInt(old) + how;
    if (result < 1) {
      result = '01';
    } else if (result < 10) {
      result = '0' + String(result);
    }
    if (where === 'sessionMins') {
      document.getElementById('clock').innerText = result + ':00';
    }
    document.getElementById(where).innerText = result;
  };

  window.addEventListener('load', createEvents);
}
