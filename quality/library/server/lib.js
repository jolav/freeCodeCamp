/* */

console.log('LIB.JS');

function sendResult (req, res, w, status) {
  res.setHeader('Content-Type', 'application/json');
  res.status(status).send(JSON.stringify(w, null, 3));
}

module.exports = {
  sendResult: sendResult
};
