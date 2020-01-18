FROM node:12-alpine as build

RUN apk --no-cache add --virtual native-deps \
	g++ gcc libgcc libstdc++ linux-headers \
	autoconf automake make nasm python git
RUN yarn global add node-gyp

WORKDIR /build

COPY . .
RUN ls -la
RUN yarn

FROM node:12-alpine
LABEL maintainer="chrissi92@hotmail.de"
WORKDIR /usr/src/app

COPY --from=build /build .
RUN ls -la
RUN mv ./docker-entrypoint.sh /docker-entrypoint.sh
RUN yarn build
RUN chmod +x /docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD [ "yarn", "start:prod" ]
