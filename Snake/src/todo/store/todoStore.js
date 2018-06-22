import { observable, action, computed, useStrict } from "mobx";
import filterStore from "./filterStore";
import { FilterType } from "../action/index";

class TodoStore {
  @observable todos;
  constructor() {
    this.todos = [];
  }
  @action.bound
  addTodo = id => {
    this.todos.push(id);
  };

  @action.bound
  toggleTodo = id => {
    this.todos.forEach(todo => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
      }
    });
  };

  @computed
  get total() {
    return this.todos.length;
  }

  @computed
  get sortedTodos() {
    switch (filterStore.filter) {
      case FilterType.ALL:
        return this.todos;
      case FilterType.COMPLETED:
        return this.todos.filter(todo => todo.completed);
      case FilterType.UNCOMPLETED:
        return this.todos.filter(todo => !todo.completed);
      default:
        return this.todos;
    }
  }
}

const todoStore = new TodoStore();

export default todoStore;
