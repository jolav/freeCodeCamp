/* */

const https = require('https');
const db = require("./dbfile.js");

async function checkPrices(req, cb) {
  let w = {
    result: { stockData: [] },
    err: {
      'message': undefined,
      'status': 200
    }
  };
  const input = [];
  if (Array.isArray(req.query.stock)) {
    input[0] = req.query.stock[0].toUpperCase();
    input[1] = req.query.stock[1].toUpperCase();
  } else {
    input[0] = req.query.stock.toUpperCase();
    input[1] = undefined;
  }
  w = await getStockValue(input, w);
  if (req.query.like) {
    await doLikes(req, input);
  }
  w = await getLikesValue(input, w);
  if (w.err.message) {
    return cb(w.err);
  }
  return cb(w.result);
}

function doLikes(req, input) {
  const ip = getIP(req);
  return new Promise((resolve, reject) => {
    db.readAll(undefined, function (stocks) {
      for (let i of input) {
        if (i) {
          if (stocks[i]) {
            if (stocks[i].ips.indexOf(ip) === -1) {
              stocks[i].likes++;
              stocks[i].ips.push(ip);
            } 
          } else {
            stocks[i] = {
              'ips': [
                ip
              ],
              'likes': 1
            };            
          }
        }
      }
      db.writeAll(undefined, stocks, function () {
        resolve();
      });
    });
  });
}

function getLikesValue(input, w) {
  return new Promise((resolve, reject) => {
    db.readAll(undefined, function (stocks) {
      if (input[1] === undefined) { // only 1 symbol
        if (stocks[input[0]]) {
          w.result.stockData[0].likes = stocks[input[0]].likes;
        } else {
          w.result.stockData[0].likes = 0;
        }
      } else { // 2 symbols
        let likes0 = 0;
        let likes1 = 1;
        if (stocks[input[0]]) {
          likes0 = stocks[input[0]].likes;
        }
        if (stocks[input[1]]) {
          likes1 = stocks[input[1]].likes;
        }
        w.result.stockData[0].rel_likes = likes0 - likes1;
        w.result.stockData[1].rel_likes = likes1 - likes0;
      }  
      resolve(w);
    });
  });
}

function getStockValue (input, w) {
  return new Promise((resolve, reject) => {
    let getStockUrl = 'https://api.iextrading.com/1.0/tops/last?symbols=';
    if (input[1]) {
      getStockUrl += input[0] + ',' + input[1];
    } else {
      getStockUrl += input[0];
    }
    makeHttpsRequest(getStockUrl, function (err, res, data) {
      if (err) {
        console.log('Error => ', err);
        reject(-1);
      }
      let empty = "";
      for (let i = 0; i < data.length; i++) {
        if (objectIsEmpty(data[i])) {
          empty += " " + input[i];
        }
      }
      if (empty !== "") {
        w.err.message = "symbols not valid =>" + empty;
        w.err.status = 400;
        resolve(w);
      }
      for (const i of data) {
        let stock = {
          stock: i.symbol,
          price: i.price,
        };
        w.result.stockData.push(stock);
      }       
      resolve(w);
    });
  });
}

module.exports = {
  sendResult: sendResult,
  checkPrices: checkPrices
};

function getIP (req) {
  return (req.headers['x-forwarded-for'] ||
  req.connection.remoteAddress || req.socket.remoteAddress ||
  req.connection.socket.remoteAddress).split(',')[0];
}

function sendResult (req, res, w, status) {
  res.setHeader('Content-Type', 'application/json');
  res.status(status).send(JSON.stringify(w, null, 3));
}

function makeHttpsRequest (path, callback) {
  https.get(path, (res) => {
    res.setEncoding('utf8');
    var body = '';
    res.on('data', (d) => {
      body += d;
    });
    res.on('end', () => {
      try {
        var parsed = JSON.parse(body);
      } catch (err) {
        console.error('Unable to parse response as JSON', err);
        return callback(err, null, null);
      }
      callback(null, res, parsed);
    });
  }).on('error', (err) => {
    console.error('Error with the request:', err.message);
    callback(err, null, null);
  });
}

function objectIsEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}
