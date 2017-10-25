// jshint esversion: 6

function sumAll (arr) {
  let max = Math.max(...arr);
  let min = Math.min(...arr);
  for (let i = 0; i <= max - min; i++) {
    arr[i] = min + i;
  }
  let sum = arr.reduce(function (a, b) {
    return a + b;
  });
  return sum;
}

console.log(sumAll([1, 4]));
