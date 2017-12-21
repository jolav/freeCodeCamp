require('dotenv').config();
const lib = require('./serverlib.js');
const bcrypt = require('bcryptjs');
const mongo = require('mongodb');
const connection = process.env.DB;

function createUser (req, res) {
  const user = req.body.username;
  const pass = req.body.password;
  userExists(user, function (exists) {
    if (exists) {
      // console.log('USER... ', user, ' ...ALREADY EXIST')
      lib.sendResult(req, res, { created: false }, 200);
    } else {
      saveUser(user, pass, (result) => {
        if (result.result.ok) {
          // console.log('USER...' , user , '...SAVED OK')
          lib.sendResult(req, res, { created: true }, 200);
        }
      });
    }
  });
}

function authenticateUser (req, res) {
  const user = req.body.username;
  const pass = req.body.password;
  if (req.session.logged) {
    // console.log('ALREADY LOGGED')
    return;
  }
  isValidUser(user, pass , function (isValid, profile) {
    if (isValid) {
      req.session.logged = user + ':' + req.session.id;
      // console.log('USER...', user, '...LOGGED', req.session.logged)
      const result = {
        logged: true,
        profile: profile
      };
      lib.sendResult(req, res, result, 200);
    } else {
      // console.log('USER...' , user , '...NOT LOGGED')
      lib.sendResult(req, res, { logged: false }, 200);
    }
  });
}

function updateUser (req, res) {
  const user = req.body.username;
  const fullName = req.body.fullname;
  const city = req.body.city;
  const state = req.body.state;
  mongo.connect(connection, function (err, db) {
    const database = db.db('old-fcc-webapps');
    const collection = database.collection('book-users');
    collection.find(
      { 'username': user }, { '_id': 0 }).next(function (err, doc) {
      if (err) throw err;
      collection.updateOne({ 'username': user },
        {
          $set: {
            'fullName': fullName,
            'city': city,
            'state': state
          }
        },
        function (err, result) {
          if (err) throw err;
          db.close();
          lib.sendResult(req, res, {}, 200);
        });
    });
  });
}

function isLogged (req, res, next) {
  if (!req.session.logged) {
    res.send('You are not authorized to view this page');
  } else {
    next();
  }
}

function isNotLogged (req, res, next) {
  if (!req.session.logged) {
    next();
  }
}

function testDB (connection) {
  mongo.connect(connection, function (err, db) {
    if (err) throw err;
    console.log('Connected correctly to server');
    db.close();
  });
}

function saveUser (user, pass, cb) {
  mongo.connect(connection, function (err, db) {
    if (err) throw err;
    const database = db.db('old-fcc-webapps');
    const collection = database.collection('book-users');
    bcrypt.hash(pass, 10, function (err, hash) {
      let input = {
        'username': user,
        'password': hash,
        'fullName': '',
        'city': '',
        'state': ''
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
  mongo.connect(connection, function (err, db) {
    if (err) throw err;
    const database = db.db('old-fcc-webapps');
    const collection = database.collection('book-users');
    collection.find({ username: user }, { '_id': 0 }).next(function (err, doc) {
      if (err) throw err;
      if (!doc) { // user dont exist
        cb(false, undefined);
        return;
      }
      db.close();
      bcrypt.compare(pass, doc.password, function (err, isValid) {
        cb(isValid, doc);
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
  mongo.connect(connection, function (err, db) {
    if (err) throw err;
    const database = db.db('old-fcc-webapps');
    const collection = database.collection('book-users');
    collection.find({}, {'_id': 0}).toArray(function (err, users) {
      if (err) throw err;
      db.close();
      cb(users);
    });
  });
}

module.exports = {
  testDB: testDB,
  createUser: createUser,
  authenticateUser: authenticateUser,
  isLogged: isLogged,
  isNotLogged: isNotLogged,
  updateUser: updateUser
};
