import { RNSSuccessAction, RNSErrorAction, RNSInfoAction, RNSWarningAction } from '../src'

describe('redux actions', () => {
  it('should set the correct notification level when using convenience class actions', () => {
    expect(new RNSSuccessAction({}).payload.level).toEqual('success')
    expect(new RNSWarningAction({}).payload.level).toEqual('warning')
    expect(new RNSInfoAction({}).payload.level).toEqual('info')
    expect(new RNSErrorAction({}).payload.level).toEqual('error')
  })

  it('accepts custom opts', () => {
    expect(new RNSSuccessAction({ data: { custom: true } }).payload.data.custom).toBe(true)
  })

  it('generates random uid when not provided', () => {
    expect(new RNSSuccessAction({}).payload.uid).toBeDefined()
    expect(new RNSSuccessAction({}).payload.uid).not.toBeFalsy()
  })

  it('sets the custom uid when provided', () => {
    expect(new RNSSuccessAction({ uid: 1 }).payload.uid).toEqual(1)
  })
})
