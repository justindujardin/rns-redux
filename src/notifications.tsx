import * as React from 'react'
import * as rns from 'react-notification-system'
import { Dispatch, Action } from 'redux'
import { RNSOpts } from './util'
import { RNSHideAction, RNSActionTypes } from './actions'

export interface RNSComponentProps<T = any> {
  notifications: RNSOpts[]
  dispatch?: Dispatch<Action<T>>
}

export class RNSComponent<T = {}> extends React.Component<RNSComponentProps<T>> {
  notify: React.RefObject<any> = React.createRef()
  system(): rns.System {
    return this.notify.current
  }

  getDispatch(): Dispatch<RNSActionTypes> {
    const result = this.context.store ? this.context.store.disaptch : this.props.dispatch
    if (!result) {
      throw new Error(
        'Could not find a redux dispatch function via react context or component props.'
      )
    }
    return result
  }

  componentWillReceiveProps<T>(nextProps: Readonly<RNSComponentProps<T>>) {
    const { notifications } = nextProps
    const notificationIds = notifications.map(notification => notification.uid)
    const systemNotifications = this.system().state.notifications || []

    if (notifications.length > 0) {
      // Get all active notifications from react-notification-system
      /// and remove all where uid is not found in the reducer
      systemNotifications.forEach(notification => {
        if (notificationIds.indexOf(notification.uid) < 0) {
          this.system().removeNotification(notification.uid as string)
        }
      })

      notifications.forEach(notification => {
        this.system().addNotification({
          ...notification,
          onRemove: () => {
            notification.onRemove && notification.onRemove()
            const dispatch = this.getDispatch()
            dispatch(new RNSHideAction(notification.uid))
          }
        } as any)
      })
    }

    if (this.props.notifications !== notifications && notifications.length === 0) {
      this.system().clearNotifications()
    }
  }

  shouldComponentUpdate<T>(nextProps: RNSComponentProps<T>) {
    return this.props !== nextProps
  }

  render() {
    const { notifications, ...rest } = this.props
    const Component = rns
    return <Component ref={this.notify} {...rest} />
  }
}
