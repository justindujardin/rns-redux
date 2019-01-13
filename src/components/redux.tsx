import React from 'react'
import { NotifyPortal } from './portal'
import { Dispatch, Action } from 'redux'
import { NotifyOpts } from '../types'
import { NotifyHide, NotifyActionTypes } from '../model/actions'

export interface NotifyReduxProps<T = any> {
  notifications: NotifyOpts[]
  dispatch?: Dispatch<Action<T>>
}

/**
 * A redux dispatch aware wrapper for Notifications.
 *
 * @deprecated Continue to use this if you need Redux, but it's functionality will be
 * taken over by the base NotifyPortal with a custom dispatcher prop.
 */
export class NotifyRedux<T = {}> extends React.Component<NotifyReduxProps<T>> {
  notify: React.RefObject<any> = React.createRef()
  system(): NotifyPortal {
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

  componentWillReceiveProps<T>(nextProps: Readonly<NotifyReduxProps<T>>) {
    const { notifications } = nextProps
    const notificationIds = notifications.map(notification => notification.uid)
    const systemNotifications = this.system().state.notifications

    if (notifications.length > 0) {
      // Get all active notifications from react-notification-system
      /// and remove all where uid is not found in the reducer
      systemNotifications.forEach(notification => {
        if (notification.uid && notificationIds.indexOf(notification.uid) === -1) {
          this.system().removeNotification(notification.uid)
        }
      })

      notifications.forEach(notification => {
        this.system().addNotification({
          ...notification,
          onRemove: () => {
            if (notification.onRemove) {
              notification.onRemove(notification as any)
            }
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

  shouldComponentUpdate<T>(nextProps: NotifyReduxProps<T>) {
    return this.props !== nextProps
  }

  render() {
    const { notifications, ...rest } = this.props
    return <NotifyPortal ref={this.notify} {...rest} />
  }
}
