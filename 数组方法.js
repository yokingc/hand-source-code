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
   return arr.reduce((acc, cur) => acc.concat(Array.isArray(cur) ? flattenWithReduce(cur) : cur), [])
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

// 实现数组的map reduce filter

// ★ 重点：map 返回新数组，不修改原数组；callback 接收 (item, index, array) 三个参数
// ★ 加分点：用 Array.prototype.xxx = function 挂载到原型，this 就是调用的数组
Array.prototype.myMap = function(callback, thisArg) {
    // 加分点：处理稀疏数组，跳过空槽（原生 map 也会跳过）
    if (typeof callback !== 'function') throw new TypeError('callback must be a function')
    const result = new Array(this.length)
    for (let i = 0; i < this.length; i++) {
        if (i in this) { // 加分点：in 操作符可以检测稀疏数组的空槽
            result[i] = callback.call(thisArg, this[i], i, this)
        }
    }
    return result
}

// ★ 重点：filter 返回新数组，只保留 callback 返回 truthy 的元素
Array.prototype.myFilter = function(callback, thisArg) {
    if (typeof callback !== 'function') throw new TypeError('callback must be a function')
    const result = []
    for (let i = 0; i < this.length; i++) {
        if (i in this && callback.call(thisArg, this[i], i, this)) {
            result.push(this[i])
        }
    }
    return result
}

// ★ 重点：reduce 核心是累加器 acc；initialValue 不传时，acc 默认是第一个元素，遍历从第二个开始
// ★ 加分点：空数组且没有 initialValue 时，原生 reduce 会抛 TypeError，要模拟这个行为
Array.prototype.myReduce = function(callback, initialValue) {
    if (typeof callback !== 'function') throw new TypeError('callback must be a function')
    const hasInitial = arguments.length >= 2
    if (this.length === 0 && !hasInitial) throw new TypeError('Reduce of empty array with no initial value')

    let acc = hasInitial ? initialValue : this[0]
    let startIndex = hasInitial ? 0 : 1

    for (let i = startIndex; i < this.length; i++) {
        if (i in this) {
            acc = callback(acc, this[i], i, this)
        }
    }
    return acc
}