const express = require('express');
const app = express();
const lib = require('./../lib.js');

app.get('/*', function (req, res) {
  analyzeTime(req, res);
});

app.get('/*', (req, res) => {
  res.redirect('https://jolav.me/notFound');
});

module.exports = app;

function analyzeTime (req, res) {
  let output = {
    unix: 0,
    natural: 'Invalid Date'
  };
  const input = req.params[0];
  if (input === undefined || input === '') {
    // console.log('A')
    const time = new Date();
    output.unix = Date.parse(time);
    output.natural = time.toUTCString(); // format to RFC1123
  } else if (!lib.areAllCharsNumbers(input)) {
    // console.log('B')
    const time = new Date(decodeURI(input));
    output.unix = Date.parse(time);
    output.natural = time.toUTCString(); // format to RFC1123
  } else if (!isNaN(parseInt(input))) { // is a unix time
    // console.log('C')
    const time = new Date(parseInt(input));
    output.unix = input;
    output.natural = time.toUTCString(); // format to RFC1123
  }
  res.header('Content-Type', 'application/json');
  res.status(200).send(JSON.stringify(output, null, 3));
}
