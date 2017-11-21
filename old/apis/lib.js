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
module.exports = {
  loadJSONfile: loadJSONfile,
  areAllCharsNumbers: areAllCharsNumbers
};
