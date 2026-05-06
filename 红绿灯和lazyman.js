// 异步流程控制
// 定时器 setTimeout
// Promise
// 递归 / 链式调用
// async/await

// 红灯3s 黄灯2s 绿灯1s 循环
function red() {
  console.log("red");
}

function yellow() {
  console.log("yellow");
}

function green() {
  console.log("green");
}

function wait(fn, time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      fn();
      resolve();
    }, time);
  });
}

async function trafficLight() {
  while (true) {
    await wait(red, 3000);
    red();
    await wait(yellow, 2000);
    yellow();
    await wait(green, 1000);
    green();
  }
}

// function trafficLight() {
//   wait(red, 3000)
//     .then(() => wait(yellow, 2000))
//     .then(() => wait(green, 1000))
//     .then(() => trafficLight())
// }

trafficLight();

// LazyMan = 链式调用 + 任务队列 + next 串行调度 + sleepFirst 头插队列
// 链式调用LazyMan('Tony').eat('lunch').sleep(2).eat('dinner')，收集任务 -> 排队 -> 按顺序一个个执行
// 最重要的点：延迟启动，先让整条链式调用把任务收集完，再开始执行。

class LazyMan {
  constructor(name) {
    this.taskList = [];
    this.taskList.push(() => {
      console.log(`Hi! This is ${name}`);
      this.next();
    });
    // 最关键的一步，把正式执行放在微任务中，保证链式调用任务收集完毕后再执行
    Promise.resolve().then(() => {
      this.next();
    });
  }

  next() {
    let fn = this.taskList.shift();
    fn && fn();
  }

  eat(food) {
    this.tasks.push(() => {
      console.log(`Eat ${food}`);
      this.next();
    });
    return this;
  }
  sleep(seconds) {
    this.tasks.push(() => {
      setTimeout(() => {
        console.log(`Wake up after ${seconds}`);
        this.next();
      }, seconds * 1000);
    });
    return this;
  }

  // 插队
  sleepFirst(seconds) {
    this.tasks.unshift(() => {
      setTimeout(() => {
        console.log(`Wake up after ${seconds}`);
        this.next();
      }, seconds * 1000);
    });
    return this;
  }
}

function LazyMan(name) {
  return new LazyManClass(name);
}
