export type NotifyLevel = 'success' | 'warning' | 'error' | 'info'

export interface NotifyOpts {
  uid: string | number
  level?: NotifyLevel
  title: string
  message: string
  position: string
  autoDismiss: number
  dismissible?: boolean
  action: {
    label: string
    callback: () => void
  }
  onRemove?: () => void
  data?: any
}

/* istanbul ignore next */
/**
 * This exploits Typescript's control flow analysis to do exhaustive pattern
 * matching on switch statements that have tagged union types being switched
 * on.
 *
 * This is useful for prevent access errors and ensuring all cases are considered
 * when adding new features.
 */
export function exhaustiveCheck(_action: never) {
  // MAGIC!
}
