require('dotenv').config();
const lib = require('./serverlib.js');
const mongo = require('mongodb');
const connection = process.env.DB;

function getPics (req, res, cb) {
  mongo.connect(connection, function (err, db) {
    if (err) throw err;
    const database = db.db('old-fcc-webapps');
    const collection = database.collection('pinterest-pics');
    collection.find({}).toArray(function (err, pics) {
      if (err) throw err;
      db.close();
      cb(pics);
    });
  });
}

function addPic (req, res, cb) {
  mongo.connect(connection, function (err, db) {
    if (err) throw err;
    const database = db.db('old-fcc-webapps');
    const collection = database.collection('pinterest-pics');
    let pic = {};
    pic.idTwitter = req.user.idTwitter;
    pic.logo = req.user.logo;
    pic.text = req.body.text;
    pic.link = req.body.link;
    pic.likes = [];
    // console.log('INSERT PIC =>', pic)
    collection.insert(pic, function (err, result) {
      if (err) throw err;
    });
    db.close();
    cb();
  });
}

function deletePic (req, res, cb) {
  mongo.connect(connection, function (err, db) {
    if (err) throw err;
    const database = db.db('old-fcc-webapps');
    const collection = database.collection('pinterest-pics');
    const id = mongo.ObjectID(req.body.picid);
    collection.deleteOne({'_id': id}, function (err, result) {
      if (err) throw err;
    });
    db.close();
    cb();
  });
}

function votePic (req, res, cb) {
  const picid = req.body.picid;
  const voter = req.body.userid;
  // console.log('111', picid, voter)
  mongo.connect(connection, function (err, db) {
    const database = db.db('old-fcc-webapps');
    const collection = database.collection('pinterest-pics');
    collection.findOne({ '_id': mongo.ObjectID(picid) }, function (err, pic) {
      if (err) throw err;
      // console.log('CHANGING ...', pic)
      let newLikes = pic.likes;
      if (newLikes.indexOf(voter) === -1) { // no exists
        // console.log('NO EXISTS')
        newLikes.push(voter);
      } else { // exists
        // console.log('EXISTS')
        newLikes.splice(newLikes.indexOf(voter, 1));
      }
      // console.log('new pic =>', pic)
      collection.updateOne({ '_id': mongo.ObjectID(picid) },
        { $set: { 'likes': newLikes } },
        function (err, result) {
          if (err) throw err;
          // console.log(result.result)
          db.close();
          cb();
        });
    });
  });
}

function fillDatabase () {
  // console.log('Fill DB')
  lib.loadJSONfile(__dirname + '/pics.json', null, function (data) {
    mongo.connect(connection, function (err, db) {
      if (err) throw err;
      const database = db.db('old-fcc-webapps');
      const collection = database.collection('pinterest-pics');
      data.map(function (aux, index) {
        let pic = {};
        pic.idTwitter = aux.idTwitter;
        pic.logo = aux.logo;
        pic.text = aux.text;
        pic.link = aux.link;
        pic.likes = [];
        collection.insert(pic, function (err, result) {
          if (err) throw err;
        });
      });
      db.close();
    });
  });
}

module.exports = {
  fillDatabase: fillDatabase,
  getPics: getPics,
  addPic: addPic,
  deletePic: deletePic,
  votePic: votePic
};
