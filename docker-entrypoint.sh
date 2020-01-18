#!/bin/sh -xe

echo "Wait 10 seconds for database container"
sleep 10

DATABASE_URL=postgres://postgres:postgres@sctm-database:5432/sctm yarn migrate up

yarn start:prod
