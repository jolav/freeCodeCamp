// jshint esversion: 6

function spinalCase (str) {
  return str.replace(/(?!^)([A-Z])/g, ' $1')
    .replace(/[_\s]+(?=[a-zA-Z])/g, '-').toLowerCase();
}

console.log(spinalCase('ThisIs Spinal Tap'));
