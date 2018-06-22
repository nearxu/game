import React, { Component } from "react";
import { observer, inject } from "mobx-react";

let uid = 0;
@inject("todoStore")
@observer
export default class TodoInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
  }
  handleClick() {
    if (!this.state.value) return;

    this.props.todoStore.addTodo({
      id: uid++,
      text: this.state.value,
      completed: false
    });
    this.setState({ value: "" });
  }
  handleChange(e) {
    e.preventDefault();
    this.setState({ value: e.target.value });
  }
  render() {
    return (
      <div className="input">
        <input
          type="text"
          onChange={e => this.handleChange(e)}
          value={this.state.value}
        />
        <button onClick={() => this.handleClick()}>提交</button>
        <p>{this.props.todoStore.total}个任务</p>
      </div>
    );
  }
}
