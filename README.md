# vile-eclint

A [Vile](http://vile.io) plugin for tracking [EditorConfig](http://editorconfig.org) violations and errors (via [ECLint](https://github.com/jedmao/eclint)).

## Requirements

- [Node.js](http://nodejs.org)

## Installation

    npm i -D vile vile-eclint

## Config

`eclint` uses your `.editorconfig` file in the `cwd`.

## Ingore

`vile.ignore` is used as a base, but you can add onto it like so:

```yaml
eclint:
  ignore:
    - "a/**"
    - b
```

## Versioning

This project uses [Semver](http://semver.org).

## Licensing

This project is licensed under the [MPL-2.0](LICENSE) license.

Any contributions made to this project are made under the current license.

## Contributions

Current list of [Contributors](https://github.com/forthright/vile-eclint/graphs/contributors).

Any contributions are welcome and appreciated!

All you need to do is submit a [Pull Request](https://github.com/forthright/vile-eclint/pulls).

1. Please consider tests and code quality before submitting.
2. Please try to keep commits clean, atomic and well explained (for others).

### Issues

Current issue tracker is on [GitHub](https://github.com/forthright/vile-eclint/issues).

Even if you are uncomfortable with code, an issue or question is welcome.

### Code Of Conduct

By participating in this project you agree to our [Code of Conduct](CODE_OF_CONDUCT.md).

### Maintainers

- Brent Lintner - [@brentlintner](http://github.com/brentlintner)


## Developing

    cd vile-eclint
    npm install
    npm test
