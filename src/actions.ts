import { RNSOpts, RNSLevel } from './util'
import { Action } from 'redux'

/**
 * Show a notification with the given options and level.
 */
export class RNSShowAction implements Action {
  private static _uidCount = 0
  static typeId: '@SHOW_NOTIFICATION' = '@SHOW_NOTIFICATION'
  type = RNSShowAction.typeId
  constructor(public payload: Partial<RNSOpts>, level: RNSLevel) {
    this.payload.level = level
    if (!this.payload.uid) {
      this.payload.uid = `notify_${++RNSShowAction._uidCount}`
    }
  }
}

export class RNSHideAction implements Action {
  static typeId: '@HIDE_NOTIFICATION' = '@HIDE_NOTIFICATION'
  type = RNSHideAction.typeId
  constructor(public payload?: string | number) {}
}

export class RNSClearAction implements Action {
  static typeId: '@CLEAR_ALL_NOTIFICIATIONS' = '@CLEAR_ALL_NOTIFICIATIONS'
  type = RNSClearAction.typeId
  payload = null
}

export class RNSSuccessAction extends RNSShowAction {
  constructor(public payload: Partial<RNSOpts>) {
    super(payload, 'success')
  }
}
export class RNSErrorAction extends RNSShowAction {
  constructor(public payload: Partial<RNSOpts>) {
    super(payload, 'error')
  }
}
export class RNSWarningAction extends RNSShowAction {
  constructor(public payload: Partial<RNSOpts>) {
    super(payload, 'warning')
  }
}
export class RNSInfoAction extends RNSShowAction {
  constructor(public payload: Partial<RNSOpts>) {
    super(payload, 'info')
  }
}

/**
 * Tagged union types (note the convenience functions that set levels are not
 * here because they share an action type with RNSShowAction)
 */
export type RNSActionTypes = RNSShowAction | RNSHideAction | RNSClearAction
