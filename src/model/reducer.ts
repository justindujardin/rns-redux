import {
  NotifyShowType,
  NotifyHideType,
  NotifyClearType,
  NotifyActionTypes,
  NotifyEditType,
  NotifyRemoveType,
  NotifyHideAllType
} from './actions'
import { NotifyOpts, NotifyState } from '../types'
import { exhaustiveCheck, invariant } from '../helpers'

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
        const opts = action.payload as NotifyOpts
        const found = state.notifications.find(n => n.uid === opts.uid)
        invariant(
          !found,
          `Notification with uid(${
            opts.uid
          }) already exists. Use NotifyEdit action to edit existing notifications.`
        )
        return { notifications: [...state.notifications, { ...opts }] }
      }
      case NotifyHideType: {
        const { payload } = action
        return {
          notifications: state.notifications.map(n => {
            if (n.uid === payload) {
              return {
                ...n,
                hidden: true
              }
            }
            return n
          })
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
      case NotifyRemoveType: {
        const { payload } = action
        return {
          notifications: state.notifications.filter(n => n.uid !== payload)
        }
      }
      case NotifyHideAllType: {
        return {
          notifications: state.notifications.map(n => {
            return {
              ...n,
              hidden: true
            }
          })
        }
      }
      /* istanbul ignore next */
      default: {
        exhaustiveCheck(action)
      }
    }
  }
  return state
}
