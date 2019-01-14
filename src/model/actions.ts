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
export function NotifyShow(payload: Partial<NotifyOpts>, level: NotifyLevel): INotifyShow {
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
export const NotifyHideType = '@hideNotification'
/** Redux action object shape for hiding a notification */
export interface INotifyHide {
  readonly payload: number | string
  readonly type: '@hideNotification'
}
/**
 * Generate a redux {@see Action} object that hides any notification with
 * the given id when dispatched
 */
export function NotifyHide(uid: number | string): INotifyHide {
  return {
    type: NotifyHideType,
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
 * Generate a redux {@see Action} object that clear all notifications when dispatched
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
 * Generate a redux {@see Action} object that clear all notifications when dispatched
 */
export function NotifyEdit(changes: Partial<NotifyOpts>): INotifyEdit {
  return {
    type: NotifyEditType,
    payload: changes
  }
}

/**
 * Generate a redux {@see Action} object shows a notification with the "success"
 * styles applied when dispatched
 */
export function NotifySuccess(payload: Partial<NotifyOpts>) {
  return NotifyShow(payload, 'success')
}
/**
 * Generate a redux {@see Action} object shows a notification with the "error"
 * styles applied when dispatched
 */
export function NotifyError(payload: Partial<NotifyOpts>) {
  return NotifyShow(payload, 'error')
}
/**
 * Generate a redux {@see Action} object shows a notification with the "warning"
 * styles applied when dispatched
 */
export function NotifyWarning(payload: Partial<NotifyOpts>) {
  return NotifyShow(payload, 'warning')
}
/**
 * Generate a redux {@see Action} object shows a notification with the "info"
 * styles applied when dispatched
 */
export function NotifyInfo(payload: Partial<NotifyOpts>) {
  return NotifyShow(payload, 'info')
}

/**
 * Tagged union types (note the convenience functions that set levels are not
 * here because they share an action type with IShowNotification)
 */
export type NotifyActionTypes = INotifyShow | INotifyHide | INotifyEdit | INotifyClear
