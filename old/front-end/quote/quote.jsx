/* global ReactDOM React */

const destination = document.getElementById('app');
let globalVar = {};

const url = 'https://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&lang=en&jsonp=writeRes';

class QuoteBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quoteData: []
    };
  }
  componentWillMount() {
    globalVar.callback = (data) => {
      this.setState({ quoteData: data });
    };
    return;
    /*fetch(url) // only valid for json, not jsonp 
      .then((response) => {
        return response.json()
      })
      .then((quoteData) => {
        this.setState({ quoteData: quoteData })
      })*/
  }
  getJsonP() {
    let script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
  }
  render() {
    const boxStyle = {
      backgroundColor: "lightblue",
      borderRadius: "10px",
      maxWidth: "450px",
      margin: "10% auto",
      fontSize: "1.5em",
      lineHeight: "1.2em"
    };
    const loading = {
      fontSize: "2.5em"
    };
    if (this.state.quoteData.quoteText !== undefined) {
      return (
        <div className="kk" style={boxStyle}>
          <QuoteText text={this.state.quoteData.quoteText} />
          <QuoteAuthor author={this.state.quoteData.quoteAuthor} />
          <div className="controls">
            <QuoteTweet data={this.state.quoteData} />
            <QuoteNew />
          </div>
        </div>
      );
    } else {
      this.getJsonP();
      return (
        <p style={loading} className="txtH">Loading quoteData...</p>
      );
    }
  }
}

class QuoteText extends React.Component {
  render() {
    const textStyle = {
      padding: "5%"
    };
    return (
      <div style={textStyle}>
        <span>{this.props.text}</span>
      </div >);
  }
}

class QuoteAuthor extends React.Component {
  render() {
    const authorStyle = {
      textAlign: "right",
      paddingRight: "20%",
      fontWeight: "bold"
    };
    return (
      <div style={authorStyle}>
        <span>-&nbsp;{this.props.author}&nbsp;-</span>
      </div>);
  }
}

class QuoteTweet extends React.Component {
  constructor(props) {
    super(props);
    // This binding is necessary to make `this` work in the callback  
    this.eventQuoteTweet = this.eventQuoteTweet.bind(this);
  }
  eventQuoteTweet() {
    let text = this.props.data.quoteText;
    let author = this.props.data.quoteAuthor;
    let aux = encodeURIComponent(text + ' ' + author);
    let url = ('https://twitter.com/intent/tweet?text=' + aux);
    window.open(url);
  }
  render() {
    const tweetStyle = {
      padding: "0px"
    };
    const ts2 = {
      marginTop: "3px",
      cursor: "pointer"
    };
    return (
      <div style={tweetStyle}>
        <img onClick={this.eventQuoteTweet} id="but1" style={ts2} alt="Twitter" src="/_assets/icons/twitter.png" />
      </div>
    );
  }
}

class QuoteNew extends React.Component {
  constructor(props) {
    super(props);
    // This binding is necessary to make `this` work in the callback  
    this.eventNewQuote = this.eventNewQuote.bind(this);
  }
  eventNewQuote(e) {
    e.preventDefault();
    let script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
    this.callbackTest();
  }
  callbackTest() {
    //console.log('callbackTest');
  }
  render() {
    const newStyle = {
      backgroundColor: "#ddd",
      cursor: "pointer"
    };
    return (
      <div className="but" style={newStyle}>
        <span onClick={this.eventNewQuote} id="but2">New Quote</span>
      </div>);
  }
}

const layout = (
  <div>
    <QuoteBox />
  </div>
);

ReactDOM.render(
  layout,
  destination
);

function writeRes(data) {
  globalVar.callback(data);
}
