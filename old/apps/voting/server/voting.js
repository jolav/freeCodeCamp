const express = require('express');
const app = express();
const lib = require('./serverlib.js');
const polls = require('./polls.js');
const bodyParser = require('body-parser');
const user = require('./user.js');
const session = require('express-session');
const port = process.env.PORT || 3000;

require('dotenv').config();

app.disable('x-powered-by');

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.set('trust proxy', 1); // trust first proxy
app.use(session({
  secret: process.env.secretSession || 'secret',
  name: 'jolav-voting',
  saveUninitialized: false,
  resave: true,
  cookie: {
    // secure: true // comment for localhost
  }
}));

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

// routes 
app.use(function (req, res, next) {
  // console.log('MW => ', req.session.logged)
  next();
});

app.post('/login', user.isNotLogged, function (req, res) {
  // console.log('LOGIN ')
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

app.get('/getpolls',  function (req, res) {
  // console.log('GET POLLS')
  polls.getPolls(req, res, function (polls) {
    lib.sendResult(req, res, { polls}, 200);
  });
});

app.post('/addpoll', user.isLogged, function (req, res) {
  // console.log('ADD POLL')
  polls.addPoll(req, res, function () {
    lib.sendResult(req, res, {}, 200);
  });
});

app.post('/deletepoll', user.isLogged, function (req, res) {
  // console.log('DELETE POLL')
  polls.deletePoll(req, res, function () {
    lib.sendResult(req, res, {}, 200);
  });
});

app.post('/addoption', user.isLogged, function (req, res) {
  // console.log('ADD OPTION')
  polls.addOption(req, res, function () {
    lib.sendResult(req, res, {}, 200);
  });
});

app.post('/addvote',  function (req, res) {
  // console.log('ADD POLL')
  polls.addVote(req, res, function (data) {
    lib.sendResult(req, res, {'res': data}, 200);
  });
});

app.get('*', function (req, res) {
  res.redirect('https://freecodecamp.codetabs.com');
// res.status(404).send('Not Found')
});

app.listen(
  port,
  () => {
    // console.log('Express server listening on port ' + port)
  },
  //initApp()
);

function initApp () {
  // console.log('Init App')
  user.testDB(process.env.DB);
}

module.exports = app;
