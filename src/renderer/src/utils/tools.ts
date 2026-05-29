/**
 * 节流方法
 * @param func 需要节流的方法
 * @param wait 间隔时间
 * @returns 新的方法
 */
export function throttle(func: (...args: any) => void, wait: number = 200) {
  let flag = false
  return function (...args: any) {
    if (flag) {
      return
    }
    flag = true
    setTimeout(() => {
      flag = false
      func.apply(this, args)
    }, wait)
  }
}
