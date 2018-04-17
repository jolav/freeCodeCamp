/* */

console.log('INDEX.JS');

const express = require('express');
const app = express();

// const db = require('./db.js')

const bodyParser = require('body-parser');
const cors = require('cors');
const exercise = require('./exercise-tracker/tracker.js');

require('dotenv').config({ path: __dirname + '/.env' });

const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.disable('x-powered-by');

// routes
app.use('/exercise/v1', exercise);

// Not found middleware
app.use(function (req, res, next) {
/*return*/ next({status: 404, message: 'Path not Found'});
});

// Error Handling middleware
app.use(function (err, req, res, next) {
  const errCode = err.status || 500;
  const errMessage = err.message || 'Internal Server Error';
  res.status(errCode).type('txt').send(errMessage);
});

app.listen(port, function () {
  const time = new Date().toUTCString().split(',')[1];
  console.log('Express server on port ' + port + ' - ' + time);
// db.testDB()
});

module.exports = app;
