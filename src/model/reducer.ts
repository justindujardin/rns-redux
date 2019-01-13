import { NotifyShowType, NotifyHideType, NotifyClearType, NotifyActionTypes } from './actions'
import { NotifyOpts } from '../types'
import { exhaustiveCheck } from '../helpers'

export type NotifyState = NotifyOpts[]

export function NotifyReducer(state: NotifyState = [], action?: NotifyActionTypes): NotifyState {
  if (action) {
    switch (action.type) {
      case NotifyShowType: {
        const ops = action.payload as NotifyOpts
        return [...state, { ...ops }]
      }
      case NotifyHideType: {
        const { payload } = action
        return state.filter(notification => notification.uid !== payload)
      }
      case NotifyClearType: {
        return []
      }
      /* istanbul ignore next */
      default: {
        exhaustiveCheck(action)
      }
    }
  }
  return state
}
