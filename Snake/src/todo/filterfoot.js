import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { FilterType } from "./action/index";

@inject("filterStore")
@observer
class FilterFoot extends Component {
  handleClick(type) {
    this.props.filterStore.filterTodo(type);
  }
  render() {
    return (
      <div>
        <button onClick={this.handleClick.bind(this, FilterType.ALL)}>
          All
        </button>
        <button onClick={this.handleClick.bind(this, FilterType.COMPLETED)}>
          COMPLETED
        </button>
        <button onClick={this.handleClick.bind(this, FilterType.UNCOMPLETED)}>
          UNCOMPLETED
        </button>
      </div>
    );
  }
}

export default FilterFoot;
