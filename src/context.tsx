import React, { useState, useEffect, Fragment } from 'react'
import { NotifyPortal, NotifyPortalProps } from './components/portal'
import { NotifyDispatch, NotifyState, NotifyAction } from './types'

/**
 * Injected notify context values
 */
export interface INotifyContext<T = NotifyDispatch> {
  readonly notify: {
    readonly state: NotifyState
    readonly dispatch: T
  }
}

/**
 * Notify context that caries state and a dispatch function for updating state.
 */
export const NotifyContext = React.createContext<INotifyContext | null>(null)

export interface NotifyProviderProps extends Partial<NotifyPortalProps> {
  readonly state: NotifyState
  readonly dispatch: NotifyDispatch
  readonly children?: React.ReactNode | string
}

/**
 * React Context provider that enables use of `useNotify` hook and injects the `notify`
 * context prop into child components.
 */
export function NotifyProvider(props: NotifyProviderProps) {
  const { children, state, dispatch, ...portalProps } = props
  const [contextProps, setContextProps] = useState<INotifyContext | null>({
    notify: { state, dispatch }
  })
  useEffect(
    function onContextSourceChanged() {
      setContextProps({ notify: { state, dispatch } })
    },
    [state, dispatch]
  )
  return (
    <NotifyContext.Provider value={contextProps}>
      <Fragment>
        <NotifyPortal {...portalProps} />
        {children}
      </Fragment>
    </NotifyContext.Provider>
  )
}
// TODO: Redux friendly wrapper that automatically pulls state/dispatch from ReduxContext?
// probably need to support both the react-redux internal context and the facebook incubator
// project replacement that uses Hooks (it needs a better name because I keep forgetting it.)
