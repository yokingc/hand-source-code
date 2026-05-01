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