// jshint esversion: 6

function addTogether () {
  let howMany = arguments.length;
  let result = 0;
  for (let i = 0; i < howMany; i++) {
    if (Number.isInteger(arguments[i])) {
      result += arguments[i];
    } else {
      return undefined;
    }
  }
  if (howMany < 2) {
    let val = arguments[0];
    let sumVals = function (num) {
      if (Number.isInteger(num)) {
        return (num + val);
      } else {
        return undefined;
      }
    };
    return sumVals;
  } else {
    return result;
  }
}

addTogether(2, 3);
