/* global ReactDOM React lib io*/

const destination = document.getElementById('stock');
//const baseurl = "http://localhost:3000/";
const baseurl = "https://stock-v1-jolav.glitch.me/";

const socket = io(baseurl);


class Stock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
    this.getBackData = this.getBackData.bind(this);
    this.addSymbol = this.addSymbol.bind(this);
    this.deleteSymbol = this.deleteSymbol.bind(this);
    socket.on("newDataSet", (broadcastData) => {
      this.broadcast(broadcastData);
    });
  }
  broadcast(broadcastData) {
    // console.log('SOCKET ==>', broadcastData);
    this.setState({ data: broadcastData });
  }
  getBackData(data) {
    // console.log('Changing data to new data');
    this.setState({ data: data });
  }
  addSymbol(symbol) {
    let apiurl = baseurl + "addSymbol/" + symbol.toUpperCase();
    lib.fetchDataFromServer(apiurl, (stockdata) => {
      if (stockdata) {
        this.setState({
          data: stockdata
        });
      }
    });
  }
  deleteSymbol(symbol) {
    let apiurl = baseurl + "removeSymbol/" + symbol.toUpperCase();
    lib.fetchDataFromServer(apiurl, (stockdata) => {
      if (stockdata) {
        this.setState({
          data: stockdata
        });
        if (this.state.data.length === 0) {
          lib.chart();
        }
      }
    });
  }
  render() {
    // console.log('****** RENDER ******* ', this.state.data.length);
    const a = {
      textAlign: "center"
    };
    return (
      <div className="stock" style={a}>
        <Title />
        <Chart data={this.state.data} callback={this.getBackData} />
        <Input callback={this.addSymbol} />
        <Output data={this.state.data} callback={this.deleteSymbol} />
      </div>
    );
  }
}
class Chart extends React.Component {
  constructor(props) {
    super(props);
  }
  drawChart(data) {
    let dataSet = [];
    data.forEach((el, index) => {
      dataSet[index] = {
        name: el.symbol,
        data: el.data,
      };
      //console.log(`${index} ==> ${dataSet[index].name}`);
    });
    lib.chart(dataSet);
  }
  componentDidMount() {
    let apiurl = baseurl + "getdata/";
    lib.fetchDataFromServer(apiurl, (stockdata) => {
      this.props.callback(stockdata);
    });
  }
  render() {
    // console.log('****** RENDER v2 **** ', this.props.data.length);
    if (this.props.data.length > 0) {
      this.drawChart(this.props.data);
    }
    const chartDim = {
      width: "95%",
      margin: "0px auto",
      height: "400px",
      border: "1px solid #404040",
      boxShadow: "7px 10px 34px 1px rgba(0, 0, 0, 0.68), inset -1px -6px 12px 0.1px #89847e"
    };
    return (
      <div className="chart">
        <div id="container" style={chartDim}></div>
      </div>
    );
  }
}

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.addSymbol = this.addSymbol.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.handleEnterPress = this.handleEnterPress.bind(this);
    this.symbol = "symbol";
  }
  inputChange(e) {
    this.symbol = e.target.value;
  }
  addSymbol(e) {
    e.preventDefault();
    this.props.callback(this.symbol);
  }
  handleEnterPress(e) {
    if (e.key === 'Enter') {
      this.addSymbol(e);
    }
  }
  render() {
    const input = {
      margin: "4% auto 2% auto",
    };
    const btnSea = {
      marginLeft: "10px",
      border: "1px solid #59d",
      borderRadius: "5px",
      //backgroundColor: "#6b6",
      backgroundColor: "#59d",
      padding: "5px 15px",
      cursor: "pointer",
      color: "#fff",
    };
    const inputBox = {
      padding: "5px"
    };
    return (
      <div style={input} >
        <input style={inputBox} id="symbolBox" placeholder="enter stock symbol"
          value={this.props.symbol}
          onChange={this.inputChange}
          onKeyPress={this.handleEnterPress}
        />
        <button onClick={this.addSymbol} style={btnSea}>Add</button>
      </div>
    );
  }
}

class Output extends React.Component {
  constructor(props) {
    super(props);

    this.deleteSymbol = this.deleteSymbol.bind(this);
  }
  deleteSymbol(e) {
    let option = parseInt(e.target.id.replace("box", ""));
    option = this.props.data[option].symbol;
    this.props.callback(option);
  }
  render() {
    const output = {
      display: "flex",
      flexFlow: "row wrap",
      justifyContent: "space-around",
      lineHeight: "1.1em"
    };
    const box = {
      backgroundColor: "#6b6",
      borderRadius: "5px",
      padding: "10px 20px 5px 20px",
      color: "#fff",
    };
    const boxSymbol = {
      fontSize: "1em",
    };
    const boxSector = {
      fontSize: "0.8em",
    };
    const renderSymbols = [];
    this.props.data.forEach((element, index) => {
      renderSymbols.push(
        <div style={box} key={"box" + index}>
          <div className="boxSymbol"
            onClick={this.deleteSymbol} id={"box" + index}
            style={boxSymbol}>{element.symbol} ({element.name})
          </div>
          <div style={boxSector}>{element.sector}</div>
        </div>
      );
    });
    return (
      <div style={output}>
        {renderSymbols}
      </div>
    );
  }
}

const Title = function () {
  const head = {
    margin: "3% auto",
    fontSize: "1.2em",
    fontWeight: "bold",
  };
  const title = {
    margin: "0px",
    padding: "5px 20px",
    border: "2px solid #404040",
    borderRadius: "5px",
    backgroundColor: "orange"
  };
  return (
    <div style={head}>
      <span style={title}>
        STOCK CHART COMPARISON
      </span>
    </div>
  );
};

const layout = (
  <div>
    <Stock />
  </div>
);

ReactDOM.render(
  layout,
  destination
);


