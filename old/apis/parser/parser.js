const express = require('express');
const app = express();
const lib = require('./../lib.js');

app.get('/whoami', function (req, res) {
  whoami(req, res);
});

app.get('/*', (req, res) => {
  res.redirect('https://jolav.me/freecodecamp');
});

module.exports = app;

function whoami (req, res) {
  let output = {
    'Ip Address': '',
    'Language': '',
    'Operative System': ''
  };
  output['Ip Address'] = lib.getIP(req);
  output['Language'] = req.headers['accept-language'];
  output['Operative System'] = req.headers['user-agent'];
  res.header('Content-Type', 'application/json');
  res.status(200).send(JSON.stringify(output, null, 3));
}
