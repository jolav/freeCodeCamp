/* global ReactDOM React lib Home*/

const destination = document.getElementById('voting');
const Router = window.ReactRouterDOM.BrowserRouter;
const Route = window.ReactRouterDOM.Route;
const Link = window.ReactRouterDOM.Link;
const Prompt = window.ReactRouterDOM.Prompt;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;

const dev = "/old/apps/voting/html";
const prod = "/old/apps/voting";
const status = dev;

const urlAPI = "http://localhost:3000/";
//const urlAPI = "https://voting-v1-jolav.glitch.me/";

class Control extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      polls: [],
      type: "",
      isLogged: false,
      profile: {},
      default: status
    };
  }
  showForm = (type) => {
    //console.log('SHOW ', type);
    this.setState({ type: type.toUpperCase() },
      this.props.history.push(type)
    );
  }
  doForm = (type, user, pass) => {
    //console.log('DO FORM', type, user, pass);
    let params = "username=" + user + "&password=" + pass;
    lib.makeAjaxRequest(urlAPI + type, "POST", params, true, (data) => {
      //console.log('DATA =>', data);
      if (data.logged) {
        //console.log('LOGGED');
        this.setState({
          isLogged: true,
          profile: data.profile
        }, function () {
          this.props.history.push("allpolls");
          this.getPolls();
        });
      }
      if (data.created) {       // automatically doLogin
        //console.log('CREATED, NOW LOGGING');
        this.doForm("login", user, pass);
      }
    });
  }
  doLogout = () => {
    //console.log('DO LOGOUT');
    lib.makeAjaxRequest(urlAPI + "logout", "GET", {}, true, (data) => {
      // console.log('DATA =>', data);
      if (data.logout) {
        this.setState({
          isLogged: false,
          profile: {}
        }, this.props.history.push("voting.html"));
      }
    });
  }
  doAddPoll = (question, options) => {
    //console.log('DO ADD POLL', question, options);
    let params = "question=" + question + "&options=" + options;
    lib.makeAjaxRequest(urlAPI + "addpoll", "POST", params, true, (data) => {
      this.getPolls();
      this.props.history.push("mypolls");
    });
  }
  deletePoll = (id) => {
    //console.log('DELETE POLL => ', id);
    let params = "pollid=" + id;
    lib.makeAjaxRequest(urlAPI + "deletepoll", "POST", params, true, (data) => {
      this.getPolls();
    });
  }
  getPolls = () => {
    // console.log('GETTING POLLS');
    lib.makeAjaxRequest(urlAPI + "getpolls", "GET", "", true, (data) => {
      data = data.polls;
      if (data) {
        let polls = [];
        data.map((element, index) => {
          let poll = {};
          poll.id = element._id;
          poll.createdBy = element.createdBy;
          poll.createdAt = element.createdAt;
          poll.question = element.question;
          let options = [];
          for (let i = 0; i < element.options.length; i++) {
            let aux = {};
            aux.text = element.options[i].text;
            aux.votes = element.options[i].votes;
            options.push(aux);
          }
          poll.options = options;
          polls.push(poll);
        });
        this.setState({
          polls: polls || [],
        });
      }
    });
  }
  addVote = (pollid, option) => {
    if (option == -1) {
      const newOption = window.prompt("New Option");
      if (!newOption) return;
      let params = "pollid=" + pollid + "&option=" + newOption;
      lib.makeAjaxRequest(urlAPI + "addoption", "POST", params, true, (d) => {
        this.getPolls();
      });
      return;
    }
    //console.log('ADD VOTE', pollid, option);
    let params = "pollid=" + pollid + "&option=" + option;
    lib.makeAjaxRequest(urlAPI + "addvote", "POST", params, true, (d) => {
      if (d.res === "voted") {
        window.alert("ALREADY VOTED ON THIS POLL");
      } else {
        this.getPolls();
      }
    });
  }
  componentDidMount() {
    console.log('DID MOUNT');
    //this.doForm("login", "user", "user");
    this.getPolls();
  }
  goHome = () => {
    this.props.history.push("voting.html");
  }
  goAllPolls = () => {
    this.props.history.push("allpolls");
  };
  goMyPolls = () => {
    this.props.history.push("mypolls");
  };
  goAddPoll = () => {
    this.props.history.push("addpoll");
  };
  render() {
    // console.log('RENDERING CONTROL');
    const a = {
      textAlign: "center",
    };
    const gap = {
      paddingTop: "60px",
    };
    return (
      <div className="plugin" style={a}>
        <Menu
          showForm={this.showForm}
          goHome={this.goHome}
          doLogout={this.doLogout}
          isLogged={this.state.isLogged}
          profile={this.state.profile}
          goAllPolls={this.goAllPolls}
          goMyPolls={this.goMyPolls}
          goAddPoll={this.goAddPoll}
        />
        <div style={gap}>
          <Switch>
            <Route exact path={this.state.default + "/voting.html"}
              render={() => (
                <AllPolls
                  polls={this.state.polls}
                  username={this.state.profile.username}
                  addVote={this.addVote}
                />
              )} />
            <Route path={this.state.default + "/login"}
              render={() => (
                <Form
                  type={this.state.type}
                  doForm={this.doForm}
                />
              )} />
            <Route path={this.state.default + "/signup"}
              render={() => (
                <Form
                  type={this.state.type}
                  doForm={this.doForm}
                />
              )} />
            <Route path={this.state.default + "/allPolls"}
              render={() => (
                <AllPolls
                  polls={this.state.polls}
                  username={this.state.profile.username}
                  addVote={this.addVote}
                />
              )} />
            <Route path={this.state.default + "/myPolls"}
              render={() => (
                <MyPolls
                  polls={this.state.polls}
                  username={this.state.profile.username}
                  deletePoll={this.deletePoll}
                  addVote={this.addVote}
                />
              )} />
            <Route path={this.state.default + "/addPoll"}
              render={() => (
                <AddPoll
                  polls={this.state.polls}
                  username={this.state.profile.username}
                  doAddPoll={this.doAddPoll}
                />
              )} />
            {/*<Route path={this.state.default + "/"}
              component={} />*/}
          </Switch>
        </div>
        <Footer
          isEmpty={
            this.props.location.pathname === status + "/login"
            || this.props.location.pathname === status + "/signup"
          }
        />
      </div >
    );
  }
}

const layout = (
  <Router>
    <Route path="/" component={Control} />
  </Router>
);

ReactDOM.render(
  layout,
  destination
);