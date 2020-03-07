## [4.1.1](https://github.com/justindujardin/rns-redux/compare/v4.1.0...v4.1.1) (2020-03-07)


### Bug Fixes

* **npm:** undo package.json cp ([fa37632](https://github.com/justindujardin/rns-redux/commit/fa37632))

# [4.1.0](https://github.com/justindujardin/rns-redux/compare/v4.0.1...v4.1.0) (2020-03-07)


### Features

* update to react 16.13.0 ([7f36f23](https://github.com/justindujardin/rns-redux/commit/7f36f23))

## [4.0.1](https://github.com/justindujardin/rns-redux/compare/v4.0.0...v4.0.1) (2019-02-04)


### Bug Fixes

* basic project usage readme ([822b29d](https://github.com/justindujardin/rns-redux/commit/822b29d))

# [4.0.0](https://github.com/justindujardin/rns-redux/compare/v3.2.2...v4.0.0) (2019-02-01)


### Bug Fixes

* **container:** issue where container did not go away with notification ([56dada4](https://github.com/justindujardin/rns-redux/commit/56dada4))


### BREAKING CHANGES

* **container:** NotifyHide is removed

## [3.2.2](https://github.com/justindujardin/rns-redux/compare/v3.2.1...v3.2.2) (2019-01-16)


### Bug Fixes

* **css:** render container classname based on position for styling ([5223de4](https://github.com/justindujardin/rns-redux/commit/5223de4))
* change css classnames to notify-* ([1fb20a9](https://github.com/justindujardin/rns-redux/commit/1fb20a9))

## [3.2.1](https://github.com/justindujardin/rns-redux/compare/v3.2.0...v3.2.1) (2019-01-16)


### Bug Fixes

* **NotifyReducer:** put default init and assertions in reducer ([3e2a96d](https://github.com/justindujardin/rns-redux/commit/3e2a96d))
* **redux:** move notification lifecycle effects into provider ([4ed090a](https://github.com/justindujardin/rns-redux/commit/4ed090a))

# [3.2.0](https://github.com/justindujardin/rns-redux/compare/v3.1.1...v3.2.0) (2019-01-16)


### Features

* **NotifyProvider:** add "withPortal" boolean prop ([0023bcc](https://github.com/justindujardin/rns-redux/commit/0023bcc))

## [3.1.1](https://github.com/justindujardin/rns-redux/compare/v3.1.0...v3.1.1) (2019-01-16)


### Bug Fixes

* merge conflicting uid notifications together ([768790e](https://github.com/justindujardin/rns-redux/commit/768790e))

# [3.1.0](https://github.com/justindujardin/rns-redux/compare/v3.0.1...v3.1.0) (2019-01-16)


### Features

* export `useNotify` and friends ([b5c986d](https://github.com/justindujardin/rns-redux/commit/b5c986d))

## [3.0.1](https://github.com/justindujardin/rns-redux/compare/v3.0.0...v3.0.1) (2019-01-16)


### Bug Fixes

* trim dead code and fix changelog ([3e9ac14](https://github.com/justindujardin/rns-redux/commit/3e9ac14))

# [3.0.0](https://github.com/justindujardin/rns-redux/compare/v2.0.2...v3.0.0) (2019-01-16)


### Features

* NotifyProvider can accept custom state and dispatch functions. ([7ea188d](https://github.com/justindujardin/rns-redux/commit/7ea188d))
* **reducer:** add actions for separately hiding and showing notifications ([1163865](https://github.com/justindujardin/rns-redux/commit/1163865))
* add `useNotify` hook and `NotifyContext` ([b73da9c](https://github.com/justindujardin/rns-redux/commit/b73da9c))
* add initial import of react-notification-system ([64a9291](https://github.com/justindujardin/rns-redux/commit/64a9291))
* convert react-notification-system to typescript as a built-in ([52eec1e](https://github.com/justindujardin/rns-redux/commit/52eec1e))


### BREAKING CHANGES

* removes compatibility with React versions less than 16.8-alpha

 - See the original react-notification-system for older versions: https://github.com/igorprado/react-notification-system

## [2.0.2](https://github.com/justindujardin/rns-redux/compare/v2.0.1...v2.0.2) (2019-01-13)


### Bug Fixes

* allow passing through props to notification system ([d808fb3](https://github.com/justindujardin/rns-redux/commit/d808fb3))

## [2.0.1](https://github.com/justindujardin/rns-redux/compare/v2.0.0...v2.0.1) (2019-01-12)


### Bug Fixes

* exclude react and friends from our output bundles ([7bafb9e](https://github.com/justindujardin/rns-redux/commit/7bafb9e))

# [2.0.0](https://github.com/justindujardin/rns-redux/compare/v1.0.3...v2.0.0) (2019-01-12)


### Features

* refactor actions from classes to functions that return objects ([9185445](https://github.com/justindujardin/rns-redux/commit/9185445))


### BREAKING CHANGES

* public API names refactored

The format used to include an RNS prefix and an Action suffix, i.e. "RNS{NAME}Action". Now it only includes a prefix: "Notify{Name}" Here are a few examples
 - RNSShowAction -> NotifyShow
 - RNSHideAction -> NotifyHide
 - RNSErrorAction -> NotifyError
 - RNSOpts -> NotifyOpts
 - RNSComponent -> NotifyComponent

## [1.0.3](https://github.com/justindujardin/rns-redux/compare/v1.0.2...v1.0.3) (2019-01-11)


### Bug Fixes

* attempt to create CHANGELOG.md ([c8fe3f6](https://github.com/justindujardin/rns-redux/commit/c8fe3f6))
* update peerDependencies for react 16.8-alpha ([b2689ef](https://github.com/justindujardin/rns-redux/commit/b2689ef))
