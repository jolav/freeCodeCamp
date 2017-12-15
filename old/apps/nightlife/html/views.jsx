/* global ReactDOM React lib */

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.addlocation = this.addlocation.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.handleEnterPress = this.handleEnterPress.bind(this);
    this.state = {
      location: ''
    };
    this.showLogin = this.showLogin.bind(this);
    this.showSignup = this.showSignup.bind(this);
    this.doLogout = this.doLogout.bind(this);
  }
  showLogin(e) {
    this.props.showLogin();
  }
  showSignup(e) {
    this.props.showSignup();
  }
  doLogout(e) {
    this.props.doLogout();
  }
  inputChange(e) {
    this.setState({ location: e.target.value });
  }
  addlocation(e) {
    e.preventDefault();
    if (this.state.location !== "") {
      this.props.callback(this.state.location);
    }
  }
  handleEnterPress(e) {
    if (e.key === 'Enter') {
      this.addlocation(e);
    }
  }
  render() {
    const navbar = {
      fontFamily: "'PT Sans','arial',sans-serif",
      width: "100%",
      position: "fixed",
      fontSize: "1.2em",
      height: "50px",
      display: "flex",
      flexFlow: "row nowrap",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#121212",
      color: "#fff",
      zIndex: "1",
    };
    const left = {
      paddingLeft: "5%",
    };
    const image = {
      verticalAlign: "middle",
      maxHeight: "32px",
    };
    const right = {
      paddingRight: "5%"
    };
    const menu = {
      padding: "0px 20px",
    };
    const input = {
      fontSize: "1em",
      borderRadius: "5px",
      padding: "5px 0px 0px 0px",
      textAlign: "center",
      color: "#404040",
    };
    const action = {
      cursor: "pointer",
    };
    const search = {
      backgroundColor: "#d65",
      padding: "2px 5px 2px 5px",
      borderRadius: "5px"

    };
    const left1 = () => {
      return (
        <div className="left" style={left}>
          <img className="logo" style={image} alt="" src="/_assets/images/nightlife/bar48.png" /> NightLife
          <span className="menu" style={menu}>
            <input id="locationBox" style={input}
              placeholder={this.props.location || "Enter location"}
              value={this.state.location}
              onChange={this.inputChange}
              onKeyPress={this.handleEnterPress} />
            <span style={Object.assign({}, search)}>
              <img className="logo" style={Object.assign({}, image, action)} alt="signup" src="/_assets/images/nightlife/search48.png"
                onClick={this.addlocation} />
            </span>
          </span>
        </div>
      );
    };
    const right1 = () => {
      return (
        <div className="right" style={right}>
          <span className="menu" style={Object.assign({}, menu, action)}
            onClick={this.showSignup}>
            <img className="logo" style={image} alt="signup" src="/_assets/images/nightlife/signup48.png" />Sign up
          </span>
          <span>|</span>
          <span className="menu" style={Object.assign({}, menu, action)}
            onClick={this.showLogin}>
            <img className="logo" style={image} alt="login" src="/_assets/images/nightlife/login48.png" />Log in
          </span>
        </div>
      );
    };
    const right2 = () => {
      return (
        <div className="right" style={right}>
          <span className="menu" style={Object.assign({}, menu, action)}
            onClick={this.doLogout}>
            <img className="logo" style={image} alt="login" src="/_assets/images/nightlife/login48.png" /> {this.props.user}
          </span>
        </div>
      );
    };
    const k = () => {
      return (<div></div>);
    };
    return (
      <section style={navbar}>
        {left1()}
        {this.props.isLogged ? right2() : right1()}
      </section >
    );
  }
}

