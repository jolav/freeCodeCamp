/* global ReactDOM React */


const destination = document.getElementById('recipe');
const notImage = "/_assets/images/photoNot.png";
const editImage = "/_assets/icons/edit48.png";

//localStorage.clear();

class Recipes extends React.Component {
  constructor(props) {
    super(props);
    let initialData = [];
    if (localStorage.recipes === undefined) {
      initialData = JSON.parse(JSON.stringify(this.props.defaultRecipes));
    } else if (JSON.parse(localStorage.recipes).length === 0) {
      initialData = JSON.parse(JSON.stringify(this.props.defaultRecipes));
    } else {
      initialData = JSON.parse(localStorage.recipes);
    }
    this.state = {
      recipesList: initialData// props.defaultRecipes,
    };
    this.saveNewRecipe = this.saveNewRecipe.bind(this);
    this.saveEditRecipe = this.saveEditRecipe.bind(this);
  }
  saveNewRecipe(data) {
    let aux = {};
    aux.title = data.name;
    aux.image = data.image;
    aux.ingredients = data.list;
    this.state.recipesList.push(aux);
    this.setState({
      recipesList: this.state.recipesList
    });
    localStorage.recipes = JSON.stringify(this.state.recipesList);
  }
  saveEditRecipe(data) {
    if (data.delete === "yes") {
      this.state.recipesList.splice(data.index, 1);
    } else {
      let aux = {};
      aux.title = data.name;
      aux.image = data.image;
      aux.ingredients = data.list;
      this.state.recipesList[data.index] = aux;
    }
    this.setState({
      recipesList: this.state.recipesList
    });
    localStorage.recipes = JSON.stringify(this.state.recipesList);
  }
  render() {
    const a = {
      textAlign: "center"
    };
    return (
      <div>
        <section className="head">
          <Head saveNewRecipe={this.saveNewRecipe} />
        </section>
        <section className="recipes" style={a}>
          {
            this.state.recipesList.map((d, index) => {
              return (
                <div key={index}>
                  <Recipe saveEditRecipe={this.saveEditRecipe}
                    index={index} data={d} />
                </div>
              );
            })
          }
        </section>
      </div>
    );
  }
}

class Recipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditRecipe: false
    };
    this.editRecipe = this.editRecipe.bind(this);
    this.saveEditRecipe = this.saveEditRecipe.bind(this);
  }
  editRecipe() {
    this.setState({ showEditRecipe: !this.state.showEditRecipe });
  }
  saveEditRecipe(data) {
    this.props.saveEditRecipe(data);
  }
  render() {
    return (
      <div className="recipe">
        <div className="title">
          <div>{this.props.data.title}</div>
          <img className="action" alt="action" src={editImage}
            onClick={this.editRecipe} />
        </div>
        {/*<div>{this.props.data.ingredients}</div>*/}
        <img className="recipeImage" alt="food" src={this.props.data.image} />
        {/*<div className="actions">
          <img className="action" alt="action" src="edit48.png" />
          <img className="action" alt="action" src="delete48.png" />
    </div>*/}
        {
          this.state.showEditRecipe &&
          <EditRecipe hide={this.editRecipe}
            saveEditRecipe={this.saveEditRecipe}
            index={this.props.index} data={this.props.data} />
        }
      </div>
    );
  }
}

class EditRecipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipe: {
        name: "",
        image: "",
        list: ""
      }
    };
    this.inputChange = this.inputChange.bind(this);
    this.exit = this.exit.bind(this);
    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);
  }
  inputChange(e) {
    switch (e.target.id) {
      case "editName":
        this.state.recipe.name = e.target.value;
        break;
      case "editImage":
        this.state.recipe.image = e.target.value;
        break;
      case "editList":
        this.state.recipe.list = e.target.value;
        break;
    }
    this.setState({ recipe: this.state.recipe });
  }
  exit() {
    this.props.hide();
  }
  save() {
    if (this.state.recipe.name === "") {
      return;
    }
    let list = this.state.recipe.list.split(",").map(function (el) {
      if (el.trim().length > 0) { return el.trim(); }
    });
    list = list.filter(Boolean);
    this.state.recipe.list = list;
    const imageData = new Image();
    imageData.onload = () => {
      this.props.hide();
      this.props.saveEditRecipe(this.state.recipe);
    };
    imageData.onerror = () => {
      this.state.recipe.image = notImage;
      this.props.hide();
      this.props.saveEditRecipe(this.state.recipe);
    };
    imageData.src = this.state.recipe.image;
  }
  delete() {
    this.state.recipe.delete = "yes";
    this.props.hide();
    this.props.saveEditRecipe(this.state.recipe);
    console.log('delete');
  }
  componentWillMount() {
    this.state.recipe.name = this.props.data.title;
    this.state.recipe.image = this.props.data.image;
    this.state.recipe.list = this.props.data.ingredients.toString();
    this.state.recipe.index = this.props.index;
    this.state.recipe.delete = "no";
  }
  render() {
    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <span onClick={this.exit} className="close">close X</span>
            <span id="actionType">EDIT recipe</span>
          </div>
          <div className="modal-body">
            <div className="entrie">
              <label>Recipe</label>
              <input type="text" className="for-control" id="editName"
                placeholder="Enter recipe name"
                value={this.state.recipe.name}
                onChange={this.inputChange} />
            </div>
            <div className="entrie">
              <label>URL image</label>
              <input type="text" className="for-control" id="editImage"
                placeholder="Enter image url"
                value={this.state.recipe.image}
                onChange={this.inputChange} />
            </div>
            <div className="entrie">
              <label>Ingredients</label>
              <input type="text" className="for-control" id="editList"
                placeholder="Enter ingredients list separated by comma"
                value={this.state.recipe.list}
                onChange={this.inputChange} />
            </div>
          </div>
          <div className="modal-footer">
            <span className="delete" onClick={this.delete}>Delete recipe</span>
            <span onClick={this.save} id="saveAndClose">Save and Close</span>
          </div>
        </div>
      </div>
    );
  }
}


class Head extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddRecipe: false
    };
    this.addRecipe = this.addRecipe.bind(this);
    this.saveNewRecipe = this.saveNewRecipe.bind(this);
  }
  addRecipe() {
    //e.preventDefault();
    this.setState({ showAddRecipe: !this.state.showAddRecipe });
  }
  saveNewRecipe(data) {
    this.props.saveNewRecipe(data);
  }
  render() {
    return (
      <div className="headTitle">
        <span></span>
        <h1>RECIPES</h1>
        <span className="add" onClick={this.addRecipe}>+ Add</span>
        {
          this.state.showAddRecipe &&
          <AddRecipe hide={this.addRecipe} saveNewRecipe={this.saveNewRecipe} />
        }
      </div>
    );
  }
}

class AddRecipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipe: {
        name: "",
        image: "",
        list: ""
      }
    };
    this.inputChange = this.inputChange.bind(this);
    this.exit = this.exit.bind(this);
    this.save = this.save.bind(this);
  }
  inputChange(e) {
    switch (e.target.id) {
      case "newName":
        this.state.recipe.name = e.target.value;
        break;
      case "newImage":
        this.state.recipe.image = e.target.value;
        break;
      case "newList":
        this.state.recipe.list = e.target.value;
        break;
    }
    this.setState({ recipe: this.state.recipe });
  }
  exit() {
    this.props.hide();
  }
  save() {
    if (this.state.recipe.name === "") {
      return;
    }
    let list = this.state.recipe.list.split(",").map(function (el) {
      if (el.trim().length > 0) { return el.trim(); }
    });
    list = list.filter(Boolean);
    this.state.recipe.list = list;
    const imageData = new Image();
    imageData.onload = () => {
      this.props.hide();
      this.props.saveNewRecipe(this.state.recipe);
    };
    imageData.onerror = () => {
      this.state.recipe.image = notImage;
      this.props.hide();
      this.props.saveNewRecipe(this.state.recipe);
    };
    imageData.src = this.state.recipe.image;
  }

  render() {
    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <span onClick={this.exit} className="close">close X</span>
            <span id="actionType">Add new recipe</span>
          </div>
          <div className="modal-body">
            <div className="entrie">
              <label>Recipe</label>
              <input type="text" className="for-control" id="newName"
                placeholder="Enter recipe name"
                value={this.state.recipe.name}
                onChange={this.inputChange} />
            </div>
            <div className="entrie">
              <label>URL image</label>
              <input type="text" className="for-control" id="newImage"
                placeholder="Enter image url"
                value={this.state.recipe.image}
                onChange={this.inputChange} />
            </div>
            <div className="entrie">
              <label>Ingredients</label>
              <input type="text" className="for-control" id="newList"
                placeholder="Enter ingredients list separated by comma"
                value={this.state.recipe.list}
                onChange={this.inputChange} />
            </div>
          </div>
          <div className="modal-footer">
            <span></span>
            <span onClick={this.save} id="saveAndClose">Save and Close</span>
          </div>
        </div>
      </div>
    );
  }
}

Recipes.defaultProps = {
  defaultRecipes: [
    {
      title: 'Cookies',
      ingredients: ['Cup shortening', 'Peanut Butter', 'Milk', 'Eggs',
        'Vanilla', 'Sugar'],
      image: 'https://cdn.pcwallart.com/images/chocolate-chip-cookies-and-milk-wallpaper-2.jpg'
    }, {
      title: 'Blueberry',
      ingredients: ['Vodka', 'Blueberry'],
      image: 'https://img.huffingtonpost.com/asset/scalefit_600_noupscale/55c96a571d00002f001446b7.jpeg'
    }, {
      title: 'Spaghetti',
      ingredients: ['Noodles', 'Tomato Sauce', 'Meatballs', 'Onion'],
      image: 'https://cdn-image.myrecipes.com/sites/default/files/styles/300x300/public/image/recipes/ay/06/spaghetti-meatballs-ay-1875344-x.jpg?itok=rou85Q3g'
    }, {
      title: 'Food with no Photo but with a very very very very long name.',
      ingredients: ['Potatoes'],
      image: notImage
    }, {
      title: 'Rice Pudding',
      ingredients: ['White Rice', 'Milk', 'Sugar', 'Salt'],
      image: 'https://cdn-image.myrecipes.com/sites/default/files/styles/300x300/public/image/recipes/rs/2007/rice-pudding-rs-1582788-x.jpg?itok=vFbNvIzh'
    }, {
      title: 'Vegetarian pizza',
      ingredients: ['Pizza', 'Vegetables'],
      image: 'https://s-media-cache-ak0.pinimg.com/736x/b4/b0/7b/b4b07b7e8d77fa0990a33385b8675365--tone-it-up-vegetarian-recipes-flavorful-vegetarian-recipes.jpg'
    }, {
      title: 'Pesto Chicken',
      ingredients: ['Chicken', 'Vegetables'],
      image: 'https://s-media-cache-ak0.pinimg.com/736x/8d/11/00/8d11005c1f137b8f58e1f0db6871fb58.jpg'
    }, {
      title: 'Secret Cookies of Dart Vader',
      ingredients: ['Cup shortening', 'Peanut Butter', 'Milk', 'Eggs',
        'Vanilla', 'Sugar'],
      image: 'https://4.bp.blogspot.com/-_qRAJrtalU0/TquMymJPBUI/AAAAAAAAAk8/1AotB3Oy4wM/s320/IMG_5561.jpg'
    }
  ]
};

const layout = (
  <div>
    <Recipes />
  </div>
);

ReactDOM.render(
  layout,
  destination
);
