/* global ReactDOM React urlAPI*/

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.doLogout = this.doLogout.bind(this);
  }
  doLogout() {
    this.props.doLogout();
  }
  goAllPics = () => {
    this.props.goAllPics();
  }
  goMyPics = () => {
    this.props.goMyPics();
  }
  goProfile = () => {
    this.props.goProfile();
  }
  goHome = () => {
    this.props.goHome();
  }
  componentDidMount() {
    //console.log('MENU');
  }
  render() {
    const navbar = {
      fontFamily: "'PT Sans','arial',sans-serif",
      width: "100%",
      position: "fixed",
      fontSize: "1em",
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
      maxHeight: "40px",
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
    const loginlink = {
      color: "#ddd",
    };
    const image2 = {
      verticalAlign: "middle",
      maxHeight: "32px",
    };
    const left1 = () => {
      return (
        <div className="left" style={left} className="loginlink"
          onClick={this.goHome}>
          <img className="logo" style={image} alt="" src="/_assets/images/pinterest/camera60.png" /> PINTEREST CLONE
        </div>
      );
    };
    const right1 = () => {
      return (
        <div className="right" style={right}>
          <span style={Object.assign({}, menu, action)} className="loginlink"
            onClick={this.goAllPics}>AllPics</span>
          <span className="actionMenu" style={Object.assign({}, menu, action)}>
            <a href={urlAPI + "auth/twitter"} style={loginlink}
              className="loginlink"> Login</a>&nbsp;&nbsp;
            <img className="logo" style={image} alt="signup" src="/_assets/images/pinterest/twitter32.png" />
          </span>
        </div >
      );
    };
    const right2 = () => {
      return (
        <div className="right" style={right}>
          <span style={Object.assign({}, menu, action)} className="loginlink"
            onClick={this.goAllPics}>AllPics</span>
          <span style={Object.assign({}, menu, action)} className="loginlink"
            onClick={this.goMyPics}>MyPics</span>
          <span className="menu" style={Object.assign({}, menu, action)}
            onClick={this.goProfile} className="loginlink">
            <img className="logo" style={image2} alt="login"
              src={this.props.profile.logo}/*"/_assets/images/book/profile128.png"*/ />
            {this.props.profile.name}
          </span>
          <span style={Object.assign({}, menu, action)}
            onClick={this.doLogout} className="loginlink">
            <img className="image" style={image2} alt="logout" src="/_assets/images/book/logout32.png" />
          </span>
        </div>
      );
    };
    const k = () => {
      return (<div></div>);
    };
    return (
      <section style={navbar} >
        {left1()}
        {this.props.isLogged ? right2() : right1()}
      </section >
    );
  }
}

class AllPics extends React.Component {
  searchByUser = (idTwitter) => {
    this.props.searchByUser(idTwitter);
  }
  votePic = (pic, user) => {
    this.props.votePic(pic, user);
  }
  render() {
    const a = {
      textAlign: "center"
    };
    return (
      <div className="pics" style={a}>
        <RenderPics
          pics={this.props.pics}
          profile={this.props.profile}
          searchByUser={this.searchByUser}
          votePic={this.votePic}
        />
      </div>
    );
  }
}

class MyPics extends React.Component {
  addPic = (text, link) => {
    this.props.addPic(text, link);
  }
  searchByUser = (idTwitter) => {
    this.props.searchByUser(idTwitter);
  }
  deletePic = (id) => {
    this.props.deletePic(id);
  }
  render() {
    // console.log('RENDERING MY PICS');
    const a = {
      textAlign: "center"
    };
    const mypics = [];
    this.props.pics.map((pic) => {
      if (pic.idTwitter === this.props.profile.idTwitter) {
        mypics.push(pic);
      }
    });
    return (
      <div>
        <AddPic
          addPic={this.addPic}
        />
        <div className="pics" style={a}>
          <RenderPics
            pics={mypics}
            profile={this.props.profile}
            searchByUser={this.searchByUser}
            delete={true}
            deletePic={this.deletePic}
          />
        </div>
      </div>
    );
  }
}

class UserPics extends React.Component {
  searchByUser = (idTwitter) => {
    this.props.searchByUser(idTwitter);
  }
  votePic = (pic, user) => {
    this.props.votePic(pic, user);
  }
  render() {
    //console.log('RENDERING USER PICS => ', this.props);
    const a = {
      textAlign: "center"
    };
    //console.log('SEARCHING ..', this.props.idTwitterSearched);
    const userpics = [];
    this.props.pics.map((pic) => {
      if (pic.idTwitter === this.props.idTwitterSearched) {
        userpics.push(pic);
      }
    });
    //console.log('USERPICS ==>', userpics);
    return (
      <div className="pics" style={a}>
        <RenderPics
          pics={userpics}
          profile={this.props.profile}
          searchByUser={this.searchByUser}
          votePic={this.votePic}
        />
      </div>
    );
  }
}

