// jshint esversion: 6

function rot13 (str) {
  let result = '';
  let pos = 0;
  for (let i = 0; i < str.length; i++) {
    if (/[\W_]+/g.test(str[i])) {
      result += str[i];
    } else {
      pos = str[i].charCodeAt(0);
      if (pos < 78) {pos = pos + 26; }
      result += String.fromCharCode(pos - 13);
    }
  }
  return result;
}

console.log(rot13('SERR PBQR PNZC'));
