import React from 'react'
import { render, cleanup, flushEffects, waitForDomChange, fireEvent } from 'react-testing-library'
import { NotifyPortal, CONSTANTS, NotifyOpts, NotifyPosition, INotifyContext } from '../src'
import { useNotify, IUseNotify } from '../src/hooks/useNotify'
import { NotifyProvider } from '../src/provider'
const { positions, levels } = CONSTANTS
const defaultNotification: Partial<NotifyOpts> = {
  title: 'This is a title',
  message: 'This is a message',
  level: 'success'
}

const style = {
  Containers: {
    DefaultStyle: {
      width: 600
    },

    tl: {
      width: 800
    }
  }
}

function getNote(changes?: Partial<NotifyOpts> | number): NotifyOpts {
  if (typeof changes === 'number') {
    return { ...defaultNotification, uid: changes }
  }
  return { ...defaultNotification, ...(changes || {}) } as NotifyOpts
}

/** Used to match all the notifications by normalizing their individual `notify-{id}` ids into `notify-item` */
function normalizeItemIds(str: string) {
  if (str.indexOf(CONSTANTS.testing.itemTestId) !== -1) {
    return CONSTANTS.testing.itemTestId
  }
  return str
}

function renderNotifications(notifications: Partial<NotifyOpts>[] = []) {
  let notify: IUseNotify | undefined
  function ExtractAPI() {
    notify = useNotify()
    return null
  }
  const root = render(
    <NotifyProvider style={style} allowHTML={true} noAnimation={true}>
      <ExtractAPI />
    </NotifyProvider>
  )
  flushEffects()
  if (!notify) {
    throw new Error('test configuration should not allow this context to be null. check your setup')
  }
  if (notifications.length > 0) {
    for (let i = 0; i < notifications.length; i++) {
      notify.api.addNotification(notifications[i])
    }
    flushEffects()
  }
  return { ...notify, root }
}
beforeEach(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.clearAllTimers()
  cleanup()
})

// let notificationObj: any
// let component: any
// let instance: any

const defaultId = 1337

