const bcrypt = require('bcryptjs');
const mongo = require('mongodb');
// const connection = process.env.DB

function configDB () {
  const user = global.ct.config.mongodb.user;
  const password = global.ct.config.mongodb.password;
  const connection = 'mongodb://' + user + ':' + password + '@ds042687.mlab.com:42687/old-fcc-webapps';
  global.ct.config.connection = connection;
  testDB(connection);
}

function testDB (connection) {
  mongo.connect(connection, function (err, db) {
    if (err) throw err;
    console.log('Connected correctly to server');
    db.close();
  });
}

function saveUser (user, pass, cb) {
  const connection = global.ct.config.connection;
  mongo.connect(connection, function (err, db) {
    if (err) throw err;
    const collection = db.collection('nightlife-users');
    bcrypt.hash(pass, 10, function (err, hash) {
      let input = {
        'username': user,
        'password': hash
      };
      collection.insert(input, function (err, result) {
        if (err) throw err;
        db.close();
        cb(result);
      });
    });
  });
}

function isValidUser (user, pass, cb) {
  const connection = global.ct.config.connection;
  mongo.connect(connection, function (err, db) {
    if (err) throw err;
    const collection = db.collection('nightlife-users');
    collection.find({ username: user }, { '_id': 0 }).next(function (err, doc) {
      if (err) throw err;
      if (!doc) { // user dont exist
        cb(false, undefined);
        return;
      }
      db.close();
      bcrypt.compare(pass, doc.password, function (err, isValid) {
        cb(isValid, doc.lastSearch);
      });
    });
  });
}

function userExists (user, cb) {
  getAllUsers(function (users) {
    let exists = false;
    if (users.length !== 0) {
      users.map((element, index) => {
        if (element.username.toUpperCase() === user.toUpperCase()) {
          exists = true;
        }
      });
    }
    cb(exists);
  });
}

function getAllUsers (cb) {
  const connection = global.ct.config.connection;
  mongo.connect(connection, function (err, db) {
    if (err) throw err;
    const collection = db.collection('nightlife-users');
    collection.find({}, {'_id': 0}).toArray(function (err, users) {
      if (err) throw err;
      db.close();
      cb(users);
    });
  });
}

function updateSearch (user, search) {
  const connection = global.ct.config.connection;
  mongo.connect(connection, function (err, db) {
    if (err) throw err;
    const collection = db.collection('nightlife-users');
    collection.updateOne({ username: user }, {$set: {lastSearch: search}}, function (err, res) {
      if (err) throw err;
      db.close();
    });
  });
}

function barExists (barid, cb) {
  const connection = global.ct.config.connection;
  let exists = false;
  mongo.connect(connection, function (err, db) {
    if (err) throw err;
    const collection = db.collection('nightlife-pubs');
    collection.find({'barid': barid}).toArray(function (err, users) {
      if (err) throw err;
      db.close();
      if (users.length > 0) {
        exists = true;
      }
      cb(exists);
    });
  });
}

function saveBar (barid, user, cb) {
  const connection = global.ct.config.connection;
  mongo.connect(connection, function (err, db) {
    if (err) throw err;
    const collection = db.collection('nightlife-pubs');
    let input = {
      'barid': barid,
      'votes': []
    };
    collection.insert(input, function (err, result) {
      if (err) throw err;
      db.close();
      cb(result);
    });
  });
}

function updateBar (barid, user, cb) {
  const connection = global.ct.config.connection;
  mongo.connect(connection, function (err, db) {
    const collection = db.collection('nightlife-pubs');
    let action;
    collection.find({ 'barid': barid }, { '_id': 0 }).next(function (err, doc) {
      if (err) throw err;
      const newVotes = doc.votes;
      const index = newVotes.indexOf(user);
      if (index === -1) { // no exists
        newVotes.push(user);
        action = 'add';
      } else { // exists
        newVotes.splice(index, 1);
        action = 'sub';
      }
      collection.updateOne({ 'barid': barid }, { $set: { 'votes': newVotes } },
        function (err, result) {
          if (err) throw err;
          db.close();
          cb(result, action);
        });
    });
  });
}

function getVotes (barid, cb) {
  const connection = global.ct.config.connection;
  mongo.connect(connection, function (err, db) {
    const collection = db.collection('nightlife-pubs');
    collection.find({ 'barid': barid }, { '_id': 0 }).next(function (err, doc) {
      if (err) throw err;
      if (doc) {
        cb(doc.votes.length);
        return;
      }
      cb(0);
    });
  });
}

module.exports = {
  configDB: configDB,
  testDB: testDB,
  saveUser: saveUser,
  isValidUser: isValidUser,
  userExists: userExists,
  updateSearch: updateSearch,
  barExists: barExists,
  updateBar: updateBar,
  saveBar: saveBar,
  getVotes: getVotes
};
