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

module.exports = {
  loadJSONfile: loadJSONfile,
  areAllCharsNumbers: areAllCharsNumbers,
  getIP: getIP
};
