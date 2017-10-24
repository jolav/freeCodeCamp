// jshint esversion: 6

function findLongestWord (str) {
  str = str.split(' ');
  let longest = str[1];
  str.forEach(function (word) {
    if (word.length > longest.length) {
      longest = word;
    }
  });
  return longest.length;
}

console.log(findLongestWord('The quick brown fox jumped over the lazy dog'));
