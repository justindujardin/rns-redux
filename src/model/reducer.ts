import {
  NotifyShowType,
  NotifyHideType,
  NotifyClearType,
  NotifyActionTypes,
  NotifyEditType
} from './actions'
import { NotifyOpts } from '../types'
import { exhaustiveCheck, invariant } from '../helpers'

export interface NotifyState {
  notifications: NotifyOpts[]
}

/**
 * This is used for DRY and testing.
 * @internal
 */
export function getInitialNotifyState(): NotifyState {
  return { notifications: [] }
}

export function NotifyReducer(
  state: NotifyState = getInitialNotifyState(),
  action?: NotifyActionTypes
): NotifyState {
  if (action) {
    switch (action.type) {
      case NotifyShowType: {
        const ops = action.payload as NotifyOpts
        return { notifications: [...state.notifications, { ...ops }] }
      }
      case NotifyHideType: {
        const { payload } = action
        return {
          notifications: state.notifications.filter(n => n.uid !== payload)
        }
      }
      case NotifyEditType: {
        const { payload } = action
        invariant(payload.uid, `uid is required to edit a notification, but got: ${payload.uid}`)
        let found: NotifyOpts | undefined
        const allExceptEdit = state.notifications.filter((n: NotifyOpts) => {
          if (payload.uid === n.uid) {
            found = n
            return false
          }
          return true
        })
        invariant(found, `cannot edit invalid notification with uid: ${payload.uid}`)
        const updated = { ...found, ...payload } as NotifyOpts
        return { notifications: [...allExceptEdit, updated] }
      }
      case NotifyClearType: {
        return { notifications: [] }
      }
      /* istanbul ignore next */
      default: {
        exhaustiveCheck(action)
      }
    }
  }
  return state
}
