/* global Chart */
'use strict';
{
  const source = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
  let dataset = [];
  let labels = [];

  const init = () => {
    console.log('Init');
    getJsonData(source, showData);
  };

  var pointBackgroundColors = [];

  const showData = (data) => {
    dataset = data;
    let aux = {};
    let res = [];
    for (let i = 0; i < data.length; i++) {
      aux = {};
      aux.x = data[i].Seconds;
      aux.y = data[i].Place;
      aux.title = dataset[i].Name + '(' + dataset[i].Nationality + ')';
      res.push(aux);
    }

    const ctx = document.getElementById('scatterplotChart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'scatter',
      // data: data,
      data: {
        datasets: [{
          // label: labels, // = legend ???????
          data: res,
          pointBackgroundColor: pointBackgroundColors,
          radius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        legend: {
          display: false
        },
        title: {
          display: true,
          text: "The 35 fastest times ascending Alpe d'Huez. Normalized to a distance of 13.8km"
        },
        scales: {
          yAxes: [{
            ticks: {
              reverse: true
            },
            scaleLabel: {
              display: true,
              labelString: 'PLACE'
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'TIME(MINUTES)'
            },
            ticks: {
              reverse: true,
              callback: function (value) {
                let mins = Math.floor(value / 60);
                let secs = value % 60;
                if (secs === 0) secs = '00';
                const sol = mins + ':' + secs;
                return (sol);
              }
            }
          }]
        },
        tooltips: {
          backgroundColor: 'lightblue',
          callbacks: {
            label: function (tooltipItem, d) {
              for (let i = 0; i < dataset.length; i++) {
                if (tooltipItem.yLabel === dataset[i].Place) {
                  let res1 = `${dataset[i].Name} (${dataset[i].Nationality})`;
                  let res2 = `Year: ${dataset[i].Year} --- Time: ${dataset[i].Time} min`;
                  if (dataset[i].Doping) {
                    let res3 = `${dataset[i].Doping}`;
                    return new Array(res1, res2, res3);
                  } else {
                    return new Array(res1, res2);
                  }
                }
              }
            },
            labelTextColor: function (tooltipItem, chart) {
              return '#404040';
            }
          }
        },
        elements: {
          line: {
            tension: 0, // disables bezier curves
          }
        },
        animation: {
          duration: 0, // general animation time,
          // duration: 1,
          onComplete: function () {
            var chartInstance = this.chart;
            var ctx = chartInstance.ctx;
            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';

            this.data.datasets.forEach(function (dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function (bar, index) {
                var data = dataset.data[index];
                console.log(data);
                ctx.fillText(data.title, bar._model.x + 60, bar._model.y + 5);
              });
            });
          }
        },
        hover: {
          animationDuration: 0, // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
      }
    });
    // chart.data.datasets[0].data[i].x > 2280
    for (let i = 0; i < chart.data.datasets[0].data.length; i++) {
      if (dataset[i].Doping) {
        pointBackgroundColors.push('red');
      } else {
        pointBackgroundColors.push('green');
      }
      labels.push(dataset[i].Name + '(' + dataset[i].Nationality + ')');
    }
    chart.update();
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
