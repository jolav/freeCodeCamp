// jshint esversion: 6

function uniteUnique (arr) {
  let res = [];
  for (let i = 0; i < arguments.length; i++) {
    for (let j = 0; j < arguments[i].length; j++) {
      if (res.indexOf(arguments[i][j]) === -1) {
        res.push(arguments[i][j]);
      }
    }
  }
  return res;
}

console.log(uniteUnique([1, 3, 2], [5, 2, 1, 4], [2, 1]));
