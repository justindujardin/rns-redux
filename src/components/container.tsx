import React from 'react'
import PropTypes from 'prop-types'
import { NotifyOpts, NotifyPosition } from '../types'
import { CONSTANTS } from '../constants'
import { NotifyItem } from './item'
import { NotifyAPI } from '../model/api'

export interface NotifyContainerProps {
  position: NotifyPosition
  notifications: NotifyOpts[]
  getStyles?: any
  onRemove?: (uid: number) => void
  noAnimation?: boolean
  allowHTML?: boolean
  children?: string | React.ReactNode
  notify: NotifyAPI
}

export class NotifyContainer extends React.Component<NotifyContainerProps> {
  static propTypes = {
    position: PropTypes.string.isRequired,
    notifications: PropTypes.array.isRequired,
    getStyles: PropTypes.object,
    onRemove: PropTypes.func,
    noAnimation: PropTypes.bool,
    allowHTML: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
  }
  private _style: any
  private _bottomPositions = [
    CONSTANTS.positions.bl,
    CONSTANTS.positions.br,
    CONSTANTS.positions.bc
  ]

  componentDidMount() {
    const { position, getStyles } = this.props
    // Fix position if width is overridden
    this._style = getStyles.container(position)
    const isCenter = position === CONSTANTS.positions.tc || position === CONSTANTS.positions.bc
    if (getStyles.overrideWidth && isCenter) {
      this._style.marginLeft = -(getStyles.overrideWidth / 2)
    }
  }

  render() {
    const {
      getStyles,
      onRemove,
      noAnimation = false,
      allowHTML = false,
      children,
      notify,
      position
    } = this.props
    // Reverse the render order if the container position is along the bottom of the viewport
    if (this._bottomPositions.indexOf(this.props.position) > -1) {
      this.props.notifications.reverse()
    }
    const containerName = CONSTANTS.testing.containerTestId(position)
    const notifications = this.props.notifications.map(notification => {
      return (
        <NotifyItem
          notify={notify}
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
      <div data-testid={containerName} className={containerName} style={this._style}>
        {notifications}
      </div>
    )
  }
}
