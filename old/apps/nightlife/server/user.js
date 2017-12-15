const db = require('./db.js');
const lib = require('./serverlib.js');

function createUser (req, res) {
  const user = req.body.username;
  const pass = req.body.password;
  db.userExists(user, function (exists) {
    if (exists) {
      // console.log('USER... ', user, ' ...ALREADY EXIST')
      lib.sendResult(req, res, { created: false }, 200);
    } else {
      db.saveUser(user, pass, (result) => {
        if (result.result.ok) {
          // console.log('USER...' , user , '...SAVED OK')
          lib.sendResult(req, res, { created: true }, 200);
        }
      });
    }
  });
}

function authenticateUser (req, res) {
  const user = req.body.username;
  const pass = req.body.password;
  if (req.session.logged) {
    return;
  }
  db.isValidUser(user, pass , function (isValid, lastSearch) {
    if (isValid) {
      req.session.logged = user + ':' + req.session.id;
      // console.log('USER...', user, '...LOGGED', req.session.logged)
      const result = {
        logged: true,
        lastSearch: lastSearch
      };
      lib.sendResult(req, res, result, 200);
    } else {
      // console.log('USER...' , user , '...NOT LOGGED')
      lib.sendResult(req, res, { logged: false }, 200);
    }
  });
}

function saveLastSearch (req, res) {
  const user = req.session.logged.split(':')[0];
  const search = req.params.location;
  try {
    db.updateSearch(user, search);
  } catch (e) {
    console.log('Fail updating search ...', e);
  }
}

function voteBar (req, res) {
  const user = req.body.user;
  const barid = req.body.barid;
  db.barExists(barid, function (exists) {
    if (exists) {
      db.updateBar(barid, user, function (result, action) {
        lib.sendResult(req, res, { 'action': action }, 200);
      });
    } else {
      db.saveBar(barid, user, (result) => {
        if (result.result.ok) {
          lib.sendResult(req, res, { 'action': 'add' }, 200);
        }
      });
    }
  });
}

function isLogged (req, res, next) {
  if (!req.session.logged) {
    res.send('You are not authorized to view this page');
  } else {
    next();
  }
}

function isNotLogged (req, res, next) {
  if (!req.session.logged) {
    next();
  }
}

module.exports = {
  createUser: createUser,
  authenticateUser: authenticateUser,
  isLogged: isLogged,
  isNotLogged: isNotLogged,
  saveLastSearch: saveLastSearch,
  voteBar: voteBar
};
