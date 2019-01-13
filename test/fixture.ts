/*! This creates a DOM for testing fully mounted headless components using JSDom and Enzyme. */
import Adapter from 'enzyme-adapter-react-16'
import { configure } from 'enzyme'
const { JSDOM } = require('jsdom')
const jsdom = new JSDOM('<!doctype html><html><body><div id="root"/></body></html>')
const { window } = jsdom
function copyProps(src: any, target: any) {
  Object.defineProperties(target, {
    // @ts-ignore
    ...Object.getOwnPropertyDescriptors(src),
    // @ts-ignore
    ...Object.getOwnPropertyDescriptors(target)
  })
}
// @ts-ignore
global.window = window
// @ts-ignore
global.document = window.document
// @ts-ignore
global.navigator = {
  userAgent: 'node.js'
}
// @ts-ignore
global.requestAnimationFrame = function(callback) {
  return setTimeout(callback, 0)
}
// @ts-ignore
global.cancelAnimationFrame = function(id) {
  clearTimeout(id)
}
copyProps(window, global)
configure({ adapter: new Adapter() })
//
// ------- End fake environment set up.
//

/**
 * Wait the given number of milliseconds and resolve a promise
 * @param ms the milliseconds to wait before resolving
 */
export function timeout(ms: number): Promise<void> {
  return new Promise<void>(function promiseTimeout(resolve) {
    setTimeout(() => {
      resolve(undefined)
    }, ms)
  })
}
