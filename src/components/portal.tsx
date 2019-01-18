import React, { useEffect, useState, RefObject, useRef } from 'react'
import PropTypes from 'prop-types'
import { STYLES } from '../styles'
import {
  NotifyOpts,
  NotifyStyle,
  NotifyState,
  NotifyDispatch,
  NotifyContainersStyle,
  NotifyPosition
} from '../types'
import { CONSTANTS } from '../constants'
import { NotifyContainer } from './container'
import { useNotify } from '../hooks/useNotify'

export interface NotifyPortalProps {
  className?: string
  noAnimation?: boolean
  allowHTML?: boolean
  children?: React.ReactNode | string
  style?: NotifyStyle | false
}

export interface NotifyPortalState {
  notifications: NotifyOpts[]
}

export function NotifyPortal(props: NotifyPortalProps) {
  const {
    className,
    style = {},
    noAnimation = false,
    allowHTML = false,
    children,
    ...passThrough
  } = props
  const [isMounted, setIsMounted] = useState(false)
  const [overrideStyle, setOverrideStyle] = useState<NotifyStyle | null>(null)
  const [overrideWidth, setOverrideWidth] = useState<NotifyStyle | null>(null)
  useEffect(function onInit() {
    if (style !== false) {
      setOverrideStyle(style)
    }
    setIsMounted(true)
    return function onDestroy() {
      setIsMounted(false)
    }
  }, [])
  const { state, api } = useNotify()

  const elements: { [key: string]: string } = {
    notification: 'NotificationItem',
    title: 'Title',
    messageWrapper: 'MessageWrapper',
    dismiss: 'Dismiss',
    action: 'Action',
    actionWrapper: 'ActionWrapper'
  }

  const wrapper = () => {
    if (!overrideStyle) {
      return {}
    }
    return { ...STYLES.Wrapper, ...overrideStyle.Wrapper }
  }

  const container = (position: NotifyPosition) => {
    if (!overrideStyle) {
      return {}
    }
    const override: Partial<NotifyContainersStyle> = overrideStyle.Containers || {}
    let newOverrideWidth = STYLES.Containers.DefaultStyle.width

    if (override.DefaultStyle && override.DefaultStyle.width) {
      newOverrideWidth = override.DefaultStyle.width
    }

    const overridePos = override[position]
    if (overridePos && overridePos.width) {
      newOverrideWidth = overridePos.width
    }

    if (newOverrideWidth !== setOverrideWidth) {
      setOverrideWidth(newOverrideWidth)
    }

    return {
      ...STYLES.Containers.DefaultStyle,
      ...STYLES.Containers[position],
      ...override.DefaultStyle,
      ...override[position]
    }
  }

  const byElement = (element: any) => {
    return (level: string) => {
      const _element = elements[element]
      const override = overrideStyle ? (overrideStyle as any)[_element] || {} : {}
      if (!overrideStyle) {
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
  const _getStyles: any = {
    overrideWidth: overrideWidth,
    overrideStyle: overrideStyle,
    elements: elements,
    // setOverrideStyle: setOverrideStyle,
    wrapper: wrapper,
    container: container,
    byElement: byElement
  }
  let containers = null
  const notifications = state.notifications
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
          notify={api}
          key={position}
          position={position as NotifyPosition}
          notifications={_notifications}
          getStyles={_getStyles}
          noAnimation={noAnimation}
          allowHTML={allowHTML}
        />
      )
    })
  }

  return (
    <div {...passThrough} data-testid={className} style={wrapper()}>
      {containers}
    </div>
  )
}
NotifyPortal.propTypes = {
  style: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  noAnimation: PropTypes.bool,
  allowHTML: PropTypes.bool
}
