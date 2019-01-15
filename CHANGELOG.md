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
