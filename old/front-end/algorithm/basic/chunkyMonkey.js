// jshint esversion: 6

function chunkArrayInGroups (arr, size) {
  let result = [];
  for (let i = 0; i < arr.length / size; i++) {
    result.push(arr.slice(i * size , (i + 1) * size));
  }
  return result;
}

// console.log(chunkArrayInGroups(['a', 'b', 'c', 'd'], 2))
// console.log(chunkArrayInGroups([0, 1, 2, 3, 4, 5], 4))
console.log(chunkArrayInGroups([0, 1, 2, 3, 4, 5, 6, 7, 8], 4));
