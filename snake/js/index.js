;(function (window) {
  function Food(options) {
    options = options || {}
    this.width = options.width || 20 //宽
    this.height = options.height || 20 //高
    this.bgColor = options.bgColor || "green" //背景色
    this.x = options.x || 0 //x轴的坐标(网格)
    this.x = options.x || 0 //y轴的坐标(网格)
    this.div = document.createElement("div") //食物的盒子
    this.map = map //(游戏地图)
    this.max_x = this.map.offsetWidth / this.width //map的宽(网格)
    this.max_y = this.map.offsetHeight / this.height //map的高(网格)
  }//食物的构造函数
  Food.prototype = {
    //渲染食物到页面
    init: function () {
      this.div.style.position = "absolute" //绝对定位
      this.div.style.width = this.width + "px" //食物div的宽
      this.div.style.height = this.height + "px" //食物div的高
      this.div.style.backgroundColor = this.bgColor //食物的bgc
      this.show() //调用show方法,继续添加样式
    },
    //衔接init
    show: function () {
      this.x = parseInt(Math.random() * this.max_x)// 随机的x坐标0-39
      this.y = parseInt(Math.random() * this.max_y)// 随机的y坐标0-39
      this.div.style.left = this.x * this.width + "px" //定位left距离
      this.div.style.top = this.y * this.height + "px" //定位top距离
      this.map.appendChild(this.div)
    }
  }//食物的原型
  window.Food = Food
})(window); //食物沙箱

;(function (window) {
  function Snake(options) {
    options = options || {}
    this.width = options.width || 20 //蛇节的宽
    this.height = options.height || 20 //蛇节的高
    this.headColor = options.headColor || "red" //蛇头色
    this.bodyColor = options.bodyColor || "orange" //蛇身色
    this.tailColor = options.tailColor || "gray" //蛇尾色
    this.direction = options.direction || "right" //运动的方向
    this.body = [{x: 2, y: 0}, {x: 1, y: 0}, {x: 0, y: 0}] //初始3蛇节,x表示在网格中的x轴坐标,y则是y轴
    this.x = options.x || 0 //蛇头的x坐标
    this.y = options.y || 0 //蛇头的y坐标
    this.map = map //游戏的地图
  }//蛇的构造函数
  Snake.prototype = { //蛇的原型
    //渲染蛇到页面
    init: function () {
      this.remove() //移除地图上的所有蛇节
      for (var i = 0; i < this.body.length; i++) {
        var span = document.createElement("span") //创建span
        span.style.display = "block" //盒子样式
        span.style.position = "absolute" //绝对定位
        span.style.width = this.width + "px" //宽
        span.style.height = this.height + "px" //高
        span.style.left = this.body[i].x * this.width + "px" //x坐标
        span.style.top = this.body[i].y * this.height + "px" //y坐标
        //蛇节的背景色
        if (i === 0) {
          span.style.backgroundColor = this.headColor //蛇头颜色
        } else if (i === this.body.length - 1) {
          span.style.backgroundColor = this.tailColor //蛇尾颜色
        } else {
          span.style.backgroundColor = this.bodyColor //蛇体颜色
        }
        this.map.appendChild(span) //将每个蛇节加入map节点中
      }//遍历this.body数组重新创建蛇节
    },
    //移除蛇
    remove: function () {
      var spans = document.querySelectorAll("span")//获取地图上所有的蛇节
      //删除所有蛇节
      for (var i = 0; i < spans.length; i++) {
        this.map.removeChild(spans[i])
      }
    },
    //蛇运动
    run: function () {
      var newNode = {
        x: this.body[0].x,
        y: this.body[0].y
      }//蛇头网格坐标
      this.getDirection() //调用键盘响应方法
      switch (this.direction) {
        case "top": //上
          newNode.y = newNode.y - 1
          break
        case "bottom": //下
          newNode.y = newNode.y + 1
          break
        case "left": //左
          newNode.x = newNode.x - 1
          break
        case "right": //右
          newNode.x = newNode.x + 1
          break
      } //改变位置
      this.x = newNode.x //记录运动后的蛇头x
      this.y = newNode.y //同上记录y
      this.body.unshift(newNode) //将新蛇头加到第一节
    },
    //获取方向
    getDirection: function () {
      var that = this //把指向this赋值,防止事件中不能使用this指向对象
      document.addEventListener("keydown", function (event) {
        var e = event || window.event //兼容ie
        switch (e.keyCode) {
          case 38:
            if (that.direction === "bottom") { //防止回头
              return
            }
            that.direction = "top" //上
            break
          case 40:
            if (that.direction === "top") { //防止回头
              return
            }
            that.direction = "bottom" //下
            break
          case 37:
            if (that.direction === "right") { //防止回头
              return
            }
            that.direction = "left" //左
            break
          case 39:
            if (that.direction === "left") { //防止回头
              return
            }
            that.direction = "right" //右
            break
        }
      })
    }
  } //蛇的原型
  window.Snake = Snake
})(window);//蛇沙箱

;(function (window) {
  var map = document.getElementById("map") //获取地图
  var div = map.getElementsByTagName("div") //获取食物s
  function Game() {
    this.map = map //地图
    this.food = new Food() //新建食物
    this.snack = new Snake() //新建蛇
    this.MaxX = this.map.offsetWidth / this.snack.width - 1 //最大边界x
    this.Maxy = this.map.offsetHeight / this.snack.height - 1//最大边界y
    this.div = div //食物
    this.timer = null //定时器
  } //游戏的构造函数
  Game.prototype = {
    //开始游戏
    start: function () {
      this.food.init() //渲染初始食物到页面
      this.snack.init()//渲染初始蛇到页面
      this.go() //调用go方法,蛇运动
    },
    //游戏规则
    go: function () {
      var that = this //记录指向
      this.timer = setInterval(function () {
        that.snack.run() //蛇运动的规则
        that.maxBorder() //边界限制的规则
        that.eat() //吃食物的规则
        that.snack.init() //渲染运动的蛇
      }, 50) //定时器
    },
    //蛇吃食物的判定
    eat: function () {//蛇头的坐标和食物坐标相等
      if (this.food.x === this.snack.x && this.food.y === this.snack.y) {
        map.removeChild(div[0]) //移除被吃的食物
        this.food = new Food() //新建食物
        this.food.init() //渲染食物到页面
      } else {
        this.snack.body.pop() //移除运动一格增长的蛇节
      }
    },
    //蛇的死亡判定(边界和自身)
    maxBorder: function () {
      if (this.snack.x < 0 || this.snack.x > this.MaxX) {//左右边界
        alert("Game Over")
        clearInterval(this.timer)
      } else if (this.snack.y < 0 || this.snack.y > this.Maxy) {//上下边界
        alert("Game Over")
        clearInterval(this.timer)
      } else {
        for (var i = 3; i < this.snack.body.length; i++) {
          if (this.snack.x === this.snack.body[i].x) {
            if (this.snack.y === this.snack.body[i].y) {
              alert("Game Over")
              clearInterval(this.timer)
            }
          }//自身碰撞
        }
      }
    }
  } //游戏的原型
  window.Game = Game
})(window);//游戏沙箱
