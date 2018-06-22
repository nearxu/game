import React, { Component } from "react";

import TodoInput from "./todoinput";
import TodoList from "./todolist";
import FilterFoot from "./filterfoot";

class App extends Component {
  render() {
    return (
      <div className="App">
        <TodoInput />
        <TodoList />
        <FilterFoot />
      </div>
    );
  }
}

export default App;
