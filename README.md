# RNS Redux
[![Greenkeeper badge](https://badges.greenkeeper.io/justindujardin/rns-redux.svg)](https://greenkeeper.io/)
[![Travis](https://img.shields.io/travis/justindujardin/rns-redux.svg)](https://travis-ci.org/justindujardin/rns-redux)
[![Coveralls](https://img.shields.io/coveralls/justindujardin/rns-redux.svg)](https://coveralls.io/github/justindujardin/rns-redux)
[![Dev Dependencies](https://david-dm.org/justindujardin/rns-redux/dev-status.svg)](https://david-dm.org/justindujardin/rns-redux?type=dev)
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)

A reimagining of [React-Notification-System](https://github.com/igorprado/react-notification-system) in Typescript with an API that support React Hooks.

### Usage

Install the library:
```
npm install --save rns-redux
```

Add the `NotifyProvider` near the top of your app. By default this will include a component `NotifyPortal` as a child that will render the notifications. This can be disabled if the NotifyPortal is manually placed elsewhere.

```typescript
<NotifyProvider><YourApp/></NotifyProvider>
```

Under the covers React's `useReducer` API is the default store for notifications state, which is local to the provider component instance.

Show a notification:
```typescript
export function MyHookComponent() {
  const { api } = useNotify()
  api.showNotification({
    level: 'info',
    message: 'hi'
  })
}
```

## Credits

Project starter template by [@alexjoverm](https://twitter.com/alexjoverm)

Thanks to the wonderful people that contribute to this project ([emoji key](https://github.com/all-contributors/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars0.githubusercontent.com/u/101493?v=4" width="100px;" alt="Justin DuJardin"/><br /><sub><b>Justin DuJardin</b></sub>](https://www.justindujardin.com/)<br />[⚠️](https://github.com/justindujardin/rns-redux/commits?author=justindujardin "Tests") [💻](https://github.com/justindujardin/rns-redux/commits?author=justindujardin "Code") [🚇](#infra-justindujardin "Infrastructure (Hosting, Build-Tools, etc)") | [<img src="https://avatars3.githubusercontent.com/u/5701162?v=4" width="100px;" alt="Alex Jover"/><br /><sub><b>Alex Jover</b></sub>](https://github.com/alexjoverm)<br />[🚇](#infra-alexjoverm "Infrastructure (Hosting, Build-Tools, etc)") |
| :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
