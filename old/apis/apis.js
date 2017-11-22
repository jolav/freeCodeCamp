const express = require('express');
const app = express();
const lib = require('./lib.js');
const filePath = ('./config.json');

const time = require('./time/time.js');
const parser = require('./parser/parser.js');
const url = require('./url/url.js');
// const image = require('./image/image.js')
const file = require('./file/file.js');

global.ct = {};

const port = process.env.PORT || 3000;

app.disable('x-powered-by');

// routes
app.use('/time', time);
app.use('/parser', parser);
app.use('/url', url);
// app.use('/image', image)
app.use('/file', file);

app.get('*', (req, res) => {
  // res.redirect('https://freecodecamp.codetabs.com')
  res.status(404).send('Not Found');
});

app.listen(
  port,
  () => {
    console.log('Express server listening on port ' + port);
  },
  initApp()
);

function initApp () {
  lib.loadJSONfile(filePath, 0, function (data) {
    global.ct.config = data;
    testUrlDB();
  });
}

function testUrlDB () {
  const user = global.ct.config.mongodb.user;
  const password = global.ct.config.mongodb.password;
  const dburl = 'mongodb://' + user + ':' + password + '@ds113906.mlab.com:13906/old-fcc-apis';
  /*mongo.connect(dburl, function (err, db) {
    if (err) throw err
    console.log('Connected correctly to server')
    global.ct.config.dburl = dburl
    db.close()
  });*/
  // console.log(dburl)
  global.ct.config.dburl = dburl;
}

module.exports = app;
