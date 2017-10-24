// jshint esversion: 6

function destroyer (arr) {
  arr = arguments[0];
  let args = [];
  for (let i in arguments) {
    if (i > 0) {
      args.push(arguments[i]);
    }
  }
  let result = arr.filter(function (val) {
    if (args.indexOf(val) === -1) {
      return val;
    }
  });
  return result;
}

console.log(destroyer([1, 2, 3, 1, 2, 3], 2, 3));
