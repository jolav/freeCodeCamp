// jshint esversion: 6

function titleCase (str) {
  str = str.toLowerCase().split(' ');
  let result = [];
  str.forEach(function (word) {
    result.push(word.replace(word[0], word[0].toUpperCase()));
  });
  return result.join(' ');
}

console.log(titleCase("I'm a little tea pot"));
