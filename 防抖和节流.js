function debounce (fn,delay){
   let timer = null 
   return function(...arg){
    const context = this
    if(timer){ 
        clearTimeout(timer)
    } 
    timer = setTimeout(()=>{
        fn.apply(context,arg)
        timer = null
    },delay)
   }
}

// 时间戳版，缺点，最后一次可能不会执行,但是第一次立即执行
function throttle(fn,delay){
    let lastTime = 0
    return function(...arg){ 
        const context = this
        const nowTime = Date.now()
        if(nowTime - lastTime >= delay){
            fn.apply(context,arg)
            lastTime = nowTime
        } 
    }
}


// 定时器版，缺点，第一次执行有延迟
function throttle(fn,delay){
    let timer = null
    return function(...arg){ 
        const context = this
         if(!timer){ 
            timer = setTimeout(()=>{
                fn.apply(context,arg)
                timer = null
            },delay)
        }    
    }
}

/*1. 防抖和节流分别适合哪些场景？

你要能答：

防抖：搜索输入、表单校验、resize

节流：scroll、mousemove、拖拽、页面滚动监听

2. 为什么都要返回一个新函数？

因为要靠闭包保存状态，比如：

防抖保存 timer

节流保存 timer 或 lastTime

3. 为什么要用 apply？

为了保留调用时的 this 和参数。

4. 节流能不能同时做到“第一次立即执行，最后一次也执行”？

可以。这个就是更完整的节流版本。*/

// 立即触发型，但是不等于节流，仍然要等延迟完毕，节流只是每次触发的间隔不是最后一次的延迟
function debounce(fn, delay, immediate = false) {
    let timer = null;
  
    return function (...args) {
      // 保存调用方，后续制定this
      const context = this;

      // 每次执行先清理定时器 因为是防抖，要从最新一次记录延迟，对比：节流是上次触发间隔
      if (timer) clearTimeout(timer);

      // 是否立即生效，如果是立即生效，则判断是否在延迟中，延迟中则刷新定时器，延迟完毕则执行函数，也刷新定时器
      if (immediate) {
        const callNow = !timer;

        timer = setTimeout(() => {
          timer = null;
        }, delay);

        if (callNow) {
          fn.apply(context, args);
        }
        // 如果不是立即生效，则直接设定新的定时函数
      } else {
        timer = setTimeout(() => {
          fn.apply(context, args);
        }, delay);
      }
    };
  }

  // 节流完美版，立刻第一次，最后一次也补上，这是不是意味着如果说1s内点了4、5次，就会立即触发一次，结束了再触发一次？
  function throttle(fn, delay) {
    // 闭包
    let lastTime = 0;
    let timer = null;

    return function (...args) {
      const lastArgs = args;
      const context = this;
      const now = Date.now();
      // remain代表着剩余间隔
      const remain = delay - (now - lastTime);

      if (remain <= 0) {
        // 到时间了，立即执行，并记录执行时间，保险清理一下定时器
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        lastTime = now;
        fn.apply(context, args);
      } else if (!timer) {
        // 还没到时间，也没有定时器，设置一个末尾触发定时器；但如果已经有定时器了，就不再新增，保证到时间后只补一次
        timer = setTimeout(() => {
          // 但是要设置最新的触发时间
          lastTime = Date.now();
          timer = null;
          fn.apply(context, lastArgs);
        }, remain);
      }
    };
  }

  // throttle(fn,1000)时，remain为负数，直接执行并创建间隔定时器，更新lastTime为现在     0ms时
  // 我在0.2s时再点击一次，发现remain还剩800ms，但是现在已经没有定时器了，于是创建一个800ms后执行的定时器，但是更新此次触发时间  200ms时
  // 0.4s时，又点击了一次，发现remain800s (因为距离lastTime为200ms)，但是已经有定时器了，因此忽略此次执行
  // 在1.1s时，定时器已经触发了第二次执行，但此时remain还是100ms，所以只能建立定时器
