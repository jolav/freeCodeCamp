const mongo = require('mongodb');

function getAllImages (cb) {
  mongo.connect(global.ct.config.connection, function (err, db) {
    if (err) throw err;
    // console.log('Connected correctly to server')
    const collection = db.collection('image-search');
    collection.find({}, {'_id': 0}).toArray(function (err, docs) {
      if (err) throw err;
      db.close();
      cb(docs);
    });
  });
}

function saveNewSearch (quest) {
  mongo.connect(global.ct.config.connection, function (err, db) {
    if (err) throw err;
    // console.log('Connected correctly to server')
    const collection = db.collection('image-search');
    let input = {
      'search': quest,
      'when': new Date().toString()
    };
    collection.insert(input, function (err, result) {
      if (err) throw err;
      db.close();
    });
  // console.log('INPUT =>', input)
  });
}

module.exports = {
  getAllImages: getAllImages,
  saveNewSearch: saveNewSearch
};
