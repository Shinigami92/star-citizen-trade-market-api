FROM node:12-alpine as build

RUN apk --no-cache add --virtual native-deps \
	g++ gcc libgcc libstdc++ linux-headers \
	autoconf automake make nasm python git
RUN yarn global add node-gyp

WORKDIR /build

COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

FROM node:12-alpine
LABEL maintainer="chrissi92@hotmail.de"
WORKDIR /usr/src/app

COPY --from=build /build .
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/usr/src/app/docker-entrypoint.sh"]
