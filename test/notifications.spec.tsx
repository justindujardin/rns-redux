import './fixture'
import React from 'react'
import sinon from 'sinon'
import { RNSComponent, RNSReducer } from '../src'
import NotifySystem from 'react-notification-system'
import { mount } from 'enzyme'

function timeout(ms: number): Promise<void> {
  return new Promise<void>(function promiseTimeout(resolve) {
    setTimeout(() => {
      resolve(undefined)
    }, ms)
  })
}

describe('NotificationsComponent', () => {
  const notification = {
    title: "Hey, it's good to see you!",
    message: 'Now you can see how easy it is to use notifications in React!',
    dismissible: false,
    level: 'info',
    uid: 'demo-uid',
    autoDismiss: 5
  }

  const mountComponent = (props = {}, noDispatch = false) => {
    const defaults = {
      dispatch: () => undefined
    }
    const mixins: any = noDispatch ? { ...props } : { ...defaults, ...props }
    return mount(<RNSComponent notifications={[]} {...mixins} />, {
      attachTo: window.document.getElementById('root')
    })
  }
  beforeEach(() => {
    const div = document.createElement('div')
    div.id = 'root'
    document.body.appendChild(div)
  })
  afterEach(() => {
    const div = document.getElementById('root')
    if (div) {
      document.body.removeChild(div)
    }
  })

  it('exports the reducer', () => {
    expect(RNSReducer).toBeDefined()
  })

  it('should render one <NotifySystem /> component', () => {
    const wrapper = mountComponent()
    expect(wrapper.find(NotifySystem).length).toBe(1)
  })

  it('should render a single notification', () => {
    const wrapper = mountComponent()

    wrapper.setProps({
      notifications: [notification]
    })

    expect(wrapper.html().indexOf(notification.title)).not.toBe(-1)
    expect(wrapper.html().indexOf(notification.message)).not.toBe(-1)
  })

  it('should not add notification if it already exists based on the uid', () => {
    const wrapper = mountComponent()

    wrapper.setProps({
      notifications: [
        { ...notification, uid: 1, title: '1st' },
        { ...notification, uid: 2, title: '2nd' },
        { ...notification, uid: 3, title: '3rd' },
        { ...notification, uid: 1, title: '4th' },
        { ...notification, uid: 2, title: '5th' },
        { ...notification, uid: 3, title: '6th' }
      ]
    })

    const html = wrapper.html()

    expect(html).toContain('1st')
    expect(html).toContain('2nd')
    expect(html).toContain('3rd')

    expect(html).not.toContain('4th')
    expect(html).not.toContain('5th')
    expect(html).not.toContain('6th')
  })

  it('calls onRemove once the notification is auto dismissed', async () => {
    const wrapper = mountComponent()
    const onRemove = sinon.spy()

    wrapper.setProps({
      notifications: [
        {
          ...notification,
          autoDismiss: 1,
          onRemove
        }
      ]
    })

    await timeout(1100)
    expect(onRemove.called).toBe(true)
  })

  it('calls onRemove once the notification is manually dismissed', async () => {
    const wrapper = mountComponent()
    const onRemove = sinon.spy()
    const onCallback = sinon.spy()

    wrapper.setProps({
      notifications: [
        {
          ...notification,
          autoDismiss: 0,
          action: {
            label: 'Dismiss',
            callback: onCallback
          },
          onRemove
        }
      ]
    })

    wrapper.find('button').simulate('click')

    await timeout(50)
    expect(onCallback.called).toBe(true)
    expect(onRemove.called).toBe(true)
  })

  it('calls onRemove once the notification is auto dismissed while style is false', async () => {
    const wrapper = mountComponent({ style: false })
    const onRemove = sinon.spy()

    wrapper.setProps({
      notifications: [
        {
          ...notification,
          autoDismiss: 1,
          onRemove
        }
      ]
    })

    await timeout(1100)
    expect(onRemove.called).toBe(true)
  })

  it('calls onRemove once the notification is manually dismissed while style is false', async () => {
    const wrapper = mountComponent({ style: false })
    const onRemove = sinon.spy()
    const onCallback = sinon.spy()

    wrapper.setProps({
      notifications: [
        {
          ...notification,
          autoDismiss: 0,
          action: {
            label: 'Dismiss',
            callback: onCallback
          },
          onRemove
        }
      ]
    })

    wrapper.find('button').simulate('click')

    await timeout(50)
    expect(onCallback.called).toBe(true)
    expect(onRemove.called).toBe(true)
  })
})
