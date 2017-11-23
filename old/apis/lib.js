const fs = require('fs');
const https = require('https');

function loadJSONfile (filePath, flag, callback) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      callback(JSON.parse(data));
    }
  });
}

function areAllCharsNumbers (str) {
  return str.match(/^\d+$/);
}

function getIP (req) {
  return (req.headers['x-forwarded-for'] ||
  req.connection.remoteAddress || req.socket.remoteAddress ||
  req.connection.socket.remoteAddress).split(',')[0];
}

function isValidHostname (hostname) {
  let condition = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\\-]*[A-Za-z0-9])$/;
  if (condition.test(hostname)) {
    return true;
  }
  return false;
}

function sendResult (res, data, status) {
  res.header('Content-Type', 'application/json');
  res.status(status).send(JSON.stringify(data, null, 3));
}

function makeHttpsRequest (path, callback) {
  https.get(path, (res) => {
    res.setEncoding('utf8');
    var body = '';
    res.on('data', (d) => {
      body += d;
    });
    res.on('end', () => {
      try {
        var parsed = JSON.parse(body);
      } catch (err) {
        console.error('Unable to parse response as JSON', err);
        return callback(err);
      }
      callback(null, parsed);
    });
  }).on('error', (err) => {
    console.error('Error with the request:', err.message);
    callback(err);
  });
}

module.exports = {
  loadJSONfile: loadJSONfile,
  areAllCharsNumbers: areAllCharsNumbers,
  getIP: getIP,
  isValidHostname: isValidHostname,
  sendResult: sendResult,
  makeHttpsRequest: makeHttpsRequest
};
