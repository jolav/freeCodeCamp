/* global ReactDOM React lib */

const destination = document.getElementById('night');

//const urlAPI = "http://localhost:3000/";
const urlAPI = "https://nightlife-v1-jolav.glitch.me/";

class Night extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: "",//this.getLocation(),
      data: [],//this.getData(),
      isLogged: false,
      showLogin: false,
      showSignup: false,
      user: undefined
    };
    this.getNewData = this.getNewData.bind(this);
    this.changeLocation = this.changeLocation.bind(this);
    this.showLogin = this.showLogin.bind(this);
    this.showSignup = this.showSignup.bind(this);
    this.doSignup = this.doSignup.bind(this);
    this.doLogin = this.doLogin.bind(this);
    this.doLogout = this.doLogout.bind(this);
    this.voteBar = this.voteBar.bind(this);
  }
  showLogin() {
    this.setState({ showLogin: !this.state.showLogin });
    if (this.state.showSignup) {
      this.setState({ showSignup: !this.state.showSignup });
    }
  }
  showSignup() {
    this.setState({ showSignup: !this.state.showSignup });
    if (this.state.showLogin) {
      this.setState({ showLogin: !this.state.showLogin });
    }
  }
  doLogin(user, pass) {
    let parameters = "username=" + user + "&password=" + pass;
    lib.makeAjaxRequest(urlAPI + "login", "POST", parameters, true, (data) => {
      if (data.logged) {       // automatically doLogin
        this.setState({
          isLogged: true,
          showLogin: false,
          showSignup: false,
          user: user,
        });
        if (data.lastSearch !== "undefined") {
          this.changeLocation(data.lastSearch);
        }
      }
    });
  }
  doSignup(user, pass) {
    let params = "username=" + user + "&password=" + pass;
    lib.makeAjaxRequest(urlAPI + "signup", "POST", params, true, (data) => {
      if (data.created) {       // automatically doLogin
        this.doLogin(user, pass);
      }
    });
  }
  doLogout() {
    lib.makeAjaxRequest(urlAPI + "logout", "GET", {}, true, (data) => {
      if (data.logout) {
        this.setState({
          isLogged: false,
          showLogin: false,
          showSignup: false,
          user: undefined
        });
      }
    });
  }
  voteBar(bar) {
    if (this.state.isLogged) {
      let params = "user=" + this.state.user + "&barid=" + bar.id;
      lib.makeAjaxRequest(urlAPI + "vote", "POST", params, true, (data) => {
        let index = -1;
        for (let i = 0; i < this.state.data.length; i++) {
          if (this.state.data[i].id === bar.id) {
            index = i;
          }
        }
        let aux = this.state.data;
        if (data.action === "add") {
          aux[index].going++;
        } else if (data.action === "sub") {
          aux[index].going--;
        }
        this.setState({
          data: aux
        });
      });
    }
  }
  getData(location) {
    const dataurl = urlAPI + `get/${location}`;
    lib.makeAjaxRequest(dataurl, "GET", "", true, (data) => {
      let places = [];
      data.map((element, index) => {
        let place = {};
        place.id = element.id;
        place.name = element.name;
        place.image = element.image_url;
        place.rating = element.rating;
        place.address = element.location.address1;
        place.yelp = element.url;
        place.going = element.going || 0;
        places.push(place);
      });
      this.setState({
        data: places || [],
      });
    });
  }
  getLocation() {
    lib.fetchDataFromServer(lib.urlData, (data) => {
      this.setState({
        location: data.city || "location",
      }, this.getData(data.city));
    });
  }
  getNewData(newData) {
    // console.log('Changing data to new data');
    this.setState({
      data: newData,
    });
  }
  changeLocation(newLocation) {
    //console.log('New Location ==> ', newLocation);
    this.setState({
      location: newLocation
    });
    this.getData(newLocation);
  }
  componentDidMount() {
    console.log('DID MOUNT');
    //this.getLocation(); // show data at start
  }
  render() {
    const total = {
      textAlign: "center",
    };
    return (
      <div className="plugin" style={total} >
        <Menu
          showLogin={this.showLogin}
          showSignup={this.showSignup}
          doLogout={this.doLogout}
          user={this.state.user}
          isLogged={this.state.isLogged}
          location={this.state.location}
          callback={this.changeLocation}
        />
        <Places
          callback2={this.doLogin}
          callback3={this.doSignup}
          voteBar={this.voteBar}
          showLogin={this.state.showLogin}
          showSignup={this.state.showSignup}
          places={this.state.data}
          callback={this.getNewData} />
      </div>
    );
  }
}

const layout = (
  <div>
    <Night />
  </div>
);

ReactDOM.render(
  layout,
  destination
);



