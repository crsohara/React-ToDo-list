import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React ToDo list</h2>
        </div>
        <ToDoList/>
      </div>
    );
  }
}

class ToDoList extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.jumpToStep = this.jumpToStep.bind(this);
    this.addListItem = this.addListItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.state = {
      stepNumber: 0,
      newitem: '',
      history: [{
        listitems: []
      }]
    };
  }

  jumpToStep(step) {
    this.setState({
      stepNumber: step
    })
  }

  removeItem(removeIndex) {
    const history = this.state.history.slice();
    const current = history[history.length -1];
    const listitems = current.listitems.slice();

    this.setState({
      stepNumber: history.length,
      history: history.concat([{
        listitems: listitems.filter( (item, index) => {
          return index !== removeIndex;
        })
      }])
    })
  }

  addListItem(event) {
    event.preventDefault();
    const history = this.state.history.slice();
    const current = history[history.length - 1];
    const listitems = current.listitems.slice();

    this.setState({
      stepNumber: history.length,
      newitem: '',
      history: history.concat([{
        listitems: listitems.concat(this.state.newitem)
      }])
    });
  }

  handleChange(event) {
    this.setState({newitem: event.target.value})
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const listitems = current.listitems;
    const steps = history.map( (step, index) => {
      return (
        <li key={index}>
          <button onClick={() => this.jumpToStep(index)}>Step {index}</button>
        </li>
      )
    });

    return (
      <div className="todolist-container">
        <form onSubmit={this.addListItem}>
          <input value={this.state.newitem} onChange={this.handleChange}/>
          <button>Add To List</button>
        </form>

        <List 
          items={listitems}
          removeItem={this.removeItem}
        />

        <hr/>

        <div className="history">
          <h1>LIST HISTORY</h1>
          <ul>
            {steps}
          </ul>
        </div>
      </div>
    )
  }
}

class List extends Component {
  constructor() {
    super();
    this.removeItem = this.removeItem.bind(this)
  }
  removeItem(item) {
    return this.props.removeItem(item);
  }
  render() {
    return (
      <ul>
        {this.props.items.map( (item, index) => (
          <ListItem 
            key={index} 
            index={index} 
            item={item} 
            removeItem={this.removeItem}
          />
        ))}
      </ul>
    )
  }
}

class ListItem extends Component {
  
  constructor(props) {
    super(props);
    this.remove = this.remove.bind(this);
    this.revert = this.revert.bind(this);
    this.areYouSure = this.areYouSure.bind(this);
    this.strings = {
      remove: 'remove ',
      sure: 'are you sure?'
    };

    this.state = {
      status: false,
      text: this.strings.remove, 
    };
  }
  remove(item) {
    this.props.removeItem(item);
  }
  revert() {
    if(this.state.status) {
      this.setState({
        text: this.strings.remove,
        status: !this.state.status
      })
    }
  }
  areYouSure(item) {
    return () => {
      if (this.state.status) {
        this.remove(item);
      }
      else {
        this.setState({ 
          text: this.strings.sure,
          status: !this.state.status
        });
      }
    }
  }

  render() {
    return (
      <li key={this.props.index}>
        <button onBlur={this.revert} onClick={this.areYouSure(this.props.index)}>{this.state.text}</button>
        {this.props.item}
      </li>
    )
  }
}
export default App;