import React, { ComponentProps, ComponentPropsWithRef } from 'react'
import PropTypes from 'prop-types'
import { STYLES } from '../styles'
import { NotifyOpts, NotifyStyle, NotifyState, NotifyDispatch } from '../types'
import { CONSTANTS } from '../constants'
import { NotifyItem } from './item'
import { NotifyContainer } from './container'
import { getInitialNotifyState } from '../model/reducer'

export interface NotifyPortalProps {
  className?: string
  noAnimation?: boolean
  allowHTML?: boolean
  style: NotifyStyle
  state?: NotifyState
  /**
   * A custom dispatch function can be specified in order to integrate with
   * frameworks like Redux. If no dispatcher is specified, the state will
   * be updated using the react `useReducer` hook.
   */
  dispatch?: NotifyDispatch
}

export interface NotifyPortalState {
  notifications: NotifyOpts[]
}

/**
 * This component acts a portal and should be placed in the DOM where your notifications should
 * be rendered. It's usually a good idea to put this near the top of your app.
 */
export class NotifyPortal extends React.Component<NotifyPortalProps, NotifyPortalState> {
  static propTypes = {
    style: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    noAnimation: PropTypes.bool,
    allowHTML: PropTypes.bool
  }

  static defaultProps = {
    style: {},
    noAnimation: false,
    allowHTML: false,
    state: getInitialNotifyState()
  }
  public uid = 3400
  private _isMounted = false
  public overrideWidth = null
  public overrideStyle: any = {}
  public elements: { [key: string]: string } = {
    notification: 'NotificationItem',
    title: 'Title',
    messageWrapper: 'MessageWrapper',
    dismiss: 'Dismiss',
    action: 'Action',
    actionWrapper: 'ActionWrapper'
  }
  private get _getStyles(): any {
    return {
      overrideWidth: this.overrideWidth,
      overrideStyle: this.overrideStyle,
      elements: this.elements,
      setOverrideStyle: this.setOverrideStyle,
      wrapper: this.wrapper,
      container: this.container,
      byElement: this.byElement
    }
  }

