// EventEmitter 的核心是维护一个事件和回调列表的映射关系。
// on 用来注册回调，emit 用来触发事件并透传参数，off 用来移除指定回调，once 则是通过包装函数实现“触发一次后自动解绑”。实现时一般会用对象或 Map 存储事件中心，一个事件名对应多个回调

// 追问 为什么 once 要包一层 为什么 emit 最好拷贝数组后再遍历 off 怎么设计更灵活

// return this 是为了可以链式调用


class EventEmitter {
    constructor() {
        this.events = new Map()
    }
    on(eventName, callback) {
        if(typeof callback !== 'function'){
            throw new TypeError('callback must be a function')
        }
        if (!this.events.has(eventName)) {
            this.events.set(eventName, [])
        }
        this.events.get(eventName).push(callback)
        return this 
    }

    emit(eventName,...args){
        const callbacks = this.events.get(eventName)
        if(!callbacks||callbacks.length===0) return false
        const fns = [...callbacks]
        fns.forEach(callback=>callback(...args))
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

    // once 通过包装函数实现。触发事件时先执行原回调，再把包装函数从事件中心移除，因此后续不会再次触发。
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

// 观察者模式
// 观察者模式里，观察者和被观察者之间通常是直接关联的，被观察者维护观察者列表并在状态变化时逐个通知；发布订阅模式则引入了一个事件中心，发布者和订阅者不直接通信，而是通过消息通道解耦。EventEmitter 就是发布订阅模式的一种典型实现，比如通过 on 订阅、emit 发布、off 取消订阅。

class Subject {
    constructor() {
      this.observers = []
      this.state = null
    }
  
    add(observer) {
      this.observers.push(observer)
    }
  
    setState(state) {
      this.state = state
      this.observers.forEach(observer => observer.update(state))
    }
  }
  
  class Observer {
    constructor(name) {
      this.name = name
    }
  
    update(state) {
      console.log(this.name, '收到更新:', state)
    }
  }

  const subject = new Subject()
  const o1 = new Observer('A')
  const o2 = new Observer('B')

  subject.add(o1)
  subject.add(o2)

  subject.setState('新状态')