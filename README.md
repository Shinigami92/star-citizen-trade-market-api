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
$ npm run start

# watch mode
$ npm run start:dev

# incremental rebuild (webpack)
$ npm run webpack
$ npm run start:hmr

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

[MIT licensed](LICENSE)
