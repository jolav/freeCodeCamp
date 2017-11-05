/* global d3 */
'use strict';
{
  const source = 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json';

  const init = () => {
    getJsonData(source, showData);
  };

  const showData = (dataset) => {
    // console.log(dataset.nodes)
    var margin = {
      top: 80,
      right: 50,
      bottom: 20,
      left: 50
    };
    var w = 960 - margin.left - margin.right;
    var h = 800 - margin.top - margin.bottom;

    var svg = d3.select('.flagsMap')
      .attr('width', w + margin.left + margin.right)
      .attr('height', h + margin.top + margin.bottom);

    var force = d3.layout.force()
      .nodes(dataset.nodes)
      .links(dataset.links)
      .size([w, h])
      .linkDistance([50])
      .charge([-100])
      .start();

    var borders = svg.selectAll('borders')
      .data(dataset.links)
      .enter()
      .append('line')
      .attr('class', 'boundary');

    var countries = svg.select('.countries')
      .data(dataset.nodes)
      .enter()
      .append('img')
      .attr('class', function (d) {
        // console.log(d.code)
        return 'flag flag-' + d.code;
      })
      .call(force.drag)
      .on('mouseover', function (d) {
        // d3.select(this)
        //  .style('fill', 'white')
        d3.select('#tooltip')
          .style('left', (d3.event.pageX - 30) + 'px')
          .style('top', (d3.event.pageY - 60) + 'px')
          .select('#country')
          .text(d.country);
        d3.select('#tooltip').classed('hidden', false);
      })

      .on('mouseout', function (d) {
        d3.select('#tooltip').classed('hidden', true);
      });

    force.on('tick', function () {
      borders
        .attr('x1', function (d) {
          return d.source.x + margin.left;
        })
        .attr('y1', function (d) {
          return d.source.y + margin.top;
        })
        .attr('x2', function (d) {
          return d.target.x + margin.left;
        })
        .attr('y2', function (d) {
          return d.target.y + margin.top;
        });

      countries
        .style('left', function (d) {
          return d.x + margin.left + 0 + 'px';
        })
        .style('top', function (d) {
          return d.y + margin.top - 0 + 'px';
        });
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
