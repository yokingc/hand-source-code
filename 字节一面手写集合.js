// 手写new

function myNew(Fn,...arg){
    // 新对象 原型链 this 返回结果
    if(typeof Fn !=='function') {
        throw new TypeError('must be a function')
    }
    const obj = Object.create(Fn.prototype)
    const  result = Fn.apply(obj,arg)
    return (typeof result ==='object'||typeof result==='function')&&result!==null?result:obj
}

// interface

function myInterface(left,right){
    // 类型检查
    if(typeof right==='function'){
        throw new TypeError('right must be a function')
    }
    else if(typeof left===null||typeof left!=='object'||typeof left !=='function'){
        throw new TypeError('left error')
    }

    const proto = Object.getPrototypeOf(left)
    while(proto){
        if(proto===right.prototype){
            return true
        }
        proto = Object.getPrototypeOf(proto)
    }
    return false
}

// 手写call
Function.prototype.myCall=function(context,...args){
    if(typeof this !== 'function'){
        throw new TypeError('must be called on a function')
    }
    // context判断
    context = context==null?globalThis:Object(context)
    const fn = Symbol('fn')
    context[fn]= this
    const result = context[fn](...args)
    delete context[fn]
    return result
}

// 手写call
Function.prototype.myCall=function(context,args){
    if(typeof this !== 'function'){
        throw new TypeError('must be called on a function')
    }
    // context判断
    context = context==null?globalThis:Object(context)
    const fn = Symbol('fn')
    context[fn]= this
    // 实际还可以支持类数组、可迭代对象： 有哪些？
    const result = Array.isArray(args)?context[fn](args):context[fn]
    delete context[fn]
    return result
}

// 手写bind, 返回一个函数，注意判断new  
Function.prototype.myBind=function(context,...outerArgs){
    if(typeof this !== 'function'){
        throw new TypeError('must be called on a function')
    }
    context = context == null ? globalThis : Object(context);
    const target = this
    // 保存调用函数
    function bindFn(...innerArgs){
            const finalThis = this instanceof bindFn?this:context
          return target.apply(finalThis,[...outerArgs,...innerArgs])
    }
   // 原型链和constructor的处理
    if(target.prototype){
        bindFn.prototype = Object.create(target.prototype)
        bindFn.prototype.constructor = bindFn
    }
    return bindFn
}

// 防抖
// 防抖就是用户停下来一段时间后执行，常用于搜索输入框
// 重点是每次触发都刷新定时器
function myDebounce(fn,delay){
    let timer = null
    return function(...args){
    // 为什么要保存context？
      const context = this
      if(timer) clearTimeout(timer)
      timer = setTimeout(()=>{
      fn.apply(context,args)    
      timer =null
    },delay)
    }
}

// 写一个防抖立即执行版本,这个版本只是把触发时间提前到立刻了
function myDebounceImmediate(fn,delay,immediate=false){
   let timer= null
   return function(...args){
    const context = this
    if(timer) clearTimeout(timer)
    const isCallNow = immediate&&!timer
    setTimeout(()=>{
        timer=null
        if(!immediate) fn.apply(context,args)
    },delay)
    
    // 立即执行直接执行一次
    if(isCallNow){
        fn.apply(context,args)
    }
}}


// 节流函数,每次触发的时候判断间隙是否足够
function myThrottle(fn,delay){
    let lastTime = 0
    return function(...args){
    const context = this
       const now = Date.now()
       if(now-lastTime>=delay){
          fn.apply(context,args)
          lastTime = now
       }
    }
}

// 节流完美版 第一次立即执行，等待时间内多次执行仅记录参数和环境，到时间了补一次
// 节流函数,每次触发的时候判断间隙是否足够
function myThrottlePerfect(fn,delay){
    let timer = null
    let lastTime = 0
    let lastArgs
    let lastContext

    return function(...args){
        const now = new Date.now()
        const remaining = delay - (now - lastTime)
 
        // 每次触发更新参数和环境
        lastContext = this
        lastArgs = args

        if(remaining<=0){
            if(timer){
                clearTimeout(timer)
                timer = null
            }

           fn.apply(lastContext,lastArgs)
           lastArgs = null
           lastContext = null
        } else{
            // 没到时间，安排补偿
            if(!timer){
                timer = setTimeout(() => {
                    lastTime = Date.now()
                    timer = null

                    fn.apply(lastContext, lastArgs)

                    lastArgs = null
                    lastContext = null
                }, remaining)
            }
        }
    }
}

