const express = require('express');
const app = express();
const lib = require('./serverlib.js');
const books = require('./books.js');
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
  secret: process.env.secretSession,
  name: 'jolav-book-trading',
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

app.get('/getBooks', user.isLogged, function (req, res) {
  // console.log('GET BOOKS')
  books.getBooks(req, res, function (books) {
    lib.sendResult(req, res, { books}, 200);
  });
});

app.post('/updateuser', user.isLogged, function (req, res) {
  // console.log('UPDATE USER')
  user.updateUser(req, res);
});

app.post('/asktrade', user.isLogged, function (req, res) {
  // console.log('ASK TRADE')
  books.askTrade(req, res, function () {
    lib.sendResult(req, res, {}, 200);
  });
});

app.post('/addbook', user.isLogged, function (req, res) {
  // console.log('ADD BOOK')
  books.addBook(req, res, function () {
    lib.sendResult(req, res, {}, 200);
  });
});

app.post('/accepttrade', user.isLogged, function (req, res) {
  // console.log('ACCEPT TRADE')
  books.acceptTrade(req, res, function () {
    lib.sendResult(req, res, {}, 200);
  });
});

app.get('*', function (req, res) {
  // res.redirect('https://freecodecamp.codetabs.com')
  res.status(404).send('Not Found');
});

app.listen(
  port,
  () => {
    // console.log('Express server listening on port ' + port)
  },
  initApp()
);

function initApp () {
  // console.log('Init App')
  user.testDB(process.env.DB);
// books.fillDatabase()
}

module.exports = app;
