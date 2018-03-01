/* global ReactDOM React */

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.showLogin = this.showLogin.bind(this);
    this.showSignup = this.showSignup.bind(this);
    this.doLogout = this.doLogout.bind(this);
    this.goAllBooks = this.goAllBooks.bind(this);
    this.goMyBooks = this.goMyBooks.bind(this);
    this.goUserData = this.goUserData.bind(this);
  }
  showLogin(e) {
    e.preventDefault();
    this.props.showLogin();
  }
  showSignup(e) {
    e.preventDefault();
    this.props.showSignup();
  }
  doLogout(e) {
    e.preventDefault();
    this.props.doLogout();
  }
  goAllBooks(e) {
    e.preventDefault();
    this.props.goAllBooks();
  }
  goMyBooks(e) {
    e.preventDefault();
    this.props.goMyBooks();
  }
  goUserData(e) {
    e.preventDefault();
    this.props.goUserData();
  }
  render() {
    const navbar = {
      width: "100%",
      position: "fixed",
      fontSize: "1.3em",
      height: "50px",
      display: "flex",
      flexFlow: "row nowrap",
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: "lightblue",
      color: "#222",
      zIndex: "1",
      fontWeight: "bold",
    };
    const left = {
      paddingLeft: "5%",
    };
    const image = {
      verticalAlign: "middle",
      maxHeight: "48px",
    };
    const image2 = {
      verticalAlign: "middle",
      maxHeight: "32px",
    };
    const right = {
      paddingRight: "5%"
    };
    const menu = {
      padding: "0px 20px",
    };
    const action = {
      cursor: "pointer",
    };
    const left1 = () => {
      return (
        <div className="left" style={left}>
          <img className="logo" style={image} alt="" src="/_assets/images/book/library128.png" /> Book Trading Club
        </div>
      );
    };
    const right1 = () => {
      return (
        <div className="right" style={right}>
          <span className="menu" style={Object.assign({}, menu, action)}
            onClick={this.showSignup}>
            Sign up
          </span>
          <span> </span>
          <span className="menu" style={Object.assign({}, menu, action)}
            onClick={this.showLogin}>
            Log in
          </span>
        </div>
      );
    };
    const right2 = () => {
      return (
        <div className="right" style={right}>
          <span style={Object.assign({}, menu, action)}
            onClick={this.goAllBooks}>AllBooks</span>
          <span style={Object.assign({}, menu, action)}
            onClick={this.goMyBooks}>MyBooks</span>
          <span className="menu" style={Object.assign({}, menu, action)}
            onClick={this.goUserData}>
            <img className="logo" style={image2} alt="login" src="/_assets/images/book/profile128.png" /> {this.props.user}
          </span>
          <span style={Object.assign({}, menu, action)}
            onClick={this.doLogout}>
            <img className="image" style={image2} alt="logout" src="/_assets/images/book/logout32.png" />
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

class Home extends React.Component {
  render() {
    const a = {
      textAlign: "center"
    };
    return (
      <div className="plugin" style={a}>
        <br />
        <h2>This is a private Club, Login or Create Account</h2>
        <br />
        <h3>You van create account or use existent: <code> user / user</code></h3>
      </div>
    );
  }
}

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
    this.userChange = this.userChange.bind(this);
    this.passChange = this.passChange.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
  }
  submitLogin(e) {
    e.preventDefault();
    if (this.state.username && this.state.password) {
      this.props.doLogin(this.state.username, this.state.password);
    }
  }
  passChange(e) {
    this.setState({ password: e.target.value });
  }
  userChange(e) {
    this.setState({ username: e.target.value });
  }
  render() {
    const a = {
      textAlign: "center",
      fontFamily: "Indie Flower",
      //paddingTop: "50px",
    };
    const loginForm = {
      backgroundColor: "#fafafa",
    };
    const row = {
      padding: "15px",
    };
    const input = {
      fontSize: "1.5em",
      border: "0",
      background: "transparent",
      borderBottom: "3px solid orange",
      color: "#222",
    };
    const image = {
      verticalAlign: "middle",
      padding: "0px 10px 0px 0px",
    };
    const button = {
      fontFamily: "Indie Flower",
      fontSize: "1.4em",
      cursor: "pointer",
      padding: "5px 20px",
      backgroundColor: "#59d",
      borderRadius: "5px",
      border: "1px solid #59d",
      color: "#fafafa",
    };
    return (
      <div style={a}>
        <form style={loginForm} action="" method="post">
          <div style={row}>
            <img style={image} alt="user" src="/_assets/images/book/identity48.png" />
            <input style={input} type="text" name="username" placeholder="username *"
              value={this.state.username}
              onChange={this.userChange} />
          </div>
          <div style={row}>
            <img style={image} alt="user"
              src="/_assets/images/book/lock48.png" />
            <input style={input} type="password" name="password" placeholder="password *"
              value={this.state.password}
              onChange={this.passChange} />
          </div>
          <div style={row}>
            <input style={button} type="submit" value="LOGIN"
              onClick={this.submitLogin} />
          </div>
        </form>
      </div>
    );
  }
}

class SignUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
    this.userChange = this.userChange.bind(this);
    this.passChange = this.passChange.bind(this);
    this.submitSignup = this.submitSignup.bind(this);
  }
  submitSignup(e) {
    e.preventDefault();
    if (this.state.username && this.state.password) {
      this.props.doSignup(this.state.username, this.state.password);
    }
  }
  passChange(e) {
    this.setState({ password: e.target.value });
  }
  userChange(e) {
    this.setState({ username: e.target.value });
  }
  render() {
    const a = {
      textAlign: "center",
      fontFamily: "Indie Flower",
      //paddingTop: "50px",
    };
    const signupForm = {
      backgroundColor: "#fafafa",
    };
    const row = {
      padding: "15px",
    };
    const input = {
      fontSize: "1.5em",
      border: "0",
      background: "transparent",
      borderBottom: "3px solid orange",
      color: "#222",
    };
    const image = {
      verticalAlign: "middle",
      padding: "0px 10px 0px 0px",
    };
    const button = {
      fontFamily: "Indie Flower",
      fontSize: "1.4em",
      cursor: "pointer",
      padding: "5px 20px",
      backgroundColor: "#59d",
      borderRadius: "5px",
      border: "1px solid #59d",
      color: "#fafafa",
    };
    return (
      <div style={a}>
        <form style={signupForm} action="" method="post">
          <div style={row}>
            <img style={image} alt="user" src="/_assets/images/book/identity48.png" />
            <input style={input} type="text" name="username" placeholder="username *"
              value={this.state.username}
              onChange={this.userChange} />
          </div>
          <div style={row}>
            <img style={image} alt="user"
              src="/_assets/images/book/lock48.png" />
            <input style={input} type="password" name="password" placeholder="password *"
              value={this.state.password}
              onChange={this.passChange} />
          </div>
          <div style={row}>
            <input style={button} type="submit" value="SIGNUP"
              onClick={this.submitSignup} />
          </div>
        </form>
      </div>
    );
  }
}

class UserDataForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.profile.username,
      fullName: "",
      city: "",
      state: "",
    };
    this.submitUserData = this.submitUserData.bind(this);
    this.userChange = this.userChange.bind(this);
    this.fullNameChange = this.fullNameChange.bind(this);
    this.cityChange = this.cityChange.bind(this);
    this.stateChange = this.stateChange.bind(this);
  }
  submitUserData(e) {
    e.preventDefault();
    if (this.state.username) {
      if (this.state.fullName || this.state.city || this.state.state) {
        if (!this.state.fullName) {
          this.state.fullName = this.props.profile.fullName;
        }
        if (!this.state.city) this.state.city = this.props.profile.city;
        if (!this.state.state) this.state.state = this.props.profile.state;
        this.props.updateProfile(
          this.state.username, this.state.fullName,
          this.state.city, this.state.state);
      }
    }
  }
  fullNameChange(e) {
    this.setState({ fullName: e.target.value });
  }
  userChange(e) {
    this.setState({ username: e.target.value });
  }
  cityChange(e) {
    this.setState({ city: e.target.value });
  }
  stateChange(e) {
    this.setState({ state: e.target.value });
  }
  componentDidMount() {
    //console.log('USER DATA FORM MOUNTED');
  }
  render() {
    const a = {
      textAlign: "center",
      fontFamily: "Indie Flower",
      //paddingTop: "50px",
    };
    const userDataForm = {
      backgroundColor: "#fafafa",
    };
    const row = {
      padding: "15px",
    };
    const input = {
      fontSize: "1.5em",
      border: "0",
      background: "transparent",
      borderBottom: "3px solid orange",
      color: "#222",
    };
    const image = {
      verticalAlign: "middle",
      padding: "0px 10px 0px 0px",
    };
    const button = {
      fontFamily: "Indie Flower",
      fontSize: "1.4em",
      cursor: "pointer",
      padding: "5px 20px",
      backgroundColor: "#59d",
      borderRadius: "5px",
      border: "1px solid #59d",
      color: "#fafafa",
    };
    return (
      <div style={a}>
        <form style={userDataForm} action="" method="post">
          <div>
            <h1><small>Member</small> => {this.state.username}</h1>
          </div>
          <div style={row}>
            <input style={input} type="text" name="fullName" placeholder={this.props.profile.fullName || "full name"}
              value={this.state.fullName}
              onChange={this.fullNameChange} />
          </div>
          <div style={row}>
            <input style={input} type="text" name="city" placeholder={this.props.profile.city || "city"}
              value={this.state.city}
              onChange={this.cityChange} />
          </div>
          <div style={row}>
            <input style={input} type="text" name="state" placeholder={this.props.profile.state || "state"}
              value={this.state.state}
              onChange={this.stateChange} />
          </div>
          <div style={row}>
            <input style={button} type="submit" value="Update Profile"
              onClick={this.submitUserData} />
          </div>
        </form>
      </div>
    );
  }
}

