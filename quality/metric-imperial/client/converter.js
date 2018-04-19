/* global */

const converter = (function () {
  'use strict';
  /* code here */

  const baseUrl = 'https://metric-imperial-v2.glitch.me/v1/convert?input=';
  // const baseUrl = 'http://localhost:3000/v1/convert?input='

  function init () {
    console.log('Init metric-imperial converter');
    const convertBut = document.getElementsByClassName('convertBut')[0];
    convertBut.addEventListener('click', action);
    const input = document.getElementById('inputText');
    input.addEventListener('keyup', testEnter);
  }

  function testEnter (ev) {
    ev.preventDefault();
    if (ev.keyCode === 13) {
      document.getElementsByClassName('convertBut')[0].click();
    }
  }

  function action (e) {
    let quest = document.getElementsByClassName('inputText')[0].value;
    let urlData = baseUrl + quest;
    getAjaxData(urlData, showResponse);
  }

  function getAjaxData (urlData, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) { // 4 = "DONE"
        if (xhr.status === 200) { // 200 ="OK"
          callback(JSON.parse(xhr.responseText));
        } else {
          console.log('Error: ' + xhr.status);
          showError(xhr.response);
        }
      }
    };
    xhr.open('GET', urlData); // add false to synchronous request
    xhr.send();
  }

  function showError (err) {
    document.getElementById('jsonRes').innerHTML = err;
  }

  function showResponse (data) {
    data = JSON.stringify(data, null, ' ');
    document.getElementById('jsonRes').innerHTML = data;
  }

  return {
    init: init
  };
}());

window.addEventListener('load', converter.init);
