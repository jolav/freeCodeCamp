/* global ReactDOM React */

const destination = document.getElementById('app');

class WeatherPlugin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      celsius: true,
      wd: {
        ip: "ip",
        lon: "0",
        lat: "0",
        city: "",
        country: "",
        temp: "",
        tempC: "",
        tempF: "",
        icon: ""
      }
    };
    this.changeUnit = this.changeUnit.bind(this);
  }
  getTempAndIcon() {
    let url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + this.state.wd.lat + '&lon=' + this.state.wd.lon + '&appid=93617469a4af9d5e14f927c01874a0a7';
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        let aux = Object.assign(this.state.wd);
        aux.temp = (data.main.temp).toFixed(1);
        aux.tempC = (data.main.temp - 273.16).toFixed(1);
        aux.tempF = ((9 / 5) * aux.tempC + 32).toFixed(1);
        if (aux.tempC[aux.tempC.length - 1] == 0) {
          aux.tempC = aux.tempC.split(".")[0];
        }
        if (aux.tempF[aux.tempF.length - 1] == 0) {
          aux.tempF = aux.tempF.split(".")[0];
        }
        if (!aux.city && data.name) {
          aux.city = data.name;
        }
        if (!aux.country && data.sys.country) {
          aux.country = data.sys.country;
        }
        aux.icon = 'https://openweathermap.org/img/w/' + data.weather[0].icon + '.png';
        // this.setState({ wd: aux });
        this.forceUpdate();
      });
  }
  componentWillMount() {
    const urlIP = 'https://geoip.tools/v1/json/';
    //const urlIP = 'https://geoip.tools/v1/json?q=15.100.100.0';
    fetch(urlIP)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        let aux = Object.assign(this.state.wd);
        aux.ip = data.ip;
        aux.lon = data.longitude;
        aux.lat = data.latitude;
        if (data.country_code) aux.country = data.country_code;
        if (data.city) aux.city = data.city;
        //this.setState({ wd: aux });
        this.forceUpdate();
        this.getTempAndIcon();
      });
  }
  changeUnit(e) {
    e.preventDefault();
    if (this.state.celsius) {
      this.setState({ celsius: false });
    } else {
      this.setState({ celsius: true });
    }
  }
  render() {
    const weatherStyle = {
      display: "inline-block",
      margin: "10% auto"
    };
    const box = {
      fontSize: "1.3em",
      border: "1px solid #cce5ff",
      borderRadius: "5px",
      backgroundColor: "#cce5ff",
      boxShadow: "5px 5px 20px rgba(0, 0, 0, 0.5)",
      padding: "5px 20px 0px 20px",
      display: "flex",
      flexFlow: "column wrap"
    };
    const info = {
      margin: "0px auto"
    };
    const geoloc = {
      margin: "0px auto"
    };
    const image = {
      verticalAlign: "middle",
      paddingLeft: "10px"
    };
    const changeTemp = {
      cursor: "pointer",
      padding: "0px 5px"
    };
    return (
      <div className="plugin" style={weatherStyle}>
        <div style={box}>
          <div style={geoloc}>
            {this.state.wd.city}, {this.state.wd.country}
          </div>
          <div style={info}>
            <span className="changeTemp" style={changeTemp} onClick={this.changeUnit}>
              {this.state.celsius &&
                <span> {this.state.wd.tempC}&nbsp;ºC</span>
              }
              {!this.state.celsius &&
                <span>{this.state.wd.tempF}&nbsp;ºF</span>
              }
            </span>
            <img style={image} alt="icon" src={this.state.wd.icon} />
          </div>
        </div>
      </div>
    );
  }
}

const layout = (
  <div>
    <WeatherPlugin />
  </div>
);

ReactDOM.render(
  layout,
  destination
);

