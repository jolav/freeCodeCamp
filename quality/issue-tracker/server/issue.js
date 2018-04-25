/* */

console.log('ISSUE.JS');

const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const port = process.env.PORT || 3000;
const lib = require('./lib.js');
const db = require('./db.js');

require('dotenv').config({ path: __dirname + '/.env' });

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.disable('x-powered-by');

let c = {
  connection: process.env.DB_URI,
  dbname: process.env.DB_NAME,
  collectionName: 'issues'
};

app.use(function (req, res, next) {
  if (req.query.test) {
    c.connection = process.env.DB_URI_TEST;
    c.dbname = process.env.DB_NAME_TEST;
  } else {
    c.connection = process.env.DB_URI;
    c.dbname = process.env.DB_NAME;
  }
  console.log('##########     ', req.path, '     ##########');
  next();
});

app.get('/v1/project/:issue?', function (req, res, next) {
  console.log('********** list all issues **********');
  const issue = req.params.issue;
  db.getCollectionList(c, function (result) {
    if (issue && !result.message) {
      const data = lib.getIssue(issue, result);
      return lib.sendResult(req, res, data, 200);
    }
    if (!result.message) {
      return lib.sendResult(req, res, result, 200);
    }
    let error = new Error();
    error = result;
    return next(error);
  });
});

app.post('/v1/project', function (req, res, next) {
  console.log('********** create new issue **********');
  if (!req.query.title || !req.query.text || !req.query.createdBy) {
    const w = {
      message: 'Not enough data',
      status: 400
    };
    let error = new Error();
    error = w;
    return next(error);
  }
  db.saveIssue(req, c, function (result) {
    if (!result.message) {
      return lib.sendResult(req, res, result, 200);
    }
    let error = new Error();
    error = result;
    return next(error);
  });
});

app.put('/v1/project', function (req, res, next) {
  console.log('********** update issue **********');
  const issue = parseInt(req.query.issueID);
  if (!issue) {
    const w = {
      message: 'no updated field sent',
      status: 200
    };
    let error = new Error();
    error = w;
    return next(error);
  }
  db.updateIssue(req, c, function (result) {
    if (!result.message) {
      return lib.sendResult(req, res, result, 200);
    }
    let error = new Error();
    error = result;
    return next(error);
  });
});

app.delete('/v1/project', function (req, res, next) {
  console.log('********** delete issue **********');
  const issue = parseInt(req.query.id);
  if (!issue) {
    const w = {
      message: '_id error',
      status: 200
    };
    let error = new Error();
    error = w;
    return next(error);
  }
  db.deleteIssue(c, issue, function (result) {
    return lib.sendResult(req, res, result, result.status || 400);
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
  db.testDB(c);
});

module.exports = app;
