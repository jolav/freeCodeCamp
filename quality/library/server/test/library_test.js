/*eslint no-dupe-keys: "warn"*/

console.log('LIBRARY_TEST');

const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = require('chai').expect;
const db = require('./../db.js');

chai.use(chaiHttp);
const url = 'https://personal-library-v2.glitch.me';
//const url = 'http://localhost:3000';

describe('BOOKS', function () {
  before(function (done) {
    let c = {
      connection: process.env.DB_URI_TEST,
      dbname: process.env.DB_NAME_TEST,
      collectionName: 'library'
    };
    db.createCollection(c, function () {
      db.dropCollection(c, function () {
        //     db.createCollection(c, function () {
        db.resetCounter(c, function () {
          done();
        });
      });
    });
  // done()
  });
  it('POST /v1/books with Title', function (done) {
    chai.request(url)
      .post('/v1/books')
      .query({test: true, title: 'Book 1' })
      .end(function (err, res) {
        // console.log(res.body)
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      });
  });
  it('POST /v1/books with Title', function (done) {
    chai.request(url)
      .post('/v1/books')
      .query({test: true, title: 'Book 2' })
      .end(function (err, res) {
        // console.log(res.body)
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      });
  });
  it('POST /api/books with no title', function (done) {
    chai.request(url)
      .post('/v1/books')
      .query({ test: true }) // , title: undefined })
      .end(function (err, res) {
        // console.log(res.body)
        expect(res.body.error).to.equal('no title');
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        done();
      });
  });
  it('POST /api/books add comment 1 to book 2', function (done) {
    chai.request(url)
      .post('/v1/books/2')
      .query({ test: true,  comment: 'comment 1'})
      .end(function (err, res) {
        // console.log(res.body)
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      });
  });
  it('POST /api/books add comment 2 to book 2', function (done) {
    chai.request(url)
      .post('/v1/books/2')
      .query({ test: true,  comment: 'comment 2'})
      .end(function (err, res) {
        // console.log(res.body)
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      });
  });
  it('GET /v1/books', function (done) {
    chai.request(url)
      .get('/v1/books')
      .query({test: true})
      .end(function (err, res) {
        // console.log(res.body)
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.have.property('_id', 1);
        expect(res.body[0]).to.have.property('title', 'Book 1');
        expect(res.body[0]).to.have.property('comments').to.be.an('array').that.is.empty;
        expect(res.body[0]).to.have.property('commentCount', 0);
        done();
      });
  });
  it('GET /v1/books with id 1', function (done) {
    chai.request(url)
      .get('/v1/books/1')
      .query({test: true})
      .end(function (err, res) {
        // console.log(res.body)
        // console.log(err)
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property('_id', 1);
        expect(res.body).to.have.property('title', 'Book 1');
        expect(res.body).to.have.property('comments').to.be.an('array').that.is.empty;
        expect(res.body).to.have.property('commentCount', 0);
        done();
      });
  });
  it('GET /v1/books with id 2', function (done) {
    chai.request(url)
      .get('/v1/books/2')
      .query({test: true})
      .end(function (err, res) {
        // console.log(res.body)
        // console.log(err)
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property('_id', 2);
        expect(res.body).to.have.property('title', 'Book 2');
        expect(res.body.comments[0]).to.equal('comment 1');
        expect(res.body).to.have.property('commentCount', 2);
        done();
      });
  });

  it('GET /v1/books with no valid id', function (done) {
    chai.request(url)
      .get('/v1/books/0')
      .query({test: true})
      .end(function (err, res) {
        // console.log(res.body)
        expect(res.body.error).to.equal('no book exists');
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        done();
      });
  });
});
