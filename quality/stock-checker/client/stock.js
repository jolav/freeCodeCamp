/* global */

const app = (function () {
  'use strict';
  /* code here */

  const baseUrl = 'https://stock-checker-v2.glitch.me/v1/stock-prices?stock=';
  // const baseUrl = 'http://localhost:3000/v1/stock-prices?stock='

  function init () {
    console.log('Init metric');
    let buttons = document.getElementsByClassName('convertBut');
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].index = i;
      buttons[i].addEventListener('click', action);
    }
  }

  function action (e) {
    let index = e.target.index;
    let quest = document.getElementsByClassName('inputText')[index].value;
    let urlData = baseUrl + quest;
    if (document.getElementById('like1').checked) {
      urlData += '&like=true';
    }
    if (index === 1) { // to take data from 2nd input 
      urlData += '&stock=' + document.getElementsByClassName('inputText')[2].value;
      if (document.getElementById('like2').checked) {
        urlData += '&like=true';
      }
    }
    // console.log(urlData)
    getAjaxData(urlData, showResponse, index);
  }

  function getAjaxData (urlData, callback, index) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) { // 4 = "DONE"
        if (xhr.status === 200) { // 200 ="OK"
          callback(JSON.parse(xhr.responseText), index);
        } else {
          console.log('Error: ' + xhr.status);
          showResponse(JSON.parse(xhr.response), index);
        }
      }
    };
    xhr.open('GET', urlData); // add false to synchronous request
    xhr.send();
  }

  function showResponse (data, index) {
    data = JSON.stringify(data, null, ' ');
    let inputText;
    if (index === 1) {
      inputText = 2;
    } else {
      inputText = 1;
    }
    document.getElementById('jsonRes' + inputText).innerHTML = data;
  }

  return {
    inicio: init
  };
}());

window.addEventListener('load', app.inicio);
