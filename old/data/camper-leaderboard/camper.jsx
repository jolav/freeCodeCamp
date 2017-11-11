/* global ReactDOM React */

const destination = document.getElementById('board');
const recent = "https://fcctop100.herokuapp.com/api/fccusers/top/recent";
const allTime = "https://fcctop100.herokuapp.com/api/fccusers/top/alltime";
const arrow = "/_assets/icons/arrowDown48.png";

class LeaderBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selected: [1, recent]
    };
    this.changeColumn = this.changeColumn.bind(this);
  }
  componentWillMount() {
    fetch(this.state.selected[1])
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({ data: data });
      });
  }
  componentDidUpdate() {
    fetch(this.state.selected[1])
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({ data: data });
      });
  }
  changeColumn(e) {
    e.preventDefault();
    const option = parseInt(e.target.id);
    if (!option) {
      return;
    }
    if (option !== this.state.selected[0]) {
      if (option === 1) {
        this.setState({ selected: [1, recent] });
      } else if (option === 2) {
        this.setState({ selected: [2, allTime] });
      }
    }
  }
  render() {
    const board = {
      margin: "2% auto",
      display: "flex",
      justifyContent: "center"
    };
    const resultList = this.state.data.map(function (d, index) {
      const linkName = `https://freecodecamp.org/${d.username}`;
      return (
        <tr key={index}>
          <th className="rowNumber" scope="row">{index + 1}
          </th>
          <td className="camper">
            <img className="logo" src={d.img} />&nbsp;
            <a href={linkName}>{d.username}</a>
          </td>
          <td className="points">{d.recent}</td>
          <td className="points">{d.alltime}</td>
        </tr>
      );
    });
    return (
      <div style={board}>
        <table className="table">
          <thead className="thead">
            <tr>
              <th className="">#</th>
              <th className="name">Camper Name</th>
              <th className="when" id="lastmonth" >
                <div id="1" onClick={this.changeColumn}>
                  &nbsp;Last Month&nbsp;
                  {
                    this.state.selected[0] === 1 &&
                    <img alt="arrow" src={arrow} />
                  }
                </div>
              </th>
              <th className="when" id="alltime">
                <div id="2" onClick={this.changeColumn}>
                  &nbsp;All Time&nbsp;
                  {
                    this.state.selected[0] == 2 &&
                    <img alt="arrow" src={arrow} />
                  }
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.length > 0 && resultList}
          </tbody>
        </table >
      </div >
    );
  }
}

const layout = (
  <div>
    <LeaderBoard />
  </div>
);

ReactDOM.render(
  layout,
  destination
);

