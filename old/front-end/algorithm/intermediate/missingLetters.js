// jshint esversion: 6

function fearNotLetter (str) {
  const test = 'abcdefghijklmnopqrstuvwxyz';
  let begin = test.indexOf(str[0]);
  console.log(test[begin]);
  for (let i = 0; i < str.length; i++) {
    if (str[i] !== test[begin + i]) {
      console.log('BINGO --> ', str[i], ' !== ', test[begin + i]);
      return test[begin + i];
    }
  }
  return undefined;
}

// console.log(fearNotLetter('abce'))
console.log(fearNotLetter('stvwx'));
