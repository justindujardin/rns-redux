import {
  NotifyReducer,
  NotifyHide,
  NotifySuccess,
  NotifyClear,
  getInitialNotifyState,
  NotifyError,
  NotifyEdit,
  NotifyState,
  NotifyShow
} from './../src'

const defaultId = 1212
function singleNotification(): NotifyState {
  const showAction = NotifyShow({ uid: defaultId }, 'info')
  return NotifyReducer(getInitialNotifyState(), showAction)
}

describe('reducer', () => {
  it('initializes state with no notifications', () => {
    const state = NotifyReducer()
    expect(state.notifications.length).toBe(0)
  })

  describe('NotifyShow', () => {
    it('adds notitifications to state', () => {
      const action = NotifySuccess({})
      const state = NotifyReducer(getInitialNotifyState(), action)
      expect(state.notifications.length).toBe(1)
    })
    it('throws and suggest using edit action if given an existing uid', () => {
      const state = singleNotification()
      expect(() => {
        NotifyReducer(state, NotifySuccess({ uid: defaultId }))
      }).toThrow(/Use NotifyEdit action/)
    })
  })
  describe('NotifyHide', () => {
    it('marks notifications as hidden but does not remove them', () => {
      const state = singleNotification()
      const newState = NotifyReducer(state, NotifyHide(defaultId))
      const notification = newState.notifications[0]
      expect(notification).toBeTruthy()
      expect(notification.hidden).toBe(true)
    })
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

  describe('NotifyHide', () => {
    it('marks notifications with hidden=true', () => {
      const uid = 1
      const state = NotifyReducer(getInitialNotifyState(), NotifySuccess({ uid }))
      expect(state.notifications.length).toBe(1)
      const newState = NotifyReducer(state, NotifyHide(uid))
      expect(newState.notifications[0].hidden).toBe(true)
    })
  })

  describe('NotifyEdit', () => {
    it('throws on invalid inputs', () => {
      const state = NotifyReducer(
        getInitialNotifyState(),
        NotifyError({ message: 'one', uid: 1337 })
      )
      expect(() => NotifyReducer(state, NotifyEdit({ uid: undefined }))).toThrow()
      expect(() => NotifyReducer(state, NotifyEdit({ uid: -1 }))).toThrow()
    })
    it('edits notifications data', () => {
      const uid = 1337
      const state = NotifyReducer(getInitialNotifyState(), NotifyError({ message: 'one', uid }))
      expect(state.notifications.length).toBe(1)
      expect(state.notifications[0].message).toBe('one')
      const newState = NotifyReducer(state, NotifyEdit({ uid, message: 'two' }))
      expect(newState.notifications.length).toBe(1)
      expect(newState.notifications[0].message).toBe('two')
    })
  })

  it('clears all notifications with NotifyClear', () => {
    const state = NotifyReducer(getInitialNotifyState(), NotifySuccess({ uid: 1 }))
    const newState = NotifyReducer(state, NotifySuccess({ uid: 2 }))
    const emptyState = NotifyReducer(newState, NotifyClear())
    expect(newState.notifications.length).toBe(2)
    expect(emptyState.notifications.length).toBe(0)
  })
})
