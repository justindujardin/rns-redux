import { NotifySuccess, NotifyError, NotifyInfo, NotifyWarning } from '../src'

describe('redux actions', () => {
  it('should set the correct notification level when using convenience class actions', () => {
    expect(NotifySuccess({}).payload.level).toEqual('success')
    expect(NotifyWarning({}).payload.level).toEqual('warning')
    expect(NotifyInfo({}).payload.level).toEqual('info')
    expect(NotifyError({}).payload.level).toEqual('error')
  })

  it('accepts custom opts', () => {
    expect(NotifySuccess({ data: { custom: true } }).payload.data.custom).toBe(true)
  })

  it('generates random uid when not provided', () => {
    expect(NotifySuccess({}).payload.uid).toBeDefined()
    expect(NotifySuccess({}).payload.uid).not.toBeFalsy()
  })

  it('sets the custom uid when provided', () => {
    expect(NotifySuccess({ uid: 1 }).payload.uid).toEqual(1)
  })
})
