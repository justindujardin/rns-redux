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
import { CONSTANTS } from '../constants'

// TODO: The reducer needs to perform all the sanity/default initialization business
// or else plain dispatching of actions will bypass lifecycle events and that logic.
// TODO: NotifyAPI should mostly be a passthrough to dispatch. Custom code in there === BAD :(

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
        const draft = { ...CONSTANTS.notification, ...opts }
        if (!draft.level) {
          throw new Error('notification level is required.')
        }
        if (Object.keys(CONSTANTS.levels).indexOf(draft.level) === -1) {
          throw new Error(`"${draft.level}" is not a valid level.`)
        }
        if (isNaN(draft.autoDismiss as any)) {
          throw new Error(`"autoDismiss" must be a number.`)
        }
        const inputPos = draft.position
        if (inputPos && Object.keys(CONSTANTS.positions).indexOf(inputPos) === -1) {
          throw new Error(`"${draft.position}" is not a valid position.`)
        }
        let found: NotifyOpts | undefined
        const allMinusOverlap = state.notifications.filter((n: NotifyOpts) => {
          if (draft.uid === n.uid) {
            found = n
            return false
          }
          return true
        })
        if (found) {
          return { notifications: [...allMinusOverlap, { ...draft }] }
        }
        return { notifications: [...state.notifications, { ...draft }] }
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
