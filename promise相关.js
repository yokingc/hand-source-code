// | 方法           | 成功条件       | 失败条件 | 返回值  | 空数组           |
// | ------------ | ---------- | ---- | ---- | ------------- |
// | `all`        | 全部成功       | 一个失败 | 成功数组 | `resolve([])` |
// | `race`       | 谁先 settled | 谁先失败 | 单个值  | pending       |
// | `any`        | 一个成功       | 全失败  | 单个值  | `reject`      |
// | `allSettled` | 全部完成       | 不会失败 | 状态数组 | `resolve([])` |




// Promise.all 会并发执行多个任务，并返回一个新的 Promise。
// 实现上我会遍历输入项，用 Promise.resolve 统一包装，每个成功结果按原索引存到结果数组里，同时用计数器统计完成数量；
// 当全部完成时 resolve 结果数组;
// 只要有一个失败就立即 reject。 补充一点，即使reject，底层Promise还会继续执行，只是不再关心结果。

// promises除了数组还支持可迭代对象

// 手写版五个点：返回Promise，支持原始值，按顺序吐，一个失败就reject，处理空数组

function myPromiseAll(promises) {
    return new Promise((resolve, reject) => { 
        if (!Array.isArray(promises)) {
            // 注意，在一个Promise中，再采取Promise.reject外层是不会采取的，需要直接调用外层的reject
            return reject(new TypeError('arguments must be an array'))
          }
          const result = []
          let count = 0
          if (promises.length === 0) {
            // promise内在resolve的基础上还是要return
            return resolve([])
          }
          // 开始遍历promises
          promises.forEach((item, index) => { 
            Promise.resolve(item).then((value)=>{
                result[index] = value
                count++
                if (count === promises.length) {
                    resolve(result)
                }
            }).catch(err => reject(err))
          })
    })
  }


  // Promise.race 会返回一个新的 Promise。实现时我会遍历输入项，并用 Promise.resolve 统一包装；谁最先落定，不管是 fulfilled 还是 rejected，就直接用它来决定外层 Promise 的状态。它和 Promise.all 最大的区别是，all 等全部成功，而 race 只看第一个结束的结果。典型应用场景是请求超时控制。
  function myPromiseRace(promises){
    return new Promise((resolve,reject)=>{
      // 判断需要放在返回的新Promise中，不然reject无效
      if(!Array.isArray(promises)){
        return reject(new TypeError('arguments must be an array'))
    }
      for(const item of promises){
        Promise.resolve(item).then((res)=>resolve(res)).catch((err)=>reject(err))
      }
    })
  }

// 为什么空数组会一直 pending：因为返回的新Promise循环内什么也没做，所以一直pending·
 
// 为什么普通值也能参与竞争 Promise.resolve包装了普通值，且通常时最快的

// 为什么它适合做超时控制 因为可以设置一个异步的超时函数reject，利用race的特性，采取最先落定的结果

// then(resolve, reject)处理“前一个 Promise 的失败”；.then(resolve).catch(reject)还能处理“then 回调里的异常”，兜底范围更大。


// Promise.allSettled 会等待所有输入项都落定，不管成功还是失败，最后统一返回结果数组。实现上我会遍历每一项，用 Promise.resolve 统一包装；成功时按索引存 { status: 'fulfilled', value }，失败时存 { status: 'rejected', reason }，然后无论成功失败都计数，等全部完成后统一 resolve(result)。它和 Promise.all 最大的区别是不会因为某一项失败而整体 reject。

// 适合场景：批量上传文件想知道每个文件的成败、多个接口、批量任务报表
function myPromiseAllSettled(promises) { 
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
      Promise.resolve(item).then((value)=>{
        result[index]={
          status:'fulfilled',
          value
        }
      }).catch((reason)=>{
        result[index]={
          status:'rejected',
          reason // 原生就是reason
        }
      }).finally(()=>{
        count++
        if(count === length){
          resolve(result)
        }
      })
    })
  })
}

// any 全部失败才失败，一个成功则成功 最大特点如果数组空要报错
function promiseAny(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      throw new TypeError("arguments must be an array");
    }

    if (promises.length === 0) {
      return reject(new AggregateError([], "All promises were rejected"));
    }

    let count = 0;
    const errors = [];

    promises.forEach((item, index) => {
      Promise.resolve(item)
        .then((value) => {
          resolve(value);
        })
        .catch((reason) => {
          errors[index] = reason;
          count++;
          if (count === promises.length) {
            reject(new AggregateError(errors, "All promises were rejected"));
          }
        });
    });
  });
}


// 限并发调度的核心是控制同时执行中的任务数量不超过上限。我会维护一个待执行任务索引，先启动最多 limit 个任务；每当某个任务完成时，就再从队列里补一个任务进去。为了保证结果顺序正确，我会在任务启动前先保存当前索引，并把结果按这个索引写回数组。如果题目要求失败即终止，那就任一任务失败时直接 reject。
// 限并发调度器，实现类似promise.all效果的，一个reject则整体停止
function promiseLimit(tasks, limit) {
  return new Promise((resolve, reject) => {
    const results = new Array(tasks.length); // 按原顺序保存结果
    let nextIndex = 0; // 下一个要启动的任务下标
    let finished = 0; // 已完成数量
    let running = 0; // 当前并发中的数量

    function runNext() {
      // 全部完成
      if (finished === tasks.length) {
        resolve(results);
        return;
      }

      // 尽量补满并发池
      while (running < limit && nextIndex < tasks.length) {
        const currentIndex = nextIndex;
        const task = tasks[currentIndex];
        nextIndex++;
        running++;

        Promise.resolve()
          .then(() => task())
          .then((res) => {
            results[currentIndex] = res;
          })
          .catch((err) => {
            reject(err); // 一个失败就整体失败，和 Promise.all 类似
          })
          .finally(() => {
            running--;
            finished++;
            runNext(); // 有坑位了，继续补任务
          });
      }
    }

    runNext();
  });
}

// Promise.resolve包装方式区别，前者监听的是Promise比如race、all中，后者监听的是普通函数比如限并发调度器


// 小异步sleep：返回一个一段时间后才resolve的Promise 和定时器的区别：基于定时器封装的Promise，更适合在async await线性执行，把异步流程写成了同步结构
function sleep(delay=0){
  return new Promise((resolve)=>{
    setTimeout(resolve,delay)
  })
}

// 使用：先创建一个Promise，然后创建一个定时器，在指定延迟后resolve，再执行then的代码
sleep(1000).then(() => {
  console.log('done')
})

// promisify 针对node里经典的 error-first callback风格代码的封装
// promisify 的作用是把传统的回调式异步函数包装成返回 Promise 的函数。常见场景是把 Node 风格的 (err, data) => {} 回调改造成 then / catch 或 await 可用的形式。实现上通常是返回一个新函数，在内部用 Promise 包裹原函数，并根据回调参数决定 resolve 还是 reject。

// 串行调度/串行执行任务 和洋葱模型区分，串行只是按顺序执行，中间件时套娃式调用链，需要结合next
async function runSerial(tasks) {
  const result = []
  for (const task of tasks) {
    result.push(await task())
  }
  return result
}