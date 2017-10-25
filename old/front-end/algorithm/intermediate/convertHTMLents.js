// jshint esversion: 6

function convertHTML (str) {
  str = str.split('');
  for (let i = 0; i < str.length; i++) {
    str[i] = convert(str[i]);
  }
  return str.join('');
}

function convert (str) {
  if (str === '<') {return '&lt;';}
  if (str === '>') {return '&gt;';}
  if (str === '&') {return '&amp;';}
  if (str === '"') {return '&quot;';}
  if (str === "'") {return '&apos;';}
  return str;
}

convertHTML('Dolce & Gabbana');
