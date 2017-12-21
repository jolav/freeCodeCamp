require('dotenv').config();
const lib = require('./serverlib.js');
const mongo = require('mongodb');
const connection = process.env.DB;

function getBooks (req, res, cb) {
  mongo.connect(connection, function (err, db) {
    if (err) throw err;
    const database = db.db('old-fcc-webapps');
    const collection = database.collection('book-books');
    collection.find({}).toArray(function (err, books) {
      if (err) throw err;
      db.close();
      cb(books);
    });
  });
}

function askTrade (req, res, cb) {
  const id = req.body.id;
  const candidate = req.body.candidate;
  mongo.connect(connection, function (err, db) {
    const database = db.db('old-fcc-webapps');
    const collection = database.collection('book-books');
    collection.findOne({ '_id': mongo.ObjectID(id) }, function (err, book) {
      if (err) throw err;
      if (book.candidates.indexOf(candidate) !== -1) { // no exists
        db.close();
        cb();
        return;
      }
      collection.updateOne({ '_id': mongo.ObjectID(id) },
        { $push: { 'candidates': candidate } },
        function (err, result) {
          if (err) throw err;
          db.close();
          cb();
        });
    });
  });
}

function addBook (req, res, cb) {
  mongo.connect(connection, function (err, db) {
    if (err) throw err;
    const database = db.db('old-fcc-webapps');
    const collection = database.collection('book-books');
    let book = {};
    book.title = req.body.title;
    book.thumbnail = req.body.thumbnail;
    book.owner = req.body.owner;
    book.candidates = [];
    collection.insert(book, function (err, result) {
      if (err) throw err;
    });
    db.close();
    cb();
  });
}

function fillDatabase () {
  lib.loadJSONfile(__dirname + '/zdata.json', null, function (data) {
    mongo.connect(connection, function (err, db) {
      if (err) throw err;
      const database = db.db('old-fcc-webapps');
      const collection = database.collection('book-books');
      data.map(function (aux, index) {
        let book = {};
        book.title = aux.title;
        book.thumbnail = aux.thumbnail;
        book.owner = aux.owner;
        book.candidates = [];
        collection.insert(book, function (err, result) {
          if (err) throw err;
        });
      });
      db.close();
    });
  });
}

function acceptTrade (req, res, cb) {
  const id = req.body.id;
  const newOwner = req.body.newOwner;
  mongo.connect(connection, function (err, db) {
    const database = db.db('old-fcc-webapps');
    const collection = database.collection('book-books');
    collection.findOne({ '_id': mongo.ObjectID(id) }, function (err, book) {
      if (err) throw err;
      collection.updateOne({ '_id': mongo.ObjectID(id) },
        {
          $set: {
            'owner': newOwner,
            'candidates': []
          }
        },
        function (err, result) {
          if (err) throw err;
          db.close();
          cb();
        });
    });
  });
}

module.exports = {
  fillDatabase: fillDatabase,
  getBooks: getBooks,
  askTrade: askTrade,
  addBook: addBook,
  acceptTrade: acceptTrade
};
