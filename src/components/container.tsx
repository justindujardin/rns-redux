import React from 'react'
import PropTypes from 'prop-types'
import { NotifyOpts } from '../types'
import { CONSTANTS } from '../constants'
import { NotifyItem } from './item'

export interface NotifyContainerProps {
  position: string
  notifications: NotifyOpts[]
  getStyles?: any
  onRemove?: (uid: number) => void
  noAnimation?: boolean
  allowHTML?: boolean
  children?: string | React.ReactNode
}

export class NotifyContainer extends React.Component<NotifyContainerProps> {
  static propTypes = {}
  private _style: any

  componentWillMount() {
    const { position, getStyles } = this.props
    // Fix position if width is overrided
    this._style = getStyles.container(position)
    const isCenter = position === CONSTANTS.positions.tc || position === CONSTANTS.positions.bc
    if (getStyles.overrideWidth && isCenter) {
      this._style.marginLeft = -(getStyles.overrideWidth / 2)
    }
  }

  render() {
    const { getStyles, onRemove, noAnimation = false, allowHTML = false, children } = this.props
    if (
      [CONSTANTS.positions.bl, CONSTANTS.positions.br, CONSTANTS.positions.bc].indexOf(
        this.props.position
      ) > -1
    ) {
      this.props.notifications.reverse()
    }

    const notifications = this.props.notifications.map(notification => {
      return (
        <NotifyItem
          ref={'notification-' + notification.uid}
          key={`${notification.uid}`}
          notification={notification}
          getStyles={getStyles}
          onRemove={onRemove}
          noAnimation={noAnimation}
          allowHTML={allowHTML}
          children={children}
        />
      )
    })

    return (
      <div className={'notifications-' + this.props.position} style={this._style}>
        {notifications}
      </div>
    )
  }
}

if (process.env.NODE_ENV !== 'production') {
  NotifyContainer.propTypes = {
    position: PropTypes.string.isRequired,
    notifications: PropTypes.array.isRequired,
    getStyles: PropTypes.object,
    onRemove: PropTypes.func,
    noAnimation: PropTypes.bool,
    allowHTML: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
  }
}
