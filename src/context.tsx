import React from 'react'
import { NotifyDispatch, NotifyState } from './types'

/**
 * Injected notify context values
 */
export interface INotifyContext {
  readonly state: NotifyState
  readonly dispatch: NotifyDispatch
}

/**
 * Notify context that caries state and a dispatch function for updating state.
 */
export const NotifyContext = React.createContext<INotifyContext | null>(null)
