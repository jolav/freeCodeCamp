/* */

const validLetters = 'abcdefghijklmnopqrstuvwxyz';
const validNumbers = '0123456789./';
const units = ['gal', 'l', 'lbs', 'kg', 'mi', 'km'];
const plural = {
  'gal': 'gallons',
  'l': 'liters',
  'lbs': 'pounds',
  'kg': 'kilograms',
  'mi': 'miles',
  'km': 'kilometers'
};

function convert (input) {
  let w = {
    data: {
      'InitNum': undefined,
      'InitUnit': undefined,
      'ReturnNum': undefined,
      'ReturnUnit': undefined,
      'Text': undefined
    },
    err: {
      'message': undefined,
      'status': 200
    }
  };
  w = parseInput(input.toLowerCase(), w);
  if (w.err.message) {
    // console.log('return error')
    return w.err;
  }
  w = doConversion(w);
  // console.log('return data')
  return w.data;
}

function doConversion (w) {
  const pre = 5;
  const post = 5;
  switch (w.data.InitUnit) {
    case 'gal':
      w.data.ReturnUnit = 'l';
      w.data.ReturnNum = (3.78541 * w.data.InitNum);
      break;
    case 'l':
      w.data.ReturnUnit = 'gal';
      w.data.ReturnNum = (0.26417 * w.data.InitNum);
      break;
    case 'lbs':
      w.data.ReturnUnit = 'kg';
      w.data.ReturnNum = (0.45359 * w.data.InitNum);
      break;
    case 'kg':
      w.data.ReturnUnit = 'lbs';
      w.data.ReturnNum = (2.20462 * w.data.InitNum);
      break;
    case 'mi':
      w.data.ReturnUnit = 'km';
      w.data.ReturnNum = (1.60934 * w.data.InitNum);
      break;
    case 'km':
      w.data.ReturnUnit = 'mi';
      w.data.ReturnNum = (0.62137 * w.data.InitNum);
      break;
  }
  w.data.InitNum = Number(Number(w.data.InitNum).toFixed(pre));
  w.data.ReturnNum = Number(Number(w.data.ReturnNum).toFixed(post));
  const a1 = plural[w.data.InitUnit];
  const a2 = plural[w.data.ReturnUnit];
  w.data.Text = `${w.data.InitNum} ${a1} converts to ${w.data.ReturnNum} ${a2}`;
  return w;
}

function parseInput (input, w) {
  if (units.indexOf(input) !== -1) {
    w.data.InitNum = 1;
    w.data.InitUnit = input;
    return w;
  }
  let part1 = '';
  let part2 = '';
  let found = false;
  for (let i = 0; i < input.length; i++) {
    if (validLetters.indexOf(input[i]) !== -1 && !found) {
      part1 = input.slice(0, i);
      part2 = input.slice(i, input.length);
      found = true;
    }
  }
  if (!found) {
    part1 = input;
    part2 = '';
  }
  if (input.split('/').length - 1 > 1) {
    w.err.message = 'invalid number';
  }

  if (part1.indexOf('/') !== -1) {
    part1 = (part1.split('/')[0] / part1.split('/')[1]);
  }
  if (isNaN(part1)) {
    w.err.message = 'invalid number';
  }
  if (units.indexOf(part2) == -1) {
    if (w.err.message) {
      w.err.message = 'invalid number and unit';
    } else {
      w.err.message = 'invalid unit';
    }
  }
  if (part1 === '') {
    w.err.message = 'invalid number and unit';
  }
  if (w.err.message) {
    w.err.status = 400;
  } else {
    w.data.InitNum = part1;
    w.data.InitUnit = part2;
  }
  return w;
}

module.exports = {
  sendResult: sendResult,
  convert: convert,
  parseInput: parseInput
};

function sendResult (req, res, w, status) {
  res.setHeader('Content-Type', 'application/json');
  res.status(status).send(JSON.stringify(w, null, 3));
}
