import { observable, action } from "mobx";

class Foods {
  @observable top = 40;
  @observable left = 40;
  @action.bound
  randoms() {
    this.top = 10 * Math.floor(Math.random() * (39 - 1) + 1);
    this.left = 10 * Math.floor(Math.random() * (39 - 1) + 1);
    console.log(this.top, this.left, "left top");
  }
}

export const foodsStore = new Foods();
