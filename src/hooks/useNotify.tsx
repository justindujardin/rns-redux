import { NotifyContext } from '../context'
import { useContext, useState, useEffect } from 'react'
import { NotifyAPI } from '../model/api'
import { NotifyState, NotifyDispatch } from '../types'

export interface INotifyContext {
  state: NotifyState
  dispatch: NotifyDispatch
  api: NotifyAPI
}

/** Return the notify API for use in components */
export function useNotify(): INotifyContext {
  const context = useContext(NotifyContext)
  if (!context) {
    throw new Error(
      'NotifyContext is not available for use in this component. ' +
        'Try including <NotifyProvider/> near the root of your application'
    )
  }
  const { state, dispatch } = context
  const [instance, setInstance] = useState<NotifyAPI>(new NotifyAPI(state, dispatch))
  useEffect(
    function onContextChanged() {
      setInstance(new NotifyAPI(state, dispatch))
    },
    [state, dispatch]
  )
  return {
    state,
    dispatch,
    api: instance
  }
}
