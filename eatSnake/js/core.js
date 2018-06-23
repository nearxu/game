var Snake = function(width, height, snakeId, speed, isAuto) {
  this.width = width || 20; //创建地图的行跟列数
  this.height = height || 20;
  this.snakeId = snakeId || "snake"; //创建的表格id
  this.Grid = []; //存放td对象的数组(二维)
  this.snakeGrid = []; //存放蛇的数组
  this.foodGrid = []; //存放食物的数组
  this.derectkey = 39; //按下的方向键
  this.goX = 0; //蛇横向移动的位移，1或-1
  this.goY = 0; //蛇纵向移动的位移，1或-1
  this.speed = this.oldSpeed = speed || 10; //蛇移动的速度
  (this.stop = true), //控制蛇开始/暂停
    (this.snakeTimer = null); //蛇移动主函数的计时器
  this.isAuto = isAuto || false; //是否启用自动模式（不完善）
  this.init();
};

Snake.prototype = {
  multiArr(m, n) {
    var arr = new Array(m);
    for (let i = 0; i < m; i++) {
      arr[i] = new Array(n);
    }
    return arr;
  },
  bind(fn, context) {
    return function() {
      return fn.apply(context, arguments);
    };
  },
  createMap() {
    var table = document.createElement("table");
    var tbody = document.createElement("tbody");
    for (let i = 0; i < this.width; i++) {
      var tr = document.createElement("tr");
      for (let j = 0; j < this.height; j++) {
        let td = document.createElement("td");
        this.Grid[i][j] = tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    table.id = this.snakeId;
    document.body.appendChild(table);
  },
  createSnake() {
    this.snakeGrid = [];
    this.snakeGrid.push([1, 3]);
    this.snakeGrid.push([1, 2]);
    this.snakeGrid.push([1, 1]);
    console.log(this.snakeGrid, "create");
    this.painSnake();
    // snake header
    this.Grid[this.snakeGrid[0][0]][this.snakeGrid[0][1]].className =
      "snake_head";
  },
  painSnake() {
    // pain color
    for (let i = 0; i < this.snakeGrid.length; i++) {
      var snake_temp1 = this.snakeGrid[i][0],
        snake_temp2 = this.snakeGrid[i][1];
      this.Grid[snake_temp1][snake_temp2].className = "snake";
    }
  },
  createFood() {
    this.foodGrid = this.randomPoint();
    if (this.pointInSnake(this.foodGrid)) {
      this.createFood();
      return false;
    }
    this.Grid[this.foodGrid[0]][this.foodGrid[1]].className = "food";
  },
  randomPoint(initX, initY, endX, endY) {
    let initx = initX || 1;
    let inity = initY || 1;
    let endx = endX || this.width - 1;
    let endy = endY || this.height - 1;
    var p = [];
    p[0] = Math.floor(Math.random() * (endx - initx) + initx);
    p[1] = Math.floor(Math.random() * (endy - inity) + inity);
    console.log(p, "p");
    return p;
  },
  pointInSnake(foodGrid) {
    const inPoint = this.snakeGrid.filter(m => m === foodGrid);
    if (inPoint.length > 0) {
      return true;
    }
    return false;
  },
  //绑定键盘事件
  keyDown: function(e) {
    var e = e || window.event;
    var keycode = e ? e.keyCode : 0;
    if (keycode == 116) {
      window.location.reload();
    } //按下F5键，刷新页面
    if (keycode == 32) {
      //空格键控制开始/暂停
      if (this.stop) {
        this.move();
        this.stop = false;
      } else {
        if (this.snakeTimer) {
          clearInterval(this.snakeTimer);
        }
        this.stop = true;
      }
    }
    if (keycode >= 37 && keycode <= 40) {
      //方向键改变蛇的移动方向
      if (!this.stop) {
        this.derectkey = keycode;
      }
    }
    return false;
  },
  move() {
    var _this = this;
    if (_this.snakeTimer) {
      clearInterval(_this.snakeTimer);
    }
    _this.snakeTimer = setInterval(
      _this.bind(_this.main, _this),
      Math.floor(3000 / this.speed)
    );
  },
  main() {
    var headx = this.snakeGrid[0][0],
      heady = this.snakeGrid[0][1],
      temp = this.snakeGrid[this.snakeGrid.length - 1],
      isEnd = false,
      msg = "";
    // 38 shang 40 xia 39 you  37 zuo
    switch (this.derectkey) {
      case 37:
        if (this.goY != 1) {
          this.goY = -1;
          this.goX = 0;
        } //防止控制蛇往相反反方向走
        break;
      case 38:
        if (this.goX != 1) {
          this.goX = -1;
          this.goY = 0;
        }
        break;
      case 39:
        if (this.goY != -1) {
          this.goY = 1;
          this.goX = 0;
        }
        break;
      case 40:
        if (this.goX != -1) {
          this.goX = 1;
          this.goY = 0;
        }
    }
    headx += this.goX;
    heady += this.goY;
    if (headx == this.foodGrid[0] && heady == this.foodGrid[1]) {
      this.snakeGrid.unshift(this.foodGrid);
      this.createFood();
      if (this.snakeGrid.length > 4) {
        //控制蛇加速
        if (this.snakeGrid.length == 5) {
          this.speed += 5;
        } else if (this.snakeGrid.length == 10) {
          this.speed += 3;
        } else if (this.snakeGrid.length == 20) {
          this.speed += 3;
        } else if (this.snakeGrid.length == 30) {
          this.speed += 3;
        }
        this.move();
      }
      return;
    }
    // init pain snake
    for (var i = this.snakeGrid.length - 1; i > 0; i--) {
      this.snakeGrid[i] = this.snakeGrid[i - 1];
    }
    this.snakeGrid[0] = [headx, heady];
    // isWell
    // if (this.isWall(this.snakeGrid[0])) {
    //   isEnd = true;
    // }
    if (this.snakeGrid[0][1] === this.width) {
      this.snakeGrid.forEach(m => {
        if (m[1] === 20) {
          m[1] = 0;
        }
      });
      this.Grid[temp[0]][temp[1]].className = "notsnake";
      return;
    } else if (this.snakeGrid[0][1] === 0) {
      this.snakeGrid.forEach(m => {
        if (m[1] === 0) {
          m[1] = 19;
        }
      });
      this.Grid[temp[0]][temp[1]].className = "notsnake";
      return;
    } else if (this.snakeGrid[0][0] === 0) {
      this.snakeGrid.forEach(m => {
        if (m[0] === 0) {
          m[0] = 19;
        }
      });
      this.Grid[temp[0]][temp[1]].className = "notsnake";
      return;
    } else if (this.snakeGrid[0][0] === 20) {
      this.snakeGrid.forEach(m => {
        if (m[0] === 20) {
          m[0] = 0;
        }
      });
      this.Grid[temp[0]][temp[1]].className = "notsnake";
      return;
    }

    // 自己碰到自己
    if (this.snakeGrid.length > 8) {
      var a = this.snakeGrid.filter(
        m => !this.snakeGrid[0] && m === this.snakeGrid[0]
      );
      console.log(a.length, "length");
    }
    // game over
    if (isEnd) {
      debugger;
      if (this.snakeTimer) {
        clearInterval(this.snakeTimer);
      }
      var score = this.getScore();
      alert("分数" + score);
      this.reset();
      return false;
    }
    this.painSnake();
    this.Grid[temp[0]][temp[1]].className = "notsnake"; // not last
    this.Grid[headx][heady].className = "snake_head";
  },

  reset() {
    this.derectkey = 39; //按下的方向键
    this.goX = 0; //蛇横向移动的位移，1或-1
    this.goY = 0; //蛇纵向移动的位移，1或-1
    this.speed = this.oldSpeed;
    this.stop = true;
    this.init();
  },
  getScore() {
    let length = this.snakeGrid.length;
    let score = 0;
    var i = parseInt(length / 5);
    if (i == 0) {
      score = length;
    } else {
      i = i > 4 ? 4 : i;
      var j = i;
      while (j > 0) {
        score += 5 * j;
        j--;
      }
      score += (length - 5 * i) * (i + 1); //最大分值为临界分值+1
    }
    return score;
  },
  init() {
    var _this = this;
    var snake_id = document.getElementById(_this.snakeId) || 0;
    if (snake_id) {
      document.body.removeChild(snake_id);
    }
    this.Grid = this.multiArr(this.width, this.height);
    this.createMap();
    this.createSnake();
    this.createFood();
    document.onkeydown = _this.bind(_this.keyDown, _this); //绑定键盘事件
  }
};

new Snake(20, 20);
