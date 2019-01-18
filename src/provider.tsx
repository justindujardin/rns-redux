import React, { useState, useEffect, Fragment, useReducer } from 'react'
import { NotifyPortal, NotifyPortalProps } from './components/portal'
import { NotifyDispatch, NotifyState, NotifyOpts } from './types'
import { getInitialNotifyState, NotifyReducer } from './model/reducer'
import { INotifyContext, NotifyContext } from './context'
import { shallowCompare } from './helpers'

export interface NotifyProviderProps extends Partial<NotifyPortalProps> {
  readonly state?: NotifyState
  readonly dispatch?: NotifyDispatch
  readonly withPortal?: boolean
  readonly children?: React.ReactNode | string
}

/** React Context provider that enables use of `useNotify` hook by child components. */
export function NotifyProvider(props: NotifyProviderProps) {
  const {
    children,
    state = getInitialNotifyState(),
    dispatch,
    withPortal = true,
    ...portalProps
  } = props
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
        const nextNotes = newState.notifications
        const prevNotes = contextProps.state.notifications
        const nextNoteIds: number[] = newState.notifications.map(n => n.uid)
        const prevNoteIds: number[] = contextProps.state.notifications.map(n => n.uid)
        const addNotes = nextNotes.filter((n: NotifyOpts) => prevNoteIds.indexOf(n.uid) === -1)
        const removeNotes = prevNotes.filter((n: NotifyOpts) => nextNoteIds.indexOf(n.uid) === -1)
        setContextProps({ state: newState, dispatch: newDispatch })
        // Trigger notification lifecycles
        addNotes.forEach((note: NotifyOpts) => {
          if (note.onAdd) {
            note.onAdd(note)
          }
        })
        removeNotes.forEach((note: NotifyOpts) => {
          if (note.onRemove) {
            note.onRemove(note)
          }
        })
      }
    },
    [state, contextProps]
  )
  return (
    <NotifyContext.Provider value={contextProps}>
      <Fragment>
        {withPortal ? <NotifyPortal {...portalProps} /> : <Fragment />}
        {children}
      </Fragment>
    </NotifyContext.Provider>
  )
}

export interface NotifyProviderReduxProps extends Partial<NotifyPortalProps> {
  readonly store?: any // NOTE: type omitted to prevent pulling in redux in this file
  readonly withPortal?: boolean
  readonly children?: React.ReactNode | string
}

/**
 * React Redux Context provider that enables use of `useNotify` hook by child
 * components while persisting state in a redux store.
 */
export function NotifyProviderRedux(props: NotifyProviderReduxProps) {
  const { children, store, withPortal } = props
  const [storeState, setStoreState] = useState<any>(store.getState().notifications)
  useEffect(function onInit() {
    // Subscribe to redux store and store function that unsubscribes
    const stopSyncingState = store.subscribe(() => {
      const newState = store.getState()
      // If the notifications have different data
      if (!shallowCompare(storeState, newState.notifications)) {
        // Update the context
        setStoreState(newState.notifications)
      }
    })
    return function onDestroy() {
      stopSyncingState()
    }
  }, [])

  return (
    <NotifyProvider withPortal={withPortal} dispatch={store.dispatch} state={storeState}>
      {children}
    </NotifyProvider>
  )
}
