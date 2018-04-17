/* global */

const tracker = (function () {
  'use strict';

  // const baseUrl = 'http://localhost:3000/exercise/v1'
  const baseUrl = 'https://apis-v2-jolav.glitch.me/exercise/v1';

  const getAllUsersUrl = baseUrl + '/users';
  const addNewUserUrl = baseUrl + '/newUser';
  const getAllExercisesUrl = baseUrl + '/exercises';
  const addNewExerciseUrl = baseUrl + '/newExercise';

  function init () {
    console.log('Init Exercise Tracker');
    document.getElementById('addUser').addEventListener('click', addNewUser);
    document.getElementById('addExercise').addEventListener('click', addNewExercise);
    getAllUsers();
    getAllExercises();
  }

  function getAllUsers () {
    makeAjaxRequest(getAllUsersUrl, 'GET', null, null, function (data) {
      showUsersList(data);
    });
  }

  function getAllExercises () {
    makeAjaxRequest(getAllExercisesUrl, 'GET', null, null, function (data) {
      showExercisesList(data);
    });
  }

  function addNewUser (ev) {
    ev.preventDefault();
    const f = document.getElementsByTagName('form')[0];
    if (f.checkValidity()) {
      const newUsername = document.getElementById('newUsername').value;
      const params = `username=${newUsername}`;
      makeAjaxRequest(addNewUserUrl, 'POST', params, null, function (data) {
        showUsersList(data);
      });
    } else {
      document.getElementById('newUsername').validationMessage;
    }
  }

  function addNewExercise (ev) {
    ev.preventDefault();
    const f = document.getElementsByTagName('form')[1];
    if (f.checkValidity()) {
      const user = document.getElementById('user').value;
      const desc = document.getElementById('desc').value;
      const min = document.getElementById('min').value;
      const date = document.getElementById('date').value;
      const params = `user=${user}&desc=${desc}&min=${min}&date=${date}`;
      makeAjaxRequest(addNewExerciseUrl, 'POST', params, null, function (data) {
        showExercisesList(data);
      });
    } else {
      document.getElementById('desc').validationMessage;
    }
  }

  function showUsersList (data) {
    console.log('USERS =>', data);
    let html = `<table class="userList">
      <tr class="minor">
        <th>username</th>
        <th>id</th>
      </tr>`;
    for (let i in data) {
      // console.log(i, data[i]._id, data[i].username)
      html += `
      <tr class="user">
        <td>${data[i].username}</td> 
        <td>${data[i]._id}</td>
      </tr>`;
    }
    html += '</table>';
    document.getElementById('userList').innerHTML = html;
  }

  function showExercisesList (data) {
    console.log('EXERCISES => ', data);
    let html = `<table class="exerciseList">
    <tr class="minor">
      <th>username</th>
      <th>description</th>
      <th>minutes</th>
      <th>date</th>
    </tr>`;
    for (let i in data) {
      // console.log(i, data[i]._id, data[i].username)
      html += `
    <tr class="user">
      <td>${data[i].user}</td> 
      <td>${data[i].desc}</td>
      <td>${data[i].min}</td>
      <td>${data[i].date}</td>
    </tr>`;
    }
    html += '</table>';
    document.getElementById('exerciseList').innerHTML = html;
  }

  function showError (err) {
    const newUsername = document.getElementById('newUsername').value;
    alert(newUsername + ' => ' + err.err);
  }

  function makeAjaxRequest (url, action, params, sendCookie, callback) {
    console.log('URL =>', url);
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) { // 4 = "DONE"
        if (xhr.status === 200) { // 200 ="OK"
          if (action === 'GET' || action === 'POST') {
            try {
              callback(JSON.parse(xhr.responseText));
            } catch (e) {
              console.log('Error parsing Json => ', e);
              callback({});
            }
          } else {
            callback(xhr.status);
          }
        } else {
          console.log('Error: ' + xhr.status);
          showError(JSON.parse(xhr.responseText));
        }
      }
    };
    xhr.open(action, url);
    if (sendCookie) {
      xhr.withCredentials = true; // allow send cookies
    }
    if (action === 'GET') {
      xhr.send();
    } else if (action !== 'GET') {
      xhr.setRequestHeader('Content-Type',
        'application/x-www-form-urlencoded; charset=UTF-8');
      if (params) {
        xhr.send(params);
      } else {
        xhr.send();
      }
    // console.log('Request Sent')
    }
  }

  return {
    init: init
  };
}());

window.addEventListener('load', tracker.init);
