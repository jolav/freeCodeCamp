// jshint esversion: 6

function mutation (arr) {
  let check = true;
  arr[0] = arr[0].toLowerCase();
  arr[1] = arr[1].toLowerCase();
  arr[1].split('').forEach(function (letter, pos) {
    if (arr[0].indexOf(letter) === -1) {
      check = false;
    }
  });
  return check;
}

console.log(mutation(['hello', 'hey']));
