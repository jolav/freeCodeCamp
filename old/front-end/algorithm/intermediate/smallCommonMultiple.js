// jshint esversion: 6

function smallestCommons (arr) {
  arr = arr.sort(function (a, b) {
    return a - b;
  });
  let test = [];
  let min = arr[0];
  let max = arr[1];
  let index = max * 2;
  let found = false;
  for (let i = min; i <= max; i++) {
    test.push(i);
  }
  while (!found) {
    if (isOk(index, test) && isOk(index, test)) {
      found = true;
    }
    index++;
  }
  return index - 1;
}

function isOk (num, test) {
  for (let i = 0; i < test.length; i++) {
    if (num % test[i] !== 0) {
      return false;
    }
  }
  return true;
}

console.log(smallestCommons([1, 5 ]));
console.log(smallestCommons([1, 5 ]));
console.log(smallestCommons([5, 1 ]));
console.log(smallestCommons([1, 13 ]));
console.log(smallestCommons([23, 18 ]));