class ShowBooks extends React.Component {
  constructor(props) {
    super(props);
    this.askTrade = this.askTrade.bind(this);
  }
  askTrade(d) {
    this.props.askTrade(d);
  }
  render() {
    //console.log('RENDERING SHOWBOOKS');
    const places = {
      fontFamily: "PT Sans",
      display: "inline-block",
      margin: "5px",
    };
    const place = {
      backgroundColor: "#b6dab6",
      margin: "1% auto",
      display: "flex",
      justifyContent: "center",
      borderRadius: "15px",
      border: "3px solid burlywood",
    };
    const image = {
      borderRadius: "15px",
      height: "150px",
      width: "100px",
      margin: "0px",
      padding: "0px"
    };
    const title = {
      fontSize: "1em",
    };
    const owner = {
      fontSize: "0.9em",
    };
    const text = {
      display: "flex",
      flexFlow: "column wrap",
      justifyContent: "flex-start",
      alignItems: "center",
      alignSelf: "center",
      padding: "5px 5px",
      verticalAlign: "middle",
      color: "#375EAB",
    };
    const group = {
      verticalAlign: "middle",
      height: "24px",
      cursor: "pointer",
    };
    const iwant = {
      verticalAlign: "middle",
    };
    const books = this.props.books.map((d) => {
      if (d.title.length > 25) {
        d.title2 = d.title.slice(0, 22) + "...";
      } else {
        d.title2 = d.title;
      }
      return (
        <div style={places} key={d.id}>
          <div className="place" style={place}>
            <img style={image} alt="image" src={d.thumbnail} />
            <div style={text}>
              <span style={title}>{d.title2}</span>
              <span style={owner}>Owner : {d.owner}</span>
              {this.props.username !== d.owner &&
                <div>
                  <div style={iwant}></div>
                  <img alt="group" style={group}
                    onClick={() => this.askTrade(d)}
                    src="/_assets/images/book/love48.png" />
                </div>}
            </div>
          </div>
        </div>
      );
    });
    const a = {
      textAlign: "center"
    };
    return (
      <div className="base">
        {books}
      </div>
    );
  }
}

