/*
 * @Author: misterzhou
 * @Date: 2022-04-01 10:44:48
 * @LastEditTime: 2022-04-01 13:18:32
 * @LastEditors: misterzhou
 * @FilePath: /mz-rollup-reactivity/src/shared/index.ts
 * @Description: 工具类相关
 */
// 目标是否为对象
export const isObject = (target) => typeof target === 'object' && target != null

// 目标是否为symbol类型
export const isSymbol = (target) => typeof target === 'symbol'

// 是否为Array
export const isArray = (val) => Array.isArray(val)

// 是否为Integer
export const isInteger = (val: string) => '' + parseInt(val, 10) === val

// 目标是否有该属性
export const hasProperty = (target, key) =>
  Object.prototype.hasOwnProperty.call(target, key)

// 两个值是否发生改变
export const hasChanged = (oldValue, newValue) => oldValue !== newValue
