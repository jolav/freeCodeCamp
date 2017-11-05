/* global d3 topojson*/
'use strict';
{
  const map = 'https://raw.githubusercontent.com/d33con/d3-meteorite-strike-map/master/data/world-110m.json';
  const source = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json';

  const init = () => {
    getJsonData(source, showData);
  };

  const showData = (dataset) => {
    dataset = dataset.features;
    // console.log(dataset)

    var margin = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    };
    var w = 960 - margin.left - margin.right;
    var h = 500 - margin.top - margin.bottom;

    var parseYear = d3.time.format('%Y');

    var projection = d3.geo.mercator()
      .center([0, 30])
      .scale(150)
      .rotate([0, 0]);

    var svg = d3.select('.meteoriteMap') // .append('svg')
      .attr('width', w)
      .attr('height', h);

    var path = d3.geo.path()
      .projection(projection);

    var g = svg.append('g');

    var scale = d3.scale.pow().exponent(0.5)
      .domain(d3.extent(dataset, function (d) {
        return d.properties.mass / Math.PI;
      }))
      .range([1, 25]);

    d3.json(map, function (error, dataMap) {
      g.selectAll('path')
        .data(topojson.feature(dataMap, dataMap.objects.countries)
          .features)
        .enter()
        .append('path')
        .attr('d', path);
    });

    // draw meteorite map
    var meteorites = svg.append('g').selectAll('path')
      .data(dataset)
      .enter()
      .append('path')
      .attr('class', 'landing')
      .attr('d', path.pointRadius(function (d) {
        return scale(d.properties.mass);
      }))
      .on('mouseover', function (d) {
        var year = new Date(d.properties.year).getFullYear();
        var nameYear = d.properties.name + ' ,' + year;
        var mass = d.properties.mass + ' kg';
        var lat = d.geometry.coordinates[1].toFixed(4);
        var lon = d.geometry.coordinates[0].toFixed(4);
        var location = 'Lat :' + lat + ' - Long :' + lon;
        d3.select('#tooltip')
          .style('left', (d3.event.pageX - 100) + 'px')
          .style('top', (d3.event.pageY - 110) + 'px')
          .select('#value1')
          .text(nameYear);
        d3.select('#tooltip')
          .select('#value2')
          .text(mass);
        d3.select('#tooltip')
          .select('#value3')
          .text(location);
        d3.select('#tooltip').classed('hidden', false);
      })
      .on('mouseout', function (d) {
        d3.select('#tooltip').classed('hidden', true);
      });

    // zoom and pan
    var zoom = d3.behavior.zoom()
      .size([w, h])
      .scaleExtent([0.5, 5])
      .on('zoom', function () {
        svg.selectAll('g')
          .attr('transform', 'translate(' + d3.event.translate.join(',') + ')scale(' + d3.event.scale + ')');
      });

    svg.call(zoom);
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
