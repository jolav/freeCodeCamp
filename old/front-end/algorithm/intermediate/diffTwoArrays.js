// jshint esversion: 6

function diffArray (arr1, arr2) {
  let newArr = [];
  newArr = joinArrays(arr1, newArr);
  newArr = joinArrays(arr2, newArr);
  for (let i = 0; i < newArr.length; i++) {
    if (arr1.indexOf(newArr[i]) !== -1 && arr2.indexOf(newArr[i]) !== -1) {
      newArr.splice(i, 1);
      i--;
    }
  }
  return newArr;
}

function joinArrays (arr, newArr) {
  for (let i = 0; i < arr.length; i++) {
    // if (!newArr.includes(arr[i])) {    // ES7
    if ( (newArr.indexOf(arr[i]) === -1)) {
      newArr.push(arr[i]);
    }
  }
  return newArr;
}

console.log(diffArray([1, 2, 3, 5], [1, 2, 3, 4, 5]));
