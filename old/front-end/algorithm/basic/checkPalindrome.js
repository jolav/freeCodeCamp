// jshint esversion: 6

function palindrome (str) {
  let check = true;
  str = str.toLowerCase().replace(/[^0-9a-z]/gi, '').split('');
  console.log(str);
  str.forEach(function (letter, pos) {
    if (letter !== str[str.length - 1 - pos ]) {
      check = false;
    }
  });
  return check;
}

// console.log(palindrome('eye'))
console.log(palindrome('A man, a plan, a canal. Panama'));
// console.log(palindrome('_eye2'))
// console.log(palindrome('almostomla'))
// console.log(palindrome('0_0 (: /-\ :) 0-0'))
