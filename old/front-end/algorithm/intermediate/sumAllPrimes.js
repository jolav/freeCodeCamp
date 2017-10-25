// jshint esversion: 6

function sumPrimes (limit) {
  let total = 2;
  for (let num = 3; num <= limit; num++) {
    if (isPrime(num)) {
      total += num;
    }
  }
  return total;
}

function isPrime (num) {
  for (let i = 2; i < num; i++) {
    if (num % i === 0) {
      return false;
    }
  }
  return true;
}

console.log(sumPrimes(10));
