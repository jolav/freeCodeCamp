/* global Chart d3 */
'use strict';
{
  const source = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';

  const init = () => {
    getJsonData(source, showData);
  };

  const showData = (dataset) => {

    const getColor = (d) => {
      const temp = (d.variance + baseT).toFixed(3);
      return colorScale(temp);
    };

    const baseT = dataset.baseTemperature;
    dataset = dataset.monthlyVariance;

    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const colors = ['#004c00', '#008000', '#329932', '#66b266', '#99cc99',
      '#cce5cc', '#ffdae0', '#ff9999', '#ff6666', '#ff3232', '#ff0000',
      '#990000'
    ];

    const margin = {
      top: 10,
      right: 41,
      bottom: 80,
      left: 130
    };
    const w = 960 - margin.left - margin.right;
    const h = 450 - margin.top - margin.bottom;

    const minYear = new Date(d3.min(dataset, function (d) {
      return d.year;
    }), 0);
    const maxYear = new Date(d3.max(dataset, function (d) {
      return d.year;
    }), 0);
    const parseYear = d3.timeFormat('%Y');
    const numYears = parseYear(maxYear) - parseYear(minYear) + 1;

    const minVariance = d3.min(dataset, function (d) {
      return d.variance;
    });
    const maxVariance = d3.max(dataset, function (d) {
      return d.variance;
    });

    const yScale = d3.scaleLinear()
      .domain([0, months.length])
      .range([0, h]);

    const yAxis = d3.axisLeft(yScale)
      .tickFormat(function (d, i) {
        return months[i];
      });

    const xScale = d3.scaleTime()
      .domain([minYear, maxYear])
      .range([0, w]);

    const xAxis = d3.axisBottom(xScale)
      .ticks(10);

    const colorScale = d3.scaleQuantize()
      .domain([minVariance + baseT, maxVariance + baseT])
      .range(colors);

    const svg = d3.select('.heatMap')
      .attr('width', w + margin.left + margin.right)
      .attr('height', h + margin.top + margin.bottom)
      .attr('class', 'heatMap')
      // .style('background', '#fafafa')
      .append('g')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top +
        ')');

    svg.selectAll('.bar')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('x', function (d) {
        return (d.year - parseYear(minYear)) * (w / numYears);
      })
      .attr('y', function (d) {
        // return yScale(d.month - 1) // same as below
        return (d.month - 1) * (h / months.length);
      })
      .attr('width', w / numYears)
      .attr('height', h / months.length)
      .attr('fill', function (d) {
        return getColor(d);
      })
      .on('mouseover', function (d) {
        const date = months[d.month - 1] + ' - ' + d.year;
        const temp = 'Average : ' + (d.variance + baseT).toFixed(3) + ' ºC';
        const variation = 'Variance : ' + d.variance.toFixed(3) + ' ºC';
        d3.select('#tooltip')
          .style('left', (d3.event.pageX - 100) + 'px')
          .style('top', (d3.event.pageY - 90) + 'px')
          .select('#date')
          .text(date);
        d3.select('#tooltip')
          .select('#temp')
          .text(temp);
        d3.select('#tooltip')
          .select('#variation')
          .text(variation);
        d3.select('#tooltip').classed('hidden', false);
      })

      .on('mouseout', function (d) {
        d3.select('#tooltip').classed('hidden', true);
      });

    svg.append('g')
      .attr('class', 'axis')
      .call(yAxis)
      .call(function centerLabels (selection) {
        const hop = h / months.length;
        selection.selectAll('text')
          .attr('transform', 'translate(0,' + (hop / 2) + ')');
      });

    svg.append('g')
      .attr('transform', 'translate(0,' + h + ')')
      .attr('class', 'axis')
      .call(xAxis);

    // legends
    svg.selectAll('.legend')
      .data(colors)
      .enter()
      .append('rect')
      .attr('x', function (d, i) {
        const ancho = w / 25;
        return (ancho * i) + (w / 4);
      })
      .attr('y', h + 40)
      .attr('width', w / 25)
      .attr('height', 10)
      .style('fill', function (d, i) {
        return colors[i];
      });

    // legends text
    svg.selectAll('.legend')
      .data(colors)
      .enter()
      .append('text')
      .attr('class', 'legend')
      .attr('x', function (d, i) {
        const ancho = w / 25;
        return (ancho * i) + (w / 4);
      })
      .attr('y', h + 65)
      .text(function (d) {
        const r = colorScale.invertExtent(d);
        return (r[0].toFixed(1));
      });

    svg.append('g')
      .append('text')
      .attr('class', 'legend')
      .attr('x', 90)
      .attr('y', h + 55)
      .text('Color Scale (ºC)');
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
