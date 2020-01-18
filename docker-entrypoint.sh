#!/bin/bash

DATABASE_URL=postgres://postgres:postgres@sctm-database:5433/sctm yarn migrate up
