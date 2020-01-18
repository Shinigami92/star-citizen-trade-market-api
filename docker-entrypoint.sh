#!/bin/sh -xe

echo "Wait 10 seconds for database container"
sleep 10

yarn migrate up

yarn start:prod