class RenderPics extends React.Component {
  searchByUser(idTwitter) {
    this.props.searchByUser(idTwitter);
  }
  deletePic = (id) => {
    this.props.deletePic(id);
  }
  votePic = (d) => {
    //console.log('voting ...', d);
    if (d.idTwitter !== this.props.profile.idTwitter) {
      this.props.votePic(d.id, this.props.profile.idTwitter);
    } else {
      // Not own votes
    }
  }
  render() {
    //console.log('RENDERING PICS', this.props);
    const action = {
      cursor: "pointer",
    };
    const delButton = {
      marginTop: "10px",
    };
    const deleteAction = {
      cursor: "pointer",
      backgroundColor: "#ff8b8b",
      padding: "3px 8px",
      borderRadius: "5px",
      color: "#fafafa",
    };
    // console.log('DELETE ===', this.props.delete);
    const pics = this.props.pics.map((d) => {
      if (d.text.length > 100) {
        d.text2 = d.text.slice(0, 97) + "...";
      } else {
        d.text2 = d.text;
      }
      // console.log(d);
      return (
        <div className="pic" key={d.id}>
          <div className="card">
            <img className="cardImage" src={d.link} alt="image" />
            <div className="cardText">
              <span>{d.text2}</span>
            </div>
            <div className="cardFooter">
              <span className="nameAuthor">
                <img className="logoAuthor"
                  style={action}
                  src={d.logo}
                  onClick={() => this.searchByUser(d.idTwitter)}
                />
              </span>
              {this.props.profile.name ?
                <span className="addStar"
                  style={action}
                  onClick={() => this.votePic(d)}>
                  <img src="/_assets/images/pinterest/star32.png" />
                  {d.likes.length}
                </span>
                : <span className="addStar">
                  <img src="/_assets/images/pinterest/star32.png" />
                  {d.likes.length}
                </span>}
            </div>
            {this.props.delete &&
              <div style={delButton}>
                <span style={deleteAction}
                  onClick={() => this.deletePic(d.id)}>Delete</span>
              </div>}
          </div >
        </div >
      );
    });
    return pics;
  }
}

class AddPic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pictext: "",
      piclink: "",
    };
    this.textChange = this.textChange.bind(this);
    this.linkChange = this.linkChange.bind(this);
    this.submitAddPic = this.submitAddPic.bind(this);
  }
  submitAddPic(e) {
    e.preventDefault();
    if (this.state.piclink && this.state.pictext) {
      this.props.addPic(this.state.pictext, this.state.piclink);
    }
  }
  textChange(e) {
    this.setState({ pictext: e.target.value });
  }
  linkChange(e) {
    this.setState({ piclink: e.target.value });
  }
  render() {
    const addpic = {
      textAlign: "center",
      //display: "flex",
      //flexFlow: "column wrap",
      //justifyContent: "center",
    };
    const row = {
      padding: "15px",
    };
    const input = {
      fontSize: "1.2em",
      border: "0",
      background: "transparent",
      borderBottom: "3px solid orange",
      color: "#222",
    };
    const button = {
      fontSize: "1em",
      cursor: "pointer",
      padding: "5px 20px",
      backgroundColor: "#59d",
      borderRadius: "5px",
      border: "1px solid #59d",
      color: "#fafafa",
    };
    return (
      <div>
        <div className="form" style={addpic}>
          <div className="row" style={row}>
            <input style={input} type="text" name="text" placeholder="pic text*"
              value={this.state.pictext}
              onChange={this.textChange} />
          </div>
          <div className="row" style={row}>
            <input style={input} type="text" name="link" placeholder="pic link*"
              value={this.state.piclink}
              onChange={this.linkChange} />
          </div>
          <div className="row" style={row}>
            <input style={button} type="submit" value="ADD PIC"
              onClick={this.submitAddPic} />
          </div>
        </div>
        <hr />
      </div>
    );
  }
}

class Profile extends React.Component {
  render() {
    const a = {
      textAlign: "center"
    };
    const logo = {
      verticalAlign: "middle",
      maxHeight: "64px",
    };
    return (
      <div className="plugin" style={a}>
        <h2>NAME => {this.props.profile.name}</h2>
        <h2>AVATAR => &nbsp;
          <img style={logo} alt="logo" src={this.props.profile.logo} />
        </h2>
        <h2>userID => {this.props.profile.idTwitter}</h2>
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
