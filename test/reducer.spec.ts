import { RNSHideAction, RNSSuccessAction, RNSClearAction } from './../src/actions'
import { RNSReducer } from '../src/reducer'

describe('reducer', () => {
  it('initializes state with an array', () => {
    expect(RNSReducer()).toEqual([])
  })

  it('stores the notification to state', () => {
    const action = new RNSSuccessAction({})
    const state = RNSReducer([], action)

    expect(state.length).toBe(1)
  })

  it('stores and removes notification', () => {
    const uid = 1

    const state = RNSReducer([], new RNSSuccessAction({ uid }))
    expect(state.length).toBe(1)

    const newState = RNSReducer(state, new RNSHideAction(uid))
    expect(newState.length).toBe(0)
  })

  it('removes all notifications', () => {
    const state = RNSReducer([], new RNSSuccessAction({ uid: 1 }))
    const newState = RNSReducer(state, new RNSSuccessAction({ uid: 2 }))
    const emptyState = RNSReducer(newState, new RNSClearAction())
    expect(newState.length).toBe(2)
    expect(emptyState.length).toBe(0)
  })
})
