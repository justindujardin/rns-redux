import { RNSShowAction, RNSHideAction, RNSClearAction, RNSActionTypes } from './actions'
import { exhaustiveCheck, RNSOpts } from './util'

export type NotificationsStoreState = RNSOpts[]

export function RNSReducer(
  state: NotificationsStoreState = [],
  action?: RNSActionTypes
): NotificationsStoreState {
  if (action) {
    switch (action.type) {
      case RNSShowAction.typeId: {
        const ops = action.payload as RNSOpts
        return [...state, { ...ops }]
      }
      case RNSHideAction.typeId: {
        const { payload } = action
        return state.filter(notification => notification.uid !== payload)
      }
      case RNSClearAction.typeId: {
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
