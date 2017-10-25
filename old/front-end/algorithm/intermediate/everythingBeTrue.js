// jshint esversion: 6

function truthCheck (collection, pre) {
  let cont = 0;
  for (let i in collection) {
    if (collection[i].hasOwnProperty(pre) && Boolean(collection[i][pre])) {
      cont++;
    }
  }
  if (cont === collection.length) {
    return true;
  } else {
    return false;
  }
}

console.log(truthCheck([{ 'user': 'Tinky-Winky', 'sex': 'male' }, { 'user': 'Dipsy', 'sex': 'male' }, { 'user': 'Laa-Laa', 'sex': 'female' }, { 'user': 'Po', 'sex': 'female' }], 'sex'));
