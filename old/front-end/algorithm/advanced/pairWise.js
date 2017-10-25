// jshint esversion: 6

function pairwise (arr, arg) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (i !== j && arr[i] + arr[j] === arg) {
        if (result.indexOf(i) === -1 && result.indexOf(j) === -1) {
          result.push(i, j);
        }
      }
    }
  }
  if (arr.length === 0) {
    return 0;
  }
  result = result.reduce(function (a, b) {
    return a + b;
  });
  return result;
}

console.log(pairwise([1, 4, 2, 3, 0, 5], 7));
