/* global d3 topojson*/

const app = (function () {
  'use strict';
  /* code here */

  // https://bl.ocks.org/mbostock/4060606
  // https://bl.ocks.org/mbostock/3306362

  const url = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json';
  // const urlFile = './choropleth.json'
  const map = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json';
  // const mapFile = './map.json'

  function init () {
    console.log('Init Scatterplot Graph');
    doIt();
  }

  function doIt () {
    const margin = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    };
    const w = 960 - margin.left - margin.right;
    const h = 650 - margin.top - margin.bottom;

    const svg = d3.select('.choroplethMap')
      .attr('width', w)
      .attr('height', h);

    const path = d3.geoPath();

    const x = d3.scaleLinear()
      .domain([3, 75])
      .rangeRound([600, 860]);

    const color = d3.scaleThreshold()
      .domain(d3.range(3, 75, 9))
      .range(d3.schemeBlues[9]);

    const g = svg.append('g')
      .attr('class', 'key')
      .attr('transform', 'translate(0,40)');

    g.selectAll('rect')
      .data(color.range().map(function (d) {
        d = color.invertExtent(d);
        if (d[0] == null) d[0] = x.domain()[0];
        if (d[1] == null) d[1] = x.domain()[1];
        return d;
      }))
      .enter().append('rect')
      .attr('height', 8)
      .attr('x', function (d) { return x(d[0]); })
      .attr('width', function (d) { return x(d[1]) - x(d[0]); })
      .attr('fill', function (d) { return color(d[0]); });

    g.append('text')
      .attr('class', 'caption')
      .attr('x', x.range()[0])
      .attr('y', -6)
      .attr('fill', '#000')
      .attr('text-anchor', 'start')
      .attr('font-weight', 'bold')
      .text('Educational rate');

    g.call(d3.axisBottom(x)
      .tickSize(13)
      .tickFormat(function (x, i) { return i ? x : x + '%'; })
      .tickValues(color.domain()))
      .select('.domain')
      .remove();

    d3.queue()
      .defer(d3.json, map) // mapFile)
      .defer(d3.json, url) // urlFile)
      .await(ready);

    function ready (error, us, education) {
      if (error) throw error;

      let rateById = {};

      education.forEach(function (d) {
        rateById[d.fips] = +d.bachelorsOrHigher;
      });

      svg.append('g')
        .attr('class', 'counties')
        .selectAll('path')
        .data(topojson.feature(us, us.objects.counties).features)
        .enter().append('path')
        .attr('fill', function (d) {
          // console.log(d.id, ' -- ', color(rateById[d.id]))
          return color(rateById[d.id]);
        })
        .attr('d', path)
        .append('title')
        .text(function (d, i) {
          let result = education.filter(function (obj) {
            return obj.fips === d.id;
          });
          return result[0].area_name + '\n' + result[0].bachelorsOrHigher + '%';
        });

      svg.append('path')
        .attr('class', 'county-borders')
        .attr('d', path(topojson.mesh(us, us.objects.states, function (a, b) {
          return a !== b;
        })));
    }
  }

  return {
    init: init
  };
}());

window.addEventListener('load', app.init);
