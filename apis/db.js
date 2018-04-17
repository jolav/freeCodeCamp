/* */

console.log('DB.JS');

const mongo = require('mongodb');

require('dotenv').config();

// const user = process.env.DB_USER
// const pass = process.env.DB_PASS
// const dburl = process.env.DB_URL
// const dbname = process.env.DB_NAME
// const connection = `mongodb://${user}:${pass}@${dburl}/${dbname}`
// const connection = process.env.DB_URI
// const connectionTest = process.env.DB_URI_TEST
// let collectionName = 'exercise-users'

function testDB (c) {
  // console.log('Testing => ', connection)
  mongo.connect(c.connection, function (err, db) {
    if (err) return console.log(err);
    console.log('Connected correctly to server');
    db.close();
  });
}

function saveUser (c, username, cb) {
  mongo.connect(c.connection, function (err, db) {
    if (err) return console.log(err);
    const database = db.db(c.dbname);
    const collection = database.collection(c.collectionName);
    const newUser = { 'username': username };
    collection.insert(newUser, function (err, result) {
      if (err) return console.log(err);
      db.close();
      cb();
    });
  });
}

function existUser (c, user, cb) {
  mongo.connect(c.connection, function (err, db) {
    if (err) return console.log(err);
    const database = db.db(c.dbname);
    const collection = database.collection(c.collectionName);
    collection.findOne({'username': user}, function (err, result) {
      if (err) return console.log(err);
      // console.log('RESULT => ', result)
      db.close();
      if (result === null) {
        return cb(false);
      }
      cb(true);
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
      // console.log('RESULT =>', result.length)
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

function saveExercise (c, exercise, cb) {
  mongo.connect(c.connection, function (err, db) {
    if (err) return console.log(err);
    const database = db.db(c.dbname);
    const collection = database.collection(c.collectionName);
    collection.insert(exercise, function (err, result) {
      if (err) return console.log(err);
      db.close();
      cb();
    });
  });
}

function searchExercises (c, s, cb) {
  const target = c.collectionName;
  mongo.connect(c.connection, function (err, db) {
    if (err) return console.log(err);
    const database = db.db(c.dbname);
    const collection = database.collection(target);
    let option1 = { 'user': s.user };
    let option2 = {
      'user': s.user,
      'date': {
        '$gte': s.from,
        '$lte': s.to
      }
    };
    let search = option1;
    if (s.from) {
      search = option2;
    }
    let limit = parseInt(s.limit);
    if (isNaN(limit) || limit < 1) limit = 100;
    // console.log('SEARCHING ...', s)
    collection.find(search, {projection: {'_id': 0}}).limit(limit).toArray(function (err, result) {
      if (err) return console.log(err);
      console.log(s.user, ' => ', err, result);
      db.close();
      cb(result);
    });
  });
}

module.exports = {
  testDB: testDB,
  saveUser: saveUser,
  getCollectionList: getCollectionList,
  existUser: existUser,
  dropCollection: dropCollection,
  createCollection: createCollection,
  saveExercise: saveExercise,
  searchExercises: searchExercises
};
