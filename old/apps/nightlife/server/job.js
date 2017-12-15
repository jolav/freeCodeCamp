const lib = require('./serverlib.js');
const querystring = require('querystring');
const db = require('./db.js');

function getLocation (req, res) {
  const loc = encodeURIComponent(req.params.location); // special chars loc
  const options = {
    host: 'api.yelp.com',
    path: '/v3/businesses/search?term=bar&location=' + loc,
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + global.ct.config.yelp.token
    }
  };
  lib.makeRequest(options, null, function (err, data) {
    let calls = data.businesses.length;
    for (let i = 0; i < calls; i++) {
      db.getVotes(data.businesses[i].id, function (votes) {
        data.businesses[i].going = votes;
        calls--;
        if (calls <= 0) {
          lib.sendResult(req, res, data.businesses, 200);
        }
      });
    }
  });
/*lib.loadJSONfile('data.json', 0, function (data) {
  lib.sendResult(req, res, data.businesses, 200)
});*/
}

function getYelpAccessToken (req, res) {
  const parameters = querystring.stringify({
    'grant_type': 'client_credentials',
    'client_id': global.ct.config.yelp.id,
    'client_secret': global.ct.config.yelp.secret
  });
  const options = {
    host: 'api.yelp.com',
    path: '/oauth2/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(parameters)
    }
  };
  lib.makeRequest(options, parameters, function (err, data) {
    lib.sendResult(req, res, data, 200);
  });
}

module.exports = {
  getLocation: getLocation
};
