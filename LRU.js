// LRU = Least Recently Used，最近最少使用缓存。
// get 命中后要刷新最近使用顺序 putput 超容量后淘汰最旧项 map天然带插入顺序

//LRU 的核心是：访问一个元素时，要把它变成“最新使用”；当容量超出时，淘汰“最久没使用”的元素。我这里用 Map 来实现，因为 Map 会维护插入顺序。get 命中时先删除再重新插入，达到刷新顺序的目的；put 时如果 key 已存在，也先删除再重新插入；插入后如果超出容量，就删除 Map 中第一个 key，也就是最旧的元素。

class LRUCache { 
    constructor(capacity){
         this.capacity =  capacity
         this.cache = new Map()
    }

    get(key){
        // has和get的区别，get到undefined键也可能存在，比如设置时map.set(key,undefined)
        if(!this.cache.has(key)) return -1
        else{
            const value = this.cache.get(key)
            // 重置顺序
            this.cache.delete(key)
            this.cache.set(key,value)
            return value
        }
    }

    put(key,value){
        // 如果是老元素，替换掉
        if(this.cache.has(key)){
            this.cache.delete(key)
            this.cache.set(key,value)
        // 如果是新元素，且容量满了，删除最旧插入的元素，this.cache.keys().next().value
        } else if(this.cache.size >= this.capacity){ 
            this.cache.delete(this.cache.keys().next().value)
            this.cache.set(key,value)
        } else{
        // 容量没满，直接插入
            this.cache.set(key,value)
        }
    }
}

// map使用方法补充：clear清空map  keys拿到key的迭代器 values entries拿到key-value的迭代器 .next()拿到迭代器的下一个元素{ value: 'a', done: false }

const map = new Map()
map.set('a', 1)
map.set('b', 2)
map.set('c', 3)
console.log(map.keys().next()) // { value: 'a', done: false }
console.log(map.keys().next().value) // 'a'