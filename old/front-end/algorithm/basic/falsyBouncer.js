// jshint esversion: 6

function bouncer (arr) {
  let results = arr.filter(notFalsy);
  return results;
}

function notFalsy (val) {
  console.log(val);
  if (val === false || val === null || val === 0 || val === '' || val === undefined) {
    return;
  }
  return val;
}

console.log(bouncer([7, 'ate', '', false, 9]));
// console.log(bouncer([false, null, 0, NaN, undefined, '']))
