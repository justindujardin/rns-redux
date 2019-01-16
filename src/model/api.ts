import { NotifyOpts, NotifyState, NotifyDispatch } from '../types'
import { CONSTANTS } from '../constants'
import { NotifyHide, NotifyShow, NotifyEdit, NotifyClear, NotifyRemove } from './actions'
import { invariant } from '../helpers'

export class NotifyAPI {
  constructor(private state: NotifyState, private dispatch: NotifyDispatch) {}

  findNotification(uid: number): NotifyOpts | undefined {
    const notification = this.state.notifications.find((toCheck: NotifyOpts) => {
      if (toCheck.uid === uid) {
        return true
      }
      return false
    })
    return notification
  }

  addNotification(notification: Partial<NotifyOpts>) {
    const draft = { ...CONSTANTS.notification, ...notification } as NotifyOpts
    const { notifications } = this.state
    if (!draft.level) {
      throw new Error('notification level is required.')
    }

    if (Object.keys(CONSTANTS.levels).indexOf(draft.level) === -1) {
      throw new Error("'" + draft.level + "' is not a valid level.")
    }

    if (isNaN(draft.autoDismiss as any)) {
      throw new Error("'autoDismiss' must be a number.")
    }

    const inputPos = draft.position
    if (inputPos && Object.keys(CONSTANTS.positions).indexOf(inputPos) === -1) {
      throw new Error("'" + draft.position + "' is not a valid position.")
    }

    // The RNS library would massage the inputs for you. Let's throw some errors
    // to guide users to conversion to a stricter set of inputs.
    // TODO: Remove all of these assertions, they're only helpful for upgrading.
    if (inputPos !== (inputPos as string).toLowerCase()) {
      throw new Error(`notification position strings must be all lowercase, but found: ${inputPos}`)
    }
    const inputLevel = draft.level.toLowerCase()
    if (inputLevel !== inputLevel.toLowerCase()) {
      throw new Error(
        `invalid "level" value: "${inputLevel}". Valid values are "success", "error", "warning", "info"`
      )
    }
    const inputDismiss = draft.autoDismiss
    if (typeof inputDismiss !== 'number') {
      throw new Error(
        `"autoDismiss" value must be a valid number of milliseconds or 0, but found: ${inputDismiss}`
      )
    }

    // do not add if the notification already exists based on supplied uid
    for (let i = 0; i < notifications.length; i += 1) {
      if (notifications[i].uid === draft.uid) {
        return false
      }
    }
    if (typeof draft.onAdd === 'function') {
      draft.onAdd(draft)
    }
    this.dispatch(NotifyShow(draft))
    return draft
  }

  removeNotification(uid: number): boolean {
    const notification = this.findNotification(uid)
    if (notification) {
      this.dispatch(NotifyHide(uid))
      return true
    }
    return false
  }
  destroyNotification(uid: number): boolean {
    const notification = this.findNotification(uid)
    if (notification) {
      this.dispatch(NotifyRemove(uid))
      if (notification.onRemove) {
        try {
          notification.onRemove(notification)
        } catch (e) {
          console.warn('notification onRemove handler errored', e)
        }
      }
      return true
    }
    return false
  }

  editNotification(uid: number, updatesToMerge: Partial<NotifyOpts>) {
    const notification = this.findNotification(uid)
    if (notification) {
      this.dispatch(NotifyEdit({ uid, ...updatesToMerge }))
    }
  }

  clearNotifications() {
    invariant(this.state.notifications.length > 0, 'cannot clear an empty list')
    this.dispatch(NotifyClear())
  }
}
