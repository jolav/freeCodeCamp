// jshint esversion: 6

function slasher (arr, howMany) {
  if (howMany >= arr.length) {
    return [];
  }
  return arr.slice(howMany, arr.length);
}

console.log(slasher([1, 2, 3], 2));
