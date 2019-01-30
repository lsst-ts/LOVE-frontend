FROM node:10.15-alpine as builder

WORKDIR /usr/src/love

# Add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/love/node_modules/.bin:$PATH

# Install and cache app dependencies
RUN npm install react-scripts@1.1.1 -g --silent
COPY love/package.json .
COPY love/package-lock.json .
COPY love/yarn.lock .
RUN npm install

# Define url for the websockets host
ARG WEBSOCKET_HOST=127.0.0.1

# Copy source code and build static files
COPY love .
RUN REACT_APP_WEBSOCKET_HOST=$WEBSOCKET_HOST npm run build

# copy compiled files to smaller image
FROM alpine:3.8
COPY --from=builder /usr/src/love/build /usr/src/love
VOLUME /usr/src/love
