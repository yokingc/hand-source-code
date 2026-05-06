// 数组扁平化其实很算法，考研递归和数组使用能力，要能够抗住变式追问：如只拍平n层
// 数组扁平化的核心是遍历数组，遇到普通元素就直接放入结果，遇到数组元素就递归处理；如果题目要求控制拍平层数，就额外传一个 depth 参数，每递归一层就减一，当 depth 为 0 时停止继续展开。

function flatten(arr, depth= Infinity) {
   if(!Array.isArray(arr)) throw new TypeError('arguments must be an array')
   const result = []
   // 这里是否可以用forEach，似乎也可以
   for( const item of arr) {
    if(Array.isArray(item) && depth > 0){
        result.push(...flatten(item, depth-1))
    } else {
        result.push(item)
    }
   }
   return result
}

// reduce实现结合contact用法,非常链式
function flattenWithReduce(arr,depth= Infinity) {
   if(!Array.isArray(arr)) throw new TypeError('arguments must be an array')
   if(depth <= 0) return arr
   return arr.reduce(
     (acc, cur) =>
       acc.concat(Array.isArray(cur) ? flattenWithReduce(cur, depth - 1) : cur),
     [],
   );
}



// 数组去重，unique几种方法：set include indexOf+filter；如果是引用，需要用map

function unique(arr){
    if(!Array.isArray(arr)) throw new TypeError('arguments must be an array')
    // 和 [...new Set(arr)]有什么区别？
    return Array.from(new Set(arr))
}

function uniqueWithInclude(arr) {
    if(!Array.isArray(arr)) throw new TypeError('arguments must be an array')
    const result = []
    arr.forEach(item => {
        if(!result.includes(item)){
            result.push(item)
        }
    })
    return result
}

function uniqueWithFilter(arr) {
    if(!Array.isArray(arr)) throw new TypeError('arguments must be an array')
    // 和他第一个index比较，如果不一样说明是重复的，滤掉
    // filter是原地修改吗？ 不是返回新数组，原地修改的数组方法有：
    return arr.filter((item, index, self) => self.indexOf(item) === index)
}

// 如果arr是引用类型
function uniqueWithMap(arr,key) {
    if(!Array.isArray(arr)) throw new TypeError('arguments must be an array')
    const map = new Map()
    return arr.filter(item => !map.has(item[key]) && map.set(item[key], true))
}

// 数组的map filter reduce方法

// ===== MAP =====
// map的特点 1.返回一个新数组 2.新数组和原数组长度一致 3.不改变原数组 4.稀疏数组空位跳过
Array.prototype.myMap = function (callback, thisArg) {
  // 先对调用方及传入的回调函数做检查
  if (this == null) {
    throw new TypeError("Cannot read properties of null or undefined");
  }

  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }
  // 将一些类数组转化成可以安全使用length的
  const arr = Object(this);
  const len = arr.length;
  const result = new Array(len);

  for (let i = 0; i < len; i++) {
    // 稀疏数组空洞处理，用索引赋值而不是空数组push，为了保留空洞
    if (i in arr) {
      result[i] = callback.call(thisArg, arr[i], i, arr);
    }
  }

  return result;
};;;;;


// ===== FILTER =====
// filter的特点 1.返回一个新数组 2.只保留回调函数为真值的元素 3.长度和原数组不一定一致
Array.prototype.myFilter = function (callback, thisArg) {
  if (this == null) {
    throw new TypeError("Cannot read properties of null or undefined");
  }

  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  const arr = Object(this);
  const len = arr.length;
  const result = [];

  for (let i = 0; i < len; i++) {
    if (i in arr) {
      if (callback.call(thisArg, arr[i], i, arr)) {
        // 空数组push，不保留空洞
        result.push(arr[i]);
      }
    }
  }

  return result;
};

// ===== REDUCE =====
// initialValue 有传和没传，处理不一样 没传时，第一次的累积值是数组里第一个有效元素 空数组且没传初始值，要报错
// 接收两个参数，每轮循环的“加和”回调函数callback，以及初始值initialValue
Array.prototype.myReduce = function (fn, initialValue) {
  if (this == null) {
    throw new TypeError("Cannot read properties of null or undefined");
  }

  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  let i = 0;
  let acc;

  // 空数组且没传初始值报错怎么写，arguments是函数内部自带的类数组对象，组装所有的实参
  if (arguments.length >= 2) {
    acc = initialValue;
  } else {
    // 去数组的第一个非空洞元素
    while (i < this.length && !(i in this)) {
      i++;
    }
    if (i >= this.length) {
      throw new TypeError("Reduce of empty array with no initial value");
    }

    acc = this[i]; // 初始值为第一个有效元素，从第二个有效元素开始加和
    i++;
  }

  if (acc === undefined) {
    acc = this[0];
    i = 1;
  }

  for (; i < this.length; i++) {
    if (i in this) {
      acc = fn(acc, this[i], i, this);
    }
  }

  return acc;
};