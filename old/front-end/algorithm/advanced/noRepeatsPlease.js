// jshint esversion: 6

function permAlone (str) {
  str = str.split('');
  let size = str.length;
  let permutations = [];
  generate(size, permutations, str);
  let repeated = /(\w)\1+/g;
  let result = permutations.filter(function (string) {
    return !string.match(repeated);
  });
  return result.length;
}

function generate (size, permutations, str) {
  if (size == 1) {
    permutations.push(str.join(''));
  } else {
    for (let i = 0; i < size; ++i) {
      generate(size - 1, permutations, str);
      if (size % 2 === 0) {
        swap(i, size - 1, str);
      } else {
        swap(0, size - 1, str);
      }
    }
  }
  return permutations;
}

function swap (a, b, str) {
  let aux = str[a];
  str[a] = str[b];
  str[b] = aux;
}

console.log(permAlone('aab'));
