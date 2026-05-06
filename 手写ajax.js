// 手写 Ajax 就是基于 XMLHttpRequest 封装一个请求函数，核心流程是创建 xhr、调用 open、监听 onreadystatechange、判断 readyState 和 status，最后通过 send 发送请求。进一步可以封装成 Promise，并补充 headers、超时、错误处理等能力。

// xhr.open(...)
// xhr.setRequestHeader(...)
// xhr.onreadystatechange = ...
// xhr.send(...)

// readyState 0-未初始化 1-open已调用 2-收到响应头 3-正在接受响应体 4-请求完成（真正常用）

// 核心逻辑
function ajax(url, success, fail) {
  const xhr = new XMLHttpRequest();

  // 处理GET参数拼接

  xhr.open("GET", url, true);

  // 设置超时时间

  // 设置请求头
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        success(xhr.responseText);
      } else {
        fail(xhr);
      }
    }
  };

  // 超时、网络错误

  // 发送请求 method contentType判断
  xhr.send();
}

// 完整
function ajax(options) {
  const {
    url,
    method = "GET",
    data = null,
    headers = {},
    timeout = 0,
    success,
    error,
  } = options;

  const xhr = new XMLHttpRequest();

  // 处理 GET 参数拼接
  let finalUrl = url;
  if (method.toUpperCase() === "GET" && data) {
    const queryString = new URLSearchParams(data).toString();
    finalUrl += (url.includes("?") ? "&" : "?") + queryString;
  }

  xhr.open(method, finalUrl, true);

  // 设置超时时间
  xhr.timeout = timeout;

  // 设置请求头
  for (const key in headers) {
    xhr.setRequestHeader(key, headers[key]);
  }

  // 状态变化监听
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        success && success(xhr.responseText);
      } else {
        error && error(xhr);
      }
    }
  };

  // 超时
  xhr.ontimeout = function () {
    error && error(new Error("请求超时"));
  };

  // 网络错误
  xhr.onerror = function () {
    error && error(new Error("网络错误"));
  };

  // 发送请求
  if (method.toUpperCase() === "GET") {
    xhr.send();
  } else {
    const contentType = headers["Content-Type"] || headers["content-type"];
    if (contentType === "application/json") {
      xhr.send(JSON.stringify(data));
    } else {
      xhr.send(new URLSearchParams(data).toString());
    }
  }
}
