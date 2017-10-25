// jshint esversion: 6

function sym () {
  let args = [];
  for (let i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return args.reduce(symmetric);
}

function symmetric (a1, a2) {
  let result = [];
  a1.forEach(function (index) {
    if (a2.indexOf(index) === -1 && result.indexOf(index) === -1) {
      result.push(index);
    }
  });
  a2.forEach(function (index) {
    if (a1.indexOf(index) === -1 && result.indexOf(index) === -1) {
      result.push(index);
    }
  });
  return result;
}

console.log(sym([1, 2, 3], [5, 2, 1, 4]));
