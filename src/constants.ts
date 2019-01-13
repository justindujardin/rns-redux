import { NotifyOpts } from './types'

export interface IConstants {
  notification: NotifyOpts
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
    uid: -1,
    title: '',
    message: '',
    position: 'tr',
    autoDismiss: 5,
    dismissible: 'both',
    action: undefined
  }
}
