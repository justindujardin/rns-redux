import { NotifyContext } from '../context'
import { useContext, useState, useCallback, useEffect } from 'react'
import { NotifyAPI } from '../model/api'

export function useNotify() {
  const context = useContext(NotifyContext)
  if (!context) {
    throw new Error(
      'NotifyContext is not available for use in this component. ' +
        'Try including <NotifyProvider/> near the root of your application'
    )
  }
  const { notify } = context
  const { state, dispatch } = notify
  const [instance, setInstance] = useState<NotifyAPI>(new NotifyAPI(state, dispatch))
  useEffect(
    function onContextChanged() {
      setInstance(new NotifyAPI(state, dispatch))
    },
    [notify, state, dispatch]
  )
  return {
    state,
    dispatch,
    api: instance
  }
}
