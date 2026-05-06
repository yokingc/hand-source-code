// 防竞态 = 只认最后一次请求的结果。
// 两种方案：1.维护id，不是最新的id结果舍弃 2.通过AbortController来取消旧请求，需要支持signal的请求方式
// react里用ref
function createLatestRequest(requestFn) {
  let currentId = 0;

  return async function (...args) {
    const id = ++currentId;
    const result = await requestFn(...args);

    if (id !== currentId) return undefined;
    return result;
  };
}
