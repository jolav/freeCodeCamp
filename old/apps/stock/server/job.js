const fs = require('fs');
const lib = require('./serverlib.js');
const dataFile = './../../../../_aux/list.json';

function addSymbol (req, res) {
  const symbol = req.params[0].toUpperCase();
  // console.log('ADD ', symbol)
  lib.loadJSONfile(dataFile, 0, function (stocks) {
    if (symbolExists(symbol, stocks)) {
      lib.sendResult(req, res, '', 200);
      return;
    }
    getSymbolMetadata(res, symbol, function (err, metadata) {
      if (err) {
        getData(req, res, stocks);
        return;
      }
      stocks.push({
        symbol: symbol,
        name: metadata.companyName,
        sector: metadata.sector,
        data: [] // stockvalues // .splice(0, 10)
      });
      lib.writeJSONtoFile(dataFile, stocks, function () {
        getData(req, res, stocks);
      });
    });
  });
}

function removeSymbol (req, res) {
  const symbol = req.params[0].toUpperCase();
  // console.log('REMOVE ', symbol)
  lib.loadJSONfile(dataFile, 0, function (stocks) {
    if (!symbolExists(symbol, stocks)) {
      lib.sendResult(req, res, '', 200);
      return;
    }
    for (let i = 0; i < stocks.length;i++) {
      if (stocks[i].symbol === symbol) {
        stocks.splice(i, 1);
      }
    }
    lib.writeJSONtoFile(dataFile, stocks, function () {
      if (stocks.length === 0) {
        // console.log('EMPTY')
        lib.sendResult(req, res, [], 200);
        return;
      }
      getData(req, res, stocks);
      return;
    });
  });
}

function getData (req, res, stocks) {
  if (!stocks) {
    try {
      stocks = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    } catch (e) {
      lib.sendResult(req, res, [], 200);
      return;
    }
  }
  let callsRemaining = stocks.length;
  if (callsRemaining === 0) {
    // console.log('EMPTY')
    lib.sendResult(req, res, [], 200);
    return;
  }
  for (let i = 0; i < stocks.length; i++) {
    getSymbolData(res, stocks[i].symbol, function (err, stockvalues) {
      if (err) {
        // console.log('FAIL GATHERING DATA =>', err)
        for (let i = 0; i < stockvalues.length; i++) {
          stockvalues[i][0] = 0;
        }
      } else {
        for (let i = 0; i < stockvalues.length; i++) {
          stockvalues[i][0] = new Date(stockvalues[i][0]).getTime();
        }
      }
      stocks[i].data = stockvalues;
      callsRemaining--;
      // console.log('QUEDAN =', callsRemaining)
      if (callsRemaining <= 0) {
        // console.log('FETCHING FINISHED')
        lib.sendResult(req, res, stocks, 200);
      }
    });
  }
}

function getSymbolData (res, symbol, cb) {
  let call = `https://www.quandl.com/api/v3/datasets/WIKI/${symbol}/data.json?api_key=${global.ct.apikey}&column_index=4&order=asc`;
  // console.log('FETCHING ...' , call)
  lib.makeHttpsRequest(call, function (err, data) {
    if (err || data.qu) {
      // console.log('111 ERROR')
      cb(err, null);
      return;
    }
    if (data.quandl_error) {
      deleteNonExistentSymbol(symbol);
      return;
    }
    // console.log('FETCHED ...', symbol)
    cb(null, data.dataset_data.data);
  });
}

function getSymbolMetadata (res, symbol, cb) {
  let call = `https://api.iextrading.com/1.0/stock/${symbol}/quote`;
  lib.makeHttpsRequest(call, function (err, data) {
    if (err) {
      // console.log('222 ERROR')
      cb(err, null);
      return;
    }
    cb(null, data);
  });
}

// example TX, exists on iextrading but not in quandl
function deleteNonExistentSymbol (symbol) {
  // console.log('OIGA 111')
  lib.loadJSONfile(dataFile, 0, function (stocks) {
    for (let i = 0; i < stocks.length;i++) {
      if (stocks[i].symbol === symbol) {
        stocks.splice(i, 1);
      }
    }
    lib.writeJSONtoFile(dataFile, stocks, function () {});
  });
}

function symbolExists (symbol, stocks) {
  for (let i = 0; i < stocks.length;i++) {
    if (stocks[i].symbol === symbol) {
      return true;
    }
  }
  return false;
}

module.exports = {
  addSymbol: addSymbol,
  removeSymbol: removeSymbol,
  getData: getData
};
