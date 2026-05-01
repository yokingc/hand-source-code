Function.prototype.myCall= function(context,...arg) {
    if(typeof this !== 'function'){
        throw new TypeError('not function')
    }
    context = context == null ? globalThis : Object(context);
    const myKey = Symbol('myKey')
    context[myKey] = this
    const result = context[myKey](...arg)
    delete context[myKey]
    return result
}

Function.prototype.myApply=function(context,arg){
    if(typeof this !== 'function'){
        throw new TypeError('not function')
    }
    context = context == null ? globalThis : Object(context);
    const myKey = Symbol('myKey')
    context[myKey] = this
    // 多一步对arg是否为数组的判断, 只是简化判断。实际可以支持真数组、类数组、可迭代对象
    const result = Array.isArray(arg)? context[myKey](...arg):context[myKey]()
    delete context[myKey]
    return result
}

Function.prototype.myBind=function(context,...bindArg){
    if(typeof this !== 'function'){
        throw new TypeError('not function')
    }
    context = context == null ? globalThis : Object(context);
    const targetFn = this
    function boundFn(...callArg){
        const isNew = this instanceof boundFn
        const finalThis = isNew ? this : context
        return targetFn.apply(finalThis,[...bindArg,...callArg])
    }

    // 处理原型链
    if(targetFn.prototype){
        boundFn.prototype = Object.create(targetFn.prototype) //boundFn.prototype.__proto__ === targetFn.prototype
    }
    return boundFn
}





//gpt数组判断完整版
Function.prototype.myApply = function (context, args) {
    if (typeof this !== 'function') {
      throw new TypeError('myApply must be called on a function');
    }
  
    context = context == null ? globalThis : Object(context);
    const key = Symbol('fn');
    context[key] = this;
  
    let result;
  
    if (args == null) {
      result = context[key]();
    } else {
      let finalArgs;
  
      // 1. 真数组
      if (Array.isArray(args)) {
        finalArgs = args;
      }
      // 2. 可迭代对象：Set、字符串、生成器等
      else if (typeof args[Symbol.iterator] === 'function') {
        finalArgs = [...args];
      }
      // 3. 类数组对象：arguments、NodeList、{0:..., length:...}
      else if (typeof args === 'object' && typeof args.length === 'number') {
        finalArgs = Array.from(args);
      } else {
        delete context[key];
        throw new TypeError('CreateListFromArrayLike called on non-object');
      }
  
      result = context[key](...finalArgs);
    }
  
    delete context[key];
    return result;
  };