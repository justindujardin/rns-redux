import React, { useState, useEffect, Fragment, useReducer } from 'react'
import { NotifyPortal, NotifyPortalProps } from './components/portal'
import { NotifyDispatch, NotifyState } from './types'
import { getInitialNotifyState, NotifyReducer } from './model/reducer'
import { INotifyContext, NotifyContext } from './context'

export interface NotifyProviderProps extends Partial<NotifyPortalProps> {
  readonly state?: NotifyState
  readonly dispatch?: NotifyDispatch
  readonly children?: React.ReactNode | string
}

/** React Context provider that enables use of `useNotify` hook by child components. */
export function NotifyProvider(props: NotifyProviderProps) {
  const { children, state = getInitialNotifyState(), dispatch, ...portalProps } = props
  const customDispatch: boolean = !!props.dispatch
  // props.state is used to initializer component reducer. Hooks cannot
  // be conditional, so we define it even if we end up using a provided
  // custom dispatch.
  const [hooksState, hooksDispatch] = useReducer(NotifyReducer, state)
  const [contextProps, setContextProps] = useState<INotifyContext | null>({
    state,
    dispatch: dispatch || hooksDispatch
  })
  useEffect(
    function onContextSourceChanged() {
      const newState = customDispatch ? state : hooksState
      const newDispatch = props.dispatch ? props.dispatch : hooksDispatch
      if (contextProps && !shallowCompare(contextProps.state, state)) {
        setContextProps({ state: newState, dispatch: newDispatch })
      }
    },
    [state, contextProps]
  )
  return (
    <NotifyContext.Provider value={contextProps}>
      <Fragment>
        <NotifyPortal {...portalProps} />
        {children}
      </Fragment>
    </NotifyContext.Provider>
  )

  // from: https://stackoverflow.com/questions/22266826/how-can-i-do-a-shallow-comparison-of-the-properties-of-two-objects-with-javascri
  function shallowCompare(obj1: any, obj2: any) {
    return (
      Object.keys(obj1).length === Object.keys(obj2).length &&
      Object.keys(obj1).every((key: string) => obj2.hasOwnProperty(key) && obj1[key] === obj2[key])
    )
  }
}
// TODO: Redux friendly wrapper that automatically pulls state/dispatch from ReduxContext?
// probably need to support both the react-redux internal context and the facebook incubator
// project replacement that uses Hooks (it needs a better name because I keep forgetting it.)
