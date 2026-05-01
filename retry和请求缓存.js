// 我会传入一个返回 Promise 的函数 fn，每次执行失败后判断剩余次数，如果还有机会就继续调用；只要有一次成功就直接返回结果；如果次数耗尽，就抛出最后一次错误。实现上可以用递归，也可以用 async/await + for。

// 纯延迟用函数，可以与原函数解耦
function delay(ms){
    return new Promise((resolve,_)=>{
        setTimeout(()=>{
            resolve()
        },ms)
    })
}

function retry(fn,times=1,delayTime = 0){
    // 先判断类型是否合法
    if(typeof fn !== 'function'|| typeof times !== 'number'){
        throw new TypeError('参数类型不合法')
    }
    // 包裹一下fn，能够支持同步报错
    return Promise.resolve()
    .then(() => fn())
    .catch(async (err) => {
      if (times <= 1) throw err
      if (delayTime > 0) await delay(delayTime)
      return retry(fn, times - 1, delayTime)
    })
}

async function retryWithAsync(fn,times=1,delayTime = 0){
    // 先判断类型是否合法
    if(typeof fn !== 'function'|| typeof times !== 'number'){
        throw new TypeError('参数类型不合法')
    }
    for(let i = 1; i <= times; i++){
        try {
            return await fn()
        } catch (error) {
            if(i === times) throw error
            else if(delayTime>0) await delay(delayTime)
        }
    }
}


// 注意throw在普通函数里是同步报错，但在async中被实际当作Promise.reject

// async function 是不是默认返回 Promise？是。

// async 里 return 是什么效果？等价于 Promise.resolve(...)

// async 里 throw 是什么效果？等价于 Promise.reject(...)

// reject 和 throw 等同吗？在 async 函数对外表现上基本等同；平时在 async 里更常用 throw。


// 请求缓存，同样的key拿到同样的promise

// 追问，状态更完整一些，可以引入状态  const record = {status: 'pending',value: null,promise: null}

function cacheRequest(fn){
    if(typeof fn !== 'function'){
        throw new TypeError('参数类型不合法')
    }
    const cache = new Map()
    return function(...args){
        // 简单获取key，key复杂时应该采用其他方法
        const key = JSON.stringify(args)
        // 有缓存则返回缓存的promise
        if(cache.has(key)){
            return cache.get(key)
        }
        // 没有缓存则新建promise
        const promise = Promise.resolve().then(()=>fn(...args)).then(
            (value)=>{   
                return value
            }
        ).catch((err)=>{
            cache.delete(key)
            throw err
        })
        // 重点，请求刚发就需要设置缓存，而不是已成功才加，以免pending时其他需求无法复用
        cache.set(key,promise)
        return promise
    }
}