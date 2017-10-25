// jshint esversion: 6

function orbitalPeriod (arr) {
  const GM = 398600.4418;
  const radius = 6367.4447;
  let result = [];
  for (let index in arr) {
    result.push({
      name: arr[index].name,
      orbitalPeriod: getOP(arr[index].avgAlt, GM, radius)
    });
  }
  return result;
}

function getOP (alt, GM, radius) {
  let op = 2 * Math.PI * Math.sqrt((Math.pow(alt + radius, 3) / GM));
  return Math.round(op);
}

console.log(orbitalPeriod([{name: 'sputnik', avgAlt: 35873.5553}]));
