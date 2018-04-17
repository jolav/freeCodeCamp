/* */

console.log('TRACKER.JS');

require('dotenv').config();

const express = require('express');
const app = express();
const db = require('./../db.js');

let c = {};

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

app.get('/users', function (req, res) {
  c.collectionName = 'exercise-users';
  sendCollectionList(req, res);
});

app.post('/newUser', function (req, res) {
  c.collectionName = 'exercise-users';
  // force user to be an string, not nosql injections using objects
  const newUser = req.body.username.toString(10);
  if (newUser === undefined || newUser === null || newUser === '') {
    return sendResult(req, res, { err: 'username is empty' }, 400);
  }
  db.existUser(c, newUser, function (exists) {
    if (!exists) {
      db.saveUser(c, newUser, function () {
        sendCollectionList(req, res);
      });
    } else {
      return sendResult(req, res, { err: 'username already exists' }, 400);
    }
  });
});

app.get('/exercises', function (req, res) {
  c.collectionName = 'exercise-tracker';
  sendCollectionList(req, res);
});

app.post('/newExercise', function (req, res) {
  c.collectionName = 'exercise-tracker';
  if (req.body.date) {
    if (isNaN(new Date(req.body.date).getTime())) {
      return sendResult(req, res, { err: 'incorrect date' }, 400);
    }
  }
  const user = req.body.user.toString(10);
  const desc = req.body.desc.toString(10);
  const min = req.body.min.toString(10);
  const date = req.body.date || new Date().toISOString().split('T')[0];
  const exercise = {
    user: user,
    desc: desc,
    min: min,
    date: date || new Date()
  };
  db.saveExercise(c, exercise, function () {
    sendCollectionList(req, res);
  });
});

app.get('/log', function (req, res) {
  c.collectionName = 'exercise-tracker';
  const search = {
    user: req.query.user,
    from: req.query.from,
    to: req.query.to,
    limit: req.query.limit || 100
  };
  if (search.from) {
    if (isNaN(new Date(search.from).getTime())) {
      return sendResult(req, res, { err: 'incorrect date' }, 400);
    }
    if (search.to) {
      if (isNaN(new Date(search.to).getTime())) {
        return sendResult(req, res, { err: 'incorrect date' }, 400);
      }
    } else {
      search.to = new Date().toISOString().split('T')[0];
    }
  } else {
    search.to = undefined;
  }

  db.searchExercises(c, search, function (data) {
    sendResult(req, res, data, 200);
  });
});

module.exports = app;

function sendResult (req, res, data, status) {
  res.setHeader('Content-Type', 'application/json');
  res.status(status).send(JSON.stringify(data, null, 3));
}

function sendCollectionList (req, res) {
  db.getCollectionList(c, function (data) {
    sendResult(req, res, data, 200);
  });
}
