import { NotifyOpts, NotifyLevel } from '../types'

/**
 * REALLY lame unique id generation for notifications that don't provide
 * a value for "uid"
 * @internal
 */
let uidCounter = 0

/** String literal type used for show notification action "type" */
export const NotifyShowType = '@showNotification'
/** Redux action object for showing a notification */
export interface INotifyShow {
  readonly type: '@showNotification'
  readonly payload: Partial<NotifyOpts>
}
/** Show a notification with the given options and level */
export function NotifyShow(payload: Partial<NotifyOpts>, level?: NotifyLevel): INotifyShow {
  if (!level) {
    level = payload.level
  }
  return {
    type: NotifyShowType,
    payload: {
      ...payload,
      // The level is set by the caller
      level,
      // Add a UID if none is present
      uid: payload.uid || ++uidCounter
    }
  }
}

/** String literal type constant for hide notification action "type" member */
export const NotifyRemoveType = '@removeNotification'
/** Redux action object shape for hiding a notification */
export interface INotifyRemove {
  readonly payload: number
  readonly type: '@removeNotification'
}
/**
 * Generate redux-compatible Action object that hides any notification with
 * the given id when dispatched
 */
export function NotifyRemove(uid: number): INotifyRemove {
  return {
    type: NotifyRemoveType,
    payload: uid
  }
}

/** String literal type constant for clear notifications action "type" member */
export const NotifyClearType = '@clearNotifications'
/** Redux action object shape for clearing all notifications */
export interface INotifyClear {
  readonly type: '@clearNotifications'
}
/**
 * Generate redux-compatible Action object that clear all notifications when dispatched
 */
export function NotifyClear(): INotifyClear {
  return {
    type: NotifyClearType
  }
}

/** String literal type constant for edit notification action "type" member */
export const NotifyEditType = '@editNotification'
/** Redux action object shape for edits to a notification */
export interface INotifyEdit {
  readonly type: '@editNotification'
  readonly payload: Partial<NotifyOpts>
}
/**
 * Generate redux-compatible Action object that clear all notifications when dispatched
 */
export function NotifyEdit(changes: Partial<NotifyOpts>): INotifyEdit {
  return {
    type: NotifyEditType,
    payload: changes
  }
}

/**
 * Generate redux-compatible Action object shows a notification with the "success"
 * styles applied when dispatched
 */
export function NotifySuccess(payload: Partial<NotifyOpts>) {
  return NotifyShow(payload, 'success')
}
/**
 * Generate redux-compatible Action object shows a notification with the "error"
 * styles applied when dispatched
 */
export function NotifyError(payload: Partial<NotifyOpts>) {
  return NotifyShow(payload, 'error')
}
/**
 * Generate redux-compatible Action object shows a notification with the "warning"
 * styles applied when dispatched
 */
export function NotifyWarning(payload: Partial<NotifyOpts>) {
  return NotifyShow(payload, 'warning')
}
/**
 * Generate redux-compatible Action object shows a notification with the "info"
 * styles applied when dispatched
 */
export function NotifyInfo(payload: Partial<NotifyOpts>) {
  return NotifyShow(payload, 'info')
}

/**
 * Tagged union types (note the convenience functions that set levels are not
 * here because they share an action type with IShowNotification)
 */
export type NotifyActionTypes = INotifyShow | INotifyRemove | INotifyEdit | INotifyClear
