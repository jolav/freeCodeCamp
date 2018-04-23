/*  */

const app = (function () {
  'use strict';
  /* code here */

  const baseUrl = 'https://personal-library-v2.glitch.me/v1/books/';
  // const baseUrl = 'http://localhost:3000/v1/books/'

  function init () {
    console.log('Init metric');
    let actions = document.getElementsByClassName('actionBut');
    for (let i = 0; i < actions.length; i++) {
      actions[i].addEventListener('click', action);
    }
    getAllBooks();
  }

  function action (e) {
    let urlData = baseUrl;
    const input2 = document.getElementById('t2').value;
    const input3 = document.getElementById('t3').value;
    const input41 = document.getElementById('t41').value;
    const input42 = document.getElementById('t42').value;
    const input6 = document.getElementById('t6').value;
    switch (e.target.id) {
      case 'b1':
        // console.log(urlData)
        makeAjaxRequest(urlData, 'GET', showResponse1);
        break;
      case 'b2':
        if (input2 !== '') { // && input >= 0) {
          urlData += input2;
          // console.log(urlData)
          makeAjaxRequest(urlData, 'GET', showResponse2);
        }
        break;
      case 'b3':
        if (input3 !== '') { // && input >= 0) {
          urlData += '?title=' + input3;
          // console.log(urlData)
          makeAjaxRequest(urlData, 'POST', getAllBooks);
        }
        break;
      case 'b4':
        if (input41 !== '' && input42 !== '') {
          urlData += + input41 + '?comment=' + input42;
          // console.log(urlData)
          makeAjaxRequest(urlData, 'POST', getAllBooks);
        }
        break;
      case 'b5':
        // console.log(urlData)
        makeAjaxRequest(urlData, 'DELETE', getAllBooks);
        break;
      case 'b6':
        if (input6 > 0) { // && input >= 0) {
          urlData += input6;
          // console.log(urlData)
          makeAjaxRequest(urlData, 'DELETE', getAllBooks);
        }
        break;
    }
  }

  function makeAjaxRequest (url, action, callback) {
    console.log(action, ' - ', url);
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) { // 4 = "DONE"
        if (xhr.status === 200) { // 200 ="OK"
          if (action === 'GET') {
            const data = JSON.parse(xhr.responseText);
            callback(data);
          } else {
            callback();
          }
        }  else {
          console.log('Error: ' + xhr.status);
          showError(JSON.parse(xhr.responseText));
        }
      }
    };
    xhr.open(action, url);
    if (action === 'GET') {
      xhr.send();
    } else if (action !== 'GET') {
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      // xhr.setRequestHeader('Content-Type', 'application/json')
      // xhr.send(params)
      xhr.send();
    }
  }

  function getAllBooks () {
    makeAjaxRequest(baseUrl, 'GET', showResponse1);
  }

  function showError (err) {
    const data = JSON.stringify(err.error, null, ' ');
    document.getElementById('jsonRes2').innerHTML = data;
  }

  function none () {
    // console.log('none')
  }
  function showResponse1 (data) {
    // showResponse(data + data, 'jsonRes1')
    let html = `<table class="bookList">
      <tr class="minor">
        <th>bookID</th>
        <th>Title</th>
      </tr>`;
    for (let i in data) {
      // console.log(i, data[i]._id, data[i].username)
      html += `
      <tr class="book">
        <td>${data[i]._id}</td> 
        <td>${data[i].title}</td>
      </tr>`;
    }
    html += '</table>';
    document.getElementById('bookList').innerHTML = html;
  }
  function showResponse2 (data) {
    showResponse(data, 'jsonRes2');
  }

  function showResponse (data, place) {
    data = JSON.stringify(data, null, ' ');
    document.getElementById(place).innerHTML = data;
  }

  return {
    init: init
  };
}());

window.addEventListener('load', app.init);
