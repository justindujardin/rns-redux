import React from 'react'
import { render, cleanup } from 'react-testing-library'
import { NotifyProvider } from '../src/context'
import { useNotify } from '../src/hooks/useNotify'
import { testModelContext } from './fixture'

describe('NotifyProvider Component', () => {
  it('throws an error if "useNotify" hook is use outside of <NotifyProvider/>', () => {
    function MissingProviderComponent() {
      expect(() => {
        useNotify()
      }).toThrow()
      return null
    }
    render(<MissingProviderComponent />)
  })
  it('injects context for "useNotify" hook in children', () => {
    const { state, dispatch } = testModelContext()
    let rendered = false
    function MyFunctionComponent() {
      const { state, dispatch } = useNotify()
      expect(state).toEqual({ notifications: [] })
      expect(dispatch).toBeDefined()
      rendered = true
      return <div>cool stuff</div>
    }
    const out = render(
      <NotifyProvider state={state} dispatch={dispatch}>
        <MyFunctionComponent />
      </NotifyProvider>
    )
    expect(out).toBeDefined()
    expect(rendered).toBe(true)
  })
})

afterEach(cleanup)
