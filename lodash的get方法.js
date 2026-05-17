// lodash.get 的核心作用就是安全地按路径取对象深层属性，取不到时返回默认值。

// 思路 先处理path统一转数组 逐层向下取值
// 参数 取值的对象obj 取值路径path 默认值defaultValue

function myGet(obj, path, defaultValue) {
  if (obj === null || obj === undefined) return defaultValue;
  const keys = Array.isArray(path)
    ? path
    : path
        .replace(/\[(\w+)\]/g, ".$1")
        .split(".")
        .filter(Boolean);

  let cur = obj;
  for (let i = 0; i < keys.length; i++) {
    cur = cur[keys[i]];
    if (cur === null || cur === undefined) return defaultValue;
  }
  return cur === undefined ? defaultValue : cur;
}

// set 是安全地赋值
function mySet(obj, path, value) {
  if (obj == null) return obj;

  const keys = Array.isArray(path)
    ? path
    : path
        .replace(/\[(\w+)\]/g, ".$1")
        .split(".")
        .filter(Boolean);

  let cur = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (cur[key] == null) {
      cur[key] = /^\d+$/.test(keys[i + 1]) ? [] : {};
    }

    cur = cur[key];
  }

  cur[keys[keys.length - 1]] = value;
  return obj;
}
