/* */

console.log('TRACKER_TEST');

const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = require('chai').expect;
const db = require('./../db.js');

chai.use(chaiHttp);
const url = 'https://apis-v2-jolav.glitch.me/exercise/v1';
// const url = 'http://localhost:3000/exercise/v1'

describe('Users', function () {
  before(function (done) {
    let c = {
      connection: process.env.DB_URI_TEST,
      dbname: process.env.DB_NAME_TEST,
      collectionName: 'exercise-users'
    };
    db.createCollection(c, function () {
      db.dropCollection(c, function () {
        //     db.createCollection(c, function () {
        done();
      });
    });
  // done()
  });
  it('Insert username', function (done) {
    chai.request(url)
      .post('/newUser')
      .query({test: true})
      .send({ username: 'username' })
      .end(function (err, res) {
        // console.log(res.body)
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      });
  });
  it('Insert username repeated', function (done) {
    chai.request(url)
      .post('/newUser')
      .query({test: true})
      .send({ username: 'username' })
      .end(function (err, res) {
        // console.log(res.body)
        expect(res.body.err).to.equal('username already exists');
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        done();
      });
  });
  it('Insert username empty', function (done) {
    chai.request(url)
      .post('/newUser')
      .query({test: true})
      .send({ username: '' })
      .end(function (err, res) {
        // console.log(res.body)
        // console.log(err)
        expect(res.body.err).to.equal('username is empty');
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        done();
      });
  });
  it('Insert username long', function (done) {
    chai.request(url)
      .post('/newUser')
      .query({test: true})
      .send({ username: 'test other supername very very very very very long' })
      .end(function (err, res) {
        // console.log(res.body)
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      });
  });
  it('List all users', function (done) {
    chai.request(url)
      .get('/users')
      .query({test: true})
      .end(function (err, res) {
        // console.log(res.body)
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      });
  });
});
