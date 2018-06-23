<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>贪吃蛇小游戏</title>
    <style>
        * {
            margin: 0;
            padding: 0;
        }

        #box {
            width: 500px;
            height: 500px;
            margin: 6px auto;
            position: relative;
        }

        #score {
            width: 476px;
            height: 20px;
            margin: 10px auto;
            padding: 10px;
            border: solid #d2d2d2 2px;
            font-size: 14px;
            font-weight: 900;
            line-height: 20px;
            border-radius: 5px;
            background: #fcfcfc;
        }

        #score span {
            width: 150px;
            display: inline-block;
            font-size: 20px;
            color: #ff6600;
        }

        #gameBtn {
            color: #474347;
            font-size: 24px;
            cursor: pointer;
            border: solid #919191 2px;
            width: 118px;
            height: 38px;
            line-height: 38px;
            text-align: center;
            position: absolute;
            border-radius: 5px;
        }

        .map {
            width: 8px;
            height: 8px;
            border: solid #ffffff 1px;
            border-radius: 1px;
            background: #eeeeee;
            float: left;
        }

        .snakebody {
            width: 8px;
            height: 8px;
            border: solid #ffffff 1px;
            border-radius: 1px;
            background: #ff6600;
            position: absolute;
        }

        .food {
            width: 8px;
            height: 8px;
            border: solid #ffffff 1px;
            border-radius: 1px;
            background: #0fff20;
            position: absolute;
            /*            box-shadow: 0 0 1px 1px #fdc7c5;*/
        }
    </style>
    <script>
        window.onload = function () {
            var oBox = document.getElementById("box");
            var oBtn = document.getElementById("gameBtn");
            oBtn.style.top = (oBox.offsetHeight - oBtn.offsetHeight) / 2 + 'px';
            oBtn.style.left = (oBox.offsetWidth - oBtn.offsetWidth) / 2 + 'px';
            oBtn.onclick = function () {
                this.style.display = "none";
                Game.init("box");//初始化 游戏开始
            };
        };
        var Game = {
            init: function (id) {    //游戏初始化
                this.oParent = document.getElementById(id);//通过属性来获取id，方便多次使用
                this.createMap();//生成地图
                this.createSnake();//生成贪吃蛇
                this.createFood();//随机生成食物
                this.createScore();//生成积分
            },
            createScore: function () {  //积分的创建
                var oScore = document.createElement('div');
                oScore.id = "score";
                oScore.innerHTML = '得分：<span id="s1">0</span>长度：<span id="s2">0</span>';
                document.body.insertBefore(oScore, this.oParent);
                this.oSum1 = oScore.getElementsByTagName('span')[0];//将积分变成对象的属性，实现后边操作
                this.oSum2 = oScore.getElementsByTagName('span')[1];
                this.oSum2.innerHTML = this.snake.length;
            },
            createMap: function () {
                for (var i = 0; i < 50; i++) {
                    for (var j = 0; j < 50; j++) {
                        this.map = document.createElement('div');
                        this.map.className = 'map';
                        this.mg = {x: i, y: j};//记录每个格子的坐标存入数组
                        this.mapGrid.push(this.mg);
                        this.oParent.appendChild(this.map);
                    }
                }
            },
            createFood: function () {
                var _this = this;
                _this.food = [];//存放食物格子的空数组
                clearInterval(_this.foodTimer);
                _this.foodTimer = setInterval(function () {
                    _this.ofb = false;
                    if (_this.food.length == 0) {//如果地图上还没有食物
                        _this.temp = [];//用来存放复制的数组
                        for (var i = 0; i < _this.mapGrid.length; i++) {
                            _this.temp[i] = _this.mapGrid[i];//复制全部格子
                        }
                        //临时数组与蛇身体格子数组比较去重复
                        for (var i = 0; i < _this.snake.length; i++) {
                            for (var j = 0; j < _this.temp.length; j++) {
                                if (_this.snake[i].x==_this.temp[j].x &&_this.snake[i].y==_this.temp[j].y) {
                                    _this.temp.splice(j, 1);
                                }
                            }
                        }
                        //从剩下不重复的位置随机出一个生成食物
                        var randomIndex = Math.floor(Math.random() * _this.temp.length);
                        _this.oF = {x: _this.temp[randomIndex].x, y: _this.temp[randomIndex].y};//随机出地图上一个位置
                        _this.ofb = true;
                        if (_this.ofb == true) {
                            _this.findex = 36 * _this.snakeSpeed;//食物变化时间
                            _this.ofood = document.createElement('div');
                            _this.ofood.className = 'food';
                            _this.ofood.style.left = _this.oF.x * 10 + 'px';
                            _this.ofood.style.top = _this.oF.y * 10 + 'px';
                            _this.ofood.style.background = _this.foodStyle[0].color;//食物颜色
                            _this.ofood.style.boxShadow = _this.foodStyle[0].shadow;
                            _this.ofood.score = _this.foodStyle[0].score;//食物的分值
                            _this.oParent.appendChild(_this.ofood);
                        }
                        _this.food.push(_this.oF);
                    }
                    _this.findex -= 20;
                    if (_this.findex < 0) {
                        _this.findex = -1;
                    }
                    _this.changeFood();
                }, _this.snakeSpeed);
            },
            createSnake: function () {
                for (var i = 0; i < this.snake.length; i++) {
                    this.snakeBody = document.createElement('div');
                    this.snakeBody.className = 'snakebody';
                    this.snakeBody.style.left = this.snake[i].x * 10 + 'px';
                    this.snakeBody.style.top = this.snake[i].y * 10 + 'px';
                    this.oParent.appendChild(this.snakeBody);
                }
                this.snakeMove({x: 1}, 37);
                this.bindSnake();
            },
            //操控贪吃蛇
            bindSnake: function () {
                var _this = this;
                document.onkeydown = function (ev) {
                    this.ev = ev || window.event;
                    switch (this.ev.keyCode) {
                        case 37://左
                            _this.snakeMove({x: -1}, 39, this.ev.keyCode);
                            break;
                        case 38://上
                            _this.snakeMove({y: -1}, 40, this.ev.keyCode);
                            break;
                        case 39://右
                            _this.snakeMove({x: 1}, 37, this.ev.keyCode);
                            break;
                        case 40://下
                            _this.snakeMove({y: 1}, 38, this.ev.keyCode);
                            break;
                    }
                    return false;
                }
            },
            //贪吃蛇的运动
            snakeMove: function (opt, obo, keyCode) {
                var _this = this;
                _this.keyCode = keyCode;
                _this.kc.push(obo);
                //键位冲突判断(也就是键位与蛇运动方向相反或已经相同就无效)
                if (_this.keyCode == _this.kc[0]) {
                    var oBool = false;
                    _this.kc.pop(_this.kc[1]);
                } else {
                    oBool = true;
                    _this.kc[0] = obo;
                }
                if (oBool == true) {
                    clearInterval(_this.snakeTimer);
                    var stepX = opt.x || 0;
                    var stepY = opt.y || 0;
                    _this.snakeTimer = null;//蛇的定时器
                    if (_this.snake.length >= 50) {
                        _this.snakeSpeed = 60;//蛇的移动执行速度
                    } else if (_this.snake.length >= 100) {
                        _this.snakeSpeed = 50;
                    } else {
                        _this.snakeSpeed = 70;
                    }
                    //蛇移动
                    _this.sBodyS = document.getElementsByClassName('snakebody');
                    _this.snakeTimer = setInterval(function () {
                        for (var i = _this.sBodyS.length - 1; i >= 1; i--) {
                            _this.snake[i].x = _this.snake[i - 1].x;
                            _this.sBodyS[i].style.left = _this.snake[i].x * 10 + 'px';
                            _this.snake[i].y = _this.snake[i - 1].y;
                            _this.sBodyS[i].style.top = _this.snake[i].y * 10 + 'px';
                        }
                        _this.snake[0].x += stepX;
                        _this.sBodyS[0].style.left = _this.snake[0].x * 10 + 'px';
                        _this.snake[0].y += stepY;
                        _this.sBodyS[0].style.top = _this.snake[0].y * 10 + 'px';
                        //超出边界就从另一边出来
                        if (_this.sBodyS[0].offsetLeft > 490) {
                            _this.snake[0].x = 0;
                            _this.sBodyS[0].style.left = _this.snake[0].x * 10 + 'px';
                        } else if (_this.sBodyS[0].offsetLeft < 0) {
                            _this.snake[0].x = 49;
                            _this.sBodyS[0].style.left = _this.snake[0].x * 10 + 'px';
                        }
                        if (_this.sBodyS[0].offsetTop > 490) {
                            _this.snake[0].y = 0;
                            _this.sBodyS[0].style.top = _this.snake[0].y * 10 + 'px';
                        } else if (_this.sBodyS[0].offsetTop < 0) {
                            _this.snake[0].y = 49;
                            _this.sBodyS[0].style.top = _this.snake[0].y * 10 + 'px';
                        }
                        _this.sLast = {};//取得蛇末尾坐标
                        _this.sLast.x = _this.snake[_this.snake.length - 1].x;
                        _this.sLast.y = _this.snake[_this.snake.length - 1].y;
                        _this.ifood = document.getElementsByClassName('food')[0];
                        if (_this.bump(_this.sBodyS[0], _this.ifood)) {//蛇与食物碰撞检测
                            _this.food.pop(0);//清空食物数组
                            _this.oParent.removeChild(_this.ifood);
                            _this.snake.push(_this.sLast);//往蛇尾加一个格子
                            _this.snakeBody = document.createElement('div');
                            _this.snakeBody.style.left = _this.sLast.x * 10 + 'px';
                            _this.snakeBody.style.top = _this.sLast.y * 10 + 'px';
                            _this.snakeBody.className = 'snakebody';
                            _this.oParent.appendChild(_this.snakeBody);
                            _this.oSum1.innerHTML = parseInt(_this.oSum1.innerHTML) + _this.ofood.score;
                            _this.oSum2.innerHTML = _this.snake.length;
                        }
                        for (var i = 1; i < _this.sBodyS.length; i++) {//蛇自身的碰撞检测
                            if (_this.bump(_this.sBodyS[0], _this.sBodyS[i])) {
                                alert('GAME OVER !' + '\n' + '你的得分：' + _this.oSum1.innerHTML + '     蛇的长度：' + _this.oSum2.innerHTML);
                                window.location.reload();

                            }
                        }
                    }, _this.snakeSpeed);
                }
            },
            changeFood: function () {
                var foodIndex = 12;
                if (this.findex >= foodIndex * 2 * this.snakeSpeed) {
                    this.ofood.style.background = this.foodStyle[0].color;//食物颜色
                    this.ofood.score = this.foodStyle[0].score;//食物的分值
                    this.ofood.style.boxShadow = this.foodStyle[0].shadow;
                } else if (this.findex < foodIndex * 2 * this.snakeSpeed && this.findex >= foodIndex * this.snakeSpeed) {
                    this.ofood.style.background = this.foodStyle[1].color;//食物颜色
                    this.ofood.score = this.foodStyle[1].score;//食物的分值
                    this.ofood.style.boxShadow = this.foodStyle[1].shadow;
                } else if (this.findex < foodIndex * this.snakeSpeed && this.findex >= 0) {
                    this.ofood.style.background = this.foodStyle[2].color;//食物颜色
                    this.ofood.score = this.foodStyle[2].score;//食物的分值
                    this.ofood.style.boxShadow = this.foodStyle[2].shadow;
                } else if (this.findex < 0) {
                    this.ofood.style.background = this.foodStyle[3].color;//食物颜色
                    this.ofood.score = this.foodStyle[3].score;//食物的分值
                    this.ofood.style.boxShadow = this.foodStyle[3].shadow;
                }
                console.log(this.findex);
            },
            //碰撞检测
            bump: function (obj1, obj2) {
                if (obj2) {
                    //先获取两个对象的四边位置
                    var L1 = obj1.offsetLeft;
                    var R1 = obj1.offsetLeft + obj1.offsetWidth;
                    var T1 = obj1.offsetTop;
                    var B1 = obj1.offsetTop + obj1.offsetHeight;
                    var L2 = obj2.offsetLeft;
                    var R2 = obj2.offsetLeft + obj2.offsetWidth;
                    var T2 = obj2.offsetTop;
                    var B2 = obj2.offsetTop + obj2.offsetHeight;
                    if (R1 <= L2 || L1 >= R2 || T1 >= B2 || B1 <= T2) {
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            //存放食物样式
            foodStyle: [
                {color: '#e40f29', shadow: '0 0 1px 1px #e40f29', score: 100},
                {color: '#32df4b', shadow: '0 0 1px 1px #32df4b', score: 80},
                {color: '#ec32f0', shadow: '0 0 1px 1px #ec32f0', score: 50},
                {color: '#3598fa', shadow: '0 0 1px 1px #3598fa', score: 20}
            ],
            //存放贪吃蛇的数组集合
            snake: [
                {x: 7, y: 25}, {x: 6, y: 25}, {x: 5, y: 25}, {x: 4, y: 25}, {x: 3, y: 25}
            ],
            mapGrid: [],//存放地图点阵坐标
            kc: [37]//存放冲突键值
        };
    </script>
</head>
<body>
<div id="box">
    <div id="gameBtn">开始游戏</div>
</div>
</body>
</html>