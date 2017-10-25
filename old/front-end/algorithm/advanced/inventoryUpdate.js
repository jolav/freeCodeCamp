// jshint esversion: 6

function updateInventory (current, update) {
  let stock = current.slice();
  let aux = [];
  for (let i = 0; i < current.length; i++) {
    aux[i] = current[i][1];
  }
  for (let i = 0; i < update.length; i++) {
    if (aux.indexOf(update[i][1]) !== -1) {
      stock[aux.indexOf(update[i][1])][0] += update[i][0];
    } else {
      stock.push([update[i][0], update[i][1]]);
    }
  }
  stock.sort(function (a, b) {
    if (a[1] === b[1]) {
      return 0;
    } else {
      return (a[1] < b[1]) ? -1 : 1;
    }
  });
  return stock;
}

const curInv = [
  [21, 'Bowling Ball'],
  [2, 'Dirty Sock'],
  [1, 'Hair Pin'],
  [5, 'Microphone']
];

const newInv = [
  [2, 'Hair Pin'],
  [3, 'Half-Eaten Apple'],
  [67, 'Bowling Ball'],
  [7, 'Toothpaste']
];

console.log(updateInventory(curInv, newInv));
