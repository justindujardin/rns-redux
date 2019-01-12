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
