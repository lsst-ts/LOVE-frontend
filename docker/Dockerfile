FROM node:lts as builder

WORKDIR /usr/src/love

# Install and cache app dependencies
COPY love/package.json .
COPY love/yarn.lock .
RUN yarn install

# Copy source code
COPY love .

# Build static files
RUN yarn build

# copy compiled files to smaller image
FROM alpine:3.8
COPY --from=builder /usr/src/love/build /usr/src/love
VOLUME /usr/src/love
