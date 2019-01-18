import { NotifyContext, INotifyContext } from '../context'
import { useContext, useState, useEffect } from 'react'
import { NotifyAPI } from '../model/api'

/**
 * Notify context with an `api` property that points to a configured
 * {@link NotifyAPI} instance.
 */
export interface IUseNotify extends INotifyContext {
  api: NotifyAPI
}

/** Return the {@link IUseNotify} API for use in components */
export function useNotify(): IUseNotify {
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
