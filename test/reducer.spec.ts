import {
  NotifyReducer,
  NotifyHide,
  NotifySuccess,
  NotifyClear,
  getInitialNotifyState,
  NotifyError,
  NotifyEdit
} from './../src'

describe('reducer', () => {
  it('initializes state with an array', () => {
    expect(NotifyReducer()).toEqual({ notifications: [] })
  })

  it('stores the notification to state', () => {
    const action = NotifySuccess({})
    const state = NotifyReducer(getInitialNotifyState(), action)

    expect(state.notifications.length).toBe(1)
  })

  it('adds notifications to state when shown', () => {
    const uid = 1
    const state = NotifyReducer(getInitialNotifyState(), NotifySuccess({ uid }))
    expect(state.notifications.length).toBe(1)
  })

  it('removes notifications with NotifyHide', () => {
    const uid = 1
    const state = NotifyReducer(getInitialNotifyState(), NotifySuccess({ uid }))
    expect(state.notifications.length).toBe(1)
    const newState = NotifyReducer(state, NotifyHide(uid))
    expect(newState.notifications.length).toBe(0)
  })

  it('can edit notifications with NotifyEdit', () => {
    const uid = 1337
    const state = NotifyReducer(getInitialNotifyState(), NotifyError({ message: 'one', uid }))
    expect(state.notifications.length).toBe(1)
    expect(state.notifications[0].message).toBe('one')
    const newState = NotifyReducer(state, NotifyEdit({ uid, message: 'two' }))
    expect(newState.notifications.length).toBe(1)
    expect(newState.notifications[0].message).toBe('two')
  })

  it('clears all notifications with NotifyClear', () => {
    const state = NotifyReducer(getInitialNotifyState(), NotifySuccess({ uid: 1 }))
    const newState = NotifyReducer(state, NotifySuccess({ uid: 2 }))
    const emptyState = NotifyReducer(newState, NotifyClear())
    expect(newState.notifications.length).toBe(2)
    expect(emptyState.notifications.length).toBe(0)
  })
})
