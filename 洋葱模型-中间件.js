// compose 接受一系列函数，他们带有共享的上下文，异步按顺序执行，返回一个函数

function compose(middlewares){
    return function(ctx){
        let index = -1
        function dispatch(i){
            // i和index主要用于防止一个中间件多次调用造成混乱，重要设计
           if(i <= index){return Promise.reject('next() called multiple times')}
           // 注意此处不要let，已经不是第一次犯了
           index =i
           const fn = middlewares[i]
           if(!fn) return Promise.resolve()

            // 为什么此处必须要用Promise.resolve包裹？为了兼容普通函数，如果强调了中间件必须是async，就不需要了，但是面试时还是兼容性强一点好
            return Promise.resolve(
                fn(ctx,()=>dispatch(i+1))
            )
        }

        return dispatch(0)
    }
}