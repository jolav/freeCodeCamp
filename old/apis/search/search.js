const express = require('express');
const app = express();
const lib = require('./../lib.js');
const db = require('./db.js');

app.get('/recent', function (req, res) {
  db.getAllImages(function (data) {
    lib.sendResult(res, data, 200);
  });
});

app.get('/search*', function (req, res) {
  let items = [];
  let quest = req.query.q;
  let num = req.query.num || 10;
  let offset = req.query.offset || 0;
  const key = global.ct.config.apiImage.key;
  const cseID = global.ct.config.apiImage.cseID;
  let urlData = `https://www.googleapis.com/customsearch/v1?q=${quest}&num=${num}&offset=${offset}&key=${key}&cx=${cseID}`;
  db.saveNewSearch(quest);
  lib.makeHttpsRequest(urlData, function (err, data) {
    if (err) throw err;
    let link, thumbnail;
    data = data.items;
    data.forEach(element => {
      if (element.pagemap.cse_image === undefined) {
        link = '';
      } else {
        link = element.pagemap.cse_image[0].src;
      }
      if (element.pagemap.cse_thumbnail === undefined) {
        thumbnail = '';
      } else {
        thumbnail = element.pagemap.cse_thumbnail[0].src;
      }
      let item = {
        title: element.title || 'title',
        link: link || 'link',
        snippet: element.snippet || 'snippet',
        thumbnail: thumbnail || 'thumbnail'
      };
      items.push(item);
      item = {};
    });
    lib.sendResult(res, items, 200);
  });
/*lib.loadJSONfile('./search/kk.json', 0, function (data) {
});*/
});

module.exports = app;
