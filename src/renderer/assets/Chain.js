/**
 * 链式调用
 */
class Chain {
  constructor () {
    this.tasks = []
    const fn = () => {
      this.next()
    }
    this.tasks.push(fn)
  }
  run (func, type = null) {
    let fn
    switch (type) {
      case 'promise':
        fn = () => {
          func().then(() => {
            this.next()
          })
        }
        break
      default:
        fn = () => {
          func()
          this.next()
        }
        break
    }
    this.tasks.push(fn)
    return this
  }
  next () {
    const fn = this.tasks.shift()
    fn && fn()
  }
  init () {
    Promise.resolve().then(() => {
      this.next()
    })
    return this
  }
}

export default Chain
