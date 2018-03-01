const express = require('express');
const app = express();
const lib = require('./serverlib.js');
const job = require('./job.js');
const configPath = ('./config.json');

global.ct = {};

const port = process.env.PORT || 3000;

app.disable('x-powered-by');

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Socket
app.use(function (req, res, next) {
  req.io = io;
  next();
});

// routes
app.get('/addSymbol/*', function (req, res) {
  job.addSymbol(req, res);
});

app.get('/removeSymbol/*', function (req, res) {
  job.removeSymbol(req, res);
});

app.get('/getData', function (req, res) {
  job.getData(req, res);
});

app.get('*', (req, res) => {
  res.redirect('https://jolav.me/freecodecamp');
// res.status(404).send('Not Found')
});

const server = app.listen(
  port,
  () => {
    console.log('Express server listening on port ' + port);
  },
  initApp()
);

const socketIo = require('socket.io');
const io = socketIo(server);

function initApp () {
  lib.loadJSONfile(configPath, 0, function (data) {
    global.ct.apikey = data.quandl.apikey;
  });
}

module.exports = app;
