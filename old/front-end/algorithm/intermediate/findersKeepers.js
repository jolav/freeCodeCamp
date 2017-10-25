// jshint esversion: 6

function findElement (arr, func) {
  let num = arr.filter(test);
  return num[0];
}

function test (num) {
  return num % 2 === 0;
}

console.log(findElement([1, 2, 3, 4], function (num) { return num % 2 === 0; }));
