import React from 'react'
import PropTypes from 'prop-types'
import { NotifyOpts } from '../types'
import { CONSTANTS } from '../constants'
import { Timer, invariant } from '../helpers'
import { NotifyAPI } from '../model/api'
import classNames from 'classnames'

export interface NotifyItemProps {
  id?: string
  key: string
  notification: NotifyOpts
  getStyles: any
  onRemove?: (uid: number) => void
  noAnimation: boolean
  notify: NotifyAPI
  allowHTML: boolean
  children?: React.ReactNode | string
}

export interface NotifyItemState {
  visible?: boolean
  removed: boolean
}

export class NotifyItem extends React.Component<NotifyItemProps, NotifyItemState> {
  static propTypes = {
    notification: PropTypes.object,
    getStyles: PropTypes.object,
    onRemove: PropTypes.func,
    allowHTML: PropTypes.bool,
    noAnimation: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
  }
  static defaultProps = {
    noAnimation: false,
    onRemove: null,
    allowHTML: false
  }
  private _styles: any = {}
  private _notificationTimer?: Timer
  private _height = 0
  private _noAnimation: boolean = false
  private _isMounted = false
  private _removeCount = 0
  private _elementRef = React.createRef<HTMLDivElement>()

  state = {
    visible: undefined,
    removed: false
  }

  componentWillUnmount() {
    const transitionEvent = whichTransitionEvent()
    if (this._elementRef.current !== null) {
      this._elementRef.current.removeEventListener(transitionEvent, this._onTransitionEnd)
    }
    this._isMounted = false
  }
  componentDidMount() {
    const { getStyles, notification, noAnimation } = this.props
    const { byElement } = getStyles
    const level = notification.level
    const dismissible = notification.dismissible
    this._noAnimation = noAnimation
    this._styles = {
      notification: byElement('notification')(level),
      title: byElement('title')(level),
      dismiss: byElement('dismiss')(level),
      messageWrapper: byElement('messageWrapper')(level),
      actionWrapper: byElement('actionWrapper')(level),
      action: byElement('action')(level)
    }
    if (!dismissible || dismissible === 'none' || dismissible === 'button') {
      this._styles.notification.cursor = 'default'
    }
    const transitionEvent = whichTransitionEvent()
    const element = this._elementRef.current
    if (element === null) {
      throw new Error('element not found')
    }
    this._height = element.offsetHeight
    this._isMounted = true

    // Watch for transition end
    if (!this._noAnimation) {
      if (transitionEvent) {
        element.addEventListener(transitionEvent, this._onTransitionEnd)
      } else {
        this._noAnimation = true
      }
    }
    if (notification.autoDismiss) {
      this._notificationTimer = new Timer(() => {
        this._hideNotification()
      }, notification.autoDismiss * 1000)
    }
    this._showNotification()
  }

  //
  // Lifecycle triggers
  //
  private _showNotification() {
    setTimeout(() => {
      if (this._isMounted) {
        this.setState({
          visible: true
        })
      }
    }, 50)
  }

  private _hideNotification() {
    if (this._notificationTimer) {
      this._notificationTimer.clear()
    }

    if (this._isMounted) {
      this.setState({
        visible: false,
        removed: true
      })
    }

    if (this._noAnimation) {
      this._removeNotification()
    }
  }

  private _removeNotification() {
    const { onRemove, notification, notify } = this.props
    invariant(notify, "'notify' API must be passed to NotifyItem components explicitly")
    notify.removeNotification(notification.uid)
    if (onRemove) {
      onRemove(notification ? notification.uid : -1)
    }
  }

  //
  // Calculated CSS styles
  //
  calculateNoteStyle(): React.CSSProperties {
    const { visible, removed } = this.state
    const { getStyles } = this.props
    const notificationStyle = { ...this._styles.notification }
    const cssPosition = this.calculateCSSPosition()
    if (getStyles.overrideStyle) {
      if (!visible && !removed) {
        notificationStyle[cssPosition.property] = cssPosition.value
      }

      if (visible && !removed) {
        notificationStyle.height = this._height
        notificationStyle[cssPosition.property] = 0
      }

      if (removed) {
        notificationStyle.overlay = 'hidden'
        notificationStyle.height = 0
        notificationStyle.marginTop = 0
        notificationStyle.paddingTop = 0
        notificationStyle.paddingBottom = 0
      }
      notificationStyle.opacity = this._styles.notification
        ? visible
          ? this._styles.notification.isVisible.opacity
          : this._styles.notification.isHidden.opacity
        : 0
    }
    return notificationStyle
  }
  calculateCSSPosition() {
    let position = this.props.notification.position
    let css = { property: 'left', value: 0 }

    switch (position) {
      case CONSTANTS.positions.tl:
      case CONSTANTS.positions.bl:
        css = {
          property: 'left',
          value: -200
        }
        break

      case CONSTANTS.positions.tr:
      case CONSTANTS.positions.br:
        css = {
          property: 'right',
          value: -200
        }
        break

      case CONSTANTS.positions.tc:
        css = {
          property: 'top',
          value: -100
        }
        break

      case CONSTANTS.positions.bc:
        css = {
          property: 'bottom',
          value: -100
        }
        break

      default:
    }

    return css
  }

