import { NotifyReducer, NotifyHide, NotifySuccess, NotifyClear } from './../src'

describe('reducer', () => {
  it('initializes state with an array', () => {
    expect(NotifyReducer()).toEqual([])
  })

  it('stores the notification to state', () => {
    const action = NotifySuccess({})
    const state = NotifyReducer([], action)

    expect(state.length).toBe(1)
  })

  it('stores and removes notification', () => {
    const uid = 1

    const state = NotifyReducer([], NotifySuccess({ uid }))
    expect(state.length).toBe(1)

    const newState = NotifyReducer(state, NotifyHide(uid))
    expect(newState.length).toBe(0)
  })

  it('removes all notifications', () => {
    const state = NotifyReducer([], NotifySuccess({ uid: 1 }))
    const newState = NotifyReducer(state, NotifySuccess({ uid: 2 }))
    const emptyState = NotifyReducer(newState, NotifyClear())
    expect(newState.length).toBe(2)
    expect(emptyState.length).toBe(0)
  })
})
