import { observable, action, useStrict } from "mobx";

class FilterStore {
  @observable filter;
  constructor() {
    this.filter = "";
  }
  @action
  filterTodo = type => {
    this.filter = type;
  };
}
const filterStore = new FilterStore();

export default filterStore;