// promise系列,注意promise系列都直接先返回promise，因为要处理结果需要用到resolve 和 reject
// promiseAll 全部成功才成功，一次失败全失败，空数组成功，结果按顺序
// promiseAny 一个成功就算成功，全部失败才是失败（数组失败），空数组算失败，按顺序记录失败
// promiseRace 一个成功就算成功，一个失败也算失败，空数组静默一直pending，无关顺序
// promiseAllSettled 记录全部的状态，成功记录{status:fulfilled,value} 失败记录{status:rejected,reason}，空数组成功，按顺序
// 限并发调度器，核心设置一个running，limit，每次执行完任务填满limit。

function myPromiseAll(promises){
    return Promise((resolve,reject)=>{
        if(!Array.isArray(promises)){
            reject(new TypeError('must be an array')) 
        }
        if(promises.length===0) {
            resolve([])
        }
        const result = []
        let count = 0
        // 遍历并行promise,因为要区分索引，所以要用forEach
        promises.forEach((item,index)=>{
            Promise.resolve(item).then((res)=>{
                result[index] = res
                count++
                if(count === promises.length) resolve(result)
            }).catch(reject)
        })
    })
  
}

function myPromiseAny(promises){
    return Promise((resolve,reject)=>{
        if(!Array.isArray(promises)){
            reject(new TypeError('must be an array'))
        }
        if(promises.length===0){
            reject(new AggregateError(errors,'all failed'))
        }
        const errors = []
        let count = 0
        promises.forEach((item,index)=>{
            Promise.resolve(item).then((res)=>{
                resolve(res)
            }).catch((error)=>{
                errors[index]=error
                count++
                if(count===promises.length){
                    reject(new AggregateError(errors,'all failed'))
                }
            })
        })
    })
}

function myPromiseRace(promises){
    return Promise((resolve,reject)=>{
        if(!Array.isArray(promises)) reject(new TypeError('must be an array'))
        promises.forEach((item)=>{
        Promise.resolve(item).then((res)=>{
            resolve(res)
        }).catch(reject)  
        })
    })
}

function myPromiseAllSettled(promises){
    return new Promise((resolve,reject)=>{
        if(!Array.isArray(promises)){
          // Promise中什么时候需要return？
          return reject(new TypeError('arguments must be an array'))
        }
        const length = promises.length
        if(length === 0) return resolve([])
        const result = []
        let count = 0 
        promises.forEach((item,index)=>{
            Promise.resolve(item).then((res)=>{
                result[index]={
                    status:fulfilled,
                    res
                }
            }).catch((reason)=>{
                result[index]={
                    status:rejected,
                    reason
                }
            }).finally(()=>{
                count++
                if(count === promises.length){
                    resolve(result)
                }
            })
        })
      })
}


// 这样写的好处是不需要维护running，启动时就跑满，但是有个缺点不能手动再增加新任务，适合一次性定好任务的情况
function myPromiseLimit(tasks,limit){
    return Promise((resolve,reject)=>{
        if(!Array.isArray(tasks)) {
            return reject(new TypeError('arguments must be an array'))
          }
          if (typeof limit !== 'number' || limit <= 0) {
            return reject(new TypeError('limit must be a positive number'));
          }
          const length = tasks.length
          if(length === 0) return resolve([])
          let count = 0
          let result = []
          let taskIndex = 0

        function runTask(){
           if(taskIndex>=length) return
           const curTask = tasks[taskIndex]
           const curIndex = taskIndex
           taskIndex++
          
           Promise.resolve().then(()=>curTask()).then((res)=>{
            count++
            result[curIndex]=res
           }).catch(reject)
         }

         const realLimit = Math.min(limit,length)
         for(let i =0;i<realLimit;i++){
            runTask()
         }

         // 初始启动并行上限
    })
}

