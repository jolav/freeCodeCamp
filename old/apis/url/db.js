const mongo = require('mongodb');
const securityDocsLimit = 1000;

function getAllUrls (cb) {
  mongo.connect(global.ct.config.dburl, function (err, db) {
    if (err) throw err;
    // console.log('Connected correctly to server')
    const collection = db.collection('url-shortener');
    collection.find({}).toArray(function (err, docs) {
      if (err) throw err;
      let result = [];
      docs.forEach(function (element) { // remove _id
        let aux = {
          short: element.short,
          original: element.original
        };
        result.push(aux);
        aux = {};
      });
      cb(result);
    });
  });
}

function saveNewUrl (q, cb) {
  mongo.connect(global.ct.config.dburl, function (err, db) {
    if (err) throw err;
    // console.log('Connected correctly to server')
    const collection = db.collection('url-shortener');
    getNextIndex(function (index) {
      let input = {
        'short': index,
        'original': q
      };
      collection.insert(input, function (err, result) {
        if (err) throw err;
        cb(result);
      });
    });
  });
}

function getNextIndex (cb) {
  mongo.connect(global.ct.config.dburl, function (err, db) {
    if (err) throw err;
    // console.log('Connected correctly to server')
    const collection = db.collection('url-shortener');
    collection.find({}).toArray(function (err, docs) {
      if (err) throw err;
      let indexes = [];
      docs.forEach(function (element) { // remove _id
        indexes.push(element.short);
      });
      indexes.sort(function (a, b) { return a - b; });
      let found = false;
      let index = 0;
      let cont = 1;
      while (!found && cont < securityDocsLimit) {
        if (cont !== indexes[cont - 1]) {
          index = cont;
          found = true;
        }
        cont++;
      }
      cb(index);
    });
  });
}

module.exports = {
  getAllUrls: getAllUrls,
  saveNewUrl: saveNewUrl
};
