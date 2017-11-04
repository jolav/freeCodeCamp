/* global Chart */
'use strict';
{
  const source = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';
  // const source = 'data.json'

  const init = () => {
    console.log('Init');
    getJsonData(source, showData);
  };

  const showData = (data) => {
    document.getElementById('notes').innerText = data.description;
    data = data.data;
    let times = [];
    let values = [];
    for (let i = 0; i < data.length; i++) {
      times[i] = data[i][0];
      values[i] = data[i][1];
    }
    const ctx = document.getElementById('barChart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: times,
        datasets: [{
          label: 'GPD',
          data: values
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        legend: {
          display: false
        },
        title: {
          display: false,
          text: 'USA Gross Domestic Product'
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              unit: 'year'
            }
          }]
        }
      }
    });
  };

  const getJsonData = (urlData, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) { // 4 = "DONE"
        if (xhr.status === 200) { // 200 ="OK"
          callback(JSON.parse(xhr.responseText));
        } else {
          console.log('Error: ' + xhr.status);
        }
      }
    };
    xhr.open('GET', urlData); // add false to synchronous request
    xhr.send();
  };

  window.addEventListener('load', init);
}
