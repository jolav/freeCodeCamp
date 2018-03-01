const express = require('express');
const app = express();
const lib = require('./serverlib.js');
const db = require('./db.js');
const job = require('./job.js');
const configPath = ('./config.json');
const bodyParser = require('body-parser');
const user = require('./user.js');
const session = require('express-session');
const port = process.env.PORT || 3000;

require('dotenv').config();

global.ct = {};

app.disable('x-powered-by');

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.set('trust proxy', 1); // trust first proxy
app.use(session({
  secret: process.env.secretSession,
  name: 'jolav-night-session',
  saveUninitialized: false,
  resave: true,
  cookie: {
    secure: true // comment for localhost
  }
}));

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

// routes 
app.get('/get/:location', function (req, res) {
  if (req.session.logged) {
    user.saveLastSearch(req, res);
  }
  job.getLocation(req, res);
});

app.post('/login', user.isNotLogged, function (req, res) {
  // console.log('LOGIN')
  user.authenticateUser(req, res);
});

app.post('/signup', user.isNotLogged, function (req, res) {
  // console.log('SIGNUP')
  user.createUser(req, res);
});

app.get('/logout', user.isLogged, function (req, res) {
  // console.log('LOGOUT')
  req.session.destroy();
  lib.sendResult(req, res, { logout: true }, 200);
});

app.post('/vote', user.isLogged, function (req, res) {
  user.voteBar(req, res);
});

app.get('*', function (req, res) {
  // res.redirect('https://jolav.me/freecodecamp')
  res.status(404).send('Not Found');
});

app.listen(
  port,
  () => {
    console.log('Express server listening on port ' + port);
  },
  initApp()
);

function initApp () {
  lib.loadJSONfile(configPath, 0, function (data) {
    global.ct.config = data;
    db.configDB();
  });
}

module.exports = app;