  //
  // Transition events
  //
  private _onTransitionEnd = () => {
    if (this._removeCount > 0) {
      return
    }
    if (this.state.removed) {
      this._removeCount += 1
      this._removeNotification()
    }
  }

  //
  // Input Event Handlers
  //

  private _defaultAction = (event: any) => {
    const { notification } = this.props

    event.preventDefault()
    this._hideNotification()
    if (notification && notification.action) {
      const { callback } = notification.action
      if (callback) {
        callback()
      }
    }
  }

  private _dismiss = () => {
    const { notification } = this.props
    if (!notification || !notification.dismissible) {
      return
    }
    this._hideNotification()
  }

  private _handleMouseEnter = () => {
    const { notification } = this.props
    if (notification.autoDismiss && this._notificationTimer) {
      this._notificationTimer.pause()
    }
  }

  private _handleMouseLeave = () => {
    const { notification } = this.props
    if (notification.autoDismiss && this._notificationTimer) {
      this._notificationTimer.resume()
    }
  }

  private _handleNotificationClick = () => {
    const { notification } = this.props
    const dismissible = notification.dismissible
    if (dismissible === 'both' || dismissible === 'click' || dismissible === true) {
      this._dismiss()
    }
  }

  render() {
    const { visible, removed } = this.state
    const { notification } = this.props
    const canDismiss =
      notification.dismissible === 'both' ||
      notification.dismissible === 'button' ||
      notification.dismissible === true
    const className = classNames(
      'notify',
      'notify-item',
      `notify-${notification.level}`,
      CONSTANTS.testing.itemId(notification.uid),
      {
        'notify-visible': visible,
        'notify-hidden': visible === false,
        'notify-not-dismissable': notification.dismissible === 'none'
      }
    )
    const notificationStyle = this.calculateNoteStyle()
    let dismiss = null
    let actionButton = null
    let title = null
    let message = null

    if (notification.title) {
      title = (
        <h4 className="notify-title" style={this._styles.title}>
          {notification.title}
        </h4>
      )
    }

    if (notification.message) {
      if (this.props.allowHTML) {
        message = (
          <div
            className="notify-message"
            style={this._styles.messageWrapper}
            dangerouslySetInnerHTML={_allowHTML(notification.message)}
          />
        )
      } else {
        message = (
          <div className="notify-message" style={this._styles.messageWrapper}>
            {notification.message}
          </div>
        )
      }
    }
    if (canDismiss) {
      dismiss = (
        <span className="notify-dismiss" onClick={this._dismiss} style={this._styles.dismiss}>
          &times;
        </span>
      )
    }

    if (notification.action) {
      actionButton = (
        <div className="notify-action-wrapper" style={this._styles.actionWrapper}>
          <button
            className="notify-action-button"
            onClick={this._defaultAction}
            style={this._styles.action}
          >
            {notification.action.label}
          </button>
        </div>
      )
    }

    if (notification.children) {
      actionButton = notification.children
    }

    return (
      <div
        ref={this._elementRef}
        data-testid={CONSTANTS.testing.itemId(notification.uid)}
        className={className}
        onClick={this._handleNotificationClick}
        onMouseEnter={this._handleMouseEnter}
        onMouseLeave={this._handleMouseLeave}
        style={notificationStyle}
      >
        {title}
        {message}
        {dismiss}
        {actionButton}
      </div>
    )
  }
}

/* From Modernizr */
function whichTransitionEvent(): string {
  let el = document.createElement('fakeelement')
  let transitions: { [key: string]: string } = {
    transition: 'transitionend',
    OTransition: 'oTransitionEnd',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd'
  }
  let result = 'transitionend'
  Object.keys(transitions).forEach(function(transitionKey: any) {
    if (result === null && el.style[transitionKey] !== undefined) {
      result = transitions[transitionKey]
    }
  })
  return result
}

function _allowHTML(input: any) {
  return { __html: input }
}
