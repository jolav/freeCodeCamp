// jshint esversion: 6

function whatIsInAName (collection, source) {
  let arr = [];
  let wanted = Object.keys(source);
  console.log(wanted);
  for (let i = 0; i < collection.length;i++) {
    console.log('Estudiando --> ', collection[i]);
    let insert = true;
    for (let j = 0; j < wanted.length; j++) {
      if (collection[i].hasOwnProperty(wanted[j])) {
        if (collection[i][wanted[j]] !== source[wanted[j]]) {
          insert = false;
        }
      }
      if (!collection[i].hasOwnProperty(wanted[j])) {
        insert = false;
      }
    }
    if (insert) {
      arr.push(collection[i]);
    }
  }
  return arr;
}

whatIsInAName([{ first: 'Romeo', last: 'Montague' }, { first: 'Mercutio', last: null }, { first: 'Tybalt', last: 'Capulet' }], { last: 'Capulet' });
