const https = require('https');
const fs = require('fs');

function sendResult (req, res, data, status) {
  res.setHeader('Content-Type', 'application/json');
  res.status(status).send(JSON.stringify(data, null, 3));
}

function getHttpsRequest (path, callback) {
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

function httpsRequest (options, parameters, callback) {
  const req = https.request(options , function (res) {
    let body = '';
    res.setEncoding('utf8');
    res.on('data', function (d) {
      body += d;
    // save all the data from response
    });
    res.on('end', function () {
      try {
        var parsed = JSON.parse(body);
      } catch (err) {
        console.error('Unable to parse response as JSON', err);
        return callback(err);
      }
      callback(null, parsed);
    });
  });
  if (options.method !== 'GET') {
    req.write(parameters);
  }
  req.end();
}

function loadJSONfile (filePath, flag, callback) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      callback(JSON.parse(data));
    }
  });
}

function writeJSONtoFile (filePath, dataSet, callback) {
  const json = JSON.stringify(dataSet);
  fs.writeFile(filePath, json, 'utf8', callback);
}

function getIP (req) {
  return (req.headers['x-forwarded-for'] ||
  req.connection.remoteAddress || req.socket.remoteAddress ||
  req.connection.socket.remoteAddress).split(',')[0];
}

module.exports = {
  sendResult: sendResult,
  getHttpsRequest: getHttpsRequest,
  httpsRequest: httpsRequest,
  loadJSONfile: loadJSONfile,
  writeJSONtoFile: writeJSONtoFile,
  getIP: getIP
};