class MyBooks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: ""
    };
    this.inputChange = this.inputChange.bind(this);
    this.handleEnterPress = this.handleEnterPress.bind(this);
    this.addBook = this.addBook.bind(this);
    this.acceptTrade = this.acceptTrade.bind(this);
  }
  inputChange(e) {
    this.setState({ title: e.target.value });
  }
  addBook(e) {
    e.preventDefault();
    if (this.state.location !== "") {
      this.props.addBook(this.state.title);
    }
  }
  handleEnterPress(e) {
    if (e.key === 'Enter') {
      this.addBook(e);
    }
  }
  acceptTrade(id, newOwner) {
    this.props.acceptTrade(id, newOwner);
  }
  render() {
    const places = {
      fontFamily: "PT Sans",
      display: "inline-block",
      margin: "5px",
    };
    const place = {
      backgroundColor: "#b6dab6",
      margin: "1% auto",
      display: "flex",
      flexFlow: "column wrap",
      justifyContent: "center",
      borderRadius: "15px",
      border: "3px solid burlywood",
    };
    const image = {
      borderRadius: "15px",
      maxHeight: "150px",
      maxWidth: "150px",
      margin: "0px",
      padding: "0px"
    };
    const text = {
      display: "flex",
      flexFlow: "column wrap",
      justifyContent: "flex-start",
      alignItems: "center",
      alignSelf: "center",
      padding: "5px 5px",
      verticalAlign: "middle",
      color: "#375EAB",
    };
    const myBooks = this.props.books.map((d) => {
      if (d.owner !== this.props.username) {
        return;
      }
      if (d.title.length > 25) {
        d.title2 = d.title.slice(0, 22) + "...";
      } else {
        d.title2 = d.title;
      }
      return (
        <div style={places} key={d.id}>
          <div className="place" style={place}>
            <div style={text}>
              <span>{d.title2}</span>
            </div>
            <img style={image} alt="image" src={d.thumbnail} />
          </div>
        </div>
      );
    });
    const place3 = {
      backgroundColor: "#99ff99",
      margin: "1% auto",
      justifyContent: "center",
      borderRadius: "5px",
      border: "1px solid #99ff99",
    };
    const myTrades = this.props.books.map((d) => {
      if (d.owner === this.props.username) {
        return;
      }
      if (d.candidates.length <= 0) return;
      if (d.title.length > 25) {
        d.title2 = d.title.slice(0, 22) + "...";
      } else {
        d.title2 = d.title;
      }
      if (d.candidates.indexOf(this.props.username) === -1) return;
      return (
        <div style={places} key={d.id + d.owner + this.props.username}>
          <div className="place" style={place3}>
            <div style={text}>
              <span>{d.title} / {d.owner}</span>
            </div>
          </div>
        </div>
      );
    });
    const place2 = {
      backgroundColor: "#ff9999",
      margin: "1% auto",
      justifyContent: "center",
      borderRadius: "5px",
      border: "1px solid #ff9999",
    };
    const action = {
      cursor: "pointer",
    };
    const tradesForMe = this.props.books.map((d) => {
      if (d.owner !== this.props.username) {
        return;
      }
      if (d.candidates.length <= 0) return;
      if (d.title.length > 25) {
        d.title2 = d.title.slice(0, 22) + "...";
      } else {
        d.title2 = d.title;
      }
      let res = d.candidates.map((candidate, index) => {
        return (
          <div style={places} key={d.id + candidate}>
            <div className="place" style={Object.assign({}, place2, action)}
              onClick={() => this.acceptTrade(d.id, candidate)}>
              <div style={text}>
                <span>{d.title} / {candidate}</span>
              </div>
            </div>
          </div>
        );
      });
      return res;
    });
    const a = {
      textAlign: "center"
    };
    const input = {
      fontSize: "1em",
      borderRadius: "5px",
      padding: "5px 0px 0px 0px",
      textAlign: "center",
      color: "#404040",
    };
    return (
      <div className="plugin" style={a}>
        <h2>Add Book</h2>
        <div>
          <input id="newTitleBox" style={input}
            placeholder={"Enter Book Title"}
            value={this.state.title}
            onChange={this.inputChange}
            onKeyPress={this.handleEnterPress} />
        </div>
        <h2>My Trade Requests</h2>
        {myTrades}
        <h2>Trade Requests For Me</h2>
        {tradesForMe}
        <h2>My Books</h2>
        {myBooks}
      </div>
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
      color: "#222",
      backgroundColor: "lightblue",
      opacity: "1",
      padding: "0px",
    };
    const notempty = {
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
            : Object.assign({}, footer, notempty)
        }>
        <hr />
        <small>
          <strong>
            <a href="https://jolav.me/freecodecamp/old">View all FreeCodeCamp Projects</a>
          </strong>
          <br />
        </small>
        <small>
          <img className="logo" style={logo} alt="" src="/_assets/icons/jolav32.png" />
          <strong> Jolav &copy; 2017 -
          <a href="https://github.com/jolav/freeCodeCamp/tree/master/old"> View on GitHub
          </a> -
          </strong>
        </small>
        <hr />
      </footer >
    );
  }
}

