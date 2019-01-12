import React from 'react'
import ReactNotificationSystem, { System } from 'react-notification-system'
import { Dispatch, Action } from 'redux'
import { NotifyOpts } from './util'
import { NotifyHide, NotifyActionTypes } from './redux/actions'

export interface NotifyComponentProps<T = any> {
  notifications: NotifyOpts[]
  dispatch?: Dispatch<Action<T>>
}

export class NotifyComponent<T = {}> extends React.Component<NotifyComponentProps<T>> {
  notify: React.RefObject<any> = React.createRef()
  system(): System {
    return this.notify.current
  }

  getDispatch(): Dispatch<NotifyActionTypes> {
    const result = this.context.store ? this.context.store.disaptch : this.props.dispatch
    if (!result) {
      throw new Error(
        'Could not find a redux dispatch function via react context or component props.'
      )
    }
    return result
  }

  componentWillReceiveProps<T>(nextProps: Readonly<NotifyComponentProps<T>>) {
    const { notifications } = nextProps
    const notificationIds = notifications.map(notification => notification.uid)
    const systemNotifications = this.system().state.notifications

    if (notifications.length > 0) {
      // Get all active notifications from react-notification-system
      /// and remove all where uid is not found in the reducer
      systemNotifications.forEach(notification => {
        if (notification.uid && notificationIds.indexOf(notification.uid) === -1) {
          this.system().removeNotification(notification.uid as string)
        }
      })

      notifications.forEach(notification => {
        this.system().addNotification({
          ...notification,
          onRemove: () => {
            notification.onRemove && notification.onRemove()
            const dispatch = this.getDispatch()
            dispatch(NotifyHide(notification.uid))
          }
        } as any)
      })
    }

    if (this.props.notifications !== notifications && notifications.length === 0) {
      this.system().clearNotifications()
    }
  }

  shouldComponentUpdate<T>(nextProps: NotifyComponentProps<T>) {
    return this.props !== nextProps
  }

  render() {
    const { notifications, ...rest } = this.props
    return <ReactNotificationSystem ref={this.notify} {...rest} />
  }
}
