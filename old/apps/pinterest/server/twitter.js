require('dotenv').config();
const mongo = require('mongodb');
const connection = process.env.DB;

function findUserOrCreate (profile, cb) {
  mongo.connect(connection, function (err, db) {
    const database = db.db('old-fcc-webapps');
    const collection = database.collection('pinterest-users');
    const newUser = {
      idTwitter: profile.id,
      name: profile.displayName,
      logo: profile.photos[0].value
    };
    collection.findOne({ 'idTwitter': profile.id },
      function (err, user) {
        if (err) throw err;
        if (user) { // exists
          // console.log('USER ALREADY EXISTS')
          newUser._id = user._id;
          db.close();
          cb(err, newUser);
        } else { // no exists
          // console.log('NEW USER')
          collection.insert(newUser, function (err, result) {
            if (err) throw err;
            db.close();
            cb(err, newUser);
          });
        }
      });
  });
}

function findById (id, cb) {
  mongo.connect(connection, function (err, db) {
    const database = db.db('old-fcc-webapps');
    const collection = database.collection('pinterest-users');
    collection.findOne({ '_id': mongo.ObjectID(id) }, function (err, user) {
      if (err) throw err;
      db.close();
      cb(null , user);
    });
  });
}

module.exports = {
  findUserOrCreate: findUserOrCreate,
  findById: findById
};
