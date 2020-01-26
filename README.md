# Star Citizen Trade Market - API

<p align="center">
  <a href="https://robertsspaceindustries.com" target="_blank"><img src="https://robertsspaceindustries.com/rsi/static/css/common/svg/cig/logo-star-citizen--fullcolor.svg" width="320" alt="Star Citizen Logo" /></a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> API for Star Citizen to track the market with the help of the community.</p>

## Frontend

- <a href="https://github.com/Shinigami92/star-citizen-trade-market-frontend" target="_blank">Repository</a>
- <a href="https://shinigami92.github.io/star-citizen-trade-market-frontend" target="_blank">Website</a>

## Discord

[![Discord Chat](https://img.shields.io/discord/522792182256500766.svg)](https://discord.gg/FxJmUYT)

## Why dont you use <a href="https://www.versemate.com" target="_blank">VerseMate</a>?

I really like VerseMate!
However, there are a few things that VerseMate (currently) does not support

This API and the associated frontend has the following advantages:

- Community-based _the data is not read from the game_
- API _frontend is completely decoupled from the API_
- Open Source _everyone can contribute_
- You can provide item prices to your main organization or make them available to all your organizations

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

## Local setup with docker

```bash
$ docker network create sctm-net
$ docker-compose up
```

Now you can connect into the database via pgadmin localhost:5433
Also you can fetch the api via localhost:3000/graphql

### Docker Cleanup

```bash
$ docker rm SCTM_API
$ docker rmi star-citizen-trade-market-api_sctm-api
$ docker rm SCTM_PostgreSQL
```

## License

[MIT licensed](LICENSE)
