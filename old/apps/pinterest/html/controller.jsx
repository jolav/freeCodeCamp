/* global ReactDOM React lib ShowAllPics AllPics
MyPics Profile*/

const destination = document.getElementById('pinterest');
const Router = window.ReactRouterDOM.BrowserRouter;
const Route = window.ReactRouterDOM.Route;
const Link = window.ReactRouterDOM.Link;
const Prompt = window.ReactRouterDOM.Prompt;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;

const dev = "/old/apps/pinterest/html";
const prod = "/old/apps/pinterest";
const status = prod;
const defaultImage = "http://freecodecamp.codetabs.com/_assets/images/pinterest/imageNotFound.png";

//const urlAPI = "http://127.0.0.1:3000/";
const urlAPI = "https://pinterest-v1-jolav.glitch.me/";

class Controller extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pics: [],
      isLogged: false,
      profile: {},
      usersearch: "",
      default: status// prod,
    };
    this.addPic = this.addPic.bind(this);
  }
  doLogout = () => {
    // console.log('Do LOGOUT');
    this.setState({
      isLogged: false,
      profile: {},
    }, this.props.history.push("pinterest.html"));
  }
  searchByUser = (idTwitter) => {
    this.setState({
      usersearch: idTwitter
    }, this.props.history.push("userpics"));
  }
  addPic(text, link) {
    // console.log('ADDPIC =>', text, link);
    var image = new Image();
    image.onload = () => {
      this.addPicRequest(text, link);
    };
    image.onerror = () => {
      link = defaultImage;
      this.addPicRequest(text, link);
    };
    image.src = link;
  }
  addPicRequest = (text, link) => {
    let params = "text=" + text + "&link=" + link;
    // console.log('PARAMS=>', params);
    lib.makeAjaxRequest(urlAPI + "addpic", "POST", params, true, (data) => {
      this.getPics();
    });
  }
  deletePic = (id) => {
    // console.log('DELETE PIC', id);
    let params = "picid=" + id;
    lib.makeAjaxRequest(urlAPI + "deletepic", "POST", params, true, (data) => {
      this.getPics();
    });
  }
  votePic = (pic, user) => {
    // console.log('VOTE PIC', pic, user);
    let params = "picid=" + pic + "&userid=" + user;
    lib.makeAjaxRequest(urlAPI + "votepic", "POST", params, true, (data) => {
      this.getPics();
    });
  }
  goAllPics = () => {
    this.props.history.push("allpics");
  }
  goMyPics = () => {
    this.props.history.push("mypics");
  }
  goProfile = () => {
    this.props.history.push("profile");
  }
  goHome = () => {
    this.props.history.push("pinterest.html");
  }
  getPics = () => {
    // console.log('GET PICS');
    lib.makeAjaxRequest(urlAPI + "getpics", "GET", "", false, (data) => {
      data = data.pics;
      if (data) {
        //console.log('pics count =>', data.length);
        //console.log('pics =>', (data));
        let pics = [];
        data.map((element, index) => {
          let pic = {};
          pic.id = element._id;
          pic.idTwitter = element.idTwitter;
          pic.logo = element.logo;
          pic.text = element.text;
          pic.link = element.link;
          pic.likes = element.likes;
          pics.push(pic);
        });
        this.setState({
          pics: pics || [],
        });
      }
      if (!this.state.isLogged) {
        this.checkUser();
      }
    });
  }
  checkUser = () => {
    lib.makeAjaxRequest(urlAPI + "auth/user", "GET", "", true, (data) => {
      //console.log('Logged => ', data.success, " | User => ", data.user);
      if (data.success) {
        // console.log('LOGGED AS ...', data.user.name);
        this.setState({
          isLogged: true,
          profile: data.user
        }, this.props.history.push(/*"profile"*/"allpics"));
      } else {
        // console.log('NOT LOGGED');
        // window.location = "http://127.0.0.1:3000/auth/twitter"; // autologin
        //this.props.history.push("allpics"); // autoredirect
      }
    });
  }
  componentDidMount() {
    // console.log('DID MOUNT');
    this.getPics();
  }
  render() {
    const a = {
      textAlign: "center",
    };
    const gap = {
      paddingTop: "60px",
    };
    return (
      <div className="plugin" style={a}>
        <Menu
          isLogged={this.state.isLogged}
          profile={this.state.profile}
          doLogout={this.doLogout}
          goAllPics={this.goAllPics}
          goMyPics={this.goMyPics}
          goProfile={this.goProfile}
          goHome={this.goHome}
        />
        <div style={gap}>
          <Switch>
            <Route exact path={this.state.default + "/pinterest.html"}
              render={() => (
                <AllPics
                  pics={this.state.pics}
                  profile={this.state.profile}
                  searchByUser={this.searchByUser}
                  votePic={this.votePic}
                />
              )} />
            <Route path={this.state.default + "/allpics"}
              render={() => (
                <AllPics
                  pics={this.state.pics}
                  profile={this.state.profile}
                  searchByUser={this.searchByUser}
                  votePic={this.votePic}
                />
              )} />
            <Route path={this.state.default + "/mypics"}
              render={() => (
                <MyPics
                  pics={this.state.pics}
                  profile={this.state.profile}
                  addPic={this.addPic}
                  searchByUser={this.searchByUser}
                  deletePic={this.deletePic}
                />
              )} />
            <Route path={this.state.default + "/userpics"}
              render={() => (
                <UserPics
                  pics={this.state.pics}
                  profile={this.state.profile}
                  idTwitterSearched={this.state.usersearch}
                  searchByUser={this.searchByUser}
                  votePic={this.votePic}
                />
              )} />
            <Route path={this.state.default + "/profile"}
              render={() => (
                <Profile
                  profile={this.state.profile}
                />
              )} />
            {/*<Route path={this.state.default + "/"}
         component={} />*/}
          </Switch>
        </div>
        <Footer
          isEmpty={this.props.location.pathname === status + "/profile"}
        />
      </div >
    );
  }
}

const layout = (
  <Router>
    <Route path="/" component={Controller} />
  </Router>
);

ReactDOM.render(
  layout,
  destination
);

