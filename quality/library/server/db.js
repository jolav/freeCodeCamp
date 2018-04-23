/* */

console.log('DB.JS');

const mongo = require('mongodb');

require('dotenv').config();

function testDB (c) {
  // console.log('Testing => ', c)
  mongo.connect(c.connection, function (err, db) {
    if (err) return console.log(err);
    console.log('Connected correctly to server');
    db.close();
  });
}

function getBook (c, bookid, cb) {
  const target = c.collectionName;
  mongo.connect(c.connection, function (err, db) {
    if (err) throw err;
    const database = db.db(c.dbname);
    const collection = database.collection(target);
    collection.findOne({ '_id': parseInt(bookid) }, function (err, result) {
      if (err) throw err;
      db.close();
      if (!result) {
        const err = {
          message: 'no book exists',
          status: 400
        };
        return cb(err);
      }
      cb(result);
    });
  });
}

function saveBook (c, title, cb) {
  const target = c.collectionName;
  let msg = {
    message: 'no title',
    status: 400
  };
  if (!title) return cb(msg);
  getNextSequenceValue(c, 'library', function (nextID) {
    mongo.connect(c.connection, function (err, db) {
      if (err) return console.log(err);
      const database = db.db(c.dbname);
      const collection = database.collection(target);
      const book = {
        '_id': nextID,
        'title': title,
        'comments': [],
        'commentCount': 0
      };
      collection.insert(book, function (err, result) {
        if (err) return console.log(err);
        db.close();
        msg = {
          message: undefined,
          status: 200
        };
        cb(msg);
      });
    });
  });
}

function saveComment (c, bookid, comment, cb) {
  const target = c.collectionName;
  mongo.connect(c.connection, function (err, db) {
    if (err) return console.log(err);
    const database = db.db(c.dbname);
    const collection = database.collection(target);
    collection.updateOne({'_id': parseInt(bookid)},
      {
        $push: { 'comments': comment },
        $inc: { 'commentCount': 1 }
      },
      function (err, result) {
        if (err) return console.log(err);
        console.log('RESULT=>', result.ok);
        db.close();
        const msg = {
          message: undefined,
          status: 200
        };
        cb(msg);
      });
  });
}

function getNextSequenceValue (c, sequenceName, cb) {
  mongo.connect(c.connection, function (err, db) {
    if (err) return console.log(err);
    const database = db.db(c.dbname);
    const collection = database.collection('counters');
    collection.findAndModify(
      { '_id': sequenceName },
      [],
      { '$inc': { sequence_value: 1 } },
      { new: true },
      function (err, doc) {
        return cb(doc.value.sequence_value);
      });
  });
}

function deleteAll (c, cb) {
  const msg = {
    message: undefined,
    status: 200
  };
  const target = c.collectionName;
  mongo.connect(c.connection, function (err, db) {
    if (err) throw err;
    const database = db.db(c.dbname);
    const collection = database.collection(target);
    collection.deleteMany({ '_id': {$gt: 0}}, function (err, result) {
      if (err) throw err;
      db.close();
      cb(msg);
    });
  });
}

function deleteBook (c, bookid, cb) {
  const msg = {
    message: undefined,
    status: 200
  };
  if (parseInt(bookid) === 0) {
    return cb(msg);
  }
  const target = c.collectionName;
  mongo.connect(c.connection, function (err, db) {
    if (err) throw err;
    const database = db.db(c.dbname);
    const collection = database.collection(target);
    collection.deleteOne({'_id': parseInt(bookid)}, function (err, result) {
      if (err) throw err;
      db.close();
      cb(msg);
    });
  });
}

function getCollectionList (c, cb) {
  const target = c.collectionName;
  mongo.connect(c.connection, function (err, db) {
    if (err) return console.log(err);
    const database = db.db(c.dbname);
    const collection = database.collection(target);
    collection.find({}, { '_id': 0 }).toArray(function (err, result) {
      if (err) return console.log(err);
      db.close();
      cb(result);
    });
  });
}

function dropCollection (c, cb) {
  const target = c.collectionName;
  mongo.connect(c.connection, function (err, db) {
    if (err) return console.log(err);
    const database = db.db(c.dbname);
    database.dropCollection(target, function (err, isDrop) {
      if (err) return console.log(err);
      if (isDrop) console.log('Collection ', c.collectionName, ' deleted');
      db.close();
      return cb();
    });
  });
}

function createCollection (c, cb) {
  const target = c.collectionName;
  mongo.connect(c.connection, function (err, db) {
    if (err) return console.log(err);
    const database = db.db(c.dbname);
    database.createCollection(target, function (err, created) {
      if (err) return console.log(err);
      if (created) console.log('Collection ', c.collectionName, ' created');
      db.close();
      return cb();
    });
  });
}

function resetCounter (c, cb) {
  const target = 'counters';
  mongo.connect(c.connection, function (err, db) {
    if (err) return console.log(err);
    const database = db.db(c.dbname);
    const collection = database.collection(target);
    collection.updateOne({'_id': 'library'},
      {
        $set: { 'sequence_value': 0 }
      },
      function (err, result) {
        if (err) return console.log(err);
        db.close();
        cb();
      });
  });
}

module.exports = {
  testDB: testDB,
  getCollectionList: getCollectionList,
  dropCollection: dropCollection,
  createCollection: createCollection,
  getBook: getBook,
  saveBook: saveBook,
  saveComment: saveComment,
  deleteAll: deleteAll,
  deleteBook: deleteBook,
  resetCounter: resetCounter
};
