/* */

console.log('LIBRARY.JS');

const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const port = process.env.PORT || 3000;
const lib = require('./lib.js');
const db = require('./db.js');

require('dotenv').config({ path: __dirname + '/.env2' });

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.disable('x-powered-by');

let c = {
  // connection: process.env.DB_URI,
  // dbname: process.env.DB_NAME,
  collectionName: 'library'
};

app.use(function (req, res, next) {
  if (req.query.test) {
    c.connection = process.env.DB_URI_TEST;
    c.dbname = process.env.DB_NAME_TEST;
  } else {
    c.connection = process.env.DB_URI;
    c.dbname = process.env.DB_NAME;
  }
  // console.log('##########     ', req.path, '     ##########')
  next();
});

app.get('/v1/books', function (req, res, next) {
  // console.log('********** list all books **********')
  db.getCollectionList(c, function (result) {
    if (!result.message) {
      return lib.sendResult(req, res, result, 200);
    }
    let error = new Error();
    error = result;
    return next(error);
  });
});

app.post('/v1/books', function (req, res, next) {
  // console.log('********** add new book **********')
  const title = req.query.title;
  db.saveBook(c, title, function (result) {
    if (!result.message) {
      return lib.sendResult(req, res, result, 200);
    }
    let error = new Error();
    error = result;
    return next(error);
  });
});

app.delete('/v1/books', function (req, res, next) {
  // console.log('********** delete all books **********')
  db.deleteAll(c, function (result) {
    if (!result.message) {
      return lib.sendResult(req, res, result, 200);
    }
    let error = new Error();
    error = result;
    return next(error);
  });
});

app.get('/v1/books/:id', function (req, res, next) {
  // console.log('********** show book=id **********')
  const bookid = req.params.id;
  db.getBook(c, bookid, function (result) {
    if (!result.message) {
      return lib.sendResult(req, res, result, 200);
    }
    let error = new Error();
    error = result;
    return next(error);
  });
});

app.post('/v1/books/:id', function (req, res, next) {
  // console.log('********** add comment to book=id **********')
  const bookid = req.params.id;
  const comment = req.query.comment;
  db.saveComment(c, bookid, comment, function (result) {
    if (!result.message) {
      return lib.sendResult(req, res, result, 200);
    }
    let error = new Error();
    error = result;
    return next(error);
  });});

app.delete('/v1/books/:id', function (req, res, next) {
  // console.log('********** delete book=id **********')
  const bookid = req.params.id;
  db.deleteBook(c, bookid, function (result) {
    if (!result.message) {
      return lib.sendResult(req, res, result, 200);
    }
    let error = new Error();
    error = result;
    return next(error);
  });
});

// Not found middleware
app.use(function (req, res, next) {
  // console.log('NOT FOUND')
  return next({status: 404, message: 'Page not Found'});
});

// Error Handling middleware
app.use(function (err, req, res, next) {
  // console.log('ERROR', err)
  const errCode = err.status || 500;
  const errMessage = {
    'error': err.message || 'Internal Server Error',
    'status': err.status
  };
  lib.sendResult(req, res, errMessage, errCode);
});

app.listen(port, function () {
  const time = new Date().toUTCString().split(',')[1];
  console.log('Express server on port ' + port + ' - ' + time);
// db.testDB(c)
});

module.exports = app;
