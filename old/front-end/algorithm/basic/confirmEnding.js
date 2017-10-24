// jshint esversion: 6

function confirmEnding (str, target) {
  str = str.substr(str.length - target.length, target.length);
  return str === target;
}

// console.log(confirmEnding('Bastian', 'n'))
console.log(confirmEnding('He has to give me a new name', 'name'));
