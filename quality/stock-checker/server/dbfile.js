/* */

console.log('DBFILE.JS');

const fs = require('fs');
const dbfile = './data.json';

function readAll (file, cb) {
  if (!file) file = dbfile;
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.log('ERROR READING JSON FILE => ', err);
      throw err;
    } else {
      cb(JSON.parse(data));
    }
  });
}

function writeAll (file, data, cb) {
  if (!file) file = dbfile;
  const json = JSON.stringify(data);
  fs.writeFile(file, json, 'utf8', (err) => {
    if (err) {
      console.log('ERROR WRITING JSON IN FILE => ', err);
      throw err;
    }
    cb();
  });
}

module.exports = {
  readAll: readAll,
  writeAll: writeAll
};
