const express = require('express');
const app = express();
const lib = require('./../lib.js');
const db = require('./db.js');
const dns = require('dns');

app.get('/list', function (req, res) {
  // console.log('LIST')
  db.getAllUrls(function (data) {
    lib.sendResult(res, data, 200);
  });
});

app.get('/new/*', function (req, res) {
  const q = req.params[0];
  // console.log('NEW', q)
  let output = {
    short: q,
    original: `${q} is a unknown host or not a valid hostname`
  };
  if (lib.isValidHostname(q)) {
    dns.lookup(q, function (err, ip) {
      if (err || ip === null || ip === undefined) {
        lib.sendResult(res, output, 400);
        return;
      }
      db.getAllUrls(function (data) {
        let found = false;
        data.forEach(function (element) {
          if (element.original == q) {
            output.original = `${q} already exists as short = ${element.short}`;
            found = true;
          }
        });
        if (found) {
          lib.sendResult(res, output, 200);
          return;
        }
        db.saveNewUrl(q, function (data) {
          output.short = data.ops[0].short;
          output.original = data.ops[0].original;
          lib.sendResult(res, output, 200);
        });
        return;
      });
    });
  } else {
    lib.sendResult(res, output, 400);
  }
});

app.get('/*', function (req, res) {
  const number = req.params[0];
  // console.log('NUMBER', number)
  db.getAllUrls(function (data) {
    let found = false;
    let output = {
      short: number,
      original: `Doesn't exist a shortened URL number ${number}`
    };
    data.forEach(function (element) {
      if (element.short == number) {
        output.original = element.original;
        found = true;
      }
    });
    if (!found) {
      lib.sendResult(res, output, 200);
    } else {
      res.redirect('http://' + output.original);
    }
  });
});

module.exports = app;
