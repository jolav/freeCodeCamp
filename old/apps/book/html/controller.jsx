/* global ReactDOM React lib Home About Index LoginForm SignUpForm ShowBooks
MyBooks UserDataForm*/

const destination = document.getElementById('book');
const Router = window.ReactRouterDOM.BrowserRouter;
const Route = window.ReactRouterDOM.Route;
const Link = window.ReactRouterDOM.Link;
const Prompt = window.ReactRouterDOM.Prompt;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;

const development = "/old/apps/book/html";
const production = "/old/apps/book";

//const urlAPI = "http://localhost:3000/";
const urlAPI = "https://book-v1-jolav.glitch.me/";

class Controller extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      isLogged: false,
      user: undefined,
      profile: {},
      default: /*development// */production,
    };
    this.showLogin = this.showLogin.bind(this);
    this.showSignup = this.showSignup.bind(this);
    this.doLogin = this.doLogin.bind(this);
    this.doSignup = this.doSignup.bind(this);
    this.doLogout = this.doLogout.bind(this);
    this.goAllBooks = this.goAllBooks.bind(this);
    this.goMyBooks = this.goMyBooks.bind(this);
    this.goUserData = this.goUserData.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.askTrade = this.askTrade.bind(this);
    this.addBook = this.addBook.bind(this);
    this.acceptTrade = this.acceptTrade.bind(this);
  }
  showLogin() {
    this.props.history.push("login");
  }
  showSignup() {
    this.props.history.push("signup");
  }
  goAllBooks() {
    this.props.history.push("allbooks");
  }
  goMyBooks() {
    this.props.history.push("mybooks");
  }
  goUserData() {
    this.props.history.push("userdata");
  }
  updateProfile(user, name, city, state) {
    //console.log(`user=${user} name=${name} city=${city} state=${state}`);
    let newProfile = {
      username: user,
      fullName: name,
      city: city,
      state: state
    };
    this.setState({ profile: newProfile });
    let parameters = "username=" + newProfile.username;
    parameters += "&fullname=" + newProfile.fullName;
    parameters += "&city=" + newProfile.city;
    parameters += "&state=" + newProfile.state;
    const url = urlAPI + "updateuser";
    lib.makeAjaxRequest(url, "POST", parameters, true, (data) => {
      //console.log('UPDATED PROFILE ??????', data);
    });
  }
  askTrade(d) {
    //console.log('ASK TRADE');
    const dataurl = urlAPI + "askTrade/";
    let parameters = "candidate=" + this.state.user + "&id=" + d.id;
    lib.makeAjaxRequest(dataurl, "POST", parameters, true, () => {
      this.getBooks();
    });
  }
  acceptTrade(id, newOwner) {
    //console.log('NEW OWNER =>', id, newOwner);
    const dataurl = urlAPI + "accepttrade/";
    let parameters = "newOwner=" + newOwner + "&id=" + id;
    lib.makeAjaxRequest(dataurl, "POST", parameters, true, () => {
      this.getBooks();
    });
  }
  addBook(title) {
    //console.log('ADD BOOK');
    const bookapi = "https://www.googleapis.com/books/v1/volumes?q=" + title;
    //const bookapi = "./zbooks.json";
    lib.fetchDataFromServer(bookapi, (book) => {
      if (!book.items[0]) return;
      const dataurl = urlAPI + "addbook/";
      let params = "owner=" + this.state.user + "&title=" + title;
      params += "&thumbnail=" +
        encodeURIComponent(book.items[0].volumeInfo.imageLinks.thumbnail);
      lib.makeAjaxRequest(dataurl, "POST", params, true, () => {
        this.getBooks();
      });
    });

  }
  doLogin(user, pass) {
    //console.log('DO LOGIN => ', user, pass);
    let parameters = "username=" + user + "&password=" + pass;
    lib.makeAjaxRequest(urlAPI + "login", "POST", parameters, true, (data) => {
      if (data.logged) {       // automatically doLogin
        this.setState({
          isLogged: true,
          user: user,
          profile: data.profile,
        }, this.getBooks());
      }
    });
  }
  doSignup(user, pass) {
    //console.log('DO SIGNUP =>', user, pass);
    let params = "username=" + user + "&password=" + pass;
    lib.makeAjaxRequest(urlAPI + "signup", "POST", params, true, (data) => {
      if (data.created) {       // automatically doLogin
        this.doLogin(user, pass);
      }
    });
  }
  doLogout() {
    //console.log('DO LOGOUT');
    lib.makeAjaxRequest(urlAPI + "logout", "GET", {}, true, (data) => {
      if (data.logout) {
        this.setState({
          isLogged: false,
          user: undefined
        }, this.props.history.push("book.html"));
      }
    });
  }
  getBooks() {
    //console.log('GET BOOKS');
    const dataurl = urlAPI + "getBooks/";
    lib.makeAjaxRequest(dataurl, "GET", "", true, (data) => {
      data = data.books;
      let books = [];
      data.map((element, index) => {
        let book = {};
        book.id = element._id;
        book.title = element.title;
        book.thumbnail = element.thumbnail;
        book.owner = element.owner;
        book.candidates = element.candidates;
        books.push(book);
      });
      this.setState({
        books: books || [],
      });
    });
    //this.props.history.push("allbooks");
    this.props.history.push("mybooks");
  }
  componentDidMount() {
    //console.log('DID MOUNT');
    //this.doLogin("user", "user");
    //this.getBooks();
  }
  render() {
    const a = {
      textAlign: "center",
    };
    const gap = {
      paddingTop: "75px",
    };
    const links = {
      fontFamily: "arial",
      fontSize: "1em",
    };
    return (
      <div className="plugin" style={a}>
        <Menu
          showLogin={this.showLogin}
          showSignup={this.showSignup}
          goAllBooks={this.goAllBooks}
          goMyBooks={this.goMyBooks}
          goUserData={this.goUserData}
          doLogout={this.doLogout}
          isLogged={this.state.isLogged}
          user={this.state.user}
        />
        <div style={gap}>
          <div style={links}>
            {/*<Link to='./book.html'> <h1>Index</h1> </Link>
            <Link to='./login'> Login </Link>
            <Link to='./signup'> Signup </Link>
            <Link to='./allbooks'> AllBooks </Link>
            <Link to='./mybooks'> MyBooks </Link>
            <Link to='./userdata'> UserData </Link>
            <Link to='./'>  </Link>*/}
          </div>
          <Switch>
            <Route exact path={this.state.default + "/book.html"}
              component={Home} />
            <Route path={this.state.default + "/login"}
              render={() => (
                <LoginForm doLogin={this.doLogin} />
              )} />
            <Route path={this.state.default + "/signup"}
              render={() => (
                <SignUpForm doSignup={this.doSignup} />
              )} />
            <Route path={this.state.default + "/allbooks"}
              render={() => (
                <ShowBooks
                  books={this.state.books}
                  username={this.state.profile.username}
                  askTrade={this.askTrade}
                />
              )} />
            <Route path={this.state.default + "/mybooks"}
              render={() => (
                <MyBooks books={this.state.books}
                  username={this.state.profile.username}
                  addBook={this.addBook}
                  acceptTrade={this.acceptTrade}
                />
              )} />
            <Route path={this.state.default + "/userdata"}
              render={() => (
                <UserDataForm
                  profile={this.state.profile}
                  updateProfile={this.updateProfile}
                />
              )} />
            {/*<Route path={this.state.default + "/"}
              component={} />*/}
          </Switch>
        </div>
        <Footer
          isEmpty={this.props.location.pathname === production + "/allbooks"
            || this.props.location.pathname === production + "/mybooks"} />
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



