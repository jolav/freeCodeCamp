// jshint esversion: 6

function sumFibs (limit) {
  let total = 1;
  let serie = [0, 1];
  let i = 2;
  while (i <= limit) {
    let sum = serie[i - 1] + serie[i - 2];
    if (sum <= limit) {
      serie.push(sum);
      if (sum % 2 !== 0) {
        total += sum;
      }
    }
    i++;
  }
  return total;
}

console.log(sumFibs(4));
