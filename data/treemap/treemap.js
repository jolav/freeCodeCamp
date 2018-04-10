/*jshint node: true */

const app = (function () {
  'use strict';
  /* code here */

  // https://bl.ocks.org/mbostock/4063582
  // https://codepen.io/freeCodeCamp/full/KaNGNR

  const kickUrl = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json';
  const movieUrl = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json';
  const gamesUrl = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json';
  const file = './treemap.json';
  const dataset = [kickUrl, movieUrl, gamesUrl];
  let url = '';
  let active = '';

  function init () {
    console.log('Init Treemap Diagram');
    createClickActions();
    selectRndDataSet();
    doIt();
  }

  function doIt () {
    console.log('DOING ', url);

    const svg = d3.select('#treemap'),
      width = +svg.attr('width'),
      height = +svg.attr('height');

    const fader = function (color) {
      return d3.interpolateRgb(color, '#fff')(0.2);
    };
    const color = d3.scaleOrdinal(d3.schemeCategory20.map(fader));
    const format = d3.format(',d');

    const treemap = d3.treemap()
      .size([width, height])
      .paddingInner(1)
      .round(true)
      .paddingInner(1);

    d3.json(url, function (error, data) {
      if (error) throw error;

      const root = d3.hierarchy(data)
        .eachBefore(function (d) {
          d.data.id = (d.parent ? d.parent.data.id + '.' : '') + d.data.name;
        })
        .sum(sumBySize)
        .sort(function (a, b) {
          return b.height - a.height || b.value - a.value;
        });

      treemap(root);

      const cell = svg.selectAll('g')
        .data(root.leaves())
        .enter().append('g')
        .attr('class', 'group')
        .attr('transform', function (d) {
          return 'translate(' + d.x0 + ',' + d.y0 + ')';
        });

      const tile = cell.append('rect')
        .attr('id', function (d) { return d.data.id; })
        .attr('class', 'tile')
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .attr('data-name', function (d) {
          return d.data.name;
        })
        .attr('data-category', function (d) {
          return d.data.category;
        })
        .attr('data-value', function (d) {
          return d.data.value;
        })
        .attr('fill', function (d) {
          return color(d.data.category);
        })
        .on('mouseover', function (d) {
          d3.select(this)
            .style('opacity', 0.5);
          d3.select('#tooltip')
            .select('#name')
            .text(d.data.name);
          d3.select('#tooltip')
            .style('left', d3.event.pageX - 10 + 'px')
            .style('top', d3.event.pageY - 40 + 'px')
            .select('#category')
            .text(d.data.category);
          d3.select('#tooltip')
            .select('#value')
            .text(d.data.value);
          d3.select('#tooltip').classed('hidden', false);
        })

        .on('mouseout', function (d) {
          d3.select(this)
            .style('opacity', 1);
          d3.select('#tooltip').classed('hidden', true);
        });

      cell.append('text')
        .attr('class', 'tile-text')
        .selectAll('tspan')
        .data(function (d) {
          return d.data.name.split(/(?=[A-Z][^A-Z])/g);
        })
        .enter().append('tspan')
        .attr('x', 4)
        .attr('y', function (d, i) { return 13 + i * 10; })
        .text(function (d) { return d; });

      // LEGENDS

      var categories = root.leaves().map(function (nodes) {
        return nodes.data.category;
      });
      categories = categories.filter(function (category, index, self) {
        return self.indexOf(category) === index;
      });
      var legend = d3.select('#legend');
      var legendWidth = +legend.attr('width');
      var cols = 3;

      var legendElem = legend
        .append('g')
        .attr('transform', 'translate(60)')
        .selectAll('g')
        .data(categories)
        .enter().append('g')
        .attr('transform', function (d, i) {
          return 'translate(' +
            ((i % cols) * 150) + ',' + ((Math.floor(i / cols)) * 20 + (5 * (Math.floor(i / cols)))) + ')';
        });

      legendElem.append('rect')
        .attr('width', 20)
        .attr('height', 20)
        .attr('class', 'item')
        .attr('fill', function (d) {
          return color(d);
        });

      legendElem.append('text')
        .attr('x', 25)
        .attr('y', 15)
        .text(function (d) {
          return d;
        });
    });
  }

  function sumBySize (d) {
    return d.value;
  }

  function createClickActions () {
    kick.addEventListener('click', changeData);
    movie.addEventListener('click', changeData);
    games.addEventListener('click', changeData);
  }

  function changeData (e) {
    active = e.target.id;
    switch (active) {
      case 'kick':
        url = dataset[0];
        break;
      case 'movie':
        url = dataset[1];
        break;
      case 'games':
        url = dataset[2];
        break;
    }
    configMenu();
    doIt();
  }

  function selectRndDataSet () {
    const random = Math.floor(Math.random() * 3);
    url = dataset[random];
    switch (random) {
      case 0:
        active = 'kick';
        break;
      case 1:
        active = 'movie';
        break;
      case 2:
        active = 'games';
        break;
    }
    configMenu();
  }

  function configMenu () {
    kick.style.backgroundColor = '#fafafa';
    movie.style.backgroundColor = '#fafafa';
    games.style.backgroundColor = '#fafafa';
    document.getElementById(active).style.backgroundColor = '#5bc0de';
    document.getElementById('legend').innerHTML = '';
    document.getElementById('treemap').innerHTML = '';

    switch (active) {
      case 'kick':
        info.innerText = 'Top 100 Most Pledged Kickstarter Campaigns Grouped By Category';
        break;
      case 'movie':
        info.innerText = 'Top 100 Highest Grossing Movies Grouped By Genre';
        break;
      case 'games':
        info.innerText = 'Top 100 Most Sold Video Games Grouped by Platform';
        break;
    }
  }

  return {
    init: init
  };
}());

window.addEventListener('load', app.init);
