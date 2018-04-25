/* */

const app = (function () {
  'use strict';
  /* code here */

  const baseUrl = 'https://issue-tracker-v2.glitch.me/v1/project/';
  // const baseUrl = 'http://localhost:3000/v1/project/'

  function init () {
    console.log('Init issue');
    let actions = document.getElementsByClassName('actionBut');
    for (let i = 0; i < actions.length; i++) {
      actions[i].addEventListener('click', action);
    }
    makeAjaxRequest(baseUrl, 'GET', getList);
  // makeAjaxRequest(baseUrl + '8', 'GET', getOne)
  }

  function action (e) {
    let urlData = baseUrl;
    let t2 = document.getElementById('t2').value;
    let t31 = document.getElementById('t31').value;
    let t32 = document.getElementById('t32').value;
    let t33 = document.getElementById('t33').value;
    let t34 = document.getElementById('t34').value;
    let t41 = document.getElementById('t41').value;
    let t42 = document.getElementById('t42').value;
    let t43 = document.getElementById('t43').value;
    let t44 = document.getElementById('t44').value;
    let t45 = document.getElementById('t45').value;
    let close = document.getElementById('close').checked;
    let t5 = document.getElementById('t5').value;
    switch (e.target.id) {
      case 'b1':
        // console.log('List all issues')
        makeAjaxRequest(urlData, 'GET', getList);
        break;
      case 'b2':
        // console.log('List an issue')
        urlData += t2;
        if (t2 !== '' && t2 >= -1) {
          makeAjaxRequest(urlData, 'GET', getOne);
        }
        break;
      case 'b3':
        // console.log('Create Issue')
        if (t31 === '' || t32 === '' || t33 === '') {
          return;
        }
        urlData += '?title=' + t31;
        urlData += '&text=' + t32;
        urlData += '&createdBy=' + t33;
        if (t34 !== '') {
          urlData += '&assignedTo=' + t34;
        }
        console.log(urlData);
        makeAjaxRequest(urlData, 'POST', createOne);
        break;
      case 'b4':
        // console.log('Update an issue')
        if (t45 === '' || t45 < 1) {
          return;
        }
        if (t45 !== '') {
          urlData += '?issueID=' + t45;
        }
        if (t41 !== '') {
          urlData += '&title=' + t41;
        }
        if (t41 !== '') {
          urlData += '&text=' + t42;
        }
        if (t43 !== '') {
          urlData += '&createdBy=' + t43;
        }
        if (t44 !== '') {
          urlData += '&assignedTo=' + t44;
        }
        if (close) {
          urlData += '&close=true';
        }
        makeAjaxRequest(urlData, 'PUT', updateOne);
        break;
      case 'b5':
        // console.log('Delete an issue')
        if (t5 === '' || t5 < 1) {
          return;
        }
        urlData += '?id=' + t5;
        makeAjaxRequest(urlData, 'DELETE', deleteOne);
        break;
    }
  }

  function getList (issues) {
    let html = `<table class="issueList">
    <tr class="minor">
      <th>Issue ID</th>
      <th>Title</th>
    </tr>`;
    for (let issue of issues) {
      html += `
      <tr class="issue">
        <td>${issue._id}</td> 
        <td>${issue.title}</td>
      </tr>`;
    }
    html += '</table>';
    showResponse(html, 'jsonRes1');
  }

  function getOne (issue) {
    console.log(issue);
    if (issue.message !== undefined) {
      let html = '<div class="error">' + issue.message + '</div>';
      showResponse(html, 'jsonRes2');
      return;
    }
    let status = 'closed';
    if (issue.isOpen) {
      status = 'open';
    }
    let html = '<div class="issues">';
    html +=
      `<div class="issue">
<span> ${issue._id} - ${issue.title} (${status})</span><br>
<span>${issue.text}</span><br>
<span><b>Created by:</b> ${issue.author}<b> - Assigned to:</b> ${issue.assignee}</span><br>
<span><b>Created on:</b> ${issue.creationDate}<b> - Last Updated:</b> ${issue.latestUpdate}</span><br>
</div>`;
    html += '</div>';
    showResponse(html, 'jsonRes2');
  }

  function createOne (data) {
    if (data.message) {
      showResponse(data.message, 'jsonRes3');
    } else {
      makeAjaxRequest(baseUrl, 'GET', getList);
    }
  }

  function updateOne (data) {
    console.log('UPDATE=>', data);
    if (data.error) {
      showResponse(data.error, 'jsonRes4');
    }else {
      makeAjaxRequest(baseUrl, 'GET', getList);
    }
  }

  function deleteOne (data) {
    if (data.message) {
      showResponse(data.message, 'jsonRes5');
    }
    if (data.status === 200) {
      makeAjaxRequest(baseUrl, 'GET', getList);
    }
  }

  function getStatus (isOpen) {
    if (isOpen) {
      return 'open';
    }
    return 'closed';
  }

  function showResponse (data, place) {
    // data = JSON.stringify(data, null, ' ')
    document.getElementById(place).innerHTML = data;
  }

  function makeAjaxRequest (url, action, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) { // 4 = "DONE"
        if (xhr.status === 200) { // 200 ="OK"
          const data = JSON.parse(xhr.responseText);
          callback(data);
        } else {
          console.log('Error: ' + xhr.status);
        }
      }
    };
    xhr.open(action, url);
    if (action === 'GET') {
      xhr.send();
    } else if (action !== 'GET') {
      xhr.setRequestHeader('Content-Type',
        'application/x-www-form-urlencoded; charset=UTF-8');
      // xhr.send(params)
      xhr.send();
    }
  }

  return {
    init: init
  };
}());

window.addEventListener('load', app.init);
