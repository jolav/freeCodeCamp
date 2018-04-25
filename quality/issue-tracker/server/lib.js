/* */

console.log('LIB.JS');

function sendResult (req, res, w, status) {
  res.setHeader('Content-Type', 'application/json');
  res.status(status).send(JSON.stringify(w, null, 3));
}

function getIssue (issue, data) {
  for (let i of data) {
    if (i._id === parseInt(issue)) {
      return i;
    }
  }
  const w = {
    message: `issue number ${issue} not found`,
    status: 400
  };
  return w;
}

module.exports = {
  sendResult: sendResult,
  getIssue: getIssue
};
