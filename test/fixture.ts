import React from 'react'
import { INotifyContext } from '../src/context'
import { NotifyState, NotifyDispatch } from '../src/types'
import { getInitialNotifyState, NotifyReducer } from '../src'
import { createStore } from 'redux'

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

export function makeStore(state: Partial<NotifyState> = getInitialNotifyState()) {
  return createStore(NotifyReducer, state)
}

export function testModelContext(
  initialState: Partial<NotifyState> = { notifications: [] }
): INotifyContext {
  const store = makeStore(initialState)
  const state = getInitialNotifyState()
  return { state, dispatch: store.dispatch }
}

export * from 'react-testing-library'
