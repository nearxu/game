import { observable, action, computed } from "mobx";
import { mapsStore } from "./maps";
import { foodsStore } from "./foods";

class Snake {
  constructor() {
    this.interval;
  }

  @observable square = [[20, 20]]; //初始化蛇模型
  @observable direction = 39; //top 38 left 37 right 39 bottom 40
  @observable times = 1000; //蛇的移动系数，移动速度 = 移动系数/地图等级
  @observable stop = false;

  @action.bound
  move(type) {
    //超出规则暂停游戏
    if (mapsStore.rules(this.square[0])) {
      mapsStore.showPopup();
      return this.endMove();
    }
    let firstTop = this.square[0][0];
    let firstLeft = this.square[0][1];
    let direction = this.direction;
    //自动移动使用当前默认的方向
    if (!type) {
      type = direction;
    }
    switch (type) {
      case 37:
        if (direction === 39) {
          return;
        }
        firstLeft -= 10;
        break;
      case 38:
        if (direction === 40) {
          return;
        }
        firstTop -= 10;
        break;
      case 39:
        if (direction === 37) {
          return;
        }
        firstLeft += 10;
        break;
      case 40:
        if (direction === 38) {
          return;
        }
        firstTop += 10;
        break;
      default:
        break;
    }
    this.direction = type;
    //移动的主要逻辑，新增坐标，然后所有坐标往前移动
    this.square.unshift([firstTop, firstLeft]);
    if (!(firstTop === foodsStore.top && firstLeft === foodsStore.left)) {
      return this.square.pop();
    }
    //每吃掉一个食物，计算是否满足升级要求
    if (mapsStore.addRank(this.square.length)) {
      this.endMove(true);
      this.startMove();
    }
    //刷新食物
    foodsStore.randoms();
    // 判断食物是否在蛇身上
    // if (
    //   this.square.filter(
    //     m => m[0] === foodsStore.top && m[1] === foodsStore.left
    //   )
    // ) {
    //   foodsStore.randoms();
    // }
    // 判断蛇头是否碰到尾巴
    // this.square = [[20,20],[30,20],[40,20]]
    console.log(this.square.length, "length");
    if (this.square.length > 3) {
      console.log("竟来了");
      console.log(
        "test",
        this.square[0],
        this.square.filter(m => m === this.square[0][0]).length
      );
      debugger;
      if (this.square.filter(m => m === this.square[0]).length > 1) {
        console.log("p !!!!");
      }
    }
  }

  @action.bound
  startMove() {
    console.log(this.stop, "stop", this.interval, "interval");
    if (!this.stop) {
      mapsStore.hidePopup();
      this.square = [[20, 20]];
    }
    if (this.interval) {
      this.endMove();
    }
    this.interval = setInterval(() => this.move(), this.times / mapsStore.rank);
  }

  @action.bound
  endMove(stop = false) {
    clearInterval(this.interval);
    this.stop = stop;
  }
}

export const snakeStore = new Snake();
