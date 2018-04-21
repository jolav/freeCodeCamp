/* */

console.log('STOCK.JS');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const helmet = require('helmet');

const port = process.env.PORT || 3000;
const lib = require('./lib.js');

app.use(helmet());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.disable('x-powered-by');

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/v1/stock-prices', function (req, res, next) {
  console.log('***********************************');
  lib.checkPrices(req, function (result) {
    // console.log('Sending ........ => ', result)
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
  console.log('NOT FOUND');
  return next({status: 404, message: 'Page not Found'});
});

// Error Handling middleware
app.use(function (err, req, res, next) {
  console.log('ERROR');
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
});

module.exports = app;
