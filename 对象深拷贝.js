// 对象深拷贝关键词：weakMap-循环引用 基本类型处理 特殊类型处理 递归拷贝每一层属性
// 深拷贝的核心是递归拷贝每一层属性。
// 基本类型直接返回，引用类型要新建一个容器，再递归复制内部属性。
// 为了处理循环引用，要用 WeakMap 做缓存。
// 另外像 Date、RegExp、Map、Set 这种特殊类型，需要单独处理，不能直接按普通对象拷贝。
// 最完整版本还可以处理Map 和 Set

// 为什么不能用JSON.parse(JSON.stringify())：循环引用直接报错；无法正确处理特殊类型。
// 函数不做深拷贝直接返回引用
// for in 有什么问题？——会遍历所有可枚举属性，配合hasOwnProperty只拷贝自身属性
// map和weakMap的区别？ weakMap的键只能是对象，是弱引用，会被垃圾回收机制回收键值对。

function deepClone(obj, map = new WeakMap()) {
  if (typeof obj !== "object" || obj === null) return obj;
  // 处理循环引用
  if (map.has(obj)) return map.get(obj);
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new Regexp(obj.source, obj.flags);
  // 处理数组
  const result = Array.isArray(obj) ? [] : {};
  map.set(obj.result);
  // 克隆属性
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // 关键递归
      result[key] = deepClone(obj[key], map);
    }
  }
  return result;
}
