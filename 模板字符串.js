//模板字符串渲染的核心是通过正则匹配占位符，比如 {{name}}，
// 再用 replace 的回调拿到变量名，到数据对象里取值并替换回去。
// 基础实现通常只支持简单 key，如果要支持像 user.name 这样的嵌套路径，可以再对 key 做分割处理。

function render(template, data) {
    if (typeof template !== 'string') {
      throw new TypeError('template must be a string')
    }
  
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return key in data ? data[key] : ''
    })
  }

// replace 做什么？把匹配到的内容替换成新内容，返回新字符串。

// 第二个参数传回调是什么意思？每匹配一次，就调用一次回调；回调返回什么，这一段就替换成什么。

// 回调第一个参数是什么？整个匹配到的字符串。后面的参数是什么？

// 正则括号捕获到的内容；再后面还有匹配位置和原字符串

const str = 'abc123def'

str.replace(/(\d+)/g, (match, num, index, source) => {
  console.log(match)  // 123
  console.log(num)    // 123
  console.log(index)  // 3
  console.log(source) // abc123def
  return match
})