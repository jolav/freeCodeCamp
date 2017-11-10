/* global ReactDOM React marked */

const destination = document.getElementById('md');

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: props.template,
    };
    this.getBackData = this.getBackData.bind(this);
  }
  getBackData(data) {
    this.setState({ input: data });
  }
  render() {
    const container = {
      display: "flex"
    };
    return (
      <div style={container}>
        <Editor placeholder={this.state.input}
          callback={this.getBackData} />
        <Viewer raw={this.state.input} />
      </div>
    );
  }
}

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.editing = this.editing.bind(this);
  }
  editing(e) {
    e.preventDefault();
    //console.log(e.target.value);
    this.props.callback(e.target.value);
  }
  render() {
    return (
      <div className="editor">
        <div className="title">
          <span className="titleText">EDITOR</span>
        </div>
        <div className="input">
          <textarea id="input" placeholder={this.props.placeholder}
            onChange={this.editing}>
          </textarea>
        </div>
      </div>
    );
  }
}

class Viewer extends React.Component {
  insertHTML() {
    return {
      __html: marked(this.props.raw) + this.props.footer
    };
  }
  render() {
    return (
      <div className="previewer" >
        <div className="title">
          <span className="titleText">PREVIEWER</span>
        </div>
        <div className="output">
          <span id="output">
            <div dangerouslySetInnerHTML={this.insertHTML()} /></span>
        </div>
      </div>
    );
  }
}

Container.defaultProps = {
  template: `Heading
=======

Sub-heading
-----------

### Another deeper heading

Paragraphs are separated
by a blank line.

Leave 2 spaces at the end of a line to do a  
line break

Text attributes *italic*, **bold**, 
\`monospace\`, ~~strikethrough~~ .

Shopping list:

* apples
* oranges
* pears

Numbered list:

1. apples
2. oranges
3. pears

## Lists

Unordered

+ Create a list by starting a line with + ,  - , or  * 
+ Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    * Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
+ Very easy!

Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa


1. You can use sequential numbers...
1. ...or keep all the numbers as 1

Start numbering with offset:

57. foo
1. bar`
};

Viewer.defaultProps = {
  footer:
  `<br>
  <hr>
  <br>
  <footer class="jolav" style="font-size:1em;text-align:center;">
    <small>
      <strong>
        <a href="https://freecodecamp.codetabs.com">View all FreeCodeCamp Projects</a>
      </strong>
      <br>
    </small>
    <small>
      <img class="logo" style="max-height:24px; vertical-align:middle" alt="" src="/_assets/icons/jolav32.png">
      <strong> Jolav &copy; 2017 -
        <a href="https://github.com/jolav/freeCodeCamp">View on GitHub</a> -
      </strong>
    </small>
  </footer>
  <br>`
};


const layout = (
  <div>
    <Container />
  </div>
);

ReactDOM.render(
  layout,
  destination
);