import { NotifyOpts, NotifyState, NotifyDispatch } from '../types'
import { NotifyShow, NotifyEdit, NotifyClear, NotifyRemove } from './actions'
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

  addNotification(notification: Partial<NotifyOpts>): NotifyOpts {
    this.dispatch(NotifyShow(notification))
    return notification as NotifyOpts
  }

  removeNotification(uid: number): boolean {
    const notification = this.findNotification(uid)
    if (notification) {
      this.dispatch(NotifyRemove(uid))
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
