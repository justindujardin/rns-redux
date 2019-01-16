export class Timer {
  start = 0
  remaining = 0
  timerId: any = 0
  constructor(private callback: () => any, public delay: number) {
    this.remaining = delay
    this.resume()
  }
  pause = () => {
    clearTimeout(this.timerId)
    this.remaining -= new Date().getTime() - this.start
  }

  resume = () => {
    this.start = new Date().getTime()
    clearTimeout(this.timerId)
    this.timerId = setTimeout(this.callback, this.remaining)
  }

  clear = () => {
    clearTimeout(this.timerId)
  }
}

/* istanbul ignore next */
/**
 * This exploits Typescript's control flow analysis to do exhaustive pattern
 * matching on switch statements that have tagged union types being switched
 * on.
 *
 * This is useful for prevent access errors and ensuring all cases are considered
 * when adding new features.
 */
export function exhaustiveCheck(_action: never) {
  // MAGIC!
}

/**
 * Throw an error if an expression is false
 * @param expression The expression to check for truthiness
 * @param message The message to show as an error if the expression is not truthy
 */
export function invariant(expression: any, message: string) {
  if (!expression) {
    throw new Error(`Invariant failed: ${message}`)
  }
}

// from: https://stackoverflow.com/questions/22266826/how-can-i-do-a-shallow-comparison-of-the-properties-of-two-objects-with-javascri
export function shallowCompare(obj1: any, obj2: any): boolean {
  return (
    Object.keys(obj1).length === Object.keys(obj2).length &&
    Object.keys(obj1).every((key: string) => obj2.hasOwnProperty(key) && obj1[key] === obj2[key])
  )
}
