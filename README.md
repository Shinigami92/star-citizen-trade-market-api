<p align="center">
  <a href="https://robertsspaceindustries.com" target="blank"><img src="https://robertsspaceindustries.com/rsi/static/css/common/svg/cig/logo-star-citizen--fullcolor.svg" width="320" alt="Star Citizen Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest

<p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> API for Star Citizen to track the market with the help of the community.</p>

## Installation

```bash
$ yarn
```

## Init database

```bash
$ yarn migrate up
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# incremental rebuild (webpack)
$ yarn webpack
$ yarn start:hmr

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## License

[MIT licensed](LICENSE)
