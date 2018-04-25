/*eslint no-dupe-keys: "warn"*/

console.log('ISSUE_TEST');

const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = require('chai').expect;
const db = require('./../db.js');

require('dotenv').config({ path: __dirname + '/../.env' });


chai.use(chaiHttp);
const url = 'https://issue-tracker-v2.glitch.me/';
//const url = 'http://localhost:3000';

describe('ISSUES', function () {
  before(function (done) {
    let c = {
      connection: process.env.DB_URI_TEST,
      dbname: process.env.DB_NAME_TEST,
      collectionName: 'issues'
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
  it('POST /v1/project every field filled in', function (done) {
    chai.request(url)
      .post('/v1/project')
      .query({
        test: true,
        title: 'test 1',
        text: "text 1",
        createdBy: "createdBy 1",
        assignedTo: "assignedTo 1"
      })
      .end(function (err, res) {
        // console.log(res.body)
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      });
  });
  it('POST /v1/project required fields filled in', function (done) {
    chai.request(url)
      .post('/v1/project')
      .query({
        test: true,
        title: 'test 2',
        text: "text 2",
        createdBy: "createdBy 2"
      })
      .end(function (err, res) {
        // console.log(res.body)
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      });
  });
  it('POST /v1/project missing required fields', function (done) {
    chai.request(url)
      .post('/v1/project')
      .query({
        test: true,
        title: 'test 3'
      })
      .end(function (err, res) {
        // console.log(res.body)
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        done();
      });
  });
  it('PUT /v1/project no id', function (done) {
    chai.request(url)
      .put('/v1/project')
      .query({ test: true })
      .end(function (err, res) {
        //console.log(res.body);
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.error).to.equal("no updated field sent");
        done();
      });
  });
  it('PUT /v1/project one field to update', function (done) {
    chai.request(url)
      .put('/v1/project')
      .query({
        test: true,
        issueID: 1,
        title: "NEW COOL TITLE TEST"
      })
      .end(function (err, res) {
        //console.log(res.body);
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      });
  });
  it('PUT /v1/project update multiple fields', function (done) {
    chai.request(url)
      .put('/v1/project')
      .query({
        test: true,
        issueID: 2,
        title: "TITLE 2",
        text: "TEXT 2",
        close: true
      })
      .end(function (err, res) {
        //console.log(res.body);
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      });
  });
  it('GET /v1/project no filter', function (done) {
    chai.request(url)
      .get('/v1/project')
      .query({test: true})
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.have.property('_id', 1);
        expect(res.body[0]).to.have.property('title', 'NEW COOL TITLE TEST');
        expect(res.body[1]).to.have.property('isOpen', false);
        done();
      });
  });
  it('DELETE /v1/project no _id ', function (done) {
    chai.request(url)
      .delete('/v1/project')
      .query({
        test: true,
        id: 1000
      })
      .end(function (err, res) {
        //console.log(res.body)
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.message).to.equal("could not delete 1000");
        done();
      });
  });
  it('DELETE /v1/project valid _id', function (done) {
    chai.request(url)
      .delete('/v1/project')
      .query({
        test: true,
        id: 2
      })
      .end(function (err, res) {
        //console.log(res.body);
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      });
  });
});