class Places extends React.Component {
  constructor(props) {
    super(props);
    this.doLogin = this.doLogin.bind(this);
    this.doSignup = this.doSignup.bind(this);
    this.voteBar = this.voteBar.bind(this);
  }
  getStars(qty) {
    if (qty === 0) return "small-0";
    if (qty === 1) return "small-1";
    if (qty === 1.5) return "small-1-half";
    if (qty === 2) return "small-3";
    if (qty === 2.5) return "small-2-half";
    if (qty === 3) return "small-3";
    if (qty === 3.5) return "small-3-half";
    if (qty === 4) return "small-4";
    if (qty === 4.5) return "small-4-half";
    if (qty === 5) return "small-5";
  }
  doLogin(user, pass) {
    this.props.callback2(user, pass);
  }
  doSignup(user, pass) {
    this.props.callback3(user, pass);
  }
  voteBar(bar) {
    this.props.voteBar(bar);
  }
  render() {
    const base = {
      paddingTop: "50px",
      textAlign: "center",
      backgroundImage: "url('/_assets/images/nightlife/back.jpg')",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      color: "#fafafa",
    };
    const empty = {
      height: "calc(100vh - 50px)",
    };
    const places = {
      display: "inline-block",
      margin: "10px",
    };
    const place = {
      backgroundColor: "#222",
      opacity: "0.9",
      margin: "2% auto",
      display: "flex",
      justifyContent: "center",
      borderRadius: "15px",
      border: "3px solid burlywood",
    };
    const image = {
      borderRadius: "15px",
      height: "100px",
      width: "100px",
      margin: "0px",
      padding: "0px"
    };
    const name = {
      fontSize: "1.2em",
      color: "orange",
    };
    const address = {};
    const text = {
      display: "flex",
      flexFlow: "column wrap",
      justifyContent: "flex-start",
      alignItems: "center",
      alignSelf: "center",
      padding: "5px 10px",
      verticalAlign: "middle"

    };
    const group = {
      verticalAlign: "middle",
      height: "36px",
      cursor: "pointer",
    };
    const starsvalue = {
      verticalAlign: "middle",
    };
    const placesList = this.props.places.map((d) => {
      let stars = this.getStars(d.rating);
      return (
        <div style={places} key={d.id}>
          <div className="place" style={place}>
            <img style={image} alt="pub image" src={d.image} />
            <div style={text}>
              <a href={d.yelp} target="_blank">
                <span style={name}>{d.name}</span>
              </a>
              <span style={address}>{d.address}</span>
              <div>
                <div style={starsvalue} className={stars}></div>
                <img alt="group" style={group}
                  onClick={() => this.voteBar(d)}
                  src="/_assets/images/nightlife/group48.png" />
                {d.going /*|| 0*/}
              </div>
            </div>
          </div>
        </div>
      );
    });
    return (
      <div className="base"
        style={
          this.props.places.length > 0
            ? base
            : Object.assign({}, base, empty)
        }>

        {this.props.showLogin &&
          <Login
            callback={this.doLogin} />
        }
        {this.props.showSignup &&
          <Signup
            callback={this.doSignup} />
        }

        {this.props.places.length > 0 && placesList}

        <Footer isEmpty={this.props.places.length > 0} />
      </div >
    );
  }
}

class Footer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const footer = {
      textAlign: "center",
      color: "#fafafa",
      backgroundColor: "#222222",
      opacity: ".4",
      padding: "0px",
    };
    const empty = {
      position: "absolute",
      right: "0",
      bottom: "0",
      left: "0",
    };
    const logo = {
      maxHeight: "24px",
      verticalAlign: "middle",
    };
    return (
      <footer className="jolav"
        style={
          this.props.isEmpty
            ? footer
            : Object.assign({}, footer, empty)
        }>
        <hr />
        <small>
          <strong>
            <a href="https://freecodecamp.codetabs.com">View all FreeCodeCamp Projects</a>
          </strong>
          <br />
        </small>
        <small>
          <img className="logo" style={logo} alt="" src="/_assets/icons/jolav32.png" />
          <strong> Jolav &copy; 2017 -
            <a href="https://github.com/jolav/freeCodeCamp"> View on GitHub
            </a> -
          </strong>
        </small>
        <hr />
      </footer >
    );
  }
}