describe('NotifyAPI', () => {
  it('should execute a callback function on add a notification', () => {
    let added = false
    const note = getNote({
      onAdd: () => (added = true)
    })
    renderNotifications([note])
    expect(added).toBe(true)
  })
})
// describe('NotifyProvider', () => {})
// describe('NotifyContainer', () => {})
describe('NotifyItem', () => {
  xit('should remove a notification after autoDismiss', () => {
    const { root } = renderNotifications([getNote({ uid: defaultId, autoDismiss: 2 })])
    jest.runTimersToTime(3000)
    flushEffects()
    expect(() => root.getByTestId(CONSTANTS.testing.itemId(defaultId))).toThrow()
  })

  it('should dismiss notification on click', () => {
    const { root } = renderNotifications([getNote(defaultId)])
    const selector = CONSTANTS.testing.itemId(defaultId)
    let notification = root.getByTestId(selector)
    fireEvent.click(notification)
    waitForDomChange()
    flushEffects()
    expect(() => root.getByTestId(selector)).toThrow()
  })

  it('should dismiss notification on click of dismiss button', () => {
    const { root } = renderNotifications([getNote(defaultId)])
    const selector = CONSTANTS.testing.itemId(defaultId)
    let notification = root.getByTestId(selector)
    let dismissButton = notification.querySelector('.notification-dismiss') as HTMLButtonElement
    fireEvent.click(dismissButton)
    flushEffects()
    expect(() => root.getByTestId(selector)).toThrow()
  })

  it('should not render title if not provided', () => {
    const notificationObj = getNote(defaultId)
    delete notificationObj.title
    const { root } = renderNotifications([notificationObj])
    const container = root.getByTestId(CONSTANTS.testing.itemId(defaultId))
    expect(container).toBeTruthy()
    expect(container.querySelector('.notification-title')).toBeFalsy()
  })

  it('should omit message elements for empty values', () => {
    const notificationObj = getNote(defaultId)
    delete notificationObj.message
    const { root } = renderNotifications([notificationObj])
    const container = root.getByTestId(CONSTANTS.testing.itemId(defaultId))
    expect(container).toBeTruthy()
    expect(container.querySelector('.notification-message')).toBeFalsy()
  })

  it('should not dismiss the notificaion on click if dismissible is false', () => {
    const note = getNote({ uid: defaultId, dismissible: false })
    const { root } = renderNotifications([note])
    let notification = root.getByTestId(CONSTANTS.testing.itemId(defaultId))
    fireEvent.click(notification)
    expect(root.getByTestId(CONSTANTS.testing.itemId(defaultId))).toBeTruthy()
  })

  it('should not dismiss the notification on click if dismissible is none', () => {
    const note = getNote({ uid: defaultId, dismissible: 'none' })
    const { root } = renderNotifications([note])
    let notification = root.getByTestId(CONSTANTS.testing.itemId(defaultId))
    fireEvent.click(notification)
    expect(root.getByTestId(CONSTANTS.testing.itemId(defaultId))).toBeTruthy()
  })

  it('should not dismiss the notification on click if dismissible is button', () => {
    const note = getNote({ uid: defaultId, dismissible: 'button' })
    const { root } = renderNotifications([note])
    let notification = root.getByTestId(CONSTANTS.testing.itemId(defaultId))
    fireEvent.click(notification)
    expect(root.getByTestId(CONSTANTS.testing.itemId(defaultId))).toBeTruthy()
  })

  it('should render a button if action property is passed', () => {
    const note = getNote({
      uid: defaultId,
      action: {
        label: 'Click me',
        callback: () => null
      }
    })
    const { root } = renderNotifications([note])
    const container = root.getByTestId(CONSTANTS.testing.itemId(defaultId))
    expect(container).toBeTruthy()
    expect(container.querySelector('.notification-action-button')).toBeTruthy()
  })

  it('should execute a callback function when notification button is clicked', () => {
    let clicked = false
    const note = getNote({
      uid: defaultId,
      action: {
        label: 'Click me',
        callback: function() {
          clicked = true
        }
      }
    })
    const { root } = renderNotifications([note])
    const container = root.getByTestId(CONSTANTS.testing.itemId(defaultId))
    const button = container.querySelector('.notification-action-button') as Element
    fireEvent.click(button)
    flushEffects()
    expect(clicked).toBe(true)
  })

  it('should render a children if passed', () => {
    const note = getNote({
      uid: defaultId,
      children: <div className="custom-container" />
    })
    const { root } = renderNotifications([note])
    const notification = root.getByTestId(CONSTANTS.testing.itemId(defaultId))
    let customContainer = notification.querySelector('.custom-container')
    expect(customContainer).not.toBeNull()
  })

  xit('should pause the timer if a notification has a mouse enter', done => {
    const note = getNote({ uid: defaultId, autoDismiss: 1 })
    const { root } = renderNotifications([note])
    const testId = CONSTANTS.testing.itemId(defaultId)
    let notification = root.getByTestId(testId)
    // fireEvent.click(notification)
    // notificationObj.autoDismiss = 2
    // component.addNotification(notificationObj)
    // let notification = findRenderedDOMComponentWithClass(instance, 'notification')
    fireEvent.mouseEnter(notification)
    jest.runTimersToTime(1500)
    expect(root.getByTestId(testId)).not.toBeNull()
    done()
  })

  // it('should resume the timer if a notification has a mouse leave', done => {
  //   notificationObj.autoDismiss = 2
  //   component.addNotification(notificationObj)
  //   let notification = findRenderedDOMComponentWithClass(instance, 'notification')
  //   fireEvent.mouseEnter(notification)
  //   jest.runTimersToTime(800)
  //   fireEvent.mouseLeave(notification)
  //   jest.runTimersToTime(2000)
  //   let _notification = scryRenderedDOMComponentsWithClass(instance, 'notification')
  //   expect(_notification.length).toBe(0)
  //   done()
  // })

  it('should allow HTML inside messages', () => {
    const note = getNote({
      uid: defaultId,
      message: '<strong class="allow-html-strong">Strong</strong>'
    })
    const { root } = renderNotifications([note])
    const testId = CONSTANTS.testing.itemId(defaultId)
    let notification = root.getByTestId(testId)
    let htmlElement = notification.getElementsByClassName('allow-html-strong')
    expect(htmlElement.length).toBe(1)
  })

  it('should render containers with a overrided width', () => {
    const note = getNote({
      uid: defaultId,
      position: 'tc'
    })
    const { root } = renderNotifications([note])
    let notification = root.getByTestId(CONSTANTS.testing.containerTestId('tc')) as HTMLElement
    expect(notification.style.width).toBe('600px')
  })
})

