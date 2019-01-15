import React from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import { NotifyOpts } from '../types'
import { CONSTANTS } from '../constants'
import { Timer } from '../helpers'

export interface NotifyItemProps {
  id?: string
  key: string
  notification: NotifyOpts
  getStyles: any
  onRemove?: (uid: number) => void
  noAnimation: boolean
  allowHTML: boolean
  children?: React.ReactNode | string
}

export interface NotifyItemState {
  visible?: boolean
  removed: boolean
}

export class NotifyItem extends React.Component<NotifyItemProps, NotifyItemState> {
  static defaultProps = {
    noAnimation: false,
    onRemove: null,
    allowHTML: false
  }
  static propTypes = {}
  private _styles: any = {}
  private _notificationTimer?: Timer
  private _height = 0
  private _noAnimation: boolean = false
  private _isMounted = false
  private _removeCount = 0

  state = {
    visible: undefined,
    removed: false
  }

  componentWillMount() {
    let getStyles = this.props.getStyles
    let level = this.props.notification.level
    let dismissible = this.props.notification.dismissible

    this._noAnimation = this.props.noAnimation

    this._styles = {
      notification: getStyles.byElement('notification')(level),
      title: getStyles.byElement('title')(level),
      dismiss: getStyles.byElement('dismiss')(level),
      messageWrapper: getStyles.byElement('messageWrapper')(level),
      actionWrapper: getStyles.byElement('actionWrapper')(level),
      action: getStyles.byElement('action')(level)
    }

    if (!dismissible || dismissible === 'none' || dismissible === 'button') {
      this._styles.notification.cursor = 'default'
    }
  }

  _getCssPropertyByPosition = () => {
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

  _defaultAction = (event: any) => {
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

  _hideNotification = () => {
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

  _removeNotification = () => {
    const { onRemove, notification } = this.props
    // TODO: Make this work. It was in the portal as a weird callback side-effect.
    // this.dispatch(NotifyRemove(uid))
    if (onRemove) {
      onRemove(notification ? notification.uid : -1)
    }
  }

  _dismiss = () => {
    const { notification } = this.props
    if (!notification || !notification.dismissible) {
      return
    }
    this._hideNotification()
  }

  _showNotification = () => {
    setTimeout(() => {
      if (this._isMounted) {
        this.setState({
          visible: true
        })
      }
    }, 50)
  }

  _onTransitionEnd = () => {
    if (this._removeCount > 0) return
    if (this.state.removed) {
      this._removeCount += 1
      this._removeNotification()
    }
  }

  componentDidMount = () => {
    let transitionEvent = whichTransitionEvent()
    let notification = this.props.notification
    let element = findDOMNode(this) as HTMLElement
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

  _handleMouseEnter = () => {
    let notification = this.props.notification
    if (notification.autoDismiss && this._notificationTimer) {
      this._notificationTimer.pause()
    }
  }

  _handleMouseLeave = () => {
    let notification = this.props.notification
    if (notification.autoDismiss && this._notificationTimer) {
      this._notificationTimer.resume()
    }
  }

  _handleNotificationClick = () => {
    let dismissible = this.props.notification.dismissible
    if (dismissible === 'both' || dismissible === 'click' || dismissible === true) {
      this._dismiss()
    }
  }

  componentWillUnmount() {
    let element = findDOMNode(this) as HTMLElement

    let transitionEvent = whichTransitionEvent()
    element.removeEventListener(transitionEvent, this._onTransitionEnd)
    this._isMounted = false
  }

  render() {
    let notification = this.props.notification
    let className = `notification notification-${notification.level} notify-item`
    let notificationStyle = { ...this._styles.notification }
    let cssByPos = this._getCssPropertyByPosition()
    let dismiss = null
    let actionButton = null
    let title = null
    let message = null

    if (this.state.visible) {
      className += ' notification-visible'
    } else if (this.state.visible === false) {
      className += ' notification-hidden'
    }

    if (notification.dismissible === 'none') {
      className += ' notification-not-dismissible'
    }

    if (this.props.getStyles.overrideStyle) {
      if (!this.state.visible && !this.state.removed) {
        notificationStyle[cssByPos.property] = cssByPos.value
      }

      if (this.state.visible && !this.state.removed) {
        notificationStyle.height = this._height
        notificationStyle[cssByPos.property] = 0
      }

      if (this.state.removed) {
        notificationStyle.overlay = 'hidden'
        notificationStyle.height = 0
        notificationStyle.marginTop = 0
        notificationStyle.paddingTop = 0
        notificationStyle.paddingBottom = 0
      }
      notificationStyle.opacity = this.state.visible
        ? this._styles.notification.isVisible.opacity
        : this._styles.notification.isHidden.opacity
    }

    if (notification.title) {
      title = (
        <h4 className="notification-title" style={this._styles.title}>
          {notification.title}
        </h4>
      )
    }

    if (notification.message) {
      if (this.props.allowHTML) {
        message = (
          <div
            className="notification-message"
            style={this._styles.messageWrapper}
            dangerouslySetInnerHTML={_allowHTML(notification.message)}
          />
        )
      } else {
        message = (
          <div className="notification-message" style={this._styles.messageWrapper}>
            {notification.message}
          </div>
        )
      }
    }
    if (
      notification.dismissible === 'both' ||
      notification.dismissible === 'button' ||
      notification.dismissible === true
    ) {
      dismiss = (
        <span className="notification-dismiss" onClick={this._dismiss} style={this._styles.dismiss}>
          &times;
        </span>
      )
    }

    if (notification.action) {
      actionButton = (
        <div className="notification-action-wrapper" style={this._styles.actionWrapper}>
          <button
            className="notification-action-button"
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

if (process.env.NODE_ENV !== 'production') {
  NotifyItem.propTypes = {
    notification: PropTypes.object,
    getStyles: PropTypes.object,
    onRemove: PropTypes.func,
    allowHTML: PropTypes.bool,
    noAnimation: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
  }
}
