# LOVE-frontend

This repository contains the code of the LOVE-frontend application, that provides the user interface of the LOVE project.

See the documentation here: https://lsst-ts.github.io/LOVE-frontend/html/index.html

## 1. Use as part of the LOVE system
In order to use the LOVE-frontend as part of the LOVE system we recommend to use the docker-compose and configuration files provided in the [LOVE-integration-tools](https://github.com/lsst-ts/LOVE-integration-tools) repo. Please follow the instructions there.

## 2. Local load for development
We provide a docker image and a docker-compose file in order to load the LOVE-frontend locally for development purposes, i.e. run tests and build documentation.

This docker-compose does not copy the code into the image, but instead it mounts the repository inside the image, this way you can edit the code from outside the docker container with no need to rebuild or restart.

### 2.1 Load and get into the docker image
Follow these instructions to run the application in a docker container and get into it:

1. Launch and get into the container:
```
docker-compose up -d
docker-exec frontend sh
```

### 2.2 Run tests
Once inside the container you can run the tests as follows:
```
yarn test
```

### 2.3 Build documentation
Once inside the container you can build the documentation as follows:
```
yarn guide:build
```

If rather than build you want to launch a development server for the documentation, you can do so as follows:
```
yarn guide:start
```
