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
      const context = this;
  
      if (timer) clearTimeout(timer);
  
      if (immediate) {
        const callNow = !timer;
  
        timer = setTimeout(() => {
          timer = null;
        }, delay);
  
        if (callNow) {
          fn.apply(context, args);
        }
      } else {
        timer = setTimeout(() => {
          fn.apply(context, args);
        }, delay);
      }
    };
  }

  // 节流完美版，立刻第一次，最后一次也补上
  function throttle(fn, delay) {
    let lastTime = 0;
    let timer = null;
  
    return function (...args) {
      const context = this;
      const now = Date.now();
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
        // 还没到时间，也没有定时器，设置一个末尾触发定时器
        timer = setTimeout(() => {
          lastTime = Date.now();
          timer = null;
          fn.apply(context, args);
        }, remain);
      }
    };
  }