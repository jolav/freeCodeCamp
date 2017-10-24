// jshint esversion: 6

function factorialize (num) {
  if (num === 0 || num === 1) {
    return 1;
  }
  let total = 1;
  for (let i = 2; i <= num; i++) {
    total *= i;
  }
  return total;
}

console.log(factorialize(5));
