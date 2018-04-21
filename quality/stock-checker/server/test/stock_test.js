/*eslint no-dupe-keys: "warn"*/

console.log('STOCK_TEST');

const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = require('chai').expect;
const db = require('./../dbfile.js');

chai.use(chaiHttp);
const dbfile_test = './data_test.json';
const url = 'https://stock-checker-v2.glitch.me';
// const url = 'http://localhost:3000'

describe('Stock Price Checker', function () {
  before(function (done) {
    /*db.writeAll(dbfile_test, template, function () {
      console.log('HECHO');
      done();
    });*/
  // done()
  });
  it('1 stock', function (done) {
    chai.request(url)
      .get('/v1/stock-prices')
      .query({  stock: 'goog' })
      //.send({ stock: 'goog' })
      .end(function (err, res) {
        console.log(res.body.stockData);
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.stockData[0]).to.have.property('stock', 'GOOG');
        done();
      });
  });
  it('1 stock with like', function (done) {
    chai.request(url)
      .get('/v1/stock-prices')
      .query({ stock: 'goog', like: true })
      .end(function (err, res) {
        console.log(res.body.stockData);
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      });
  });
  it('Same stock with like', function (done) {
    chai.request(url)
      .get('/v1/stock-prices')
      .query({ stock: 'goog', like: true })
      .end(function (err, res) {
        // console.log(res.body)
        // console.log(err)
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      });
  });
  it('2 stocks', function (done) {
    chai.request(url)
      .get('/v1/stock-prices')
      .query({ stock: 'goog', stock: 'mmm' })
      .end(function (err, res) {
        // console.log(res.body)
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      });
  });
  it('2 stocks with like', function (done) {
    chai.request(url)
      .get('/v1/stock-prices')
      .query({ stock: 'goog', stock: 'mmm', like: true })
      .end(function (err, res) {
        // console.log(res.body)
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      });
  });
});

const template = {
  'AAPL': {
    'ips': [
      '127.0.0.1',
      '127.0.0.2'
    ],
    'likes': 2
  },
  'GOOG': {
    'ips': [
      '127.0.0.1',
      '127.0.0.2',
      '::1'
    ],
    'likes': 3
  },
  'MMM': {
    'ips': [
      '127.0.0.1',
      '::1'
    ],
    'likes': 2
  },
  'MSFT': {
    'ips': [
      '127.0.0.1',
      '127.0.0.2'
    ],
    'likes': 2
  },
  'FB': {
    'ips': [
      '::1'
    ],
    'likes': 1
  }
};
