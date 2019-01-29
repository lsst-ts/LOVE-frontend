FROM node:10.13-stretch

# set working directory
RUN mkdir -p /home/docker/love

WORKDIR /home/docker/love

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /home/docker/love/node_modules/.bin:$PATH

# install and cache app dependencies
RUN npm install react-scripts@1.1.1 -g --silent

COPY ./love/package.json /home/docker/love/package.json
COPY ./love/package-lock.json /home/docker/love/package-lock.json
COPY ./love/yarn.lock /home/docker/love/yarn.lock

RUN npm install

COPY ./love /home/docker/love/

COPY ./entrypoint.sh /home/docker/entrypoint.sh

ARG WEBSOCKET_HOST=127.0.0.1

RUN REACT_APP_WEBSOCKET_HOST=$WEBSOCKET_HOST npm run build-django

WORKDIR /home/docker/love/build

RUN mkdir -p /home/LOVE/manager/manager/assets

CMD ["/home/docker/entrypoint.sh"]
