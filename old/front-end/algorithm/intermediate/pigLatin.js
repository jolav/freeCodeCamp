// jshint esversion: 6

function translatePigLatin (str) {
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  let done = false;
  let i = 0;
  if (vowels.indexOf(str[0]) !== -1) {
    return str + 'way';
  } else {
    while (!done && i < str.length) {
      if (vowels.indexOf(str[i]) !== -1) {
        str = str[i] + str.slice(i + 1, str.length) + str.substring(0, i) + 'ay';
        done = true;
      }
      i++;
    }
  }
  return str;
}

// console.log(translatePigLatin('consonant'))
// console.log(translatePigLatin('glove'))
console.log(translatePigLatin('glvsssss'));
