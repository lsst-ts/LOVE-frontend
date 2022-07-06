FROM node:16.13.2-alpine as builder

WORKDIR /usr/src/love

# Install and cache app dependencies
COPY love/package.json .
COPY love/yarn.lock .
RUN yarn install

# Copy source code and build static files
COPY love .
RUN yarn build

# copy compiled files to smaller image
FROM alpine:3.8
COPY --from=builder /usr/src/love/build /usr/src/love
COPY --from=builder /usr/src/love/build /usr/src/love-build
VOLUME /usr/src/love
