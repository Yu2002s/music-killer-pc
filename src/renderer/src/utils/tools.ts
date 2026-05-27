export function throttle(func: (...args: any) => void, wait: number = 200) {
  let flag = false
  return function (...args: any[]) {
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
