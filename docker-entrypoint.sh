#!/bin/bash -xe

echo Hello World

sleep 10
DATABASE_URL=postgres://postgres:postgres@sctm-database:5433/sctm yarn migrate up

yarn start:prod