  componentDidMount() {
    this.setOverrideStyle(this.props.style)
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  setOverrideStyle = (style: NotifyStyle) => {
    this.overrideStyle = style
  }

  wrapper = () => {
    if (!this.overrideStyle) {
      return {}
    }
    return { ...STYLES.Wrapper, ...this.overrideStyle.Wrapper }
  }

  container = (position: any) => {
    const override = this.overrideStyle.Containers || {}
    if (!this.overrideStyle) {
      return {}
    }

    this.overrideWidth = STYLES.Containers.DefaultStyle.width

    if (override.DefaultStyle && override.DefaultStyle.width) {
      this.overrideWidth = override.DefaultStyle.width
    }

    if (override[position] && override[position].width) {
      this.overrideWidth = override[position].width
    }

    return {
      ...STYLES.Containers.DefaultStyle,
      ...STYLES.Containers[position],
      ...override.DefaultStyle,
      ...override[position]
    }
  }

  byElement = (element: any) => {
    return (level: string) => {
      const _element = this.elements[element]
      const override = this.overrideStyle[_element] || {}
      if (!this.overrideStyle) {
        return {}
      }
      return {
        ...STYLES[_element].DefaultStyle,
        ...STYLES[_element][level],
        ...override.DefaultStyle,
        ...override[level]
      }
    }
  }

  onRemoveComplete = (uid: number) => {
    let notification: NotifyOpts | undefined
    let notifications: NotifyOpts[] = this.state.notifications.filter((toCheck: NotifyOpts) => {
      if (toCheck.uid === uid) {
        notification = toCheck
        return false
      }
      return true
    })

    if (this._isMounted) {
      this.setState({ notifications: notifications })
    }

    if (notification && notification.onRemove) {
      notification.onRemove(notification)
    }
  }

  addNotification = (notification: Partial<NotifyOpts>) => {
    const _notification: NotifyOpts = { ...CONSTANTS.notification, ...notification }
    const notifications = this.state.notifications
    if (!_notification.level) {
      throw new Error('notification level is required.')
    }

    if (Object.keys(CONSTANTS.levels).indexOf(_notification.level) === -1) {
      throw new Error("'" + _notification.level + "' is not a valid level.")
    }

    if (isNaN(_notification.autoDismiss as any)) {
      throw new Error("'autoDismiss' must be a number.")
    }

    const inputPos = _notification.position
    if (inputPos && Object.keys(CONSTANTS.positions).indexOf(inputPos) === -1) {
      throw new Error("'" + _notification.position + "' is not a valid position.")
    }

    // The RNS library would massage the inputs for you. Let's throw some errors
    // to guide users to conversion to a stricter set of inputs.
    // TODO: Remove all of these assertions, they're only helpful for upgrading.
    if (inputPos !== (inputPos as string).toLowerCase()) {
      throw new Error(`notification position strings must be all lowercase, but found: ${inputPos}`)
    }
    const inputLevel = _notification.level.toLowerCase()
    if (inputLevel !== inputLevel.toLowerCase()) {
      throw new Error(
        `invalid "level" value: "${inputLevel}". Valid values are "success", "error", "warning", "info"`
      )
    }
    const inputDismiss = _notification.autoDismiss
    if (typeof inputDismiss !== 'number') {
      throw new Error(
        `"autoDismiss" value must be a valid number of milliseconds or 0, but found: ${inputDismiss}`
      )
    }
    // TODO: reconcile this with model actions that assign a UID
    if (_notification.uid === -1) {
      _notification.uid = this.uid
      this.uid += 1
    }

    // do not add if the notification already exists based on supplied uid
    for (let i = 0; i < notifications.length; i += 1) {
      if (notifications[i].uid === _notification.uid) {
        return false
      }
    }

    notifications.push(_notification)

    if (typeof _notification.onAdd === 'function') {
      _notification.onAdd(_notification)
    }

    this.setState({
      notifications: notifications
    })

    return _notification
  }

  getNotificationRef = (notificationOrUID: NotifyOpts | number): NotifyItem | null => {
    let foundNotification: React.Component<NotifyItem> | null = null
    const notification = notificationOrUID as NotifyOpts
    const uid = notification.uid ? notification.uid : notificationOrUID

    Object.keys(this.refs).forEach(container => {
      if (container.indexOf('container') > -1) {
        const containerRef = this.refs[container] as React.Component<NotifyContainer>
        Object.keys(containerRef.refs).forEach(_notification => {
          if (_notification === 'notification-' + uid) {
            // NOTE: Stop iterating further and return the found notification.
            // Since UIDs are uniques and there won't be another notification found.
            foundNotification = containerRef.refs[_notification] as React.Component<NotifyItem>
          }
        })
      }
    })

    return foundNotification
  }

  removeNotification = (notification: NotifyOpts | number): boolean => {
    const foundNotification = this.getNotificationRef(notification)
    if (foundNotification) {
      foundNotification._hideNotification()
      return true
    }
    return false
  }

  editNotification = (
    notificationOrUID: NotifyOpts | number,
    updatesToMerge: Partial<NotifyOpts>
  ) => {
    let foundNotification: NotifyOpts | null = null
    // NOTE: Find state notification to update by using
    // `setState` and forcing React to re-render the component.
    const notification = notificationOrUID as NotifyOpts
    const uid = notification.uid ? notification.uid : notificationOrUID

    const newNotifications = this.state.notifications.filter(function(stateNotification) {
      if (uid === stateNotification.uid) {
        foundNotification = stateNotification
        return false
      }

      return true
    })

    if (foundNotification !== null) {
      // TODO: The as cast here is unfortunate. TS thinks foundNotifications is never type
      newNotifications.push({ ...(foundNotification as NotifyOpts), ...updatesToMerge })

      this.setState({
        notifications: newNotifications
      })
    }
  }

  clearNotifications = () => {
    Object.keys(this.refs).forEach(container => {
      if (container.indexOf('container') > -1) {
        const containerRef = this.refs[container] as React.Component<NotifyContainer>
        Object.keys(containerRef.refs).forEach(_notification => {
          const notifyItem = containerRef.refs[_notification] as NotifyItem
          notifyItem._hideNotification()
        })
      }
    })
  }

  render() {
    let containers = null
    const { className, allowHTML, noAnimation, children, style, ...passThrough } = this.props
    const notifications = this.state.notifications

    if (notifications.length) {
      // Loop over each position (e.g. "tr" for top-right, "bl" for bottom-left)
      containers = Object.keys(CONSTANTS.positions).map(position => {
        // Filter just the notifications with that position
        const _notifications = notifications.filter(notification => {
          return position === notification.position
        })

        // If there are none, skip it.
        if (!_notifications.length) {
          return null
        }
        // emit a container
        return (
          <NotifyContainer
            ref={'container-' + position}
            key={position}
            position={position}
            notifications={_notifications}
            getStyles={this._getStyles}
            onRemove={this.onRemoveComplete}
            noAnimation={noAnimation}
            allowHTML={allowHTML}
          />
        )
      })
    }

    return (
      <div {...passThrough} data-testid={className} style={this.wrapper()}>
        {containers}
      </div>
    )
  }
}
