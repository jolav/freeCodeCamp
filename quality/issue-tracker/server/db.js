/* */

console.log('DB.JS');

const mongo = require('mongodb');

function testDB (c) {
  // console.log('Testing => ', c)
  mongo.connect(c.connection, function (err, db) {
    if (err) return console.log(err);
    console.log('Connected correctly to server');
    db.close();
  });
}

function getCollectionList (c, cb) {
  const target = c.collectionName;
  mongo.connect(c.connection, function (err, db) {
    if (err) return console.log(err);
    const database = db.db(c.dbname);
    const collection = database.collection(target);
    collection.find({}, {}).toArray(function (err, result) {
      if (err) return console.log(err);
      db.close();
      cb(result);
    });
  });
}

function saveIssue (req, c, cb) {
  const target = c.collectionName;
  getNextSequenceValue(c, 'issues', function (nextID) {
    mongo.connect(c.connection, function (err, db) {
      if (err) return console.log(err);
      const database = db.db(c.dbname);
      const collection = database.collection(target);
      const issue = {
        '_id': nextID,
        'title': String(req.query.title),
        'text': String(req.query.text),
        'creationDate': new Date().toUTCString().split(',')[1],
        'latestUpdate': new Date().toUTCString().split(',')[1],
        'author': String(req.query.createdBy),
        'assignee': String(req.query.assignedTo) || '',
        'isOpen': true
      };
      collection.insert(issue, function (err, result) {
        if (err) return console.log(err);
        db.close();
        cb(issue);
      });
    });
  });
}

function updateIssue2 (req, c, cb) {
  const target = c.collectionName;
  mongo.connect(c.connection, function (err, db) {
    if (err) throw err;
    const database = db.db(c.dbname);
    const collection = database.collection(target);
    const id = parseInt(req.query.issueID);
    collection.findOne({ '_id': id }, function (err, doc) {
      if (err) throw err;
      console.log('DOC => ', doc);
      collection.updateOne({ '_id': id },
        {
          $set: {
            'title': String(req.query.title) || doc.title,
            'text': String(req.query.text) || doc.text,
            'latestUpdate': new Date().toUTCString().split(',')[1],
            'author': String(req.query.createdBy) || doc.author,
            'assignee': String(req.query.assignedTo) || doc.assignee,
            'isOpen': !req.query.close || doc.isOpen
          }
        }, function (err, result) {
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
  });
}

function updateIssue (req, c, cb) {
  const target = c.collectionName;
  mongo.connect(c.connection, function (err, db) {
    if (err) throw err;
    const database = db.db(c.dbname);
    const collection = database.collection(target);
    const id = parseInt(req.query.issueID);
    collection.findOne({ '_id': id }, function (err, doc) {
      if (err) throw err;
      if (req.query.title) doc.title = req.query.title;
      if (req.query.text) doc.text = req.query.text;
      if (req.query.createdBy) doc.author = req.query.createdBy;
      if (req.query.assignedTo) doc.assignee = req.query.assignedTo;
      if (req.query.close) {
        doc.isOpen = false;
      } else {
        doc.isOpen = true;
      }
      collection.updateOne({ '_id': id },
        {
          $set: {
            'title': doc.title,
            'text': doc.text,
            'latestUpdate': new Date().toUTCString().split(',')[1],
            'author': doc.author,
            'assignee': doc.assignee,
            'isOpen': doc.isOpen
          }
        }, function (err, result) {
          if (err) return console.log(err);
          db.close();
          const msg = {
            message: undefined,
            status: 200
          };
          cb(msg);
        });
    });
  });
}

function deleteIssue (c, issue, cb) {
  if (parseInt(issue) === 0 || parseInt(issue) === -1) {
    const w = {
      message: 'could not delete ' + issue,
      status: 200
    };
    return cb(w);
  }
  const target = c.collectionName;
  mongo.connect(c.connection, function (err, db) {
    if (err) throw err;
    const database = db.db(c.dbname);
    const collection = database.collection(target);
    collection.deleteOne({'_id': parseInt(issue)}, function (err, result) {
      if (err) throw err;
      db.close();
      let w = {};
      if (result.deletedCount === 1) {
        w = {
          message: 'deleted ' + issue,
          status: 200
        };
      } else {
        w = {
          message: 'could not delete ' + issue,
          status: 200
        };
      }
      cb(w);
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
    collection.updateOne({'_id': 'issues'},
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
  saveIssue: saveIssue,
  updateIssue: updateIssue,
  deleteIssue: deleteIssue,
  createCollection: createCollection,
  dropCollection: dropCollection,
  resetCounter: resetCounter
};

function getNextSequenceValue (c, sequenceName, cb) {
  mongo.connect(c.connection, function (err, db) {
    if (err) return console.log(err);
    const database = db.db(c.dbname);
    const collection = database.collection('counters');
    collection.findAndModify(
      { '_id': sequenceName },
      [], // sort
      { '$inc': { sequence_value: 1 } },
      { new: true },
      function (err, doc) {
        console.log('HOLA=', doc);
        return cb(doc.value.sequence_value);
      });
  });
}
