/*
 * @Author: misterzhou
 * @Date: 2022-04-01 10:15:57
 * @LastEditTime: 2022-04-05 13:40:36
 * @LastEditors: misterzhou
 * @FilePath: /mz-rollup-template/src/reactivity/reactive.ts
 * @Description:
 */
import { isObject } from '../shared'

// 存储响应式对象映射表
const proxyMap = new WeakMap()

// 根据target创建响应式对象
function createReactiveObject(target, baseHandlers) {
  // 如果不是对象，直接忽略
  if (!isObject(target)) {
    return target
  }

  // 映射表缓存
  const existProxy = proxyMap.get(target)
  if (existProxy) {
    return existProxy
  }
  // 只对最外层对象做代理，默认不会递归，而且不会重写对象中的属性
  const proxy = new Proxy(target, baseHandlers)
  // 将代理对象和代理后的存储映射表
  proxyMap.set(target, proxy)
  return proxy
}

export function reactive(target) {
  // 创建响应式对象 proxy
  return createReactiveObject(target, {
    get(target, key, receiver) {
      // reflect
      const res = Reflect.get(target, key, receiver)
      console.log('$--get-', res);
      return res
    },
    set(target, key, value, receiver) {
      const res = Reflect.set(target, key, value, receiver)
      console.log('$--set-', res);
      return res
    }
  })
}

