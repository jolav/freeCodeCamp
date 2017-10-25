// jshint esversion: 6

function pairElement (str) {
  str = str.split('');
  let res = [];
  let aux = [];
  for (let i = 0; i < str.length; i++) {
    aux[0] = str[i];
    aux[1] = pair(str[i]);
    res.push(aux);
    aux = [];
  }
  return res;
}

function pair (str) {
  if (str === 'C') {return 'G';}
  if (str === 'G') {return 'C';}
  if (str === 'A') {return 'T';}
  if (str === 'T') {return 'A';}
}

console.log(pairElement('GCG'));