// 对象深拷贝 深拷贝的核心是递归复制引用类型。基本类型直接返回，对象数组递归处理。 weakMap处理循环依赖。
function deepClone(target,weakMap=new WeakMap()){
    if(typeof target !== 'object'|| typeof target ===null) return target

    // 处理循环依赖
    if(weakMap.has(target)){
        return weakMap.get(target)
    }

    // 特殊类型处理 Date 和 RegExp
    if(target instanceof Date){
        return new Date(target)
    }
    if(target instanceof RegExp){
        return  new RegExp(target.source, target.flags)
    }
      //  函数不做深拷贝，直接返回引用
    if (typeof target === 'function') {
    return target
    }

    // 按照对象处理
    const cloneTarget = Array.isArray(target)?[]:{}
    // 先缓存
    weakMap.set(target,cloneTarget)

    // 递归拷贝
    for(const key in target){
        if(Object.prototype.hasOwnProperty.call(target,key)){
            cloneTarget[key] = deepClone(target[key],weakMap)
        }
    }
    
    // Reflect.ownKeys(target).forEach(key=>{
    //     cloneTarget[key]= deepClone(target[key],weakMap)
    // })
    return cloneTarget
}

// 数组扁平化，并可以控制深度，两种方法
function flat(arr,depth){
    if(!Array.isArray(arr)) throw new TypeError('must be an array')
    if(depth===0){ return arr}
    const res = []
    for (const item of arr){
        if(Array.isArray(item)){
            res.push(...flat(item,depth-1))
        } else{
            res.push(item)
        }
    }
    return res
}

function flatWithReduce(arr,depth){
    if(depth===0) return arr
    return arr.reduce((res,item)=>{
        if(Array.isArray(item)){
            return res.concat(flatWithReduce(item,depth-1))
        } else{
            return res.concat(item)
        }
        },[])
}


// 发布订阅
class EventEmitter {
    constructor(){
        this.events = new Map()
    }
    on(eventName,callback){
        if(typeof callback !== 'function'){
            throw new TypeError('callback must be a function')
        }
        if(!this.events.has(eventName)){
            events.set(eventName,[])
        }
        // 注册该事件的回调
        this.events.get(eventName).push(callback)
        // 支持链式调用
        return this 
    }

    emit(eventName,...args){
        // 获取该事件名称下的回调函数
       const callbacks = this.events.get(eventName)
       if(!callbacks||callbacks.length===0) return false
       const fns = [...callbacks]
       fns.forEach((callback)=>{
           callback(...args)
       })
       return true
    }

    off(eventName, callback) {
        const callbacks = this.events.get(eventName)
        if(!callbacks||callbacks.length===0) return this
        // 如果没有指定取消某个回调，则直接删除整个事件
        if(callback===undefined){
            this.events.delete(eventName)
            return this}
        if(typeof callback !== 'function'){
            throw new TypeError('callback must be a function')
        }
        this.events.set(eventName,callbacks.filter(item=>item!==callback))
        return this 
    }

    once(eventName, callback) {
        if(typeof callback !== 'function'){
            throw new TypeError('callback must be a function')
        }
        const wrapper = (...args) => {
            this.off(eventName, wrapper)
            callback(...args)
        }
        this.on(eventName, wrapper)
        return this
    }
}


// 柯里化的核心：

// 把一个接收多个参数的函数，转换成可以分多次接收参数的函数。等参数收集够了，再执行原函数。

function curry(fn){
    return function curried(...args){
        const context = this
    if(args.length>=fn.length){
        // 参数够了，执行函数
        fn.apply(context,args)
    }
    // 参数不够，返回函数继续接收
    return function(...nextArgs){
        return curried.apply(context,args.concat(nextArgs))
    }
}
}

// 寄生组合继承：好处既可以继承属性又可以继承方法，且不用调用父构造函数两次；但是需要注意处理prototype 和 constructor

function Parent(name){
   this.name = name
}

Parent.prototype.say=function(){
    console.log(this.name)
}

function Child(name,age){
    Parent.call(this,name)
    this.age = age
}

Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child