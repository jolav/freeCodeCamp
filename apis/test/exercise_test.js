/* */

console.log('EXERCISE_TEST');

const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = require('chai').expect;
const db = require('./../db.js');

chai.use(chaiHttp);
const url = 'https://apis-v2-jolav.glitch.me/exercise/v1';
// const url = 'http://localhost:3000/exercise/v1'

describe('Exercises TEST', function () {
  before(function (done) {
    let c = {
      connection: process.env.DB_URI_TEST,
      dbname: process.env.DB_NAME_TEST,
      collectionName: 'exercise-tracker'
    };
    // db.createCollection(c, function () {
    db.dropCollection(c, function () {
      //     db.createCollection(c, function () {
      done();
    });
  // })
  // done()
  });
  it('Insert multiples exercise for user username', function (done) {
    chai.request(url)
      .post('/newExercise')
      .query({test: true})
      .send({ user: 'username', desc: 'task1',min: '100', date: '2012-01-01' })
      .end(function (err, res) {
        // console.log(res.body)
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
      });
    chai.request(url)
      .post('/newExercise')
      .query({test: true})
      .send({ user: 'username', desc: 'task2',min: '20', date: '2013-01-01' })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
      });
    chai.request(url)
      .post('/newExercise')
      .query({test: true})
      .send({ user: 'username', desc: 'task3',min: '10', date: '2014-01-01' })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
      });
    chai.request(url)
      .post('/newExercise')
      .query({test: true})
      .send({ user: 'username', desc: 'task4',min: '10', date: '2015-01-01' })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
      });
    chai.request(url)
      .post('/newExercise')
      .query({test: true})
      .send({ user: 'username', desc: 'task5',min: '10', date: '2016-01-01' })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
      });
    chai.request(url)
      .post('/newExercise')
      .query({test: true})
      .send({ user: 'username', desc: 'task6',min: '10', date: '2017-01-01' })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
      });
    chai.request(url)
      .post('/newExercise')
      .query({test: true})
      .send({ user: 'username', desc: 'task7',min: '10', date: '2017-01-01' })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
      });
    chai.request(url)
      .post('/newExercise')
      .query({test: true})
      .send({ user: 'username', desc: 'task8',min: '10', date: '2018-01-01' })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
      });
    chai.request(url)
      .post('/newExercise')
      .query({ test: true })
      .send({ user: 'username', desc: 'task9', min: '10', date: '2019-01-01' })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      });
  });

  const today = new Date().toISOString().split('T')[0];

  it('Insert exercise without date', function (done) {
    chai.request(url)
      .post('/newExercise')
      .query({ test: true })
      .send({ user: 'test', desc: 'desc', min: '10', date: '' })
      .end(function (err, res) {
        expect(res.body[res.body.length - 1].date).to.deep.equal(today);
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      });
  });

  it('Insert exercise with incorrect type from date', function (done) {
    chai.request(url)
      .post('/newExercise')
      .query({ test: true })
      .send({ user: 'test', desc: 'desc', min: '10', date: 'aaaa' })
      .end(function (err, res) {
        expect(res.body.err).to.equal('incorrect date');
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        done();
      });
  });
  it('Insert exercise with incorrect from date', function (done) {
    chai.request(url)
      .post('/newExercise')
      .query({ test: true })
      .send({ user: 'test', desc: 'desc', min: '10', date: '2000-13-20' })
      .end(function (err, res) {
        expect(res.body.err).to.equal('incorrect date');
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        done();
      });
  });
  it('Get user log', function (done) {
    chai.request(url)
      .get('/log')
      .query({ test: true, user: 'username' })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.lengthOf(9);
        done();
      });
  });
  it('Get conditional user log', function (done) {
    chai.request(url)
      .get('/log')
      .query({
        test: true, user: 'username',
        from: '2014-05-05', to: '2016-05-05', limit: 5
      })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.lengthOf(2);
        done();
      });
  });
  it('Get conditional user log 2', function (done) {
    chai.request(url)
      .get('/log')
      .query({
        test: true, user: 'username',
        from: '2013-05-05', to: '2016-05-50', limit: 1
      })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        expect(res.body.err).to.equal('incorrect date');
        done();
      });
  });
  it('Get conditional user log 3', function (done) {
    chai.request(url)
      .get('/log')
      .query({
        test: true, user: 'username',
        from: '2013-05-05', limit: 1
      })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.lengthOf(1);
        done();
      });
  });
  it('Get conditional user log 4', function (done) {
    chai.request(url)
      .get('/log')
      .query({
        test: true, user: 'username',
        from: '2013-05-05', limit: 10
      })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.lengthOf(6);
        done();
      });
  });

  it('List all Exercises', function (done) {
    chai.request(url)
      .get('/exercises')
      .query({ test: true })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      // console.log(res.body)
      });
  });
});
