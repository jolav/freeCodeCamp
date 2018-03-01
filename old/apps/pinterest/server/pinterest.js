const express = require('express');
const app = express();
require('dotenv').config();
const lib = require('./serverlib.js');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const session = require('express-session');
const mongo = require('mongodb');
const twitter = require('./twitter.js');
const pics = require('./pics.js');

app.disable('x-powered-by');

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.set('trust proxy', 1); // trust first proxy
app.use(session({
  secret: process.env.SECRETSESSION,
  name: 'jolav-pinterest-clone',
  saveUninitialized: true,
  resave: false,
  cookie: {
    // secure: true // comment for localhost
  }
}));

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

/* AUTH */

const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  // console.log('SERIALIZE', user, done)
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  // console.log('DESERIALIZE', id, done)
  twitter.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new TwitterStrategy({
  consumerKey: process.env.APIKEY,
  consumerSecret: process.env.APISECRET,
  callbackURL: process.env.CALLBACK_PROD
}, function (token, tokenSecret, profile, done) {
  // console.log('OIGA =>', token, tokenSecret)
  twitter.findUserOrCreate(profile, function (err, user) {
    done(err, user);
  });
}
));

app.use(function (req, res, next) {
  // console.log('MW =>', req.user /*req.session.passport*/)
  next();
});

// routes 
app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', passport.authenticate('twitter', {              successRedirect: '/auth/twittersuccess',
  failureRedirect: '/auth/twitterfail',
// session: false
}));

app.get('/auth/twittersuccess', function (req, res) {
  // console.log('SUCCESS', req.user)
  res.redirect('https://jolav.me/freecodecamp/old/apps/pinterest/pinterest.html');
// res.redirect('http://127.0.0.1:8080/old/apps/pinterest/html/pinterest.html')
});

app.get('/auth/twitterfail', function (req, res) {
  // console.log('FAIL')
  res.statusCode = 503;
  res.json({ err: 'Unable to Validate User Credentials' });
});

app.get('/auth/logout' /*, user.isLogged*/, function (req, res) {
  // console.log('LOGOUT')
  req.session.destroy();
  lib.sendResult(req, res, { logout: true }, 200);
});

app.get('/auth/user', function (req, res) {
  // console.log('GET /auth/user :', req.user)
  const user = req.user ? req.user : {};
  res.send({success: req.user ? true : false, user});
});

app.get('/getpics', function (req, res) {
  // console.log('GET PICS')
  pics.getPics(req, res, function (pics) {
    lib.sendResult(req, res, { pics}, 200);
  });
});

app.post('/addpic', function (req, res) {
  // console.log('ADS PIC')
  pics.addPic(req, res, function () {
    lib.sendResult(req, res, {}, 200);
  });
});

app.post('/deletepic', function (req, res) {
  // console.log('DELETE PIC')
  pics.deletePic(req, res, function () {
    lib.sendResult(req, res, {}, 200);
  });
});

app.post('/votepic', function (req, res) {
  // console.log('VOTE PIC')
  pics.votePic(req, res, function () {
    lib.sendResult(req, res, {}, 200);
  });
});

app.get('*', function (req, res) {
  // res.redirect('https://jolav.me/freecodecamp')
  res.status(404).send('Not Found');
});

app.listen(
  port,
  () => {
    // console.log('Express server listening on port ' + port)
  },
  initApp()
);

function initApp () {
  // console.log('Init App')
  mongo.connect(process.env.DB, function (err, db) {
    if (err) throw err;
    // console.log('Connected correctly to server')
    db.close();
  });
// pics.fillDatabase()
}

module.exports = app;
