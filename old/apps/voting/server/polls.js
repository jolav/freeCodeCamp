require('dotenv').config();
const lib = require('./serverlib.js');
const mongo = require('mongodb');
const connection = process.env.DB;

function getPolls (req, res, cb) {
  // console.log('GET POLLS')
  mongo.connect(connection, function (err, db) {
    if (err) throw err;
    const database = db.db('old-fcc-webapps');
    const collection = database.collection('voting-polls');
    collection.find({}).toArray(function (err, polls) {
      if (err) throw err;
      db.close();
      cb(polls);
    });
  });
}

function addPoll (req, res, cb) {
  // console.log('ADD POLL')
  mongo.connect(connection, function (err, db) {
    if (err) throw err;
    const database = db.db('old-fcc-webapps');
    const collection = database.collection('voting-polls');
    let poll = {};
    poll.createdBy = req.session.logged.split(':')[0];
    poll.createdAt = new Date().toDateString();
    poll.question = req.body.question;
    const oldOptions = req.body.options.split(',');
    let newOptions = [];
    for (let i = 0; i < oldOptions.length; i++) {
      let aux = {};
      aux.text = oldOptions[i];
      aux.votes = [];
      newOptions.push(aux);
    }
    poll.options = newOptions; // req.body.options.split(',')
    collection.insert(poll, function (err, result) {
      if (err) throw err;
    });
    db.close();
    cb();
  });
}

function deletePoll (req, res, cb) {
  mongo.connect(connection, function (err, db) {
    if (err) throw err;
    const database = db.db('old-fcc-webapps');
    const collection = database.collection('voting-polls');
    const id = mongo.ObjectID(req.body.pollid);
    collection.deleteOne({'_id': id}, function (err, result) {
      if (err) throw err;
    });
    db.close();
    cb();
  });
}

function addOption (req, res, cb) {
  const newOption = req.body.option;
  const pollid = mongo.ObjectID(req.body.pollid);
  mongo.connect(connection, function (err, db) {
    const database = db.db('old-fcc-webapps');
    const collection = database.collection('voting-polls');
    collection.findOne({ '_id': pollid }, function (err, poll) {
      if (err) throw err;
      let options = poll.options;
      let exists = false;
      for (let i = 0; i < options.length; i++) {
        if (options[i].text === newOption) {
          exists = true;
        }
      }
      // console.log('EXISTS ?', exists)
      if (!exists) { // no exists
        let aux = {};
        aux.text = newOption;
        aux.votes = [];
        options.push(aux);
      } else { // exists
        db.close();
        cb();
        return;
      }
      // console.log('new pic =>', pic)
      collection.updateOne({ '_id': pollid },
        { $set: { 'options': options } }, function (err, result) {
          if (err) throw err;
          // console.log(result.result)
          db.close();
          cb();
        });
    });
  });
}

function addVote (req, res, cb) {
  const ip = lib.getIP(req);
  const option = req.body.option;
  const pollid = mongo.ObjectID(req.body.pollid);
  mongo.connect(connection, function (err, db) {
    const database = db.db('old-fcc-webapps');
    const collection = database.collection('voting-polls');
    collection.findOne({ '_id': pollid }, function (err, poll) {
      if (err) throw err;
      let options = poll.options;
      let exists = false;
      for (let i = 0; i < options.length; i++) {
        if (options[i].votes.indexOf(ip) !== -1) {
          exists = true;
        }
      }
      // console.log('VOTE EXISTS ?', exists)
      if (!exists) { // no exists
        options[option].votes.push(ip);
      } else { // exists
        db.close();
        cb('voted');
        return;
      }
      // console.log('new pic =>', pic)
      collection.updateOne({ '_id': pollid },
        { $set: { 'options': options } }, function (err, result) {
          if (err) throw err;
          // console.log(result.result)
          db.close();
          cb('ok');
        });
    });
  });
}

module.exports = {
  getPolls: getPolls,
  addPoll: addPoll,
  deletePoll: deletePoll,
  addOption: addOption,
  addVote: addVote
};
