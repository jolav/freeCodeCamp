// jshint esversion: 6

function truncateString (str, num) {
  if (str.length <= num) {
    return str;
  }
  if (num < 4) {
    return str.slice(0, num) + '...';
  }
  return str.slice(0, num - 3) + '...';
}

console.log(truncateString('A-tisket a-tasket A green and yellow basket', 8));
