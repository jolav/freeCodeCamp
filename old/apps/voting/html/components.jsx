/* global ReactDOM React urlAPI Chart lib*/

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.showLogin = this.showLogin.bind(this);
    this.showSignup = this.showSignup.bind(this);
    this.doLogout = this.doLogout.bind(this);
  }
  showLogin() {
    this.props.showForm("login");
  }
  showSignup(e) {
    this.props.showForm("signup");
  }
  doLogout(e) {
    e.preventDefault();
    this.props.doLogout();
  }
  goHome = () => {
    this.props.goHome();
  }
  goAllPolls = () => {
    this.props.goAllPolls();
  }
  goMyPolls = () => {
    this.props.goMyPolls();
  }
  goAddPoll = () => {
    this.props.goAddPoll();
  }
  render() {
    const navbar = {
      fontFamily: "'PT Sans','arial',sans-serif",
      width: "100%",
      position: "fixed",
      fontSize: "1.1em",
      height: "50px",
      display: "flex",
      flexFlow: "row nowrap",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#404040",
      color: "#ddd",
      zIndex: "1",
    };
    const left = {
      paddingLeft: "5%",
    };
    const image = {
      verticalAlign: "middle",
      maxHeight: "48px",
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
    const image2 = {
      verticalAlign: "middle",
      maxHeight: "32px",
    };
    const left1 = () => {
      return (
        <div className="actionMenu" style={left}
          onClick={this.goHome}>
          <img className="logo" style={image} alt="" src="/_assets/images/voting/poll128.png" /> VOTING POLLS
        </div>
      );
    };
    const right1 = () => {
      return (
        <div className="right" style={right}>
          <span className="actionMenu" style={Object.assign({}, menu, action)}
            onClick={this.showSignup}>
            Sign up
          </span>
          <span> </span>
          <span className="actionMenu" style={Object.assign({}, menu, action)}
            onClick={this.showLogin}>
            Log in
          </span>
        </div >
      );
    };
    const right2 = () => {
      return (
        <div className="right" style={right}>
          <span style={Object.assign({}, menu, action)} className="actionMenu"
            onClick={this.goAllPolls}>AllPolls</span>
          <span style={Object.assign({}, menu, action)} className="actionMenu"
            onClick={this.goMyPolls}>MyPolls</span>
          <span style={Object.assign({}, menu, action)} className="actionMenu"
            onClick={this.goAddPoll}>AddPoll</span>
          <span style={Object.assign({}, menu, action)}
            onClick={this.doLogout} className="actionMenu">
            <img className="image" style={image2} alt="logout" src="/_assets/images/voting/logout32.png" />
            {this.props.profile.username}
          </span>
        </div>
      );
    };
    return (
      <section style={navbar} >
        {left1()}
        {this.props.isLogged ? right2() : right1()}
      </section >
    );
  }
}

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
    this.userChange = this.userChange.bind(this);
    this.passChange = this.passChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }
  submitForm(e) {
    e.preventDefault();
    if (this.state.username && this.state.password) {
      this.props.doForm(this.props.type, this.state.username, this.state.password);
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
      fontFamily: "PT Sans",
      //paddingTop: "50px",
    };
    const form = {
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
      //fontFamily: "Indie Flower",
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
        <form style={form} action="" method="post">
          <div style={row}>
            <img style={image} alt="user" src="/_assets/images/voting/identity48.png" />
            <input style={input} type="text" name="username" placeholder="username *"
              value={this.state.username}
              onChange={this.userChange} />
          </div>
          <div style={row}>
            <img style={image} alt="user"
              src="/_assets/images/voting/lock48.png" />
            <input style={input} type="password" name="password" placeholder="password *"
              value={this.state.password}
              onChange={this.passChange} />
          </div>
          <div style={row}>
            <input style={button} type="submit" value={this.props.type}
              onClick={this.submitForm} />
          </div>
        </form>
      </div>
    );
  }
}

class Home extends React.Component {
  render() {
    const a = {
      textAlign: "center"
    };
    return (
      <div style={a}>
        Home
      </div>
    );
  }
}

class AllPolls extends React.Component {
  addVote = (pollid, option) => {
    this.props.addVote(pollid, option);
  }
  render() {
    const a = {
      textAlign: "center"
    };
    return (
      <div className="polls" style={a}>
        <RenderPolls
          polls={this.props.polls}
          username={this.props.username}
          addVote={this.addVote}
        />
      </div>
    );
  }
}

class MyPolls extends React.Component {
  deletePoll = (id) => {
    this.props.deletePoll(id);
  }
  addVote = (id, option) => {
    this.props.addVote(id, option);
  }
  render() {
    //console.log('POLLS=>', this.props.polls, this.props.username);
    const mypolls = [];
    this.props.polls.map((poll) => {
      //console.log('COMPARE', this.props.username, poll.createdBy);
      if (poll.createdBy === this.props.username) {
        mypolls.push(poll);
      }
    });
    const a = {
      textAlign: "center"
    };
    //console.log('LENGTH=>', mypolls.length);
    return (
      <div className="polls" style={a}>
        {mypolls.length > 0 &&
          <RenderPolls
            polls={mypolls}
            canDelete={true}
            deletePoll={this.deletePoll}
            username={this.props.username}
            addVote={this.addVote}
          />}
      </div>
    );
  }
}

