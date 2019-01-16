// The types in this file are based on the DefinitelyTyped RNS file by:
// - Giedrius Grabauskas <https://github.com/GiedriusGrabauskas>
// - Deividas Bakanas <https://github.com/DeividasBakanas>
// - Karol Janyst <https://github.com/LKay>
// - Bartosz Szewczyk <https://github.com/sztobar>

export type NotifyLevel = 'success' | 'warning' | 'error' | 'info'

export type NotifyPosition = 'tl' | 'tr' | 'tc' | 'bl' | 'br' | 'bc'

export type NotifyDismissable = 'button' | 'both' | 'none' | 'click' | boolean

export type NotifyCallback = (notification: NotifyOpts) => void

export interface NotifyOpts {
  title?: string | JSX.Element
  message?: string | JSX.Element
  level?: NotifyLevel
  position?: NotifyPosition
  autoDismiss?: number
  dismissible?: NotifyDismissable
  action?: NotifyAction
  children?: React.ReactNode
  onAdd?: NotifyCallback
  onRemove?: NotifyCallback
  hidden?: boolean
  uid: number
  data?: any
}

export interface NotifyAction {
  label: string
  callback?: () => void
}

export interface NotifyContainersStyle {
  DefaultStyle: React.CSSProperties
  tl?: React.CSSProperties
  tr?: React.CSSProperties
  tc?: React.CSSProperties
  bl?: React.CSSProperties
  br?: React.CSSProperties
  bc?: React.CSSProperties
}

export interface NotifyItemStyle {
  DefaultStyle?: React.CSSProperties
  success?: React.CSSProperties
  error?: React.CSSProperties
  warning?: React.CSSProperties
  info?: React.CSSProperties
}

export interface NotifyWrapperStyle {
  DefaultStyle?: React.CSSProperties
}

export interface NotifyStyle {
  Wrapper?: any
  Containers?: NotifyContainersStyle
  NotificationItem?: NotifyItemStyle
  Title?: NotifyItemStyle
  MessageWrapper?: NotifyWrapperStyle
  Dismiss?: NotifyItemStyle
  Action?: NotifyItemStyle
  ActionWrapper?: NotifyWrapperStyle
}

export interface NotifyDispatch {
  <T>(action: T): T
  (action: any): any
}

export interface NotifyState {
  notifications: NotifyOpts[]
}
