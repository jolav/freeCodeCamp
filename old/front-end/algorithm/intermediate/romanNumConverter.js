// jshint esversion: 6

function convertToRoman (num) {
  let result = '';
  let ones, tens, hunds, thous;
  const hundsA = ['C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM'];
  const tensA = ['X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC'];
  const onesA = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
  thous = Math.floor(num / 1000);
  hunds = Math.floor(num % 1000 / 100);
  tens = Math.floor(num % 100 / 10);
  ones = Math.floor(num % 10);
  console.log(thous, hunds, tens, ones);
  for (let i = 0; i < thous;i++) {
    result += 'M';
  }
  if (hunds) {
    result += hundsA[hunds - 1];
  }
  if (tens) {
    result += tensA[tens - 1];
  }
  if (ones) {
    result += onesA[ones - 1];
  }
  return result;
}

console.log(convertToRoman(36));