class AddPoll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: "",
      options: "",
    };
  }
  submitAddForm = (e) => {
    e.preventDefault();
    let aux = this.state.options;
    if (aux[0] === ",") {
      aux = aux.slice(1);
    }
    if (aux[aux.length - 1] === ",") {
      aux = aux.slice(0, aux.length - 1);
    }
    aux = aux.split(",").filter(Boolean);
    const res = [];
    aux.map((elem) => {
      if (elem.trim() !== "") {
        res.push(elem.trim());
      }
    });
    if (this.state.question && this.state.options) {
      this.props.doAddPoll(this.state.question, res);
    }
  }
  questionChange = (e) => {
    this.setState({ question: e.target.value });
  }
  optionsChange = (e) => {
    this.setState({ options: e.target.value });
  }
  render() {
    const a = {
      textAlign: "center",
      fontFamily: "PT Sans",
      //paddingTop: "50px",
    };
    const form = {
      backgroundColor: "#fafafa",
    };
    const row = {
      padding: "15px",
    };
    const input = {
      width: "50%",
      fontSize: "1.3em",
      border: "0",
      background: "transparent",
      borderBottom: "3px solid orange",
      color: "#222",
    };
    const button = {
      fontSize: "1.2em",
      cursor: "pointer",
      padding: "5px 20px",
      backgroundColor: "#59d",
      borderRadius: "5px",
      border: "1px solid #59d",
      color: "#fafafa",
    };
    return (
      <div style={a}>
        <form style={form} action="" method="post">
          <div style={row}>
            <input style={input} type="text" name="question" placeholder="poll question*"
              value={this.state.question}
              onChange={this.questionChange} />
          </div>
          <div style={row}>
            <input style={input} type="text" name="options" placeholder="options separated by comma *"
              value={this.state.options}
              onChange={this.optionsChange} />
          </div>
          <div style={row}>
            <input style={button} type="submit" value="NEW POLL"
              onClick={this.submitAddForm} />
          </div>
        </form>
      </div>
    );
  }
}

class RenderPoll extends React.Component {
  componentDidMount() {
    const ctx = document.getElementById("myChart" + this.props.pollid);
    let backColors = [];
    for (let i = 0; i < this.props.options.length; i++) {
      backColors.push(lib.getRandomColor());
    }
    const data = {
      labels: this.props.options,
      datasets: [{
        data: this.props.votes,
        backgroundColor: backColors
      }]
    };
    const myPieChart = new Chart(ctx, {
      type: 'pie',
      data: data,
      options: {
        legend: {
          labels: {
            fontSize: 12,
            padding: 3,
            boxWidth: 10
          }
        }
      }
    });
  }
  componentDidUpdate() {
    const ctx = document.getElementById("myChart" + this.props.pollid);
    let backColors = [];
    for (let i = 0; i < this.props.options.length; i++) {
      backColors.push(lib.getRandomColor());
    }
    const data = {
      labels: this.props.options,
      datasets: [{
        data: this.props.votes,
        backgroundColor: backColors
      }]
    };
    const myPieChart = new Chart(ctx, {
      type: 'pie',
      data: data,
      options: {
        legend: {
          labels: {
            fontSize: 12,
            padding: 3,
            boxWidth: 10
          }
        }
      }
    });
  }
  render() {
    return (
      <div className="myChart" >
        <canvas className="card" id={"myChart" + this.props.pollid}
          width="250" height="250">
        </canvas>
      </div>
    );
  }
}
class RenderPolls extends React.Component {
  deletePoll = (id) => {
    this.props.deletePoll(id);
  }
  addVote = (pollid, option) => {
    this.props.addVote(pollid, option);
  }
  render() {
    // console.log('RENDER POLLS');
    const polls = this.props.polls.map((poll) => {
      //console.log('POLL =>', poll);
      let pollOptionsHTML = [];
      let pollOptions = [];
      let pollVotes = [];
      for (let i = 0; i < poll.options.length; i++) {
        pollOptionsHTML.push(
          <option key={i} value={i}>{poll.options[i].text}</option>
        );
        pollOptions.push(poll.options[i].text);
        pollVotes.push(poll.options[i].votes.length);
      }
      if (this.props.username) { // add Option
        pollOptionsHTML.push(
          <option key={-1} value={-1}>Add Option</option>
        );
      }
      return (
        <div className="poll" key={poll.id}>
          {this.props.canDelete &&
            <span className="delBut" onClick={() => this.deletePoll(poll.id)}>Delete Poll</span>}
          <div className="question">
            {poll.question}
          </div>
          <div className="formGuest">
            <SelectOption
              pollOptionsHTML={pollOptionsHTML}
              poll={poll}
              addVote={this.addVote}
            />

          </div>
          <RenderPoll
            poll={poll}
            options={pollOptions}
            votes={pollVotes}
            pollid={poll.id}
          />
        </div>
      );
    });
    return polls;
  }
}

class SelectOption extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }
  addVote = (pollid) => {
    this.props.addVote(pollid, this.state.value);
  }
  handleChange = (ev) => {
    this.setState({ value: ev.target.value });
  }
  render() {
    return (
      <div>
        <select className="selectStyle" name="options"
          value={this.state.value}
          onChange={this.handleChange} >
          {this.props.pollOptionsHTML}
        </select>
        <span className="voteBut"
          onClick={() => this.addVote(this.props.poll.id)}
        >Vote</span>
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
      color: "#fafafa",
      backgroundColor: "#404040",
      padding: "0px",
    };
    const isempty = {
      position: "absolute",
      right: "0",
      bottom: "0",
      left: "0",
    };
    const logo = {
      maxHeight: "24px",
      verticalAlign: "middle",
    };
    //console.log('IS EMPTY?', this.props.isEmpty);
    return (
      <footer className="jolav"
        style={
          this.props.isEmpty
            ? Object.assign({}, footer, isempty)
            : Object.assign({}, footer)
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