describe('NotifyPortal Component', () => {
  it('throws if used outside of NotifyProvider context', () => {
    expect(() => render(<NotifyPortal />)).toThrow(/Try including <NotifyProvider\/>/)
  })

  it('should be rendered', () => {
    expect(renderNotifications()).toBeTruthy()
    expect(renderNotifications([getNote()])).toBeTruthy()
  })

  it('should render a single notification', () => {
    const { root } = renderNotifications([getNote(defaultId)])
    expect(root.getByTestId(CONSTANTS.testing.itemId(defaultId))).toBeTruthy()
  })

  it('should not set a notification visibility class when the notification is initially added', () => {
    const { root } = renderNotifications([getNote(defaultId)])
    let notification = root.getByTestId(CONSTANTS.testing.itemId(defaultId))
    expect(notification.className).not.toMatch(/notification-hidden/)
    expect(notification.className).not.toMatch(/notification-visible/)
  })

  xit('should set the notification class to visible after added', () => {
    const { root } = renderNotifications([getNote(defaultId)])
    let notification = root.getByTestId(CONSTANTS.testing.itemId(defaultId))
    expect(notification.className).toMatch(/notification/)
    jest.runTimersToTime(400)
    expect(notification.className).toMatch(/notification-visible/)
  })

  it('should render notifications in all positions with all levels', () => {
    const { api, root } = renderNotifications()
    let count = 0
    for (let position of Object.keys(positions)) {
      for (let level of Object.keys(levels)) {
        api.addNotification(
          getNote({
            position: positions[position],
            level: levels[level]
          })
        )
        count++
      }
    }
    flushEffects()

    let containers = []
    // jest.runAllTicks()
    for (let position of Object.keys(positions)) {
      containers.push(
        root.getByTestId(CONSTANTS.testing.containerTestId(position as NotifyPosition))
      )
    }
    containers.forEach(function(container) {
      for (let level of Object.keys(levels)) {
        let notification = container.getElementsByClassName('notification-' + levels[level])
        expect(notification).not.toBeNull()
      }
    })

    let notifications = root.getAllByTestId(CONSTANTS.testing.itemTestId, {
      normalizer: normalizeItemIds
    })
    expect(notifications.length).toBe(count)
  })

  it('should render multiple notifications', () => {
    const toAdd: NotifyOpts[] = []
    for (let i = 1; i <= 10; i++) {
      toAdd.push(getNote())
    }
    const { root } = renderNotifications(toAdd)
    let notifications = root.container.querySelectorAll('.notification')
    expect(notifications.length).toBe(10)
  })

  // it('should not render notifications with the same uid', () => {
  //   notificationObj.uid = 500
  //   component.addNotification(notificationObj)
  //   component.addNotification(notificationObj)
  //   let notification = scryRenderedDOMComponentsWithClass(instance, 'notification')
  //   expect(notification.length).toBe(1)
  // })

  // it('should remove a notification using returned object', done => {
  //   let notificationCreated = component.addNotification(defaultNotification) as NotifyOpts
  //   expect(notificationCreated).not.toBe(false)
  //   let notification = scryRenderedDOMComponentsWithClass(instance, 'notification')
  //   expect(notification.length).toBe(1)

  //   component.removeNotification(notificationCreated)
  //   jest.runTimersToTime(1000)
  //   let notificationRemoved = scryRenderedDOMComponentsWithClass(instance, 'notification')
  //   expect(notificationRemoved.length).toBe(0)
  //   done()
  // })

  // it('should remove a notification using uid', done => {
  //   let notificationCreated = component.addNotification(defaultNotification) as NotifyOpts
  //   let notification = scryRenderedDOMComponentsWithClass(instance, 'notification')
  //   expect(notification.length).toBe(1)

  //   component.removeNotification(notificationCreated.uid)
  //   jest.runTimersToTime(200)
  //   let notificationRemoved = scryRenderedDOMComponentsWithClass(instance, 'notification')
  //   expect(notificationRemoved.length).toBe(0)
  //   done()
  // })

  // it('should edit an existing notification using returned object', done => {
  //   const notificationCreated = component.addNotification(defaultNotification) as NotifyOpts
  //   const notification = scryRenderedDOMComponentsWithClass(instance, 'notification')
  //   expect(notification.length).toBe(1)

  //   const newTitle = 'foo'
  //   const newContent = 'foobar'

  //   component.editNotification(notificationCreated, { title: newTitle, message: newContent })
  //   jest.runTimersToTime(1000)
  //   const notificationEdited = findRenderedDOMComponentWithClass(instance, 'notification')
  //   expect(notificationEdited.getElementsByClassName('notification-title')[0].textContent).toBe(
  //     newTitle
  //   )
  //   expect(notificationEdited.getElementsByClassName('notification-message')[0].textContent).toBe(
  //     newContent
  //   )
  //   done()
  // })

  // it('should edit an existing notification using uid', done => {
  //   const notificationCreated = component.addNotification(defaultNotification) as NotifyOpts
  //   const notification = scryRenderedDOMComponentsWithClass(instance, 'notification')
  //   expect(notification.length).toBe(1)

  //   const newTitle = 'foo'
  //   const newContent = 'foobar'

  //   component.editNotification(notificationCreated.uid, { title: newTitle, message: newContent })
  //   jest.runTimersToTime(1000)
  //   const notificationEdited = findRenderedDOMComponentWithClass(instance, 'notification')
  //   expect(notificationEdited.getElementsByClassName('notification-title')[0].textContent).toBe(
  //     newTitle
  //   )
  //   expect(notificationEdited.getElementsByClassName('notification-message')[0].textContent).toBe(
  //     newContent
  //   )
  //   done()
  // })

  it('should remove all notifications', () => {
    const { api, root } = renderNotifications([
      getNote({ uid: 1 }),
      getNote({ uid: 2 }),
      getNote({ uid: 3 })
    ])
    root.getByTestId(CONSTANTS.testing.itemId(1))
    root.getByTestId(CONSTANTS.testing.itemId(2))
    root.getByTestId(CONSTANTS.testing.itemId(3))
    api.clearNotifications()
    flushEffects()

    expect(() => root.getByTestId(CONSTANTS.testing.itemId(1))).toThrow()
    expect(() => root.getByTestId(CONSTANTS.testing.itemId(2))).toThrow()
    expect(() => root.getByTestId(CONSTANTS.testing.itemId(3))).toThrow()
  })

  it('should accept an action without callback function defined', () => {
    const note = getNote({
      uid: defaultId,
      action: {
        label: 'Click me'
      }
    })
    const { root } = renderNotifications([note])
    const notification = root.getByTestId(CONSTANTS.testing.itemId(defaultId))
    let button = notification.querySelector('.notification-action-button') as HTMLButtonElement
    fireEvent.click(button)
    flushEffects()
    expect(() => root.getByTestId(CONSTANTS.testing.itemId(defaultId))).toThrow()
  })

  it('should execute a callback function on remove a notification', () => {
    let removed = false
    const note = getNote({
      uid: defaultId,
      onRemove: () => {
        removed = true
      }
    })
    const { root } = renderNotifications([note])
    const notification = root.getByTestId(CONSTANTS.testing.itemId(defaultId))
    fireEvent.click(notification)
    flushEffects()
    expect(removed).toBe(true)
  })

  xit('should render a notification with specific style based on position', () => {
    const note = getNote({ position: 'bc' })
    const { root } = renderNotifications([note])
    let notification = root.getByTestId(CONSTANTS.testing.containerTestId('bc')) as HTMLElement
    let bottomPosition = notification.style.bottom
    expect(bottomPosition).toBe('-100px')
  })

  // it('should render containers with a overrided width for a specific position', done => {
  //   notificationObj.position = 'tl'
  //   component.addNotification(notificationObj)
  //   let notification = findRenderedDOMComponentWithClass(
  //     instance,
  //     'notifications-tl'
  //   ) as HTMLElement
  //   let width = notification.style.width
  //   expect(width).toBe('800px')
  //   done()
  // })

})
