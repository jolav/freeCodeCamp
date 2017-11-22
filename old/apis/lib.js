const fs = require('fs');

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

module.exports = {
  loadJSONfile: loadJSONfile,
  areAllCharsNumbers: areAllCharsNumbers,
  getIP: getIP,
  isValidHostname: isValidHostname,
  sendResult: sendResult
};
