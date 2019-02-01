import { NotifyOpts, NotifyPosition } from './types'

export interface IConstants {
  notification: Partial<NotifyOpts>
  testing: {
    containerTestId: (position: NotifyPosition) => string
    portalTestId: string
    itemTestId: string
    itemId: (id: number) => string
  }
  positions: {
    [key: string]: NotifyPosition
  }
  [key: string]: any
}
export const CONSTANTS: IConstants = {
  // Positions
  positions: {
    tl: 'tl',
    tr: 'tr',
    tc: 'tc',
    bl: 'bl',
    br: 'br',
    bc: 'bc'
  },

  // Levels
  levels: {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info'
  },

  // Notification defaults
  notification: {
    title: '',
    message: '',
    position: 'tr',
    autoDismiss: 5,
    dismissible: 'both',
    action: undefined
  },

  testing: {
    containerTestId: (position: NotifyPosition) => `notify-container-${position}`,
    portalTestId: 'notify-portal',
    itemTestId: 'notify-item',
    itemId: (id: number) => `notify-item-${id}`
  }
}
