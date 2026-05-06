// useEvent 本质上是 useRef + useLayoutEffect + useCallback 的组合。
// useRef 用来保存最新的回调函数，
// useLayoutEffect DOM更新后，浏览器绘制前同步最新的fn，避免显示和逻辑不一致
// useCallback([]) 返回一个引用稳定的函数。
// 这样既能保证传出去的函数地址不变，又能在执行时拿到最新状态，避免闭包陈旧问题。

import { useLayoutEffect, useRef, useCallback } from "react";

export function useEvent(fn) {
  const fnRef = useRef(fn);

  // 每次渲染后，都把最新函数放进去
  useLayoutEffect(() => {
    fnRef.current = fn;
  });

  // 返回一个地址永远不变的函数
  const stableFn = useCallback((...args) => {
    return fnRef.current(...args);
  }, []);

  return stableFn;
}

// 为什么要用fnRef.current而不是直接fn，避免fn读成旧闭包
// 直接写 fn(...args)
// 能不能稳定：不一定
// 能不能最新：要么旧，要么依赖fn导致重新创建
// 写 fnRef.current(...args)
// 外层函数：稳定
// 内层逻辑：最新
