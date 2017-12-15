/* global ReactDOM React lib */

class Login extends React.Component {
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
      this.props.callback(this.state.username, this.state.password);
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
      //paddingTop: "50px",
    };
    const loginForm = {
      backgroundColor: "#222222",
      opacity: "0.9",
    };
    const row = {
      padding: "15px",
    };
    const input = {
      fontSize: "1.5em",
      border: "0",
      //outline: "0",
      background: "transparent",
      borderBottom: "3px solid orange",
      color: "#fafafa",
    };
    const image = {
      verticalAlign: "middle",
      padding: "0px 10px 0px 0px",
    };
    const button = {
      fontSize: "1.4em",
      cursor: "pointer",
      padding: "5px 20px",
      backgroundColor: "#59d",
      borderRadius: "5px",
      border: "1px solid 59d",
      color: "#fafafa",
    };
    return (
      <div style={a}>
        <form style={loginForm} action="" method="post">
          <div style={row}>
            <img style={image} alt="user" src="/_assets/images/nightlife/user48.png" />
            <input style={input} type="text" name="username" placeholder="username *"
              value={this.state.username}
              onChange={this.userChange} />
          </div>
          <div style={row}>
            <img style={image} alt="user" src="/_assets/images/nightlife/pass48.png" />
            <input style={input} type="password" name="password" placeholder="password *"
              value={this.state.password}
              onChange={this.passChange} />
          </div>
          <div style={row}>
            <input style={button} type="submit" value="Login"
              onClick={this.submitLogin} />
          </div>
        </form>
      </div>
    );
  }
}

class Signup extends React.Component {
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
      this.props.callback(this.state.username, this.state.password);
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
      //paddingTop: "50px",
    };
    const signupForm = {
      backgroundColor: "#222222",
      opacity: "0.9",
    };
    const row = {
      padding: "15px",
    };
    const input = {
      fontSize: "1.5em",
      border: "0",
      //outline: "0",
      background: "transparent",
      borderBottom: "3px solid orange",
      color: "#fafafa",
    };
    const image = {
      verticalAlign: "middle",
      padding: "0px 10px 0px 0px",
    };
    const button = {
      fontSize: "1.4em",
      cursor: "pointer",
      padding: "5px 20px",
      backgroundColor: "#59d",
      borderRadius: "5px",
      border: "1px solid 59d",
      color: "#fafafa",
    };
    return (
      <div style={a}>
        <form style={signupForm} action="" method="post">
          <div style={row}>
            <img style={image} alt="user" src="/_assets/images/nightlife/user48.png" />
            <input style={input} type="text" name="username" placeholder="username *"
              value={this.state.username}
              onChange={this.userChange} />
          </div>
          <div style={row}>
            <img style={image} alt="user" src="/_assets/images/nightlife/pass48.png" />
            <input style={input} type="password" name="password" placeholder="password *"
              value={this.state.password}
              onChange={this.passChange} />
          </div>
          <div style={row}>
            <input style={button} type="submit" value="Sign up"
              onClick={this.submitSignup} />
          </div>
        </form>
      </div>
    );
  }
}