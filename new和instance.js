/* new的四步
1. 创建一个空对象
2. 链接到原型
3. 绑定this
4. 判断构造函数返回，返回实例或对象函数
*/

function myNew(Constructor, ...args){
  if (typeof Constructor !== "function") {
    throw new TypeError("not function");
  }
  // 创建新对象并链接到构造函数的原型对象上
  // 等效于
  // const obj = {}
  // obj.__proto__ = Constructor.prototype
  const obj = Object.create(Constructor.prototype);
  // 获取构造函数返回
  const result = Constructor.apply(obj, args);
  // 判断构造函数返回，如果是对象或者函数则采取，否则返回实例
  if (
    result !== null &&
    (typeof result === "object" || typeof result === "function")
  )
    return result;
  else return obj;
}

/* 1. 为什么要 Object.create(Constructor.prototype)？

因为实例需要能访问构造函数原型上的方法。
如果不连这条原型链，实例就只是个普通对象，不能通过原型链找到原型方法。

2. 为什么要用 apply？

因为要显式把构造函数执行时的 this 绑定到新创建的对象上，同时把参数传进去。

3. 为什么返回函数也要算进去？

因为 JS 里函数本质上也是对象。
所以判断返回值时，既要判断 object，也要判断 function。

4. 箭头函数为什么不能 new？

因为箭头函数：

没有自己的 this

没有 prototype

不能作为构造函数 
*/


// instanceof 的本质是沿着左侧对象的原型链不断向上查找，如果能找到右侧构造函数的 prototype 就返回 true，否则返回 false。手写时我会先排除左侧的基本类型，再用 Object.getPrototypeOf 循环向上找。
function myInstanceof(left, right) {
  // 理论上right应该是构造函数，应是具有prototype的对象，这里做简单判断，如果不是函数则抛错
  if (typeof right !== "function") {
    throw new TypeError("right must be function");
  }
  // 如果左边是 null 或者不是对象或者函数，则返回false
  if (
    left === null ||
    (typeof left !== "object" && typeof left !== "function")
  ) {
    return false;
  }
  // 获取左边的原型，等效于let proto = left.__proto__
  let proto = Object.getPrototypeOf(left);
  while (proto) {
    if (proto === right.prototype) return true;
    // 沿着原型链向上查找直到null
    proto = Object.getPrototypeOf(proto);
  }
  // 没找到，返回false
  return false;
}

/*
1. instanceof 和 typeof 的区别？
typeof用来判断基本类型更方便，但不适合判断精细对象类型，如数组、null
instanceof用于判断某个对象是否由某个构造函数构造出来，本质是检查原型链。

2. 为什么 [] instanceof Object 也是 true？
[] -> Array.prototype -> Object.prototype -> null 在原型链上

3. 为什么 1 instanceof Number 是 false？
因为 1 是基本类型，不是对象实例。
new Number(1) instanceof Number // true

4. instanceof 能不能判断基本类型？
一般不能准确判断基本类型值。
它更适合判断对象和构造函数之间的关系。
基本类型用typeof或者Object.prototype.toString.call()
*/

// 基本类型：typeof 对象：instanceof（找原型链）
typeof 'abc' // 'string'
typeof 123 // 'number'
typeof undefined // 'undefined'
typeof fn // 'function'

//局限
typeof null // 'object'
typeof [] // 'object'
typeof {} // 'object'

//
arr instanceof Array
p instanceof Person
d instanceof Date
r instanceof RegExp

// Object.create(proto)的作用是创建一个新对象，并将这个新对象的原型指向proto
function myCreate(proto){
    if(proto!==null&&(typeof proto!== 'object'&&typeof proto!== 'function')){
        throw new TypeError('proto must be object or function')
    }
    // 更贴近原生的话，需要单独处理 proto === null。
    if (proto === null) {
        const obj = {};
        // 对于普通对象来说，要修改原型，需要使用 Object.setPrototypeOf
        Object.setPrototypeOf(obj, null);
        return obj;
      }
    // 中转构造函数
    function F(){}
    // 中转构造函数的prototype指定为入参proto，这样new出来的对象的原型也会指向proto
    F.prototype = proto
    return new F()
}